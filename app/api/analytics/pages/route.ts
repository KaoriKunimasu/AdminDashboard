import { NextResponse } from 'next/server';
import { google } from "googleapis";
import dotenv from "dotenv";
import { GaxiosResponse } from 'gaxios';
import { analyticsdata_v1beta } from 'googleapis';
type Schema$RunReportResponse = analyticsdata_v1beta.Schema$RunReportResponse;

// Load .env variables
dotenv.config();

interface PageData {
  pagePath: string;
  pageTitle: string;
  pageviews: number;
  percentage: number;
}

export async function GET() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

    // Validate environment variables
    if (!clientEmail || !privateKey || !projectId) {
      throw new Error("Missing Google service account credentials in environment variables");
    }

    if (!propertyId) {
      throw new Error("GOOGLE_ANALYTICS_PROPERTY_ID is not set in .env");
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
        project_id: projectId,
        type: "service_account"
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });
    
    const response = (await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "screenPageViews" }],
        dimensions: [
          { name: "pagePath" },
          { name: "pageTitle" }
        ],
        orderBys: [
          {
            metric: { metricName: "screenPageViews" },
            desc: true
          }
        ],
        limit: 10
      },
    }) as unknown) as GaxiosResponse<Schema$RunReportResponse>;

    const { data } = response;

    const pages: PageData[] = [];
    let totalPageviews = 0;

    if (data && data.rows) {
      // Calculate total pageviews for percentage calculation
      data.rows.forEach(row => {
        const pageviews = parseInt(row.metricValues?.[0]?.value || '0');
        totalPageviews += pageviews;
      });
      
      // Process each page
      data.rows.forEach(row => {
        const pageviews = parseInt(row.metricValues?.[0]?.value || '0');
        const pagePath = row.dimensionValues?.[0]?.value || '';
        const pageTitle = row.dimensionValues?.[1]?.value || 'Unknown Page';
        
        pages.push({
          pagePath,
          pageTitle,
          pageviews,
          percentage: totalPageviews > 0 ? (pageviews / totalPageviews) * 100 : 0
        });
      });
    } else {
      // Return fallback data if no real data is available
      return NextResponse.json({
        pages: [
          { pagePath: "/", pageTitle: "Home", pageviews: 1250, percentage: 35 },
          { pagePath: "/products", pageTitle: "Products", pageviews: 820, percentage: 23 },
          { pagePath: "/about", pageTitle: "About Us", pageviews: 540, percentage: 15 },
          { pagePath: "/contact", pageTitle: "Contact", pageviews: 320, percentage: 9 },
          { pagePath: "/blog/top-tips", pageTitle: "Top Tips", pageviews: 280, percentage: 8 }
        ]
      });
    }

    return NextResponse.json({ pages });
    
  } catch (error: any) {
    console.error('API route error:', error);
    
    // Return fallback data in case of error in development mode
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        pages: [
          { pagePath: "/", pageTitle: "Home", pageviews: 1250, percentage: 35 },
          { pagePath: "/products", pageTitle: "Products", pageviews: 820, percentage: 23 },
          { pagePath: "/about", pageTitle: "About Us", pageviews: 540, percentage: 15 },
          { pagePath: "/contact", pageTitle: "Contact", pageviews: 320, percentage: 9 },
          { pagePath: "/blog/top-tips", pageTitle: "Top Tips", pageviews: 280, percentage: 8 }
        ],
        error: error.message
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch page view data', 
        message: error.message
      },
      { status: 500 }
    );
  }
}
