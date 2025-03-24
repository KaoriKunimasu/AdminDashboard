"use client"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import TodaySales from "@/components/today-sales"
import EngagementRate from "@/components/EngagementRate"
import ActiveUsers from "@/components/active-users"
import UserAcquisition from "./user-acquisition"
import UserSegmentation from "@/components/user-segmentation"
import SalesMapping from "@/components/sales-mapping"
import VolumeVsService from "@/components/volume-vs-service"
import MostViewedPages from "@/components/most-viewed-pages"
// import RevenueInsights from "@/components/revenue-insights" // Comment out or remove

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold text-[#151d48] mb-6">Overview</h1>

          <div className="grid gap-6">
            <TodaySales />

            <div className="grid md:grid-cols-2 gap-6">
              <EngagementRate />
              <MostViewedPages /> {/* Replace RevenueInsights with MostViewedPages */}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ActiveUsers />
              <UserAcquisition />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <UserSegmentation />
              <SalesMapping />
              <VolumeVsService />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
