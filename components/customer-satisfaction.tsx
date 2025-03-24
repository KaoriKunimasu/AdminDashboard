export default function CustomerSatisfaction() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Customer Satisfaction</h2>

      <div className="h-[180px] relative">
        {/* Simplified line chart representation */}
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="h-px bg-gray-100 w-full"></div>
          <div className="h-px bg-gray-100 w-full"></div>
        </div>

        <div className="absolute inset-0">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            {/* Light blue area */}
            <path
              d="M0,80 C20,70 40,75 60,65 C80,55 100,60 120,50 C140,40 160,45 180,40 C200,35 220,30 240,25 C260,20 280,15 300,10 L300,100 L0,100 Z"
              fill="rgba(93, 95, 239, 0.1)"
            />
            {/* Light blue line */}
            <path
              d="M0,80 C20,70 40,75 60,65 C80,55 100,60 120,50 C140,40 160,45 180,40 C200,35 220,30 240,25 C260,20 280,15 300,10"
              fill="none"
              stroke="#5d5fef"
              strokeWidth="2"
            />
            {/* Green line */}
            <path
              d="M0,70 C20,65 40,60 60,55 C80,50 100,55 120,45 C140,50 160,45 180,40 C200,45 220,30 240,20 C260,10 280,5 300,5"
              fill="none"
              stroke="#00e096"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#737791]">Last Month</span>
          <span className="text-sm font-medium text-[#151d48]">$3,004</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-[#737791]">This Month</span>
          <span className="text-sm font-medium text-[#151d48]">$4,504</span>
        </div>
      </div>
    </div>
  )
}

