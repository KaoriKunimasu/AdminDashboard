"use client"
import { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GeoData {
  country: string;
  users: number;
  percentage: number;
  countryCode: string;
}

export default function GeoUsers() {
  const [data, setData] = useState<GeoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/analytics/geo');
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.error) {
          throw new Error(result.message || result.error);
        }

        if (result.countries?.length > 0) {
          setData(result.countries);
        } else {
          // Fallback data
          setData([
            { country: "United States", users: 2840, percentage: 45, countryCode: "US" },
            { country: "United Kingdom", users: 1650, percentage: 26, countryCode: "GB" },
            { country: "Canada", users: 1100, percentage: 17, countryCode: "CA" },
            { country: "Australia", users: 480, percentage: 8, countryCode: "AU" },
            { country: "Germany", users: 250, percentage: 4, countryCode: "DE" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching geographical data:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        // Set fallback data on error
        setData([
          { country: "United States", users: 2840, percentage: 45, countryCode: "US" },
          { country: "United Kingdom", users: 1650, percentage: 26, countryCode: "GB" },
          { country: "Canada", users: 1100, percentage: 17, countryCode: "CA" },
          { country: "Australia", users: 480, percentage: 8, countryCode: "AU" },
          { country: "Germany", users: 250, percentage: 4, countryCode: "DE" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Take the top 10 countries for chart display
  const topCountries = [...data].sort((a, b) => b.users - a.users).slice(0, 10);

  // Prepare chart data
  const chartData = {
    labels: topCountries.map(item => item.country),
    datasets: [
      {
        label: 'Users',
        data: topCountries.map(item => item.users),
        backgroundColor: topCountries.map((_, index) => 
          `rgba(30, 136, 229, ${1 - (index * 0.07)})`
        ),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const item = topCountries[context.dataIndex];
            return `${value.toLocaleString()} users (${item.percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          borderDash: [2, 4],
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Calculate totals
  const totalUsers = data.reduce((sum, country) => sum + country.users, 0);
  const totalCountries = data.length;
  
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Sales Mapping by Country</h2>
        <p className="text-sm text-[#6b7280]">Geographic distribution of sales</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm">
          <p>Error: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-[#737791]">Loading geographical data...</p>
        </div>
      ) : (
        <div className="mt-4">
          {/* Chart */}
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Users</p>
              <p className="text-lg font-semibold">{totalUsers.toLocaleString()}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">Countries</p>
              <p className="text-lg font-semibold">{totalCountries}</p>
            </div>
          </div>

          {/* Top 5 countries table for more detailed view */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#4b5563] mb-2">Top Countries</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500">Country</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">Users</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {topCountries.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm">{item.country}</td>
                    <td className="py-2 text-sm text-right">{item.users.toLocaleString()}</td>
                    <td className="py-2 text-sm text-right">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
