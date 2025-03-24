"use client";
import { useState } from "react";

interface BarData {
  month: string;
  volume: number;
  service: number;
}

export default function VolumeVsService() {
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data: BarData[] = months.map((month) => ({
    month,
    volume: Math.floor(Math.random() * 100) + 50,
    service: Math.floor(Math.random() * 80) + 30,
  }));

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Volume vs Service Level</h2>

      <div className="h-[200px] md:h-[240px] flex items-end gap-2 md:gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full flex flex-col items-center gap-1 relative cursor-pointer"
              onMouseEnter={() => setHoveredBar(d)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="w-full md:w-4/5 bg-[#5d5fef]" style={{ height: `${d.volume}px` }}></div>
              <div className="w-full md:w-4/5 bg-[#00e096]" style={{ height: `${d.service}px` }}></div>
              {hoveredBar && hoveredBar.month === d.month && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#151d48] text-white p-2 rounded shadow-lg text-xs whitespace-nowrap z-10">
                  <p className="font-semibold">{d.month}</p>
                  <p>Volume: {d.volume}</p>
                  <p>Service: {d.service}</p>
                </div>
              )}
            </div>
            <div className="text-[9px] md:text-[10px] text-[#737791] mt-1">{d.month}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#5d5fef]"></div>
          <span className="text-xs text-[#737791]">Volume</span>
          <span className="text-sm font-medium text-[#151d48] ml-1">1,135</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
          <span className="text-xs text-[#737791]">Services</span>
          <span className="text-sm font-medium text-[#151d48] ml-1">875</span>
        </div>
      </div>
    </div>
  );
}