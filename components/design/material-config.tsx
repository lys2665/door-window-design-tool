"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MaterialConfig, materialColors } from "@/lib/style-config-types"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MaterialConfigProps {
  config: MaterialConfig
  onChange: (config: MaterialConfig) => void
}

export function MaterialConfigComponent({ config, onChange }: MaterialConfigProps) {
  const handleMaterialChange = (
    location: 'indoor' | 'outdoor',
    field: keyof MaterialConfig['indoor'],
    value: string
  ) => {
    onChange({
      ...config,
      [location]: {
        ...config[location],
        [field]: value
      }
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="font-semibold">材质配置</h3>
      </div>
      
      {/* 室内材质 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">室内材质</Label>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">材质类型</Label>
          <Select 
            value={config.indoor.type}
            onValueChange={(value) => handleMaterialChange('indoor', 'type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluminum">断桥铝</SelectItem>
              <SelectItem value="wood">实木</SelectItem>
              <SelectItem value="upvc">塑钢</SelectItem>
              <SelectItem value="composite">复合材料</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* 系列选择 */}
        {config.indoor.type === 'aluminum' && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">断桥铝系列</Label>
            <Select 
              value={config.indoor.series}
              onValueChange={(value) => handleMaterialChange('indoor', 'series', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择系列" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">断桥铝60系列</SelectItem>
                <SelectItem value="70">断桥铝70系列</SelectItem>
                <SelectItem value="80">断桥铝80系列</SelectItem>
                <SelectItem value="108">断桥铝108系列</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* 颜色选择 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">颜色</Label>
          <div className="grid grid-cols-6 gap-2">
            {materialColors.map(color => (
              <button
                key={color.value}
                className={cn(
                  "w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center",
                  config.indoor.color === color.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleMaterialChange('indoor', 'color', color.value)}
                title={color.label}
              >
                {config.indoor.color === color.value && (
                  <Check className="w-5 h-5 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* 表面处理 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">表面处理</Label>
          <Select 
            value={config.indoor.surfaceFinish}
            onValueChange={(value) => handleMaterialChange('indoor', 'surfaceFinish', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="powder-coating">静电喷涂</SelectItem>
              <SelectItem value="wood-grain">木纹转印</SelectItem>
              <SelectItem value="brushed">拉丝处理</SelectItem>
              <SelectItem value="anodized">阳极氧化</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 分隔线 */}
      <div className="border-t pt-3" />
      
      {/* 室外材质 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">室外材质</Label>
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => onChange({
              ...config,
              outdoor: { ...config.indoor }
            })}
          >
            与室内相同
          </button>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">材质类型</Label>
          <Select 
            value={config.outdoor.type}
            onValueChange={(value) => handleMaterialChange('outdoor', 'type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluminum">断桥铝</SelectItem>
              <SelectItem value="wood">实木</SelectItem>
              <SelectItem value="upvc">塑钢</SelectItem>
              <SelectItem value="composite">复合材料</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* 系列选择 */}
        {config.outdoor.type === 'aluminum' && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">断桥铝系列</Label>
            <Select 
              value={config.outdoor.series}
              onValueChange={(value) => handleMaterialChange('outdoor', 'series', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择系列" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">断桥铝60系列</SelectItem>
                <SelectItem value="70">断桥铝70系列</SelectItem>
                <SelectItem value="80">断桥铝80系列</SelectItem>
                <SelectItem value="108">断桥铝108系列</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* 颜色选择 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">颜色</Label>
          <div className="grid grid-cols-6 gap-2">
            {materialColors.map(color => (
              <button
                key={color.value}
                className={cn(
                  "w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center",
                  config.outdoor.color === color.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleMaterialChange('outdoor', 'color', color.value)}
                title={color.label}
              >
                {config.outdoor.color === color.value && (
                  <Check className="w-5 h-5 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* 表面处理 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">表面处理</Label>
          <Select 
            value={config.outdoor.surfaceFinish}
            onValueChange={(value) => handleMaterialChange('outdoor', 'surfaceFinish', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="powder-coating">静电喷涂</SelectItem>
              <SelectItem value="wood-grain">木纹转印</SelectItem>
              <SelectItem value="brushed">拉丝处理</SelectItem>
              <SelectItem value="anodized">阳极氧化</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}

