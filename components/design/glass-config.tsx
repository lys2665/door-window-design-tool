"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GlassConfig } from "@/lib/style-config-types"
import { Info } from "lucide-react"

interface GlassConfigProps {
  config: GlassConfig
  onChange: (config: GlassConfig) => void
}

export function GlassConfigComponent({ config, onChange }: GlassConfigProps) {
  const handleGlassChange = (field: keyof GlassConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-primary rounded-full" />
        <h3 className="font-semibold">玻璃配置</h3>
      </div>
      
      {/* 玻璃类型 */}
      <div className="space-y-2">
        <Label className="text-sm">玻璃类型</Label>
        <Select 
          value={config.type}
          onValueChange={(value) => handleGlassChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tempered">钢化玻璃</SelectItem>
            <SelectItem value="laminated">夹胶玻璃</SelectItem>
            <SelectItem value="low-e">Low-E玻璃</SelectItem>
            <SelectItem value="double">双层中空玻璃</SelectItem>
            <SelectItem value="triple">三层中空玻璃</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            {config.type === 'tempered' && '安全性高，破碎后成颗粒状'}
            {config.type === 'laminated' && '夹层设计，隔音防爆性能好'}
            {config.type === 'low-e' && '低辐射镀膜，节能保温'}
            {config.type === 'double' && '双层中空，隔热隔音'}
            {config.type === 'triple' && '三层中空，隔热隔音性能最佳'}
          </span>
        </p>
      </div>
      
      {/* 玻璃规格 */}
      <div className="space-y-2">
        <Label className="text-sm">玻璃规格</Label>
        <Select 
          value={config.specification}
          onValueChange={(value) => handleGlassChange('specification', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(config.type === 'double' || config.type === 'low-e') && (
              <>
                <SelectItem value="5+9A+5">5+9A+5 (总厚19mm)</SelectItem>
                <SelectItem value="5+12A+5">5+12A+5 (总厚22mm)</SelectItem>
                <SelectItem value="6+12A+6">6+12A+6 (总厚24mm)</SelectItem>
                <SelectItem value="6+16A+6">6+16A+6 (总厚28mm)</SelectItem>
              </>
            )}
            {config.type === 'triple' && (
              <>
                <SelectItem value="5+9A+5+9A+5">5+9A+5+9A+5 (总厚33mm)</SelectItem>
                <SelectItem value="5+12A+5+12A+5">5+12A+5+12A+5 (总厚39mm)</SelectItem>
                <SelectItem value="6+12A+6+12A+6">6+12A+6+12A+6 (总厚42mm)</SelectItem>
              </>
            )}
            {(config.type === 'tempered' || config.type === 'laminated') && (
              <>
                <SelectItem value="5mm">5mm</SelectItem>
                <SelectItem value="6mm">6mm</SelectItem>
                <SelectItem value="8mm">8mm</SelectItem>
                <SelectItem value="10mm">10mm</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          A表示空气层，数字表示厚度(mm)
        </p>
      </div>
      
      {/* 镀膜类型 */}
      {(config.type === 'low-e' || config.type === 'double' || config.type === 'triple') && (
        <div className="space-y-2">
          <Label className="text-sm">镀膜类型</Label>
          <Select 
            value={config.coating}
            onValueChange={(value) => handleGlassChange('coating', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low-e">Low-E镀膜</SelectItem>
              <SelectItem value="solar-control">阳光控制</SelectItem>
              <SelectItem value="self-cleaning">自清洁镀膜</SelectItem>
              <SelectItem value="none">无镀膜</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* 透光率 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">透光率</Label>
          <span className="text-sm font-medium text-primary">
            {config.transparency}%
          </span>
        </div>
        <Slider
          value={[config.transparency]}
          onValueChange={([value]) => handleGlassChange('transparency', value)}
          min={30}
          max={90}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>低透光</span>
          <span>高透光</span>
        </div>
      </div>
      
      {/* 隔音等级 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">隔音等级</Label>
          <span className="text-sm font-medium text-primary">
            {config.soundInsulation} dB
          </span>
        </div>
        <Slider
          value={[config.soundInsulation]}
          onValueChange={([value]) => handleGlassChange('soundInsulation', value)}
          min={25}
          max={45}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>基础隔音</span>
          <span>专业隔音</span>
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            {config.soundInsulation <= 30 && '适合普通住宅环境'}
            {config.soundInsulation > 30 && config.soundInsulation <= 35 && '适合临街房屋'}
            {config.soundInsulation > 35 && '适合高噪音环境，如机场、高架附近'}
          </span>
        </p>
      </div>
    </Card>
  )
}

