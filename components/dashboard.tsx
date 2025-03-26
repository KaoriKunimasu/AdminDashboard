"use client"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import TodaySales from "@/components/today-sales"
import ActiveUsers from "@/components/active-users"
import UserAcquisition from "./user-acquisition"
import DeviceUsers from "./device-users"
import MostViewedPages from "@/components/most-viewed-pages"
import GeoUsers from "./geo-users"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold text-[#151d48] mb-6">Overview</h1>

          <div className="grid gap-6">
            {/* TodaySales at the top (full width) */}
            <TodaySales />

            {/* ActiveUsers and UserAcquisition in the second row */}
            <div className="grid md:grid-cols-2 gap-6">
              <ActiveUsers />
              <UserAcquisition />
            </div>

            {/* GeoUsers and DeviceUsers in the third row */}
            <div className="grid md:grid-cols-2 gap-6">
              <GeoUsers />
              <DeviceUsers />
            </div>

            {/* MostViewedPages at the bottom (full width) */}
            <MostViewedPages />
          </div>
        </main>
      </div>
    </div>
  )
}
