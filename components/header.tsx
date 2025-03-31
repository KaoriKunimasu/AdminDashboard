"use client"
import { Bell } from "lucide-react"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-white border-b border-[#f1f1f1] py-4 px-4 md:px-6">
      <div className="flex items-center justify-end gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
          <Bell size={20} className="text-[#737791]" />
        </button>
        <button className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-[#151d48]">John Doe</p>
            <p className="text-xs text-[#737791]">Admin</p>
          </div>
        </button>
      </div>
    </header>
  )
}

