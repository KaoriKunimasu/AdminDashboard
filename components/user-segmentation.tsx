"use client";
import { useState } from "react";

interface Segment {
  id: string;
  type: string;
  popularity: number;
  sales: number;
}

export default function UserSegmentation() {
  const [hoveredSegment, setHoveredSegment] = useState<Segment | null>(null);

  const segments: Segment[] = [
    { id: "01", type: "Freelancers", popularity: 45, sales: 1200 },
    { id: "02", type: "Small-Sized Businesses", popularity: 30, sales: 980 },
    { id: "03", type: "Tradies", popularity: 15, sales: 450 },
    { id: "04", type: "Mid-sized companies", popularity: 10, sales: 320 },
  ];

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">User Segmentation</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-[#737791] border-b">
              <th className="pb-2 text-left w-12">#</th>
              <th className="pb-2 text-left">Type</th>
              <th className="pb-2 text-left px-4">Popularity</th>
              <th className="pb-2 text-left pl-4">Sales</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment.id} className="border-b last:border-b-0">
                <td className="py-3 text-sm text-[#737791]">{segment.id}</td>
                <td className="py-3 text-sm text-[#151d48]">{segment.type}</td>
                <td className="py-3 px-4">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 relative">
                    <div
                      className="h-2.5 rounded-full bg-[#5d5fef]"
                      style={{ width: `${segment.popularity}%` }}
                      onMouseEnter={() => setHoveredSegment(segment)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    ></div>
                    {hoveredSegment && hoveredSegment.id === segment.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#151d48] text-white p-2 rounded shadow-lg text-xs mb-2">
                        <p>{segment.type}</p>
                        <p>Popularity: {segment.popularity}%</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 text-sm font-medium text-[#151d48] pl-4">${segment.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}