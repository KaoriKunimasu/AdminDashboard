export default function RevenueInsights() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Revenue Insights</h2>
      <div className="h-[200px] flex items-end space-x-2">
        {/* Simplified stacked bar chart */}
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <div key={index} className="flex-1 flex flex-col-reverse">
            <div className="bg-[#ffa412]" style={{ height: `${20 + Math.random() * 30}%` }}></div>
            <div className="bg-[#5d5fef]" style={{ height: `${20 + Math.random() * 30}%` }}></div>
            <div className="bg-[#00e096]" style={{ height: `${20 + Math.random() * 30}%` }}></div>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#737791] mt-2">Subscription revenue by plan type</p>
    </div>
  )
}

