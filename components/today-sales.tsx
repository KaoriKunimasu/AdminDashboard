"use client"
import { Users, Activity, DollarSign, FileText, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  sessionDuration: number;
  transactions: number;
  totalUsersChange: number;
  activeUsersChange: number;
  sessionDurationChange: number;
  transactionsChange: number;
}

export default function TodaySales() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();

        if (result.userMetrics?.rows) {
          const metrics = {
            totalUsers: parseInt(result.userMetrics.rows[0]?.metricValues[0]?.value ?? '0'),
            activeUsers: parseInt(result.userMetrics.rows[1]?.metricValues[0]?.value ?? '0'),
            sessionDuration: parseFloat(result.userMetrics.rows[2]?.metricValues[0]?.value ?? '0'),
            transactions: parseInt(result.userMetrics.rows[3]?.metricValues[0]?.value ?? '0'),
            totalUsersChange: calculateChange(result.userMetrics.rows[0]),
            activeUsersChange: calculateChange(result.userMetrics.rows[1]),
            sessionDurationChange: calculateChange(result.userMetrics.rows[2]),
            transactionsChange: calculateChange(result.userMetrics.rows[3])
          };
          setData(metrics);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  function calculateChange(row: any): number {
    if (!row?.metricValues?.[0]?.value || !row?.metricValues?.[1]?.value) return 0;
    const current = parseFloat(row.metricValues[0].value);
    const previous = parseFloat(row.metricValues[1].value);
    return previous ? ((current - previous) / previous) * 100 : 0;
  }

  function formatNumber(num: number): string {
    return num >= 1000 ? `${(num/1000).toFixed(1)}k` : num.toString();
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#151d48]">Today&apos;s Analytics</h2>
          <p className="text-sm text-[#737791]">Performance Metrics</p>
        </div>
        <button className="mt-2 sm:mt-0 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-[#151d48]">
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-4 text-center py-8">Loading analytics data...</div>
        ) : (
          <>
            <div className="bg-[#ffe2e5] rounded-lg p-4">
              <div className="w-10 h-10 bg-[#fa5a7d] rounded-lg flex items-center justify-center mb-3">
                <Users size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#151d48]">{formatNumber(data?.totalUsers ?? 0)}</h3>
              <p className="text-sm text-[#737791] mb-1">Total Users</p>
              <p className={`text-xs ${(data?.totalUsersChange ?? 0) >= 0 ? 'text-[#3cd856]' : 'text-[#fa5a7d]'}`}>
                {(data?.totalUsersChange ?? 0) >= 0 ? '🔼' : '🔽'} {Math.abs(data?.totalUsersChange ?? 0).toFixed(1)}% from last period
              </p>
            </div>

            <div className="bg-[#fff4de] rounded-lg p-4">
              <div className="w-10 h-10 bg-[#ff8900] rounded-lg flex items-center justify-center mb-3">
                <Activity size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#151d48]">{formatNumber(data?.activeUsers ?? 0)}</h3>
              <p className="text-sm text-[#737791] mb-1">Active Users</p>
              <p className={`text-xs ${(data?.activeUsersChange ?? 0) >= 0 ? 'text-[#3cd856]' : 'text-[#fa5a7d]'}`}>
                {(data?.activeUsersChange ?? 0) >= 0 ? '🔼' : '🔽'} {Math.abs(data?.activeUsersChange ?? 0).toFixed(1)}% from last period
              </p>
            </div>

            <div className="bg-[#dcfce7] rounded-lg p-4">
              <div className="w-10 h-10 bg-[#3cd856] rounded-lg flex items-center justify-center mb-3">
                <Clock size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#151d48]">
                {formatDuration(data?.sessionDuration ?? 0)}
              </h3>
              <p className="text-sm text-[#737791] mb-1">Avg. Session Duration</p>
              <p className={`text-xs ${(data?.sessionDurationChange ?? 0) >= 0 ? 'text-[#3cd856]' : 'text-[#fa5a7d]'}`}>
                {(data?.sessionDurationChange ?? 0) >= 0 ? '🔼' : '🔽'} {Math.abs(data?.sessionDurationChange ?? 0).toFixed(1)}% from last period
              </p>
            </div>

            <div className="bg-[#f3e8ff] rounded-lg p-4">
              <div className="w-10 h-10 bg-[#bf83ff] rounded-lg flex items-center justify-center mb-3">
                <FileText size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#151d48]">{formatNumber(data?.transactions ?? 0)}</h3>
              <p className="text-sm text-[#737791] mb-1">Total Transactions</p>
              <p className={`text-xs ${(data?.transactionsChange ?? 0) >= 0 ? 'text-[#3cd856]' : 'text-[#fa5a7d]'}`}>
                {(data?.transactionsChange ?? 0) >= 0 ? '🔼' : '🔽'} {Math.abs(data?.transactionsChange ?? 0).toFixed(1)}% from last period
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}