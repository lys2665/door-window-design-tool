"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { 
  ChevronLeft,
  Grid3x3,
  Copy,
  DoorOpen,
  Wind,
  LayoutGrid,
  Maximize2,
  Grip,
  X,
  Check,
  ChevronDown,
  Lock,
  Unlock,
  Trash2,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

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
    id: "008",
    name: "008矩形3分格12",
    code: "008",
    gridCols: 2,
    gridRows: 2,
    description: "左1格，右2格",
    features: ["左大右小", "灵活配置"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.5, startCol: 0.5 }
    ]
  },
  {
    id: "009",
    name: "009矩形3分格21",
    code: "009",
    gridCols: 2,
    gridRows: 2,
    description: "左2格，右1格",
    features: ["左小右大", "主次分明"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.5, endCol: 0.5 }
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
    id: "011",
    name: "011矩形4分格2/1/1",
    code: "011",
    gridCols: 2,
    gridRows: 3,
    description: "上2格，中1格，下1格",
    features: ["上下层次", "丰富"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 },
      { type: 'vertical' as const, ratio: 0.5, endRow: 0.333 }
    ]
  },
  {
    id: "012",
    name: "012矩形4分格1/2/1",
    code: "012",
    gridCols: 2,
    gridRows: 3,
    description: "上1格，中2格，下1格",
    features: ["中间开启", "美观"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 },
      { type: 'vertical' as const, ratio: 0.5, startRow: 0.333, endRow: 0.666 }
    ]
  },
  {
    id: "017",
    name: "017矩形4分格31",
    code: "017",
    gridCols: 1,
    gridRows: 4,
    description: "上3格，下1格",
    features: ["上三层", "下整体"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.25 },
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.75 },
      { type: 'vertical' as const, ratio: 0.333, endRow: 0.75 },
      { type: 'vertical' as const, ratio: 0.666, endRow: 0.75 }
    ]
  },
  {
    id: "018",
    name: "018矩形4分格22",
    code: "018",
    gridCols: 3,
    gridRows: 2,
    description: "左1格，中2格，右1格",
    features: ["中间分层", "两侧整体"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 },
      { type: 'horizontal' as const, ratio: 0.5, startCol: 0.333, endCol: 0.666 }
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
    id: "020",
    name: "020矩形4分格3/1",
    code: "020",
    gridCols: 2,
    gridRows: 2,
    description: "上3格，下1格",
    features: ["上分层", "下整体"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333, endRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.666, endRow: 0.5 }
    ]
  },
  {
    id: "021",
    name: "021矩形4分格1/3",
    code: "021",
    gridCols: 2,
    gridRows: 2,
    description: "上1格，下3格",
    features: ["上整体", "下分层"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333, startRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.666, startRow: 0.5 }
    ]
  },
  {
    id: "022",
    name: "022矩形5分格212",
    code: "022",
    gridCols: 3,
    gridRows: 2,
    description: "上2格，中1格，下2格",
    features: ["中间整体", "两侧分层"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 },
      { type: 'horizontal' as const, ratio: 0.5, endCol: 0.333 },
      { type: 'horizontal' as const, ratio: 0.5, startCol: 0.666 }
    ]
  },
  {
    id: "023",
    name: "023矩形5分格32B",
    code: "023",
    gridCols: 3,
    gridRows: 2,
    description: "上3格，下2格",
    features: ["上下分层", "不对称"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333, endRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.666, endRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, startRow: 0.5 }
    ]
  },
  {
    id: "024",
    name: "024矩形5分格23B",
    code: "024",
    gridCols: 3,
    gridRows: 2,
    description: "上2格，下3格",
    features: ["上下分层", "不对称"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, endRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.333, startRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.666, startRow: 0.5 }
    ]
  },
  {
    id: "025",
    name: "025矩形5分格32",
    code: "025",
    gridCols: 2,
    gridRows: 3,
    description: "左3格，右2格",
    features: ["左右分层", "不对称"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.333, endCol: 0.5 },
      { type: 'horizontal' as const, ratio: 0.666, endCol: 0.5 },
      { type: 'horizontal' as const, ratio: 0.5, startCol: 0.5 }
    ]
  },
  {
    id: "026",
    name: "026矩形5分格23",
    code: "026",
    gridCols: 2,
    gridRows: 3,
    description: "左2格，右3格",
    features: ["左右分层", "不对称"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.5, endCol: 0.5 },
      { type: 'horizontal' as const, ratio: 0.333, startCol: 0.5 },
      { type: 'horizontal' as const, ratio: 0.666, startCol: 0.5 }
    ]
  },
  {
    id: "027",
    name: "027矩形5分格3/2",
    code: "027",
    gridCols: 3,
    gridRows: 2,
    description: "上3格，下2格",
    features: ["上下层次", "实用"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.333 },
      { type: 'vertical' as const, ratio: 0.666 },
      { type: 'vertical' as const, ratio: 0.5, startRow: 0.5 }
    ]
  },
  {
    id: "028",
    name: "028矩形5分格2/3",
    code: "028",
    gridCols: 3,
    gridRows: 2,
    description: "上2格，下3格",
    features: ["上下层次", "灵活"],
    mullions: [
      { type: 'horizontal' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.5, endRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.333, startRow: 0.5 },
      { type: 'vertical' as const, ratio: 0.666, startRow: 0.5 }
    ]
  },
  {
    id: "029",
    name: "029矩形5分格2111",
    code: "029",
    gridCols: 4,
    gridRows: 2,
    description: "左2格，右3个整格",
    features: ["左分层", "右连续"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.25 },
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.75 },
      { type: 'horizontal' as const, ratio: 0.5, endCol: 0.25 }
    ]
  },
  {
    id: "030",
    name: "030矩形5分格1112",
    code: "030",
    gridCols: 4,
    gridRows: 2,
    description: "左3个整格，右2格",
    features: ["左连续", "右分层"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.25 },
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'vertical' as const, ratio: 0.75 },
      { type: 'horizontal' as const, ratio: 0.5, startCol: 0.75 }
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
  {
    id: "032",
    name: "032矩形6分格33",
    code: "032",
    gridCols: 2,
    gridRows: 3,
    description: "左右各3格",
    features: ["对称", "分层"],
    mullions: [
      { type: 'vertical' as const, ratio: 0.5 },
      { type: 'horizontal' as const, ratio: 0.333 },
      { type: 'horizontal' as const, ratio: 0.666 }
    ]
  }
]

// 执手样式数据
const handleStyles = [
  { id: "fork", name: "拨叉执手", icon: "🔧" },
  { id: "two-point", name: "两点锁执手", icon: "🔐" },
  { id: "round", name: "圆柄执手", icon: "⭕" },
  { id: "flat", name: "平柄执手", icon: "▬" }
]

// 配件选项
const accessoryOptions = [
  { 
    id: "down-rail", 
    name: "下降料", 
    materials: ["铝合金", "不锈钢", "塑钢"],
    styles: ["标准型", "加厚型", "静音型"]
  },
  { 
    id: "grille", 
    name: "隔栅", 
    materials: ["铝合金", "不锈钢"],
    styles: ["竖条", "横条", "格子"]
  },
  { 
    id: "guardrail", 
    name: "护栏", 
    materials: ["铝合金", "不锈钢", "锌合金"],
    styles: ["直杆", "弯杆", "艺术栏杆"]
  },
  { 
    id: "divider", 
    name: "隔条", 
    materials: ["铝合金", "不锈钢"],
    styles: ["单条", "双条", "装饰条"]
  },
  { 
    id: "ventilation", 
    name: "新风系统", 
    materials: ["ABS", "铝合金"],
    styles: ["侧挂式", "顶置式", "隐藏式"]
  }
]

// 纱窗材质
const screenMaterials = [
  { id: "diamond", name: "金刚网", features: ["防盗", "防蚊", "耐用"] },
  { id: "nylon", name: "尼龙网", features: ["通风", "透光", "经济"] },
  { id: "stainless", name: "不锈钢网", features: ["防锈", "坚固", "高端"] }
]

// 玻璃样式
const glassTypes = [
  { id: "single", name: "单层玻璃", thickness: "5mm", features: ["经济型"] },
  { id: "double", name: "双层中空", thickness: "5+9A+5", features: ["隔音", "保温"] },
  { id: "low-e", name: "Low-E玻璃", thickness: "5+12A+5", features: ["节能", "隔热", "高端"] },
  { id: "laminated", name: "夹胶玻璃", thickness: "5+0.76PVB+5", features: ["安全", "隔音", "防爆"] }
]

interface WindowTypeDesignerProps {
  onBack?: () => void
  initialWidth?: number
  initialHeight?: number
  preselectedType?: any // 预选的窗型
}

export default function WindowTypeDesigner({ 
  onBack, 
  initialWidth = 2400, 
  initialHeight = 1800,
  preselectedType = null
}: WindowTypeDesignerProps) {
  // 状态管理
  const [hasSelectedType, setHasSelectedType] = useState(!!preselectedType) // 是否已经选择过窗型
  const [showTypeSelector, setShowTypeSelector] = useState(!preselectedType) // 如果有预选窗型，不显示选择器
  const [selectedType, setSelectedType] = useState<typeof windowTypeOptions[0] | null>(preselectedType)
  const [selectedPane, setSelectedPane] = useState<number | null>(null)
  const [selectedHandle, setSelectedHandle] = useState(false) // 是否选中执手
  const [canvasWidth, setCanvasWidth] = useState(initialWidth)
  const [canvasHeight, setCanvasHeight] = useState(initialHeight)
  const [zoom, setZoom] = useState(1) // 画布缩放比例
  const [editingDimension, setEditingDimension] = useState<'width' | 'height' | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const touchStartDistance = useRef<number>(0)
  
  // 区域状态（重构后的数据结构）
  const [units, setUnits] = useState<Array<{
    id: number
    x: number
    y: number
    width: number
    height: number
    // 区域类型：封窗 or 开启窗
    type: 'fixed' | 'openable'
    // 开启方式：平开、推拉、内倒等
    openingType?: 'casement' | 'sliding' | 'tilt' | 'fixed'
    // 开启方向：左开、右开、上开、下开等
    openingDirection?: 'left' | 'right' | 'top' | 'bottom' | 'left-right'
    // 玻璃类型
    glassType: 'single' | 'double' | 'low-e' | 'laminated'
    // 配件
    hasScreen: boolean
    screenPosition?: 'inside' | 'outside' // 纱窗位置
    hasGrille: boolean
    grilleStyle?: string
    hasGuardrail: boolean
    guardrailHeight?: number
    // 执手配置
    handleHeight?: number
    handleStyle?: string
  }>>([])

  // 梃（分隔条）状态
  const [mullions, setMullions] = useState<Array<{
    id: number
    type: 'vertical' | 'horizontal'
    position: number // 相对于框架的位置（像素）
  }>>([])
  
  // 配置菜单状态
  const [showConfigMenu, setShowConfigMenu] = useState(false)
  const [configMenuPosition, setConfigMenuPosition] = useState({ x: 0, y: 0 })
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null)
  
  // 配件面板状态
  const [handleHeight, setHandleHeight] = useState(1000)
  const [handleStyle, setHandleStyle] = useState("fork")
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [expandedAccessories, setExpandedAccessories] = useState<{[key: string]: boolean}>({})
  
  // 添加梃模式
  const [addMullionMode, setAddMullionMode] = useState<'vertical' | 'horizontal' | null>(null)
  
  // 切换配件展开状态
  const toggleAccessory = (accessoryId: string) => {
    setExpandedAccessories(prev => ({
      ...prev,
      [accessoryId]: !prev[accessoryId]
    }))
    if (!expandedAccessories[accessoryId]) {
      setSelectedAccessories(prev => 
        prev.includes(accessoryId) ? prev : [...prev, accessoryId]
      )
    }
  }

  // 根据梃重新计算所有区域
  const recalculateUnits = (currentMullions: typeof mullions) => {
    // 获取所有垂直梃和水平梃的位置
    const vPositions = [0, ...currentMullions.filter(m => m.type === 'vertical').map(m => m.position).sort((a, b) => a - b), canvasWidth]
    const hPositions = [0, ...currentMullions.filter(m => m.type === 'horizontal').map(m => m.position).sort((a, b) => a - b), canvasHeight]
    
    // 生成所有区域
    const newUnits: typeof units = []
    let unitId = 0
    
    for (let i = 0; i < hPositions.length - 1; i++) {
      for (let j = 0; j < vPositions.length - 1; j++) {
        newUnits.push({
          id: unitId++,
          x: vPositions[j],
          y: hPositions[i],
          width: vPositions[j + 1] - vPositions[j],
          height: hPositions[i + 1] - hPositions[i],
          type: 'fixed', // 默认为封窗
          glassType: 'double', // 默认双层中空玻璃
          hasScreen: false,
          hasGrille: false,
          hasGuardrail: false
        })
      }
    }
    
    setUnits(newUnits)
  }
  
  // 选择窗型
  const handleTypeSelect = (type: typeof windowTypeOptions[0]) => {
    setSelectedType(type)
    setShowTypeSelector(false)
    setHasSelectedType(true)
    
    // 根据窗型的 mullions 配置初始化梃的布局
    const newMullions: typeof mullions = []
    let mullionId = 0
    
    // 根据窗型定义的 mullions 数组生成梃
    if (type.mullions && type.mullions.length > 0) {
      type.mullions.forEach((mullionDef: any) => {
        if (mullionDef.type === 'vertical') {
          newMullions.push({
            id: mullionId++,
            type: 'vertical',
            position: canvasWidth * mullionDef.ratio
          })
        } else if (mullionDef.type === 'horizontal') {
          newMullions.push({
            id: mullionId++,
            type: 'horizontal',
            position: canvasHeight * mullionDef.ratio
          })
        }
      })
    }
    
    setMullions(newMullions)
    
    // 根据梃自动计算区域
    recalculateUnits(newMullions)
  }
  
  // 添加梃
  const addMullion = (type: 'vertical' | 'horizontal', position: number) => {
    const newMullion = {
      id: Math.max(0, ...mullions.map(m => m.id)) + 1,
      type,
      position
    }
    const newMullions = [...mullions, newMullion]
    setMullions(newMullions)
    recalculateUnits(newMullions)
    setAddMullionMode(null)
  }
  
  // 删除梃
  const deleteMullion = (mullionId: number) => {
    const newMullions = mullions.filter(m => m.id !== mullionId)
    setMullions(newMullions)
    recalculateUnits(newMullions)
  }
  
  // 点击区域，打开配置菜单
  const handleUnitClick = (unitId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedUnit(unitId)
    setShowConfigMenu(true)
    setConfigMenuPosition({ x: e.clientX, y: e.clientY })
  }
  
  // 配置区域类型
  const configureUnitType = (unitId: number, type: 'fixed' | 'openable') => {
    setUnits(units.map(u => 
      u.id === unitId ? { ...u, type } : u
    ))
    setShowConfigMenu(false)
  }
  
  // 配置开启方式
  const configureOpeningType = (unitId: number, openingType: typeof units[0]['openingType']) => {
    setUnits(units.map(u => 
      u.id === unitId ? { ...u, openingType } : u
    ))
  }
  
  // 配置开启方向
  const configureOpeningDirection = (unitId: number, direction: typeof units[0]['openingDirection']) => {
    setUnits(units.map(u => 
      u.id === unitId ? { ...u, openingDirection: direction } : u
    ))
  }
  
  // 配置玻璃类型
  const configureGlassType = (unitId: number, glassType: typeof units[0]['glassType']) => {
    setUnits(units.map(u => 
      u.id === unitId ? { ...u, glassType } : u
    ))
  }
  
  // 切换配件
  const toggleUnitAccessory = (unitId: number, accessory: 'screen' | 'grille' | 'guardrail') => {
    setUnits(units.map(u => {
      if (u.id !== unitId) return u
      switch (accessory) {
        case 'screen':
          return { ...u, hasScreen: !u.hasScreen }
        case 'grille':
          return { ...u, hasGrille: !u.hasGrille }
        case 'guardrail':
          return { ...u, hasGuardrail: !u.hasGuardrail }
        default:
          return u
      }
    }))
  }
  
  // 缩放控制
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2))
  }
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5))
  }
  
  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
    }
  }
  
  // 触摸手势缩放（双指）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
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
    if (e.touches.length === 2 && touchStartDistance.current > 0) {
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      const delta = (distance - touchStartDistance.current) * 0.002
      setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
      touchStartDistance.current = distance
    }
  }
  
  const handleTouchEnd = () => {
    touchStartDistance.current = 0
  }


  // 标签筛选状态
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // 空数组表示"全部"
  const [isTagExpanded, setIsTagExpanded] = useState(false) // 标签展开状态
  
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
  
  // 如果有预选窗型，初始化梃布局
  useEffect(() => {
    if (preselectedType && hasSelectedType && selectedType && mullions.length === 0) {
      const newMullions: typeof mullions = []
      let mullionId = 0
      
      if (selectedType.mullions && selectedType.mullions.length > 0) {
        selectedType.mullions.forEach((mullionDef: any) => {
          if (mullionDef.type === 'vertical') {
            newMullions.push({
              id: mullionId++,
              type: 'vertical',
              position: canvasWidth * mullionDef.ratio
            })
          } else if (mullionDef.type === 'horizontal') {
            newMullions.push({
              id: mullionId++,
              type: 'horizontal',
              position: canvasHeight * mullionDef.ratio
            })
          }
        })
      }
      
      if (newMullions.length > 0) {
        setMullions(newMullions)
        recalculateUnits(newMullions)
      }
    }
  }, [preselectedType, hasSelectedType, selectedType, canvasWidth, canvasHeight, mullions.length])
  
  // 切换标签选择
  const toggleTag = (tag: string) => {
    if (tag === '全部') {
      setSelectedTags([]) // 选择全部，清空选中标签
    } else {
      setSelectedTags(prev => {
        if (prev.includes(tag)) {
          // 如果已选中，移除该标签
          const newTags = prev.filter(t => t !== tag)
          return newTags
        } else {
          // 如果未选中，添加该标签
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

  // 窗型选择器 - 只在第一次或手动切换时显示
  if (showTypeSelector && (!hasSelectedType || selectedType === null)) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* 顶部标题栏 - 紧凑设计，无分割线 */}
        <div className="flex-none px-4 py-3 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">选择窗型</h2>
              <p className="text-xs text-muted-foreground">
                总数：{filteredWindowTypes.length} / {windowTypeOptions.length}
              </p>
            </div>
          </div>
          
          {/* 标签筛选 */}
          <div className="mt-3">
            {/* 标签容器 - 单行滚动或多行展开 */}
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

        {/* 窗型网格 - 紧凑布局，适配iPad */}
        <div className="flex-1 overflow-auto p-3 md:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
            {filteredWindowTypes.map((type) => (
              <Card
                key={type.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary active:scale-[0.98] overflow-hidden bg-white"
                onClick={() => handleTypeSelect(type)}
              >
                {/* 窗型结构图 - 框梃更清晰 */}
                <div className="aspect-[4/3] bg-white p-3 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[140px] max-h-[105px] border-[4px] border-gray-900 bg-white rounded-sm shadow-sm">
                    {/* 渲染梃 - 更粗更清晰 */}
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
                    {/* 玻璃效果 - 色调降低 */}
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-100/20 via-blue-50/15 to-blue-100/20 pointer-events-none" />
                  </div>
                </div>
                
                {/* 底部信息 - 标签在下方，无分割线 */}
                <div className="px-2 py-2 bg-white">
                  <h3 className="text-sm font-bold mb-1 truncate">{type.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {type.description}
                  </p>
                  {/* 特性标签 - 不同颜色 */}
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
    )
  }

  // 主设计界面
  return (
    <div className="h-full flex flex-col bg-background">
      {/* 顶部工具栏 */}
      <div className="flex-none p-3 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTypeSelector(true)}
              className="gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">切换窗型</span>
            </Button>
            
            {/* 添加梃按钮组 */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={addMullionMode === 'vertical' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAddMullionMode(addMullionMode === 'vertical' ? null : 'vertical')}
                className="h-7 px-2 text-xs"
                title="添加垂直梃"
              >
                ➕ 竖梃
              </Button>
              <Button
                variant={addMullionMode === 'horizontal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAddMullionMode(addMullionMode === 'horizontal' ? null : 'horizontal')}
                className="h-7 px-2 text-xs"
                title="添加水平梃"
              >
                ➕ 横梃
              </Button>
            </div>
            
            <div className="hidden md:block text-sm">
              <span className="text-muted-foreground">当前窗型：</span>
              <span className="font-semibold ml-1">{selectedType?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <span className="text-xs">外框尺寸:</span>
              <span className="font-mono font-bold text-blue-600">{canvasWidth}×{canvasHeight}mm</span>
            </Badge>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-7 w-7 p-0"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-mono min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-7 w-7 p-0"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 添加梃模式提示 */}
        {addMullionMode && (
          <div className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
            💡 {addMullionMode === 'vertical' ? '点击画布添加垂直梃' : '点击画布添加水平梃'}，点击任意梃可删除
          </div>
        )}
      </div>

      {/* 主工作区 - 左右布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：区域配置面板 */}
        <div className="w-80 flex-none border-r bg-card flex flex-col overflow-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              区域配置
            </h3>
            
            {selectedUnit !== null && units[selectedUnit] ? (
              <div className="space-y-4">
                {/* 当前区域信息 */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs font-semibold text-blue-900 mb-2">
                    区域 #{selectedUnit + 1}
                  </div>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div>尺寸: {units[selectedUnit].width} × {units[selectedUnit].height}mm</div>
                    <div>位置: x={units[selectedUnit].x}, y={units[selectedUnit].y}</div>
                  </div>
                </div>
                
                {/* 区域类型配置 */}
                <div>
                  <Label className="text-xs mb-2 block font-semibold">区域类型 *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={units[selectedUnit].type === 'fixed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => configureUnitType(selectedUnit, 'fixed')}
                      className="h-16 flex-col gap-1"
                    >
                      <Lock className="w-5 h-5" />
                      <span className="text-xs">封窗</span>
                    </Button>
                    <Button
                      variant={units[selectedUnit].type === 'openable' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => configureUnitType(selectedUnit, 'openable')}
                      className="h-16 flex-col gap-1"
                    >
                      <DoorOpen className="w-5 h-5" />
                      <span className="text-xs">开启窗</span>
                    </Button>
                  </div>
                </div>
                
                {/* 开启窗配置 */}
                {units[selectedUnit].type === 'openable' && (
                  <>
                    <div>
                      <Label className="text-xs mb-2 block font-semibold">开启方式</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={units[selectedUnit].openingType === 'casement' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningType(selectedUnit, 'casement')}
                          className="text-xs"
                        >
                          平开
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingType === 'sliding' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningType(selectedUnit, 'sliding')}
                          className="text-xs"
                        >
                          推拉
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingType === 'tilt' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningType(selectedUnit, 'tilt')}
                          className="text-xs"
                        >
                          内倒
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingType === 'fixed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningType(selectedUnit, 'fixed')}
                          className="text-xs"
                        >
                          固定
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs mb-2 block font-semibold">开启方向</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={units[selectedUnit].openingDirection === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningDirection(selectedUnit, 'left')}
                          className="text-xs"
                        >
                          ← 左开
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingDirection === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningDirection(selectedUnit, 'right')}
                          className="text-xs"
                        >
                          右开 →
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingDirection === 'top' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningDirection(selectedUnit, 'top')}
                          className="text-xs"
                        >
                          ↑ 上开
                        </Button>
                        <Button
                          variant={units[selectedUnit].openingDirection === 'bottom' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => configureOpeningDirection(selectedUnit, 'bottom')}
                          className="text-xs"
                        >
                          ↓ 下开
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* 玻璃类型配置 */}
                <div>
                  <Label className="text-xs mb-2 block font-semibold">玻璃类型</Label>
                  <div className="space-y-1">
                    {glassTypes.map((glass) => (
                      <Button
                        key={glass.id}
                        variant={units[selectedUnit].glassType === glass.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => configureGlassType(selectedUnit, glass.id as any)}
                        className="w-full justify-start text-xs h-auto py-2"
                      >
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{glass.name}</div>
                          <div className="text-[10px] opacity-70">{glass.thickness}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* 配件选项 */}
                <div>
                  <Label className="text-xs mb-2 block font-semibold">配件选项</Label>
                  <div className="space-y-2">
                    <Button
                      variant={units[selectedUnit].hasScreen ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleUnitAccessory(selectedUnit, 'screen')}
                      className="w-full justify-start text-xs"
                    >
                      <Wind className="w-4 h-4 mr-2" />
                      纱窗
                      {units[selectedUnit].hasScreen && <Check className="w-4 h-4 ml-auto" />}
                    </Button>
                    
                    <Button
                      variant={units[selectedUnit].hasGrille ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleUnitAccessory(selectedUnit, 'grille')}
                      className="w-full justify-start text-xs"
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      格栅
                      {units[selectedUnit].hasGrille && <Check className="w-4 h-4 ml-auto" />}
                    </Button>
                    
                    <Button
                      variant={units[selectedUnit].hasGuardrail ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleUnitAccessory(selectedUnit, 'guardrail')}
                      className="w-full justify-start text-xs"
                    >
                      <Grip className="w-4 h-4 mr-2" />
                      护栏
                      {units[selectedUnit].hasGuardrail && <Check className="w-4 h-4 ml-auto" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                点击画布中的区域进行配置
              </div>
            )}
          </div>
        </div>
        {/* 右侧：2D画布 */}
        <div 
          className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="max-w-5xl mx-auto">
            {/* 画布容器 */}
            <div className="bg-white rounded-xl shadow-2xl p-12 border-4 border-gray-300">
              <div
                ref={canvasRef}
                className="relative mx-auto bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-200"
                style={{
                  width: `${Math.min(canvasWidth / 2.5, 600) * zoom}px`,
                  height: `${Math.min(canvasHeight / 2.5, 450) * zoom}px`,
                }}
                onClick={(e) => {
                  // 在添加梃模式下，点击画布添加梃
                  if (addMullionMode && canvasRef.current) {
                    const rect = canvasRef.current.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const scaleX = canvasWidth / rect.width
                    const scaleY = canvasHeight / rect.height
                    
                    if (addMullionMode === 'vertical') {
                      addMullion('vertical', x * scaleX)
                    } else {
                      addMullion('horizontal', y * scaleY)
                    }
                  }
                }}
              >
                {/* 窗框外框 */}
                <div className="absolute inset-0 border-[16px] border-gray-700 rounded-sm" />
                
                {/* 梃（分隔条） */}
                {mullions.map((mullion) => (
                  <div
                    key={mullion.id}
                    className={cn(
                      "absolute bg-gray-600 hover:bg-red-500 cursor-pointer transition-colors z-30",
                      mullion.type === 'vertical' ? "w-2 h-full" : "w-full h-2"
                    )}
                    style={{
                      [mullion.type === 'vertical' ? 'left' : 'top']: `${(mullion.position / (mullion.type === 'vertical' ? canvasWidth : canvasHeight)) * 100}%`,
                      transform: mullion.type === 'vertical' ? 'translateX(-50%)' : 'translateY(-50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm('删除此梃？')) {
                        deleteMullion(mullion.id)
                      }
                    }}
                    title="点击删除梃"
                  />
                ))}
                
                {/* 区域 (Units) */}
                {units.map((unit) => {
                  const isSelected = selectedUnit === unit.id
                  
                  return (
                    <div
                      key={unit.id}
                      onClick={(e) => handleUnitClick(unit.id, e)}
                      className={cn(
                        "absolute cursor-pointer transition-all group",
                        isSelected && "z-20"
                      )}
                      style={{
                        left: `${(unit.x / canvasWidth) * 100}%`,
                        top: `${(unit.y / canvasHeight) * 100}%`,
                        width: `${(unit.width / canvasWidth) * 100}%`,
                        height: `${(unit.height / canvasHeight) * 100}%`,
                      }}
                    >
                      {/* 区域框架 */}
                      <div className={cn(
                        "absolute inset-0 border-4 rounded-sm transition-all",
                        isSelected 
                          ? "border-blue-500 shadow-lg shadow-blue-500/50" 
                          : unit.type === 'openable'
                            ? "border-green-600"
                            : "border-gray-500"
                      )}>
                        {/* 玻璃效果 - 蓝色半透明 */}
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-200/40 via-blue-100/30 to-blue-200/40 backdrop-blur-sm rounded-sm overflow-hidden">
                          {/* 玻璃反光效果 */}
                          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-300/20 to-transparent" />
                          
                          {/* 纱窗网格效果 */}
                          {unit.hasScreen && (
                            <div 
                              className={cn(
                                "absolute inset-0 bg-gray-500/10",
                                unit.screenPosition === 'outside' ? "z-10" : "z-0"
                              )}
                              style={{
                                backgroundImage: `
                                  repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 7px),
                                  repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 7px)
                                `
                              }}
                              title={`纱窗（${unit.screenPosition === 'outside' ? '外层' : '内层'}）`}
                            />
                          )}
                          
                          {/* 格栅效果 */}
                          {unit.hasGrille && (
                            <>
                              {/* 竖向格栅 */}
                              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-400 z-5" />
                              <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-gray-400 z-5" />
                              {/* 横向格栅 */}
                              <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 z-5" />
                              <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 z-5" />
                            </>
                          )}
                          
                          {/* 开启方向箭头 */}
                          {unit.type === 'openable' && unit.openingDirection && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-4xl text-green-600 font-bold opacity-50">
                                {unit.openingDirection === 'left' && '←'}
                                {unit.openingDirection === 'right' && '→'}
                                {unit.openingDirection === 'top' && '↑'}
                                {unit.openingDirection === 'bottom' && '↓'}
                              </div>
                            </div>
                          )}
                          
                          {/* 开启窗执手 */}
                          {unit.type === 'openable' && (
                            <div 
                              className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-pointer p-2 -m-2 rounded hover:bg-blue-100/50 transition-colors",
                                selectedHandle && isSelected && "ring-2 ring-yellow-400"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedHandle(!selectedHandle)
                              }}
                              title="点击选中执手"
                            >
                              <div className="w-6 h-2 bg-gray-600 rounded-full relative shadow-lg">
                                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-500" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* 区域编号标识 */}
                        <div className={cn(
                          "absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg",
                          unit.type === 'openable' 
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        )}>
                          {unit.id + 1}
                        </div>
                        
                        {/* 护栏 */}
                        {unit.hasGuardrail && (
                          <div className="absolute -bottom-8 left-0 right-0 h-8 border-2 border-gray-700 bg-gray-300/50 flex items-center justify-center">
                            <div className="flex gap-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-1 h-6 bg-gray-600" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* 尺寸信息 - 选中时显示 */}
                      {isSelected && (
                        <>
                          {/* 顶部信息栏 */}
                          <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
                            <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded text-xs font-mono shadow-lg">
                              <span>{unit.width} × {unit.height}mm</span>
                              <span className="opacity-70">|</span>
                              <span className="text-[10px]">{unit.type === 'openable' ? '开启窗' : '封窗'}</span>
                              {unit.openingType && (
                                <>
                                  <span className="opacity-70">|</span>
                                  <span className="text-[10px]">
                                    {unit.openingType === 'casement' && '平开'}
                                    {unit.openingType === 'sliding' && '推拉'}
                                    {unit.openingType === 'tilt' && '内倒'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      
                    </div>
                  )
                })}
              </div>
              
              {/* 画布下方图例说明 */}
              <div className="mt-8 flex items-center justify-center flex-wrap gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-gray-500 bg-blue-100/30 rounded-sm" />
                  <span>封窗</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-green-600 bg-blue-100/30 rounded-sm relative">
                    <div className="text-xs text-green-600 font-bold">→</div>
                  </div>
                  <span>开启窗</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-blue-500 bg-blue-100/30 rounded-sm shadow-lg shadow-blue-500/50" />
                  <span>选中区域</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-1 bg-gray-600" />
                  <span>梃(分隔条)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
