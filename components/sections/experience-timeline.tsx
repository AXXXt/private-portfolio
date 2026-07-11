"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tone = "cyan" | "fuchsia";

type ExperienceNode = {
  range: string;
  title: string;
  phase: string;
  summary: string;
  bullets: string[];
  tone: Tone;
};

const EXPERIENCE_NODES: ExperienceNode[] = [
  {
    range: "2022 - 2026",
    title: "就读于网络工程专业",
    phase: "Node 01",
    summary:
      "高分斩获 MIIT(工信部)网络信息安全工程师认证与 CET-4，奠定扎实的路由、交换、网络安全架构底层内功。",
    bullets: ["MIIT 网络信息安全工程师", "CET-4", "路由 / 交换", "网络安全架构"],
    tone: "cyan",
  },
  {
    range: "2025 - 2026",
    title: "全栈工程演进",
    phase: "Node 02",
    summary:
      "主导开发热火锅点餐与 Web 后端管理系统，高标准完成数据流闭环；同时深度参与“校园小情书”开源项目交付与部署优化。",
    bullets: ["热火锅点餐系统", "Web 后台管理", "开源交付", "部署优化"],
    tone: "fuchsia",
  },
  {
    range: "2026",
    title: "河南味多鲜食品网络部专业实习",
    phase: "Node 03",
    summary:
      "全面接管库存系统维护、弱电网络运维及多项微信小程序日常迭代，维持业务节奏与现场稳定性。",
    bullets: ["库存系统维护", "弱电网络运维", "微信小程序迭代", "现场支持"],
    tone: "cyan",
  },
  {
    range: "未来 / 当下",
    title: "进军全栈开发与IT技术支持",
    phase: "Node 04",
    summary:
      "在巩固全栈交付力的同时，加深对Linux系统的学习和理解，以及服务器和办公设备的配置。",
    bullets: ["Linux 系统学习", "服务器配置", "办公设备维护", "全栈交付"],
    tone: "fuchsia",
  },
];

type ScrambleHandle = {
  frame: number;
  finalText: string;
};

export function ExperienceTimeline() {
  const rootRef = useRef<HTMLElement | null>(null);
  const traceFillRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const traceFill = traceFillRef.current;
      if (!root || !traceFill) return;

      const mm = gsap.matchMedia();
      const activeScrambles = new Map<HTMLElement, ScrambleHandle>();
      const scrambleChars = "$%&#@?*!/\\[]{}<>+=-";

      const clearScramble = (el: HTMLElement) => {
        const handle = activeScrambles.get(el);
        if (!handle) return;
        cancelAnimationFrame(handle.frame);
        activeScrambles.delete(el);
      };

      const resetScramble = (el: HTMLElement) => {
        clearScramble(el);
        const finalText = el.dataset.finalText ?? el.textContent ?? "";
        el.textContent = finalText;
      };

      const scrambleText = (el: HTMLElement) => {
        const finalText = el.dataset.finalText ?? el.textContent ?? "";
        const chars = Array.from(finalText);
        if (chars.length === 0) return;

        clearScramble(el);

        const start = performance.now();
        const duration = 400;
        const revealStep = Math.max(12, Math.min(24, duration / chars.length));

        const render = (now: number) => {
          const elapsed = now - start;
          const output = chars
            .map((char, index) => {
              if (char === " " || char === "\u00a0") return "\u00a0";
              if (elapsed >= duration || elapsed >= index * revealStep) return char;
              return scrambleChars[(Math.random() * scrambleChars.length) | 0];
            })
            .join("");

          el.textContent = output;

          if (elapsed < duration) {
            const nextFrame = requestAnimationFrame(render);
            activeScrambles.set(el, { frame: nextFrame, finalText });
            return;
          }

          el.textContent = finalText;
          activeScrambles.delete(el);
        };

        el.textContent = chars
          .map((char) => (char === " " || char === "\u00a0" ? "\u00a0" : scrambleChars[(Math.random() * scrambleChars.length) | 0]))
          .join("");

        const frame = requestAnimationFrame(render);
        activeScrambles.set(el, { frame, finalText });
      };

      const getScrambleTargets = (card: HTMLElement) => ({
        year: card.querySelector<HTMLElement>("[data-exp-year]"),
        title: card.querySelector<HTMLElement>("[data-exp-title]"),
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-exp-trace-fill]", { autoAlpha: 0 });
        gsap.fromTo(
          "[data-exp-card]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          },
        );

        return () => {
          activeScrambles.forEach((handle) => cancelAnimationFrame(handle.frame));
          activeScrambles.clear();
        };
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-exp-trace-fill]", { autoAlpha: 0 });
        gsap.fromTo(
          "[data-exp-card]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
        );

        return () => {
          activeScrambles.forEach((handle) => cancelAnimationFrame(handle.frame));
          activeScrambles.clear();
        };
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-exp-card]");
        if (!cards.length) return;

        gsap.set(traceFill, {
          scaleY: 0,
          transformOrigin: "top",
          willChange: "transform",
        });

        gsap.to(traceFill, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            end: "bottom 8%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          const { year, title } = getScrambleTargets(card);

          gsap.set(card, {
            autoAlpha: 0,
            y: 20,
            willChange: "transform, opacity",
          });

          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: index === 0 ? "top 82%" : "top 78%",
              end: "bottom 28%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
              onEnter: () => {
                if (year) scrambleText(year);
                if (title) scrambleText(title);
              },
              onEnterBack: () => {
                if (year) scrambleText(year);
                if (title) scrambleText(title);
              },
              onLeaveBack: () => {
                if (year) resetScramble(year);
                if (title) resetScramble(title);
              },
            },
          }).to(card, {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            ease: "power2.out",
          });
        });

        return () => {
          activeScrambles.forEach((handle) => cancelAnimationFrame(handle.frame));
          activeScrambles.clear();
          gsap.set(cards, { willChange: "auto" });
          gsap.set(traceFill, { scaleY: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-24 text-white md:py-32"
      aria-label="Experience timeline"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.07),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.07),transparent_26%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/45">
            Timeline
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Text Recomposition
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            A flat, precise履历 stack with a neon trace line and matrix-style character unlocks.
          </p>
        </div>

        <div className="relative pl-8 md:pl-12">
          <div className="absolute left-2 top-0 hidden h-full w-px md:block">
            <div className="absolute inset-0 bg-white/10" />
            <div
              ref={traceFillRef}
              data-exp-trace-fill
              className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-fuchsia-300 to-cyan-200 opacity-90 shadow-[0_0_18px_rgba(34,211,238,0.3)]"
              style={{ transformOrigin: "top" }}
              aria-hidden="true"
            />
          </div>

          <div className="space-y-6 md:space-y-8">
            {EXPERIENCE_NODES.map((node) => {
              const toneClasses =
                node.tone === "fuchsia"
                  ? "border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-100"
                  : "border-cyan-300/30 bg-cyan-400/10 text-cyan-100";

              const dotClasses =
                node.tone === "fuchsia"
                  ? "border-fuchsia-300/40 bg-fuchsia-300/90 shadow-[0_0_14px_rgba(217,70,239,0.2)]"
                  : "border-cyan-300/40 bg-cyan-300/90 shadow-[0_0_14px_rgba(34,211,238,0.2)]";

              return (
                <article
                  key={node.phase}
                  data-exp-card
                  className="relative rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-6 backdrop-blur-sm md:px-7 md:py-7"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[1.375rem] top-7 hidden h-3 w-3 rounded-full border md:block ${dotClasses}`}
                  />

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.34em] text-white/40">
                          {node.phase}
                        </span>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] ${toneClasses}`}>
                          {node.tone === "cyan" ? "Cyan" : "Fuchsia"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium uppercase tracking-[0.34em] text-white/45">
                          <span className="sr-only">{node.range}</span>
                          <span data-exp-year data-final-text={node.range} aria-hidden="true">
                            {node.range}
                          </span>
                        </div>

                        <h3 className="max-w-4xl text-2xl font-black leading-[1.05] tracking-tight text-white md:text-4xl">
                          <span className="sr-only">{node.title}</span>
                          <span data-exp-title data-final-text={node.title} aria-hidden="true">
                            {node.title}
                          </span>
                        </h3>
                      </div>

                      <p className="mt-4 max-w-4xl text-sm leading-7 text-white/58 md:text-base">
                        {node.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:min-w-[14rem] md:items-end">
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        {node.bullets.map((bullet) => (
                          <span
                            key={bullet}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/74"
                          >
                            {bullet}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300/60 md:self-end"
                      >
                        <span>查看详情</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
