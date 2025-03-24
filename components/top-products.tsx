export default function TopProducts() {
  const products = [
    { id: "01", name: "Home Decor Range", percentage: 45 },
    { id: "02", name: 'Disney Princess Pink Bag 18"', percentage: 29 },
    { id: "03", name: "Bathroom Essentials", percentage: 18 },
    { id: "04", name: "Apple Smartwatches", percentage: 25 },
  ]

  return (
    <div className="bg-white rounded-lg p-5 h-full">
      <h2 className="text-lg font-semibold text-[#151d48] mb-4">Top Products</h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="w-6 text-sm text-[#737791]">{product.id}</div>
            <div className="flex-1">
              <div className="text-sm text-[#151d48] mb-1">{product.name}</div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    product.id === "01"
                      ? "bg-[#5d5fef]"
                      : product.id === "02"
                        ? "bg-[#00e096]"
                        : product.id === "03"
                          ? "bg-[#bf83ff]"
                          : "bg-[#ffa412]"
                  }`}
                  style={{ width: `${product.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="w-10 text-sm text-[#151d48] font-medium">{product.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

