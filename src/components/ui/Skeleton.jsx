export function ProductCardSkeleton() {
  return (
    <div className="bg-[#111] rounded-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#1a1a1a]" />
      <div className="p-4 space-y-3">
        <div className="h-2 w-16 bg-[#1a1a1a] rounded-sm" />
        <div className="h-3 w-3/4 bg-[#1a1a1a] rounded-sm" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-16 bg-[#1a1a1a] rounded-sm" />
          <div className="h-6 w-20 bg-[#1a1a1a] rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
      <div className="aspect-square bg-[#111] rounded-sm" />
      <div className="space-y-6 flex flex-col justify-center">
        <div className="h-2 w-24 bg-[#111] rounded-sm" />
        <div className="h-12 w-3/4 bg-[#111] rounded-sm" />
        <div className="h-8 w-32 bg-[#111] rounded-sm" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#111] rounded-sm" />
          <div className="h-3 w-5/6 bg-[#111] rounded-sm" />
          <div className="h-3 w-4/6 bg-[#111] rounded-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-12 h-12 bg-[#111] rounded-sm" />
          ))}
        </div>
        <div className="h-12 w-full bg-[#111] rounded-sm" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-[#111] rounded-sm p-6 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-2 w-32 bg-[#1a1a1a] rounded-sm" />
          <div className="h-2 w-24 bg-[#1a1a1a] rounded-sm" />
        </div>
        <div className="h-6 w-20 bg-[#1a1a1a] rounded-sm" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => (
          <div key={i} className="w-10 h-10 bg-[#1a1a1a] rounded-sm" />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-2 w-16 bg-[#1a1a1a] rounded-sm" />
        <div className="h-6 w-24 bg-[#1a1a1a] rounded-sm" />
      </div>
    </div>
  )
}