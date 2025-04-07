import { NextResponse } from 'next/server';
import { google } from "googleapis";
import { GaxiosResponse } from 'gaxios';
import { analyticsdata_v1beta } from 'googleapis';
import dotenv from "dotenv";

type Schema$RunReportResponse = analyticsdata_v1beta.Schema$RunReportResponse;

dotenv.config();

interface AcquisitionData {
  source: string;
  users: number;
  percentage: number;
  color: string;
}

const sourceColors: { [key: string]: string } = {
  "organic_search": "#4ade80",
  "direct": "#60a5fa",
  "social": "#f472b6",
  "referral": "#fbbf24",
  "email": "#a78bfa",
  "paid_search": "#f97316",
  "(other)": "#94a3b8"
};

export async function GET() {
  try {
    
    // Get and validate environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

    if (!clientEmail || !privateKey || !projectId || !propertyId) {
      throw new Error("Missing required environment variables");
    }

    console.log("Credential validation:", {
      clientEmail: clientEmail.substring(0, 5) + "..." + clientEmail.substring(clientEmail.length - 5),
      privateKeyLength: privateKey.length,
      projectId: projectId,
      propertyId: propertyId
    });

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
        project_id: projectId,
        type: "service_account"
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    // Initialize the Analytics Data API client
    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    
    // Create the property parameter in the correct format
    const propertyParam = `properties/${propertyId}`;
    console.log("Using property parameter:", propertyParam);
    
    let response;

    // Try first with sessionDefaultChannelGroup
    try {
      response = await analyticsData.properties.runReport({
        property: propertyParam, // CORRECTED: Use 'property' instead of 'name'
        requestBody: {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "totalUsers" }],
          orderBys: [
            {
              metric: { metricName: "totalUsers" },
              desc: true
            }
          ],
          limit: 6
        },
      });
      
      console.log("GA API Response status:", response.status);
      
      // If no data, throw to try the fallback
      if (!response.data.rows || response.data.rows.length === 0) {
        throw new Error("No rows returned from sessionDefaultChannelGroup");
      }
    } catch (channelError) {
      console.log("Falling back to sessionSource dimension:", channelError.message);
      
      // Fall back to sessionSource
      response = await analyticsData.properties.runReport({
        property: propertyParam, // CORRECTED: Use 'property' instead of 'name'
        requestBody: {
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "totalUsers" }],
          orderBys: [
            {
              metric: { metricName: "totalUsers" },
              desc: true
            }
          ],
          limit: 6
        },
      });
      
      console.log("Fallback GA API Response status:", response.status);
    }

    const { data } = response;
    console.log("Response data received:", !!data);
    
    let sources: AcquisitionData[] = [];
    let totalUsers = 0;

    if (data?.rows && data.rows.length > 0) {
      console.log("Processing GA data rows:", data.rows.length);
      
      // Calculate total users
      totalUsers = data.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
      }, 0);

      // Process each source
      sources = data.rows.map(row => {
        const source = row.dimensionValues?.[0]?.value || '(other)';
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        const percentage = totalUsers > 0 ? (users / totalUsers) * 100 : 0;

        // Format source name
        const formattedSource = source
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          source: formattedSource,
          users,
          percentage: Math.round(percentage),
          color: sourceColors[source.toLowerCase()] || sourceColors['(other)']
        };
      });
      
      console.log("Processed sources count:", sources.length);
    } else {
      console.log("No rows returned from Google Analytics API");
    }

    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error("Error fetching acquisition data:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch acquisition data', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}
