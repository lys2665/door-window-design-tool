# 步骤条优化 - 居中展示与全局一致性

## 🎯 优化目标

优化全局步骤条，实现：
1. **居中展示** - 步骤条在顶部居中显示
2. **全局一致** - 所有页面的步骤条样式和交互保持一致
3. **清晰美观** - 更大的步骤圆圈，更清晰的连接线

---

## 📐 新布局设计

### 优化前布局
```
┌────────────────────────────────────────────┐
│ [← 返回] 门窗设计工具         [01]-[02]-[03]-[04] [上一步] [下一步] │
│                                ↑步骤条在右侧                        │
└────────────────────────────────────────────┘
```

**问题**：
- ❌ 步骤条靠右，不够突出
- ❌ 视觉重心不平衡
- ❌ iPad横屏时距离太远

---

### 优化后布局 ⭐
```
┌────────────────────────────────────────────┐
│ [← 返回] 门窗设计工具     [01]─[02]─[03]─[04]     [上一步] [下一步] │
│                           ↑步骤条居中显示                           │
└────────────────────────────────────────────┘
```

**优势**：
- ✅ 步骤条居中，视觉焦点
- ✅ 左右对称，平衡美观
- ✅ iPad横屏易于点击

---

## 🎨 统一的步骤条样式

### 视觉规范

#### 1. 步骤圆圈
```tsx
尺寸: w-9 h-9 (36×36px)
圆角: rounded-full
字号: text-sm (14px)
格式: 01, 02, 03, 04
```

#### 2. 状态颜色

| 状态 | 背景 | 边框 | 文字 |
|------|------|------|------|
| **已完成** | `bg-primary` | 无 | `text-primary-foreground` |
| **当前步骤** | `bg-primary/20` | `border-2 border-primary` | `text-primary` |
| **未开始** | `bg-muted` | 无 | `text-muted-foreground` |

#### 3. 连接线
```tsx
宽度: w-12 (48px)
高度: h-[2px] (2px)
颜色: 
  - 已完成: bg-primary
  - 未完成: bg-border
过渡: transition-colors
```

---

## 💻 代码实现

### 布局结构

```tsx
<header className="border-b bg-card px-4 py-2.5 shrink-0 relative">
  <div className="flex items-center justify-between">
    {/* 左侧：Logo和标题 */}
    <div className="flex items-center gap-3 flex-shrink-0">
      ...
    </div>
    
    {/* 中间：步骤条（绝对定位居中）*/}
    <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
      {/* 步骤圆圈和连接线 */}
    </div>
    
    {/* 右侧：导航按钮 */}
    <div className="flex items-center gap-2 flex-shrink-0">
      ...
    </div>
  </div>
</header>
```

**关键点**：
- `relative` 在 `header` 上，为绝对定位提供参考
- `absolute left-1/2 -translate-x-1/2` 实现水平居中
- `flex-shrink-0` 确保左右内容不被压缩

---

### 步骤圆圈

```tsx
{designStages.map((stage, index) => (
  <div key={stage.id} className="flex items-center">
    {/* 步骤按钮 */}
    <button
      onClick={() => setCurrentStage(stage.id)}
      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
        currentStage > stage.id
          ? "bg-primary text-primary-foreground"
          : currentStage === stage.id
            ? "bg-primary/20 text-primary border-2 border-primary"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
      title={stage.name}
    >
      {currentStage > stage.id ? (
        <Check className="h-4 w-4" />
      ) : (
        `0${index + 1}`
      )}
    </button>
    
    {/* 连接线 */}
    {index < designStages.length - 1 && (
      <div className={`w-12 h-[2px] mx-1 transition-colors ${
        currentStage > stage.id ? 'bg-primary' : 'bg-border'
      }`} />
    )}
  </div>
))}
```

---

## 📱 响应式设计

### 桌面端（md及以上）
```
┌──────────────────────────────────────────────┐
│ [←] 门窗设计工具      [01]─[02]─[03]─[04]      [上一步] [下一步] │
│                       ↑居中显示                              │
└──────────────────────────────────────────────┘
```
- 步骤条完整显示
- 居中对齐
- 清晰易用

### 移动端（sm以下）
```
┌────────────────────────────┐
│ [←] 门窗设计工具          │
│     基础选型              │
│     [上] [下]             │
└────────────────────────────┘
```
- 步骤条隐藏（`hidden md:flex`）
- 仅显示当前步骤名称
- 节省空间

---

## 🎯 应用页面

### 1. 设计工具页面（/design）

**步骤配置**：
```tsx
const designStages = [
  { id: 1, name: "基础选型" },
  { id: 2, name: "窗型设计" },
  { id: 3, name: "配置选择" },
  { id: 4, name: "成果输出" },
]
```

**文件**：`app/design/page.tsx`

**步骤条**：
- 4个步骤：01, 02, 03, 04
- 居中显示
- 完成状态显示 ✓
- 可点击切换

---

### 2. AI封窗建议页面（/ai）

**步骤配置**：
```tsx
const steps = [
  { id: 1, title: "基本信息" },
  { id: 2, title: "性能与风格" },
]
```

**文件**：`app/ai/page.tsx`

**步骤条**：
- 2个步骤：01, 02
- 居中显示
- 与设计工具页面样式一致
- 可点击切换

---

## 🎨 视觉对比

### 设计工具页面

**优化前**：
```
[Logo] 门窗设计工具                    [1][2][3][4] [上一步][下一步]
       基础选型                         ↑步骤条小且靠右
```

**优化后**：
```
[Logo] 门窗设计工具          [01]─[02]─[03]─[04]         [上一步][下一步]
       基础选型              ↑步骤条大且居中
```

**改进**：
- ✅ 步骤圆圈：7×7px → 9×9px（+28%）
- ✅ 连接线：8px → 12px（+50%）
- ✅ 连接线高度：1px → 2px（+100%）
- ✅ 编号格式：1 → 01（更统一）
- ✅ 位置：右侧 → 居中（更突出）

---

### AI封窗建议页面

**优化前**：
```
[Home] AI 封窗建议                                [上一步][下一步]
       智能分析您的需求...
       [1 基本信息]──────[2 性能与风格]
       ↑步骤条在底部，占用额外空间
```

**优化后**：
```
[Home] AI 封窗建议              [01]─[02]              [上一步][下一步]
       基本信息                  ↑步骤条居中
```

**改进**：
- ✅ 移除面包屑导航（简化）
- ✅ 步骤条移至顶部居中
- ✅ 节省垂直空间
- ✅ 与设计工具页面一致

---

## 📊 优化前后对比

| 项目 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| **步骤圆圈大小** | 7×7px | **9×9px** | +28% ⭐ |
| **连接线宽度** | 8px | **12px** | +50% ⭐ |
| **连接线高度** | 1px | **2px** | +100% ⭐ |
| **步骤编号** | 1, 2, 3 | **01, 02, 03** | 更统一 ✅ |
| **位置** | 右侧 | **居中** | 更突出 ✅ |
| **全局一致性** | 不一致 | **一致** | 体验统一 ✅ |

---

## 🎯 交互优化

### 1. 点击步骤切换
```tsx
<button onClick={() => setCurrentStage(stage.id)}>
  {/* 步骤圆圈 */}
</button>
```
- ✅ 直接点击切换到对应步骤
- ✅ 支持前进和后退
- ✅ 实时更新状态

### 2. 悬停反馈
```tsx
className="... hover:bg-muted/80"
```
- ✅ 未完成步骤悬停变色
- ✅ 提示可点击
- ✅ 增强交互体验

### 3. 完成状态
```tsx
{currentStage > stage.id ? (
  <Check className="h-4 w-4" />
) : (
  `0${index + 1}`
)}
```
- ✅ 已完成步骤显示 ✓
- ✅ 当前/未完成显示编号
- ✅ 一目了然

---

## 💡 设计细节

### 1. 左侧区域
```tsx
<div className="flex items-center gap-3 flex-shrink-0">
  <Button>返回</Button>
  <div>
    <h1>门窗设计工具</h1>
    <p>基础选型</p>
  </div>
</div>
```
- 返回按钮 + 标题 + 当前步骤名称
- `flex-shrink-0` 确保不被压缩
- 左对齐，固定宽度

### 2. 中间区域（步骤条）
```tsx
<div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
  {/* 步骤圆圈和连接线 */}
</div>
```
- 绝对定位，水平居中
- `hidden md:flex` 响应式显示
- 独立于左右区域

### 3. 右侧区域
```tsx
<div className="flex items-center gap-2 flex-shrink-0">
  <Button>上一步</Button>
  <Button>下一步</Button>
</div>
```
- 导航按钮
- `flex-shrink-0` 确保不被压缩
- 右对齐，固定宽度

---

## 🚀 使用指南

### 新增步骤条页面

如果要在新页面添加统一的步骤条，请使用以下模板：

```tsx
<header className="border-b bg-card px-4 py-2.5 shrink-0 relative">
  <div className="flex items-center justify-between">
    {/* 左侧：Logo和标题 */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <Link href="/">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-sm md:text-base font-semibold">页面标题</h1>
        <p className="text-[10px] md:text-xs text-muted-foreground">
          {steps[currentStep - 1]?.name}
        </p>
      </div>
    </div>
    
    {/* 中间：步骤条 */}
    <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => setCurrentStep(step.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              currentStep > step.id
                ? "bg-primary text-primary-foreground"
                : currentStep === step.id
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            title={step.name}
          >
            {currentStep > step.id ? <Check className="h-4 w-4" /> : `0${index + 1}`}
          </button>
          {index < steps.length - 1 && (
            <div className={`w-12 h-[2px] mx-1 transition-colors ${
              currentStep > step.id ? 'bg-primary' : 'bg-border'
            }`} />
          )}
        </div>
      ))}
    </div>
    
    {/* 右侧：导航按钮 */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button variant="outline" size="sm" onClick={prevStep}>
        上一步
      </Button>
      <Button size="sm" onClick={nextStep}>
        下一步
      </Button>
    </div>
  </div>
</header>
```

---

## ✅ 优化成果

### 视觉改进
- ✅ 步骤条居中显示，更突出
- ✅ 步骤圆圈更大，更清晰
- ✅ 连接线更粗，更明显
- ✅ 编号格式统一（01, 02）
- ✅ 完成状态清晰（✓）

### 交互改进
- ✅ 可点击切换步骤
- ✅ 悬停反馈明确
- ✅ 状态变化流畅
- ✅ 全局一致体验

### 布局改进
- ✅ 左中右三区域平衡
- ✅ 响应式完美适配
- ✅ iPad横屏友好
- ✅ 移动端优雅降级

---

## 📁 修改文件

- ✅ `app/design/page.tsx` - 设计工具页面
- ✅ `app/ai/page.tsx` - AI封窗建议页面

---

## 🎊 最终效果

### 设计工具页面
```
┌─────────────────────────────────────────────────────┐
│ [←] 门窗设计工具          [01]─[02]─[03]─[04]          [上一步] [下一步] │
│     基础选型              ↑当前步骤高亮                              │
└─────────────────────────────────────────────────────┘
```

### AI封窗建议页面
```
┌─────────────────────────────────────────────────────┐
│ [🏠] AI 封窗建议              [01]─[02]              [上一步] [下一步] │
│      基本信息                ↑当前步骤高亮                          │
└─────────────────────────────────────────────────────┘
```

**统一特点**：
- ⭐ 步骤条居中显示
- ⭐ 相同的样式规范
- ⭐ 一致的交互逻辑
- ⭐ 统一的视觉语言

---

**更新日期**：2024-10-31  
**优化重点**：步骤条居中 + 全局一致性  
**核心改进**：
- ⭐ 居中展示，更突出
- ⭐ 全局一致，更统一
- ⭐ 视觉清晰，更专业
- ⭐ 交互流畅，更友好

**状态**：✅ 已完成并测试通过

🎊 **统一、美观、易用的全局步骤条！**

