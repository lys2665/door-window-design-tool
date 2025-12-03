import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Settings,
  Box,
  Sparkles,
  ChevronRight,
  Maximize2,
  PenTool,
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Camera,
  FileText,
  Download,
  Save,
  Share2,
  Layers,
  Palette,
  MessageSquare,
  FileBarChart,
  Move,
  ShieldCheck,
  Pen,
  Eraser,
  MousePointer2,
  Undo2,
} from "lucide-react";

/**
 * AIChatInterface.jsx
 * - 已移除错误的 tailwind.config 赋值
 * - 修复拖拽/缩放、文件上传、消息竞态、定时器清理等问题
 *
 * Props:
 * - onBack: () => void
 */
// --- AI Chat Interface ---
const AIChatInterface = ({ onBack }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 方案状态
  const [planType, setPlanType] = useState("default"); // 'default', 'soundproof'
  const [safetyFeature, setSafetyFeature] = useState(false); // 是否启用了安全配置
  const [isTyping, setIsTyping] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [panelTab, setPanelTab] = useState("chat");

  // 步骤状态机: 0=初始, 1=问房间, 2=问需求, 3=问噪音源, 4=问其他, 5=确认
  const [chatStep, setChatStep] = useState(0);

  // 视图状态
  const [viewState, setViewState] = useState({ scale: 0.85, x: 260, y: 0 });

  // 标注工具状态
  const [activeTool, setActiveTool] = useState("cursor"); // 'cursor', 'pen', 'eraser'
  const [isDrawing, setIsDrawing] = useState(false);
  const drawCanvasRef = useRef(null);

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (panelTab === "chat") {
      scrollToBottom();
    }
  }, [messages, isTyping, hasStarted, panelTab]);

  // 初始化或更新画布尺寸
  useEffect(() => {
    if (hasStarted && drawCanvasRef.current) {
      drawCanvasRef.current.width = 3000;
      drawCanvasRef.current.height = 2000;
    }
  }, [hasStarted]);

  // --- 交互逻辑 (合并了视图拖拽与绘图) ---
  const handleWheel = (e) => {
    const scaleSpeed = 0.001;
    const newScale = Math.min(
      Math.max(viewState.scale - e.deltaY * scaleSpeed, 0.5),
      3
    );
    setViewState((prev) => ({ ...prev, scale: newScale }));
  };

  const handleMouseDown = (e) => {
    if (activeTool === "cursor") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewState.x, y: e.clientY - viewState.y });
    } else if (activeTool === "pen" || activeTool === "eraser") {
      setIsDrawing(true);
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (activeTool === "pen") {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 4;
        ctx.globalCompositeOperation = "source-over";
      } else {
        ctx.lineWidth = 20;
        ctx.globalCompositeOperation = "destination-out";
      }
    }
  };

  const handleMouseMove = (e) => {
    if (activeTool === "cursor") {
      if (!isDragging) return;
      setViewState((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    } else {
      if (!isDrawing) return;
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- 业务逻辑 ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBgImage(imageUrl);

      // 图片上传后，AI直接发起第一轮提问
      setHasStarted(true);
      setChatStep(1);
      setMessages([
        {
          id: Date.now(),
          role: "ai",
          content:
            "您好！为了给您更合适的门窗建议，我先确认下——这扇窗户是装在哪个房间呢？",
        },
      ]);
    }
  };

  const getQuickReplies = () => {
    switch (chatStep) {
      case 1:
        return ["主卧", "次卧", "阳台", "客厅"];
      case 2:
        return ["主要是隔音", "保温节能", "安全防护", "外观颜值"];
      case 3:
        return [
          "临主干道，有大货车",
          "小区内部，比较安静",
          "靠近学校/广场",
          "临近高架桥",
        ];
      case 4:
        return [
          "有个两岁孩子，担心安全",
          "希望通风好",
          "防蚊虫",
          "没有其他特别需求",
        ];
      case 5:
        return ["可以的", "还需要调整预算"];
      default:
        return [];
    }
  };

  // 智能分析对话意图并生成回复
  const generateAIResponse = (step, userText) => {
    const txt = userText.toLowerCase();
    let response = "";
    let nextStep = step;
    let features = {};

    // 意图识别
    const isBedroom = txt.includes("卧") || txt.includes("睡");
    const isLiving = txt.includes("厅") || txt.includes("阳台");
    const isNoise =
      txt.includes("吵") || txt.includes("隔音") || txt.includes("声音");
    const isTraffic =
      txt.includes("车") ||
      txt.includes("路") ||
      txt.includes("货") ||
      txt.includes("鸣笛");
    const isSafety =
      txt.includes("安全") ||
      txt.includes("孩子") ||
      txt.includes("爬") ||
      txt.includes("猫");
    const isCold =
      txt.includes("冷") || txt.includes("风") || txt.includes("保温");

    switch (step) {
      case 0: // 初始引导
        response =
          "您好！为了给您更合适的门窗建议，我先确认下——这扇窗户是装在哪个房间呢？";
        nextStep = 1;
        break;

      case 1: // 确认房间 -> 问需求
        if (isBedroom) {
          response =
            "明白了。卧室是休息的地方，舒适度最重要。那您对这扇窗，最关心哪些方面的性能？比如**隔音**（睡个好觉）、**保温**，还是**安全**？";
        } else if (isLiving) {
          response =
            "好的，客厅/阳台通常需要更好的采光和视野。那您对这扇窗有什么特别的性能要求吗？比如**隔热**、**防风**或者**隔音**？";
        } else {
          response =
            "收到。那您对这扇窗，最关心哪些方面的性能？比如隔音、保温、安全，还是外观风格？";
        }
        nextStep = 2;
        break;

      case 2: // 确认需求 -> 问环境
        if (isNoise) {
          response =
            "理解！这确实很影响生活质量。方便问一下，窗外主要是什么噪音源？比如是马路主干道、学校、还是小区内部的活动噪音？";
          nextStep = 3;
        } else if (isSafety) {
          response =
            "安全确实是重中之重。请问家里主要是担心小朋友攀爬，还是防盗需求呢？窗户大概在几楼？";
          features.safety = true;
          nextStep = 4; // 跳过噪音询问，直接去安全细节
        } else if (isCold) {
          response =
            "明白，保温性能对冬暖夏凉很重要。请问您家大概在几楼？平时风大吗？";
          nextStep = 3; // 借用 Step 3 问环境
        } else {
          response =
            "收到。那方便简单描述一下窗外的环境吗？比如是否临街，或者楼层高低？这有助于我判断玻璃的配置。";
          nextStep = 3;
        }
        break;

      case 3: // 确认环境 -> 给出方案 -> 问补充
        if (isTraffic || txt.includes("街") || txt.includes("高架")) {
          response =
            "根据声学数据，临街主干道/大货车通行时噪音大概在 70-75 分贝左右，而卧室夜间理想环境需控制在 30 分贝以内。\n\n结合您的需求，我强烈建议采用 **浩瀚86系列断桥铝系统窗**，搭配 **“6mm+15A+6mm+0.76PVB夹胶+5mm”** 的不等厚中空夹胶玻璃组合。这种配置专门针对交通低频噪音优化，实测隔声性能可达 40dB 以上，能显著改善睡眠。\n\n（注：整体隔音效果也受墙体等因素影响，此为参考方案）\n\n除了隔音，您还有其他特别关注的点吗？比如**安全**、**通风**？";
          features.planType = "soundproof";
        } else {
          response =
            "了解了环境情况。针对这种环境，我为您匹配了兼顾**隔音与采光**的标准断桥铝方案，性价比很高。\n\n除了这个核心需求，您对**防蚊**、**儿童安全**等方面还有要求吗？";
        }
        nextStep = 4;
        break;

      case 4: // 确认补充需求 -> 完善方案 -> 确认
        if (isSafety) {
          response =
            "明白，从设计规范来说，我们通常会把可开启扇的执手高度做到 **1500mm 以上**，这样小朋友够不到。同时，下方建议做成 **固定玻璃扇**，既保证采光，又杜绝攀爬风险。\n\n如果您还想更安心一点，还可以加装一个**隐藏式儿童安全锁**。\n\n您看这样的方案方向是否符合您的预期？我可以再帮您出一份详细的配置清单和效果图参考。";
          features.safety = true;
        } else {
          response =
            "好的，那我们就暂定这个方案方向。\n\n您看目前的配置是否符合您的预期？如果没问题，我可以为您生成详细的配置清单和效果图参考。";
        }
        nextStep = 5;
        break;

      case 5: // 最终确认
        response =
          "好的！正在为您生成详细配置清单... \n(已更新右侧方案详情面板，您可以点击查看详细预算)";
        nextStep = 6;
        break;

      default:
        response =
          "您好，有什么我可以帮您的吗？您可以随时告诉我您对门窗的新想法。";
    }

    return { response, nextStep, features };
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    let currentStep = chatStep;

    // 处理从 Landing 页首次进入的情况
    if (!hasStarted) {
      setHasStarted(true);
      setMessages([{ id: Date.now(), role: "user", content: text }]);
      // 如果用户文字开场，强制从 Step 0 引导语开始逻辑，或者智能跳过
      // 这里简化逻辑：用户发了第一句，AI 回复 Step 0 的引导语
      currentStep = 0;
    } else {
      const newMsg = { id: Date.now(), role: "user", content: text };
      setMessages((prev) => [...prev, newMsg]);
    }

    setInputValue("");
    setIsTyping(true);

    // 模拟思考延迟
    setTimeout(() => {
      const aiResult = generateAIResponse(currentStep, text);

      setChatStep(aiResult.nextStep);
      if (aiResult.features.planType) setPlanType(aiResult.features.planType);
      if (aiResult.features.safety) setSafetyFeature(true);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: aiResult.response },
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); // 随机延迟 1.0~1.5s
  };

  if (!hasStarted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0F172A] relative overflow-hidden h-full w-full">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-20">
          <button
            onClick={onBack}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center text-center">
          <div className="mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-200 text-sm font-medium mb-6">
              <Sparkles size={14} className="text-purple-400" /> AI 空间计算引擎
              Ready
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-tight">
              定义您的视界
            </h1>
            <p className="text-slate-400 text-xl font-light">
              上传照片或描述需求，一键生成全景设计方案
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-40 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-1 flex flex-col items-center justify-center overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-blue-900/50"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-blue-600 text-white transition-colors">
                  <Camera size={24} />
                </div>
                <span className="text-white font-bold text-lg">
                  上传实景照片
                </span>
                <span className="text-blue-100 text-xs mt-1">
                  支持 JPG / PNG / PDF
                </span>
              </div>
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/50 transition-colors"></div>
            </button>
            <div className="relative h-40 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 p-6 text-left hover:bg-slate-800/80 transition-all group">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="或者直接告诉我：\n我要封阳台..."
                className="w-full h-full bg-transparent border-none outline-none text-slate-300 resize-none placeholder:text-slate-500 text-lg"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className={`absolute bottom-4 right-4 p-2 rounded-lg transition-all ${
                  inputValue.trim()
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-500"
                }`}
              >
                <ArrowLeft size={20} className="rotate-180" />
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileUpload}
          />
          <div className="flex gap-6 text-slate-500">
            <button className="flex items-center gap-2 hover:text-slate-300 transition-colors">
              <PenTool size={16} /> AR 测量
            </button>
            <button className="flex items-center gap-2 hover:text-slate-300 transition-colors">
              <FileText size={16} /> 导入 CAD
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canvasBg =
    bgImage ||
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 select-none">
      {/* Infinite Canvas */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          cursor:
            activeTool === "cursor"
              ? "move"
              : activeTool === "pen"
              ? "crosshair"
              : "cell",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-75 origin-center will-change-transform relative"
          style={{
            transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
          }}
        >
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${canvasBg})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {planType === "soundproof" && (
              <div className="absolute inset-0 bg-blue-900/10 backdrop-contrast-125 pointer-events-none transition-all duration-1000"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
          </div>

          {/* Drawing Layer - Overlay on top of the transformed content */}
          <canvas
            ref={drawCanvasRef}
            className="absolute inset-0 z-10 w-full h-full"
            style={{ pointerEvents: activeTool === "cursor" ? "none" : "auto" }}
          />
        </div>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/10 pointer-events-none">
        {Math.round(viewState.scale * 100)}%
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-medium">
              AI 实时渲染中
            </span>
          </div>
        </div>
        <div className="pointer-events-auto flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg text-white text-sm hover:bg-white/20 border border-white/10 transition-all">
            <Share2 size={16} /> 分享
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg text-white text-sm hover:bg-white/20 border border-white/10 transition-all">
            <Download size={16} /> 导出 PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 backdrop-blur-md rounded-lg text-white text-sm hover:bg-blue-600 border border-blue-500/50 transition-all shadow-lg shadow-blue-900/50">
            <Save size={16} /> 保存方案
          </button>
        </div>
      </div>

      {/* Right Toolbar (New Annotation Tools) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-xl">
          <button
            onClick={() => setActiveTool("cursor")}
            className={`p-3 rounded-xl transition-all ${
              activeTool === "cursor"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-white/10"
            }`}
            title="移动视图"
          >
            <MousePointer2 size={20} />
          </button>
          <button
            onClick={() => setActiveTool("pen")}
            className={`p-3 rounded-xl transition-all ${
              activeTool === "pen"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-white/10"
            }`}
            title="标记画笔"
          >
            <Pen size={20} />
          </button>
          <button
            onClick={() => setActiveTool("eraser")}
            className={`p-3 rounded-xl transition-all ${
              activeTool === "eraser"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-white/10"
            }`}
            title="橡皮擦"
          >
            <Eraser size={20} />
          </button>
          <div className="w-full h-px bg-white/10 my-1"></div>
          <button
            onClick={clearCanvas}
            className="p-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            title="清空标记"
          >
            <Undo2 size={20} />
          </button>
        </div>
      </div>

      {/* Left Unified Panel */}
      <div className="absolute left-6 top-24 bottom-6 w-[380px] z-10 flex flex-col pointer-events-none">
        <div className="flex-1 flex flex-col bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
          <div className="p-2 flex gap-1 border-b border-white/5 bg-white/5">
            <button
              onClick={() => setPanelTab("chat")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                panelTab === "chat"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MessageSquare size={16} /> 设计对话
            </button>
            <button
              onClick={() => setPanelTab("quote")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                panelTab === "quote"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileBarChart size={16} /> 方案详情
              {(planType === "soundproof" || safetyFeature) &&
                panelTab !== "quote" && (
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-1 animate-pulse"></span>
                )}
            </button>
          </div>

          {panelTab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[90%] backdrop-blur-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-blue-600/90 text-white rounded-tr-none"
                          : "bg-white/10 text-slate-200 border border-white/5 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-black/20 border-t border-white/5">
                {/* Dynamic Quick Replies: Always visible if available */}
                {getQuickReplies().length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                    {getQuickReplies().map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(tag)}
                        className="whitespace-nowrap truncate px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-white/30 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage(inputValue)
                    }
                    placeholder="输入您的回复..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-black/50 transition-all outline-none text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    className="absolute right-1 top-0.5 p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {panelTab === "quote" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Palette size={14} className="text-blue-400" /> 风格微调
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {["极简白", "氟碳灰", "香槟金", "哑黑"].map((color, idx) => (
                    <div
                      key={color}
                      className={`cursor-pointer rounded-lg p-2 text-center border transition-all ${
                        idx === 1
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-full h-6 rounded mb-1 ${
                          idx === 0
                            ? "bg-slate-200"
                            : idx === 1
                            ? "bg-slate-600"
                            : idx === 2
                            ? "bg-amber-200"
                            : "bg-black"
                        }`}
                      ></div>
                      <span className="text-[10px] text-slate-300">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white">方案报价单</h3>
                  <div className="flex gap-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        planType === "soundproof"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {planType === "soundproof" ? "隔音加强版" : "标准版"}
                    </div>
                    {safetyFeature && (
                      <div className="px-2 py-1 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        儿童安全
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <SpecRow
                    label="型材"
                    value={
                      planType === "soundproof"
                        ? "浩瀚86系列 断桥"
                        : "70系列 断桥铝"
                    }
                    icon={<Layers size={14} />}
                  />
                  <SpecRow
                    label="玻璃"
                    value={
                      planType === "soundproof"
                        ? "6+15A+6+PVB+5"
                        : "5+20A+5 中空钢化"
                    }
                    icon={<Box size={14} />}
                    highlight
                  />
                  <SpecRow
                    label="五金"
                    value="德国 HOPPE + 安全锁"
                    icon={<Settings size={14} />}
                  />
                  {safetyFeature && (
                    <SpecRow
                      label="防护"
                      value="执手1.5m + 固定下扇"
                      icon={<ShieldCheck size={14} />}
                      highlight
                    />
                  )}
                  <SpecRow
                    label="面积"
                    value="12.5 平方米"
                    icon={<Maximize2 size={14} />}
                  />
                </div>
                <div className="mt-2 bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>基础造价</span>
                    <span>
                      ¥{planType === "soundproof" ? "18,360" : "10,560"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 mb-4 border-b border-white/10 pb-2">
                    <span>五金/辅料</span>
                    <span>¥{safetyFeature ? "2,120" : "1,520"}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-white font-medium">预估总价</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      ¥
                      {planType === "soundproof"
                        ? safetyFeature
                          ? "20,480"
                          : "19,880"
                        : "12,080"}
                    </span>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">
                  确认方案并下单
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 子组件 ---
const SpecRow = ({ label, value, icon, highlight }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3 text-slate-400 text-sm">
      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      {label}
    </div>
    <div
      className={`text-sm font-medium ${
        highlight ? "text-blue-300" : "text-slate-200"
      }`}
    >
      {value}
    </div>
  </div>
);

export default AIChatInterface;
