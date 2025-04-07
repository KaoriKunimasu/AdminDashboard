import { NextResponse } from 'next/server';
import { google } from "googleapis";
import { analyticsdata_v1beta } from 'googleapis';
import dotenv from "dotenv";


dotenv.config();

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

export async function GET() {
  try {
    console.log("Fetching device data from Google Analytics...");
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

    if (!clientEmail || !privateKey || !projectId || !propertyId) {
      console.error("Missing environment variables");
      throw new Error("Missing required environment variables");
    }

    console.log("Credentials validated for device analytics");

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

    console.log("Making request to Google Analytics API for device data...");
    
    // Create the property parameter in the correct format
    const propertyParam = `properties/${propertyId}`;
    
    // CRITICAL FIX: Change 'parent' to 'property' in the API request
    const response = await analyticsData.properties.runReport({
      property: propertyParam, // FIXED: Changed from 'parent' to 'property'
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [
          {
            metric: { metricName: "totalUsers" },
            desc: true
          }
        ]
      },
    });

    console.log("Device data response received, status:", response.status);

    const { data } = response;
    let devices: DeviceData[] = [];
    let totalUsers = 0;

    if (data?.rows && data.rows.length > 0) {
      console.log("Processing device data rows:", data.rows.length);
      
      // Calculate total users
      totalUsers = data.rows.reduce((sum, row) => {
        return sum + parseInt(row.metricValues?.[0]?.value || '0');
      }, 0);

      // Process each device category
      devices = data.rows.map(row => {
        const device = row.dimensionValues?.[0]?.value?.toLowerCase() || 'other';
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        const percentage = totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0;

        // Map to one of the three expected device types if needed
        let normalizedDevice = device;
        if (!['desktop', 'mobile', 'tablet'].includes(device)) {
          if (device.includes('phone') || device.includes('mobile')) {
            normalizedDevice = 'mobile';
          } else if (device.includes('tablet')) {
            normalizedDevice = 'tablet';
          } else {
            normalizedDevice = 'desktop'; // Default
          }
        }

        return { device: normalizedDevice, users, percentage };
      });
      
      console.log("Processed device data:", devices);
    } else {
      console.log("No device data rows returned, trying alternative dimension");
      
      // Try alternative dimension if deviceCategory doesn't work
      try {
        const altResponse = await analyticsData.properties.runReport({
          property: propertyParam,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "device" }],  // Alternative dimension
            metrics: [{ name: "totalUsers" }],
            orderBys: [
              {
                metric: { metricName: "totalUsers" },
                desc: true
              }
            ]
          },
        });
        
        const altData = altResponse.data;
        
        if (altData?.rows && altData.rows.length > 0) {
          console.log("Processing alternative device data");
          
          // Group by device categories
          const deviceCounts = {
            mobile: 0,
            desktop: 0,
            tablet: 0
          };
          
          altData.rows.forEach(row => {
            const deviceName = (row.dimensionValues?.[0]?.value || '').toLowerCase();
            const userCount = parseInt(row.metricValues?.[0]?.value || '0');
            
            if (deviceName.includes('mobile') || deviceName.includes('phone')) {
              deviceCounts.mobile += userCount;
            } else if (deviceName.includes('tablet')) {
              deviceCounts.tablet += userCount;
            } else {
              deviceCounts.desktop += userCount;
            }
          });
          
          totalUsers = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
          
          // Convert to array format
          devices = Object.entries(deviceCounts)
            .filter(([_, count]) => count > 0)
            .map(([device, users]) => {
              const percentage = totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0;
              return { device, users, percentage };
            });
        }
      } catch (altError) {
        console.error("Error with alternative device dimension:", altError);
      }
    }

    return NextResponse.json({ devices });
  } catch (error: any) {
    console.error("Error fetching device data:", error);
    
    return NextResponse.json(
      { error: 'Failed to fetch device data', message: error.message },
      { status: 500 }
    );
  }
}
