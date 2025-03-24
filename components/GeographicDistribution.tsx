export default function GeographicDistribution() {
  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Geographic Distribution</h2>
      <div className="h-[200px] relative">
        {/* Simplified world map representation */}
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="World Map"
            className="w-full h-full object-contain opacity-20"
          />

          {/* Colored regions */}
          <div className="absolute top-[20%] left-[15%] w-12 h-8 bg-[#ffa412] rounded-lg opacity-70"></div>
          <div className="absolute top-[30%] left-[40%] w-10 h-6 bg-[#eb5757] rounded-lg opacity-70"></div>
          <div className="absolute top-[25%] right-[30%] w-12 h-8 bg-[#bf83ff] rounded-lg opacity-70"></div>
          <div className="absolute top-[50%] right-[20%] w-14 h-10 bg-[#00e096] rounded-lg opacity-70"></div>
        </div>
      </div>
      <p className="text-sm text-[#737791] mt-2">Client locations</p>
    </div>
  )
}

