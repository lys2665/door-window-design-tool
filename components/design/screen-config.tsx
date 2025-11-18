"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScreenConfig } from "@/lib/style-config-types"
import { Info } from "lucide-react"

interface ScreenConfigProps {
  config: ScreenConfig
  onChange: (config: ScreenConfig) => void
}

export function ScreenConfigComponent({ config, onChange }: ScreenConfigProps) {
  const handleScreenChange = (field: keyof ScreenConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="font-semibold">纱网配置</h3>
      </div>
      
      {/* 纱网类型 */}
      <div className="space-y-2">
        <Label className="text-sm">纱网类型</Label>
        <Select 
          value={config.type}
          onValueChange={(value) => handleScreenChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fiberglass">玻璃纤维纱网</SelectItem>
            <SelectItem value="stainless">不锈钢纱网</SelectItem>
            <SelectItem value="diamond">金刚网</SelectItem>
            <SelectItem value="invisible">隐形纱网</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            {config.type === 'fiberglass' && '经济实惠，防蚊虫效果好'}
            {config.type === 'stainless' && '耐用性强，适合长期使用'}
            {config.type === 'diamond' && '高强度防护，防盗防坠落'}
            {config.type === 'invisible' && '美观隐形，不影响视野'}
          </span>
        </p>
      </div>
      
      {/* 纱网材质 */}
      <div className="space-y-2">
        <Label className="text-sm">纱网材质</Label>
        <Select 
          value={config.material}
          onValueChange={(value) => handleScreenChange('material', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.type === 'fiberglass' && (
              <>
                <SelectItem value="fiberglass-standard">标准玻纤</SelectItem>
                <SelectItem value="fiberglass-pet">宠物加强型</SelectItem>
              </>
            )}
            {config.type === 'stainless' && (
              <>
                <SelectItem value="stainless-201">201不锈钢</SelectItem>
                <SelectItem value="stainless-304">304不锈钢</SelectItem>
                <SelectItem value="stainless-316">316不锈钢</SelectItem>
              </>
            )}
            {config.type === 'diamond' && (
              <>
                <SelectItem value="stainless-steel">不锈钢丝</SelectItem>
                <SelectItem value="galvanized">镀锌钢丝</SelectItem>
              </>
            )}
            {config.type === 'invisible' && (
              <SelectItem value="polyester">聚酯纤维</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {/* 纱网颜色 */}
      <div className="space-y-2">
        <Label className="text-sm">纱网颜色</Label>
        <Select 
          value={config.color}
          onValueChange={(value) => handleScreenChange('color', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gray">灰色（常用）</SelectItem>
            <SelectItem value="black">黑色（透视好）</SelectItem>
            <SelectItem value="white">白色（明亮）</SelectItem>
            <SelectItem value="silver">银色（现代感）</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 网眼尺寸 */}
      <div className="space-y-2">
        <Label className="text-sm">网眼尺寸</Label>
        <Select 
          value={config.meshSize.toString()}
          onValueChange={(value) => handleScreenChange('meshSize', parseFloat(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.6">0.6mm（防小虫）</SelectItem>
            <SelectItem value="0.8">0.8mm（标准）</SelectItem>
            <SelectItem value="1.0">1.0mm（通风好）</SelectItem>
            <SelectItem value="1.2">1.2mm（金刚网）</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          网眼越小，防蚊虫效果越好，但通风性略差
        </p>
      </div>
      
      {/* 开启方式 */}
      <div className="space-y-2">
        <Label className="text-sm">开启方式</Label>
        <Select 
          value={config.openingType}
          onValueChange={(value) => handleScreenChange('openingType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">固定式</SelectItem>
            <SelectItem value="sliding">推拉式</SelectItem>
            <SelectItem value="retractable">可收缩式</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {config.openingType === 'fixed' && '固定安装，经济实惠'}
          {config.openingType === 'sliding' && '推拉开合，使用方便'}
          {config.openingType === 'retractable' && '自动收缩，美观大方'}
        </p>
      </div>
    </Card>
  )
}

