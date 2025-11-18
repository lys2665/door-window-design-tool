# 步骤4：换样式 - 材质与参数配置

## 功能概述

在步骤4"换样式"中，提供统一配置和单一配置两种模式，支持修改材质、玻璃、执手、纱网等参数，并实时预览3D效果。

## 设计时间

2025年11月6日

---

## 界面布局

### 整体结构

```
┌─────────────────────────────────────────────────────────────────────┐
│ 门窗设计工具            01 → 02 → 03 → [04] → 05                    │
├──────────────────────┬──────────────────────────────────────────────┤
│                      │                                              │
│   配置面板区域       │              3D 预览区域                     │
│                      │                                              │
│  ┌────────────────┐  │         ┌──────────────────┐               │
│  │ [统一配置]     │  │         │                  │               │
│  │ [单一配置]     │  │         │                  │               │
│  └────────────────┘  │         │   3D 窗户模型    │               │
│                      │         │                  │               │
│  ┌────────────────┐  │         │                  │               │
│  │ 材质配置       │  │         │   可旋转查看     │               │
│  │ - 室内材质     │  │         │                  │               │
│  │ - 室外材质     │  │         │                  │               │
│  │                │  │         └──────────────────┘               │
│  │ 玻璃配置       │  │                                              │
│  │ - 玻璃类型     │  │         [旋转] [重置视角] [缩放]            │
│  │ - 规格参数     │  │                                              │
│  │                │  │                                              │
│  │ 执手配置       │  │                                              │
│  │ - 执手样式     │  │                                              │
│  │ - 离地高度     │  │                                              │
│  │                │  │                                              │
│  │ 纱网配置       │  │                                              │
│  │ - 纱网样式     │  │                                              │
│  │ - 纱网材质     │  │                                              │
│  └────────────────┘  │                                              │
│                      │                                              │
└──────────────────────┴──────────────────────────────────────────────┘
```

### 详细布局

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                       [上一步] [下一步]│
├───────────────────┬─────────────────────────────────────────────────┤
│                   │                                                 │
│ ┌───────────────┐ │  ┌─────────────────────────────────────────┐  │
│ │统一配置│单一配置│ │  │                                         │  │
│ └───────────────┘ │  │                                         │  │
│                   │  │          3D 窗户模型                    │  │
│ ━━ 材质配置 ━━━━  │  │                                         │  │
│                   │  │        [可拖拽旋转查看]                 │  │
│ 室内材质          │  │                                         │  │
│ [断桥铝 ▼]        │  │                                         │  │
│                   │  │                                         │  │
│ 室外材质          │  └─────────────────────────────────────────┘  │
│ [断桥铝 ▼]        │                                                 │
│                   │  ┌─────────────────────────────────────────┐  │
│ 颜色              │  │ 视角控制                                │  │
│ [⚪ 白色]          │  │ [⟲ 旋转] [⊙ 重置] [+ -] [◎ 线框]      │  │
│ [⚫ 黑色]          │  └─────────────────────────────────────────┘  │
│ [⚪ 灰色]          │                                                 │
│                   │  ┌─────────────────────────────────────────┐  │
│ ━━ 玻璃配置 ━━━━  │  │ 快捷操作                                │  │
│                   │  │ [ 保存配置 ] [ 重置默认 ]              │  │
│ 玻璃类型          │  └─────────────────────────────────────────┘  │
│ [钢化玻璃 ▼]      │                                                 │
│                   │                                                 │
│ 玻璃规格          │                                                 │
│ [5+12A+5 ▼]       │                                                 │
│                   │                                                 │
│ ━━ 执手配置 ━━━━  │                                                 │
│                   │                                                 │
│ 执手样式          │                                                 │
│ [标准执手 ▼]      │                                                 │
│                   │                                                 │
│ 离地高度          │                                                 │
│ [1200] mm         │                                                 │
│                   │                                                 │
│ ━━ 纱网配置 ━━━━  │                                                 │
│                   │                                                 │
│ 纱网类型          │                                                 │
│ [金刚网 ▼]        │                                                 │
│                   │                                                 │
│ 纱网颜色          │                                                 │
│ [灰色 ▼]          │                                                 │
│                   │                                                 │
└───────────────────┴─────────────────────────────────────────────────┘
```

---

## 功能模块

### 1. 配置模式切换

#### 统一配置模式

**特点**：
- 一次性配置所有区域
- 所有扇使用相同配置
- 批量修改，效率高

**适用场景**：
- 标准化门窗
- 统一风格要求
- 快速配置

#### 单一配置模式

**特点**：
- 逐个配置每个扇
- 可以差异化设置
- 精细化控制

**适用场景**：
- 定制化需求
- 不同区域不同配置
- 特殊功能窗

```tsx
<div className="flex gap-2 p-1 bg-muted rounded-lg">
  <Button
    variant={configMode === 'unified' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => setConfigMode('unified')}
    className="flex-1"
  >
    统一配置
  </Button>
  <Button
    variant={configMode === 'individual' ? 'default' : 'ghost'}
    size="sm"
    onClick={() => setConfigMode('individual')}
    className="flex-1"
  >
    单一配置
  </Button>
</div>
```

---

## 数据结构

### 配置数据类型

```typescript
// 材质配置
interface MaterialConfig {
  indoor: {
    type: 'aluminum' | 'wood' | 'upvc' | 'composite'  // 铝合金、木材、塑钢、复合
    series: string          // 系列：断桥铝60、70、80等
    color: string           // 颜色
    surfaceFinish: string   // 表面处理：喷涂、木纹、拉丝等
  }
  outdoor: {
    type: string
    series: string
    color: string
    surfaceFinish: string
  }
}

// 玻璃配置
interface GlassConfig {
  type: 'tempered' | 'laminated' | 'low-e' | 'double' | 'triple'  // 钢化、夹胶、Low-E、双层、三层
  specification: string   // 规格：5+12A+5, 5+9A+5+9A+5等
  thickness: number       // 厚度
  coating: string         // 镀膜：Low-E、阳光控制等
  transparency: number    // 透光率 0-100%
  soundInsulation: number // 隔音等级 dB
}

// 执手配置
interface HandleConfig {
  style: 'standard' | 'lock' | 'fold' | 'double'  // 标准、带锁、折叠、双执手
  material: 'aluminum' | 'zinc' | 'stainless'     // 铝合金、锌合金、不锈钢
  color: string
  heightFromGround: number  // 离地高度 mm
  position: 'left' | 'right' | 'center'
}

// 纱网配置
interface ScreenConfig {
  type: 'fiberglass' | 'stainless' | 'diamond' | 'invisible'  // 玻纤、不锈钢、金刚网、隐形
  material: string
  color: string
  meshSize: number  // 网眼尺寸 mm
  openingType: 'fixed' | 'sliding' | 'retractable'  // 固定、推拉、可收缩
}

// 扇的完整配置
interface SashConfig {
  sashId: string
  sashName: string  // F1, F2...
  isOpenable: boolean  // 是否可开启
  material: MaterialConfig
  glass: GlassConfig
  handle?: HandleConfig  // 仅开启扇有执手
  screen?: ScreenConfig
}

// 完整样式配置
interface StyleConfig {
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
```

---

## 统一配置功能

### 1. 材质配置

```tsx
<Card className="p-4 space-y-4">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary rounded-full" />
    <h3 className="font-semibold">材质配置</h3>
  </div>
  
  {/* 室内材质 */}
  <div className="space-y-2">
    <Label>室内材质</Label>
    <Select 
      value={config.material.indoor.type}
      onValueChange={(value) => handleMaterialChange('indoor', 'type', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aluminum">断桥铝</SelectItem>
        <SelectItem value="wood">实木</SelectItem>
        <SelectItem value="upvc">塑钢</SelectItem>
        <SelectItem value="composite">复合材料</SelectItem>
      </SelectContent>
    </Select>
    
    {/* 系列选择 */}
    <Select 
      value={config.material.indoor.series}
      onValueChange={(value) => handleMaterialChange('indoor', 'series', value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="选择系列" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="60">断桥铝60系列</SelectItem>
        <SelectItem value="70">断桥铝70系列</SelectItem>
        <SelectItem value="80">断桥铝80系列</SelectItem>
        <SelectItem value="108">断桥铝108系列</SelectItem>
      </SelectContent>
    </Select>
    
    {/* 颜色选择 */}
    <div>
      <Label className="mb-2 block">颜色</Label>
      <div className="grid grid-cols-5 gap-2">
        {colorOptions.map(color => (
          <button
            key={color.value}
            className={cn(
              "w-12 h-12 rounded-lg border-2 transition-all",
              config.material.indoor.color === color.value
                ? "border-primary ring-2 ring-primary/20"
                : "border-gray-200 hover:border-gray-300"
            )}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleMaterialChange('indoor', 'color', color.value)}
          >
            {config.material.indoor.color === color.value && (
              <Check className="w-5 h-5 text-white mx-auto drop-shadow" />
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
  
  {/* 室外材质（同理） */}
  <div className="space-y-2">
    <Label>室外材质</Label>
    {/* 同上结构 */}
  </div>
</Card>
```

### 2. 玻璃配置

```tsx
<Card className="p-4 space-y-4">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary rounded-full" />
    <h3 className="font-semibold">玻璃配置</h3>
  </div>
  
  {/* 玻璃类型 */}
  <div className="space-y-2">
    <Label>玻璃类型</Label>
    <Select 
      value={config.glass.type}
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
  </div>
  
  {/* 玻璃规格 */}
  <div className="space-y-2">
    <Label>玻璃规格</Label>
    <Select 
      value={config.glass.specification}
      onValueChange={(value) => handleGlassChange('specification', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5+12A+5">5+12A+5 (双层)</SelectItem>
        <SelectItem value="5+9A+5">5+9A+5 (双层)</SelectItem>
        <SelectItem value="6+12A+6">6+12A+6 (双层)</SelectItem>
        <SelectItem value="5+9A+5+9A+5">5+9A+5+9A+5 (三层)</SelectItem>
      </SelectContent>
    </Select>
    
    <p className="text-xs text-muted-foreground">
      A表示空气层，数字表示厚度(mm)
    </p>
  </div>
  
  {/* 透光率 */}
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>透光率</Label>
      <span className="text-sm text-muted-foreground">
        {config.glass.transparency}%
      </span>
    </div>
    <Slider
      value={[config.glass.transparency]}
      onValueChange={([value]) => handleGlassChange('transparency', value)}
      min={30}
      max={90}
      step={5}
    />
  </div>
  
  {/* 隔音等级 */}
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>隔音等级</Label>
      <span className="text-sm text-muted-foreground">
        {config.glass.soundInsulation} dB
      </span>
    </div>
    <Slider
      value={[config.glass.soundInsulation]}
      onValueChange={([value]) => handleGlassChange('soundInsulation', value)}
      min={25}
      max={45}
      step={5}
    />
  </div>
</Card>
```

### 3. 执手配置

```tsx
<Card className="p-4 space-y-4">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary rounded-full" />
    <h3 className="font-semibold">执手配置</h3>
  </div>
  
  {/* 执手样式 */}
  <div className="space-y-2">
    <Label>执手样式</Label>
    <div className="grid grid-cols-2 gap-2">
      {handleStyles.map(style => (
        <button
          key={style.value}
          className={cn(
            "p-3 rounded-lg border-2 transition-all text-left",
            config.handle.style === style.value
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          )}
          onClick={() => handleHandleChange('style', style.value)}
        >
          <div className="flex items-center gap-2 mb-1">
            <style.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{style.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  </div>
  
  {/* 执手材质 */}
  <div className="space-y-2">
    <Label>执手材质</Label>
    <Select 
      value={config.handle.material}
      onValueChange={(value) => handleHandleChange('material', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aluminum">铝合金</SelectItem>
        <SelectItem value="zinc">锌合金</SelectItem>
        <SelectItem value="stainless">不锈钢</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  {/* 离地高度 */}
  <div className="space-y-2">
    <Label>离地高度 (mm)</Label>
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={config.handle.heightFromGround}
        onChange={(e) => handleHandleChange('heightFromGround', Number(e.target.value))}
        min={900}
        max={1500}
        step={50}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleHandleChange('heightFromGround', 1200)}
      >
        默认
      </Button>
    </div>
    <p className="text-xs text-muted-foreground">
      推荐高度：1100-1300mm
    </p>
  </div>
  
  {/* 执手颜色 */}
  <div className="space-y-2">
    <Label>执手颜色</Label>
    <div className="grid grid-cols-6 gap-2">
      {handleColors.map(color => (
        <button
          key={color.value}
          className={cn(
            "w-10 h-10 rounded-lg border-2",
            config.handle.color === color.value
              ? "border-primary ring-2 ring-primary/20"
              : "border-gray-200"
          )}
          style={{ backgroundColor: color.hex }}
          onClick={() => handleHandleChange('color', color.value)}
        />
      ))}
    </div>
  </div>
</Card>
```

### 4. 纱网配置

```tsx
<Card className="p-4 space-y-4">
  <div className="flex items-center gap-2">
    <div className="w-1 h-5 bg-primary rounded-full" />
    <h3 className="font-semibold">纱网配置</h3>
  </div>
  
  {/* 纱网类型 */}
  <div className="space-y-2">
    <Label>纱网类型</Label>
    <Select 
      value={config.screen.type}
      onValueChange={(value) => handleScreenChange('type', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fiberglass">玻璃纤维纱网</SelectItem>
        <SelectItem value="stainless">不锈钢纱网</SelectItem>
        <SelectItem value="diamond">金刚网</SelectItem>
        <SelectItem value="invisible">隐形纱网</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  {/* 纱网颜色 */}
  <div className="space-y-2">
    <Label>纱网颜色</Label>
    <Select 
      value={config.screen.color}
      onValueChange={(value) => handleScreenChange('color', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gray">灰色</SelectItem>
        <SelectItem value="black">黑色</SelectItem>
        <SelectItem value="white">白色</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  {/* 开启方式 */}
  <div className="space-y-2">
    <Label>开启方式</Label>
    <Select 
      value={config.screen.openingType}
      onValueChange={(value) => handleScreenChange('openingType', value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fixed">固定</SelectItem>
        <SelectItem value="sliding">推拉</SelectItem>
        <SelectItem value="retractable">可收缩</SelectItem>
      </SelectContent>
    </Select>
  </div>
</Card>
```

---

## 单一配置功能

### 扇选择器

```tsx
<Card className="p-4 space-y-4">
  <div>
    <Label className="mb-2 block">选择配置区域</Label>
    <div className="grid grid-cols-3 gap-2">
      {sashes.map(sash => (
        <button
          key={sash.id}
          className={cn(
            "p-3 rounded-lg border-2 transition-all",
            selectedSashId === sash.id
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          )}
          onClick={() => setSelectedSashId(sash.id)}
        >
          <div className="font-medium text-sm">{sash.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {sash.isOpenable ? '开启' : '固定'}
          </div>
        </button>
      ))}
    </div>
  </div>
  
  {/* 根据选中的扇显示对应配置 */}
  {selectedSash && (
    <div className="space-y-4 pt-4 border-t">
      {selectedSash.isOpenable ? (
        <>
          {/* 开启扇配置：执手 + 玻璃 + 纱网 */}
          <OpenableSashConfig sash={selectedSash} />
        </>
      ) : (
        <>
          {/* 固定扇配置：仅玻璃 */}
          <FixedSashConfig sash={selectedSash} />
        </>
      )}
    </div>
  )}
</Card>
```

---

## 3D 预览功能

### 技术方案

#### 方案1：Three.js（推荐）

```tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

const Window3DPreview = ({ config, windowData }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-100 to-white">
      <Canvas shadows>
        {/* 相机 */}
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        
        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
        />
        
        {/* 窗户模型 */}
        <WindowModel config={config} data={windowData} />
        
        {/* 控制器 */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        
        {/* 网格辅助线 */}
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  )
}

// 窗户3D模型组件
const WindowModel = ({ config, data }) => {
  const frameRef = useRef()
  
  // 动画
  useFrame(() => {
    // 可选的旋转动画
  })
  
  return (
    <group ref={frameRef}>
      {/* 框架 */}
      <Frame 
        width={data.frame.width}
        height={data.frame.height}
        material={config.material}
      />
      
      {/* 梃 */}
      {data.mullions.map(mullion => (
        <Mullion key={mullion.id} {...mullion} />
      ))}
      
      {/* 扇 */}
      {data.sashes.map(sash => (
        <Sash 
          key={sash.id} 
          {...sash}
          config={config}
        />
      ))}
    </group>
  )
}
```

#### 方案2：简化版（2D透视图）

```tsx
const Window2DPreview = ({ config, windowData }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <svg 
        viewBox="0 0 800 600" 
        className="max-w-full max-h-full"
      >
        {/* 使用SVG绘制透视效果的窗户 */}
        <defs>
          {/* 渐变定义玻璃效果 */}
          <linearGradient id="glassGradient">
            <stop offset="0%" stopColor={config.glass.color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={config.glass.color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* 框架 */}
        <rect 
          x="100" y="100" 
          width="600" height="400"
          fill={config.material.indoor.color}
          stroke="#333"
          strokeWidth="8"
        />
        
        {/* 玻璃 */}
        <rect 
          x="110" y="110" 
          width="580" height="380"
          fill="url(#glassGradient)"
        />
        
        {/* 执手 */}
        {/* ... */}
      </svg>
    </div>
  )
}
```

### 3D 控制界面

```tsx
<div className="absolute bottom-4 left-4 right-4">
  <Card className="p-3">
    <div className="flex items-center justify-between gap-4">
      {/* 视角控制 */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleRotateLeft}>
          <RotateCcw className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">旋转</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleResetView}>
          <Maximize2 className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">重置</span>
        </Button>
      </div>
      
      {/* 缩放控制 */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      
      {/* 显示模式 */}
      <div className="flex items-center gap-2">
        <Button 
          variant={wireframe ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setWireframe(!wireframe)}
        >
          <Grid3x3 className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">线框</span>
        </Button>
      </div>
    </div>
  </Card>
</div>
```

---

## 实时更新机制

### 配置变更监听

```typescript
useEffect(() => {
  // 配置变更时更新3D模型
  update3DModel(config)
}, [config])

const update3DModel = (config: StyleConfig) => {
  // 更新材质
  updateMaterials(config.material)
  
  // 更新玻璃
  updateGlass(config.glass)
  
  // 更新执手
  updateHandles(config.handle)
  
  // 更新纱网
  updateScreens(config.screen)
  
  // 重新渲染
  render()
}
```

### 性能优化

```typescript
// 使用防抖避免频繁更新
const debouncedUpdate = useMemo(
  () => debounce((config) => update3DModel(config), 300),
  []
)

useEffect(() => {
  debouncedUpdate(config)
}, [config, debouncedUpdate])
```

---

## 数据持久化

```typescript
// 保存配置
const handleSaveConfig = () => {
  const configToSave = {
    ...config,
    timestamp: Date.now(),
    version: '1.0'
  }
  
  localStorage.setItem('window-style-config', JSON.stringify(configToSave))
  
  toast.success("配置已保存", {
    description: "您的配置已成功保存"
  })
}

// 加载配置
const handleLoadConfig = () => {
  const saved = localStorage.getItem('window-style-config')
  if (saved) {
    const config = JSON.parse(saved)
    setConfig(config)
    
    toast.success("配置已加载", {
      description: "已加载之前保存的配置"
    })
  }
}

// 重置默认
const handleResetConfig = () => {
  setConfig(defaultConfig)
  
  toast.info("已重置", {
    description: "配置已恢复为默认值"
  })
}
```

---

## 实现计划

### 阶段1：基础配置界面（2-3天）

- [ ] 创建配置模式切换
- [ ] 实现统一配置UI
- [ ] 实现单一配置UI
- [ ] 数据结构定义

### 阶段2：配置功能（3-4天）

- [ ] 材质配置功能
- [ ] 玻璃配置功能
- [ ] 执手配置功能
- [ ] 纱网配置功能

### 阶段3：3D预览（4-5天）

- [ ] 集成Three.js
- [ ] 创建基础3D模型
- [ ] 实现视角控制
- [ ] 实现实时更新

### 阶段4：优化和测试（2-3天）

- [ ] 性能优化
- [ ] 响应式适配
- [ ] 数据持久化
- [ ] 测试和bug修复

---

## 技术栈

### 核心库

```json
{
  "dependencies": {
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "lodash": "^4.17.21"
  }
}
```

### 安装命令

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## 相关文件

### 需要创建

1. **app/design/components/style-config.tsx**
   - 样式配置主组件

2. **app/design/components/material-config.tsx**
   - 材质配置组件

3. **app/design/components/glass-config.tsx**
   - 玻璃配置组件

4. **app/design/components/handle-config.tsx**
   - 执手配置组件

5. **app/design/components/screen-config.tsx**
   - 纱网配置组件

6. **app/design/components/window-3d-preview.tsx**
   - 3D预览组件

7. **lib/style-config-utils.ts**
   - 配置工具函数

---

## 总结

第四步"换样式"是一个功能丰富的配置步骤，核心功能包括：

1. **双模式配置**：统一配置 + 单一配置
2. **全面参数**：材质、玻璃、执手、纱网
3. **3D实时预览**：支持旋转、缩放查看
4. **智能更新**：配置变更实时反映到3D模型

**技术亮点**：
- Three.js 3D渲染
- React Three Fiber 集成
- 实时数据绑定
- 性能优化

**预计工作量**：11-15个工作日

---

**版本**: v4.1.0  
**状态**: 设计阶段  
**更新时间**: 2025年11月6日

