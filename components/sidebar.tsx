"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FolderOpen, 
  Package, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  Settings, 
  LogOut, 
  User, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Route,
  Zap,
  Info,
  SlidersHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "首页", href: "/", icon: Home },
  { name: "案例库", href: "/cases", icon: FolderOpen },
  { name: "产品库", href: "/products", icon: Package },
  { name: "学习中心", href: "/learning", icon: BookOpen },
  { name: "方案管理", href: "/plans", icon: BarChart3 },
  { name: "AI建议", href: "/ai", icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 从 localStorage 恢复状态
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setIsCollapsed(saved === "true")
    }
  }, [])

  // 保存状态到 localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  return (
    <aside 
      className={cn(
        "border-r border-border bg-card flex flex-col transition-all duration-300",
        isCollapsed ? "w-16 md:w-18 lg:w-20" : "w-56 md:w-60 lg:w-64 xl:w-72"
      )}
    >
      {/* Logo & Toggle */}
      <div className={cn(
        "flex items-center justify-between border-b border-border",
        isCollapsed ? "p-3 md:p-3.5" : "p-4 md:p-5 lg:p-6"
      )}>
        {!isCollapsed && (
          <h1 className="text-lg md:text-xl lg:text-xl font-semibold text-foreground truncate">
            门窗智能设计平台
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "h-9 w-9 shrink-0 touch-manipulation",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "space-y-1.5 md:space-y-2 flex-1 overflow-y-auto pb-2 scrollbar-hide",
        isCollapsed ? "px-2" : "px-3 md:px-3.5"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-all active:scale-[0.98] touch-manipulation",
                isCollapsed 
                  ? "justify-center p-2.5 md:p-3" 
                  : "gap-3 px-3 md:px-3.5 py-2.5 md:py-3",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 md:h-5.5 md:w-5.5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm md:text-base font-medium">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions Section - 简化版 */}
      <div className="shrink-0 border-t border-border">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "flex-col gap-1 p-2" : "justify-around py-2.5 px-2"
        )}>
          {/* Theme Toggle */}
          <div className={cn(
            isCollapsed ? "w-full flex justify-center" : ""
          )}>
            <ThemeToggle />
          </div>

          {!isCollapsed && (
            <>
              {/* Preferences */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 group touch-manipulation"
                title="偏好设置"
              >
                <SlidersHorizontal className="h-4 w-4 md:h-4.5 md:w-4.5 transition-transform group-hover:scale-110" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative group touch-manipulation"
                title="通知"
              >
                <Bell className="h-4 w-4 md:h-4.5 md:w-4.5 transition-transform group-hover:scale-110" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-card"></span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* User Info - 简洁版 */}
      <div className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className={cn(
          isCollapsed ? "p-2" : "px-3 py-2.5"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "p-0 hover:bg-accent/50 rounded-lg transition-colors touch-manipulation",
                  isCollapsed ? "h-10 w-10 mx-auto" : "h-auto w-full"
                )}
              >
                {isCollapsed ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    用
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                      用
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium text-foreground truncate">设计师</div>
                      <div className="text-xs text-muted-foreground">专业版</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    用
                  </div>
                  <div>
                    <div className="text-sm font-medium">设计师</div>
                    <div className="text-xs text-muted-foreground">designer@example.com</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>个人资料</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>账号设置</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}

