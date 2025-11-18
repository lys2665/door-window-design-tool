"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TopBarProps {
  showSearch?: boolean
  showNewButton?: boolean
  searchPlaceholder?: string
  newButtonText?: string
  onNewClick?: () => void
}

export function TopBar({ 
  showSearch = true, 
  showNewButton = true,
  searchPlaceholder = "搜索设计方案、产品、案例...",
  newButtonText = "新建设计",
  onNewClick
}: TopBarProps) {
  if (!showSearch && !showNewButton) return null

  return (
    <div className="mb-6 md:mb-8 lg:mb-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
      {showSearch && (
        <div className="relative flex-1 max-w-xl md:max-w-2xl lg:max-w-3xl">
          <Search className="absolute left-3 md:left-4 top-1/2 h-5 w-5 md:h-6 md:w-6 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder={searchPlaceholder}
            className="pl-10 md:pl-12 h-12 md:h-13 lg:h-14 text-sm md:text-base" 
          />
        </div>
      )}
      
      {showNewButton && (
        <Button 
          size="lg" 
          className="gap-2 w-full sm:w-auto h-12 md:h-13 lg:h-14 px-6 md:px-8 text-sm md:text-base"
          onClick={onNewClick}
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
          {newButtonText}
        </Button>
      )}
    </div>
  )
}

