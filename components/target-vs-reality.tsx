export default function TargetVsReality() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Target vs Reality</h2>

      <div className="h-[180px] flex items-end gap-2">
        {/* Simplified bar chart representation */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-1">
              <div className="w-4/5 bg-[#ffa412]" style={{ height: `${Math.floor(Math.random() * 60) + 20}px` }}></div>
              <div className="w-4/5 bg-[#00e096]" style={{ height: `${Math.floor(Math.random() * 60) + 20}px` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
            <span className="text-xs text-[#737791]">Reality Sales</span>
          </div>
          <span className="text-sm font-medium text-[#151d48]">8,823</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffa412]"></div>
            <span className="text-xs text-[#737791]">Target Sales</span>
          </div>
          <span className="text-sm font-medium text-[#151d48]">12,122</span>
        </div>
      </div>
    </div>
  )
}

