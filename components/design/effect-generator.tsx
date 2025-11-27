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
  Loader2,
  FileText,
  ZoomIn,
  ZoomOut
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
  
  // 新增：缩放状态
  const [zoom, setZoom] = useState(100)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const touchStartDistance = useRef<number>(0)

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

  // 生成效果图或图纸
  const generateEffect = () => {
    if (viewMode === "blueprint") {
      // 图纸模式 - 直接生成施工图纸
      setIsGenerating(true)
      setGenerationProgress(0)
      setZoom(100) // 重置缩放
      
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            // 使用预设的施工图纸
            setEffectImage('/architectural-blueprint-technical-drawing.jpg')
            toast.success("施工图纸生成完成", {
              description: "包含详细的尺寸和安装说明"
            })
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else if (!scenePhoto && !effectImage) {
      // 效果图模式 - 没有照片，生成渲染场景
      setIsGenerating(true)
      setGenerationProgress(0)
      setZoom(100) // 重置缩放
      
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
      // 效果图模式 - 有照片，进行融合
      setIsGenerating(true)
      setGenerationProgress(0)
      setZoom(100) // 重置缩放
      
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
    setZoom(100) // 重置缩放
    toast.info("准备重新生成", {
      description: viewMode === "blueprint" ? "施工图纸" : "效果图"
    })
    // 延迟后自动重新生成
    setTimeout(() => {
      generateEffect()
    }, 500)
  }

  // 视图模式：效果图 或 图纸模式
  const [viewMode, setViewMode] = useState<"effect" | "blueprint">("effect")
  
  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (effectImage) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -5 : 5
      setZoom(prev => Math.max(50, Math.min(200, prev + delta)))
    }
  }

  // 触摸手势缩放（双指）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && effectImage) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      touchStartDistance.current = distance
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance.current > 0 && effectImage) {
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const delta = (distance - touchStartDistance.current) * 0.2
      setZoom(prev => Math.max(50, Math.min(200, prev + delta)))
      touchStartDistance.current = distance
    }
  }

  const handleTouchEnd = () => {
    touchStartDistance.current = 0
  }

  return (
    <Card className="h-full flex flex-col relative">
      {/* 主显示区域 - 去除头部，将tab移到画布内 */}

      <div className="flex-1 overflow-hidden">
        {/* 画布显示区 */}
        <div 
          ref={imageContainerRef}
          className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 左上角：视图模式切换 - 带阴影蒙层 */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-1">
              <button
                onClick={() => {
                  setViewMode("effect")
                  setEffectImage(null)
                  setGenerationProgress(0)
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                  viewMode === "effect"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                效果图
              </button>
              <button
                onClick={() => {
                  setViewMode("blueprint")
                  setEffectImage(null)
                  setGenerationProgress(0)
                }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
                  viewMode === "blueprint"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                图纸
              </button>
            </div>
          </div>
          {/* 效果图模式 - 没有照片也没有效果图 */}
          {viewMode === "effect" && !effectImage && !scenePhoto && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div className="text-lg font-medium mb-2 text-foreground">
                  准备生成效果图
                </div>
                <div className="text-sm mb-6">
                  上传现场照片进行AI场景融合，<br />或直接生成3D渲染效果
                </div>
                {/* 上传现场照片按钮 */}
                <Button 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5" />
                  上传现场照片
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
          )}

          {/* 图纸模式 - 没有图纸 */}
          {viewMode === "blueprint" && !effectImage && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <div className="text-lg font-medium mb-2 text-foreground">
                  准备生成施工图纸
                </div>
                <div className="text-sm mb-6">
                  生成包含详细尺寸和安装说明的施工图纸
                </div>
                {/* 生成施工图按钮 */}
                <Button 
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={generateEffect}
                >
                  <Sparkles className="h-5 w-5" />
                  生成施工图
                </Button>
              </div>
            </div>
          )}

          {/* 效果图模式 - 已上传照片但未生成 */}
          {viewMode === "effect" && scenePhoto && !effectImage && !isGenerating && (
            <div className="absolute inset-0">
              <img 
                src={scenePhoto} 
                alt="Scene" 
                className="w-full h-full object-contain"
              />
              
              {/* 检测中的遮罩 */}
              {isDetecting && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
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
                  <div className="absolute -top-8 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg">
                    检测到的门窗位置
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 生成中 */}
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="text-center max-w-md w-full px-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                <div className="text-lg font-medium mb-3 text-foreground">
                  {viewMode === "blueprint" 
                    ? '施工图纸生成中...' 
                    : scenePhoto 
                      ? 'AI场景融合中...' 
                      : 'AI效果图渲染中...'}
                </div>
                <Progress value={generationProgress} className="h-2 mb-2" />
                <div className="text-sm text-muted-foreground">
                  {generationProgress}% 完成
                </div>
                <div className="text-xs text-muted-foreground mt-3">
                  {viewMode === "blueprint"
                    ? '正在生成包含详细尺寸的施工图纸'
                    : scenePhoto 
                      ? '正在将您的设计方案融合到照片中' 
                      : '正在渲染真实场景效果'}
                </div>
              </div>
            </div>
          )}

          {/* 显示生成的效果图/图纸 */}
          {effectImage && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img 
                src={effectImage} 
                alt={viewMode === "blueprint" ? "施工图纸" : "效果图"} 
                className="transition-transform duration-200 ease-out"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              
              {/* 右上角操作按钮 */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {/* 重新生成按钮 */}
                <Button 
                  size="icon"
                  className="bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  onClick={regenerate}
                  title="重新生成"
                >
                  <RotateCw className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </Button>
                {/* 下载按钮 */}
                <Button 
                  size="icon"
                  className="bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                  onClick={downloadEffect}
                  title="下载"
                >
                  <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </Button>
              </div>

              {/* 底部缩放控制 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                    className="h-8 w-8 p-0"
                    disabled={zoom <= 50}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-mono min-w-[50px] text-center font-medium text-gray-700 dark:text-gray-300">
                    {zoom}%
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                    className="h-8 w-8 p-0"
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setZoom(100)}
                    className="h-8 px-2 text-xs"
                  >
                    重置
                  </Button>
                </div>
              </div>

              {/* 水印 */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-lg">
                {viewMode === "blueprint" ? "施工图纸" : "AI效果图"} · {new Date().toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 隐藏的文件上传input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
    </Card>
  )
}


