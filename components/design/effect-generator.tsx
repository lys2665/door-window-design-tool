"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Eye, 
  Camera, 
  Upload, 
  Sparkles, 
  Download, 
  RotateCw,
  Maximize2,
  X,
  Check,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface EffectGeneratorProps {
  windowData?: {
    width: number
    height: number
  }
  styleConfig?: any
  uploadedPhoto?: string | null
}

export function EffectGenerator({ windowData, styleConfig, uploadedPhoto }: EffectGeneratorProps) {
  const [scenePhoto, setScenePhoto] = useState<string | null>(uploadedPhoto || null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [effectImage, setEffectImage] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedWindow, setDetectedWindow] = useState<{x: number, y: number, width: number, height: number} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 模拟检测窗户位置
  const detectWindowPosition = () => {
    setIsDetecting(true)
    
    setTimeout(() => {
      // 模拟检测结果 - 在图片中心区域
      setDetectedWindow({
        x: 25,  // 百分比
        y: 30,
        width: 50,
        height: 45
      })
      setIsDetecting(false)
      toast.success("门窗位置识别完成", {
        description: "AI已自动识别出安装位置"
      })
    }, 2000)
  }

  // 处理照片上传
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setScenePhoto(result)
        setEffectImage(null)
        setDetectedWindow(null)
        
        toast.success("照片已上传", {
          description: "准备进行AI识别"
        })
        
        // 自动开始检测
        setTimeout(() => {
          detectWindowPosition()
        }, 500)
      }
      reader.readAsDataURL(file)
    }
  }

  // 生成效果图
  const generateEffect = () => {
    if (!scenePhoto && !effectImage) {
      // 没有照片，生成渲染场景
      setIsGenerating(true)
      setGenerationProgress(0)
      
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            // 使用预设的渲染场景图
            setEffectImage('/modern-glass-window-facade.jpg')
            toast.success("效果图生成完成", {
              description: "查看您的窗户设计效果"
            })
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else if (scenePhoto) {
      // 有照片，进行融合
      setIsGenerating(true)
      setGenerationProgress(0)
      
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            // 实际应该调用AI接口进行图像融合
            // 这里使用原图作为演示
            setEffectImage(scenePhoto)
            toast.success("场景融合完成", {
              description: "设计方案已融合到您的照片中"
            })
            return 100
          }
          return prev + 8
        })
      }, 250)
    }
  }

  // 下载效果图
  const downloadEffect = () => {
    if (effectImage) {
      const link = document.createElement('a')
      link.href = effectImage
      link.download = `门窗效果图_${Date.now()}.jpg`
      link.click()
      
      toast.success("效果图已下载")
    }
  }

  // 重新生成
  const regenerate = () => {
    setEffectImage(null)
    setGenerationProgress(0)
  }

  return (
    <Card className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            效果图预览
          </h2>
          <div className="flex items-center gap-2">
            {effectImage && (
              <Badge variant="default" className="gap-1">
                <Check className="w-3 h-3" />
                已生成
              </Badge>
            )}
            {scenePhoto && !effectImage && (
              <Badge variant="secondary" className="gap-1">
                <Camera className="w-3 h-3" />
                照片已上传
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 主显示区域 */}
      <div className="flex-1 p-5 overflow-auto">
        <div className="h-full flex flex-col gap-4">
          {/* 效果图显示区 */}
          <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden min-h-[400px]">
            {!effectImage && !scenePhoto && !isGenerating && (
              // 默认状态 - 未上传照片
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground max-w-sm">
                  <Eye className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <div className="text-lg font-medium mb-2">准备生成效果图</div>
                  <div className="text-sm">
                    您可以上传现场照片进行场景融合，<br />
                    或直接生成渲染效果图
                  </div>
                </div>
              </div>
            )}

            {scenePhoto && !effectImage && !isGenerating && (
              // 显示上传的照片 + 检测框
              <div className="absolute inset-0">
                <img 
                  src={scenePhoto} 
                  alt="Scene" 
                  className="w-full h-full object-contain"
                />
                
                {/* 检测中的遮罩 */}
                {isDetecting && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" />
                      <div className="text-lg font-medium">AI识别中...</div>
                      <div className="text-sm opacity-80 mt-1">正在定位门窗安装位置</div>
                    </div>
                  </div>
                )}
                
                {/* 检测到的窗户位置 */}
                {detectedWindow && !isDetecting && (
                  <div 
                    className="absolute border-4 border-primary rounded-lg animate-pulse"
                    style={{
                      left: `${detectedWindow.x}%`,
                      top: `${detectedWindow.y}%`,
                      width: `${detectedWindow.width}%`,
                      height: `${detectedWindow.height}%`,
                    }}
                  >
                    <div className="absolute -top-8 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      检测到的门窗位置
                    </div>
                  </div>
                )}
              </div>
            )}

            {isGenerating && (
              // 生成中
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <div className="text-center max-w-md w-full px-8">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                  <div className="text-lg font-medium mb-3">
                    {scenePhoto ? 'AI场景融合中...' : 'AI效果图渲染中...'}
                  </div>
                  <Progress value={generationProgress} className="h-2 mb-2" />
                  <div className="text-sm text-muted-foreground">
                    {generationProgress}% 完成
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    {scenePhoto ? '正在将您的设计方案融合到照片中' : '正在渲染真实场景效果'}
                  </div>
                </div>
              </div>
            )}

            {effectImage && !isGenerating && (
              // 显示生成的效果图
              <div className="absolute inset-0 group">
                <img 
                  src={effectImage} 
                  alt="Effect" 
                  className="w-full h-full object-contain"
                />
                
                {/* 悬浮操作栏 */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                    onClick={regenerate}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* 水印 */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded backdrop-blur">
                  AI生成效果图 - {new Date().toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* 照片上传区（如果还没上传） */}
          {!scenePhoto && !isGenerating && (
            <Card className="p-4 border-2 border-dashed">
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">上传现场照片（可选）</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    上传安装位置照片，AI自动识别并融合设计方案
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      选择照片
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 操作按钮 */}
          {!effectImage && !isGenerating && (
            <Button 
              className="w-full gap-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={generateEffect}
            >
              <Sparkles className="h-5 w-5" />
              {scenePhoto ? 'AI场景融合' : '生成渲染效果图'}
            </Button>
          )}

          {effectImage && !isGenerating && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={regenerate}
              >
                <RotateCw className="h-4 w-4" />
                重新生成
              </Button>
              <Button 
                className="gap-2"
                onClick={downloadEffect}
              >
                <Download className="h-4 w-4" />
                下载效果图
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 提示信息 */}
      {scenePhoto && detectedWindow && !effectImage && !isGenerating && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-t text-sm">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                AI已识别门窗位置
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                点击"AI场景融合"将您的设计方案精准融合到照片中
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}


