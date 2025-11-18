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
        isCollapsed ? "w-16 md:w-20" : "w-60 md:w-64 lg:w-72 xl:w-80"
      )}
    >
      {/* Logo & Toggle */}
      <div className={cn(
        "flex items-center justify-between border-b border-border",
        isCollapsed ? "p-3 md:p-4" : "p-5 md:p-6 lg:p-7"
      )}>
        {!isCollapsed && (
          <h1 className="text-xl md:text-2xl lg:text-2xl font-semibold text-foreground truncate">
            门窗设计工具
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "h-8 w-8 shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "space-y-1.5 flex-1 overflow-y-auto pb-2",
        isCollapsed ? "px-2" : "px-3 md:px-4"
      )}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-all active:scale-[0.98]",
                isCollapsed 
                  ? "justify-center p-3 md:p-3.5" 
                  : "gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
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
          isCollapsed ? "flex-col gap-0 p-1.5" : "justify-around py-2 px-2"
        )}>
          {/* Next.js Dev Tools */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 relative group",
              !isCollapsed && "h-8 w-8"
            )}
            title="Next.js Dev Tools"
          >
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" className="transition-transform group-hover:scale-110">
              <g transform="translate(8.5, 13)">
                <path d="M13.3 15.2 L2.34 1 V12.6" fill="none" stroke="currentColor" strokeWidth="1.86" strokeDasharray="29.6"/>
                <path d="M11.825 1.5 V13.1" strokeWidth="1.86" stroke="currentColor" strokeDasharray="11.6"/>
              </g>
            </svg>
          </Button>

          {!isCollapsed && (
            <>
              {/* Preferences */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 group"
                title="偏好设置"
              >
                <SlidersHorizontal className="h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>

              {/* Route Info */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 group"
                title="路由信息"
              >
                <Info className="h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative group"
                title="通知"
              >
                <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* User Info - 简洁版 */}
      <div className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className={cn(
          isCollapsed ? "p-2" : "px-3 py-2"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "p-0 hover:bg-accent/50 rounded-lg transition-colors",
                  isCollapsed ? "h-9 w-9 mx-auto" : "h-auto w-full"
                )}
              >
                {isCollapsed ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    用
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full p-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium shrink-0">
                      用
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-medium text-foreground truncate">设计师</div>
                      <div className="text-[10px] text-muted-foreground">专业版</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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

