# 窗型选择验证功能

## 功能概述

在设计流程中添加窗型选择验证，确保用户必须在步骤2选择窗型后才能进入后续步骤。

## 更新时间

2025年11月6日

---

## 功能需求

### 核心要求

1. **步骤3及以后需要验证**：用户必须先在步骤2选择窗型
2. **点击下一步时验证**：如果未选择窗型，显示提示
3. **点击后续步骤时验证**：直接点击步骤指示器也需要验证
4. **友好提示**：使用 Toast 提示"请先确定窗型"

---

## 实现方案

### 1. 添加验证函数

```tsx
// 验证是否可以进入指定步骤
const canNavigateToStage = (targetStage: number): boolean => {
  // 如果目标步骤 > 2（即步骤3及以后），需要检查是否选择了窗型
  if (targetStage > 2 && !selectedWindowType) {
    toast({
      title: "请先确定窗型",
      description: "请在步骤2选择一个窗型后再继续",
      variant: "destructive",
    })
    return false
  }
  return true
}
```

**验证逻辑**：
- 检查目标步骤是否 > 2
- 检查 `selectedWindowType` 是否为空
- 如果验证失败，显示 Toast 提示
- 返回布尔值表示是否可以导航

---

### 2. 修改导航函数

#### nextStage 函数

```tsx
// 修改前
const nextStage = () => {
  if (currentStage < designStages.length) {
    setCurrentStage(currentStage + 1)
  }
}

// 修改后
const nextStage = () => {
  if (currentStage < designStages.length) {
    const targetStage = currentStage + 1
    if (canNavigateToStage(targetStage)) {
      setCurrentStage(targetStage)
    }
  }
}
```

**改进**：
- 先计算目标步骤
- 调用验证函数检查是否可以导航
- 只有验证通过才执行导航

#### goToStage 函数（新增）

```tsx
// 跳转到指定步骤（带验证）
const goToStage = (stageId: number) => {
  if (canNavigateToStage(stageId)) {
    setCurrentStage(stageId)
  }
}
```

**用途**：
- 用于步骤指示器的点击导航
- 统一的验证入口

---

### 3. 修改步骤指示器

```tsx
// 修改前
<button onClick={() => setCurrentStage(stage.id)}>

// 修改后
<button onClick={() => goToStage(stage.id)}>
```

**改进**：
- 使用 `goToStage` 替代直接 `setCurrentStage`
- 确保点击步骤指示器也会触发验证

---

### 4. 添加 Toast 功能

#### 导入 useToast Hook

```tsx
import { useToast } from "@/hooks/use-toast"
```

#### 在组件中使用

```tsx
export default function DesignPage() {
  const { toast } = useToast()
  // ...
}
```

#### 添加 Toaster 组件到布局

```tsx
// app/layout.tsx
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />  {/* 添加 Toaster */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 用户流程

### 正常流程

```
步骤1 (填信息) 
  ↓ 点击"下一步"
步骤2 (选窗型)
  ↓ 选择窗型 → 自动进入步骤3 ✅
步骤3 (调细节)
  ↓ 点击"下一步"
步骤4 (换样式)
  ↓ 点击"下一步"
步骤5 (看效果)
```

### 错误流程（触发验证）

```
步骤1 (填信息)
  ↓ 点击"下一步"
步骤2 (选窗型)
  ↓ 未选择窗型，直接点击"下一步" ❌
  ↓ 显示提示："请先确定窗型"
步骤2 (仍然停留)
```

```
步骤1 (填信息)
  ↓ 点击"下一步"
步骤2 (选窗型)
  ↓ 未选择窗型，直接点击步骤指示器"03" ❌
  ↓ 显示提示："请先确定窗型"
步骤2 (仍然停留)
```

---

## Toast 提示样式

### 提示内容

```tsx
toast({
  title: "请先确定窗型",
  description: "请在步骤2选择一个窗型后再继续",
  variant: "destructive",
})
```

### 显示效果

```
┌─────────────────────────────┐
│ ⚠️ 请先确定窗型              │
│                             │
│ 请在步骤2选择一个窗型后再继续│
└─────────────────────────────┘
```

**特点**：
- 标题：简洁明确
- 描述：详细说明如何解决
- 样式：destructive（红色警告）
- 自动消失：3-5秒后自动关闭

---

## 验证触发场景

### 1. 点击"下一步"按钮

| 当前步骤 | 目标步骤 | 是否验证 | 结果 |
|---------|---------|---------|------|
| 步骤1 | 步骤2 | ❌ 否 | 直接进入 |
| 步骤2 | 步骤3 | ✅ 是 | 检查窗型 |
| 步骤3 | 步骤4 | ❌ 否（已过步骤2） | 直接进入 |
| 步骤4 | 步骤5 | ❌ 否（已过步骤2） | 直接进入 |

### 2. 点击步骤指示器

| 当前步骤 | 点击步骤 | 是否验证 | 结果 |
|---------|---------|---------|------|
| 步骤1 | 步骤2 | ❌ 否 | 直接跳转 |
| 步骤1 | 步骤3 | ✅ 是 | 检查窗型 |
| 步骤1 | 步骤4 | ✅ 是 | 检查窗型 |
| 步骤2 | 步骤1 | ❌ 否（向前） | 直接跳转 |
| 步骤2 | 步骤3 | ✅ 是 | 检查窗型 |

### 3. 选择窗型后自动跳转

```tsx
const handleWindowTypeSelect = (type) => {
  setSelectedWindowType(type)
  nextStage()  // 自动进入步骤3，无需验证（因为刚选择了窗型）
}
```

**说明**：选择窗型后立即设置状态，然后调用 `nextStage`，此时验证会通过。

---

## 代码结构

### 状态管理

```tsx
const [selectedWindowType, setSelectedWindowType] = useState<any>(null)
```

**用途**：存储用户选择的窗型对象

### 验证函数

```tsx
canNavigateToStage(targetStage: number): boolean
```

**职责**：
- 检查是否可以导航到目标步骤
- 显示错误提示
- 返回验证结果

### 导航函数

```tsx
nextStage()      // 下一步（带验证）
prevStage()      // 上一步（无需验证）
goToStage(id)    // 跳转到指定步骤（带验证）
```

### 业务函数

```tsx
handleWindowTypeSelect(type)  // 选择窗型并自动进入下一步
```

---

## 测试场景

### 基础验证测试

#### 测试1：步骤2未选择，点击下一步
- [ ] 在步骤2，不选择任何窗型
- [ ] 点击"下一步"按钮
- [ ] 预期：显示 Toast 提示"请先确定窗型"
- [ ] 预期：停留在步骤2

#### 测试2：步骤2未选择，点击步骤3
- [ ] 在步骤2，不选择任何窗型
- [ ] 点击步骤指示器的"03"
- [ ] 预期：显示 Toast 提示"请先确定窗型"
- [ ] 预期：停留在步骤2

#### 测试3：步骤1直接点击步骤3
- [ ] 在步骤1
- [ ] 点击步骤指示器的"03"
- [ ] 预期：显示 Toast 提示"请先确定窗型"
- [ ] 预期：停留在步骤1

#### 测试4：选择窗型后正常流转
- [ ] 在步骤2
- [ ] 选择任意窗型
- [ ] 预期：自动进入步骤3
- [ ] 点击"下一步"
- [ ] 预期：正常进入步骤4

### 边界测试

#### 测试5：步骤2选择窗型后返回步骤1
- [ ] 选择窗型，进入步骤3
- [ ] 点击"上一步"返回步骤2
- [ ] 再点击"上一步"返回步骤1
- [ ] 从步骤1点击"下一步"
- [ ] 预期：正常进入步骤2
- [ ] 从步骤2点击"下一步"（不重新选择窗型）
- [ ] 预期：正常进入步骤3（因为之前已选择）

#### 测试6：Toast 自动消失
- [ ] 触发验证提示
- [ ] 观察 Toast
- [ ] 预期：3-5秒后自动消失

#### 测试7：多次触发验证
- [ ] 在步骤2不选窗型
- [ ] 连续多次点击"下一步"
- [ ] 预期：每次都显示提示
- [ ] 预期：不会重复叠加多个 Toast

---

## 用户体验优化

### 提示信息设计

✅ **标题简洁**："请先确定窗型"
- 直接说明问题
- 使用友好的语气

✅ **描述详细**："请在步骤2选择一个窗型后再继续"
- 明确告诉用户如何解决
- 指明需要在哪个步骤操作

✅ **样式醒目**：`variant: "destructive"`
- 红色警告样式
- 吸引用户注意
- 表明这是一个阻塞性问题

### 交互流畅性

✅ **不打断用户**
- Toast 自动消失，无需手动关闭
- 用户可以立即重新操作

✅ **验证及时**
- 点击时立即验证
- 无延迟，响应迅速

✅ **允许后退**
- 可以随时返回上一步
- 不强制必须完成当前步骤

---

## 技术细节

### 验证时机

```tsx
// 点击下一步
<Button onClick={nextStage}>下一步</Button>

// 点击步骤指示器
<button onClick={() => goToStage(stage.id)}>步骤{stage.id}</button>
```

### 状态检查

```tsx
if (targetStage > 2 && !selectedWindowType) {
  // 显示提示
  return false
}
```

**判断条件**：
1. `targetStage > 2`：目标是步骤3或更后
2. `!selectedWindowType`：没有选择窗型
3. 两个条件同时满足才触发验证

### Toast 配置

```tsx
{
  title: string,           // 标题
  description: string,     // 描述
  variant: "destructive",  // 样式变体
}
```

**variant 选项**：
- `default`：默认样式（灰色）
- `destructive`：警告样式（红色）
- `success`：成功样式（绿色，如果定义）

---

## 相关文件

### 修改的文件

1. **app/design/page.tsx**
   - 添加 `useToast` hook
   - 添加 `canNavigateToStage` 验证函数
   - 修改 `nextStage` 函数
   - 添加 `goToStage` 函数
   - 修改步骤指示器的 onClick 事件

2. **app/layout.tsx**
   - 导入 `Toaster` 组件
   - 在布局中添加 `<Toaster />`

### 依赖的组件

- `@/hooks/use-toast`：Toast hook
- `@/components/ui/toaster`：Toaster 组件

---

## 未来优化建议

### 短期优化

1. **步骤1也添加验证**
   - 检查宽度和高度是否填写
   - 提示"请先填写窗户尺寸"

2. **步骤指示器视觉反馈**
   - 未完成的后续步骤显示为禁用状态
   - 鼠标悬停显示提示

3. **更详细的错误提示**
   - 根据缺失的字段显示不同提示
   - 提供快速修复链接

### 长期优化

1. **进度保存**
   - 自动保存用户选择
   - 刷新页面后恢复状态

2. **智能推荐**
   - 如果用户跳过步骤2，自动推荐默认窗型
   - 提供"使用推荐窗型"快捷操作

3. **批量验证**
   - 在进入最后一步前，一次性验证所有必填项
   - 显示完整的验证清单

---

## 总结

### 实现功能

✅ 窗型选择验证  
✅ Toast 提示显示  
✅ 步骤导航控制  
✅ 友好的用户提示  

### 用户价值

- 🎯 确保设计流程完整
- 🎯 避免遗漏关键步骤
- 🎯 提供清晰的操作指引
- 🎯 提升用户体验

### 技术优势

- 💻 代码结构清晰
- 💻 验证逻辑统一
- 💻 易于扩展和维护
- 💻 用户体验友好

---

**版本**: v2.5.5  
**功能完成** ✓


