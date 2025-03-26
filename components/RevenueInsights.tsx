"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import chart component with SSR disabled
const RevenueChart = dynamic(() => import("./RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center">
      Loading revenue data...
    </div>
  ),
});

interface RevenueData {
  month: string;
  free: number;
  business: number;
  custom: number;
}

export default function RevenueInsights() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          { month: "Jul", free: 1500, business: 3200, custom: 4200 },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRevenueData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-5 h-full">
        <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>
        <div className="h-[200px] flex items-center justify-center">
          Loading revenue data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-5 h-full">
        <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>
        <div className="h-[200px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>
      
      {/* Client-side only chart component */}
      <RevenueChart data={revenueData} />
      
      <p className="text-sm text-[#737791] mt-2">Subscription revenue by plan type</p>
    </div>
  );
}
