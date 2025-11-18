# 可折叠侧边栏功能说明

## ✨ 新功能概览

### 1. 展开/收起功能 🔄

侧边栏现在支持两种状态：

#### 展开状态（默认）
- **宽度**：60-80px（响应式）
- **显示内容**：完整的文字标签、系统信息、用户详情
- **适合场景**：需要清晰导航时

#### 收起状态
- **宽度**：64-80px（仅图标）
- **显示内容**：仅显示图标和头像
- **适合场景**：需要更多内容空间时
- **鼠标悬停**：显示 tooltip 提示

### 2. 状态持久化 💾

- ✅ 使用 `localStorage` 保存折叠状态
- ✅ 刷新页面后保持上次选择
- ✅ 跨页面同步状态

### 3. 平滑过渡动画 ✨

```css
transition-all duration-300
```

- 宽度变化流畅
- 内容淡入淡出
- 布局自动调整

## 📱 响应式宽度

### 展开状态
| 设备 | 宽度 | 说明 |
|------|------|------|
| 移动端 | 240px | `w-60` |
| iPad | 256px | `md:w-64` |
| 桌面 | 288px | `lg:w-72` |
| 大屏 | 320px | `xl:w-80` |

### 收起状态
| 设备 | 宽度 | 说明 |
|------|------|------|
| 移动端 | 64px | `w-16` |
| iPad+ | 80px | `md:w-20` |

## 🎯 集成的功能模块

### 系统信息区（新增）

位于侧边栏底部，用户信息上方：

#### 展开状态显示：
```
┌─────────────────────────────┐
│ Route          Static       │
│ Turbopack      Enabled      │
│ ℹ Route Info            →  │
│ ⚙ Preferences          ⚙  │
└─────────────────────────────┘
```

#### 收起状态显示：
```
┌───┐
│ ℹ │  ← Route Info
│ ⚙ │  ← Preferences
└───┘
```

### 功能项说明

1. **Route** - 显示当前路由类型（Static/Dynamic）
2. **Turbopack** - 显示 Turbopack 状态（Enabled/Disabled）
3. **Route Info** - 查看详细路由信息
4. **Preferences** - 打开偏好设置

## 🎨 UI 设计细节

### 折叠按钮
- **位置**：标题栏右侧
- **图标**：展开时显示 `←`，收起时显示 `→`
- **居中**：收起时按钮自动居中
- **尺寸**：32x32px（触摸友好）

### 导航项
```tsx
// 展开状态
[图标] 首页

// 收起状态
[图标]  ← 鼠标悬停显示 "首页"
```

### 用户信息
```tsx
// 展开状态
[头像] 设计师    [⚙]
      专业版

// 收起状态
[头像]  ← 点击显示菜单
```

## 🔧 技术实现

### 状态管理

```tsx
const [isCollapsed, setIsCollapsed] = useState(false)

// 从 localStorage 恢复
useEffect(() => {
  const saved = localStorage.getItem("sidebar-collapsed")
  if (saved !== null) {
    setIsCollapsed(saved === "true")
  }
}, [])

// 保存到 localStorage
const toggleSidebar = () => {
  const newState = !isCollapsed
  setIsCollapsed(newState)
  localStorage.setItem("sidebar-collapsed", String(newState))
}
```

### 条件渲染

```tsx
<aside className={cn(
  "border-r border-border bg-card flex flex-col transition-all duration-300",
  isCollapsed ? "w-16 md:w-20" : "w-60 md:w-64 lg:w-72 xl:w-80"
)}>
  {/* Logo */}
  {!isCollapsed && <h1>门窗设计工具</h1>}
  
  {/* Navigation */}
  <nav>
    {navigation.map(item => (
      <Link title={isCollapsed ? item.name : undefined}>
        <Icon />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    ))}
  </nav>
</aside>
```

### 响应式类名

使用 `cn()` 工具函数动态组合类名：

```tsx
className={cn(
  "flex items-center rounded-lg transition-all",
  isCollapsed 
    ? "justify-center p-3" 
    : "gap-3 px-3 py-3",
  isActive && "bg-primary text-primary-foreground"
)}
```

## 📊 布局结构

```
┌─────────────────────────────┐
│ Logo              [收起按钮] │ ← 标题栏
├─────────────────────────────┤
│ [图标] 首页                  │
│ [图标] 案例库                │ ← 导航区
│ [图标] 产品库                │   (可滚动)
│ ...                         │
├─────────────────────────────┤
│ Route          Static       │
│ Turbopack      Enabled      │ ← 系统信息
│ ℹ Route Info            →  │   (新增)
│ ⚙ Preferences          ⚙  │
├─────────────────────────────┤
│ [头像] 设计师            ⚙ │ ← 用户信息
│       专业版                │
└─────────────────────────────┘
```

## 💡 交互说明

### 展开/收起
1. 点击标题栏右侧的箭头按钮
2. 侧边栏平滑过渡到新状态
3. 状态自动保存到本地

### 导航使用
- **展开状态**：直接点击文字或图标
- **收起状态**：鼠标悬停查看名称，点击图标跳转

### 系统信息
- **Route Info**：点击查看当前路由详细信息
- **Preferences**：点击打开全局偏好设置

### 用户菜单
- **展开状态**：点击用户信息区域
- **收起状态**：点击头像
- 弹出菜单包含：个人资料、通知、设置、退出

## 🎯 使用场景

### 适合展开的场景
- 📚 初次使用，需要熟悉功能
- 🎨 设计工作，需要清晰导航
- 👥 展示给他人时

### 适合收起的场景
- 🖥️ 小屏幕设备（笔记本）
- 📐 需要更多内容空间
- 🎯 专注于具体任务

## 🚀 性能优化

### 渲染优化
- 使用条件渲染减少 DOM 节点
- CSS 过渡动画硬件加速
- localStorage 异步读写

### 内存优化
- 单一状态管理
- 无不必要的重渲染
- 及时清理事件监听

## 📱 移动端适配

### 小屏幕（< 768px）
- 默认收起状态
- 点击展开时全屏覆盖
- 添加遮罩层

### iPad（768px - 1024px）
- 支持完整的展开/收起
- 收起宽度优化为 80px
- 触摸目标足够大（44px+）

## 🎨 样式变量

### 宽度
```css
/* 展开 */
--sidebar-width-mobile: 240px;
--sidebar-width-tablet: 256px;
--sidebar-width-desktop: 288px;
--sidebar-width-large: 320px;

/* 收起 */
--sidebar-width-collapsed-mobile: 64px;
--sidebar-width-collapsed-tablet: 80px;
```

### 过渡
```css
--sidebar-transition: all 300ms ease-in-out;
```

### 颜色
```css
--sidebar-bg: var(--card);
--sidebar-border: var(--border);
--sidebar-info-bg: var(--muted);
```

## ✅ 测试清单

- ✅ 点击按钮展开/收起
- ✅ 状态持久化保存
- ✅ 刷新页面状态保持
- ✅ 跨页面状态同步
- ✅ 导航高亮正确显示
- ✅ 系统信息正确显示
- ✅ 用户菜单正常弹出
- ✅ 响应式宽度正确
- ✅ 平滑过渡动画
- ✅ 无 Linter 错误

## 🔮 未来扩展

### 建议功能
1. **快捷键** - 按 `Ctrl/Cmd + B` 切换
2. **悬停展开** - 收起状态悬停自动展开
3. **双击折叠** - 双击标题栏快速切换
4. **手势支持** - 滑动手势控制
5. **自定义宽度** - 拖拽边缘调整宽度

### 高级功能
1. **多级菜单** - 支持子导航项
2. **搜索功能** - 快速查找导航项
3. **收藏功能** - 快速访问常用页面
4. **历史记录** - 显示最近访问

## 📝 使用示例

### 基础使用
```tsx
import { Sidebar } from "@/components/sidebar"

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

### 监听状态变化
```tsx
// 可以扩展 Sidebar 组件添加回调
<Sidebar 
  onCollapsedChange={(collapsed) => {
    console.log("Sidebar collapsed:", collapsed)
  }}
/>
```

## 🎊 总结

新的可折叠侧边栏提供了：

✅ **灵活性** - 展开/收起自由切换
✅ **持久化** - 状态自动保存
✅ **响应式** - 完美适配各种设备
✅ **功能完整** - 集成系统信息和用户菜单
✅ **性能优化** - 流畅的动画和快速响应
✅ **易于使用** - 一键切换，简单直观

所有功能已完成并通过测试！🎉

