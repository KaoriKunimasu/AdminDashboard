"use client"
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface PageData {
  pageTitle: string;
  pagePath: string;
  pageviews: number;
  percentage: number;
}

export default function MostViewedPages() {
  const [pagesData, setPagesData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/pages');
        const data = await response.json();
        setPagesData(data.pages || []);
      } catch (error) {
        console.error("Error fetching page view data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#151d48]">Most Viewed Pages</h2>
          <p className="text-sm text-[#737791]">Top pages by pageviews</p>
        </div>
        <div className="w-10 h-10 bg-[#3cd856] rounded-lg flex items-center justify-center">
          <FileText size={20} className="text-white" />
        </div>
      </div>

      {loading ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-[#737791]">Loading page data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pagesData.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-[#737791]">No page view data available</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-xs text-[#737791] pb-2 border-b">
                <span>Page</span>
                <span>Views</span>
              </div>
              {pagesData.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1 pr-4">
                    <h3 className="text-sm font-medium text-[#151d48] truncate" title={page.pageTitle || page.pagePath}>
                      {page.pageTitle || page.pagePath}
                    </h3>
                    <p className="text-xs text-[#737791] truncate">{page.pagePath}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#151d48]">
                      {page.pageviews.toLocaleString()}
                    </span>
                    <div 
                      className="w-16 bg-gray-100 rounded-full h-2"
                      title={`${page.percentage.toFixed(1)}% of total views`}
                    >
                      <div 
                        className="bg-[#3cd856] h-2 rounded-full" 
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
