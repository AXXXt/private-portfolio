"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftToLine, Bot, ExternalLink, Fingerprint, Layers, LockKeyhole, Send, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Types */
type ProjectTone = "cyan" | "fuchsia";
type ProjectItem = { id: number; title: string; shortTitle: string; subtitle: string; description: string; tone: ProjectTone; tags: string[]; bullets: string[]; cta: string; isAI?: boolean; repo?: string };
type AuthStatus = "idle" | "error" | "success";

/* Data */
const PROJECTS: readonly ProjectItem[] = [
  { id: 1, title: "微信小程序全栈热火锅点餐与店铺管理系统", shortTitle: "热火锅全栈系统", subtitle: "微信小程序 + Web 后台管理系统 + Node.js 驱动后端", description: "围绕点餐、店铺管理、库存联动和运营后台构建完整闭环，强调真实业务链路里的数据一致性、后台可维护性与小程序体验交付。", tone: "cyan", tags: ["Node.js", "Express", "MySQL", "Miniprogram", "Admin"], bullets: ["小程序点餐链路与订单状态管理", "Web 后台店铺、菜品与库存维护", "Node.js API 分层与数据库建模", "面向门店运营的高频操作体验优化"], cta: "查看详情", repo: "https://github.com/AXXXt/hot-pot-sales-system" },
  { id: 2, title: "项目：心相近 · 校园论坛小程序", shortTitle: "心相近", subtitle: "组件化重构与安全合规优化", description: "主导代码重构与性能优化，前端资源体积缩减40%+，集成敏感词过滤与多级角色权限控制。覆盖首屏渲染、CDN缓存和内容安全等关键链路。", tone: "fuchsia", tags: ["微信小程序", "组件化重构", "安全合规", "性能优化"], bullets: ["代码重构与组件化模块拆分", "前端资源体积缩减 40%+", "敏感词过滤与角色权限控制", "首屏懒加载与 CDN 缓存优化"], cta: "查看详情" },
  { id: 3, title: "AI Digital Clone \u00b7 Stariver蒸馏体", shortTitle: "Stariver蒸馏体", subtitle: "带邀请码鉴权机制的安全合规 AI 智能体", description: "把个人履历、项目能力和安全边界蒸馏成可交互的 AI 面试助手。可以回答能力画像与项目理解，但会主动规避隐私、凭证和不可公开信息。", tone: "cyan", tags: ["AI Agent", "Auth Gate", "Typewriter", "Security Sandbox", "Next.js"], bullets: ["邀请码 AN2026 本地鉴权解锁", "HR 预设问题一键触发能力评估", "安全沙盒拒绝输出敏感隐私", "极客终端式流式回答体验"], cta: "连接智能体", isAI: true },
  { id: 4, title: "AI 日程助手 · 跨端移动应用", shortTitle: "AI 日程助手", subtitle: "Expo + React Native · Android/iOS 跨端作品", description: "把一句模糊的生活安排转化为可确认的日程和可执行的行动方案。自然语言解析 → AI 结构化确认 → 生成时间线与准备清单 → 日历闭环。", tone: "fuchsia", tags: ["React Native", "Expo", "TypeScript", "AI", "Jest"], bullets: ["自然语言解析日程并结构化确认", "按类型生成时间线、清单与风险建议", "41 个 Jest 测试用例全部通过", "Android APK 可直接安装体验"], cta: "查看详情", repo: "https://github.com/AXXXt/ai-schedule-assistant" },
];


/* Helpers */
function isHTMLElement(n: unknown): n is HTMLElement { return n instanceof HTMLElement }
function toneClasses(t: ProjectTone) { return t === "fuchsia" ? { border: "border-fuchsia-300/20", glow: "from-fuchsia-500/20 via-white/5 to-cyan-500/10", pill: "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-100", text: "text-fuchsia-100", ring: "focus:ring-fuchsia-300/60" } : { border: "border-cyan-300/20", glow: "from-cyan-500/20 via-white/5 to-fuchsia-500/10", pill: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100", text: "text-cyan-100", ring: "focus:ring-cyan-300/60" } }

/* Main Component */
export function ProjectGallery() {
  const rootRef = useRef<HTMLElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const modalShellRef = useRef<HTMLDivElement | null>(null);
  const authInputRef = useRef<HTMLInputElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLParagraphElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [isFannedOut, setIsFannedOut] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isAiUnlocked, setIsAiUnlocked] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [chatInput, setChatInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const activeProject = PROJECTS.find(p => p.id === activeId) ?? null;

  /* Typewriter hint */
  useEffect(() => {
    if (isFannedOut || !hintRef.current) return;
    const node = hintRef.current;
    const text = "[SYS] CLICK DECK TO INTEGRATE INTELLIGENCE";
    node.textContent = "";
    let i = 0;
    const t = window.setInterval(() => { if (i < text.length) { node.textContent = text.slice(0, i + 1); i++ } else window.clearInterval(t); }, 45);
    return () => window.clearInterval(t);
  }, [isFannedOut]);

  /* Stage 1: Stack <-> Fan */
  useGSAP(() => {
    const cards = cardsRef.current.filter(isHTMLElement);
    if (cards.length !== 4) return;
    gsap.killTweensOf(cards);
    if (isFannedOut) {
      gsap.to(cards, { x: i => [-360, -120, 120, 360][i], rotateZ: i => [-6, -2, 2, 6][i], rotateY: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.4)", willChange: "transform, opacity", onComplete: () => gsap.set(cards, { willChange: "auto" }) });
    } else {
      gsap.to(cards, { x: 0, rotateZ: 0, rotateY: 0, scale: 0.95, duration: 0.5, ease: "power3.inOut", willChange: "transform", onComplete: () => gsap.set(cards, { willChange: "auto" }) });
    }
  }, { scope: rootRef, dependencies: [isFannedOut] });

  /* Stage 2: Modal 3D flip */
  useGSAP(() => {
    const shell = modalShellRef.current;
    if (!shell) return;
    gsap.killTweensOf(shell);
    if (activeId !== null) {
      gsap.fromTo(shell, { rotateY: 0 }, { rotateY: 180, duration: 0.75, ease: "power3.out" });
    }
  }, { scope: rootRef, dependencies: [activeId] });

  /* Auth error shake */
  useGSAP(() => {
    if (authStatus === "error" && authInputRef.current) {
      gsap.fromTo(authInputRef.current, { x: 0 }, { keyframes: [{ x: -10, duration: 0.06 }, { x: 10, duration: 0.06 }, { x: -7, duration: 0.06 }, { x: 7, duration: 0.06 }, { x: 0, duration: 0.08 }], ease: "power2.out" });
    }
  }, { scope: rootRef, dependencies: [authStatus] });

  /* Streaming chat — calls /api/agent (DeepSeek proxy) */
  const streamChat = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isStreaming) return;
    setIsStreaming(true);
    setAiOutput("");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt.trim() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        setAiOutput(prev => prev + "\n\n[ERROR] API 不可用: " + res.status + "\n请检查 DEEPSEEK_API_KEY 是否已配置");
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setAiOutput("无法读取响应流"); setIsStreaming(false); return; }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE chunks
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              setAiOutput(prev => prev + content);
            }
          } catch { /* skip malformed chunks */ }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setAiOutput(prev => prev + "\n\n[ERROR] 连接中断: " + (err.message || "未知错误"));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming]);

  /* Handlers */
  const handleDeckClick = useCallback(() => { if (!isFannedOut) setIsFannedOut(true); }, [isFannedOut]);
  const handleCardClick = useCallback((id: number) => { if (!isFannedOut) return; setAuthStatus("idle"); setIsAiUnlocked(false); setInviteCode(""); setAiOutput(""); setChatInput(""); setActiveId(id); }, [isFannedOut]);
  const closeModal = useCallback(() => { abortRef.current?.abort(); setActiveId(null); }, []);
  const collapseDeck = useCallback(() => { abortRef.current?.abort(); setActiveId(null); setIsFannedOut(false); }, []);
  const submitCode = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inviteCode.trim().toUpperCase() === "AN2026") {
      setAuthStatus("success");
      setTimeout(() => setIsAiUnlocked(true), 320);
    } else { setAuthStatus("error"); setTimeout(() => setAuthStatus("idle"), 420); }
  }, [inviteCode]);
  const handleSend = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput("");
    streamChat(msg);
  }, [chatInput, streamChat]);

  return (
    <section ref={rootRef} className="relative bg-black px-5 py-24 text-white md:px-8 md:py-32" aria-label="Project gallery">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(34,211,238,0.09),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.08),transparent_28%)]" />
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">Selected Work</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">Codex Decrypt Deck</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 md:text-base">点击牌堆搓开卡牌。再次点击单张触发 3D 解密翻牌。AI 卡牌已接入 DeepSeek 实时蒸馏对话。</p>
          </div>
          {isFannedOut && (
            <button type="button" onClick={collapseDeck} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white/70">
              <ArrowLeftToLine className="h-3.5 w-3.5" />Collapse Deck
            </button>
          )}
        </div>

        {/* Card Deck */}
        <div className="relative flex justify-center py-12" onClick={handleDeckClick}>
          <div ref={deckRef} className="relative flex h-[28rem] w-full max-w-4xl items-center justify-center">
            {PROJECTS.map((project, i) => {
              const tone = toneClasses(project.tone);
              const z = isFannedOut ? i + 1 : PROJECTS.length - i;
              return (
                <article key={project.id} ref={n => { cardsRef.current[i] = n }} data-project-id={project.id} style={{ zIndex: z }} className="absolute h-[26rem] w-[20rem] cursor-pointer overflow-hidden rounded-3xl [perspective:1500px] transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(34,211,238,0.12)]" onClick={e => { e.stopPropagation(); handleCardClick(project.id); }}>
                  <div className={`absolute inset-0 flex flex-col justify-between rounded-3xl border bg-neutral-950/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-7 ${tone.border}`}>
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow} opacity-70`} />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] opacity-25" />
                    <div className="pointer-events-none absolute inset-px rounded-[1.4rem] border border-white/5" />
                    <div className="relative flex items-center justify-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-black/40 backdrop-blur-sm ${tone.border}`}>
                        {project.isAI ? <Bot className={`h-6 w-6 ${tone.text}`} /> : <Sparkles className={`h-6 w-6 ${tone.text}`} />}
                      </div>
                    </div>
                    <div className="relative text-center">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25">{project.subtitle}</p>
                      <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl">{project.shortTitle}</h3>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${tone.pill}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                      <div className="relative text-center">
                      {isFannedOut && project.repo ? (
                        <a href={project.repo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/[0.1] hover:text-white">
                          <ExternalLink className="h-3.5 w-3.5" />查看详情
                        </a>
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.35em] text-white/25">{isFannedOut && !project.repo ? "Tap to Flip" : ""}</span>
                      )}
                    </div>
                          <ExternalLink className="h-3.5 w-3.5" />查看详情
                        </a>
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.35em] text-white/25">{isFannedOut && !project.repo ? "Tap to Flip" : ""}</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {!isFannedOut && (
            <div className="mt-4 text-center">
              <p ref={hintRef} className="inline-block font-mono text-xs text-cyan-200/60 animate-pulse" />
              <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-cyan-200/70" />
            </div>
          )}
        </div>
      </div>

      {/* ====== Modal Overlay ====== */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-8" onClick={closeModal}>
          <div className="relative w-full max-w-5xl h-[85vh] [perspective:1500px]" onClick={e => e.stopPropagation()}>
            <div ref={modalShellRef} className="relative h-full w-full [transform-style:preserve-3d]">

              {/* CardBack */}
              <div className={`absolute inset-0 flex items-center justify-center rounded-3xl border bg-neutral-950 [backface-visibility:hidden] ${toneClasses(activeProject.tone).border}`}>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneClasses(activeProject.tone).glow} opacity-60`} />
                <div className="relative text-center">
                  <Layers className={`mx-auto h-14 w-14 ${toneClasses(activeProject.tone).text} animate-pulse`} />
                  <p className="mt-5 font-mono text-lg font-black uppercase tracking-[0.4em] text-white/30">Decrypting</p>
                </div>
              </div>

              {/* CardFront — Modern Split Layout */}
              <div className={`absolute inset-0 flex flex-col md:flex-row overflow-hidden rounded-3xl border bg-neutral-950/95 shadow-[0_32px_140px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${toneClasses(activeProject.tone).border}`}>
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneClasses(activeProject.tone).glow} opacity-80`} />
                <button type="button" onClick={closeModal} className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/65 backdrop-blur-xl transition-colors hover:border-white/25 hover:text-white md:right-6 md:top-6"><X className="h-4 w-4" /></button>

                {/* Left Column */}
                <div className="relative flex flex-col justify-between border-r border-white/5 bg-white/[0.01] p-6 md:w-5/12 md:p-10">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Project {activeProject.id.toString().padStart(2,"0")}</span>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] ${toneClasses(activeProject.tone).pill}`}>{activeProject.isAI ? "Auth Agent" : "Featured"}</span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">{activeProject.subtitle}</p>
                    <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-4xl xl:text-5xl">{activeProject.title}</h3>
                    <p className="text-sm leading-7 text-white/50 md:text-base md:leading-8">{activeProject.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeProject.tags.map(tag => (<span key={tag} className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70">{tag}</span>))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="relative flex flex-col overflow-y-auto p-6 md:w-7/12 md:p-10">
                  {activeProject.isAI ? (
                    !isAiUnlocked ? (
                      /* AI Lock Screen */
                      <div className="flex flex-1 flex-col justify-center rounded-3xl border border-cyan-300/15 bg-black/60 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/70">SECURE HANDSHAKE</span>
                          <LockKeyhole className="h-5 w-5 text-cyan-100/70" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight text-white md:text-xl">请输入简历中的专属邀请码以连接Stariver蒸馏体</h4>
                        <p className="mt-3 text-sm leading-7 text-white/55">本终端接入 DeepSeek API，解锁后可实时对话蒸馏体。敏感信息会被沙盒阻断。邀请码见简历。</p>
                        <form onSubmit={submitCode} className="mt-6 grid gap-3">
                          <input ref={authInputRef} value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Invite Code" className={`h-12 rounded-2xl border bg-neutral-900 px-4 font-mono text-sm uppercase tracking-[0.22em] text-white outline-none placeholder:text-white/25 focus:ring-2 ${authStatus === "error" ? "border-red-400/60 focus:ring-red-400/40" : "border-white/20 focus:border-cyan-300/45 focus:ring-cyan-300/30"}`} />
                          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100 transition-colors hover:bg-cyan-400/15"><Fingerprint className="h-4 w-4" />Unlock Agent</button>
                          {authStatus === "error" ? <p className="text-xs uppercase tracking-[0.24em] text-red-300">Access denied \u00b7 code mismatch</p> : null}
                        </form>
                      </div>
                    ) : (
                      /* AI Sandbox — DeepSeek streaming */
                      <div className="flex flex-1 flex-col rounded-3xl border border-cyan-300/15 bg-black/60 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/70">STARIVER AGENT ONLINE \u00b7 DEEPSEEK</span>
                          <Bot className="h-5 w-5 text-cyan-100/70" />
                        </div>

                        

                        {/* Streaming output */}
                        <div className="mt-4 min-h-[8rem] flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950/80 p-4">
                          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100/45">{isStreaming ? "streaming... (DeepSeek)" : "sandboxed response"}</p>
                          <p ref={outputRef} className="whitespace-pre-wrap text-sm leading-7 text-white/72 md:text-base md:leading-8">
                            {aiOutput || "在下方输入您想了解的问题，Stariver 蒸馏体将如实作答..."}
                            {isStreaming && <span className="ml-1 inline-block h-[1em] w-1.5 translate-y-0.5 animate-pulse bg-cyan-200/80" />}
                          </p>
                        </div>

                        {/* Free-text input */}
                        <form onSubmit={handleSend} className="mt-3 flex gap-2">
                          <input ref={chatInputRef} value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="输入你的问题..." disabled={isStreaming} className="h-11 flex-1 rounded-2xl border border-white/10 bg-neutral-900 px-4 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-40" />
                          <button type="submit" disabled={isStreaming || !chatInput.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-100 transition-colors hover:bg-cyan-400/20 disabled:opacity-30">
                            <Send className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    )
                  ) : (
                    /* Regular bullets */
                    <>
                      <div className="space-y-4 flex-1">
                        {activeProject.bullets.map(b => (
                          <div key={b} className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm leading-7 text-white/72 md:p-6 md:text-base md:leading-8">{b}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}