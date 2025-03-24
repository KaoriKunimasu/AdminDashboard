import { NextResponse } from 'next/server';
import { google } from "googleapis";
import { GaxiosResponse } from 'gaxios';
import { analyticsdata_v1beta } from 'googleapis';
import dotenv from "dotenv";

type Schema$RunReportResponse = analyticsdata_v1beta.Schema$RunReportResponse;

dotenv.config();

interface GeoData {
  country: string;
  countryCode: string;
  users: number;
  percentage: number;
}

export async function GET() {
  try {
    console.log("Fetching geographical data from Google Analytics...");
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

    if (!clientEmail || !privateKey || !projectId || !propertyId) {
      throw new Error("Missing required environment variables");
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
        dimensions: [
          { name: "country" },
          { name: "countryId" }
        ],
        metrics: [{ name: "totalUsers" }],
        orderBys: [
          {
            metric: { metricName: "totalUsers" },
            desc: true
          }
        ]
      },
    }) as unknown) as GaxiosResponse<Schema$RunReportResponse>;

    const { data } = response;
    let countries: GeoData[] = [];
    let totalUsers = 0;

    if (data?.rows) {
      // Calculate total users
      totalUsers = data.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
      }, 0);

      // Process each country
      countries = data.rows.map(row => {
        const country = row.dimensionValues?.[0]?.value || 'Unknown';
        const countryCode = row.dimensionValues?.[1]?.value || '';
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        const percentage = totalUsers > 0 ? Math.round((users / totalUsers) * 100 * 10) / 10 : 0;

        return {
          country,
          countryCode,
          users,
          percentage
        };
      });
    }

    return NextResponse.json({ countries });
  } catch (error: any) {
    console.error("Error fetching geographical data:", error);
    return NextResponse.json(
      { error: 'Failed to fetch geographical data', message: error.message },
      { status: 500 }
    );
  }
} 