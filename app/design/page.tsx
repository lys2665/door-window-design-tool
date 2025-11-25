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
  RotateCw,
  Grid3x3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  // 经济型 - 4个窗型
  {
    id: "001",
    name: "单格固定窗",
    code: "001",
    gridCols: 1,
    gridRows: 1,
    description: "单个完整窗格，适合小窗户",
    features: ["经济型"],
    mullions: [] // 无梃
  },
  {
    id: "003",
    name: "两扇推拉窗",
    code: "003",
    gridCols: 2,
    gridRows: 1,
    description: "左右两格，1条竖梃",
    features: ["经济型"],
    mullions: [{ type: 'vertical' as const, ratio: 0.5 }]
  },
  {
    id: "002",
    name: "上下开启窗",
    code: "002",
    gridCols: 1,
    gridRows: 2,
    description: "上下两格，1条横梃",
    features: ["经济型"],
    mullions: [{ type: 'horizontal' as const, ratio: 0.5 }]
  },
  {
    id: "010",
    name: "田字四格窗",
    code: "010",
    gridCols: 2,
    gridRows: 2,
    description: "田字格，均分四格",
    features: ["经济型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5 }
    ]
  },
  
  // 实用型 - 4个窗型
  {
    id: "006",
    name: "上固定下开启",
    code: "006",
    gridCols: 2,
    gridRows: 2,
    description: "上1格，下2格",
    features: ["实用型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, startRow: 0.5 }
    ]
  },
  {
    id: "007",
    name: "上开启下固定",
    code: "007",
    gridCols: 2,
    gridRows: 2,
    description: "上2格，下1格",
    features: ["实用型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, endRow: 0.5 }
    ]
  },
  {
    id: "004",
    name: "三层分隔窗",
    code: "004",
    gridCols: 1,
    gridRows: 3,
    description: "上中下三格，2条横梃",
    features: ["实用型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 }
    ]
  },
  {
    id: "005",
    name: "三扇推拉窗",
    code: "005",
    gridCols: 3,
    gridRows: 1,
    description: "左中右三格，2条竖梃",
    features: ["实用型"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 }
    ]
  },
  
  // 美观型 - 4个窗型
  {
    id: "031",
    name: "对称六格窗",
    code: "031",
    gridCols: 3,
    gridRows: 2,
    description: "上下各3格",
    features: ["美观型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 }
    ]
  },
  {
    id: "032",
    name: "法式对称窗",
    code: "032",
    gridCols: 2,
    gridRows: 3,
    description: "左右各3格",
    features: ["美观型"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 }
    ]
  },
  {
    id: "033",
    name: "欧式拱形窗",
    code: "033",
    gridCols: 2,
    gridRows: 2,
    description: "优雅对称",
    features: ["美观型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.4 },
      { type: 'vertical' as const, ratio: 0.5 }
    ]
  },
  {
    id: "034",
    name: "现代简约窗",
    code: "034",
    gridCols: 3,
    gridRows: 1,
    description: "简约大气",
    features: ["美观型"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.3 },
      { type: 'vertical' as const, ratio: 0.7 }
    ]
  },
  
  // 通风型 - 3个窗型
  {
    id: "041",
    name: "多层通风窗",
    code: "041",
    gridCols: 2,
    gridRows: 3,
    description: "多层开启，通风好",
    features: ["通风型"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 }
    ]
  },
  {
    id: "042",
    name: "百叶通风窗",
    code: "042",
    gridCols: 1,
    gridRows: 4,
    description: "四层开启",
    features: ["通风型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.25 },
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.75 }
    ]
  },
  {
    id: "043",
    name: "侧开通风窗",
    code: "043",
    gridCols: 3,
    gridRows: 2,
    description: "侧边开启",
    features: ["通风型"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.4 },
      { type: 'vertical' as const, ratio: 0.6 }
    ]
  },
]

// 系列数据（扩展到6个，添加特征标签和剖面图）
const seriesOptions = [
  {
    id: "series-1",
    name: "断桥铝80系列",
    windowType: "推拉窗 2扇",
    windResistance: "9级",
    waterTightness: "6级",
    airTightness: "8级",
    budgetRange: "3000-6000元/㎡",
    features: ["隔热性能优异", "适合高层建筑", "性价比高"],
    tags: ["适合客厅", "隔音好", "性价比高"], // 新增特征标签
    profileImage: "/sliding-window-profile-cross-section.jpg", // 剖面图
    recommended: true,
  },
  {
    id: "series-2",
    name: "断桥铝108系列",
    windowType: "推拉窗 3扇",
    windResistance: "9级",
    waterTightness: "6级",
    airTightness: "9级",
    budgetRange: "4000-8000元/㎡",
    features: ["超强隔音", "保温效果极佳", "高端配置"],
    tags: ["适合卧室", "保温好", "高端"],
    profileImage: "/aluminum-window-profile-technical-drawing-cross-se.jpg",
    recommended: false,
  },
  {
    id: "series-3",
    name: "铝合金70系列",
    windowType: "推拉窗 2扇",
    windResistance: "7级",
    waterTightness: "5级",
    airTightness: "7级",
    budgetRange: "2000-4000元/㎡",
    features: ["经济实用", "性价比高", "适合多场景"],
    tags: ["经济实惠", "适合书房", "轻便"],
    profileImage: "/sliding-window-profile-cross-section.jpg",
    recommended: false,
  },
  {
    id: "series-4",
    name: "断桥铝60系列",
    windowType: "平开窗 2扇",
    windResistance: "8级",
    waterTightness: "6级",
    airTightness: "7级",
    budgetRange: "2500-5000元/㎡",
    features: ["开启灵活", "通风效果好", "密封性佳"],
    tags: ["通风好", "适合厨房", "灵活"],
    profileImage: "/aluminum-window-profile-technical-drawing-cross-se.jpg",
    recommended: false,
  },
  {
    id: "series-5",
    name: "系统窗120系列",
    windowType: "推拉窗 3扇",
    windResistance: "10级",
    waterTightness: "7级",
    airTightness: "9级",
    budgetRange: "5000-10000元/㎡",
    features: ["顶级性能", "智能控制", "极致静音"],
    tags: ["智能控制", "超静音", "顶级"],
    profileImage: "/sliding-window-profile-cross-section.jpg",
    recommended: false,
  },
  {
    id: "series-6",
    name: "节能断桥系列",
    windowType: "平开窗 2扇",
    windResistance: "9级",
    waterTightness: "6级",
    airTightness: "8级",
    budgetRange: "3500-7000元/㎡",
    features: ["节能环保", "隔热保温", "耐用"],
    tags: ["节能", "环保", "耐用"],
    profileImage: "/aluminum-window-profile-technical-drawing-cross-se.jpg",
    recommended: false,
  },
]

export default function DesignPage() {
  const [currentStage, setCurrentStage] = useState(1)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedWindowType, setSelectedWindowType] = useState<any>(null) // 选中的窗型
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // 窗型标签筛选
  const [isTagExpanded, setIsTagExpanded] = useState(false) // 标签展开状态
  const [windowType, setWindowType] = useState<"straight" | "L" | "U" | "Z">("straight") // 窗户类型：一字窗/L型窗/U型窗/Z型窗
  const [rotationAngle, setRotationAngle] = useState<0 | 90 | 180 | 270>(0) // 旋转角度（仅用于L/U/Z型窗）
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null) // 上传的现场照片
  const [showSeriesDrawer, setShowSeriesDrawer] = useState(false) // 系列详情抽屉
  const [selectedSeriesForDetail, setSelectedSeriesForDetail] = useState<string>("series-1") // 查看详情的系列
  const [showSeriesListDialog, setShowSeriesListDialog] = useState(false) // 系列列表弹窗
  
  // 新增的标签选择状态
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string[]>([]) // 预算范围
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([]) // 性能偏好
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<string[]>([]) // 设计偏好
  
  const [designData, setDesignData] = useState({
    width: "",
    height: "",
    budget: "50000",
    location: "客厅",
    floor: "中层",
    houseType: "1.6mm",
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
      toast.success("已选择窗型", {
        description: `${type.name}，点击"下一步"继续`,
      })
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
              <h1 className="text-sm md:text-base font-semibold text-foreground">门窗智能设计平台</h1>
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

      {/* Content Area - 优化间距以适配pad一屏 */}
      <div className="flex-1 overflow-auto p-3 md:p-4">
        {/* Stage 1: 基础选型 */}
        {currentStage === 1 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left: 2/3 width */}
            <div className="lg:col-span-2 space-y-3">
              {/* AI照片识别 - 参考AI封窗建议风格 - 紧凑版 */}
              <Card className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">AI智能识别</h3>
                      <p className="text-xs text-muted-foreground">秒速识别门窗尺寸</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="gap-1.5 h-8 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    去上传
                  </Button>
                </div>
              </Card>

              {/* 窗型信息 - 紧凑布局 */}
              <Card className="p-3">
                <h3 className="text-sm font-semibold mb-2.5">窗型信息</h3>
                
                {/* 窗户类型选择 - 4种类型 */}
                <div className="mb-3">
                  <Label className="text-xs mb-1.5 block">窗户类型</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { value: "straight", label: "一字窗" },
                      { value: "L", label: "L型窗" },
                      { value: "U", label: "U型窗" },
                      { value: "Z", label: "Z型窗" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setWindowType(type.value as any)}
                        className={cn(
                          "h-8 rounded-lg border-2 transition-all text-xs font-medium",
                          windowType === type.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 一字窗尺寸输入 */}
                {windowType === "straight" && (
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div>
                      <Label htmlFor="width" className="text-xs mb-1.5 block">宽度 (mm)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="1800"
                        value={designData.width}
                        onChange={(e) => updateData("width", e.target.value)}
                        className="h-10 text-base font-semibold"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs mb-1.5 block">高度 (mm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="1500"
                        value={designData.height}
                        onChange={(e) => updateData("height", e.target.value)}
                        className="h-10 text-base font-semibold"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                )}

                {/* L/U/Z型窗选项 - 合并图例和旋转角度 */}
                {windowType !== "straight" && (
                  <div className="mb-3">
                    <Label className="text-xs mb-1.5 block">{windowType}型窗配置</Label>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border">
                      <div className="flex gap-3 items-start">
                        {/* 图例 - 左侧，实时跟随旋转 */}
                        <div className="flex-shrink-0 bg-white dark:bg-muted/80 rounded-md p-2 border border-border/50">
                          <svg 
                            className="w-20 h-20 transition-transform duration-300" 
                            viewBox="0 0 100 100" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: `rotate(${rotationAngle}deg)` }}
                          >
                            {windowType === "L" && (
                              <>
                                <rect x="10" y="30" width="8" height="50" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                                <rect x="10" y="30" width="50" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <text x="14" y="58" fontSize="10" fill="white" fontWeight="bold">A</text>
                                <text x="35" y="36" fontSize="10" fill="currentColor">B</text>
                              </>
                            )}
                            {windowType === "U" && (
                              <>
                                <rect x="10" y="30" width="8" height="50" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                                <rect x="10" y="72" width="60" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <rect x="62" y="30" width="8" height="50" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <text x="14" y="58" fontSize="10" fill="white" fontWeight="bold">A</text>
                                <text x="40" y="78" fontSize="10" fill="currentColor">B</text>
                                <text x="66" y="58" fontSize="10" fill="currentColor">C</text>
                              </>
                            )}
                            {windowType === "Z" && (
                              <>
                                <rect x="10" y="50" width="8" height="30" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1"/>
                                <rect x="10" y="50" width="60" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <rect x="62" y="20" width="8" height="38" fill="none" stroke="currentColor" strokeWidth="2"/>
                                <text x="14" y="68" fontSize="10" fill="white" fontWeight="bold">A</text>
                                <text x="40" y="56" fontSize="10" fill="currentColor">B</text>
                                <text x="66" y="40" fontSize="10" fill="currentColor">C</text>
                              </>
                            )}
                          </svg>
                        </div>
                        
                        {/* 旋转角度下拉框 - 右侧 */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
                            <Label className="text-xs font-medium">旋转角度</Label>
                          </div>
                          <Select
                            value={rotationAngle.toString()}
                            onValueChange={(value) => setRotationAngle(Number(value) as 0 | 90 | 180 | 270)}
                          >
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="选择旋转角度" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0° - 默认方向</SelectItem>
                              <SelectItem value="90">90° - 顺时针旋转</SelectItem>
                              <SelectItem value="180">180° - 翻转</SelectItem>
                              <SelectItem value="270">270° - 逆时针旋转</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {windowType === "L" && "L型窗由两个相连边组成"}
                            {windowType === "U" && "U型窗由三个相连边组成"}
                            {windowType === "Z" && "Z型窗由三个相连边组成"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* L/U/Z型窗尺寸输入 - 简化版 */}
                {windowType !== "straight" && (
                  <div className="space-y-2 mb-3">
                    {/* L型窗尺寸输入 */}
                    {windowType === "L" && (
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
                    {windowType === "U" && (
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
                    {windowType === "Z" && (
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

                {/* 型材壁厚 - 横向滚动 - 紧凑版 */}
                <div className="mb-2.5">
                  <Label className="text-xs mb-1.5 block">型材壁厚</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["1.6mm", "1.8mm", "2.0mm", "3.0mm"].map((thickness) => (
                      <button
                        key={thickness}
                        onClick={() => updateData("houseType", thickness)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
                          designData.houseType === thickness
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {thickness}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 安装位置 - 横向滚动 - 紧凑版 */}
                <div className="mb-2.5">
                  <Label className="text-xs mb-1.5 block">安装位置</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["客厅", "卧室", "书房", "厨房", "阳台", "卫生间"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => updateData("location", loc)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
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

                {/* 楼层高度 - 横向滚动 - 紧凑版 */}
                <div className="mb-2.5">
                  <Label className="text-xs mb-1.5 block">楼层高度</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["低层(1-6层)", "中层(7-12层)", "高层(13-20层)", "超高层(20层+)"].map((floor) => (
                      <button
                        key={floor}
                        onClick={() => updateData("floor", floor)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
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

                {/* 预算范围标签 - 可多选 - 紧凑版 */}
                <div className="mb-2.5">
                  <Label className="text-xs mb-1.5 block">预算范围（可多选）</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["0-1000元/平", "1000-2000元/平", "2000-5000元/平"].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedBudgetRange(prev => 
                            prev.includes(range) 
                              ? prev.filter(r => r !== range)
                              : [...prev, range]
                          )
                        }}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
                          selectedBudgetRange.includes(range)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 性能偏好标签 - 可多选 - 紧凑版 */}
                <div className="mb-2.5">
                  <Label className="text-xs mb-1.5 block">性能偏好（可多选）</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["隔音", "抗风压", "隔热", "保温"].map((perf) => (
                      <button
                        key={perf}
                        onClick={() => {
                          setSelectedPerformance(prev => 
                            prev.includes(perf) 
                              ? prev.filter(p => p !== perf)
                              : [...prev, perf]
                          )
                        }}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
                          selectedPerformance.includes(perf)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {perf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 设计偏好标签 - 可多选 - 紧凑版 */}
                <div>
                  <Label className="text-xs mb-1.5 block">设计偏好（可多选）</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {["现代", "北欧", "新中式", "INS风", "地中海"].map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          setSelectedDesignStyle(prev => 
                            prev.includes(style) 
                              ? prev.filter(s => s !== style)
                              : [...prev, style]
                          )
                        }}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all shrink-0 ${
                          selectedDesignStyle.includes(style)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: 1/3 width - 智能推荐 (精致优化版) */}
            <div className="lg:col-span-1">
              {/* 智能推荐卡片 */}
              <div className="sticky top-0 rounded-2xl bg-gradient-to-b from-amber-50/80 to-white shadow-sm p-5 space-y-4">
                {/* 标题 */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-amber-900">
                    智能推荐
                  </h3>
                </div>

                {/* 价格区域 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-amber-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-amber-800">￥</span>
                    {designData.width && designData.height && designData.selectedSeries ? (
                      <span className="text-2xl font-bold text-amber-900">
                        {(() => {
                          const area = (Number(designData.width) * Number(designData.height)) / 1000000
                          const selectedSeries = seriesOptions.find(s => s.id === designData.selectedSeries)
                          if (selectedSeries) {
                            const priceMatch = selectedSeries.budgetRange.match(/(\d+)-/)
                            const unitPrice = priceMatch ? Number(priceMatch[1]) : 3000
                            const total = area * unitPrice
                            return (total / 10000).toFixed(2)
                          }
                          return "0.00"
                        })()}
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-amber-900/20">
                        实时计算
                      </span>
                    )}
                    <span className="text-sm text-amber-700">万元</span>
                  </div>
                  
                  {/* 面积信息 */}
                  <div className="flex items-center text-xs text-amber-700 mt-1.5">
                    <span>面积：</span>
                    {designData.width && designData.height ? (
                      <span className="font-medium ml-1">{((Number(designData.width) * Number(designData.height)) / 1000000).toFixed(2)} m²</span>
                    ) : (
                      <span className="opacity-40 ml-1">待计算</span>
                    )}
                  </div>
                </div>

                {/* 选择系列标题栏 */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">选择系列</h4>
                  <button 
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5"
                    onClick={() => setShowSeriesListDialog(true)}
                  >
                    查看全部
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                {/* 系列卡片横向滚动 */}
                <div className="relative -mx-1">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {seriesOptions.slice(0, 3).map((series, index) => (
                      <div
                        key={series.id}
                        className={cn(
                          "flex-shrink-0 w-[180px] rounded-xl overflow-hidden cursor-pointer transition-all bg-white",
                          "shadow-sm hover:shadow-md",
                          designData.selectedSeries === series.id 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : "hover:scale-[1.02]"
                        )}
                        onClick={() => {
                          updateData("selectedSeries", series.id)
                          updateData("series", series.name)
                          updateData("windowType", series.windowType)
                          toast.success("已切换系列", {
                            description: series.name,
                          })
                        }}
                      >
                        {/* 图片区域 */}
                        <div className="relative h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          <img 
                            src={series.profileImage} 
                            alt={series.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* 特征标签 - 左上角 */}
                          <div 
                            className={cn(
                              "absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white shadow-sm",
                              index === 0 
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                            )}
                          >
                            {series.tags[0]}
                          </div>
                          
                          {/* 性能参数徽章 */}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <div className="bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-gray-700 font-medium">
                              抗风{series.windResistance}
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-gray-700 font-medium">
                              气密{series.airTightness}
                            </div>
                          </div>
                        </div>
                        
                        {/* 信息区域 */}
                        <div className="p-3">
                          {/* 系列名称 */}
                          <h5 className="text-xs font-bold text-gray-900 mb-1 truncate">
                            {series.name}
                          </h5>
                          
                          {/* 价格 */}
                          <p className="text-[10px] text-gray-600 mb-2.5">
                            {series.budgetRange}
                          </p>
                          
                          {/* 查看详情按钮 - 精致版 */}
                          <button
                            className="w-full h-6 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center gap-1 transition-colors group"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedSeriesForDetail(series.id)
                              setShowSeriesDrawer(true)
                            }}
                          >
                            <Eye className="h-3 w-3 text-white opacity-80 group-hover:opacity-100" />
                            <span className="text-[10px] text-white font-medium">
                              查看详情
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 右侧渐变遮罩 - 更柔和 */}
                  <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: 选择窗型 - 基于Figma设计稿（亮色主题）*/}
        {currentStage === 2 && (
          <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
            {/* 顶部标题栏 */}
            <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">选择窗型</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    总数：{filteredWindowTypes.length} / {windowTypeOptions.length}
                  </p>
                </div>
                {selectedWindowType && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">已选: {selectedWindowType.name}</span>
                  </div>
                )}
              </div>
              
              {/* 标签筛选 */}
              <div className="flex items-center gap-2">
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
                    <button
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0",
                        selectedTags.length === 0
                          ? "bg-gray-900 text-white shadow-sm" 
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
                      )}
                      onClick={() => toggleTag('全部')}
                    >
                      全部
                    </button>
                    
                    {/* 其他标签 */}
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1",
                          selectedTags.includes(tag) 
                            ? "bg-gray-900 text-white shadow-sm" 
                            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900"
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <X className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 展开/收起按钮 */}
                <button
                  className="shrink-0 px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                  onClick={toggleExpand}
                >
                  {isTagExpanded ? (
                    <>
                      <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                      收起
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 transition-transform" />
                      展开
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 窗型网格 - Figma设计风格 */}
            <div className="flex-1 overflow-auto p-6">
              {/* 未选中窗型提示 */}
              {!selectedWindowType && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        请选择一个窗型
                      </h3>
                      <p className="text-xs text-blue-700">
                        点击窗型卡片进行选择，选择后点击右上角"下一步"按钮继续
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 4列网格布局 - Figma设计规范 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px]">
                {filteredWindowTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex flex-col gap-1"
                  >
                    {/* 卡片主体 - Figma风格 */}
                    <div
                      className={cn(
                        "group relative rounded-[8px] overflow-hidden cursor-pointer transition-all bg-white",
                        "border border-gray-100 hover:border-gray-300",
                        selectedWindowType?.id === type.id 
                          ? "border-2 border-primary shadow-lg ring-2 ring-primary/20" 
                          : "hover:shadow-md active:scale-[0.98]"
                      )}
                      onClick={() => handleWindowTypeSelect(type)}
                    >
                      {/* 窗型结构图 */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
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
                          <div className="absolute inset-1 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-50/20 pointer-events-none" />
                        </div>
                      </div>
                      
                      {/* 右上角复选框 - Figma设计 */}
                      <div className="absolute top-2 right-2">
                        {selectedWindowType?.id === type.id ? (
                          <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-sm bg-white border-2 border-gray-300 group-hover:border-gray-400 transition-colors" />
                        )}
                      </div>
                    </div>
                    
                    {/* 底部信息 - Figma设计 */}
                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-900 truncate flex-1">
                          {type.name}
                        </h3>
                        <span className="text-[10px] text-gray-400 ml-2 shrink-0">
                          {type.gridCols}×{type.gridRows}
                        </span>
                      </div>
                      {/* 标签信息 */}
                      <div className="flex flex-wrap gap-1">
                        {type.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="text-[10px] h-4 px-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
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

      {/* Series List Dialog - 系列列表弹窗 */}
      <Dialog open={showSeriesListDialog} onOpenChange={setShowSeriesListDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5 text-primary" />
              选择门窗系列
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seriesOptions.map((series) => (
                <div
                  key={series.id}
                  className={cn(
                    "rounded-lg overflow-hidden border-2 transition-all cursor-pointer group",
                    designData.selectedSeries === series.id
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  )}
                  onClick={() => {
                    updateData("selectedSeries", series.id)
                    updateData("series", series.name)
                    updateData("windowType", series.windowType)
                    setShowSeriesListDialog(false)
                    toast.success("已选择系列", {
                      description: series.name,
                    })
                  }}
                >
                  {/* 剖面结构图 */}
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                    <img 
                      src={series.profileImage} 
                      alt={series.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {series.recommended && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm h-6 px-3 border-0">
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          推荐
                        </Badge>
                      </div>
                    )}
                    {designData.selectedSeries === series.id && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white text-sm h-6 px-3 border-0">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          已选
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="p-4">
                    <h4 className="font-bold text-base mb-1.5">{series.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{series.windowType}</p>
                    
                    {/* 特征标签 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {series.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="text-xs h-6 px-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* 性能参数 */}
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">抗风{series.windResistance}</Badge>
                      <Badge variant="outline" className="text-xs">水密{series.waterTightness}</Badge>
                      <Badge variant="outline" className="text-xs">气密{series.airTightness}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-bold">{series.budgetRange}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSeriesForDetail(series.id)
                          setShowSeriesDrawer(true)
                          setShowSeriesListDialog(false)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        查看详情
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Series Detail Drawer - 系列详情抽屉（从右侧弹出）*/}
      <Sheet open={showSeriesDrawer} onOpenChange={setShowSeriesDrawer}>
        <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-[90vw] overflow-y-auto">
          {(() => {
            const selectedSeries = seriesOptions.find(s => s.id === selectedSeriesForDetail) || seriesOptions[0]
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    {selectedSeries.name}
                    {selectedSeries.recommended && (
                      <Badge className="bg-primary text-xs">推荐</Badge>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6 p-4">
                  {/* 系列效果图 */}
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src="/modern-aluminum-sliding-window.jpg" 
                      alt={selectedSeries.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-xs text-muted-foreground mb-1">窗型</div>
                      <div className="font-semibold">{selectedSeries.windowType}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-xs text-muted-foreground mb-1">预算范围</div>
                      <div className="font-semibold text-primary">{selectedSeries.budgetRange}</div>
                    </div>
                  </div>

                  {/* 性能参数 */}
                  <div>
                    <h3 className="font-semibold mb-3">性能参数</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-lg border bg-card text-center">
                        <div className="text-2xl font-bold text-primary">{selectedSeries.windResistance}</div>
                        <div className="text-xs text-muted-foreground mt-1">抗风压</div>
                      </div>
                      <div className="p-3 rounded-lg border bg-card text-center">
                        <div className="text-2xl font-bold text-primary">{selectedSeries.waterTightness}</div>
                        <div className="text-xs text-muted-foreground mt-1">水密性</div>
                      </div>
                      <div className="p-3 rounded-lg border bg-card text-center">
                        <div className="text-2xl font-bold text-primary">{selectedSeries.airTightness}</div>
                        <div className="text-xs text-muted-foreground mt-1">气密性</div>
                      </div>
                    </div>
                  </div>

                  {/* 产品特点 */}
                  <div>
                    <h3 className="font-semibold mb-3">产品特点</h3>
                    <div className="space-y-2">
                      {selectedSeries.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 适用场景 */}
                  <div>
                    <h3 className="font-semibold mb-3">适用场景</h3>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        {selectedSeries.id === "series-1" && "适用于中高层住宅、公寓等常规建筑，提供优秀的隔热隔音性能，是性价比较高的选择。"}
                        {selectedSeries.id === "series-2" && "适用于高端住宅、别墅等对性能要求较高的建筑，超强的保温隔音性能确保舒适居住环境。"}
                        {selectedSeries.id === "series-3" && "适用于经济型住宅、出租房等对成本敏感的场景，基本性能可靠，经济实用。"}
                        {selectedSeries.id === "series-4" && "适用于需要良好通风的空间，如卧室、书房等，开启灵活方便，密封性能优秀。"}
                        {selectedSeries.id === "series-5" && "适用于超高层建筑、高端别墅等对性能要求极高的场景，配备智能控制系统，提供顶级居住体验。"}
                      </p>
                    </div>
                  </div>

                  {/* 选择按钮 */}
                  <div className="flex gap-3 pt-2 sticky bottom-0 bg-background pb-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        updateData("selectedSeries", selectedSeries.id)
                        updateData("series", selectedSeries.name)
                        updateData("windowType", selectedSeries.windowType)
                        setShowSeriesDrawer(false)
                        toast.success("已选择系列", {
                          description: `${selectedSeries.name} - ${selectedSeries.windowType}`,
                        })
                      }}
                    >
                      选择该系列
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowSeriesDrawer(false)}
                    >
                      关闭
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}

