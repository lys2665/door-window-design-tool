import Link from "next/link"
import { Pen, BookOpen, Package, GraduationCap, Sparkles, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - 优化高度 */}
      <header className="bg-white border-b shrink-0 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-2.5 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Pen className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base md:text-lg font-bold text-gray-900">门窗设计工具</h1>
              <p className="text-[10px] md:text-xs text-gray-500">专业 · 高效 · 智能</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/learning" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden sm:block transition-colors duration-200">
              学习中心
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 md:px-6 text-sm h-9 transition-all duration-200 active:scale-95">
              登录账户
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 h-full flex flex-col">
          {/* Title */}
          <div className="text-center pt-6 md:pt-8 lg:pt-10 pb-5 md:pb-6 lg:pb-8 shrink-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-3 md:mb-4">
              专业门窗设计平台
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              集设计、选品、学习、AI智能建议于一体的综合解决方案
            </p>
          </div>

          {/* Main Grid - 横屏: 左边大卡片+右边2x2网格，竖屏: 上下布局 */}
          <div className="flex-1 flex portrait:flex-col landscape:flex-row gap-4 md:gap-5 lg:gap-6 pb-6 md:pb-8 min-h-0">
            {/* Left Column - Design Card */}
            <div className="portrait:flex-none portrait:h-[45%] landscape:flex-1">
              <Link href="/design" className="block h-full">
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 md:p-10 lg:p-12 h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                  </div>
                  
                  {/* Door/Window Illustration - 更精确的门窗图形 */}
                  <div className="absolute right-8 bottom-8 md:right-12 md:bottom-12 lg:right-16 lg:bottom-16 w-48 h-72 md:w-56 md:h-80 lg:w-64 lg:h-96 opacity-30">
                    <div className="w-full h-full border-[6px] md:border-8 border-white/40 rounded-2xl relative bg-white/5">
                      {/* 内框 */}
                      <div className="absolute inset-4 md:inset-6 border-[4px] md:border-[6px] border-white/30 rounded-lg" />
                      {/* 十字分隔 */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-[4px] md:w-[6px] bg-white/30 -translate-x-1/2" />
                      <div className="absolute top-1/2 left-0 right-0 h-[4px] md:h-[6px] bg-white/30 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Pen className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">开始设计</h3>
                      <p className="text-lg md:text-xl lg:text-2xl text-white/90">使用专业工具快速设计您的门窗方案</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column - Feature Cards 2x2 Grid */}
            <div className="portrait:flex-1 landscape:w-[48%] landscape:max-w-[650px] grid grid-cols-2 grid-rows-2 gap-4 md:gap-5 lg:gap-6 min-h-0">
              {/* Case Library */}
              <Link href="/cases" className="h-full min-h-0">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.97] h-full flex flex-col">
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <BookOpen className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">案例库</h3>
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2">浏览精选的门窗设计案例</p>
                </div>
              </Link>

              {/* Product Library */}
              <Link href="/products" className="h-full min-h-0">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.97] h-full flex flex-col">
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Package className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">产品库</h3>
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2">探索完整的门窗产品目录</p>
                </div>
              </Link>

              {/* My Schemes */}
              <Link href="/schemes" className="h-full min-h-0">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.97] h-full flex flex-col">
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FolderOpen className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">我的方案</h3>
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2">管理和查看您的门窗设计方案</p>
                </div>
              </Link>

              {/* AI Recommendations */}
              <Link href="/ai" className="h-full min-h-0">
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.97] h-full flex flex-col">
                  <div className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Sparkles className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-blue-600" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">AI封窗建议</h3>
                  <p className="text-sm md:text-base text-gray-600 line-clamp-2">获取智能化的封窗解决方案</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - 优化高度 */}
      <footer className="bg-white border-t shrink-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-2.5 md:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500">© 2024 门窗设计工具. 保留所有权利.</p>
            <div className="flex items-center gap-4 md:gap-5">
              <Link href="/help" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                帮助中心
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



