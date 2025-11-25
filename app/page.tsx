import Link from "next/link"
import { Pen, BookOpen, Package, Sparkles, FolderOpen, Home, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#2a2a2a] flex overflow-hidden relative transition-colors">
      {/* 背景光效 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-500/15 rounded-full blur-[100px]" />
      </div>

      {/* 背景大字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <p className="text-[clamp(120px,20vw,300px)] font-bold text-foreground/[0.02] dark:text-white/[0.02] whitespace-nowrap leading-none select-none">
          门窗设计
        </p>
      </div>

      {/* 主内容区 - 全宽 */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* 顶部栏 - 优化pad尺寸 */}
        <header className="h-16 md:h-18 flex items-center justify-between px-6 md:px-10 lg:px-12 flex-shrink-0">
          {/* Logo区域 */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transform rotate-45">
              <Pen className="w-4 h-4 md:w-5 md:h-5 text-white -rotate-45" />
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-base md:text-lg font-bold text-foreground dark:text-white">门窗智能设计平台</h1>
              <span className="text-xs text-muted-foreground dark:text-white/50">专业 · 高效 · 智能</span>
            </div>
          </Link>
          
          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button 
              variant="ghost" 
              className="text-foreground/80 dark:text-white/80 hover:text-foreground dark:hover:text-white hover:bg-accent dark:hover:bg-white/10 text-sm h-9 px-3 md:px-4"
            >
              学习中心
            </Button>
            <ThemeToggle />
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-4 md:px-6 text-sm h-9">
              登录账户
            </Button>
          </div>
        </header>

        {/* 卡片网格区域 - 优化pad布局 */}
        <div className="flex-1 overflow-auto px-6 md:px-10 lg:px-12 py-6 md:py-8">
          <div className="max-w-[1400px] mx-auto h-full flex flex-col gap-4 md:gap-6">
            {/* 第一行：大卡片 + 中卡片 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-[2]">
              {/* 开始设计 - 大卡片 (占2列) */}
              <Link href="/design" className="lg:col-span-2">
                <div className="group h-full min-h-[280px] lg:min-h-[360px] backdrop-blur-xl bg-gradient-to-b from-card/80 to-card/60 dark:from-white/10 dark:to-white/5 rounded-2xl md:rounded-3xl border border-border dark:border-white/20 hover:border-primary dark:hover:border-white/30 transition-all duration-300 overflow-hidden relative active:scale-[0.98] touch-manipulation">
                  {/* 背景装饰图案 */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 w-32 h-48 md:w-48 md:h-72 opacity-30">
                      <div className="w-full h-full border-2 md:border-4 border-primary/40 dark:border-white/40 rounded-xl md:rounded-2xl relative bg-primary/5 dark:bg-white/5">
                        <div className="absolute inset-2 md:inset-4 border border-primary/30 dark:border-white/30 rounded-lg" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] md:w-[2px] bg-primary/30 dark:bg-white/30 -translate-x-1/2" />
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] md:h-[2px] bg-primary/30 dark:bg-white/30 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                  
                  {/* 内容 */}
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-3 md:mb-4">开始设计</h2>
                      <p className="text-muted-foreground dark:text-white/70 text-sm md:text-base mb-4 md:mb-6">
                        使用专业工具快速<br />设计您的门窗方案
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl backdrop-blur-sm bg-primary/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-white/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-foreground dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* AI封窗建议 - 中卡片 (占1列) */}
              <Link href="/ai" className="lg:col-span-1">
                <div className="group h-full min-h-[280px] lg:min-h-[360px] backdrop-blur-xl bg-gradient-to-b from-blue-500/30 to-blue-600/20 rounded-2xl md:rounded-3xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 overflow-hidden relative active:scale-[0.98] touch-manipulation">
                  {/* 装饰性图案 */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 opacity-20">
                      <Sparkles className="w-full h-full text-white dark:text-white" />
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                    <div className="flex-1 flex flex-col justify-center">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">AI 封窗建议</h2>
                      <p className="text-white/80 text-xs md:text-sm mb-4 md:mb-6">
                        获取智能化的封窗解决方案，AI助力精准决策
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl backdrop-blur-sm bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 第二行：三个小卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1">
              {/* 案例库 - 小卡片 */}
              <Link href="/cases">
                <div className="group h-full min-h-[180px] lg:min-h-[200px] backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl md:rounded-3xl border border-border/50 dark:border-white/20 hover:border-purple-400/50 dark:hover:border-white/30 transition-all duration-300 overflow-hidden relative active:scale-[0.98] touch-manipulation">
                  <div className="relative z-10 p-5 md:p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground dark:text-white mb-2 md:mb-3">案例库</h3>
                      <p className="text-muted-foreground dark:text-white/70 text-xs md:text-sm">
                        浏览精选的门窗设计案例
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl backdrop-blur-sm bg-purple-500/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-purple-500/20 dark:group-hover:bg-white/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-foreground dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 产品库 - 小卡片 */}
              <Link href="/products">
                <div className="group h-full min-h-[180px] lg:min-h-[200px] backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl md:rounded-3xl border border-border/50 dark:border-white/20 hover:border-emerald-400/50 dark:hover:border-white/30 transition-all duration-300 overflow-hidden relative active:scale-[0.98] touch-manipulation">
                  <div className="relative z-10 p-5 md:p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground dark:text-white mb-2 md:mb-3">产品库</h3>
                      <p className="text-muted-foreground dark:text-white/70 text-xs md:text-sm">
                        探索完整的门窗产品目录
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl backdrop-blur-sm bg-emerald-500/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 dark:group-hover:bg-white/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-foreground dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 我的方案 - 小卡片 */}
              <Link href="/schemes" className="sm:col-span-2 lg:col-span-1">
                <div className="group h-full min-h-[180px] lg:min-h-[200px] backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-2xl md:rounded-3xl border border-border/50 dark:border-white/20 hover:border-orange-400/50 dark:hover:border-white/30 transition-all duration-300 overflow-hidden relative active:scale-[0.98] touch-manipulation">
                  <div className="relative z-10 p-5 md:p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground dark:text-white mb-2 md:mb-3">我的方案</h3>
                      <p className="text-muted-foreground dark:text-white/70 text-xs md:text-sm">
                        管理和查看您的门窗设计方案
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl backdrop-blur-sm bg-orange-500/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-orange-500/20 dark:group-hover:bg-white/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-foreground dark:text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <footer className="h-12 md:h-14 flex items-center justify-center px-6 md:px-10 flex-shrink-0 border-t border-border/50 dark:border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-muted-foreground dark:text-white/40">
            <span>© 2024 门窗智能设计平台</span>
            <Link href="/help" className="hover:text-foreground dark:hover:text-white/60 transition-colors touch-manipulation">帮助中心</Link>
            <Link href="/privacy" className="hover:text-foreground dark:hover:text-white/60 transition-colors touch-manipulation">隐私政策</Link>
            <Link href="/terms" className="hover:text-foreground dark:hover:text-white/60 transition-colors touch-manipulation">服务条款</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
