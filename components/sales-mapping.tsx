export default function SalesMapping() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Sales Mapping by Country</h2>

      <div className="h-[200px] md:h-[240px] relative">
        <img src="/placeholder.svg?height=240&width=320" alt="World Map" className="w-full h-full object-cover" />

        {/* Colored regions */}
        <div className="absolute top-[20%] left-[15%] w-[15%] h-[15%] bg-[#ffa412] rounded-lg opacity-70"></div>
        <div className="absolute top-[30%] left-[40%] w-[12%] h-[12%] bg-[#eb5757] rounded-lg opacity-70"></div>
        <div className="absolute top-[25%] right-[30%] w-[14%] h-[14%] bg-[#bf83ff] rounded-lg opacity-70"></div>
        <div className="absolute top-[50%] right-[20%] w-[16%] h-[16%] bg-[#00e096] rounded-lg opacity-70"></div>
      </div>
    </div>
  )
}

