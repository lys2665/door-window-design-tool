import { Skeleton } from "@/components/ui/skeleton"

export default function CasesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航骨架屏 */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-16" />
            <span className="text-gray-300">/</span>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>

      {/* 顶部 Banner 骨架屏 */}
      <div className="relative h-40 bg-gray-200 animate-pulse">
        <div className="absolute left-8 bottom-6 flex items-end gap-4">
          <Skeleton className="w-24 h-24 rounded-xl" />
          <div className="mb-2 space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>

      {/* 筛选栏骨架屏 */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-9 w-64" />
          </div>
        </div>
      </div>

      {/* 方案列表骨架屏 */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

