"use client";
import { useState } from "react";

interface BarData {
  month: string;
  free: number;
  business: number;
  custom: number;
}

export default function PlanDistribution() {
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);

  const barData: BarData[] = [
    { month: "Jan", free: 100, business: 200, custom: 300 },
    { month: "Feb", free: 150, business: 250, custom: 350 },
    { month: "Mar", free: 200, business: 300, custom: 400 },
    { month: "Apr", free: 250, business: 350, custom: 450 },
    { month: "May", free: 300, business: 400, custom: 500 },
    { month: "Jun", free: 350, business: 450, custom: 550 },
  ];

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Plan Distribution</h2>

      <div className="grid grid-cols-6 gap-4">
        {barData.map((data, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-center gap-1 relative cursor-pointer"
            onMouseEnter={() => setHoveredBar(data)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <div className="w-full md:w-4/5 bg-[#ffa412]" style={{ height: `${data.free}px` }}></div>
            <div className="w-full md:w-4/5 bg-[#ff6347]" style={{ height: `${data.business}px` }}></div>
            <div className="w-full md:w-4/5 bg-[#4682b4]" style={{ height: `${data.custom}px` }}></div>
            <span className="text-xs text-[#737791]">{data.month}</span>
          </div>
        ))}
      </div>

      {hoveredBar && (
        <div className="absolute bg-white p-2 rounded shadow-lg">
          <p className="text-sm font-semibold">{hoveredBar.month}</p>
          <p className="text-xs text-[#ffa412]">Free: {hoveredBar.free}</p>
          <p className="text-xs text-[#ff6347]">Business: {hoveredBar.business}</p>
          <p className="text-xs text-[#4682b4]">Custom: {hoveredBar.custom}</p>
        </div>
      )}
    </div>
  );
}