export default function PlanDistribution() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Plan Distribution</h2>
      <div className="h-[200px] flex items-end">
        {/* Simplified stacked bar chart */}
        <div className="w-full h-full flex">
          <div className="flex-1 bg-[#ffa412]" style={{ height: "30%" }}></div>
          <div className="flex-1 bg-[#5d5fef]" style={{ height: "50%" }}></div>
          <div className="flex-1 bg-[#00e096]" style={{ height: "20%" }}></div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-[#737791] mt-2">
        <span>Free</span>
        <span>Business</span>
        <span>Custom</span>
      </div>
    </div>
  )
}

