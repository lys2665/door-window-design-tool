// 样式配置数据类型定义

// 材质配置
export interface MaterialConfig {
  indoor: {
    type: 'aluminum' | 'wood' | 'upvc' | 'composite'  // 铝合金、木材、塑钢、复合
    series: string          // 系列：断桥铝60、70、80等
    color: string           // 颜色
    surfaceFinish: string   // 表面处理：喷涂、木纹、拉丝等
  }
  outdoor: {
    type: 'aluminum' | 'wood' | 'upvc' | 'composite'
    series: string
    color: string
    surfaceFinish: string
  }
}

// 玻璃配置
export interface GlassConfig {
  type: 'tempered' | 'laminated' | 'low-e' | 'double' | 'triple'  // 钢化、夹胶、Low-E、双层、三层
  specification: string   // 规格：5+12A+5, 5+9A+5+9A+5等
  thickness: number       // 厚度
  coating: string         // 镀膜：Low-E、阳光控制等
  transparency: number    // 透光率 0-100%
  soundInsulation: number // 隔音等级 dB
}

// 执手配置
export interface HandleConfig {
  style: 'standard' | 'lock' | 'fold' | 'double'  // 标准、带锁、折叠、双执手
  material: 'aluminum' | 'zinc' | 'stainless'     // 铝合金、锌合金、不锈钢
  color: string
  heightFromGround: number  // 离地高度 mm
  position: 'left' | 'right' | 'center'
}

// 纱网配置
export interface ScreenConfig {
  type: 'fiberglass' | 'stainless' | 'diamond' | 'invisible'  // 玻纤、不锈钢、金刚网、隐形
  material: string
  color: string
  meshSize: number  // 网眼尺寸 mm
  openingType: 'fixed' | 'sliding' | 'retractable'  // 固定、推拉、可收缩
}

// 扇的完整配置
export interface SashConfig {
  sashId: string
  sashName: string  // F1, F2...
  isOpenable: boolean  // 是否可开启
  material: MaterialConfig
  glass: GlassConfig
  handle?: HandleConfig  // 仅开启扇有执手
  screen?: ScreenConfig
}

// 完整样式配置
export interface StyleConfig {
  configMode: 'unified' | 'individual'
  unified?: {
    material: MaterialConfig
    glass: GlassConfig
    handle: HandleConfig
    screen: ScreenConfig
  }
  individual?: {
    sashes: SashConfig[]
  }
}

// 颜色选项
export interface ColorOption {
  value: string
  label: string
  hex: string
}

// 执手样式选项
export interface HandleStyleOption {
  value: HandleConfig['style']
  label: string
  description: string
}

// 默认配置
export const defaultMaterialConfig: MaterialConfig = {
  indoor: {
    type: 'aluminum',
    series: '70',
    color: 'white',
    surfaceFinish: 'powder-coating'
  },
  outdoor: {
    type: 'aluminum',
    series: '70',
    color: 'white',
    surfaceFinish: 'powder-coating'
  }
}

export const defaultGlassConfig: GlassConfig = {
  type: 'double',
  specification: '5+12A+5',
  thickness: 22,
  coating: 'low-e',
  transparency: 75,
  soundInsulation: 30
}

export const defaultHandleConfig: HandleConfig = {
  style: 'standard',
  material: 'aluminum',
  color: 'silver',
  heightFromGround: 1200,
  position: 'left'
}

export const defaultScreenConfig: ScreenConfig = {
  type: 'diamond',
  material: 'stainless-steel',
  color: 'gray',
  meshSize: 0.8,
  openingType: 'sliding'
}

export const defaultStyleConfig: StyleConfig = {
  configMode: 'unified',
  unified: {
    material: defaultMaterialConfig,
    glass: defaultGlassConfig,
    handle: defaultHandleConfig,
    screen: defaultScreenConfig
  }
}

// 材质颜色选项
export const materialColors: ColorOption[] = [
  { value: 'white', label: '白色', hex: '#FFFFFF' },
  { value: 'black', label: '黑色', hex: '#1A1A1A' },
  { value: 'gray', label: '灰色', hex: '#9CA3AF' },
  { value: 'champagne', label: '香槟色', hex: '#F4E4C1' },
  { value: 'wood-grain', label: '木纹', hex: '#8B4513' },
  { value: 'silver', label: '银色', hex: '#C0C0C0' },
]

// 执手颜色选项
export const handleColors: ColorOption[] = [
  { value: 'silver', label: '银色', hex: '#C0C0C0' },
  { value: 'black', label: '黑色', hex: '#1A1A1A' },
  { value: 'white', label: '白色', hex: '#FFFFFF' },
  { value: 'gold', label: '金色', hex: '#FFD700' },
  { value: 'bronze', label: '古铜', hex: '#CD7F32' },
  { value: 'champagne', label: '香槟', hex: '#F4E4C1' },
]

// 执手样式选项
export const handleStyles: HandleStyleOption[] = [
  {
    value: 'standard',
    label: '标准执手',
    description: '经典样式，适用于大多数场景'
  },
  {
    value: 'lock',
    label: '带锁执手',
    description: '带锁功能，安全性更高'
  },
  {
    value: 'fold',
    label: '折叠执手',
    description: '可折叠设计，节省空间'
  },
  {
    value: 'double',
    label: '双执手',
    description: '上下双执手，适合大窗'
  }
]

