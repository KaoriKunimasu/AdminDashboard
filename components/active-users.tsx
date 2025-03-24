"use client";
import { useState, useEffect } from "react";

interface GADataRow {
  dimensionValues: {
    value: string;
  }[];
  metricValues: {
    value: string;
  }[];
}

interface AnalyticsResponse {
  rows?: GADataRow[];
  error?: string;
}

interface UserData {
  date: string;
  month: string;
  activeUsers: number;
  newUsers?: number;
}

interface HoveredPoint extends UserData {
  x: number;
  y: number;
}

export default function ActiveUsers() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);

  // Format date from YYYYMMDD to readable format
  const formatDate = (dateString: string): string => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get short month name from date
  const getMonth = (dateString: string): string => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        const data: AnalyticsResponse = await response.json();
        
        console.log("Analytics data received:", data);
        
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.rows || data.rows.length === 0) {
          console.log("No rows found in analytics data");
          setUserData([]);
          setLoading(false);
          return;
        }

        // Transform Google Analytics data into our format
        const transformed: UserData[] = data.rows.map(row => {
          const dateValue = row.dimensionValues[0]?.value || '';
          const activeUsers = parseInt(row.metricValues[0]?.value || '0');
          const newUsers = parseInt(row.metricValues[1]?.value || '0');
          
          console.log(`Date: ${dateValue}, Active: ${activeUsers}, New: ${newUsers}`);
          
          return {
            date: dateValue,
            month: getMonth(dateValue),
            activeUsers: activeUsers,
            newUsers: newUsers
          };
        });

        console.log("Transformed data:", transformed);
        setUserData(transformed);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data");
        // Set fallback data if API fails
        setUserData([
          { date: "20230307", month: "Mar", activeUsers: 4000, newUsers: 2500 },
          { date: "20230308", month: "Mar", activeUsers: 3000, newUsers: 1500 },
          { date: "20230309", month: "Mar", activeUsers: 2000, newUsers: 1000 },
          { date: "20230310", month: "Mar", activeUsers: 2800, newUsers: 1400 },
          { date: "20230311", month: "Mar", activeUsers: 3200, newUsers: 1600 },
          { date: "20230312", month: "Mar", activeUsers: 3500, newUsers: 1800 },
          { date: "20230313", month: "Mar", activeUsers: 4000, newUsers: 2000 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Find the maximum value to scale the chart
  const maxActiveUsers = userData.length > 0 
    ? Math.max(...userData.map(d => d.activeUsers)) 
    : 10000;
  
  const maxNewUsers = userData.length > 0 
    ? Math.max(...userData.map(d => d.newUsers || 0)) 
    : 5000;

  const maxValue = Math.max(maxActiveUsers, maxNewUsers) * 1.2; // Add 20% padding

  const getTooltipPosition = (x: number, y: number) => {
    const isNearRight = x > 800;
    const isNearTop = y < 100;

    return {
      x: isNearRight ? x - 200 : x + 10,
      y: isNearTop ? y + 20 : y - 80,
    };
  };

  // Create points for smooth curve
  const createSmoothPath = (data: UserData[], key: keyof UserData) => {
    if (data.length === 0) return "";
    
    const points = data.map((d, i) => ({
      x: i * (1000 / (data.length - 1)),
      y: 400 - ((d[key] as number) / maxValue) * 400,
    }));

    return points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;

      const prevPoint = points[i - 1];
      const controlPoint1X = prevPoint.x + (point.x - prevPoint.x) / 3;
      const controlPoint2X = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;

      return `${path} C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  };

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Calculate y-axis labels
  const yAxisLabels = [
    formatNumber(maxValue),
    formatNumber(maxValue * 0.75),
    formatNumber(maxValue * 0.5),
    formatNumber(maxValue * 0.25),
    "0"
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 flex items-center justify-center h-[300px]">
        <div className="text-gray-500">Loading analytics data...</div>
      </div>
    );
  }

  if (error && userData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[#151d48] mb-4">Active Users</h2>
        <div className="text-red-500 p-4">Error loading analytics data: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Active Users</h2>
      
      {error && (
        <div className="text-orange-500 text-xs mb-2">
          Note: Showing fallback data. {error}
        </div>
      )}

      <div className="h-[200px] md:h-[250px] relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div key={i} className="h-px bg-gray-100 w-full"></div>
          ))}
        </div>

        {/* Chart */}
        <div className="absolute inset-0 overflow-visible">
          <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Vertical grid lines */}
            {userData.map((_, i) => (
              <line
                key={`grid-${i}`}
                x1={i * (1000 / (userData.length - 1))}
                y1={0}
                x2={i * (1000 / (userData.length - 1))}
                y2={400}
                stroke="#f1f1f1"
                strokeWidth="1"
              />
            ))}

            {/* Active Users line */}
            <path d={createSmoothPath(userData, "activeUsers")} fill="none" stroke="#5d5fef" strokeWidth="3" />
            {userData.map((d, i) => (
              <circle
                key={`active-${i}`}
                cx={i * (1000 / (userData.length - 1))}
                cy={400 - (d.activeUsers / maxValue) * 400}
                r="6"
                fill="#5d5fef"
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    ...d,
                    x: i * (1000 / (userData.length - 1)),
                    y: 400 - (d.activeUsers / maxValue) * 400,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* New Users line */}
            {userData[0]?.newUsers !== undefined && (
              <>
                <path d={createSmoothPath(userData, "newUsers")} fill="none" stroke="#bf83ff" strokeWidth="3" />
                {userData.map((d, i) => (
                  <circle
                    key={`new-${i}`}
                    cx={i * (1000 / (userData.length - 1))}
                    cy={400 - ((d.newUsers || 0) / maxValue) * 400}
                    r="6"
                    fill="#bf83ff"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        ...d,
                        x: i * (1000 / (userData.length - 1)),
                        y: 400 - ((d.newUsers || 0) / maxValue) * 400,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}

            {/* Hover line and tooltip */}
            {hoveredPoint && (
              <>
                <line
                  x1={hoveredPoint.x}
                  y1={0}
                  x2={hoveredPoint.x}
                  y2={400}
                  stroke="#151d48"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <g
                  transform={`translate(${getTooltipPosition(hoveredPoint.x, hoveredPoint.y).x}, ${getTooltipPosition(hoveredPoint.x, hoveredPoint.y).y})`}
                >
                  <rect x={0} y={0} width="200" height="80" fill="#151d48" rx="4" className="drop-shadow-lg" />
                  <text x={10} y={25} fill="white" fontSize="14" fontWeight="bold">
                    {formatDate(hoveredPoint.date)}
                  </text>
                  <text x={10} y={50} fill="#5d5fef" fontSize="14">
                    Active Users: {hoveredPoint.activeUsers.toLocaleString()}
                  </text>
                  {hoveredPoint.newUsers !== undefined && (
                    <text x={10} y={70} fill="#bf83ff" fontSize="14">
                      New Users: {hoveredPoint.newUsers.toLocaleString()}
                    </text>
                  )}
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-[#737791] -translate-x-6">
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className={`grid mt-2`} style={{ gridTemplateColumns: `repeat(${userData.length}, 1fr)` }}>
        {userData.map((d) => (
          <div key={d.date} className="text-[10px] text-[#737791] text-center">
            {formatDate(d.date)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center gap-2 mr-4 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#5d5fef]"></div>
          <span className="text-xs text-[#737791]">Active Users</span>
        </div>
        {userData[0]?.newUsers !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#bf83ff]"></div>
            <span className="text-xs text-[#737791]">New Users</span>
          </div>
        )}
      </div>
    </div>
  );
}