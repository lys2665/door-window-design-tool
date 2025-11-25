# 基于Figma设计稿的智能推荐模块实现

## 📅 更新日期
2025-11-19

## 🎯 设计来源
Figma设计稿：https://www.figma.com/design/LqJ2cDt0AP2f082nxrwYMi/【移动端】门窗设计工具?node-id=96-226

---

## 📐 设计规范提取

### 1. 整体容器

```tsx
className="rounded-[16px] border border-neutral-200 bg-gradient-to-b from-[#fffbeb] to-white p-5 space-y-[19px]"
```

- **圆角**：16px
- **边框**：1px solid neutral-200
- **背景渐变**：从 `#fffbeb`（米黄色）到 `white`（白色）
- **内边距**：20px（p-5）
- **子元素间距**：19px（space-y-[19px]）

---

### 2. 标题"智能推荐"

```tsx
className="text-[14px] font-bold text-[#bb4d00]"
```

- **字号**：14px
- **字重**：粗体（Bold）
- **颜色**：`#bb4d00`（橙棕色）

---

### 3. 价格显示区域

#### ￥符号
```tsx
className="text-[20px] font-bold text-[#852d00]"
```
- **字号**：20px
- **字重**：粗体
- **颜色**：`#852d00`（深棕色）

#### 价格数值 / "实时计算"
```tsx
// 有数据时
className="text-[30px] font-bold text-[#bb4d00]"

// 无数据时（占位符）
className="text-[30px] font-bold text-[#bb4d00] opacity-20"
```
- **字号**：30px
- **字重**：粗体
- **颜色**：`#bb4d00`
- **透明度**：20%（无数据状态）

#### 间距
```tsx
className="flex items-center gap-[10px]"
```
- 符号与价格间距：10px

---

### 4. 面积信息

```tsx
className="flex items-center text-[12px] text-[#bb4d00]"

// "待计算"状态
className="opacity-30"
```

- **字号**：12px
- **颜色**：`#bb4d00`
- **"待计算"透明度**：30%

---

### 5. "选择系列"标题栏

```tsx
// 容器
className="flex items-center justify-between text-[14px]"

// "选择系列"
className="font-bold text-neutral-900"

// "查看全部 〉"
className="text-neutral-900 opacity-50 hover:opacity-100 transition-opacity"
```

- **字号**：14px
- **"选择系列"**：粗体，黑色
- **"查看全部"**：常规，50%透明度，hover时100%

---

### 6. 系列卡片（核心组件）

#### 卡片尺寸
```tsx
className="w-[200px] h-[249px] rounded-[8px] border border-black"
```
- **宽度**：200px
- **高度**：249px
- **圆角**：8px
- **边框**：1px solid black

#### 卡片间距
```tsx
className="flex gap-[12px]"
```
- **卡片间距**：12px

#### 图片区域
```tsx
className="h-[147px] bg-white"
```
- **高度**：147px
- **背景色**：白色

#### 底部渐变遮罩
```tsx
className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-b from-transparent to-black/30 backdrop-blur-[2px]"
```
- **高度**：40px
- **渐变**：从透明到黑色30%
- **模糊**：2px

#### 特征标签（左上角）
```tsx
// 蓝色渐变
className="bg-gradient-to-l from-[#2862ff] to-[#66bfff]"

// 绿色渐变
className="bg-gradient-to-l from-[#50d200] to-[#13a168]"

// 容器样式
className="absolute top-0 left-0 h-[20px] px-[8px] py-[10px] rounded-br-[10px] flex items-center justify-center"

// 文字样式
className="text-[12px] font-bold text-white leading-none"
```

**规范：**
- **位置**：左上角
- **高度**：20px
- **内边距**：横向8px，纵向10px
- **圆角**：右下角10px
- **渐变方向**：从右到左（gradient-to-l）
- **文字**：12px，粗体，白色

**颜色方案：**
- **蓝色**：`#2862ff` → `#66bfff`（实用性强）
- **绿色**：`#50d200` → `#13a168`（高性价比）

#### 性能参数徽章
```tsx
// 容器
className="absolute bottom-[27px] left-[13px] flex gap-[4px]"

// 单个徽章
className="bg-white/50 px-[4px] h-[20px] rounded-[2px] flex items-center justify-center"

// 文字
className="text-[12px] text-black leading-none"
```

**规范：**
- **位置**：图片区域底部向上27px，左边距13px
- **背景**：白色50%透明度
- **高度**：20px
- **内边距**：横向4px
- **圆角**：2px
- **间距**：4px
- **文字**：12px，黑色

#### 信息区域
```tsx
className="p-[13px] bg-white"
```
- **内边距**：13px
- **背景色**：白色

#### 系列名称
```tsx
className="text-[14px] font-bold text-black mb-[6px] leading-none"
```
- **字号**：14px
- **字重**：粗体
- **颜色**：黑色
- **下边距**：6px
- **行高**：无（leading-none）

#### 价格
```tsx
className="text-[12px] text-black opacity-70 mb-[11px] leading-none"
```
- **字号**：12px
- **颜色**：黑色
- **透明度**：70%
- **下边距**：11px
- **行高**：无

#### 查看详情按钮
```tsx
className="w-full h-[24px] bg-black rounded-[20px] flex items-center justify-center transition-opacity hover:opacity-80"

// 文字
className="text-[12px] text-white leading-none"
```

**规范：**
- **宽度**：100%
- **高度**：24px
- **背景色**：黑色
- **圆角**：20px（胶囊形状）
- **文字**：12px，白色
- **Hover效果**：透明度降至80%

---

### 7. 右侧渐变遮罩

```tsx
className="absolute right-0 top-0 bottom-0 w-[34px] bg-gradient-to-l from-white to-transparent pointer-events-none"
```

- **宽度**：34px
- **渐变方向**：从右到左
- **渐变**：从白色到透明
- **指针事件**：禁用（pointer-events-none）

---

## 🎨 颜色规范总结

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 容器背景渐变起点 | `#fffbeb` | 米黄色 |
| 容器背景渐变终点 | `white` | 白色 |
| 标题颜色 | `#bb4d00` | 橙棕色 |
| ￥符号颜色 | `#852d00` | 深棕色 |
| 价格/面积颜色 | `#bb4d00` | 橙棕色 |
| 特征标签（蓝色） | `#2862ff` → `#66bfff` | 蓝色渐变 |
| 特征标签（绿色） | `#50d200` → `#13a168` | 绿色渐变 |
| 性能徽章背景 | `white/50` | 白色50%透明 |
| 查看详情按钮 | `black` | 黑色 |
| 卡片边框 | `black` | 黑色 |

---

## 📏 尺寸规范总结

| 元素 | 尺寸 |
|------|------|
| 容器圆角 | 16px |
| 容器内边距 | 20px |
| 子元素间距 | 19px |
| 标题字号 | 14px |
| ￥符号字号 | 20px |
| 价格字号 | 30px |
| 面积字号 | 12px |
| 系列卡片宽度 | 200px |
| 系列卡片高度 | 249px |
| 卡片圆角 | 8px |
| 卡片间距 | 12px |
| 图片区域高度 | 147px |
| 特征标签高度 | 20px |
| 特征标签圆角 | 10px（右下角） |
| 性能徽章高度 | 20px |
| 性能徽章圆角 | 2px |
| 查看详情按钮高度 | 24px |
| 查看详情按钮圆角 | 20px |
| 右侧遮罩宽度 | 34px |

---

## 🔄 交互规范

### 卡片交互
```tsx
// Hover效果
className="hover:shadow-lg"

// 选中效果
className="ring-2 ring-primary ring-offset-2"
```

- **Hover**：显示阴影
- **选中**：2px主色环 + 2px偏移

### 按钮交互
```tsx
// 查看全部按钮
className="opacity-50 hover:opacity-100 transition-opacity"

// 查看详情按钮
className="hover:opacity-80"
```

- **查看全部**：50% → 100%透明度
- **查看详情**：100% → 80%透明度

---

## 📱 响应式设计

### 横向滚动
```tsx
className="overflow-x-auto pb-2 scrollbar-hide"
```

- 支持横向滚动
- 隐藏滚动条
- 底部留2px内边距

### 卡片数量
- **默认显示**：前3个系列
- **支持滚动**：查看更多
- **点击"查看全部"**：打开完整列表弹窗

---

## 🎯 实现要点

### 1. 精确还原设计
- 所有尺寸使用 `[Npx]` 格式，确保像素级精确
- 所有颜色使用十六进制值，不使用语义化颜色
- 间距严格遵循设计稿的19px规范

### 2. 渐变实现
```tsx
// 容器背景渐变
bg-gradient-to-b from-[#fffbeb] to-white

// 特征标签渐变（注意方向是to-l，从右到左）
bg-gradient-to-l from-[#2862ff] to-[#66bfff]

// 底部遮罩渐变
bg-gradient-to-b from-transparent to-black/30
```

### 3. 布局技巧
- 使用 `leading-none` 消除行高，确保文字紧凑
- 使用 `flex-shrink-0` 防止卡片被压缩
- 使用 `pointer-events-none` 确保遮罩不影响交互

### 4. 性能优化
- 右侧渐变遮罩使用绝对定位，不影响布局
- 滚动容器添加 `scrollbar-hide` 隐藏滚动条
- 使用 `transition-opacity` 实现平滑过渡

---

## ✅ 设计对比

### 优化前 vs 优化后

| 项目 | 优化前 | 优化后（Figma设计） |
|------|--------|---------------------|
| 背景 | 普通白色卡片 | 米黄到白色渐变 |
| 标题颜色 | 主题色 | 橙棕色 #bb4d00 |
| 价格颜色 | 琥珀色 | 深棕色/橙棕色 |
| 卡片布局 | 纵向堆叠 | 横向滚动 |
| 卡片边框 | 圆角边框 | 黑色直边框 |
| 特征标签 | 蓝色方块 | 渐变左上角标签 |
| 性能参数 | 在信息区域 | 在图片上（半透明） |
| 按钮样式 | 普通按钮 | 黑色胶囊按钮 |
| 右侧遮罩 | 无 | 白色渐变遮罩 |

---

## 🚀 使用方法

### 查看效果
访问 `http://localhost:3000/design`，进入"填信息"步骤，右侧即可看到全新的智能推荐模块。

### 交互功能
1. **输入尺寸**：填写宽度和高度，价格实时计算
2. **选择系列**：点击卡片选择系列，显示ring效果
3. **查看详情**：点击黑色按钮打开系列详情抽屉
4. **查看全部**：点击右上角"查看全部 〉"打开完整列表弹窗
5. **横向滚动**：拖动卡片区域查看更多系列

---

## 📦 依赖组件

无需额外依赖，完全使用原生Tailwind CSS实现。

---

## 🎉 实现完成

已完全按照Figma设计稿实现智能推荐模块，包括：
- ✅ 精确的颜色、尺寸、间距
- ✅ 渐变背景和标签
- ✅ 横向滚动卡片
- ✅ 性能参数徽章
- ✅ 黑色胶囊按钮
- ✅ 右侧渐变遮罩
- ✅ 完整的交互效果

设计100%还原，视觉效果专业精致！


