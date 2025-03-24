import { NextResponse } from 'next/server';
import { google } from "googleapis";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

export async function GET() {
  try {
    const data = await fetchAnalyticsData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fetch analytics data with proper structure for all components
async function fetchAnalyticsData() {
  try {
    // Get credentials from environment variables
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

    // Create auth directly from environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),  // Fix newlines if needed
        project_id: projectId,
        type: "service_account"
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    // 1. Fetch daily active and new users for the Active Users chart
    const dailyUsersResponse = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
        ],
        dimensions: [{ name: "date" }],
        orderBys: [{ dimension: { dimensionName: "date" } }]
      },
    });

    // 2. Fetch overall metrics for Today's Analytics cards
    const overallMetricsResponse = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          { startDate: "7daysAgo", endDate: "today" },      // Current period
          { startDate: "14daysAgo", endDate: "8daysAgo" }   // Previous period for comparison
        ],
        metrics: [
          { name: "totalUsers" },
          { name: "activeUsers" },
          { name: "userEngagementDuration" },
          { name: "sessions" },
          { name: "conversions" }  // For transactions, if available
        ]
      },
    });

    // 3. Fetch engagement rate metrics
    const engagementResponse = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          { startDate: "30daysAgo", endDate: "today" },
          { startDate: "60daysAgo", endDate: "31daysAgo" } // Previous period for comparison
        ],
        metrics: [
          { name: "engagementRate" }
        ],
      },
    });

    // Process metrics for TodaySales component
    const processedMetrics = processOverallMetrics(overallMetricsResponse.data);

    // Return data structured for all components
    return {
      // For ActiveUsers component
      rows: dailyUsersResponse.data.rows?.map(row => ({
        dimensionValues: [{ value: row.dimensionValues?.[0]?.value || '' }],
        metricValues: [
          { value: row.metricValues?.[0]?.value || '0' },  // activeUsers
          { value: row.metricValues?.[1]?.value || '0' }   // newUsers
        ]
      })),
      
      // For TodaySales component
      userMetrics: {
        rows: processedMetrics
      },
      
      // For EngagementRate component
      engagementMetrics: engagementResponse.data,
      
      // Include raw data for debugging
      rawDailyUsers: dailyUsersResponse.data,
      rawOverallMetrics: overallMetricsResponse.data,
      rawEngagementMetrics: engagementResponse.data
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}

// Helper function to process overall metrics for TodaySales component
function processOverallMetrics(data: any) {
  if (!data || !data.rows || data.rows.length === 0) {
    return [];
  }

  const currentPeriod = data.rows[0];
  const previousPeriod = data.rows[1];

  // Extract metrics
  const totalUsers = parseInt(currentPeriod?.metricValues?.[0]?.value || '0');
  const activeUsers = parseInt(currentPeriod?.metricValues?.[1]?.value || '0');
  const engagementDuration = parseFloat(currentPeriod?.metricValues?.[2]?.value || '0');
  const sessions = parseInt(currentPeriod?.metricValues?.[3]?.value || '0');
  const transactions = parseInt(currentPeriod?.metricValues?.[4]?.value || '0');

  // Calculate average session duration
  const avgSessionDuration = sessions > 0 ? engagementDuration / sessions : 0;

  // Previous period metrics
  const prevTotalUsers = parseInt(previousPeriod?.metricValues?.[0]?.value || '0');
  const prevActiveUsers = parseInt(previousPeriod?.metricValues?.[1]?.value || '0');
  const prevEngagementDuration = parseFloat(previousPeriod?.metricValues?.[2]?.value || '0');
  const prevSessions = parseInt(previousPeriod?.metricValues?.[3]?.value || '0');
  const prevTransactions = parseInt(previousPeriod?.metricValues?.[4]?.value || '0');

  // Calculate previous average session duration
  const prevAvgSessionDuration = prevSessions > 0 ? prevEngagementDuration / prevSessions : 0;

  // Format data for TodaySales component
  return [
    {
      metricValues: [
        { value: totalUsers.toString() },
        { value: prevTotalUsers.toString() }
      ]
    },
    {
      metricValues: [
        { value: activeUsers.toString() },
        { value: prevActiveUsers.toString() }
      ]
    },
    {
      metricValues: [
        { value: avgSessionDuration.toString() },
        { value: prevAvgSessionDuration.toString() }
      ]
    },
    {
      metricValues: [
        { value: transactions.toString() },
        { value: prevTransactions.toString() }
      ]
    }
  ];
}
