"use client";
import { useState } from "react";

interface RevenueData {
  month: string;
  free: number;
  business: number;
  custom: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    value: number;
    type: string;
    x: number;
    y: number;
  } | null>(null);

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.free, d.business, d.custom])
  );

  // Chart dimensions
  const chartWidth = 1000;
  const chartHeight = 300;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 20;
  const graphHeight = chartHeight - paddingTop - paddingBottom;
  const graphWidth = chartWidth - paddingLeft - paddingRight;

  // X positions (evenly spaced)
  const xStep = graphWidth / (data.length - 1);
  
  // Create points for each line
  const freeLine = data.map((d, i) => ({
    x: paddingLeft + i * xStep,
    y: paddingTop + graphHeight - (d.free / maxValue) * graphHeight,
    value: d.free,
    month: d.month
  }));
  
  const businessLine = data.map((d, i) => ({
    x: paddingLeft + i * xStep,
    y: paddingTop + graphHeight - (d.business / maxValue) * graphHeight,
    value: d.business,
    month: d.month
  }));
  
  const customLine = data.map((d, i) => ({
    x: paddingLeft + i * xStep,
    y: paddingTop + graphHeight - (d.custom / maxValue) * graphHeight,
    value: d.custom,
    month: d.month
  }));

  // Create SVG path commands
  const createPathCommand = (points: {x: number, y: number}[]) => {
    return points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
  };

  const freePathCommand = createPathCommand(freeLine);
  const businessPathCommand = createPathCommand(businessLine);
  const customPathCommand = createPathCommand(customLine);

  return (
    <div className="relative h-[300px] w-full overflow-hidden">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={paddingLeft}
              y1={paddingTop + graphHeight * (1 - ratio)}
              x2={paddingLeft + graphWidth}
              y2={paddingTop + graphHeight * (1 - ratio)}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 10}
              y={paddingTop + graphHeight * (1 - ratio) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#737791"
            >
              ${Math.round(maxValue * ratio).toLocaleString()}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={`x-label-${i}`}
            x={paddingLeft + i * xStep}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#737791"
          >
            {d.month}
          </text>
        ))}

        {/* Lines */}
        <path
          d={freePathCommand}
          fill="none"
          stroke="#ffa412"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={businessPathCommand}
          fill="none"
          stroke="#00e096"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={customPathCommand}
          fill="none"
          stroke="#5d5fef"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points with hover */}
        {freeLine.map((point, i) => (
          <circle
            key={`free-${i}`}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#ffa412"
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint({
              month: point.month,
              value: point.value,
              type: "Free",
              x: point.x,
              y: point.y
            })}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
        
        {businessLine.map((point, i) => (
          <circle
            key={`business-${i}`}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#00e096"
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint({
              month: point.month,
              value: point.value,
              type: "Business",
              x: point.x,
              y: point.y
            })}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
        
        {customLine.map((point, i) => (
          <circle
            key={`custom-${i}`}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#5d5fef"
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPoint({
              month: point.month,
              value: point.value,
              type: "Custom",
              x: point.x,
              y: point.y
            })}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}

        {/* Hover tooltip */}
        {hoveredPoint && (
          <g>
            <rect
              x={hoveredPoint.x > chartWidth / 2 ? hoveredPoint.x - 160 : hoveredPoint.x + 10}
              y={hoveredPoint.y > chartHeight / 2 ? hoveredPoint.y - 70 : hoveredPoint.y + 10}
              width="150"
              height="60"
              fill="#151d48"
              rx="4"
              className="drop-shadow-lg"
            />
            <text
              x={hoveredPoint.x > chartWidth / 2 ? hoveredPoint.x - 150 : hoveredPoint.x + 20}
              y={hoveredPoint.y > chartHeight / 2 ? hoveredPoint.y - 45 : hoveredPoint.y + 35}
              fill="white"
              fontSize="14"
            >
              {hoveredPoint.month} - {hoveredPoint.type}
            </text>
            <text
              x={hoveredPoint.x > chartWidth / 2 ? hoveredPoint.x - 150 : hoveredPoint.x + 20}
              y={hoveredPoint.y > chartHeight / 2 ? hoveredPoint.y - 25 : hoveredPoint.y + 55}
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              ${hoveredPoint.value.toLocaleString()}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 pb-1">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#ffa412] mr-2"></div>
          <span className="text-xs text-[#737791]">Free</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#00e096] mr-2"></div>
          <span className="text-xs text-[#737791]">Business</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#5d5fef] mr-2"></div>
          <span className="text-xs text-[#737791]">Custom</span>
        </div>
      </div>
    </div>
  );
}
