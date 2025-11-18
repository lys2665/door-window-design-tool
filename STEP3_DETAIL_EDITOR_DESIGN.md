# 步骤3：调细节 - 窗户设计编辑器

## 功能概述

在步骤3"调细节"中，实现专业的窗户设计编辑器，支持可视化编辑窗户的框架、梃、扇和五金配件。

## 设计时间

2025年11月6日

---

## 界面布局

### 整体结构

```
┌─────────────────────────────────────────────────────────────┐
│ 门窗设计工具            01 → 02 → [03] → 04 → 05          │ ← 顶部导航
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌────────────────────────────────────────┐ │
│  │          │  │                                        │ │
│  │  平面图  │  │                                        │ │
│  │          │  │                                        │ │
│  │  可拖拽  │  │         主画布区域                     │ │
│  │          │  │                                        │ │
│  │          │  │    显示窗户设计                        │ │
│  │          │  │    支持选中、编辑                      │ │
│  └──────────┘  │                                        │ │
│                │                                        │ │
│                │                                        │ │
│                │                                        │ │
│                │                                        │ │
│                └────────────────────────────────────────┘ │
│                                                             │
│                         ┌───────────────────┐              │
│                         │  属性面板         │              │
│                         │  （选中对象时）   │              │
│                         └───────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 详细布局（参考图示）

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                        │
│  │ 窗外侧  │ ← 平面图                                      [上一步] [下一步]
│  │ ──875── │                                                        │
│  │ ↓   ↓   │                                                        │
│  │ -------│                                                         │
│  │ \    / │   ┌──────────────────────────────────────────┐         │
│  │  \  /  │   │                                          │  800mm  │
│  │   \/   │   │                                          │ ←────→  │
│  │ 窗内侧  │   │  F1      │      F2                      │         │
│  └─────────┘   │          │                              │         │
│                │          │                              │         │
│                │          │                              │  设为开启│
│                │          │                              │  后属   │
│                │          ├──────────────────            │  格偏   │
│                │          │      F3                      │  护栏   │
│                │          │                              │         │
│                │          │                              │  新风   │
│                │          │                              │         │
│                │          │                              │  删除   │
│                └──────────────────────────────────────────┘  1200mm│
│                                                              ↕      │
│                [ - ]  100%  [ + ]                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 业务逻辑

### 数据结构层次

```
窗户 (Window)
  ├── 框架 (Frame)
  │     ├── 宽度 (width) - 不可变
  │     ├── 高度 (height) - 不可变
  │     └── 材质 (material)
  │
  ├── 梃 (Mullions) - 数组
  │     ├── 竖梃 (Vertical Mullions)
  │     │     ├── ID
  │     │     ├── 位置 (position)
  │     │     ├── 类型 (type: 'vertical')
  │     │     └── 宽度 (width)
  │     │
  │     └── 横梃 (Horizontal Mullions)
  │           ├── ID
  │           ├── 位置 (position)
  │           ├── 类型 (type: 'horizontal')
  │           └── 宽度 (width)
  │
  ├── 扇 (Sashes) - 数组
  │     ├── ID
  │     ├── 名称 (name: 'F1', 'F2', ...)
  │     ├── 边界 (bounds: {x, y, width, height})
  │     ├── 开启方式 (openingType)
  │     │     ├── 固定 (fixed)
  │     │     ├── 推拉 (sliding)
  │     │     ├── 平开 (casement)
  │     │     ├── 上悬 (top-hung)
  │     │     ├── 下悬 (bottom-hung)
  │     │     └── 内开内倒 (tilt-turn)
  │     ├── 玻璃类型 (glassType)
  │     ├── 纱窗 (hasScreen)
  │     └── 执手 (handle)
  │           ├── 类型 (type)
  │           ├── 位置 (position)
  │           └── 颜色 (color)
  │
  └── 配置 (Config)
        ├── 主材 (mainMaterial)
        ├── 颜色 (color)
        └── 系列 (series)
```

### TypeScript 类型定义

```typescript
// 梃的类型
interface Mullion {
  id: string
  type: 'vertical' | 'horizontal'
  position: number  // 像素位置
  width: number     // 梃的宽度
  ratio?: number    // 相对位置比例（0-1）
}

// 执手类型
interface Handle {
  type: 'standard' | 'lock' | 'double'
  position: 'left' | 'right' | 'center'
  color: string
}

// 扇的类型
interface Sash {
  id: string
  name: string  // F1, F2, F3, F4...
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  openingType: 'fixed' | 'sliding' | 'casement' | 'top-hung' | 'bottom-hung' | 'tilt-turn'
  glassType: 'single' | 'double' | 'triple' | 'low-e'
  hasScreen: boolean
  handle?: Handle
  isSelected?: boolean
}

// 框架类型
interface Frame {
  width: number   // mm
  height: number  // mm
  material: string
  color: string
  readonly: true  // 框架尺寸不可变
}

// 完整窗户数据
interface WindowDesign {
  frame: Frame
  mullions: Mullion[]
  sashes: Sash[]
  config: {
    mainMaterial: string
    color: string
    series: string
  }
}
```

---

## 核心功能

### 1. 平面图预览（左上角）

#### 功能特点
- 显示窗户截面图
- 显示窗外侧和窗内侧
- 显示开启方向
- 可拖拽调整窗口位置
- 可调整窗口大小

#### 实现要点
```tsx
<div className="absolute top-4 left-4 w-64 h-48 bg-white border rounded-lg shadow-lg">
  <div className="p-2 border-b text-xs text-muted-foreground">
    平面图
  </div>
  <div className="p-4">
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* 窗外侧标注 */}
      <text x="100" y="20" textAnchor="middle" fontSize="12">窗外侧</text>
      
      {/* 框架 */}
      <rect x="50" y="40" width="100" height="80" 
            fill="none" stroke="black" strokeWidth="2"/>
      
      {/* 开启方向指示 */}
      <path d="M 70,80 L 130,70" stroke="black" strokeWidth="1"/>
      <path d="M 130,70 L 120,65 M 130,70 L 125,80" stroke="black"/>
      
      {/* 窗内侧标注 */}
      <text x="100" y="140" textAnchor="middle" fontSize="12">窗内侧</text>
    </svg>
  </div>
</div>
```

### 2. 主画布区域（中央）

#### 功能特点
- 显示完整窗户设计
- 显示框架（灰色边框）
- 显示梃（灰色分隔线）
- 显示扇（可选中区域）
- 显示尺寸标注
- 支持缩放（100%, 75%, 50%等）
- 支持选中交互

#### 渲染逻辑
```tsx
<div className="flex-1 overflow-auto flex items-center justify-center bg-gray-50">
  <div className="relative" style={{ transform: `scale(${zoom})` }}>
    {/* 框架 */}
    <div 
      className="relative border-8 border-gray-700 bg-white"
      style={{ 
        width: frame.width * scale, 
        height: frame.height * scale 
      }}
    >
      {/* 横梃 */}
      {mullions.filter(m => m.type === 'horizontal').map(mullion => (
        <div
          key={mullion.id}
          className="absolute left-0 right-0 h-2 bg-gray-700 cursor-move"
          style={{ top: mullion.position * scale }}
          onMouseDown={(e) => handleMullionDrag(e, mullion)}
        />
      ))}
      
      {/* 竖梃 */}
      {mullions.filter(m => m.type === 'vertical').map(mullion => (
        <div
          key={mullion.id}
          className="absolute top-0 bottom-0 w-2 bg-gray-700 cursor-move"
          style={{ left: mullion.position * scale }}
          onMouseDown={(e) => handleMullionDrag(e, mullion)}
        />
      ))}
      
      {/* 扇区域 */}
      {sashes.map(sash => (
        <div
          key={sash.id}
          className={cn(
            "absolute cursor-pointer transition-all",
            sash.isSelected && "ring-4 ring-blue-500"
          )}
          style={{
            left: sash.bounds.x * scale,
            top: sash.bounds.y * scale,
            width: sash.bounds.width * scale,
            height: sash.bounds.height * scale,
          }}
          onClick={() => handleSashSelect(sash)}
        >
          {/* 扇名称 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-2xl font-bold text-gray-400">
              {sash.name}
            </span>
          </div>
          
          {/* 玻璃效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-blue-50/10" />
        </div>
      ))}
      
      {/* 尺寸标注 */}
      <div className="absolute -top-8 left-0 right-0 flex items-center justify-center">
        <div className="px-2 py-1 bg-black text-white text-xs rounded">
          {frame.width}mm
        </div>
      </div>
      <div className="absolute top-0 bottom-0 -right-12 flex items-center justify-center">
        <div className="px-2 py-1 bg-black text-white text-xs rounded">
          {frame.height}mm
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3. 属性面板（右侧）

#### 未选中状态
```tsx
<div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 flex flex-col gap-2">
  <Button variant="outline" size="sm" disabled>
    设为开启
  </Button>
  <Button variant="outline" size="sm" disabled>
    后属
  </Button>
  <Button variant="outline" size="sm" disabled>
    格偏
  </Button>
  <Button variant="outline" size="sm" disabled>
    护栏
  </Button>
  <Button variant="outline" size="sm" disabled>
    新风
  </Button>
  <Button variant="destructive" size="sm" disabled>
    删除
  </Button>
</div>
```

#### 选中扇时
```tsx
<Card className="absolute right-4 top-4 w-80 max-h-[80vh] overflow-auto">
  <div className="p-4 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">扇属性: {selectedSash.name}</h3>
      <Button variant="ghost" size="sm" onClick={() => setSelectedSash(null)}>
        <X className="w-4 h-4" />
      </Button>
    </div>
    
    {/* 开启方式 */}
    <div>
      <Label>开启方式</Label>
      <Select value={selectedSash.openingType} onValueChange={handleOpeningTypeChange}>
        <SelectItem value="fixed">固定</SelectItem>
        <SelectItem value="sliding">推拉</SelectItem>
        <SelectItem value="casement">平开</SelectItem>
        <SelectItem value="top-hung">上悬</SelectItem>
        <SelectItem value="bottom-hung">下悬</SelectItem>
        <SelectItem value="tilt-turn">内开内倒</SelectItem>
      </Select>
    </div>
    
    {/* 玻璃类型 */}
    <div>
      <Label>玻璃类型</Label>
      <Select value={selectedSash.glassType} onValueChange={handleGlassTypeChange}>
        <SelectItem value="single">单层玻璃</SelectItem>
        <SelectItem value="double">双层玻璃</SelectItem>
        <SelectItem value="triple">三层玻璃</SelectItem>
        <SelectItem value="low-e">Low-E玻璃</SelectItem>
      </Select>
    </div>
    
    {/* 纱窗 */}
    <div className="flex items-center gap-2">
      <Switch 
        checked={selectedSash.hasScreen}
        onCheckedChange={handleScreenChange}
      />
      <Label>添加纱窗</Label>
    </div>
    
    {/* 执手配置 */}
    {selectedSash.openingType !== 'fixed' && (
      <div>
        <Label>执手位置</Label>
        <Select value={selectedSash.handle?.position} onValueChange={handleHandlePositionChange}>
          <SelectItem value="left">左侧</SelectItem>
          <SelectItem value="right">右侧</SelectItem>
          <SelectItem value="center">中间</SelectItem>
        </Select>
      </div>
    )}
    
    {/* 删除按钮 */}
    <Button 
      variant="destructive" 
      className="w-full"
      onClick={handleDeleteSash}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      删除此扇
    </Button>
  </div>
</Card>
```

### 4. 缩放控制（底部）

```tsx
<div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
  <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
    <ZoomOut className="w-4 h-4" />
  </Button>
  <span className="text-sm font-medium min-w-[60px] text-center">
    {Math.round(zoom * 100)}%
  </span>
  <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
    <ZoomIn className="w-4 h-4" />
  </Button>
</div>
```

---

## 交互功能

### 1. 选中扇

```typescript
const handleSashSelect = (sash: Sash) => {
  setSashes(prev => prev.map(s => ({
    ...s,
    isSelected: s.id === sash.id
  })))
  setSelectedSash(sash)
}
```

**效果**：
- 扇区域显示蓝色边框
- 右侧显示属性面板
- 其他扇取消选中

### 2. 修改扇属性

```typescript
const handleOpeningTypeChange = (value: string) => {
  if (!selectedSash) return
  
  setSashes(prev => prev.map(s => 
    s.id === selectedSash.id 
      ? { ...s, openingType: value }
      : s
  ))
  setSelectedSash(prev => ({ ...prev, openingType: value }))
}
```

### 3. 拖拽梃

```typescript
const handleMullionDrag = (e: React.MouseEvent, mullion: Mullion) => {
  e.preventDefault()
  const startPos = mullion.type === 'horizontal' ? e.clientY : e.clientX
  
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const currentPos = mullion.type === 'horizontal' 
      ? moveEvent.clientY 
      : moveEvent.clientX
    const delta = currentPos - startPos
    
    setMullions(prev => prev.map(m => 
      m.id === mullion.id
        ? { ...m, position: m.position + delta / scale }
        : m
    ))
    
    // 重新计算扇的边界
    recalculateSashes()
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
```

### 4. 删除扇

```typescript
const handleDeleteSash = () => {
  if (!selectedSash) return
  
  // 确认删除
  if (sashes.length <= 1) {
    toast.warning("无法删除", {
      description: "窗户至少需要保留一个扇"
    })
    return
  }
  
  setSashes(prev => prev.filter(s => s.id !== selectedSash.id))
  setSelectedSash(null)
  
  toast.success("删除成功", {
    description: `扇 ${selectedSash.name} 已删除`
  })
}
```

---

## 自动计算逻辑

### 1. 根据梃计算扇

```typescript
const calculateSashes = (frame: Frame, mullions: Mullion[]): Sash[] => {
  const sashes: Sash[] = []
  
  // 获取所有分割点
  const verticalPoints = [0, ...mullions
    .filter(m => m.type === 'vertical')
    .map(m => m.position)
    .sort((a, b) => a - b), frame.width]
    
  const horizontalPoints = [0, ...mullions
    .filter(m => m.type === 'horizontal')
    .map(m => m.position)
    .sort((a, b) => a - b), frame.height]
  
  // 生成扇
  let sashIndex = 1
  for (let i = 0; i < horizontalPoints.length - 1; i++) {
    for (let j = 0; j < verticalPoints.length - 1; j++) {
      sashes.push({
        id: `sash-${sashIndex}`,
        name: `F${sashIndex}`,
        bounds: {
          x: verticalPoints[j],
          y: horizontalPoints[i],
          width: verticalPoints[j + 1] - verticalPoints[j],
          height: horizontalPoints[i + 1] - horizontalPoints[i]
        },
        openingType: 'fixed',
        glassType: 'double',
        hasScreen: false
      })
      sashIndex++
    </div>
  }
  
  return sashes
}
```

### 2. 梃的约束

```typescript
const validateMullionPosition = (
  mullion: Mullion,
  newPosition: number,
  frame: Frame
): number => {
  const minGap = 300  // 最小间距300mm
  const maxSize = mullion.type === 'horizontal' ? frame.height : frame.width
  
  // 边界约束
  if (newPosition < minGap) return minGap
  if (newPosition > maxSize - minGap) return maxSize - minGap
  
  // 与其他梃的间距约束
  const sameMullions = mullions.filter(m => 
    m.type === mullion.type && m.id !== mullion.id
  )
  
  for (const other of sameMullions) {
    if (Math.abs(newPosition - other.position) < minGap) {
      return other.position + (newPosition > other.position ? minGap : -minGap)
    }
  }
  
  return newPosition
}
```

---

## 实现计划

### 阶段1：基础框架（第1天）

- [x] 创建设计文档
- [ ] 设置TypeScript类型定义
- [ ] 创建基础组件结构
- [ ] 实现框架渲染

### 阶段2：梃和扇（第2-3天）

- [ ] 实现梃的渲染
- [ ] 实现梃的拖拽功能
- [ ] 自动计算扇边界
- [ ] 实现扇的渲染

### 阶段3：交互功能（第4-5天）

- [ ] 实现选中功能
- [ ] 实现属性面板
- [ ] 实现属性修改
- [ ] 实现删除功能

### 阶段4：平面图（第6天）

- [ ] 实现平面图组件
- [ ] 实现开启方向显示
- [ ] 实现拖拽功能

### 阶段5：优化和测试（第7天）

- [ ] 性能优化
- [ ] 响应式适配
- [ ] 测试和修复bug
- [ ] 文档完善

---

## 技术要点

### 1. 坐标系统

```typescript
// 使用mm作为单位
// 左上角为原点(0, 0)
// X轴向右为正
// Y轴向下为正

// 屏幕显示需要缩放
const scale = 0.5  // 1mm = 0.5px
const screenX = realX * scale
const screenY = realY * scale
```

### 2. 事件处理

```typescript
// 防止事件冒泡
const handleClick = (e: React.MouseEvent, item: any) => {
  e.stopPropagation()
  // 处理逻辑
}

// 拖拽处理
const useDraggable = () => {
  const [isDragging, setIsDragging] = useState(false)
  // ...
}
```

### 3. 性能优化

```typescript
// 使用useMemo缓存计算结果
const sashes = useMemo(() => {
  return calculateSashes(frame, mullions)
}, [frame, mullions])

// 使用useCallback缓存事件处理器
const handleSashSelect = useCallback((sash: Sash) => {
  // ...
}, [])
```

---

## 相关文件

### 需要创建的文件

1. **components/window-detail-editor.tsx**
   - 主编辑器组件

2. **components/window-plan-view.tsx**
   - 平面图组件

3. **components/sash-property-panel.tsx**
   - 扇属性面板

4. **lib/window-calculation.ts**
   - 计算工具函数

### 需要修改的文件

1. **app/design/page.tsx**
   - 集成新的编辑器组件

---

## 总结

这是一个专业级的窗户设计编辑器，核心功能包括：

1. **可视化设计**：直观的画布操作
2. **智能计算**：自动计算扇的边界
3. **灵活配置**：支持多种开启方式
4. **实时预览**：平面图实时更新

**技术栈**：
- React Hooks
- TypeScript
- Tailwind CSS
- Canvas/SVG

**预计工作量**：7个工作日

---

**版本**: v4.0.0  
**状态**: 设计阶段  
**更新时间**: 2025年11月6日

