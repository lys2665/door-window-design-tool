"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StyleConfig, defaultStyleConfig, SashConfig } from '@/lib/style-config-types'
import { MaterialConfigComponent } from './material-config'
import { GlassConfigComponent } from './glass-config'
import { HandleConfigComponent } from './handle-config'
import { ScreenConfigComponent } from './screen-config'
import { Window3DPreview } from './window-3d-preview'
import { Save, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface StyleConfiguratorProps {
  windowData?: {
    width: number
    height: number
    sashes?: any[]
  }
  onConfigChange?: (config: StyleConfig) => void
}

export function StyleConfigurator({ windowData, onConfigChange }: StyleConfiguratorProps) {
  const [config, setConfig] = useState<StyleConfig>(defaultStyleConfig)
  const [configMode, setConfigMode] = useState<'unified' | 'individual'>('unified')
  const [selectedSashId, setSelectedSashId] = useState<string | null>(null)

  // 配置变更时通知父组件
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config)
    }
  }, [config, onConfigChange])

  // 切换配置模式
  const handleModeChange = (mode: 'unified' | 'individual') => {
    setConfigMode(mode)
    setConfig(prev => ({
      ...prev,
      configMode: mode
    }))
  }

  // 更新统一配置
  const updateUnifiedConfig = <K extends keyof NonNullable<StyleConfig['unified']>>(
    key: K,
    value: NonNullable<StyleConfig['unified']>[K]
  ) => {
    setConfig(prev => ({
      ...prev,
      unified: {
        ...prev.unified!,
        [key]: value
      }
    }))
  }

  // 保存配置
  const handleSaveConfig = () => {
    const configToSave = {
      ...config,
      timestamp: Date.now(),
      version: '1.0'
    }
    
    localStorage.setItem('window-style-config', JSON.stringify(configToSave))
    
    toast.success('配置已保存', {
      description: '您的配置已成功保存到本地'
    })
  }

  // 加载配置
  const handleLoadConfig = () => {
    const saved = localStorage.getItem('window-style-config')
    if (saved) {
      try {
        const loadedConfig = JSON.parse(saved)
        setConfig(loadedConfig)
        setConfigMode(loadedConfig.configMode || 'unified')
        
        toast.success('配置已加载', {
          description: '已加载之前保存的配置'
        })
      } catch (error) {
        toast.error('加载失败', {
          description: '配置文件格式错误'
        })
      }
    } else {
      toast.info('无保存记录', {
        description: '暂无已保存的配置'
      })
    }
  }

  // 重置默认配置
  const handleResetConfig = () => {
    setConfig(defaultStyleConfig)
    setConfigMode('unified')
    
    toast.info('已重置', {
      description: '配置已恢复为默认值'
    })
  }

  // 模拟扇数据（如果没有提供）
  const sashes = windowData?.sashes || [
    { id: 'F1', name: 'F1', isOpenable: true },
    { id: 'F2', name: 'F2', isOpenable: true },
    { id: 'F3', name: 'F3', isOpenable: false },
    { id: 'F4', name: 'F4', isOpenable: false },
  ]

  const selectedSash = sashes.find(s => s.id === selectedSashId)

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* 左侧配置面板 */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <Card className="h-full max-h-[600px] lg:max-h-none flex flex-col overflow-hidden">
          {/* 配置模式切换 - 悬浮置顶 */}
          <div className="flex-none px-3 pt-3 pb-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg shadow-sm">
              <Button
                variant={configMode === 'unified' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('unified')}
                className="flex-1 text-xs"
              >
                统一配置
              </Button>
              <Button
                variant={configMode === 'individual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('individual')}
                className="flex-1 text-xs"
              >
                单一配置
              </Button>
            </div>
          </div>

          {/* 配置内容 */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 pb-3">
              {configMode === 'unified' ? (
                // 统一配置界面
                <Tabs defaultValue="material" className="w-full">
                  {/* Tab切换 - 粘性定位 */}
                  <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 -mx-3 px-3">
                    <TabsList className="grid w-full grid-cols-4 h-auto bg-muted/30">
                      <TabsTrigger value="material" className="text-xs px-1.5 py-1.5">材质</TabsTrigger>
                      <TabsTrigger value="glass" className="text-xs px-1.5 py-1.5">玻璃</TabsTrigger>
                      <TabsTrigger value="handle" className="text-xs px-1.5 py-1.5">执手</TabsTrigger>
                      <TabsTrigger value="screen" className="text-xs px-1.5 py-1.5">纱网</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="material" className="mt-2 space-y-2">
                    {config.unified && (
                      <MaterialConfigComponent
                        config={config.unified.material}
                        onChange={(material) => updateUnifiedConfig('material', material)}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="glass" className="mt-2 space-y-2">
                    {config.unified && (
                      <GlassConfigComponent
                        config={config.unified.glass}
                        onChange={(glass) => updateUnifiedConfig('glass', glass)}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="handle" className="mt-2 space-y-2">
                    {config.unified && (
                      <HandleConfigComponent
                        config={config.unified.handle}
                        onChange={(handle) => updateUnifiedConfig('handle', handle)}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="screen" className="mt-2 space-y-2">
                    {config.unified && (
                      <ScreenConfigComponent
                        config={config.unified.screen}
                        onChange={(screen) => updateUnifiedConfig('screen', screen)}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                // 单一配置界面
                <div className="space-y-2 mt-2">
                  {/* 扇选择器 */}
                  <div className="p-2 bg-muted/20 rounded-lg">
                    <h4 className="font-medium text-xs mb-1.5 text-muted-foreground">选择配置区域</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {sashes.map(sash => (
                        <button
                          key={sash.id}
                          className={cn(
                            "p-1.5 rounded-lg border-2 transition-all text-xs",
                            selectedSashId === sash.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setSelectedSashId(sash.id)}
                        >
                          <div className="font-medium">{sash.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {sash.isOpenable ? '开启扇' : '固定扇'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 扇配置 */}
                  {selectedSash && config.unified && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground px-1">
                        配置 {selectedSash.name}
                      </div>
                      
                      <Tabs defaultValue="glass" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-auto bg-muted/30">
                          <TabsTrigger value="glass" className="text-xs px-1.5 py-1.5">玻璃</TabsTrigger>
                          {selectedSash.isOpenable && (
                            <TabsTrigger value="handle" className="text-xs px-1.5 py-1.5">执手</TabsTrigger>
                          )}
                        </TabsList>
                        
                        <TabsContent value="glass" className="mt-2 space-y-2">
                          <GlassConfigComponent
                            config={config.unified.glass}
                            onChange={(glass) => updateUnifiedConfig('glass', glass)}
                          />
                        </TabsContent>
                        
                        {selectedSash.isOpenable && (
                          <TabsContent value="handle" className="mt-2 space-y-2">
                            <HandleConfigComponent
                              config={config.unified.handle}
                              onChange={(handle) => updateUnifiedConfig('handle', handle)}
                            />
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  )}

                  {!selectedSash && (
                    <div className="text-center py-6 text-muted-foreground text-xs">
                      请选择一个区域进行配置
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 右侧3D预览 */}
      <div className="flex-1 min-h-[500px] lg:min-h-0">
        <Card className="h-full p-0 overflow-hidden">
          <Window3DPreview config={config} windowData={windowData} />
        </Card>
      </div>
    </div>
  )
}

