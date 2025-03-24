export default function UserSegmentation() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">User Segmentation</h2>
      <div className="h-[200px] flex items-end">
        {/* Simplified stacked bar chart */}
        <div className="w-full h-full flex">
          <div className="flex-1 bg-[#ffa412]" style={{ height: "40%" }}></div>
          <div className="flex-1 bg-[#5d5fef]" style={{ height: "35%" }}></div>
          <div className="flex-1 bg-[#00e096]" style={{ height: "25%" }}></div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-[#737791] mt-2">
        <span>Freelancers</span>
        <span>Small Business</span>
        <span>Tradies</span>
      </div>
    </div>
  )
}

