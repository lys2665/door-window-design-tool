"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  Camera,
  Sparkles,
  Check,
  ChevronRight,
  FileText,
  Eye,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 设计流程的四个阶段
const designStages = [
  { id: 1, name: "基础选型", description: "户型信息与智能推荐", icon: Sparkles },
  { id: 2, name: "窗型设计", description: "结构设计与开启位", icon: FileText },
  { id: 3, name: "配置选择", description: "材质与参数设置", icon: Eye },
  { id: 4, name: "成果输出", description: "报价单与效果图", icon: Download },
]

// 系列数据
const seriesOptions = [
  {
    id: "series-1",
    name: "断桥铝80系列",
    windowType: "推拉窗 2扇",
    windResistance: "9级",
    waterTightness: "6级",
    airTightness: "8级",
    budgetRange: "3000-6000元/㎡",
    features: ["隔热性能优异", "适合高层建筑"],
  },
  {
    id: "series-2",
    name: "断桥铝108系列",
    windowType: "推拉窗 3扇",
    windResistance: "9级",
    waterTightness: "6级",
    airTightness: "9级",
    budgetRange: "4000-8000元/㎡",
    features: ["超强隔音", "保温效果极佳"],
  },
  {
    id: "series-3",
    name: "铝合金70系列",
    windowType: "推拉窗 2扇",
    windResistance: "7级",
    waterTightness: "5级",
    airTightness: "7级",
    budgetRange: "2000-4000元/㎡",
    features: ["经济实用", "性价比高"],
  },
]

export default function DesignPage() {
  const [currentStage, setCurrentStage] = useState(1)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [designData, setDesignData] = useState({
    width: "",
    height: "",
    budget: "50000",
    location: "客厅",
    floor: "中层",
    houseType: "公寓",
    aiRecognized: false,
    selectedSeries: "series-1",
    series: "断桥铝80系列",
    windowType: "推拉窗",
  })

  const updateData = (field: string, value: any) => {
    setDesignData(prev => ({ ...prev, [field]: value }))
  }

  const nextStage = () => {
    if (currentStage < designStages.length) {
      setCurrentStage(currentStage + 1)
    }
  }

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  const progress = (currentStage / designStages.length) * 100

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header */}
      <header className="border-b bg-card px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm md:text-base font-semibold text-foreground">门窗智能设计平台</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {designStages[currentStage - 1]?.name}
            </p>
          </div>
        </div>
        
        {/* Steps and Navigation */}
        <div className="flex items-center gap-3">
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2">
            {designStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStage(stage.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    currentStage > stage.id
                      ? "bg-primary text-primary-foreground"
                      : currentStage === stage.id
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {currentStage > stage.id ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </button>
                {index < designStages.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${currentStage > stage.id ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStage}
              disabled={currentStage === 1}
              className="gap-1.5 h-8"
            >
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
              <span className="hidden sm:inline text-xs">上一步</span>
            </Button>
            <Button
              size="sm"
              onClick={currentStage < designStages.length ? nextStage : undefined}
              className="gap-1.5 h-8"
            >
              <span className="hidden sm:inline text-xs">
                {currentStage < designStages.length ? "下一步" : "生成"}
              </span>
              {currentStage < designStages.length ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-5">
        {/* Stage 1: 基础选型 */}
        {currentStage === 1 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI照片识别 - 压缩酷炫版 */}
              <Card className="p-4 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">AI智能识别</h3>
                      <p className="text-xs text-white/80">秒速识别门窗尺寸</p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary"
                    className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Upload className="h-4 w-4" />
                    去上传
                  </Button>
                </div>
              </Card>

              {/* 窗型信息 */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">窗型信息</h3>
                
                {/* 尺寸输入 - 优先展示 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <Label htmlFor="width" className="text-sm mb-2 block">宽度 (mm)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="1800"
                      value={designData.width}
                      onChange={(e) => updateData("width", e.target.value)}
                      className="h-12 text-lg font-semibold"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm mb-2 block">高度 (mm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="1500"
                      value={designData.height}
                      onChange={(e) => updateData("height", e.target.value)}
                      className="h-12 text-lg font-semibold"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* 房屋类型 - 横向滚动 */}
                <div className="mb-4">
                  <Label className="text-sm mb-2 block">房屋类型</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {["公寓", "别墅", "办公楼", "商业", "高层住宅", "联排别墅"].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateData("houseType", type)}
                        className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all shrink-0 ${
                          designData.houseType === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 安装位置 - 横向滚动 */}
                <div className="mb-4">
                  <Label className="text-sm mb-2 block">安装位置</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {["客厅", "卧室", "书房", "厨房", "阳台", "卫生间", "储藏室", "其他"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => updateData("location", loc)}
                        className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all shrink-0 ${
                          designData.location === loc
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 楼层高度 - 横向滚动 */}
                <div>
                  <Label className="text-sm mb-2 block">楼层高度</Label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {["低层(1-6层)", "中层(7-12层)", "高层(13-20层)", "超高层(20层+)"].map((floor) => (
                      <button
                        key={floor}
                        onClick={() => updateData("floor", floor)}
                        className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all shrink-0 ${
                          designData.floor === floor
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {floor}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: 1/3 width - 预算与推荐合并 */}
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">智能推荐</h3>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>

                {/* 预算快选 */}
                <div className="mb-4">
                  <Label className="text-xs mb-2 block text-muted-foreground">预算范围</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["30000", "50000", "100000"].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => updateData("budget", budget)}
                        className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          designData.budget === budget
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-border hover:border-amber-400"
                        }`}
                      >
                        {(Number(budget) / 10000).toFixed(0)}万
                      </button>
                    ))}
                  </div>
                </div>

                {/* 推荐系列 - 简化版带图 */}
                <div className="space-y-3">
                  {seriesOptions.map((series) => (
                    <button
                      key={series.id}
                      onClick={() => {
                        updateData("selectedSeries", series.id)
                        updateData("series", series.name)
                        updateData("windowType", series.windowType)
                      }}
                      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
                        designData.selectedSeries === series.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {/* 效果图 */}
                      <div className="aspect-[16/9] bg-muted relative">
                        <img 
                          src="/modern-aluminum-sliding-window.jpg" 
                          alt={series.name}
                          className="w-full h-full object-cover"
                        />
                        {designData.selectedSeries === series.id && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary">推荐</Badge>
                          </div>
                        )}
                      </div>
                      {/* 信息 */}
                      <div className="p-3">
                        <h4 className="font-bold text-sm mb-1">{series.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{series.windowType}</p>
                        <div className="flex gap-1.5 text-[10px]">
                          <Badge variant="secondary">{series.windResistance}级风压</Badge>
                          <Badge variant="secondary">{series.budgetRange.split('-')[0]}</Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 预估信息 */}
                {designData.width && designData.height && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">面积</div>
                        <div className="font-semibold">
                          {((Number(designData.width) * Number(designData.height)) / 1000000).toFixed(2)} m²
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">预算</div>
                        <div className="font-semibold text-primary">
                          ¥{(Number(designData.budget) / 10000).toFixed(1)}万
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Stage 2-4 占位 */}
        {currentStage > 1 && (
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">阶段 {currentStage}: {designStages[currentStage - 1]?.name}</h2>
              <p className="text-muted-foreground">功能开发中...</p>
            </Card>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              选择上传方式
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              className="h-32 flex flex-col gap-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={() => {
                setShowUploadDialog(false)
                updateData("aiRecognized", true)
                updateData("width", "1800")
                updateData("height", "1500")
              }}
            >
              <Camera className="h-10 w-10" />
              <div>
                <div className="font-semibold">拍照识别</div>
                <div className="text-xs text-white/80">现场拍照</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32 flex flex-col gap-3 border-2"
              onClick={() => {
                setShowUploadDialog(false)
                updateData("aiRecognized", true)
                updateData("width", "2000")
                updateData("height", "1600")
              }}
            >
              <Upload className="h-10 w-10" />
              <div>
                <div className="font-semibold">相册上传</div>
                <div className="text-xs text-muted-foreground">选择照片</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

