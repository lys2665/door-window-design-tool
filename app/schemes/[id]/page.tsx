"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Calendar, 
  User, 
  Edit2, 
  Copy, 
  Share2, 
  Trash2, 
  Eye, 
  Download, 
  Settings, 
  Image as ImageIcon,
  FileText,
  Presentation,
  Sparkles,
  Building,
  Home,
  Palette,
  ChevronDown,
  Tag,
  Globe,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Empty } from "@/components/ui/empty"
import { ThemeToggle } from "@/components/theme-toggle"

// 模拟数据
const mockSchemeData = {
  id: "1",
  name: "阳光花园三期 A1户型封窗方案",
  rating: 5.0,
  updateTime: "1天前修改",
  location: {
    city: "深圳",
    district: "南山区"
  },
  area: {
    total: 128.5,
    building: 120.0,
    inside: 95.8
  },
  floor: "12/33层",
  createDate: "2024-10-28",
  author: "张工",
  tags: ["120㎡以上", "现代风格", "隔音降噪", "节能环保"],
  privacy: "完全个人私有",
  floorPlan: "/architectural-blueprint-technical-drawing.jpg",
  windows: [
    {
      id: "w1",
      type: "豪华推拉窗",
      location: "客厅阳台",
      width: 2400,
      height: 1800,
      material: "断桥铝",
      color: "香槟色",
      brand: "凤铝789系列",
      glassType: "双层中空钢化玻璃 + Low-E镀膜",
      quantity: 2,
      image: "/luxury-sliding-glass-door.jpg"
    },
    {
      id: "w2",
      type: "智能平开窗",
      location: "主卧室",
      width: 1800,
      height: 1500,
      material: "断桥铝",
      color: "香槟色",
      brand: "凤铝789系列",
      glassType: "双层中空钢化玻璃",
      quantity: 1,
      image: "/smart-casement-window-with-sensors.jpg"
    },
    {
      id: "w3",
      type: "隔音平开窗",
      location: "次卧室",
      width: 1500,
      height: 1500,
      material: "断桥铝",
      color: "香槟色",
      brand: "凤铝789系列",
      glassType: "三层夹胶隔音玻璃",
      quantity: 2,
      image: "/soundproof-window-with-acoustic-glass.jpg"
    },
    {
      id: "w4",
      type: "节能推拉窗",
      location: "厨房",
      width: 1200,
      height: 1500,
      material: "断桥铝",
      color: "香槟色",
      brand: "凤铝789系列",
      glassType: "双层中空钢化玻璃 + 氩气填充",
      quantity: 1,
      image: "/energy-efficient-thermal-break-window.jpg"
    },
    {
      id: "w5",
      type: "落地推拉窗",
      location: "书房阳台",
      width: 2000,
      height: 2400,
      material: "断桥铝",
      color: "香槟色",
      brand: "凤铝789系列",
      glassType: "双层中空钢化玻璃",
      quantity: 1,
      image: "/panoramic-floor-to-ceiling-window.jpg"
    }
  ],
  renderings: [
    "/commercial-building-with-large-windows-at-sunset.jpg",
    "/modern-glass-window-facade.jpg",
    "/luxury-sliding-glass-door.jpg",
    "/panoramic-floor-to-ceiling-window.jpg",
    "/modern-aluminum-sliding-window.jpg",
    "/premium-aluminum-sliding-window-system.jpg"
  ],
  selectedImages: [
    "/luxury-sliding-glass-door.jpg",
    "/smart-casement-window-with-sensors.jpg",
    "/soundproof-window-with-acoustic-glass.jpg",
    "/energy-efficient-thermal-break-window.jpg"
  ],
  constructionDrawings: [
    "/architectural-blueprint-technical-drawing.jpg",
    "/sliding-window-profile-cross-section.jpg",
    "/aluminum-window-profile-technical-drawing-cross-se.jpg",
    "/sliding-window-hardware-detail.jpg"
  ],
  presentations: [
    {
      name: "阳光花园三期 A1户型封窗方案.pptx",
      size: "8.5 MB",
      date: "2024-10-28",
      thumbnail: "/video-player-interface.jpg"
    },
    {
      name: "施工进度演示文稿.pptx",
      size: "12.3 MB",
      date: "2024-10-27",
      thumbnail: "/construction-worker-on-site.png"
    }
  ]
}

export default function SchemeDetailPage({ params }: { params: { id: string } }) {
  const [scheme] = useState(mockSchemeData)
  const [activeTab, setActiveTab] = useState("renderings")
  const [isEditingName, setIsEditingName] = useState(false)

  // 计算门窗统计
  const windowStats = {
    totalCount: scheme.windows.reduce((sum, w) => sum + w.quantity, 0),
    types: [...new Set(scheme.windows.map(w => w.type))],
    totalArea: scheme.windows.reduce((sum, w) => sum + (w.width * w.height * w.quantity / 1000000), 0).toFixed(2)
  }

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
              <Link href="/schemes" className="text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                我的方案
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link href="/schemes?category=uncategorized" className="text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                未分类
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">方案详情</span>
            </nav>

            {/* 右侧操作按钮 */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="touch-manipulation">
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
              <Button variant="ghost" size="sm" className="touch-manipulation">
                <Edit2 className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button variant="ghost" size="sm" className="touch-manipulation">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 touch-manipulation">
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* 楼层示意图 + 方案基础信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 左侧：楼层示意图 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>楼层示意图</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={scheme.floorPlan} 
                  alt="楼层示意图" 
                  className="w-full h-full object-contain"
                />
              </div>
              <Button variant="outline" className="w-full">
                <ImageIcon className="w-4 h-4 mr-2" />
                设置为封面
              </Button>
            </CardContent>
          </Card>

          {/* 右侧：方案基础信息 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditingName ? (
                    <input
                      type="text"
                      defaultValue={scheme.name}
                      className="text-2xl font-bold border-b-2 border-blue-600 focus:outline-none w-full"
                      autoFocus
                      onBlur={() => setIsEditingName(false)}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{scheme.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingName(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{scheme.rating}</span>
                    </div>
                    <span>{scheme.updateTime}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{scheme.location.city} · {scheme.location.district}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 面积信息 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scheme.area.total}</div>
                  <div className="text-sm text-gray-600 mt-1">总面积 (㎡)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scheme.area.building}</div>
                  <div className="text-sm text-gray-600 mt-1">建筑面积 (㎡)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scheme.area.inside}</div>
                  <div className="text-sm text-gray-600 mt-1">套内面积 (㎡)</div>
                </div>
              </div>

              {/* 基础信息 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">楼层：</span>
                  <span className="font-medium">{scheme.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">创建日期：</span>
                  <span className="font-medium">{scheme.createDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">作者：</span>
                  <span className="font-medium">{scheme.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">隐私：</span>
                  <span className="font-medium">{scheme.privacy}</span>
                </div>
              </div>

              {/* 标签 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">方案标签</span>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    <Tag className="w-4 h-4 mr-1" />
                    编辑标签
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scheme.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮组 */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/design?schemeId=${scheme.id}`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Palette className="w-5 h-5 mr-2" />
                  去设计
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Eye className="w-5 h-5 mr-2" />
                3D预览
              </Button>
              <Button variant="outline" size="lg">
                <ImageIcon className="w-5 h-5 mr-2" />
                图册
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    全景图
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>客厅全景</DropdownMenuItem>
                  <DropdownMenuItem>卧室全景</DropdownMenuItem>
                  <DropdownMenuItem>阳台全景</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Settings className="w-5 h-5 mr-2" />
                    管理方案
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    复制方案
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit2 className="w-4 h-4 mr-2" />
                    重命名
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Home className="w-4 h-4 mr-2" />
                    移动到...
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除方案
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    导出
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>导出为图片</DropdownMenuItem>
                  <DropdownMenuItem>导出为PDF</DropdownMenuItem>
                  <DropdownMenuItem>导出为PPT</DropdownMenuItem>
                  <DropdownMenuItem>导出报价单</DropdownMenuItem>
                  <DropdownMenuItem>导出施工图</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* 门窗方案信息展示 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">门窗方案详情</CardTitle>
                <CardDescription className="mt-2">
                  共 {windowStats.totalCount} 扇门窗 · 总面积约 {windowStats.totalArea} ㎡ · 类型: {windowStats.types.join("、")}
                </CardDescription>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                下载报价清单
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 门窗列表 */}
            <div className="space-y-4">
              {scheme.windows.map((window) => (
                <Card key={window.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* 门窗效果图 */}
                      <div className="md:col-span-1">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={window.image || "/placeholder.jpg"} 
                            alt={window.type}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* 门窗信息 */}
                      <div className="md:col-span-3 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{window.type}</h3>
                            <p className="text-sm text-gray-600">{window.location}</p>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            x{window.quantity}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">尺寸</span>
                            <p className="font-medium mt-1">{window.width} × {window.height} mm</p>
                          </div>
                          <div>
                            <span className="text-gray-600">材质</span>
                            <p className="font-medium mt-1">{window.material}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">颜色</span>
                            <p className="font-medium mt-1">{window.color}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">品牌</span>
                            <p className="font-medium mt-1">{window.brand}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-700">
                            玻璃类型：{window.glassType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 下载附件 */}
            <Separator className="my-6" />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                下载施工说明PDF
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                下载安装指南
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                下载产品规格书
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 多标签内容区 */}
        <Card>
          <CardHeader>
            <CardTitle>方案内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="renderings">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  装修效果图
                </TabsTrigger>
                <TabsTrigger value="selected">
                  <Star className="w-4 h-4 mr-2" />
                  精选图
                </TabsTrigger>
                <TabsTrigger value="construction">
                  <FileText className="w-4 h-4 mr-2" />
                  施工图
                </TabsTrigger>
                <TabsTrigger value="presentation">
                  <Presentation className="w-4 h-4 mr-2" />
                  提案PPT
                </TabsTrigger>
              </TabsList>

              <TabsContent value="renderings" className="mt-6">
                {scheme.renderings.length === 0 ? (
                  <Empty
                    icon={<ImageIcon className="w-16 h-16 text-gray-400" />}
                    title="您还没有渲染装修效果图"
                    description="开始渲染，查看您的设计效果"
                  >
                    <Button className="mt-4">
                      <Sparkles className="w-4 h-4 mr-2" />
                      去渲染
                    </Button>
                  </Empty>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {scheme.renderings.map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg">
                        <img src={img} alt={`效果图 ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="selected" className="mt-6">
                {scheme.selectedImages.length === 0 ? (
                  <Empty
                    icon={<Star className="w-16 h-16 text-gray-400" />}
                    title="还没有精选图片"
                    description="从您的设计中选择亮点图片"
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {scheme.selectedImages.map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg">
                        <img src={img} alt={`精选图 ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="construction" className="mt-6">
                {scheme.constructionDrawings.length === 0 ? (
                  <Empty
                    icon={<FileText className="w-16 h-16 text-gray-400" />}
                    title="还没有施工图"
                    description="生成施工图以便于实际安装"
                  >
                    <Button className="mt-4" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      生成施工图
                    </Button>
                  </Empty>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {scheme.constructionDrawings.map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg">
                        <img src={img} alt={`施工图 ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="presentation" className="mt-6">
                {scheme.presentations.length === 0 ? (
                  <Empty
                    icon={<Presentation className="w-16 h-16 text-gray-400" />}
                    title="还没有提案PPT"
                    description="生成专业的提案演示文件"
                  >
                    <Button className="mt-4" variant="outline">
                      <Presentation className="w-4 h-4 mr-2" />
                      生成提案PPT
                    </Button>
                  </Empty>
                ) : (
                  <div className="space-y-4">
                    {scheme.presentations.map((ppt, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Presentation className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">{ppt.name}</p>
                              <p className="text-sm text-gray-600">{ppt.size} · {ppt.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              预览
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              下载
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


