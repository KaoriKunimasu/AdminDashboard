import { NextResponse } from 'next/server';
import { google } from "googleapis";
import { analyticsdata_v1beta } from 'googleapis';
import dotenv from "dotenv";


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
    
    const propertyParam = `properties/${propertyId}`;
    
    let response;

    try {
      response = await analyticsData.properties.runReport({
        property: propertyParam,
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
      
      if (!response.data.rows || response.data.rows.length === 0) {
        throw new Error("No rows returned from sessionDefaultChannelGroup");
      }
    } catch (channelError) {
      response = await analyticsData.properties.runReport({
        property: propertyParam,
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
    }

    const { data } = response;
    let sources: AcquisitionData[] = [];
    let totalUsers = 0;

    if (data?.rows && data.rows.length > 0) {
      totalUsers = data.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
      }, 0);

      sources = data.rows.map(row => {
        const source = row.dimensionValues?.[0]?.value || '(other)';
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        const percentage = totalUsers > 0 ? (users / totalUsers) * 100 : 0;

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
    }

    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error("Error fetching acquisition data:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch acquisition data', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}
