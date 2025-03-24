export default function SubscriberGrowthRate() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Subscriber Growth Rate</h2>
      <div className="h-[200px] flex items-end">
        {/* Simplified line chart */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path d="M0,40 Q25,30 50,35 T100,20" fill="none" stroke="#00e096" strokeWidth="2" />
          <path d="M0,45 Q25,50 50,40 T100,30" fill="none" stroke="#eb5757" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex justify-between text-sm text-[#737791] mt-2">
        <span>New Users</span>
        <span>Churned Users</span>
      </div>
    </div>
  )
}

