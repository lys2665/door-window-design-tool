# 智能推荐模块设计规范速查表

> 基于Figma设计稿的快速参考指南

## 🎨 颜色速查

```css
/* 主色系 - 橙棕色调 */
--title-color: #bb4d00;        /* 标题、价格 */
--price-symbol: #852d00;       /* ￥符号 */

/* 渐变 */
--bg-gradient: linear-gradient(to bottom, #fffbeb, white);

/* 特征标签渐变 */
--tag-blue: linear-gradient(to left, #2862ff, #66bfff);   /* 蓝色 */
--tag-green: linear-gradient(to left, #50d200, #13a168);  /* 绿色 */
```

## 📏 尺寸速查

```css
/* 容器 */
border-radius: 16px;
padding: 20px;
gap: 19px;

/* 卡片 */
width: 200px;
height: 249px;
border-radius: 8px;
gap: 12px;

/* 图片区域 */
height: 147px;

/* 按钮 */
height: 24px;
border-radius: 20px;

/* 特征标签 */
height: 20px;
border-radius: 0 0 10px 0; /* 右下角圆角 */
```

## 📝 字号速查

```
14px - 标题、系列名称、选择系列
12px - 面积、特征标签、性能参数、价格、按钮文字
20px - ￥符号
30px - 价格数值
```

## 💡 关键类名

```tsx
/* 容器 */
className="rounded-[16px] border border-neutral-200 bg-gradient-to-b from-[#fffbeb] to-white p-5 space-y-[19px]"

/* 卡片 */
className="w-[200px] h-[249px] rounded-[8px] border border-black"

/* 特征标签（蓝色） */
className="bg-gradient-to-l from-[#2862ff] to-[#66bfff] h-[20px] px-[8px] rounded-br-[10px]"

/* 特征标签（绿色） */
className="bg-gradient-to-l from-[#50d200] to-[#13a168] h-[20px] px-[8px] rounded-br-[10px]"

/* 性能徽章 */
className="bg-white/50 px-[4px] h-[20px] rounded-[2px]"

/* 查看详情按钮 */
className="h-[24px] bg-black rounded-[20px] text-white"
```

## 🔄 状态规范

### 价格状态
- **有数据**：`text-[#bb4d00] opacity-100`
- **无数据**：`text-[#bb4d00] opacity-20` + 显示"实时计算"

### 面积状态
- **有数据**：`text-[#bb4d00]` + 显示实际面积
- **无数据**：`text-[#bb4d00] opacity-30` + 显示"待计算"

### 卡片状态
- **默认**：`border-black`
- **选中**：`ring-2 ring-primary ring-offset-2`
- **Hover**：`shadow-lg`

### 按钮状态
- **查看全部**：`opacity-50` → `hover:opacity-100`
- **查看详情**：`opacity-100` → `hover:opacity-80`

## 📐 间距体系

| 元素 | 间距 |
|------|------|
| 容器内子元素 | 19px（纵向） |
| 卡片之间 | 12px（横向） |
| 符号与价格 | 10px |
| 性能徽章 | 4px |
| 信息区域内边距 | 13px |
| 系列名称下边距 | 6px |
| 价格下边距 | 11px |

## 🎯 实现检查清单

- [ ] 容器：16px圆角 + 渐变背景（#fffbeb → white）
- [ ] 标题：14px粗体 #bb4d00
- [ ] 价格：￥20px深棕 + 数值30px橙棕
- [ ] 面积：12px + 透明度状态
- [ ] 卡片：200×249px + 8px圆角 + 黑边框
- [ ] 图片：147px高度
- [ ] 特征标签：左上角渐变 + 右下圆角10px
- [ ] 性能徽章：图片上 + 白色半透明
- [ ] 底部遮罩：40px高 + 渐变 + 模糊2px
- [ ] 查看详情：黑色胶囊 + 24px高 + 20px圆角
- [ ] 右侧遮罩：34px宽 + 白色渐变

## 🚀 快速复制

### 特征标签颜色选择
```tsx
index === 0 
  ? "bg-gradient-to-l from-[#2862ff] to-[#66bfff]"  // 第一个用蓝色
  : "bg-gradient-to-l from-[#50d200] to-[#13a168]"  // 其他用绿色
```

### 性能参数显示
```tsx
<div className="bg-white/50 px-[4px] h-[20px] rounded-[2px]">
  <span className="text-[12px] text-black leading-none">
    抗风{series.windResistance}
  </span>
</div>
```

---

📖 详细文档请参考：[FIGMA_DESIGN_IMPLEMENTATION.md](./FIGMA_DESIGN_IMPLEMENTATION.md)


