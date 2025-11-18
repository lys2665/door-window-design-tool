"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Eye, Share2, Heart, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 模拟详情数据
const mockCaseDetails = {
  1: {
    id: 1,
    title: "轩尼斯微端定制门窗-轻奢别墅-副本",
    image: "/modern-aluminum-sliding-window.jpg",
    location: "广东 佛山",
    views: 324,
    likes: 45,
    tags: ["副本", "轻奢", "别墅"],
    area: 120,
    style: "轻奢",
    rooms: "4室2厅",
    description: "本方案采用轻奢设计风格，注重细节与品质的完美结合。门窗系统选用轩尼斯高端定制系列，具有优异的隔音、隔热性能。设计充分考虑了采光与通风的平衡，为业主打造舒适宜居的生活空间。",
    features: [
      "高端铝合金型材",
      "三层中空玻璃",
      "智能开启系统",
      "优质五金配件",
      "定制化设计"
    ],
    images: [
      "/modern-aluminum-sliding-window.jpg",
      "/luxury-sliding-glass-door.jpg",
      "/modern-glass-window-facade.jpg",
      "/panoramic-floor-to-ceiling-window.jpg"
    ]
  }
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = Number(params.id)
  
  // 获取案例详情（实际项目中应该从API获取）
  const caseDetail = mockCaseDetails[caseId as keyof typeof mockCaseDetails] || {
    id: caseId,
    title: "设计方案详情",
    image: "/modern-aluminum-sliding-window.jpg",
    location: "广东 佛山",
    views: 100,
    likes: 10,
    tags: ["现代"],
    area: 100,
    style: "现代",
    rooms: "3室2厅",
    description: "精心设计的门窗解决方案，为您的家居生活带来更多可能。",
    features: ["优质材料", "专业设计", "精工细作"],
    images: ["/modern-aluminum-sliding-window.jpg"]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* 面包屑导航 */}
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Home className="h-3.5 w-3.5" />
                  <span className="text-xs">首页</span>
                </Button>
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/cases">
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <span className="text-xs">案例库</span>
                </Button>
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-foreground">方案详情</span>
            </div>
            
            {/* 返回按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧图片展示区 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 主图 */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={caseDetail.image}
                alt={caseDetail.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 图片画廊 */}
            <div className="grid grid-cols-4 gap-4">
              {caseDetail.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
                >
                  <Image
                    src={img}
                    alt={`图片 ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {/* 方案描述 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">方案描述</h2>
              <p className="text-gray-600 leading-relaxed">{caseDetail.description}</p>
            </div>

            {/* 特点展示 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">方案特点</h2>
              <div className="grid grid-cols-2 gap-3">
                {caseDetail.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧信息栏 */}
          <div className="space-y-4">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {caseDetail.title}
              </h1>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {caseDetail.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* 详细信息 */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-500">户型</span>
                  <span className="font-medium text-gray-900">{caseDetail.rooms}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-500">面积</span>
                  <span className="font-medium text-gray-900">{caseDetail.area}㎡</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-500">风格</span>
                  <span className="font-medium text-gray-900">{caseDetail.style}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    位置
                  </span>
                  <span className="font-medium text-gray-900">{caseDetail.location}</span>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{caseDetail.views} 浏览</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Heart className="w-4 h-4" />
                  <span>{caseDetail.likes} 点赞</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                  立即咨询
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2 transition-all duration-200">
                    <Heart className="w-4 h-4" />
                    收藏
                  </Button>
                  <Button variant="outline" className="gap-2 transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                    分享
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关推荐 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">相关推荐</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* 这里可以添加相关案例的推荐 */}
            <div className="text-center py-12 col-span-full text-gray-400">
              更多精彩案例即将推出
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

