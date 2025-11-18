import Link from "next/link"
import {
  Home,
  ArrowLeft,
  Play,
  Download,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from a database
const productDetails = {
  "premium-sliding": {
    name: "尊享系列推拉窗",
    category: "推拉窗",
    description: "高端铝合金推拉窗系统，适用于高层建筑和别墅项目。采用德国进口五金配件，确保长久使用寿命。",
    mainImage: "/premium-aluminum-sliding-window-system.jpg",
    specifications: {
      windResistance: "9级（≥5.0kPa）",
      waterTightness: "6级（≥600Pa）",
      airTightness: "8级（≤0.5m³/m·h）",
      soundInsulation: "40dB",
      profileThickness: "2.0mm",
      glassType: "5+12A+5 中空钢化玻璃",
      frameWidth: "80mm",
      hardware: "德国进口品牌",
    },
    features: [
      "采用航空级铝合金型材，强度高、耐腐蚀",
      "多腔体结构设计，隔热保温性能优异",
      "德国进口滑轮系统，推拉顺畅静音",
      "三道密封设计，防水防尘效果显著",
      "可选配智能传感器和电动开启系统",
    ],
    images: [
      "/sliding-window-profile-cross-section.jpg",
      "/sliding-window-hardware-detail.jpg",
      "/sliding-window-installation.jpg",
    ],
    videoUrl: "/video-player-interface.jpg",
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = productDetails[params.id as keyof typeof productDetails] || productDetails["premium-sliding"]

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <main className="w-full overflow-auto">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Breadcrumb Navigation - 优化占位 */}
          <nav className="flex items-center gap-2 mb-4 sm:mb-5 lg:mb-6 text-xs md:text-sm">
            <Link href="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>首页</span>
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              产品库
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-foreground font-medium">详情</span>
          </nav>

          {/* Product Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3">
                  {product.category}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
                <p className="text-base lg:text-lg text-muted-foreground max-w-3xl">{product.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent w-full sm:w-auto">
                  <Download className="h-5 w-5" />
                  下载资料
                </Button>
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  开始设计
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="mb-6 lg:mb-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.mainImage || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="mb-6 lg:mb-8">
            <TabsList className="mb-5 lg:mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="specs" className="text-sm lg:text-base">
                技术参数
              </TabsTrigger>
              <TabsTrigger value="features" className="text-sm lg:text-base">
                产品特点
              </TabsTrigger>
              <TabsTrigger value="gallery" className="text-sm lg:text-base">
                产品图库
              </TabsTrigger>
              <TabsTrigger value="video" className="text-sm lg:text-base">
                视频介绍
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="space-y-5 lg:space-y-6">
              <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-5 lg:mb-6">性能参数</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">抗风压性能</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.windResistance}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">水密性能</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.waterTightness}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">气密性能</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.airTightness}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">隔音性能</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.soundInsulation}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">型材壁厚</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.profileThickness}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">玻璃配置</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.glassType}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">框架宽度</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.frameWidth}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-border">
                      <span className="text-sm lg:text-base text-muted-foreground">五金配件</span>
                      <span className="text-sm lg:text-base font-medium text-foreground">
                        {product.specifications.hardware}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4">型材样角图</h3>
                <div className="aspect-[2/1] rounded-lg bg-muted flex items-center justify-center">
                  <img
                    src="/aluminum-window-profile-technical-drawing-cross-se.jpg"
                    alt="型材样角图"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-5 lg:mb-6">产品特点</h3>
                <div className="space-y-3 lg:space-y-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg bg-muted/50">
                      <div className="flex h-7 w-7 lg:h-8 lg:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm lg:text-base text-foreground leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4">应用场景</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="住宅应用"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="商业应用"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden lg:block hidden">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="酒店应用"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-[4/3] rounded-xl bg-muted overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`产品图片 ${index + 1}`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="video">
              <div className="rounded-xl border border-border bg-card p-5 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-4">产品视频介绍</h3>
                <div className="aspect-video rounded-lg bg-muted overflow-hidden relative group cursor-pointer">
                  <img
                    src={product.videoUrl || "/placeholder.svg"}
                    alt="视频封面"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-white/90 group-hover:bg-white transition-colors">
                      <Play className="h-8 w-8 lg:h-10 lg:w-10 text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  观看完整的产品介绍视频，了解产品的设计理念、制造工艺和安装过程。
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">准备好开始设计了吗？</h3>
                <p className="text-sm lg:text-base text-muted-foreground">使用此产品系列创建您的门窗设计方案</p>
              </div>
              <Button size="lg" className="gap-2 w-full lg:w-auto">
                进入设计工具
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
