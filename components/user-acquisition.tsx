"use client"
import { BarChart } from "lucide-react";
import { useState, useEffect } from "react";

interface AcquisitionData {
  source: string;
  users: number;
  percentage: number;
  color: string;
}

export default function UserAcquisition() {
  const [data, setData] = useState<AcquisitionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching acquisition data from API...");
        const response = await fetch('/api/analytics/acquisition');
        
        // Log response status for debugging
        console.log("API response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Log the result for debugging
        console.log("API response data:", result);

        // Check for API error
        if (result.error) {
          throw new Error(result.message || result.error);
        }

        if (result.sources?.length > 0) {
          console.log("Setting acquisition data:", result.sources);
          setData(result.sources);
        } else {
          console.log("No sources data, using fallback");
          // Fallback data
          setData([
            { source: "Organic Search", users: 2840, percentage: 45, color: "#4ade80" },
            { source: "Direct", users: 1650, percentage: 26, color: "#60a5fa" },
            { source: "Social", users: 1100, percentage: 17, color: "#f472b6" },
            { source: "Referral", users: 750, percentage: 12, color: "#fbbf24" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching acquisition data:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        // Set fallback data on error
        setData([
          { source: "Organic Search", users: 2840, percentage: 45, color: "#4ade80" },
          { source: "Direct", users: 1650, percentage: 26, color: "#60a5fa" },
          { source: "Social", users: 1100, percentage: 17, color: "#f472b6" },
          { source: "Referral", users: 750, percentage: 12, color: "#fbbf24" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#151d48]">User Acquisition</h2>
          <p className="text-sm text-[#737791]">Traffic sources breakdown</p>
        </div>
        <div className="w-10 h-10 bg-[#4ade80] rounded-lg flex items-center justify-center">
          <BarChart size={20} className="text-white" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm">
          <p>Error: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-[#737791]">Loading acquisition data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-[#737791]">No acquisition data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#151d48]">{item.source}</span>
                <span className="text-sm text-[#737791]">
                  {item.users.toLocaleString()} users
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              <p className="text-xs text-[#737791]">{item.percentage}% of total</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}