"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, Network, ServerCog, Shield } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tone = "cyan" | "fuchsia";

type SkillCard = {
  title: string;
  detail: string;
  copy: string[];
  tone: Tone;
  icon: typeof ServerCog;
};

const SKILLS: SkillCard[] = [
  {
    title: "核心技术",
    detail: "Node.js、Express、MySQL、ThinkJS 全栈开发，偏接口、数据流和稳定交付。",
    copy: ["Node.js", "Express", "MySQL", "ThinkJS"],
    tone: "cyan",
    icon: ServerCog,
  },
  {
    title: "硬核认证",
    detail: "MIIT(工信部)网络信息安全工程师证书、人工智能综合能力认定证书与 CET-4，强调工程基础与AI素养。",
    copy: ["MIIT 网络信息安全工程师", "人工智能综合能力认定", "CET-4"],
    tone: "fuchsia",
    icon: BadgeCheck,
  },
  {
    title: "实战经验",
    detail: "河南味多鲜食品网络部专业实习，负责库存系统管理与小程序维护。",
    copy: ["河南味多鲜食品网络部实习"],
    tone: "cyan",
    icon: Network,
  },
  {
    title: "兴趣方向",
    detail: "网络安全与白帽渗透测试，熟练练习 SQL 注入与暴力破解防御。",
    copy: ["网络安全", "白帽渗透测试"],
    tone: "fuchsia",
    icon: Shield,
  },
];

type CardController = {
  el: HTMLElement;
  moveX: (value: number) => gsap.core.Tween;
  moveY: (value: number) => gsap.core.Tween;
  iconX?: (value: number) => gsap.core.Tween;
  iconY?: (value: number) => gsap.core.Tween;
  bodyX?: (value: number) => gsap.core.Tween;
  bodyY?: (value: number) => gsap.core.Tween;
  glowOpacity?: (value: number) => gsap.core.Tween;
  glowScale?: (value: number) => gsap.core.Tween;
  rotateX: (value: number) => gsap.core.Tween;
  rotateY: (value: number) => gsap.core.Tween;
  reset: () => void;
  onMove: (event: PointerEvent) => void;
  onLeave: () => void;
  onEnter: () => void;
};

export function SkillsGrid() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          "[data-skill-card]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-skill-card]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-skill-card]");
        if (!cards.length) return;

        const controllers: CardController[] = cards.map((el) => {
          const glow = el.querySelector<HTMLElement>("[data-skill-glow]");
          const icon = el.querySelector<HTMLElement>("[data-skill-icon]");
          const body = el.querySelector<HTMLElement>("[data-skill-body]");

          const moveX = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
          const moveY = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });
          const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.34, ease: "power3.out" });
          const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.34, ease: "power3.out" });
          const iconX = icon ? gsap.quickTo(icon, "x", { duration: 0.22, ease: "power3.out" }) : undefined;
          const iconY = icon ? gsap.quickTo(icon, "y", { duration: 0.22, ease: "power3.out" }) : undefined;
          const bodyX = body ? gsap.quickTo(body, "x", { duration: 0.22, ease: "power3.out" }) : undefined;
          const bodyY = body ? gsap.quickTo(body, "y", { duration: 0.22, ease: "power3.out" }) : undefined;
          const glowOpacity = glow
            ? gsap.quickTo(glow, "opacity", { duration: 0.2, ease: "power2.out" })
            : undefined;
          const glowScale = glow
            ? gsap.quickTo(glow, "scale", { duration: 0.2, ease: "power2.out" })
            : undefined;

          const reset = () => {
            moveX(0);
            moveY(0);
            rotateX(0);
            rotateY(0);
            iconX?.(0);
            iconY?.(0);
            bodyX?.(0);
            bodyY?.(0);
            glowOpacity?.(0);
            glowScale?.(1);
          };

          const onMove = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            const strength = 12;

            moveX(x * strength);
            moveY(y * strength);
            rotateX(y * -5);
            rotateY(x * 7);
            iconX?.(x * 10);
            iconY?.(y * 10);
            bodyX?.(x * 8);
            bodyY?.(y * 8);
            glowOpacity?.(0.34);
            glowScale?.(1.03);
          };

          const onLeave = () => {
            reset();
            gsap.to(el, {
              boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
              duration: 0.24,
            });
          };

          const onEnter = () => {
            gsap.to(el, {
              boxShadow:
                el.dataset.tone === "fuchsia"
                  ? "0 0 0 1px rgba(255,255,255,0.12), 0 0 56px rgba(217,70,239,0.16)"
                  : "0 0 0 1px rgba(255,255,255,0.12), 0 0 56px rgba(34,211,238,0.16)",
              duration: 0.22,
            });
          };

          return {
            el,
            moveX,
            moveY,
            iconX,
            iconY,
            bodyX,
            bodyY,
            glowOpacity,
            glowScale,
            rotateX,
            rotateY,
            reset,
            onMove,
            onLeave,
            onEnter,
          };
        });

        gsap.set(cards, {
          autoAlpha: 0,
          z: 300,
          scale: 1.3,
          rotateX: -14,
          rotateY: 14,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        });

        gsap.set("[data-skill-card-will-change]", {
          willChange: "transform, opacity",
        });

        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            end: "bottom 28%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
          onComplete: () => {
            gsap.set(cards, { willChange: "auto" });
          },
        });

        intro.to(cards, {
          autoAlpha: 1,
          z: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.95,
          stagger: 0.09,
        });

        controllers.forEach((controller) => {
          controller.el.addEventListener("pointermove", controller.onMove, { passive: true });
          controller.el.addEventListener("pointerleave", controller.onLeave);
          controller.el.addEventListener("pointercancel", controller.onLeave);
          controller.el.addEventListener("pointerenter", controller.onEnter);
        });

        return () => {
          controllers.forEach((controller) => {
            controller.el.removeEventListener("pointermove", controller.onMove);
            controller.el.removeEventListener("pointerleave", controller.onLeave);
            controller.el.removeEventListener("pointercancel", controller.onLeave);
            controller.el.removeEventListener("pointerenter", controller.onEnter);
            controller.reset();
          });
          gsap.set(cards, { willChange: "auto" });
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
      aria-label="Skills grid"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.08),transparent_28%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/45">
            Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
            Magnetic Skill Grid
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Four cards, one dark signal. Built to read like an operator&apos;s dossier: full stack,
            certified, field-tested, and security-aware.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
          {SKILLS.map((skill, index) => {
            const Icon = skill.icon;

            return (
              <article
                key={skill.title}
                data-skill-card
                data-skill-card-will-change
                data-tone={skill.tone}
                className="group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.20)] backdrop-blur-xl md:p-7"
              >
                <div
                  data-skill-glow
                  className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ${
                    skill.tone === "fuchsia"
                      ? "bg-[radial-gradient(circle_at_35%_25%,rgba(217,70,239,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(244,114,182,0.08),transparent_30%)]"
                      : "bg-[radial-gradient(circle_at_35%_25%,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.08),transparent_30%)]"
                  }`}
                  aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-px rounded-[1.2rem] border border-white/5" />

                <div className="relative z-10 flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      data-skill-icon
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-white shadow-inner shadow-white/5"
                    >
                      <Icon
                        className={
                          skill.tone === "fuchsia"
                            ? "h-5 w-5 text-fuchsia-300"
                            : "h-5 w-5 text-cyan-300"
                        }
                      />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
                      0{index + 1}
                    </span>
                  </div>

                  <div data-skill-body className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white md:text-2xl">{skill.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/58 md:text-[15px]">
                        {skill.detail}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skill.copy.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/78"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
