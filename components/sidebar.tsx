import { LayoutDashboard, Users, KeyRound, Search, Settings, UserCheck, LogOut } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-[240px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ffa412] rounded-md flex items-center justify-center text-white font-bold">
            <span className="text-xl">U</span>
          </div>
          <span className="font-bold text-[#151d48]">Unlimited Invoices</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 bg-[#ffa412] text-white rounded-md">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <Users size={20} />
              <span>User Management</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <KeyRound size={20} />
              <span>Change Password</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <Search size={20} />
              <span>SEO</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <UserCheck size={20} />
              <span>Subscribed Users</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-[#737791] hover:bg-gray-100 rounded-md">
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

