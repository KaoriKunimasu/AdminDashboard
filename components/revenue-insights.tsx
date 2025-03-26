"use client";
import { useState, useEffect } from "react";

interface RevenueData {
  month: string;
  free: number;
  business: number;
  custom: number;
}

interface HoveredPoint extends RevenueData {
  type: string;
  x: number;
  y: number;
}

export default function RevenueInsights() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch revenue data
  useEffect(() => {
    async function fetchRevenueData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/analytics/revenue');
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const data = await response.json();
        
        const transformedData = data.map((item: any) => ({
          month: item.month,
          free: parseFloat(item.freePlanRevenue) || 0,
          business: parseFloat(item.businessPlanRevenue) || 0,
          custom: parseFloat(item.customPlanRevenue) || 0
        }));
        
        setRevenueData(transformedData);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Could not load revenue data');
        
        // Fallback to sample data if API fails
        setRevenueData([
          { month: "Jan", free: 1000, business: 2000, custom: 3000 },
          { month: "Feb", free: 1200, business: 2200, custom: 3200 },
          { month: "Mar", free: 1100, business: 2400, custom: 3400 },
          { month: "Apr", free: 1300, business: 2600, custom: 3600 },
          { month: "May", free: 1400, business: 2800, custom: 3800 },
          { month: "Jun", free: 1600, business: 3000, custom: 4000 },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRevenueData();
  }, []);

  // Calculate maximum value - only when we have data
  const maxValue = revenueData.length
    ? Math.max(...revenueData.flatMap((d) => [d.free, d.business, d.custom]))
    : 4000; // Default if no data

  const getTooltipPosition = (x: number, y: number) => {
    const isNearRight = x > 800;
    const isNearLeft = x < 200;
    const isNearTop = y < 100;

    return {
      x: isNearRight ? x - 220 : isNearLeft ? x + 10 : x - 110,
      y: isNearTop ? y + 20 : y - 100,
    };
  };

  if (isLoading) return <div className="bg-white rounded-lg p-4 md:p-6 h-[300px] flex items-center justify-center">Loading revenue data...</div>;
  
  if (error) return <div className="bg-white rounded-lg p-4 md:p-6 h-[300px] flex items-center justify-center text-red-500">{error}</div>;

  // Only render the chart on client side to avoid hydration errors
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>
        <div className="h-[200px] md:h-[250px] flex items-center justify-center">
          Loading chart...
        </div>
        <div className="grid grid-cols-6 mt-2">
          {months.map((month) => (
            <div key={month} className="text-[10px] text-[#737791] text-center">
              {month}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="flex items-center gap-2 mr-4 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#ffa412]"></div>
            <span className="text-xs text-[#737791]">Free</span>
          </div>
          <div className="flex items-center gap-2 mr-4 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
            <span className="text-xs text-[#737791]">Business Plan</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#5d5fef]"></div>
            <span className="text-xs text-[#737791]">Customized Solution</span>
          </div>
        </div>
      </div>
    );
  }

  // Full client-side rendered chart
  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>

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
            {months.map((_, i) => (
              <line
                key={`grid-${i}`}
                x1={i * (1000 / 5)}
                y1={0}
                x2={i * (1000 / 5)}
                y2={400}
                stroke="#f1f1f1"
                strokeWidth="1"
              />
            ))}

            {/* Free Plan */}
            <path
              d={revenueData
                .map((d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - ((d.free / maxValue) * 400).toFixed(2)}`)
                .join(" ")}
              fill="none"
              stroke="#ffa412"
              strokeWidth="3"
            />
            {revenueData.map((d, i) => (
              <circle
                key={`free-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - ((d.free / maxValue) * 400).toFixed(2)}
                r="6"
                fill="#ffa412"
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({ 
                    ...d, 
                    type: "Free", 
                    x: i * (1000 / 5), 
                    y: 400 - ((d.free / maxValue) * 400).toFixed(2)
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Business Plan */}
            <path
              d={revenueData
                .map((d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - ((d.business / maxValue) * 400).toFixed(2)}`)
                .join(" ")}
              fill="none"
              stroke="#00e096"
              strokeWidth="3"
            />
            {revenueData.map((d, i) => (
              <circle
                key={`business-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - ((d.business / maxValue) * 400).toFixed(2)}
                r="6"
                fill="#00e096"
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    ...d,
                    type: "Business",
                    x: i * (1000 / 5),
                    y: 400 - ((d.business / maxValue) * 400).toFixed(2),
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Customized Solution */}
            <path
              d={revenueData
                .map((d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - ((d.custom / maxValue) * 400).toFixed(2)}`)
                .join(" ")}
              fill="none"
              stroke="#5d5fef"
              strokeWidth="3"
            />
            {revenueData.map((d, i) => (
              <circle
                key={`custom-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - ((d.custom / maxValue) * 400).toFixed(2)}
                r="6"
                fill="#5d5fef"
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({ 
                    ...d, 
                    type: "Custom", 
                    x: i * (1000 / 5), 
                    y: 400 - ((d.custom / maxValue) * 400).toFixed(2)
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

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
                  <rect x={0} y={0} width="220" height="100" fill="#151d48" rx="4" className="drop-shadow-lg" />
                  <text x={10} y={30} fill="white" fontSize="16" fontWeight="bold">
                    {hoveredPoint.month} - {hoveredPoint.type} Plan
                  </text>
                  <text x={10} y={55} fill="white" fontSize="14">
                    Free: ${hoveredPoint.free.toLocaleString()}
                  </text>
                  <text x={10} y={75} fill="white" fontSize="14">
                    Business: ${hoveredPoint.business.toLocaleString()}
                  </text>
                  <text x={10} y={95} fill="white" fontSize="14">
                    Custom: ${hoveredPoint.custom.toLocaleString()}
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-[#737791] -translate-x-6">
          <span>${maxValue.toLocaleString()}</span>
          <span>${Math.round(maxValue * 0.75).toLocaleString()}</span>
          <span>${Math.round(maxValue * 0.5).toLocaleString()}</span>
          <span>${Math.round(maxValue * 0.25).toLocaleString()}</span>
          <span>$0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="grid grid-cols-6 mt-2">
        {months.map((month) => (
          <div key={month} className="text-[10px] text-[#737791] text-center">
            {month}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center gap-2 mr-4 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ffa412]"></div>
          <span className="text-xs text-[#737791]">Free</span>
        </div>
        <div className="flex items-center gap-2 mr-4 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
          <span className="text-xs text-[#737791]">Business Plan</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#5d5fef]"></div>
          <span className="text-xs text-[#737791]">Customized Solution</span>
        </div>
      </div>
    </div>
  );
}
