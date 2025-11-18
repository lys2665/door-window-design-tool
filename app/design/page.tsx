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
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import WindowTypeDesigner from "@/components/window-type-designer"
import { StyleConfigurator } from "@/components/design/style-configurator"
import { QuotationPanel } from "@/components/design/quotation-panel"
import { EffectGenerator } from "@/components/design/effect-generator"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import { X, ChevronDown } from "lucide-react"
import { toast } from "sonner"

// 设计流程的五个阶段
const designStages = [
  { id: 1, name: "填信息", description: "户型信息与智能推荐", icon: Sparkles },
  { id: 2, name: "选窗型", description: "选择合适的窗型结构", icon: LayoutGrid },
  { id: 3, name: "调细节", description: "结构设计与开启位", icon: FileText },
  { id: 4, name: "换样式", description: "材质与参数设置", icon: Eye },
  { id: 5, name: "看效果", description: "报价单与效果图", icon: Download },
]

// 窗型推荐数据（基于实际门窗设计规范）
const windowTypeOptions = [
  {
    id: "001",
    name: "001矩形1分格1",
    code: "001",
    gridCols: 1,
    gridRows: 1,
    description: "单个完整窗格，适合小窗户",
    features: ["简洁", "经济", "适合小空间"],
    mullions: [] // 无梃
  },
  {
    id: "002",
    name: "002矩形2分格2",
    code: "002",
    gridCols: 1,
    gridRows: 2,
    description: "上下两格，1条横梃",
    features: ["上下分隔", "通风灵活"],
    mullions: [{ type: 'horizontal' as const, ratio: 0.5 }]
  },
  {
    id: "003",
    name: "003矩形2分格11",
    code: "003",
    gridCols: 2,
    gridRows: 1,
    description: "左右两格，1条竖梃",
    features: ["左右分隔", "经典推拉"],
    mullions: [{ type: 'vertical' as const, ratio: 0.5 }]
  },
  {
    id: "004",
    name: "004矩形3分格3",
    code: "004",
    gridCols: 1,
    gridRows: 3,
    description: "上中下三格，2条横梃",
    features: ["三层分隔", "通风好"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 }
    ]
  },
  {
    id: "005",
    name: "005矩形3分格111",
    code: "005",
    gridCols: 3,
    gridRows: 1,
    description: "左中右三格，2条竖梃",
    features: ["三扇推拉", "大面积"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 }
    ]
  },
  {
    id: "006",
    name: "006矩形3分格1/2",
    code: "006",
    gridCols: 2,
    gridRows: 2,
    description: "上1格，下2格",
    features: ["上固定下开启", "实用"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, startRow: 0.5 }
    ]
  },
  {
    id: "007",
    name: "007矩形3分格2/1",
    code: "007",
    gridCols: 2,
    gridRows: 2,
    description: "上2格，下1格",
    features: ["上开启下固定", "常用"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, endRow: 0.5 }
    ]
  },
  {
    id: "010",
    name: "010矩形4分格4",
    code: "010",
    gridCols: 2,
    gridRows: 2,
    description: "田字格，均分四格",
    features: ["均衡对称", "经典款"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5 }
    ]
  },
  {
    id: "019",
    name: "019矩形4分格1111",
    code: "019",
    gridCols: 4,
    gridRows: 1,
    description: "横向四等分",
    features: ["四扇推拉", "超大面积"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.25 },
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.75 }
    ]
  },
  {
    id: "031",
    name: "031矩形6分格222",
    code: "031",
    gridCols: 3,
    gridRows: 2,
    description: "上下各3格",
    features: ["对称", "均衡"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 }
    ]
  },
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
  const [selectedWindowType, setSelectedWindowType] = useState<any>(null) // 选中的窗型
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // 窗型标签筛选
  const [isTagExpanded, setIsTagExpanded] = useState(false) // 标签展开状态
  const [windowCategory, setWindowCategory] = useState<"straight" | "corner">("straight") // 窗户类型：一字窗/转角窗
  const [cornerType, setCornerType] = useState<"L" | "U" | "Z">("L") // 转角窗类型：L型/U型/Z型
  const [rotationAngle, setRotationAngle] = useState<0 | 90 | 180 | 270>(0) // 旋转角度
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null) // 上传的现场照片
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
    // 转角窗尺寸数据
    cornerDimensions: {
      // L型窗：边A和边B
      sideA: { width: "", height: "" },
      sideB: { width: "", height: "" },
      // U型窗：边A、边B和边C
      sideC: { width: "", height: "" },
    }
  })

  const updateData = (field: string, value: any) => {
    setDesignData(prev => ({ ...prev, [field]: value }))
  }

  // 更新转角窗尺寸数据
  const updateCornerDimension = (side: "sideA" | "sideB" | "sideC", dimension: "width" | "height", value: string) => {
    setDesignData(prev => ({
      ...prev,
      cornerDimensions: {
        ...prev.cornerDimensions,
        [side]: {
          ...prev.cornerDimensions[side],
          [dimension]: value
        }
      }
    }))
  }

  // 获取所有唯一标签
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    windowTypeOptions.forEach(type => {
      type.features.forEach(feature => tags.add(feature))
    })
    return Array.from(tags)
  }, [])
  
  // 根据标签筛选窗型
  const filteredWindowTypes = useMemo(() => {
    if (selectedTags.length === 0) {
      return windowTypeOptions // 全部
    }
    return windowTypeOptions.filter(type => 
      selectedTags.some(tag => type.features.includes(tag))
    )
  }, [selectedTags])
  
  // 切换标签选择
  const toggleTag = (tag: string) => {
    if (tag === '全部') {
      setSelectedTags([]) // 选择全部，清空选中标签
    } else {
      setSelectedTags(prev => {
        if (prev.includes(tag)) {
          const newTags = prev.filter(t => t !== tag)
          return newTags
        } else {
          return [...prev, tag]
        }
      })
    }
  }
  
  // 切换展开/收起
  const toggleExpand = () => {
    setIsTagExpanded(!isTagExpanded)
  }
  
  // 获取标签颜色
  const getTagColor = (tag: string) => {
    const colorMap: { [key: string]: string } = {
      '简洁': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      '经济': 'bg-green-100 text-green-700 hover:bg-green-200',
      '通风': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      '采光': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      '推拉': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      '平开': 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      '对称': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      '实用': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      '美观': 'bg-rose-100 text-rose-700 hover:bg-rose-200',
      '灵活': 'bg-teal-100 text-teal-700 hover:bg-teal-200',
    }
    return colorMap[tag] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }

  // 选择窗型（支持取消选择）
  const handleWindowTypeSelect = (type: typeof windowTypeOptions[0]) => {
    // 如果点击的是已选中的窗型，则取消选择
    if (selectedWindowType?.id === type.id) {
      setSelectedWindowType(null)
      toast.info("已取消选择", {
        description: "您可以重新选择其他窗型",
      })
    } else {
      // 选择新窗型
      setSelectedWindowType(type)
      // 自动进入下一步
      nextStage()
    }
  }

  // 验证是否可以进入指定步骤
  const canNavigateToStage = (targetStage: number): boolean => {
    // 如果目标步骤 > 2（即步骤3及以后），需要检查是否选择了窗型
    if (targetStage > 2 && !selectedWindowType) {
      toast.info("请先选择窗型", {
        description: "请在步骤2选择一个窗型后再继续下一步",
      })
      return false
    }
    return true
  }

  // 检查当前步骤是否完成，用于UI提示
  const isStageCompleted = (stageId: number): boolean => {
    if (stageId === 2) {
      return !!selectedWindowType
    }
    // 其他步骤默认可以跳过（使用默认配置）
    return true
  }

  const nextStage = () => {
    if (currentStage < designStages.length) {
      const targetStage = currentStage + 1
      if (canNavigateToStage(targetStage)) {
        setCurrentStage(targetStage)
      }
    }
  }

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }
  
  // 跳转到指定步骤（带验证）
  const goToStage = (stageId: number) => {
    if (canNavigateToStage(stageId)) {
      setCurrentStage(stageId)
    }
  }

  const progress = (currentStage / designStages.length) * 100

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header */}
      <header className="border-b bg-card px-4 py-2.5 shrink-0 relative">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-sm md:text-base font-semibold text-foreground">门窗设计工具</h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {designStages[currentStage - 1]?.name}
              </p>
            </div>
          </div>
          
          {/* Center: Progress Steps - 自适应椭圆步骤条 */}
          {/* 超大屏幕(xl): 显示所有步骤+名称 */}
          {/* 大屏幕(lg): 显示所有步骤+当前步骤名称 */}
          {/* 中屏幕(md): 仅显示所有步骤编号 */}
          {/* 小屏幕: 仅显示当前步骤 */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-320px)]">
            {designStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStage(stage.id)}
                  className={cn(
                    "h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all shrink-0",
                    // 确保内边距充足，文字不被截断
                    "px-4 min-w-[36px]",
                    currentStage > stage.id
                      ? "bg-primary text-primary-foreground"
                      : currentStage === stage.id
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  title={`${stage.name} - ${stage.description}`}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap px-0.5">
                    {/* 步骤编号或对勾 */}
                    <span className="shrink-0 flex items-center justify-center">
                      {currentStage > stage.id ? <Check className="h-4 w-4" /> : `0${index + 1}`}
                    </span>
                    {/* 步骤名称 - 多级响应式显示 */}
                    {/* xl屏幕: 所有步骤都显示名称 */}
                    <span className="hidden xl:inline shrink-0">{stage.name}</span>
                    {/* lg屏幕: 仅当前步骤显示名称 */}
                    {currentStage === stage.id && (
                      <span className="hidden lg:inline xl:hidden shrink-0">{stage.name}</span>
                    )}
                  </div>
                </button>
                {index < designStages.length - 1 && (
                  <div className={cn(
                    "h-[2px] transition-colors flex-1 mx-2",
                    "min-w-[32px]",
                    currentStage > stage.id ? 'bg-primary' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile: 仅显示当前步骤 */}
          <div className="md:hidden flex items-center absolute left-1/2 -translate-x-1/2 px-4">
            <div className={cn(
              "h-9 rounded-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all",
              "px-4 min-w-[36px]",
              "bg-primary/20 text-primary border-2 border-primary"
            )}>
              <span className="shrink-0">0{currentStage}</span>
              {/* 极小屏幕隐藏名称，小屏幕显示 */}
              <span className="hidden min-[400px]:inline whitespace-nowrap shrink-0">{designStages[currentStage - 1]?.name}</span>
            </div>
          </div>
          
          {/* Right: Navigation Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
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
              {/* AI照片识别 - 参考AI封窗建议风格 */}
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">AI智能识别</h3>
                      <p className="text-xs text-muted-foreground">秒速识别门窗尺寸</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                
                {/* 窗户类型选择 */}
                <div className="mb-4">
                  <Label className="text-sm mb-2 block">窗户类型</Label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWindowCategory("straight")}
                      className={cn(
                        "flex-1 h-10 rounded-lg border-2 transition-all text-sm font-medium",
                        windowCategory === "straight"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      一字窗
                    </button>
                    <button
                      onClick={() => setWindowCategory("corner")}
                      className={cn(
                        "flex-1 h-10 rounded-lg border-2 transition-all text-sm font-medium",
                        windowCategory === "corner"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      转角窗
                    </button>
                  </div>
                </div>

                {/* 一字窗尺寸输入 */}
                {windowCategory === "straight" && (
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
                )}

                {/* 转角窗选项 */}
                {windowCategory === "corner" && (
                  <div className="space-y-4 mb-4">
                    {/* 转角窗类型选择 */}
                    <div>
                      <Label className="text-sm mb-2 block">转角窗类型</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setCornerType("L")}
                          className={cn(
                            "h-10 rounded-lg border-2 transition-all text-sm font-medium",
                            cornerType === "L"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          L型窗
                        </button>
                        <button
                          onClick={() => setCornerType("U")}
                          className={cn(
                            "h-10 rounded-lg border-2 transition-all text-sm font-medium",
                            cornerType === "U"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          U型窗
                        </button>
                        <button
                          onClick={() => setCornerType("Z")}
                          className={cn(
                            "h-10 rounded-lg border-2 transition-all text-sm font-medium",
                            cornerType === "Z"
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          Z型窗
                        </button>
                      </div>
                    </div>

                    {/* 旋转角度选择 */}
                    <div>
                      <Label className="text-sm mb-2 block">旋转角度</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setRotationAngle(0)}
                          className={cn(
                            "h-9 rounded-lg border-2 transition-all text-xs font-medium",
                            rotationAngle === 0
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          0°
                        </button>
                        <button
                          onClick={() => setRotationAngle(90)}
                          className={cn(
                            "h-9 rounded-lg border-2 transition-all text-xs font-medium",
                            rotationAngle === 90
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          90°
                        </button>
                        <button
                          onClick={() => setRotationAngle(180)}
                          className={cn(
                            "h-9 rounded-lg border-2 transition-all text-xs font-medium",
                            rotationAngle === 180
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          180°
                        </button>
                        <button
                          onClick={() => setRotationAngle(270)}
                          className={cn(
                            "h-9 rounded-lg border-2 transition-all text-xs font-medium",
                            rotationAngle === 270
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          270°
                        </button>
                      </div>
                    </div>

                    {/* L型窗尺寸输入 */}
                    {cornerType === "L" && (
                      <div className="space-y-3">
                        {/* 图示说明 */}
                        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 mb-2">
                            <svg 
                              className="w-20 h-20 shrink-0" 
                              viewBox="0 0 100 100" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ transform: `rotate(${rotationAngle}deg)` }}
                            >
                              {/* 边A - 垂直边（实心蓝色）*/}
                              <rect x="10" y="30" width="8" height="50" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                              {/* 边B - 顶部延伸（空心）*/}
                              <rect x="10" y="30" width="50" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <text x="14" y="58" fontSize="10" fill="white" fontWeight="bold">A</text>
                              <text x="35" y="36" fontSize="10" fill="currentColor">B</text>
                            </svg>
                            <div>
                              <p className="font-medium text-foreground">L型窗由两个相连的边组成</p>
                              <p className="mt-1">边A：实线边（蓝色） | 边B：延伸边</p>
                              <p className="mt-1 text-[10px]">旋转角度：{rotationAngle}°</p>
                            </div>
                          </div>
                        </div>

                        {/* 边A尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边A（垂直边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideA-width" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideA-width"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideA.width}
                                onChange={(e) => updateCornerDimension("sideA", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideA-height" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideA-height"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideA.height}
                                onChange={(e) => updateCornerDimension("sideA", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 边B尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边B（水平边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideB-width" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideB-width"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideB.width}
                                onChange={(e) => updateCornerDimension("sideB", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideB-height" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideB-height"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideB.height}
                                onChange={(e) => updateCornerDimension("sideB", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* U型窗尺寸输入 */}
                    {cornerType === "U" && (
                      <div className="space-y-3">
                        {/* 图示说明 */}
                        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 mb-2">
                            <svg 
                              className="w-20 h-20 shrink-0" 
                              viewBox="0 0 100 100" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ transform: `rotate(${rotationAngle}deg)` }}
                            >
                              {/* 边A - 左垂直边（实心蓝色）*/}
                              <rect x="10" y="30" width="8" height="50" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                              {/* 边B - 底部水平边（空心）*/}
                              <rect x="10" y="72" width="60" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                              {/* 边C - 右垂直边（空心）*/}
                              <rect x="62" y="30" width="8" height="50" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <text x="14" y="58" fontSize="10" fill="white" fontWeight="bold">A</text>
                              <text x="40" y="78" fontSize="10" fill="currentColor">B</text>
                              <text x="66" y="58" fontSize="10" fill="currentColor">C</text>
                            </svg>
                            <div>
                              <p className="font-medium text-foreground">U型窗由三个相连的边组成</p>
                              <p className="mt-1">边A：实线边（蓝色） | 边B：底部边 | 边C：延伸边</p>
                              <p className="mt-1 text-[10px]">旋转角度：{rotationAngle}°</p>
                            </div>
                          </div>
                        </div>

                        {/* 边A尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边A（左垂直边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideA-width-u" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideA-width-u"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideA.width}
                                onChange={(e) => updateCornerDimension("sideA", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideA-height-u" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideA-height-u"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideA.height}
                                onChange={(e) => updateCornerDimension("sideA", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 边B尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边B（底部水平边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideB-width-u" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideB-width-u"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideB.width}
                                onChange={(e) => updateCornerDimension("sideB", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideB-height-u" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideB-height-u"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideB.height}
                                onChange={(e) => updateCornerDimension("sideB", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 边C尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边C（右垂直边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideC-width" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideC-width"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideC.width}
                                onChange={(e) => updateCornerDimension("sideC", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideC-height" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideC-height"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideC.height}
                                onChange={(e) => updateCornerDimension("sideC", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Z型窗尺寸输入 */}
                    {cornerType === "Z" && (
                      <div className="space-y-3">
                        {/* 图示说明 */}
                        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2 mb-2">
                            <svg 
                              className="w-20 h-20 shrink-0" 
                              viewBox="0 0 100 100" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ transform: `rotate(${rotationAngle}deg)` }}
                            >
                              {/* 边A - 左下垂直边（实心蓝色）*/}
                              <rect x="10" y="50" width="8" height="30" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                              {/* 边B - 中间水平延伸（空心）*/}
                              <rect x="10" y="50" width="60" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                              {/* 边C - 右上垂直延伸（空心）*/}
                              <rect x="62" y="20" width="8" height="38" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <text x="14" y="68" fontSize="10" fill="white" fontWeight="bold">A</text>
                              <text x="40" y="56" fontSize="10" fill="currentColor">B</text>
                              <text x="66" y="40" fontSize="10" fill="currentColor">C</text>
                            </svg>
                            <div>
                              <p className="font-medium text-foreground">Z型窗由三个相连的边组成</p>
                              <p className="mt-1">边A：实线边（蓝色） | 边B：水平延伸 | 边C：垂直延伸</p>
                              <p className="mt-1 text-[10px]">旋转角度：{rotationAngle}°</p>
                            </div>
                          </div>
                        </div>

                        {/* 边A尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边A（垂直边）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideA-width-z" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideA-width-z"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideA.width}
                                onChange={(e) => updateCornerDimension("sideA", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideA-height-z" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideA-height-z"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideA.height}
                                onChange={(e) => updateCornerDimension("sideA", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 边B尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边B（水平延伸）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideB-width-z" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideB-width-z"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideB.width}
                                onChange={(e) => updateCornerDimension("sideB", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideB-height-z" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideB-height-z"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideB.height}
                                onChange={(e) => updateCornerDimension("sideB", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 边C尺寸 */}
                        <div>
                          <Label className="text-sm mb-2 block font-medium">边C（垂直延伸）尺寸</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="sideC-width-z" className="text-xs mb-1.5 block text-muted-foreground">宽度 (mm)</Label>
                              <Input
                                id="sideC-width-z"
                                type="number"
                                placeholder="1800"
                                value={designData.cornerDimensions.sideC.width}
                                onChange={(e) => updateCornerDimension("sideC", "width", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sideC-height-z" className="text-xs mb-1.5 block text-muted-foreground">高度 (mm)</Label>
                              <Input
                                id="sideC-height-z"
                                type="number"
                                placeholder="1500"
                                value={designData.cornerDimensions.sideC.height}
                                onChange={(e) => updateCornerDimension("sideC", "height", e.target.value)}
                                className="h-10"
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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

                {/* 推荐系列 - 横向滑动版带图 */}
                <div>
                  <Label className="text-xs mb-2 block text-muted-foreground">推荐系列</Label>
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                    {seriesOptions.map((series) => (
                      <button
                        key={series.id}
                        onClick={() => {
                          updateData("selectedSeries", series.id)
                          updateData("series", series.name)
                          updateData("windowType", series.windowType)
                        }}
                        className={`shrink-0 w-48 text-left rounded-xl overflow-hidden border-2 transition-all ${
                          designData.selectedSeries === series.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {/* 效果图 */}
                        <div className="aspect-[4/3] bg-muted relative">
                          <img 
                            src="/modern-aluminum-sliding-window.jpg" 
                            alt={series.name}
                            className="w-full h-full object-cover"
                          />
                          {designData.selectedSeries === series.id && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary text-xs">推荐</Badge>
                            </div>
                          )}
                        </div>
                        {/* 信息 */}
                        <div className="p-3">
                          <h4 className="font-bold text-sm mb-1">{series.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{series.windowType}</p>
                          <div className="flex gap-1 text-[10px]">
                            <Badge variant="secondary" className="text-[10px]">{series.windResistance}级</Badge>
                            <Badge variant="secondary" className="text-[10px]">{series.budgetRange.split('-')[0]}</Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
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

        {/* Stage 2: 选择窗型 */}
        {currentStage === 2 && (
          <div className="h-full flex flex-col bg-background">
            {/* 顶部标题栏 */}
            <div className="flex-none px-4 py-3 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">选择窗型</h2>
                  <p className="text-xs text-muted-foreground">
                    总数：{filteredWindowTypes.length} / {windowTypeOptions.length}
                  </p>
                </div>
                {selectedWindowType && (
                  <Badge variant="outline" className="gap-2">
                    <span className="text-xs">已选:</span>
                    <span className="font-semibold">{selectedWindowType.name}</span>
                  </Badge>
                )}
              </div>
              
              {/* 标签筛选 */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  {/* 标签列表 */}
                  <div 
                    className={cn(
                      "flex-1 min-w-0",
                      isTagExpanded ? "flex flex-wrap gap-2" : "overflow-x-auto scrollbar-hide"
                    )}
                  >
                    <div className={cn(
                      "flex gap-2",
                      isTagExpanded ? "flex-wrap" : "flex-nowrap"
                    )}>
                      {/* 全部标签 */}
                      <Badge
                        variant={selectedTags.length === 0 ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all text-xs px-3 py-1 whitespace-nowrap shrink-0",
                          selectedTags.length === 0
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                        )}
                        onClick={() => toggleTag('全部')}
                      >
                        全部
                      </Badge>
                      
                      {/* 其他标签 */}
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all text-xs px-3 py-1 whitespace-nowrap shrink-0",
                            selectedTags.includes(tag) 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          )}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                          {selectedTags.includes(tag) && (
                            <X className="w-3 h-3 ml-1 inline" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* 展开/收起按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-7 px-2"
                    onClick={toggleExpand}
                  >
                    {isTagExpanded ? (
                      <>
                        <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                        <span className="ml-1 text-xs">收起</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 transition-transform" />
                        <span className="ml-1 text-xs">展开</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* 窗型网格 */}
            <div className="flex-1 overflow-auto p-3 md:p-4">
              {/* 未选中窗型提示 */}
              {!selectedWindowType && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        请选择一个窗型
                      </h3>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        点击下方窗型卡片即可选择，选择后将自动进入下一步。您也可以使用标签筛选来快速找到合适的窗型。
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
                {filteredWindowTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={cn(
                      "group cursor-pointer transition-all hover:shadow-lg hover:border-primary active:scale-[0.98] overflow-hidden bg-white",
                      selectedWindowType?.id === type.id && "border-2 border-primary shadow-lg"
                    )}
                    onClick={() => handleWindowTypeSelect(type)}
                  >
                    {/* 窗型结构图 */}
                    <div className="aspect-[4/3] bg-white p-3 flex items-center justify-center">
                      <div className="relative w-full h-full max-w-[140px] max-h-[105px] border-[4px] border-gray-900 bg-white rounded-sm shadow-sm">
                        {/* 渲染梃 */}
                        {type.mullions && type.mullions.map((mullion: any, index: number) => {
                          if (mullion.type === 'vertical') {
                            return (
                              <div
                                key={`v-${index}`}
                                className="absolute top-0 bottom-0 w-[3px] bg-gray-900"
                                style={{
                                  left: `${mullion.ratio * 100}%`,
                                  transform: 'translateX(-50%)',
                                  top: mullion.startRow ? `${mullion.startRow * 100}%` : '0',
                                  bottom: mullion.endRow ? `${(1 - mullion.endRow) * 100}%` : '0',
                                  height: mullion.startRow || mullion.endRow ? 'auto' : '100%'
                                }}
                              />
                            )
                          } else {
                            return (
                              <div
                                key={`h-${index}`}
                                className="absolute left-0 right-0 h-[3px] bg-gray-900"
                                style={{
                                  top: `${mullion.ratio * 100}%`,
                                  transform: 'translateY(-50%)',
                                  left: mullion.startCol ? `${mullion.startCol * 100}%` : '0',
                                  right: mullion.endCol ? `${(1 - mullion.endCol) * 100}%` : '0',
                                  width: mullion.startCol || mullion.endCol ? 'auto' : '100%'
                                }}
                              />
                            )
                          }
                        })}
                        {/* 玻璃效果 */}
                        <div className="absolute inset-1 bg-gradient-to-br from-blue-100/20 via-blue-50/15 to-blue-100/20 pointer-events-none" />
                        {/* 选中标记 */}
                        {selectedWindowType?.id === type.id && (
                          <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 底部信息 */}
                    <div className="px-2 py-2 bg-white">
                      <h3 className="text-sm font-bold mb-1 truncate">{type.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {type.description}
                      </p>
                      {/* 特性标签 */}
                      <div className="flex flex-wrap gap-1">
                        {type.features.slice(0, 3).map((feature) => (
                          <Badge 
                            key={feature} 
                            className={cn("text-[10px] px-1.5 py-0 h-4 border-0", getTagColor(feature))}
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: 窗型设计 */}
        {currentStage === 3 && (
          <div className="h-full">
            <WindowTypeDesigner
              initialWidth={Number(designData.width) || 2400}
              initialHeight={Number(designData.height) || 1800}
              onBack={prevStage}
              preselectedType={selectedWindowType}
            />
          </div>
        )}

        {/* Stage 4: 换样式 - 材质与参数配置 */}
        {currentStage === 4 && (
          <div className="h-full">
            <StyleConfigurator
              windowData={{
                width: Number(designData.width) || 2400,
                height: Number(designData.height) || 1800,
              }}
              onConfigChange={(config) => {
                console.log('样式配置已更新:', config)
              }}
            />
          </div>
        )}

        {/* Stage 5: 看效果 - 效果图与报价 */}
        {currentStage === 5 && (
          <div className="h-full flex flex-col lg:flex-row gap-4">
            {/* 左侧：报价单 */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <QuotationPanel 
                windowData={{
                  width: Number(designData.width) || 2400,
                  height: Number(designData.height) || 1800,
                }}
              />
            </div>

            {/* 右侧：效果图 */}
            <div className="flex-1 min-h-[600px] lg:min-h-0">
              <EffectGenerator
                windowData={{
                  width: Number(designData.width) || 2400,
                  height: Number(designData.height) || 1800,
                }}
                uploadedPhoto={uploadedPhoto}
              />
            </div>
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

