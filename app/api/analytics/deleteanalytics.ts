import { google } from "googleapis";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

export async function fetchAnalyticsData() {
  try {
    // Check for required environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

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
        private_key: privateKey,
        project_id: projectId,
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
        ],
        dimensions: [{ name: "date" }],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}
