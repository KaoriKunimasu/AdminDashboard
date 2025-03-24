export default function TotalRevenue() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Total Revenue</h2>

      <div className="h-[240px] flex items-end gap-3">
        {/* Simplified bar chart representation */}
        <div className="flex-1 flex items-end gap-2">
          <div className="w-1/7 h-[30%] bg-[#5d5fef] rounded-t-md"></div>
          <div className="w-1/7 h-[60%] bg-[#5d5fef] rounded-t-md"></div>
          <div className="w-1/7 h-[40%] bg-[#00e096] rounded-t-md"></div>
          <div className="w-1/7 h-[70%] bg-[#5d5fef] rounded-t-md"></div>
          <div className="w-1/7 h-[35%] bg-[#5d5fef] rounded-t-md"></div>
          <div className="w-1/7 h-[55%] bg-[#5d5fef] rounded-t-md"></div>
          <div className="w-1/7 h-[45%] bg-[#5d5fef] rounded-t-md"></div>
        </div>
      </div>

      <div className="flex justify-between mt-4 text-xs text-[#737791]">
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
        <div>Sunday</div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
          <span className="text-xs text-[#737791]">Online Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#5d5fef]"></div>
          <span className="text-xs text-[#737791]">Offline Sales</span>
        </div>
      </div>
    </div>
  )
}

