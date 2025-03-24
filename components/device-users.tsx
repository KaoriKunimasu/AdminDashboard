"use client"
import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
}

export default function DeviceUsers() {
  const [data, setData] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/analytics/devices');
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.error) {
          throw new Error(result.message || result.error);
        }

        if (result.devices?.length > 0) {
          setData(result.devices);
        } else {
          // Fallback data
          setData([
            { device: "desktop", users: 2840, percentage: 45 },
            { device: "mobile", users: 2650, percentage: 42 },
            { device: "tablet", users: 820, percentage: 13 }
          ]);
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        // Set fallback data on error
        setData([
          { device: "desktop", users: 2840, percentage: 45 },
          { device: "mobile", users: 2650, percentage: 42 },
          { device: "tablet", users: 820, percentage: 13 }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate total users
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);

  // Create colors mapping
  const deviceColors: Record<string, string> = {
    "mobile": "#1E88E5", // Darker blue
    "desktop": "#BBDEFB", // Lighter blue
    "tablet": "#90CAF9"   // Medium blue
  };

  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.device),
    datasets: [
      {
        data: data.map(item => item.users),
        backgroundColor: data.map(item => deviceColors[item.device] || "#94A3B8"),
        borderWidth: 0,
        cutout: '75%'
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${value.toLocaleString()} users (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Active Users by Device Category</h2>
        <p className="text-sm text-[#6b7280]">Distribution of users across devices</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm">
          <p>Error: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-[#737791]">Loading device data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-[#737791]">No device data available</p>
        </div>
      ) : (
        <div className="mt-8">
          <div className="relative h-[300px] flex items-center justify-center">
            {/* Doughnut Chart */}
            <Doughnut 
              data={chartData} 
              options={chartOptions}
            />
            
            {/* Total users in center */}
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-sm text-[#6b7280]">Total Users</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">
                {totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center mt-6 gap-8">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: deviceColors[item.device] || "#94A3B8" }}
                />
                <span className="text-sm text-[#4b5563] capitalize">
                  {item.device} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
