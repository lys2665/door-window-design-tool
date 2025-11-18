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
      category: "型材费用",
      items: [
        {
          name: "断桥铝型材",
          specification: "70系列",
          unit: "米",
          quantity: parseFloat(((width + height) * 2 / 1000).toFixed(2)),
          unitPrice: 280,
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
    <Card className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-5 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            详细报价单
          </h2>
          <Badge variant="secondary">专业定制</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          窗户尺寸：{width}mm × {height}mm （约{area.toFixed(2)}㎡）
        </p>
      </div>

      {/* 总价概览 */}
      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">预估总价</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              ¥{totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground space-y-1">
            <div>材料费：¥{materialCost.toLocaleString()}</div>
            <div>服务费：¥{serviceCost.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">包安装</Badge>
          <Badge variant="outline" className="text-xs">含运费</Badge>
          <Badge variant="outline" className="text-xs">10年质保</Badge>
        </div>
      </div>

      {/* 详细清单 */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-4">
          {quotationData.map((category, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-sm">{category.category}</div>
                <div className="flex-1 h-px bg-border" />
              </div>
              
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.specification}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="font-semibold text-sm">
                        ¥{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.quantity}{item.unit}</span>
                    <span>×</span>
                    <span>¥{item.unitPrice}/{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 底部操作 */}
      <div className="p-4 space-y-2">
        <Button className="w-full gap-2">
          <Download className="w-4 h-4" />
          下载报价单
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            打印
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
        </div>
      </div>
    </Card>
  )
}


