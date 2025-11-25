"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Search, MapPin, Eye, ArrowUpDown, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

// 模拟数据
const mockCases = [
  {
    id: 1,
    title: "轩尼斯微端定制门窗-轻奢别墅-副本",
    image: "/modern-aluminum-sliding-window.jpg",
    location: "广东 佛山",
    views: 324,
    tags: ["副本"],
    area: 120,
    style: "轻奢",
    rooms: "4室2厅"
  },
  {
    id: 2,
    title: "原木奶油风-副本",
    image: "/luxury-sliding-glass-door.jpg",
    location: "河北 石家庄",
    views: 176,
    tags: ["副本"],
    area: 95,
    style: "奶油风",
    rooms: "3室2厅"
  },
  {
    id: 3,
    title: "华景名苑",
    image: "/modern-glass-window-facade.jpg",
    location: "浙江 台州",
    views: 112,
    tags: ["楼盘"],
    area: 150,
    style: "现代",
    rooms: "4室2厅"
  },
  {
    id: 4,
    title: "轩尼斯门窗|雷沃川·简法中古风",
    image: "/panoramic-floor-to-ceiling-window.jpg",
    location: "广东 佛山",
    views: 539,
    tags: [],
    area: 110,
    style: "中古风",
    rooms: "3室1厅"
  },
  {
    id: 5,
    title: "金铂川-北欧风格案例",
    image: "/commercial-building-with-large-windows-at-sunset.jpg",
    location: "浙江 杭州",
    views: 184,
    tags: [],
    area: 88,
    style: "北欧",
    rooms: "2室2厅"
  },
  {
    id: 6,
    title: "德嘉斯川日式原木风3室2厅118平",
    image: "/energy-efficient-thermal-break-window.jpg",
    location: "浙江 杭州",
    views: 198,
    tags: ["楼盘"],
    area: 118,
    style: "日式",
    rooms: "3室2厅"
  },
  {
    id: 7,
    title: "南沙 陈总",
    image: "/sliding-window-installation.jpg",
    location: "广东 广州",
    views: 91,
    tags: ["楼盘"],
    area: 135,
    style: "现代",
    rooms: "3室2厅"
  },
  {
    id: 8,
    title: "六客堂茶室",
    image: "/smart-casement-window-with-sensors.jpg",
    location: "广东 佛山",
    views: 73,
    tags: ["楼盘"],
    area: 200,
    style: "新中式",
    rooms: "复式"
  },
  {
    id: 9,
    title: "南村荣城",
    image: "/soundproof-window-with-acoustic-glass.jpg",
    location: "广东 佛山",
    views: 67,
    tags: ["楼盘"],
    area: 105,
    style: "简约",
    rooms: "3室2厅"
  },
  {
    id: 10,
    title: "恒大A07-1-方案2",
    image: "/premium-aluminum-sliding-window-system.jpg",
    location: "广东 佛山",
    views: 76,
    tags: ["楼盘"],
    area: 142,
    style: "欧式",
    rooms: "4室2厅"
  },
]

const areaRanges = [
  { label: "全部面积", value: "all" },
  { label: "50㎡以下", value: "0-50" },
  { label: "50-100㎡", value: "50-100" },
  { label: "100-150㎡", value: "100-150" },
  { label: "150-200㎡", value: "150-200" },
  { label: "200㎡以上", value: "200-999" },
]

const roomTypes = [
  { label: "全部户型", value: "all" },
  { label: "2室1厅", value: "2室1厅" },
  { label: "2室2厅", value: "2室2厅" },
  { label: "3室1厅", value: "3室1厅" },
  { label: "3室2厅", value: "3室2厅" },
  { label: "4室2厅", value: "4室2厅" },
  { label: "复式", value: "复式" },
]

const styles = [
  { label: "全部风格", value: "all" },
  { label: "现代简约", value: "现代" },
  { label: "北欧风", value: "北欧" },
  { label: "轻奢", value: "轻奢" },
  { label: "中古风", value: "中古风" },
  { label: "日式", value: "日式" },
  { label: "新中式", value: "新中式" },
  { label: "欧式", value: "欧式" },
  { label: "奶油风", value: "奶油风" },
]

export default function CasesPage() {
  const [selectedArea, setSelectedArea] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const [searchQuery, setSearchQuery] = useState("")

  // 筛选和排序逻辑
  const filteredCases = mockCases
    .filter((item) => {
      // 面积筛选
      if (selectedArea !== "all") {
        const [min, max] = selectedArea.split("-").map(Number)
        if (item.area < min || item.area > max) return false
      }
      // 户型筛选
      if (selectedRoom !== "all" && item.rooms !== selectedRoom) return false
      // 风格筛选
      if (selectedStyle !== "all" && item.style !== selectedStyle) return false
      // 搜索筛选
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.views - a.views
      }
      return b.id - a.id // 最新的id更大
    })

  return (
    <div className="min-h-screen bg-background">
      {/* 面包屑导航 */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5 h-10 px-3 -ml-2 text-muted-foreground hover:text-foreground transition-colors duration-200 touch-manipulation">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">首页</span>
                </Button>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium text-foreground">案例库</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* 顶部 Banner 区域 */}
      <div className="relative h-40 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400">
        <Image
          src="/architectural-blueprint-technical-drawing.jpg"
          alt="Banner"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        
        {/* 头像和标题 */}
        <div className="absolute left-8 bottom-6 flex items-end gap-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl">
            <Image
              src="/modern-glass-window-facade.jpg"
              alt="轩尼斯设计圈"
              fill
              className="object-cover"
            />
          </div>
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">轩尼斯设计圈</h1>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-7 px-3 text-xs bg-white/90 hover:bg-white transition-all duration-200"
            >
              切换
            </Button>
          </div>
        </div>
      </div>

      {/* 筛选和排序区域 */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* 左侧筛选区 */}
            <div className="flex items-center gap-3">
              {/* 全部按钮 */}
              <Button
                variant={selectedArea === "all" && selectedRoom === "all" && selectedStyle === "all" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-200"
                onClick={() => {
                  setSelectedArea("all")
                  setSelectedRoom("all")
                  setSelectedStyle("all")
                }}
              >
                全部
              </Button>

              {/* 面积筛选 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 transition-all duration-200">
                    {areaRanges.find(r => r.value === selectedArea)?.label || "面积"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {areaRanges.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => setSelectedArea(range.value)}
                      className="cursor-pointer"
                    >
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 户型筛选 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 transition-all duration-200">
                    {roomTypes.find(r => r.value === selectedRoom)?.label || "户型"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {roomTypes.map((room) => (
                    <DropdownMenuItem
                      key={room.value}
                      onClick={() => setSelectedRoom(room.value)}
                      className="cursor-pointer"
                    >
                      {room.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 风格筛选 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 transition-all duration-200">
                    {styles.find(s => s.value === selectedStyle)?.label || "风格"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {styles.map((style) => (
                    <DropdownMenuItem
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      className="cursor-pointer"
                    >
                      {style.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 中间排序区 */}
            <div className="flex items-center gap-1 text-sm">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 mr-2">排序:</span>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${sortBy === "latest" ? "text-blue-600 font-medium" : "text-gray-600"}`}
                onClick={() => setSortBy("latest")}
              >
                最新
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${sortBy === "popular" ? "text-blue-600 font-medium" : "text-gray-600"}`}
                onClick={() => setSortBy("popular")}
              >
                最热
              </Button>
            </div>

            {/* 右侧搜索框 */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索展示方案"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 方案列表 */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredCases.map((item) => (
              <Link
                key={item.id}
                href={`/cases/${item.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                  {/* 图片区域 */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* 标签 */}
                    {item.tags.length > 0 && (
                      <div className="absolute top-2 left-2 flex gap-1">
                        {item.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-blue-600 text-white text-xs px-2 py-0.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 信息区域 */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">暂无符合条件的设计方案</p>
          </div>
        )}
      </div>
    </div>
  )
}

