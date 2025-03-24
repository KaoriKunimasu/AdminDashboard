export default function VisitorInsights() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Visitor Insights</h2>

      <div className="h-[180px] relative">
        {/* Simplified line chart representation */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            {/* Red line */}
            <path
              d="M0,50 C20,40 40,30 60,35 C80,40 100,60 120,55 C140,50 160,30 180,25 C200,20 220,30 240,40 C260,50 280,60 300,55"
              fill="none"
              stroke="#eb5757"
              strokeWidth="2"
            />
            {/* Green line */}
            <path
              d="M0,60 C20,55 40,45 60,40 C80,35 100,45 120,50 C140,55 160,45 180,40 C200,35 220,45 240,50 C260,55 280,50 300,45"
              fill="none"
              stroke="#00e096"
              strokeWidth="2"
            />
            {/* Purple line */}
            <path
              d="M0,40 C20,45 40,50 60,55 C80,60 100,50 120,45 C140,40 160,50 180,55 C200,60 220,50 240,45 C260,40 280,35 300,30"
              fill="none"
              stroke="#bf83ff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-[#737791]">
        <div>Jan</div>
        <div>Feb</div>
        <div>Mar</div>
        <div>Apr</div>
        <div>May</div>
        <div>Jun</div>
        <div>Jul</div>
        <div>Aug</div>
        <div>Sep</div>
        <div>Oct</div>
        <div>Nov</div>
        <div>Dec</div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#bf83ff]"></div>
          <span className="text-xs text-[#737791]">Unique Customers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eb5757]"></div>
          <span className="text-xs text-[#737791]">New Customers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00e096]"></div>
          <span className="text-xs text-[#737791]">Repeat Customers</span>
        </div>
      </div>
    </div>
  )
}

