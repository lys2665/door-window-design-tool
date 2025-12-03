"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Sparkles,
  Send,
  Home,
  Bot,
  User,
  Loader2,
  ChevronRight,
  CheckCircle2,
  Shield,
  Volume2,
  Baby,
  Wind,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

// 对话流程配置
const conversationFlow = {
  greeting: {
    question: "您好！为了给您更合适的门窗建议，我先确认下——这扇窗户是装在哪个房间呢？",
    type: "room",
    next: "concern",
  },
  concern: {
    question: "明白了。那您对这扇窗，最关心哪些方面的性能？",
    options: ["隔音", "保温", "安全", "外观风格"],
    type: "concern",
    next: "noise_source",
  },
  noise_source: {
    question: (concern: string) => {
      if (concern === "隔音") {
        return "理解！方便问一下，窗外主要是什么噪音源？比如是马路、学校，还是小区内部活动？"
      }
      return "好的，还有其他特别关注的点吗？"
    },
    type: "noise_source",
    next: "recommendation",
  },
  recommendation: {
    type: "recommendation",
    next: "additional_needs",
  },
  additional_needs: {
    question: "除了刚才说的，还有其他特别关注的点吗？比如安全、通风？",
    type: "additional",
    next: "final",
  },
  final: {
    type: "final",
  },
}

// 消息类型
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "recommendation" | "options"
  options?: string[]
  recommendation?: {
    product: string
    series: string
    glass: string
    features: string[]
    soundproof: string
    note: string
  }
}

// 用户信息收集
type UserData = {
  room?: string
  concern?: string
  noiseSource?: string
  additionalNeeds?: string[]
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "您好！为了给您更合适的门窗建议，我先确认下——这扇窗户是装在哪个房间呢？",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStep, setConversationStep] = useState("greeting")
  const [userData, setUserData] = useState<UserData>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI回复延迟模拟
  const addAIMessage = (content: string, type: "text" | "recommendation" | "options" = "text", options?: string[], recommendation?: any) => {
    setIsTyping(true)
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
        type,
        options,
        recommendation,
      }
      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  // 处理用户输入
  const handleSendMessage = (message?: string) => {
    const text = message || inputValue.trim()
    if (!text) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // 根据对话流程处理
    handleConversationFlow(text)
  }

  // 对话流程处理
  const handleConversationFlow = (userInput: string) => {
    const input = userInput.toLowerCase()

    switch (conversationStep) {
      case "greeting":
        // 收集房间信息
        setUserData((prev) => ({ ...prev, room: userInput }))
        setConversationStep("concern")
        addAIMessage(
          "明白了。那您对这扇窗，最关心哪些方面的性能？",
          "options",
          ["隔音", "保温", "安全", "外观风格"]
        )
        break

      case "concern":
        // 收集关注点
        setUserData((prev) => ({ ...prev, concern: userInput }))
        
        if (input.includes("隔音")) {
          setConversationStep("noise_source")
          addAIMessage(
            `理解！${userData.room || "这个房间"}休息确实对安静环境要求高。方便问一下，窗外主要是什么噪音源？比如是马路、学校，还是小区内部活动？`
          )
        } else {
          setConversationStep("additional_needs")
          addAIMessage("好的，明白您的需求了。还有其他特别关注的点吗？比如安全、通风？")
        }
        break

      case "noise_source":
        // 收集噪音源信息
        setUserData((prev) => ({ ...prev, noiseSource: userInput }))
        setConversationStep("recommendation")
        
        // 生成推荐方案
        generateRecommendation(userInput)
        break

      case "recommendation":
        setConversationStep("additional_needs")
        addAIMessage("除了刚才说的，还有其他特别关注的点吗？比如安全、通风？")
        break

      case "additional_needs":
        // 收集额外需求
        const needs = userData.additionalNeeds || []
        setUserData((prev) => ({ ...prev, additionalNeeds: [...needs, userInput] }))
        
        if (input.includes("孩子") || input.includes("小孩") || input.includes("儿童")) {
          addAIMessage(
            "明白，从设计规范来说，我们通常会把可开启扇的执手高度做到 1500mm 以上，这样小朋友够不到。同时，下方建议做成固定玻璃扇，既保证采光，又杜绝攀爬风险。"
          )
          setTimeout(() => {
            addAIMessage("如果您还想更安心一点，还可以加装一个隐藏式儿童安全锁。")
          }, 2500)
          setTimeout(() => {
            setConversationStep("final")
            addAIMessage("您看这样的方案方向是否符合您的预期？我可以再帮您出一份详细的配置清单和效果图参考。")
          }, 4500)
        } else {
          setConversationStep("final")
          addAIMessage("您看这样的方案方向是否符合您的预期？我可以再帮您出一份详细的配置清单和效果图参考。")
        }
        break

      case "final":
        addAIMessage("好的！我会为您生成一份完整的门窗方案，包括产品配置、价格明细和3D效果图。请稍等片刻...")
        setTimeout(() => {
          addAIMessage("✅ 方案已生成！您可以点击右上角「查看完整方案」按钮查看详情，或继续与我沟通调整方案。")
        }, 2000)
        break

      default:
        addAIMessage("感谢您的反馈！还有什么需要我帮助的吗？")
    }
  }

  // 生成推荐方案
  const generateRecommendation = (noiseSource: string) => {
    const input = noiseSource.toLowerCase()
    let recommendation = {
      product: "浩瀚86系列断桥铝系统窗",
      series: "高端隔音系列",
      glass: "6mm+15A+6mm+0.76PVB夹胶+5mm 不等厚中空夹胶玻璃",
      features: ["专门针对低频噪音优化", "实测隔声性能≥40dB", "断桥铝型材", "多腔密封结构"],
      soundproof: "40dB以上",
      note: "不过也得跟您说明一下：整体隔音会跟墙体、安装等现实其他客观情况都有关系，所以这只是参考数值。",
    }

    if (input.includes("马路") || input.includes("主干道") || input.includes("大货车")) {
      addAIMessage(
        "根据声学数据，大货车通行时噪音大概在70分贝左右，而卧室夜间理想的安静环境要控制在30分贝以内。"
      )
      setTimeout(() => {
        addAIMessage(
          `结合您的需求和常见有效方案，我建议采用 **${recommendation.product}**，搭配 **"${recommendation.glass}"** 的配置。这种配置专门针对低频噪音优化，实测隔声性能可达${recommendation.soundproof}，能显著改善夜间睡眠环境。`,
          "recommendation",
          undefined,
          recommendation
        )
      }, 2500)
      setTimeout(() => {
        addAIMessage(recommendation.note)
      }, 4500)
    } else {
      setTimeout(() => {
        addAIMessage(
          `根据您描述的环境，我建议采用 **${recommendation.product}**，搭配专业的隔音玻璃配置。`,
          "recommendation",
          undefined,
          recommendation
        )
      }, 1500)
    }
  }

  // 快捷选项点击
  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  return (
    <div className="flex h-screen bg-background dark:bg-[#2a2a2a] overflow-hidden">
      {/* 主内容区 */}
      <main className="w-full flex flex-col">
        {/* 顶部导航栏 */}
        <header className="h-14 md:h-16 border-b border-border dark:border-white/10 bg-card dark:bg-[#1f1f1f] flex-shrink-0 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
                <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold text-foreground dark:text-white">
                  AI 智能封窗顾问
                </h1>
                <p className="text-xs text-muted-foreground dark:text-white/50">
                  专业 · 高效 · 智能
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">查看完整方案</span>
            </Button>
          </div>
        </header>

        {/* 对话区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 md:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                  )}
                  
                  <div className={`flex-1 max-w-[85%] md:max-w-[75%] ${message.role === "user" ? "flex justify-end" : ""}`}>
                    {message.type === "recommendation" && message.recommendation ? (
                      // 推荐方案卡片
                      <Card className="p-4 md:p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground dark:text-white mb-1">
                              {message.recommendation.product}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {message.recommendation.series}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-foreground/90 dark:text-white/90">
                          <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5">
                            <div className="font-medium mb-1 flex items-center gap-2">
                              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              玻璃配置
                            </div>
                            <p className="text-xs">{message.recommendation.glass}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {message.recommendation.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ) : message.type === "options" && message.options ? (
                      // 快捷选项
                      <div className="space-y-3">
                        <div className="px-4 py-3 rounded-2xl bg-muted/80 dark:bg-white/5 text-foreground dark:text-white text-sm md:text-base">
                          {message.content}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.options.map((option, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptionClick(option)}
                              className="gap-2 border-2 hover:border-primary hover:bg-primary/5"
                            >
                              {option === "隔音" && <Volume2 className="w-4 h-4" />}
                              {option === "保温" && <Wind className="w-4 h-4" />}
                              {option === "安全" && <Shield className="w-4 h-4" />}
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // 普通文本消息
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm md:text-base ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "bg-muted/80 dark:bg-white/5 text-foreground dark:text-white"
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                    
                    <div
                      className={`text-xs text-muted-foreground dark:text-white/40 mt-1.5 ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                      )}
                        </div>
              ))}
              
              {/* AI正在输入 */}
              {isTyping && (
                <div className="flex gap-3 md:gap-4 justify-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                  <div className="px-4 py-3 rounded-2xl bg-muted/80 dark:bg-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                          </div>
                        </div>
              )}
              
              <div ref={messagesEndRef} />
                          </div>
                        </div>

          {/* 输入区域 */}
          <div className="border-t border-border dark:border-white/10 bg-card dark:bg-[#1f1f1f] px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 md:gap-3">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="输入您的需求或问题..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 h-11 md:h-12 text-base"
                  disabled={isTyping}
                />
                <Button
                  size="lg"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-11 md:h-12 px-4 md:px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline ml-2">发送</span>
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground dark:text-white/40 mt-2 text-center">
                💡 AI顾问会根据您的回答，为您推荐最合适的门窗方案
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
