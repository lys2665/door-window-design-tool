"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  ChevronRight,
  Check,
  Mic,
  Camera,
  Upload,
  Wind,
  Droplets,
  Shield,
  Volume2,
  Thermometer,
  Eye,
  FileText,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const steps = [
  { id: 1, title: "基本信息", description: "房屋情况与测量" },
  { id: 2, title: "性能与风格", description: "需求与预算" },
]

export default function AIPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    houseType: "",
    area: "",
    floor: "",
    totalFloors: "",
    measurements: "",
    specialIssues: "",
    photos: [] as string[],
    noiseLevel: "",
    windPressure: "",
    environment: [] as string[],
    soundInsulation: false,
    thermalInsulation: false,
    windResistance: false,
    waterproof: false,
    security: false,
    style: "",
    budget: [50000],
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateEstimatedPrice = () => {
    let basePrice = 15000
    if (formData.soundInsulation) basePrice += 8000
    if (formData.thermalInsulation) basePrice += 6000
    if (formData.windResistance) basePrice += 7000
    if (formData.waterproof) basePrice += 5000
    if (formData.security) basePrice += 4000

    const area = Number.parseFloat(formData.area) || 0
    const pricePerSqm = basePrice / 100
    return Math.round(area * pricePerSqm)
  }

  const getRecommendedProduct = () => {
    if (formData.windResistance && formData.soundInsulation) {
      return {
        name: "铝合金断桥推拉窗系统",
        series: "高端系列",
        features: ["9级抗风压", "40dB隔音", "1.8mm型材壁厚"],
      }
    } else if (formData.thermalInsulation) {
      return {
        name: "节能保温平开窗系统",
        series: "节能系列",
        features: ["K值≤2.0", "三玻两腔", "1.6mm型材壁厚"],
      }
    }
    return {
      name: "标准铝合金窗系统",
      series: "经济系列",
      features: ["6级抗风压", "30dB隔音", "1.4mm型材壁厚"],
    }
  }

  const estimatedPrice = calculateEstimatedPrice()
  const recommendedProduct = getRecommendedProduct()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <main className="w-full flex flex-col">
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header with Steps */}
          <div className="border-b bg-card px-4 py-2.5 shrink-0 relative">
            <div className="flex items-center justify-between">
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-sm md:text-base font-semibold text-foreground">AI 封窗建议</h1>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {steps[currentStep - 1]?.title}
                  </p>
                </div>
              </div>
              
              {/* Center: Progress Steps */}
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
                      title={step.title}
                    >
                      {currentStep > step.id ? <Check className="h-4 w-4" /> : `0${index + 1}`}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-[2px] mx-1 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Right: Navigation Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-1.5 h-8"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                  <span className="hidden sm:inline text-xs">上一步</span>
                </Button>
                <Button
                  size="sm"
                  onClick={currentStep < steps.length ? nextStep : undefined}
                  className="gap-1.5 h-8"
                >
                  <span className="hidden sm:inline text-xs">
                    {currentStep < steps.length ? "下一步" : "生成方案"}
                  </span>
                  {currentStep < steps.length ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 max-w-6xl mx-auto h-full">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5 h-full">
                {/* Left Column - Form */}
                <div className="lg:col-span-3 min-h-0">
                  <Card className="p-5 md:p-6 h-full overflow-auto">
                    {/* Step 1 */}
                    {currentStep === 1 && (
                      <div className="space-y-5">
                        {/* House Type */}
                        <div>
                          <Label className="text-sm font-medium mb-2.5 block">房屋类型</Label>
                          <RadioGroup value={formData.houseType} onValueChange={(value) => updateFormData("houseType", value)}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                              {["公寓", "别墅", "办公楼", "商业"].map((type, idx) => (
                                <div
                                  key={type}
                                  className={`flex items-center justify-center border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                                    formData.houseType === ["apartment", "villa", "office", "commercial"][idx]
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50 hover:bg-accent"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={["apartment", "villa", "office", "commercial"][idx]}
                                    id={type}
                                    className="sr-only"
                                  />
                                  <Label htmlFor={type} className="cursor-pointer text-sm font-medium">{type}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>

                        {/* House Details */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                          <div>
                            <Label htmlFor="area" className="text-sm font-medium mb-2 block">面积（㎡）</Label>
                            <Input
                              id="area"
                              type="number"
                              placeholder="120"
                              value={formData.area}
                              onChange={(e) => updateFormData("area", e.target.value)}
                              className="h-11 md:h-12 text-base"
                            />
                          </div>
                          <div>
                            <Label htmlFor="floor" className="text-sm font-medium mb-2 block">所在楼层</Label>
                            <Input
                              id="floor"
                              type="number"
                              placeholder="15"
                              value={formData.floor}
                              onChange={(e) => updateFormData("floor", e.target.value)}
                              className="h-11 md:h-12 text-base"
                            />
                          </div>
                          <div>
                            <Label htmlFor="totalFloors" className="text-sm font-medium mb-2 block">总楼层</Label>
                            <Input
                              id="totalFloors"
                              type="number"
                              placeholder="30"
                              value={formData.totalFloors}
                              onChange={(e) => updateFormData("totalFloors", e.target.value)}
                              className="h-11 md:h-12 text-base"
                            />
                          </div>
                        </div>

                        {/* Measurements */}
                        <div>
                          <Label htmlFor="measurements" className="text-sm font-medium mb-2 block">窗户尺寸（宽×高，mm）</Label>
                          <Textarea
                            id="measurements"
                            placeholder="客厅：1800×1500&#10;卧室：1200×1400"
                            value={formData.measurements}
                            onChange={(e) => updateFormData("measurements", e.target.value)}
                            className="min-h-24 md:min-h-28 text-base resize-none"
                          />
                        </div>

                        {/* Special Issues */}
                        <div>
                          <Label htmlFor="specialIssues" className="text-sm font-medium mb-2 block">特殊问题（选填）</Label>
                          <Textarea
                            id="specialIssues"
                            placeholder="墙体不平整、洞口尺寸不规则等"
                            value={formData.specialIssues}
                            onChange={(e) => updateFormData("specialIssues", e.target.value)}
                            className="min-h-20 md:min-h-24 text-base resize-none"
                          />
                        </div>

                        {/* Photo Upload */}
                        <div className="border-2 border-dashed rounded-xl p-5 bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Camera className="h-5 w-5 text-primary" />
                            <h3 className="text-sm font-medium text-foreground">现场照片</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">上传窗户位置、墙体情况等照片，帮助更准确分析</p>
                          <Button variant="outline" size="default" className="w-full gap-2 h-11 bg-white">
                            <Upload className="h-4 w-4" />
                            选择照片或拍照
                          </Button>
                        </div>

                        {/* Environment Analysis */}
                        <div className="space-y-4 pt-2">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            环境分析
                          </h3>

                          {/* Noise Detection */}
                          <div className="border-2 rounded-xl p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-3">
                              <Mic className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <h4 className="text-sm font-medium text-foreground">噪音检测（选填）</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <Button size="default" className="h-11 text-sm bg-blue-600 hover:bg-blue-700">
                                <Mic className="h-4 w-4 mr-2" />
                                启动检测
                              </Button>
                              <Input
                                placeholder="或输入分贝值"
                                value={formData.noiseLevel}
                                onChange={(e) => updateFormData("noiseLevel", e.target.value)}
                                className="h-11 text-base"
                              />
                            </div>
                          </div>

                          {/* Environment Factors */}
                          <div>
                            <Label className="text-sm font-medium mb-2.5 block">周边环境（可多选）</Label>
                            <div className="grid grid-cols-2 gap-2.5">
                              {[
                                { id: "street", label: "临街噪音" },
                                { id: "highrise", label: "高层风压" },
                                { id: "coastal", label: "沿海盐雾" },
                                { id: "industrial", label: "工业污染" },
                              ].map((env) => (
                                <div
                                  key={env.id}
                                  onClick={() => {
                                    if (formData.environment.includes(env.id)) {
                                      updateFormData("environment", formData.environment.filter((e) => e !== env.id))
                                    } else {
                                      updateFormData("environment", [...formData.environment, env.id])
                                    }
                                  }}
                                  className={`flex items-center justify-center gap-2 border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                                    formData.environment.includes(env.id)
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50 hover:bg-accent"
                                  }`}
                                >
                                  <Checkbox
                                    id={env.id}
                                    checked={formData.environment.includes(env.id)}
                                    className="pointer-events-none"
                                  />
                                  <Label htmlFor={env.id} className="cursor-pointer text-sm font-medium">
                                    {env.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Wind Pressure */}
                          <div>
                            <Label className="text-sm font-medium mb-2.5 block">风压等级</Label>
                            <RadioGroup value={formData.windPressure} onValueChange={(value) => updateFormData("windPressure", value)}>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                {["低层", "中层", "高层", "超高层"].map((level, idx) => (
                                  <div
                                    key={level}
                                    className={`flex items-center justify-center border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                                      formData.windPressure === ["low", "medium", "high", "super"][idx]
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50 hover:bg-accent"
                                    }`}
                                  >
                                    <RadioGroupItem 
                                      value={["low", "medium", "high", "super"][idx]} 
                                      id={level}
                                      className="sr-only"
                                    />
                                    <Label htmlFor={level} className="cursor-pointer text-sm font-medium">
                                      {level}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                      <div className="space-y-5">
                        {/* Performance Requirements */}
                        <div>
                          <Label className="text-sm font-medium mb-2.5 block">性能要求（可多选）</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {[
                              { id: "soundInsulation", icon: Volume2, label: "隔音性能", desc: "降低外界噪音" },
                              { id: "thermalInsulation", icon: Thermometer, label: "保温隔热", desc: "冬暖夏凉节能" },
                              { id: "windResistance", icon: Wind, label: "抗风压", desc: "适合高层建筑" },
                              { id: "waterproof", icon: Droplets, label: "水密性", desc: "防止雨水渗透" },
                              { id: "security", icon: Shield, label: "安全防护", desc: "防盗防坠落" },
                            ].map((perf) => (
                              <div
                                key={perf.id}
                                onClick={() => updateFormData(perf.id, !formData[perf.id as keyof typeof formData])}
                                className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                  formData[perf.id as keyof typeof formData]
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                }`}
                              >
                                <Checkbox
                                  id={perf.id}
                                  checked={formData[perf.id as keyof typeof formData] as boolean}
                                  onCheckedChange={(checked) => updateFormData(perf.id, checked)}
                                  className="pointer-events-none"
                                />
                                <perf.icon className="h-5 w-5 text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <Label htmlFor={perf.id} className="text-sm font-medium cursor-pointer">
                                    {perf.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">{perf.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Style Preference */}
                        <div>
                          <Label className="text-sm font-medium mb-2.5 block">装修风格</Label>
                          <RadioGroup value={formData.style} onValueChange={(value) => updateFormData("style", value)}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                              {["现代简约", "新中式", "欧式", "工业风", "北欧", "其他"].map((style, idx) => (
                                <div
                                  key={style}
                                  className={`flex items-center justify-center border-2 rounded-xl p-3.5 cursor-pointer transition-all ${
                                    formData.style === ["modern", "chinese", "european", "industrial", "nordic", "other"][idx]
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50 hover:bg-accent"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={["modern", "chinese", "european", "industrial", "nordic", "other"][idx]}
                                    id={style}
                                    className="sr-only"
                                  />
                                  <Label htmlFor={style} className="cursor-pointer text-sm font-medium">
                                    {style}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Budget Range */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">预算范围</Label>
                          <div className="space-y-4">
                            <Slider
                              value={formData.budget}
                              onValueChange={(value) => updateFormData("budget", value)}
                              max={200000}
                              min={10000}
                              step={5000}
                              className="w-full py-2"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">¥1万</span>
                              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                                <span className="text-lg font-bold text-primary">
                                  ¥{(formData.budget[0] / 10000).toFixed(1)}万
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">¥20万</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-2 space-y-3 md:space-y-4 min-h-0">
                  {/* Quotation Card */}
                  <Card className="p-4 md:p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-sm font-semibold text-foreground">预估报价</h3>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ¥{estimatedPrice.toLocaleString()}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">基于当前选择的性能要求和房屋面积</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-white/50">
                        <span className="text-[10px] text-muted-foreground">基础费用</span>
                        <span className="text-sm font-semibold">¥15,000</span>
                      </div>
                      {formData.soundInsulation && (
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-blue-50">
                          <span className="text-[10px] text-muted-foreground">隔音升级</span>
                          <span className="text-sm font-semibold text-blue-600">+¥8,000</span>
                        </div>
                      )}
                      {formData.thermalInsulation && (
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-blue-50">
                          <span className="text-[10px] text-muted-foreground">保温升级</span>
                          <span className="text-sm font-semibold text-blue-600">+¥6,000</span>
                        </div>
                      )}
                      {formData.windResistance && (
                        <div className="flex flex-col gap-1 p-2 rounded-lg bg-blue-50">
                          <span className="text-[10px] text-muted-foreground">抗风压升级</span>
                          <span className="text-sm font-semibold text-blue-600">+¥7,000</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Solution Preview */}
                  {currentStep === 2 && (
                    <Card className="p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">推荐方案</h3>
                      </div>

                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl mb-3 overflow-hidden">
                        <img
                          src="/modern-aluminum-sliding-window.jpg"
                          alt="推荐产品"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-foreground">{recommendedProduct.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {recommendedProduct.series}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendedProduct.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">壁厚</div>
                            <div className="text-sm font-semibold">
                              {recommendedProduct.features.find((f) => f.includes("mm"))?.split(" ")[0] || "1.4mm"}
                            </div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">抗风压</div>
                            <div className="text-sm font-semibold">
                              {recommendedProduct.features.find((f) => f.includes("级"))?.split("抗")[0] || "6级"}
                            </div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground mb-1">隔音</div>
                            <div className="text-sm font-semibold">
                              {recommendedProduct.features.find((f) => f.includes("dB")) || "30dB"}
                            </div>
                          </div>
                        </div>

                        <Button size="default" className="w-full mt-2 gap-2 h-10">
                          <Eye className="h-4 w-4" />
                          查看详细方案
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* Tips Card */}
                  <Card className="p-3 md:p-4 bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <span className="text-base shrink-0">💡</span>
                      <div>
                        <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">温馨提示</h4>
                        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                          {currentStep === 1
                            ? "准确的测量数据和现场照片能帮助我们提供更精确的方案建议"
                            : "选择更多性能要求会提高造价，但能获得更好的使用体验"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
