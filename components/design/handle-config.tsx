"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HandleConfig, handleColors, handleStyles } from "@/lib/style-config-types"
import { Check, Lock, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface HandleConfigProps {
  config: HandleConfig
  onChange: (config: HandleConfig) => void
}

export function HandleConfigComponent({ config, onChange }: HandleConfigProps) {
  const handleChange = (field: keyof HandleConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="font-semibold">执手配置</h3>
      </div>
      
      {/* 执手样式 */}
      <div className="space-y-2">
        <Label className="text-sm">执手样式</Label>
        <div className="grid grid-cols-2 gap-2">
          {handleStyles.map(style => {
            const Icon = style.value === 'lock' ? Lock : Minus
            return (
              <button
                key={style.value}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all text-left",
                  config.style === style.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => handleChange('style', style.value)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{style.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {style.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* 执手材质 */}
      <div className="space-y-2">
        <Label className="text-sm">执手材质</Label>
        <Select 
          value={config.material}
          onValueChange={(value) => handleChange('material', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aluminum">铝合金（轻便耐用）</SelectItem>
            <SelectItem value="zinc">锌合金（性价比高）</SelectItem>
            <SelectItem value="stainless">不锈钢（高端耐腐蚀）</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 执手颜色 */}
      <div className="space-y-2">
        <Label className="text-sm">执手颜色</Label>
        <div className="grid grid-cols-6 gap-2">
          {handleColors.map(color => (
            <button
              key={color.value}
              className={cn(
                "w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center",
                config.color === color.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300"
              )}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleChange('color', color.value)}
              title={color.label}
            >
              {config.color === color.value && (
                <Check className="w-5 h-5 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* 离地高度 */}
      <div className="space-y-2">
        <Label className="text-sm">离地高度 (mm)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={config.heightFromGround}
            onChange={(e) => handleChange('heightFromGround', Number(e.target.value))}
            min={900}
            max={1500}
            step={50}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange('heightFromGround', 1200)}
          >
            默认
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          推荐高度：1100-1300mm（当前：{config.heightFromGround}mm）
        </p>
      </div>
      
      {/* 执手位置 */}
      <div className="space-y-2">
        <Label className="text-sm">执手位置</Label>
        <Select 
          value={config.position}
          onValueChange={(value) => handleChange('position', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">左侧</SelectItem>
            <SelectItem value="right">右侧</SelectItem>
            <SelectItem value="center">中间</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}

