"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3x3, 
  List,
  Star,
  MapPin,
  Calendar,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"

// 模拟方案数据
const mockSchemes = [
  {
    id: "1",
    name: "阳光花园三期 A1户型封窗方案",
    coverImage: "/commercial-building-with-large-windows-at-sunset.jpg",
    rating: 5.0,
    area: 128.5,
    location: "深圳 · 南山区",
    updateTime: "1天前",
    tags: ["现代风格", "隔音降噪", "节能环保"],
    category: "uncategorized"
  },
  {
    id: "2",
    name: "碧海云天 B2户型豪华门窗设计",
    coverImage: "/luxury-sliding-glass-door.jpg",
    rating: 4.8,
    area: 95.0,
    location: "广州 · 天河区",
    updateTime: "3天前",
    tags: ["简约风格", "豪华型"],
    category: "uncategorized"
  },
  {
    id: "3",
    name: "华润城 C3户型智能门窗方案",
    coverImage: "/smart-casement-window-with-sensors.jpg",
    rating: 4.9,
    area: 156.0,
    location: "深圳 · 福田区",
    updateTime: "1周前",
    tags: ["豪华风格", "智能门窗"],
    category: "favorite"
  },
  {
    id: "4",
    name: "现代城市公寓全景玻璃窗",
    coverImage: "/modern-glass-window-facade.jpg",
    rating: 4.7,
    area: 88.0,
    location: "上海 · 浦东新区",
    updateTime: "2周前",
    tags: ["现代风格", "全景窗"],
    category: "uncategorized"
  },
  {
    id: "5",
    name: "海景别墅落地窗方案",
    coverImage: "/panoramic-floor-to-ceiling-window.jpg",
    rating: 5.0,
    area: 280.0,
    location: "三亚 · 海棠湾",
    updateTime: "3周前",
    tags: ["别墅", "落地窗", "豪华风格"],
    category: "favorite"
  },
  {
    id: "6",
    name: "节能环保办公楼门窗系统",
    coverImage: "/energy-efficient-thermal-break-window.jpg",
    rating: 4.6,
    area: 520.0,
    location: "北京 · 朝阳区",
    updateTime: "1个月前",
    tags: ["节能环保", "商业项目"],
    category: "uncategorized"
  },
  {
    id: "7",
    name: "隔音降噪卧室窗户设计",
    coverImage: "/soundproof-window-with-acoustic-glass.jpg",
    rating: 4.9,
    area: 25.0,
    location: "深圳 · 罗湖区",
    updateTime: "1个月前",
    tags: ["隔音降噪", "卧室专用"],
    category: "archived"
  },
  {
    id: "8",
    name: "高端铝合金推拉窗系统",
    coverImage: "/premium-aluminum-sliding-window-system.jpg",
    rating: 4.8,
    area: 180.0,
    location: "杭州 · 西湖区",
    updateTime: "2个月前",
    tags: ["高端系列", "推拉窗"],
    category: "favorite"
  },
  {
    id: "9",
    name: "现代铝合金推拉窗方案",
    coverImage: "/modern-aluminum-sliding-window.jpg",
    rating: 4.5,
    area: 110.0,
    location: "成都 · 高新区",
    updateTime: "2个月前",
    tags: ["现代风格", "经济实用"],
    category: "archived"
  }
]

export default function SchemesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredSchemes = mockSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || scheme.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                首页
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">我的方案</span>
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/design">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 touch-manipulation">
                  <Plus className="w-5 h-5 mr-2" />
                  新建方案
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的方案</h1>
          <p className="text-gray-600">管理和查看您的所有门窗设计方案</p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索方案名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg">
              <Filter className="w-5 h-5 mr-2" />
              筛选
            </Button>
            <div className="border rounded-lg p-1 flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">全部方案</TabsTrigger>
            <TabsTrigger value="favorite">收藏夹</TabsTrigger>
            <TabsTrigger value="uncategorized">未分类</TabsTrigger>
            <TabsTrigger value="archived">已归档</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 方案列表 */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <Link href={`/schemes/${scheme.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={scheme.coverImage}
                        alt={scheme.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-900">
                          <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                          {scheme.rating}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <Link href={`/schemes/${scheme.id}`}>
                    <CardTitle className="text-lg mb-2 hover:text-blue-600 transition-colors">
                      {scheme.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {scheme.location}
                      <span className="mx-2">·</span>
                      {scheme.area}㎡
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {scheme.updateTime}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {scheme.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <Link href={`/schemes/${scheme.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      查看详情
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <Link href={`/schemes/${scheme.id}`} className="shrink-0">
                      <div className="relative w-48 aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src={scheme.coverImage}
                          alt={scheme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/schemes/${scheme.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                          {scheme.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                          {scheme.rating}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {scheme.location}
                        </div>
                        <span>{scheme.area}㎡</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {scheme.updateTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scheme.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/schemes/${scheme.id}`}>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            复制
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Grid3x3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到方案</h3>
            <p className="text-gray-600 mb-6">试试调整搜索条件或创建新方案</p>
            <Link href="/design">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                新建方案
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}


