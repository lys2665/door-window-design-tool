import Link from "next/link"
import { Package, ArrowRight, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TopBar } from "@/components/topbar"

const productSeries = [
  {
    id: "premium-sliding",
    name: "尊享系列推拉窗",
    category: "推拉窗",
    description: "高端铝合金推拉窗系统，适用于高层建筑和别墅",
    image: "/modern-aluminum-sliding-window.jpg",
    features: ["抗风压9级", "水密性6级", "气密性8级"],
    color: "blue",
  },
  {
    id: "smart-casement",
    name: "智能平开窗系列",
    category: "平开窗",
    description: "智能化平开窗系统，配备自动开关和传感器",
    image: "/smart-casement-window-with-sensors.jpg",
    features: ["抗风压8级", "水密性5级", "气密性7级"],
    color: "purple",
  },
  {
    id: "panoramic-floor",
    name: "全景落地窗系列",
    category: "落地窗",
    description: "超大视野落地窗系统，打造通透空间",
    image: "/panoramic-floor-to-ceiling-window.jpg",
    features: ["抗风压7级", "水密性6级", "气密性6级"],
    color: "orange",
  },
  {
    id: "luxury-sliding-door",
    name: "豪华推拉门系列",
    category: "推拉门",
    description: "大尺寸推拉门系统，适用于阳台和庭院",
    image: "/luxury-sliding-glass-door.jpg",
    features: ["抗风压8级", "水密性5级", "气密性7级"],
    color: "teal",
  },
  {
    id: "energy-saving",
    name: "节能断桥系列",
    category: "平开窗",
    description: "断桥铝合金窗系统，优异的隔热保温性能",
    image: "/energy-efficient-thermal-break-window.jpg",
    features: ["抗风压9级", "水密性6级", "气密性8级"],
    color: "green",
  },
  {
    id: "soundproof",
    name: "静音隔音系列",
    category: "推拉窗",
    description: "专业隔音窗系统，降噪效果显著",
    image: "/soundproof-window-with-acoustic-glass.jpg",
    features: ["抗风压8级", "水密性6级", "气密性9级"],
    color: "indigo",
  },
]

const colorMap = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
}

export default function ProductsPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <main className="w-full overflow-auto">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 max-w-[1800px] mx-auto">
          {/* Header with Back Button - 优化占位 */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground">
                  <Home className="h-3.5 w-3.5" />
                  <span className="text-xs">首页</span>
                </Button>
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-foreground">产品库</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">产品库</h1>
            <p className="text-sm lg:text-base text-muted-foreground">浏览我们的门窗产品系列，选择适合您项目的产品</p>
          </div>

          {/* Top Bar */}
          <TopBar 
            searchPlaceholder="搜索产品系列、型号、性能参数..." 
            showNewButton={false}
          />

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {productSeries.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:border-primary/50">
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <div
                      className={`absolute left-4 top-4 flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl ${colorMap[product.color as keyof typeof colorMap]}`}
                    >
                      <Package className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>

                  <div className="p-5 lg:p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-muted px-2.5 lg:px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-sm font-medium text-primary">
                      查看详情
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
