# Bug修复：Cannot access 'recalculateUnits' before initialization

## 问题描述

在"开始设计"页面的步骤3（窗型设计）中，当有预选窗型时，页面会报错：

```
Cannot access 'recalculateUnits' before initialization
```

## 错误原因

### 代码调用顺序问题

在 `window-type-designer.tsx` 组件中，函数调用顺序不正确：

```tsx
// ❌ 错误的顺序

// 1. 在 useMemo 中调用 recalculateUnits
useMemo(() => {
  // ...
  recalculateUnits(newMullions)  // ❌ 调用了还未定义的函数
}, [dependencies])

// 2. 后面才定义 recalculateUnits
const recalculateUnits = (currentMullions) => {
  // 函数实现
}
```

### 根本原因

1. **函数提升（Hoisting）问题**：
   - 在 JavaScript/TypeScript 中，`const` 声明的函数不会被提升
   - 必须先定义函数，才能在代码中调用

2. **useMemo 误用**：
   - `useMemo` 用于计算和缓存值，不应该执行副作用（side effects）
   - 应该使用 `useEffect` 来执行有副作用的操作（如设置状态）

---

## 解决方案

### 1. 重新组织函数定义顺序

将 `recalculateUnits` 函数定义移到所有调用它的代码之前：

```tsx
// ✅ 正确的顺序

// 1. 先定义 recalculateUnits
const recalculateUnits = (currentMullions: typeof mullions) => {
  // 获取所有垂直梃和水平梃的位置
  const vPositions = [...]
  const hPositions = [...]
  
  // 生成所有区域
  const newUnits: typeof units = []
  // ...
  
  setUnits(newUnits)
}

// 2. 定义使用该函数的其他函数
const handleTypeSelect = (type) => {
  // ...
  recalculateUnits(newMullions)  // ✅ 可以正常调用
}

const addMullion = (type, position) => {
  // ...
  recalculateUnits(newMullions)  // ✅ 可以正常调用
}
```

### 2. 使用 useEffect 替代 useMemo

将副作用操作从 `useMemo` 改为 `useEffect`：

```tsx
// ❌ 错误：使用 useMemo 执行副作用
useMemo(() => {
  if (preselectedType && hasSelectedType && selectedType) {
    // ...
    setMullions(newMullions)        // 副作用
    recalculateUnits(newMullions)   // 副作用
  }
}, [dependencies])

// ✅ 正确：使用 useEffect 执行副作用
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
```

### 3. 添加 useEffect 导入

```tsx
// 修复前
import { useState, useRef, useMemo } from "react"

// 修复后
import { useState, useRef, useMemo, useEffect } from "react"
```

---

## 修复后的代码结构

```tsx
export default function WindowTypeDesigner({ 
  onBack, 
  initialWidth = 2400, 
  initialHeight = 1800,
  preselectedType = null
}: WindowTypeDesignerProps) {
  // 1. 状态声明
  const [hasSelectedType, setHasSelectedType] = useState(!!preselectedType)
  const [selectedType, setSelectedType] = useState(preselectedType)
  const [mullions, setMullions] = useState([])
  const [units, setUnits] = useState([])
  // ...
  
  // 2. 核心函数定义（按依赖顺序）
  const recalculateUnits = (currentMullions) => {
    // 重新计算区域
    setUnits(newUnits)
  }
  
  const handleTypeSelect = (type) => {
    // 选择窗型
    recalculateUnits(newMullions)
  }
  
  const addMullion = (type, position) => {
    // 添加梃
    recalculateUnits(newMullions)
  }
  
  // 3. 其他功能函数
  const deleteMullion = (mullionId) => { /* ... */ }
  const handleUnitClick = (unitId, e) => { /* ... */ }
  // ...
  
  // 4. useEffect Hooks
  useEffect(() => {
    // 预选窗型初始化
    if (preselectedType && hasSelectedType && selectedType && mullions.length === 0) {
      // 初始化梃布局
      recalculateUnits(newMullions)
    }
  }, [preselectedType, hasSelectedType, selectedType, canvasWidth, canvasHeight, mullions.length])
  
  // 5. useMemo Hooks（仅用于计算值）
  const filteredWindowTypes = useMemo(() => {
    // 筛选窗型
    return windowTypeOptions.filter(...)
  }, [selectedTags])
  
  // 6. 渲染逻辑
  return (
    <div>...</div>
  )
}
```

---

## 关键改进点

### 1. 函数定义顺序

✅ **被依赖的函数先定义**
```
recalculateUnits  →  被其他函数调用
  ↓
handleTypeSelect  →  调用 recalculateUnits
addMullion        →  调用 recalculateUnits
deleteMullion     →  调用 recalculateUnits
```

### 2. Hook 使用规范

| Hook | 用途 | 示例 |
|------|------|------|
| `useMemo` | 缓存计算结果 | `const filtered = useMemo(() => array.filter(...), [deps])` |
| `useEffect` | 执行副作用 | `useEffect(() => { setState(...) }, [deps])` |
| `useCallback` | 缓存函数引用 | `const handler = useCallback(() => {...}, [deps])` |

### 3. 依赖项优化

```tsx
// 添加 mullions.length 作为依赖
// 确保只在第一次（mullions为空）时初始化
useEffect(() => {
  if (preselectedType && hasSelectedType && selectedType && mullions.length === 0) {
    // 只执行一次初始化
  }
}, [preselectedType, hasSelectedType, selectedType, canvasWidth, canvasHeight, mullions.length])
```

---

## 测试验证

### 测试场景

#### 1. 从步骤2选择窗型进入步骤3
- [ ] 窗型正确加载
- [ ] 梃正确初始化
- [ ] 区域正确划分
- [ ] 无控制台错误

#### 2. 直接进入步骤3（无预选窗型）
- [ ] 显示窗型选择器
- [ ] 选择窗型正常
- [ ] 梃和区域正确初始化

#### 3. 切换窗型
- [ ] 点击"切换窗型"按钮
- [ ] 选择新窗型
- [ ] 梃和区域重新初始化
- [ ] 无错误

#### 4. 手动调整梃
- [ ] 添加梃正常
- [ ] 删除梃正常
- [ ] 区域自动重新计算
- [ ] 无错误

---

## React Hooks 最佳实践

### useMemo vs useEffect

| 特性 | useMemo | useEffect |
|------|---------|-----------|
| **用途** | 缓存计算结果 | 执行副作用 |
| **返回值** | 计算的值 | cleanup 函数（可选） |
| **执行时机** | 渲染期间 | 渲染之后 |
| **是否阻塞渲染** | 是 | 否 |
| **适用场景** | 昂贵的计算、派生数据 | DOM 操作、订阅、API 调用 |

### 示例对比

```tsx
// ✅ useMemo - 计算派生数据
const expensiveResult = useMemo(() => {
  return data.filter(...).map(...).reduce(...)
}, [data])

// ✅ useEffect - 执行副作用
useEffect(() => {
  fetchData()
  return () => cleanup()
}, [id])

// ❌ 错误：在 useMemo 中执行副作用
const result = useMemo(() => {
  setState(newValue)  // ❌ 副作用
  fetchData()         // ❌ 副作用
  return computedValue
}, [deps])

// ❌ 错误：在 useEffect 中返回计算值
useEffect(() => {
  const result = compute()
  return result  // ❌ 应该返回 cleanup 函数
}, [deps])
```

---

## 预防类似问题

### 1. 函数定义顺序原则

```tsx
// 推荐顺序
function Component() {
  // 1. 状态和 refs
  const [state, setState] = useState()
  const ref = useRef()
  
  // 2. 核心函数（按依赖顺序，被依赖的在前）
  const utilityFunction = () => {}      // 工具函数
  const handleAction = () => {          // 业务函数
    utilityFunction()                   // 调用工具函数
  }
  
  // 3. Effect hooks
  useEffect(() => {
    handleAction()
  }, [])
  
  // 4. Memo hooks
  const memoValue = useMemo(() => {}, [])
  
  // 5. Render
  return <div />
}
```

### 2. ESLint 规则

推荐启用以下 ESLint 规则：

```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-use-before-define": "error"
  }
}
```

### 3. TypeScript 严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 总结

### 问题根源
- ❌ 函数在定义前被调用
- ❌ useMemo 被误用于执行副作用

### 解决方案
- ✅ 重新组织函数定义顺序
- ✅ 使用 useEffect 执行副作用
- ✅ 添加必要的依赖项

### 最佳实践
- ✅ 遵循 React Hooks 规则
- ✅ 正确区分 useMemo 和 useEffect
- ✅ 保持代码结构清晰

---

**版本**: v2.5.4  
**Bug修复完成** ✓

