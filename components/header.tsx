import { Search, Bell, ChevronDown } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 bg-[#f9fafb] rounded-md text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-[#eb5757] flex items-center justify-center text-white">
              <span className="text-xs">🇺🇸</span>
            </div>
            <span className="text-[#151d48]">Eng (US)</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          <div className="relative">
            <Bell size={20} className="text-[#737791]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#eb5757] rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#151d48]">Aditya</p>
              <p className="text-xs text-[#737791]">Admin</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}

