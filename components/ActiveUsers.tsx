"use client";
import { useState, useEffect } from "react";

interface DailyData {
  date: string;
  activeUsers: number;
}

interface GARow {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

export default function ActiveUsers() {
  const [userData, setUserData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/analytics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const data = await response.json();
        
        // Check if we have user metrics data from GA
        if (data.userMetrics?.rows) {
          // Process the data from Google Analytics
          const processedData = data.userMetrics.rows.map((row: GARow) => ({
            date: formatDate(row.dimensionValues[0].value),
            activeUsers: parseInt(row.metricValues[0].value),
            newUsers: parseInt(row.metricValues[1]?.value ?? '0')
          }));
          
          setUserData(processedData);
        } else {
          // Fallback to sample data if no data available
          setUserData(getSampleData());
        }
      } catch (err: unknown) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        // Fallback to sample data
        setUserData(getSampleData());
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, []);
  
  // Format date from YYYYMMDD to more readable format
  function formatDate(gaDate: string): string {
    if (gaDate.length !== 8) return gaDate;
    
    const year = gaDate.substring(0, 4);
    const month = gaDate.substring(4, 6);
    const day = gaDate.substring(6, 8);
    
    return `${month}/${day}`;
  }
  
  // Get sample data as fallback
  function getSampleData(): DailyData[] {
    return [
      { date: "04/01", activeUsers: 120 },
      { date: "04/02", activeUsers: 145 },
      { date: "04/03", activeUsers: 160 },
      { date: "04/04", activeUsers: 175 },
      { date: "04/05", activeUsers: 150 },
      { date: "04/06", activeUsers: 165 },
      { date: "04/07", activeUsers: 180 },
    ];
  }
  
  // Get data for display based on selected range
  const displayData = dateRange === "weekly" 
    ? userData.slice(-7) // Last 7 days
    : userData; // All available data (up to 30 days)
  
  // Calculate max value for scaling
  const maxValue = displayData.length > 0
    ? Math.max(...displayData.map(item => item.activeUsers))
    : 100;
  
  // Calculate scaling factor to ensure bars fit in the container
  const scaleFactor = 100 / maxValue;

  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#151d48]">Active Users</h2>
        
        {/* Toggle between weekly and monthly view */}
        <div className="flex text-sm">
          <button 
            className={`px-3 py-1 rounded-l-md ${dateRange === "weekly" 
              ? "bg-[#5d5fef] text-white" 
              : "bg-gray-100 text-[#737791]"}`}
            onClick={() => setDateRange("weekly")}
          >
            Weekly
          </button>
          <button 
            className={`px-3 py-1 rounded-r-md ${dateRange === "monthly" 
              ? "bg-[#5d5fef] text-white" 
              : "bg-gray-100 text-[#737791]"}`}
            onClick={() => setDateRange("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-[#737791]">Loading user data...</p>
        </div>
      ) : error ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <>
          <div className="h-[200px] flex items-end space-x-1 md:space-x-2 relative">
            {/* Y-axis label (optional) */}
            <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-[10px] text-[#737791] opacity-70">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue/2)}</span>
              <span>0</span>
            </div>
            
            {/* Bar chart with actual data */}
            {displayData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-[#5d5fef] hover:bg-[#4a4cdb] transition-colors rounded-t-sm relative group"
                  style={{ height: `${item.activeUsers * scaleFactor}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-[#151d48] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                    {item.activeUsers.toLocaleString()} users
                  </div>
                </div>
                <span className="text-[10px] text-[#737791] mt-1">{item.date}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-[#737791]">
              {dateRange === "weekly" ? "Last 7 days" : "Last 30 days"}
            </p>
            
            {/* Total users summary */}
            <div className="text-right">
              <p className="text-lg font-semibold text-[#151d48]">
                {displayData.reduce((sum, item) => sum + item.activeUsers, 0).toLocaleString()}
              </p>
              <p className="text-xs text-[#737791]">Total active users</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
