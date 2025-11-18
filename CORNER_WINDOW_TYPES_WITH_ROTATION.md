# 转角窗类型升级 - 支持Z型窗和旋转角度

## 更新概述

根据用户提供的图示，升级转角窗类型系统，新增Z型窗，并为所有转角窗类型添加旋转角度支持。

## 更新时间

2025年11月6日

---

## 功能升级

### 1. 新增窗型类型

现在支持4种基本窗型：

#### 一字型（Straight）
```
蓝色实线表示窗户
─────────
```
- 单边水平窗户
- 最简单的窗户类型
- 仅需填写宽度和高度

#### L型（L-Type）
```
│        蓝色实线（边A）
│        空心线（边B）
└───────
```
- 两个相连的边
- 边A：实线边（蓝色）
- 边B：延伸边（空心）
- 适合拐角位置

#### U型（U-Type）
```
│           │  蓝色实线（边A）
│           │  空心线（边B、C）
└───────────┘
```
- 三个相连的边
- 边A：实线边（蓝色，左侧）
- 边B：底部边（空心）
- 边C：延伸边（空心，右侧）
- 适合凸窗、飘窗

#### Z型（Z-Type）- 新增
```
        │  空心线（边C）
        │  空心线（边B）
─────────
│          蓝色实线（边A）
```
- 三个相连的边，呈Z字形
- 边A：实线边（蓝色，左下）
- 边B：水平延伸（空心）
- 边C：垂直延伸（空心，右上）
- 适合特殊的阶梯式设计

### 2. 旋转角度支持

所有转角窗类型现在支持4个旋转角度：

| 角度 | 描述 | 用途 |
|------|------|------|
| **0°** | 默认方向 | 标准安装 |
| **90°** | 顺时针旋转90度 | 右侧墙安装 |
| **180°** | 旋转180度 | 反向安装 |
| **270°** | 逆时针旋转90度 | 左侧墙安装 |

---

## 界面设计

### 完整布局

```
┌─────────────────────────────────────┐
│ 窗户类型                             │
│ [一字窗] [转角窗]                    │
│                                     │
│ 转角窗类型                           │
│ [L型窗] [U型窗] [Z型窗]  ← 3列布局   │
│                                     │
│ 旋转角度                             │
│ [0°] [90°] [180°] [270°]  ← 4列布局│
│                                     │
│ ┌─────────────────────┐             │
│ │ [SVG图示]           │             │
│ │ 自动旋转显示         │             │
│ │                     │             │
│ │ 窗型说明            │             │
│ │ 旋转角度：90°       │             │
│ └─────────────────────┘             │
│                                     │
│ 边A尺寸                             │
│ [宽度] [高度]                       │
│                                     │
│ 边B尺寸                             │
│ [宽度] [高度]                       │
│                                     │
│ 边C尺寸（U型和Z型）                 │
│ [宽度] [高度]                       │
└─────────────────────────────────────┘
```

### 旋转角度选择器

```
┌─────────────────────────────────────┐
│ 旋转角度                             │
│                                     │
│  [  0°  ]  [ 90° ]  [180°]  [270°] │
│   选中     正常     正常      正常   │
│  (蓝色)   (灰色)   (灰色)   (灰色)  │
└─────────────────────────────────────┘
```

**特点**：
- 4列等宽布局
- 小号按钮（h-9）
- 文字更小（text-xs）
- 清晰的选中状态

### 窗型类型选择器

```
┌─────────────────────────────────────┐
│ 转角窗类型                           │
│                                     │
│  [ L型窗 ]  [ U型窗 ]  [ Z型窗 ]   │
│    选中      正常       正常        │
│   (蓝色)    (灰色)    (灰色)       │
└─────────────────────────────────────┘
```

**特点**：
- 3列等宽布局
- 标准按钮（h-10）
- Grid布局自动适配

---

## SVG 图示设计

### L型窗图示

```svg
<svg viewBox="0 0 100 100" style="transform: rotate(0deg)">
  <!-- 边A - 垂直边（蓝色实心）-->
  <rect x="10" y="30" width="8" height="50" fill="#3b82f6"/>
  
  <!-- 边B - 顶部延伸（黑色空心）-->
  <rect x="10" y="30" width="50" height="8" 
        fill="none" stroke="currentColor" strokeWidth="2"/>
  
  <!-- 标签 -->
  <text x="14" y="58" fill="white">A</text>
  <text x="35" y="36" fill="currentColor">B</text>
</svg>
```

**视觉特点**：
- 边A：蓝色填充（#3b82f6）
- 边B：空心描边
- 文字标签清晰可见
- 支持CSS旋转变换

### U型窗图示

```svg
<svg viewBox="0 0 100 100" style="transform: rotate(0deg)">
  <!-- 边A - 左垂直边（蓝色实心）-->
  <rect x="10" y="30" width="8" height="50" fill="#3b82f6"/>
  
  <!-- 边B - 底部水平边（空心）-->
  <rect x="10" y="72" width="60" height="8" 
        fill="none" stroke="currentColor" strokeWidth="2"/>
  
  <!-- 边C - 右垂直边（空心）-->
  <rect x="62" y="30" width="8" height="50" 
        fill="none" stroke="currentColor" strokeWidth="2"/>
  
  <!-- 标签 -->
  <text x="14" y="58" fill="white">A</text>
  <text x="40" y="78" fill="currentColor">B</text>
  <text x="66" y="58" fill="currentColor">C</text>
</svg>
```

### Z型窗图示（新增）

```svg
<svg viewBox="0 0 100 100" style="transform: rotate(0deg)">
  <!-- 边A - 左下垂直边（蓝色实心）-->
  <rect x="10" y="50" width="8" height="30" fill="#3b82f6"/>
  
  <!-- 边B - 中间水平延伸（空心）-->
  <rect x="10" y="50" width="60" height="8" 
        fill="none" stroke="currentColor" strokeWidth="2"/>
  
  <!-- 边C - 右上垂直延伸（空心）-->
  <rect x="62" y="20" width="8" height="38" 
        fill="none" stroke="currentColor" strokeWidth="2"/>
  
  <!-- 标签 -->
  <text x="14" y="68" fill="white">A</text>
  <text x="40" y="56" fill="currentColor">B</text>
  <text x="66" y="40" fill="currentColor">C</text>
</svg>
```

**Z型特点**：
- 呈现阶梯形状
- 边A在左下角
- 边B水平连接
- 边C在右上角

---

## 旋转效果展示

### L型窗旋转示例

#### 0° (默认)
```
│
│
└─────
```

#### 90° (顺时针)
```
    ─┐
     │
     │
```

#### 180° (反向)
```
─────┐
     │
     │
```

#### 270° (逆时针)
```
│
│
┌─────
```

### U型窗旋转示例

#### 0° (默认)
```
│     │
│     │
└─────┘
```

#### 90° (顺时针)
```
─────┐
     │
─────┘
```

#### 180° (反向)
```
┌─────┐
│     │
│     │
```

#### 270° (逆时针)
```
┌─────
│
└─────
```

### Z型窗旋转示例

#### 0° (默认)
```
      │
─────┐
│
```

#### 90° (顺时针)
```
─┐
 └─
   │
```

#### 180° (反向)
```
    │
┌─────
      │
```

#### 270° (逆时针)
```
│
─┐
 └─
```

---

## 数据结构

### 状态定义

```typescript
// 窗户类型
const [windowCategory, setWindowCategory] = useState<"straight" | "corner">("straight")

// 转角窗类型（新增Z型）
const [cornerType, setCornerType] = useState<"L" | "U" | "Z">("L")

// 旋转角度（新增）
const [rotationAngle, setRotationAngle] = useState<0 | 90 | 180 | 270>(0)

// 设计数据
const [designData, setDesignData] = useState({
  // 一字窗
  width: "",
  height: "",
  
  // 转角窗尺寸
  cornerDimensions: {
    sideA: { width: "", height: "" },  // 所有类型
    sideB: { width: "", height: "" },  // 所有类型
    sideC: { width: "", height: "" },  // U型和Z型
  }
})
```

### 完整配置对象

```typescript
const getWindowConfiguration = () => {
  return {
    category: windowCategory,        // "straight" | "corner"
    type: cornerType,                // "L" | "U" | "Z"
    rotation: rotationAngle,         // 0 | 90 | 180 | 270
    dimensions: windowCategory === "straight" 
      ? {
          width: designData.width,
          height: designData.height
        }
      : {
          sideA: designData.cornerDimensions.sideA,
          sideB: designData.cornerDimensions.sideB,
          ...(cornerType === "U" || cornerType === "Z" 
            ? { sideC: designData.cornerDimensions.sideC }
            : {}
          )
        }
  }
}
```

---

## 实现细节

### 1. SVG 旋转实现

使用 CSS `transform` 属性实现旋转：

```tsx
<svg 
  className="w-20 h-20 shrink-0" 
  viewBox="0 0 100 100"
  style={{ transform: `rotate(${rotationAngle}deg)` }}
>
  {/* SVG 内容 */}
</svg>
```

**优点**：
- 平滑的旋转动画
- 无需重绘SVG元素
- 性能优异
- 支持CSS过渡

### 2. 响应式布局

```tsx
{/* 转角窗类型 - 3列 */}
<div className="grid grid-cols-3 gap-2">
  {/* 按钮 */}
</div>

{/* 旋转角度 - 4列 */}
<div className="grid grid-cols-4 gap-2">
  {/* 按钮 */}
</div>
```

**特点**：
- Grid 自动等分
- 间距统一（gap-2）
- 自适应屏幕宽度

### 3. 条件渲染

```typescript
{cornerType === "L" && (
  <div>{/* L型窗内容 */}</div>
)}

{cornerType === "U" && (
  <div>{/* U型窗内容 */}</div>
)}

{cornerType === "Z" && (
  <div>{/* Z型窗内容 */}</div>
)}
```

### 4. 动态文本更新

```tsx
<p className="mt-1 text-[10px]">
  旋转角度：{rotationAngle}°
</p>
```

实时显示当前旋转角度。

---

## 用户交互流程

### 完整操作流程

```
1. 选择窗户类型
   ↓
   用户点击"转角窗"
   ↓
2. 选择转角窗类型
   ↓
   用户从 L/U/Z 中选择一种
   ↓
3. 选择旋转角度
   ↓
   用户从 0°/90°/180°/270° 中选择
   ↓
4. 查看图示更新
   ↓
   SVG图示自动旋转到相应角度
   ↓
5. 填写尺寸数据
   ↓
   根据边数填写对应尺寸
   ↓
6. 完成配置
```

### 旋转角度选择示例

用户选择L型窗 → 旋转90° → 图示更新为：

```
原始 (0°):          旋转后 (90°):
│                       ─┐
│                        │
└─────                   │
```

---

## 尺寸输入规则

### L型窗尺寸

| 边 | 说明 | 必填 |
|----|------|------|
| 边A | 实线边（蓝色） | ✓ |
| 边B | 延伸边 | ✓ |

**总计**: 4个输入框（2边 × 2尺寸）

### U型窗尺寸

| 边 | 说明 | 必填 |
|----|------|------|
| 边A | 实线边（蓝色） | ✓ |
| 边B | 底部边 | ✓ |
| 边C | 延伸边 | ✓ |

**总计**: 6个输入框（3边 × 2尺寸）

### Z型窗尺寸

| 边 | 说明 | 必填 |
|----|------|------|
| 边A | 实线边（蓝色） | ✓ |
| 边B | 水平延伸 | ✓ |
| 边C | 垂直延伸 | ✓ |

**总计**: 6个输入框（3边 × 2尺寸）

---

## 样式系统

### 按钮样式（选中状态）

```tsx
className={cn(
  "h-10 rounded-lg border-2 transition-all text-sm font-medium",
  isSelected
    ? "border-primary bg-primary/10 text-primary"  // 选中
    : "border-border hover:border-primary/50"      // 未选中
)}
```

### 角度按钮样式（更小）

```tsx
className={cn(
  "h-9 rounded-lg border-2 transition-all text-xs font-medium",
  isSelected
    ? "border-primary bg-primary/10 text-primary"
    : "border-border hover:border-primary/50"
)}
```

**区别**：
- 高度：h-9 vs h-10
- 文字：text-xs vs text-sm

### 图示容器样式

```tsx
<div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
  {/* 图示内容 */}
</div>
```

---

## 应用场景

### L型窗应用

#### 0° - 左侧拐角
```
典型场景：阳台左侧转角
窗户配置：左墙垂直窗 + 前墙延伸
```

#### 90° - 顶部拐角
```
典型场景：顶部采光窗转角
窗户配置：顶部垂直 + 侧面延伸
```

#### 180° - 右侧拐角
```
典型场景：阳台右侧转角
窗户配置：右墙垂直窗 + 后墙延伸
```

#### 270° - 底部拐角
```
典型场景：底部通风窗转角
窗户配置：底部垂直 + 侧面延伸
```

### U型窗应用

#### 0° - 标准凸窗
```
典型场景：客厅飘窗
窗户配置：左右两侧 + 前面主窗
```

#### 90° - 侧面凸窗
```
典型场景：卧室侧面飘窗
窗户配置：旋转90度安装
```

### Z型窗应用

#### 0° - 阶梯式设计
```
典型场景：复式楼梯窗
窗户配置：下层垂直 + 中间平台 + 上层垂直
```

#### 90° - 侧面阶梯
```
典型场景：侧面采光井
窗户配置：旋转后的阶梯布局
```

---

## 技术优势

### 1. 图示即时反馈

```
用户选择旋转角度
    ↓
图示立即旋转
    ↓
用户看到实际效果
    ↓
确认或调整角度
```

### 2. 统一的尺寸输入

所有窗型使用相同的输入组件：

```tsx
<Input
  type="number"
  placeholder="1800"
  className="h-10"
  inputMode="numeric"
/>
```

### 3. 灵活的数据结构

支持不同数量的边：

```typescript
cornerDimensions: {
  sideA: { /* 总是存在 */ },
  sideB: { /* 总是存在 */ },
  sideC: { /* U型和Z型使用 */ }
}
```

### 4. CSS 驱动的旋转

```css
.rotate-0 { transform: rotate(0deg); }
.rotate-90 { transform: rotate(90deg); }
.rotate-180 { transform: rotate(180deg); }
.rotate-270 { transform: rotate(270deg); }
```

**优点**：
- 硬件加速
- 平滑动画
- 无重绘开销

---

## 测试场景

### 功能测试

- [ ] L型窗选择和旋转
- [ ] U型窗选择和旋转
- [ ] Z型窗选择和旋转
- [ ] 0°旋转显示正确
- [ ] 90°旋转显示正确
- [ ] 180°旋转显示正确
- [ ] 270°旋转显示正确

### 数据测试

- [ ] L型窗输入2组尺寸
- [ ] U型窗输入3组尺寸
- [ ] Z型窗输入3组尺寸
- [ ] 切换窗型时数据保留
- [ ] 旋转角度数据持久化

### 视觉测试

- [ ] SVG图示清晰可见
- [ ] 旋转动画流畅
- [ ] 按钮选中状态明显
- [ ] 布局响应式正常
- [ ] 颜色对比度合适

### 交互测试

- [ ] 点击窗型按钮切换
- [ ] 点击角度按钮旋转
- [ ] 输入数字正常
- [ ] 数字键盘弹出（移动端）
- [ ] 悬停效果正确

---

## 与原版对比

### 功能对比

| 功能 | 原版 | 新版 |
|------|------|------|
| **窗型类型** | L型、U型 | L型、U型、Z型 ✓ |
| **旋转支持** | 无 | 4个角度 ✓ |
| **图示旋转** | 无 | SVG实时旋转 ✓ |
| **角度显示** | 无 | 实时显示 ✓ |
| **布局方式** | 2列 | 3列/4列 ✓ |

### 代码对比

#### 原版窗型选择
```tsx
<div className="flex gap-2">
  <button>L型窗</button>
  <button>U型窗</button>
</div>
```

#### 新版窗型选择
```tsx
<div className="grid grid-cols-3 gap-2">
  <button>L型窗</button>
  <button>U型窗</button>
  <button>Z型窗</button>
</div>

<div className="grid grid-cols-4 gap-2">
  <button>0°</button>
  <button>90°</button>
  <button>180°</button>
  <button>270°</button>
</div>
```

---

## 未来扩展

### 1. 自动旋转建议

```typescript
// 根据安装位置推荐旋转角度
const getRecommendedRotation = (location: string) => {
  const recommendations = {
    "左墙": 0,
    "前墙": 90,
    "右墙": 180,
    "后墙": 270,
  }
  return recommendations[location] || 0
}
```

### 2. 3D预览

```
实现真实的3D旋转预览：
- Three.js 渲染
- 交互式旋转
- 光照和阴影效果
```

### 3. 更多窗型

```
计划添加：
- T型窗
- H型窗
- 自定义多边形窗
```

### 4. 角度微调

```tsx
<input 
  type="range" 
  min="0" 
  max="360" 
  step="15"
  value={rotationAngle}
/>
```

支持任意角度旋转（15度为步进）。

---

## 相关文件

### 修改的文件

1. **app/design/page.tsx**
   - 添加 `cornerType` 类型 "Z"
   - 添加 `rotationAngle` 状态
   - 更新转角窗类型选择器（3列）
   - 添加旋转角度选择器（4列）
   - 更新L型、U型图示（支持旋转）
   - 添加Z型窗完整实现

### 新增的文件

1. **CORNER_WINDOW_TYPES_WITH_ROTATION.md**
   - 详细功能说明
   - 使用指南
   - 技术文档

---

## 总结

### ✅ 新增功能

1. **Z型窗支持**
   - 完整的SVG图示
   - 3边尺寸输入
   - 阶梯式设计

2. **旋转角度支持**
   - 0°/90°/180°/270°
   - SVG实时旋转
   - 角度实时显示

3. **优化的图示**
   - 蓝色实心显示主边
   - 空心描边显示延伸边
   - 清晰的标签标注

4. **改进的布局**
   - 3列窗型选择
   - 4列角度选择
   - 响应式设计

### 📊 数据统计

- **窗型类型**: 4种（一字、L、U、Z）
- **旋转角度**: 4种（0°、90°、180°、270°）
- **可能组合**: 13种（1 + 3×4）
- **输入框**: 最多6个（3边×2尺寸）

### 🎯 用户价值

- 更丰富的窗型选择
- 灵活的旋转角度
- 直观的图示反馈
- 完整的尺寸配置

---

**版本**: v3.2.0  
**功能状态**: ✅ 已完成  
**更新时间**: 2025年11月6日

