"use client"
import { useState } from "react"

interface HoverPoint {
  month: string;
  subscribed: number;
  unsubscribed: number;
  repeatSubscribed: number;
  type: string;
  x: number;
  y: number;
}

export default function TotalSubscribers() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const [hoveredPoint, setHoveredPoint] = useState<HoverPoint | null>(null)

  const subscriberData = [
    { month: "Jan", subscribed: 150, unsubscribed: 30, repeatSubscribed: 20 },
    { month: "Feb", subscribed: 180, unsubscribed: 25, repeatSubscribed: 30 },
    { month: "Mar", subscribed: 200, unsubscribed: 40, repeatSubscribed: 35 },
    { month: "Apr", subscribed: 220, unsubscribed: 35, repeatSubscribed: 40 },
    { month: "May", subscribed: 190, unsubscribed: 45, repeatSubscribed: 25 },
    { month: "Jun", subscribed: 210, unsubscribed: 30, repeatSubscribed: 35 },
  ]

  const maxValue = Math.max(...subscriberData.flatMap((d) => [d.subscribed, d.unsubscribed, d.repeatSubscribed]))

const getTooltipPosition = (x: number, y: number): { x: number, y: number } => {
  const isNearRight = x > 800
  const isNearTop = y < 100

  return {
    x: isNearRight ? x - 220 : x + 10,
    y: isNearTop ? y + 20 : y - 100,
  }
}

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Total Number of Subscribers</h2>

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

            {/* Subscribed Users */}
            <path
              d={subscriberData
                .map((d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - (d.subscribed / maxValue) * 400}`)
                .join(" ")}
              fill="none"
              stroke="#bf83ff"
              strokeWidth="3"
            />
            {subscriberData.map((d, i) => (
              <circle
                key={`subscribed-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - (d.subscribed / maxValue) * 400}
                r="6"
                fill="#bf83ff"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    ...d,
                    type: "Subscribed",
                    x: i * (1000 / 5),
                    y: 400 - (d.subscribed / maxValue) * 400,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Unsubscribed Users */}
            <path
              d={subscriberData
                .map((d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - (d.unsubscribed / maxValue) * 400}`)
                .join(" ")}
              fill="none"
              stroke="#eb5757"
              strokeWidth="3"
            />
            {subscriberData.map((d, i) => (
              <circle
                key={`unsubscribed-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - (d.unsubscribed / maxValue) * 400}
                r="6"
                fill="#eb5757"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    ...d,
                    type: "Unsubscribed",
                    x: i * (1000 / 5),
                    y: 400 - (d.unsubscribed / maxValue) * 400,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Repeat Subscribed */}
            <path
              d={subscriberData
                .map(
                  (d, i) => `${i === 0 ? "M" : "L"} ${i * (1000 / 5)} ${400 - (d.repeatSubscribed / maxValue) * 400}`,
                )
                .join(" ")}
              fill="none"
              stroke="#00e096"
              strokeWidth="3"
            />
            {subscriberData.map((d, i) => (
              <circle
                key={`repeat-${i}`}
                cx={i * (1000 / 5)}
                cy={400 - (d.repeatSubscribed / maxValue) * 400}
                r="6"
                fill="#00e096"
                className="cursor-pointer hover:r-8 transition-all"
                onMouseEnter={() =>
                  setHoveredPoint({
                    ...d,
                    type: "Repeat Subscribed",
                    x: i * (1000 / 5),
                    y: 400 - (d.repeatSubscribed / maxValue) * 400,
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
                    {hoveredPoint.month} - {hoveredPoint.type}
                  </text>
                  <text x={10} y={55} fill="white" fontSize="14">
                    Subscribed: {hoveredPoint.subscribed}
                  </text>
                  <text x={10} y={75} fill="white" fontSize="14">
                    Unsubscribed: {hoveredPoint.unsubscribed}
                  </text>
                  <text x={10} y={95} fill="white" fontSize="14">
                    Repeat Subscribed: {hoveredPoint.repeatSubscribed}
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] text-[#737791] -translate-x-6">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="grid grid-cols-6 mt-2">
        {months.map((month) => (
          <div key={month} className="text-[9px] text-[#737791] text-center">
            {month}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center gap-2 mr-4 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#bf83ff]"></div>
          <span className="text-xs text-[#737791]">Subscribed</span>
        </div>
        <div className="flex items-center gap-2 mr-4 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#eb5757]"></div>
          <span className="text-xs text-[#737791]">Unsubscribed</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
          <span className="text-xs text-[#737791]">Repeat Subscribed</span>
        </div>
      </div>
    </div>
  )
}

