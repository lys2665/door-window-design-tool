import Link from "next/link";
import {
  Pen,
  Images,
  Component,
  Sparkles,
  ScrollText,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#1a1a1a] flex overflow-hidden relative transition-colors">
      {/* 主内容区 - 全宽 */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* 顶部栏 */}
        <header className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10 lg:px-12 flex-shrink-0">
          {/* Logo区域 */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
              <Pen className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-black" />
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-black dark:text-white">
                门窗设计平台
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Discover Products
              </span>
            </div>
          </Link>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              className="text-sm h-9 md:h-10 px-4 md:px-6 rounded-full border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium"
            >
              学习中心
            </Button>
            <ThemeToggle />
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-4 md:px-6 text-sm h-9 md:h-10 font-medium">
              登录账户
            </Button>
          </div>
        </header>

        {/* 卡片网格区域 */}
        <div className="flex-1 overflow-auto px-6 md:px-10 lg:px-12 py-6 md:py-8">
          <div className="max-w-[1400px] mx-auto h-full flex flex-col gap-5 md:gap-6">
            {/* 第一行：大卡片 + 中卡片 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 flex-[2]">
              {/* 开始设计 - 大卡片 (占2列) */}
              <Link href="/design" className="lg:col-span-2">
                <div className="group h-full min-h-[280px] lg:min-h-[360px] bg-gradient-to-br from-[#FFD4E5] via-[#FDE1D3] to-[#FFE8CC] dark:from-[#4a3844] dark:via-[#4a4038] dark:to-[#4a4438] rounded-[20px] md:rounded-[24px] border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-300 overflow-hidden relative hover:shadow-2xl active:scale-[0.98] touch-manipulation">
                  {/* 实物背景图 - 优化遮罩 */}
                  <div className="absolute right-[-5%] top-[5%] w-[60%] h-[100%] opacity-90 dark:opacity-70 pointer-events-none">
                    <img
                      src="/panoramic-floor-to-ceiling-window.jpg"
                      alt="Start Design"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ maskImage: 'linear-gradient(to left, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)' }}
                    />
                  </div>

                  {/* 内容 */}
                  <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-center max-w-[60%]">
                      <div className="mb-4">
                        <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-medium mb-2">
                          Get UP TO
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-4 md:mb-6">
                          开始设计
                        </h2>
                      </div>
                      <Button className="w-fit bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg">
                        立即开始
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>

              {/* AI封窗建议 - 中卡片 (占1列) */}
              <Link href="/ai" className="lg:col-span-1">
                <div className="group h-full min-h-[280px] lg:min-h-[360px] bg-gradient-to-br from-[#E0F2F7] to-[#C5E1F5] dark:from-[#2d3d44] dark:to-[#2d394a] rounded-[20px] md:rounded-[24px] border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-300 overflow-hidden relative hover:shadow-2xl active:scale-[0.98] touch-manipulation">
                  {/* 实物背景图 - 微调透明度 */}
                  <div className="absolute right-[-20%] bottom-[-10%] w-[80%] h-[80%] opacity-70 dark:opacity-50 pointer-events-none">
                    <img
                      src="/modern-aluminum-sliding-window.jpg"
                      alt="AI Window Design"
                      className="w-full h-full object-contain drop-shadow-2xl transform rotate-[-5deg] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* AI 徽章 */}
                  <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20">
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black dark:bg-white shadow-md">
                      <span className="text-xs md:text-sm font-bold text-white dark:text-black flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        AI 智能
                      </span>
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-start pt-12">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black dark:text-white mb-3 leading-tight">
                        AI 封窗<br />建议
                      </h2>
                      <p className="text-base md:text-lg text-black/60 dark:text-white/60 font-medium">
                        智能方案推荐
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 第二行：三个小卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 flex-1">
              {/* 案例库 - 小卡片 */}
              <Link href="/cases">
                <div className="group h-full min-h-[200px] lg:min-h-[240px] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] dark:from-[#2d2d30] dark:to-[#252528] rounded-[20px] md:rounded-[24px] border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-300 overflow-hidden relative hover:shadow-xl active:scale-[0.98] touch-manipulation">
                  {/* 装饰性背景光晕 */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 blur-[50px] rounded-full pointer-events-none" />
                  
                  {/* 精致彩色图标 */}
                  <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg flex items-center justify-center transform rotate-6 transition-transform duration-500 group-hover:rotate-0">
                      <Images className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-start">
                      <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2">
                        案例库
                      </h3>
                      <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-semibold mb-1">
                        精选设计案例
                      </p>
                      <p className="text-sm text-black/40 dark:text-white/40">
                        浏览优秀作品
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 产品库 - 小卡片 */}
              <Link href="/products">
                <div className="group h-full min-h-[200px] lg:min-h-[240px] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] dark:from-[#2d2d30] dark:to-[#252528] rounded-[20px] md:rounded-[24px] border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-300 overflow-hidden relative hover:shadow-xl active:scale-[0.98] touch-manipulation">
                  {/* 装饰性背景光晕 */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 dark:bg-orange-400/10 blur-[50px] rounded-full pointer-events-none" />

                  {/* 精致彩色图标 */}
                  <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg flex items-center justify-center transform rotate-6 transition-transform duration-500 group-hover:rotate-0">
                      <Component className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-start">
                      <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2">
                        产品库
                      </h3>
                      <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-semibold mb-1">
                        完整产品目录
                      </p>
                      <p className="text-sm text-black/40 dark:text-white/40">
                        探索所有选项
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 我的方案 - 小卡片 */}
              <Link href="/schemes" className="sm:col-span-2 lg:col-span-1">
                <div className="group h-full min-h-[200px] lg:min-h-[240px] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] dark:from-[#2d2d30] dark:to-[#252528] rounded-[20px] md:rounded-[24px] border-[0.5px] border-black/5 dark:border-white/5 transition-all duration-300 overflow-hidden relative hover:shadow-xl active:scale-[0.98] touch-manipulation">
                  {/* 装饰性背景光晕 */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/10 blur-[50px] rounded-full pointer-events-none" />

                  {/* 精致彩色图标 */}
                  <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg flex items-center justify-center transform rotate-6 transition-transform duration-500 group-hover:rotate-0">
                      <ScrollText className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-start">
                      <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2">
                        我的方案
                      </h3>
                      <p className="text-lg md:text-xl text-black/60 dark:text-white/60 font-semibold mb-1">
                        方案管理
                      </p>
                      <p className="text-sm text-black/40 dark:text-white/40">
                        查看历史记录
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <footer className="h-14 md:h-16 flex items-center justify-center px-6 md:px-10 flex-shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-black/50 dark:text-white/50 font-medium">
            <span>© 2024 门窗设计平台</span>
            <Link
              href="/help"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              帮助中心
            </Link>
            <Link
              href="/privacy"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              隐私政策
            </Link>
            <Link
              href="/terms"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              服务条款
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
