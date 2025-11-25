"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Printer, Share2 } from "lucide-react"

interface QuotationItem {
  category: string
  items: {
    name: string
    specification: string
    unit: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}

interface QuotationPanelProps {
  windowData?: {
    width: number
    height: number
  }
  styleConfig?: any
}

export function QuotationPanel({ windowData, styleConfig }: QuotationPanelProps) {
  // 计算窗户面积
  const width = windowData?.width || 2400
  const height = windowData?.height || 1800
  const area = (width * height) / 1000000 // 转换为平方米
  
  // 报价数据（基于实际配置动态计算）
  const quotationData: QuotationItem[] = [
    {
      category: "整窗报价",
      items: [
        {
          name: "断桥铝70系列",
          specification: "",
          unit: "㎡",
          quantity: parseFloat(area.toFixed(2)),
          unitPrice: 1080,
          totalPrice: 0
        },
        {
          name: "窗扇计价",
          specification: "",
          unit: "扇",
          quantity: 2,
          unitPrice: 680,
          totalPrice: 0
        }
      ]
    },
    {
      category: "玻璃费用",
      items: [
        {
          name: "双层中空玻璃",
          specification: "5+12A+5",
          unit: "㎡",
          quantity: parseFloat(area.toFixed(2)),
          unitPrice: 480,
          totalPrice: 0
        }
      ]
    },
    {
      category: "五金配件",
      items: [
        {
          name: "执手",
          specification: "标准执手/铝合金",
          unit: "套",
          quantity: 2,
          unitPrice: 180,
          totalPrice: 360
        },
        {
          name: "合页",
          specification: "不锈钢合页",
          unit: "套",
          quantity: 4,
          unitPrice: 45,
          totalPrice: 180
        },
        {
          name: "锁具",
          specification: "多点锁",
          unit: "套",
          quantity: 1,
          unitPrice: 220,
          totalPrice: 220
        }
      ]
    },
    {
      category: "纱网费用",
      items: [
        {
          name: "金刚网纱窗",
          specification: "0.8mm网眼",
          unit: "㎡",
          quantity: parseFloat(area.toFixed(2)),
          unitPrice: 180,
          totalPrice: 0
        }
      ]
    },
    {
      category: "安装服务",
      items: [
        {
          name: "上门测量",
          specification: "专业测量师",
          unit: "次",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        },
        {
          name: "拆旧窗",
          specification: "旧窗拆除及清理",
          unit: "㎡",
          quantity: parseFloat(area.toFixed(2)),
          unitPrice: 80,
          totalPrice: 0
        },
        {
          name: "安装费",
          specification: "含辅料及密封",
          unit: "㎡",
          quantity: parseFloat(area.toFixed(2)),
          unitPrice: 180,
          totalPrice: 0
        }
      ]
    }
  ]

  // 计算每项的总价
  quotationData.forEach(category => {
    category.items.forEach(item => {
      if (item.totalPrice === 0) {
        item.totalPrice = parseFloat((item.quantity * item.unitPrice).toFixed(2))
      }
    })
  })

  // 计算总价
  const totalAmount = quotationData.reduce((sum, category) => {
    return sum + category.items.reduce((catSum, item) => catSum + item.totalPrice, 0)
  }, 0)

  const materialCost = quotationData.slice(0, 4).reduce((sum, category) => {
    return sum + category.items.reduce((catSum, item) => catSum + item.totalPrice, 0)
  }, 0)

  const serviceCost = quotationData[4].items.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <Card className="h-full flex flex-col relative">
      {/* 头部 - 简化 */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-base font-bold">报价单</h2>
          <Badge variant="secondary" className="text-xs">专业定制</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          尺寸：{width}×{height}mm （{area.toFixed(2)}㎡）
        </p>
      </div>

      {/* 总价概览 - 紧凑版 */}
      <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">预估总价</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              ¥{totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>材料：¥{materialCost.toLocaleString()}</div>
            <div>服务：¥{serviceCost.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-xs mt-2 flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-[10px] h-5">包安装</Badge>
          <Badge variant="outline" className="text-[10px] h-5">含运费</Badge>
          <Badge variant="outline" className="text-[10px] h-5">10年质保</Badge>
        </div>
      </div>

      {/* 详细清单 - 减少模块分割 */}
      <div className="flex-1 overflow-auto pb-16">
        <div className="p-3 space-y-3">
          {quotationData.map((category, idx) => (
            <div key={idx}>
              {/* 分类标题 - 更简洁 */}
              <div className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">
                {category.category}
              </div>
              
              {/* 项目列表 - 紧凑布局 */}
              <div className="space-y-1.5">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-muted/20 rounded-lg p-2.5">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs">{item.name}</div>
                        {item.specification && (
                          <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                            {item.specification}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-2 shrink-0">
                        <div className="font-semibold text-xs">
                          ¥{item.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{item.quantity}{item.unit}</span>
                      <span>×</span>
                      <span>¥{item.unitPrice}/{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作按钮 - 悬浮置底，一排 */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-background border-t shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
            <Download className="w-3.5 h-3.5" />
            下载
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
            <Printer className="w-3.5 h-3.5" />
            打印
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
            <Share2 className="w-3.5 h-3.5" />
            分享
          </Button>
        </div>
      </div>
    </Card>
  )
}


