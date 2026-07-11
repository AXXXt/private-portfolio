"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_TITLE = "CREATIVE FULLSTACK ENGINEER";
const TITLE_LETTERS = Array.from(HERO_TITLE);

export function HeroSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-element]", {
          autoAlpha: 1,
          clearProps: "transform,willChange",
        });

        gsap.from("[data-hero-element]", {
          autoAlpha: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "power1.out",
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-element]", {
          autoAlpha: 1,
          clearProps: "transform,willChange",
        });

        gsap.from("[data-hero-element]", {
          y: 18,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        });
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-hero-stage]");
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
        const shapes = gsap.utils.toArray<HTMLElement>("[data-hero-shape]");
        const portrait = root.querySelector<HTMLElement>("[data-hero-portrait]");

        if (!stage || !title || letters.length === 0) return;

        gsap.set([stage, title, portrait, ...letters, ...shapes], {
          transformStyle: "preserve-3d",
        });

        gsap.set("[data-hero-will-change]", {
          willChange: "transform, opacity",
        });

        gsap.set(letters, {
          autoAlpha: 0,
          z: -500,
          rotateX: () => gsap.utils.random(-72, 72),
          rotateY: () => gsap.utils.random(-96, 96),
          rotateZ: () => gsap.utils.random(-18, 18),
          scale: 0.72,
          transformPerspective: 1200,
        });

        gsap.set(shapes, {
          autoAlpha: 0,
          z: -220,
          scale: 0.75,
          rotateX: -18,
          rotateY: 18,
        });

        gsap.set(portrait, {
          autoAlpha: 0,
          z: -180,
          scale: 0.9,
          rotateX: 10,
          rotateY: -12,
        });

        const intro = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            gsap.set([letters, shapes, portrait], { willChange: "auto" });
          },
        });

        intro
          .to(
            letters,
            {
              autoAlpha: 1,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1,
              duration: 1.1,
              stagger: {
                each: 0.018,
                from: "center",
              },
            },
            0,
          )
          .to(
            shapes,
            {
              autoAlpha: 0.92,
              z: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              duration: 1.05,
              stagger: 0.08,
            },
            0.12,
          )
          .to(
            portrait,
            {
              autoAlpha: 1,
              z: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              duration: 1,
            },
            0.28,
          );

        const rotateTitleX = gsap.quickTo(title, "rotateX", {
          duration: 0.55,
          ease: "power3.out",
        });
        const rotateTitleY = gsap.quickTo(title, "rotateY", {
          duration: 0.55,
          ease: "power3.out",
        });
        const rotateStageX = gsap.quickTo(stage, "rotateX", {
          duration: 0.7,
          ease: "power3.out",
        });
        const rotateStageY = gsap.quickTo(stage, "rotateY", {
          duration: 0.7,
          ease: "power3.out",
        });
        const shapeX = shapes.map((shape, index) =>
          gsap.quickTo(shape, "x", {
            duration: 0.8 + index * 0.08,
            ease: "power3.out",
          }),
        );
        const shapeY = shapes.map((shape, index) =>
          gsap.quickTo(shape, "y", {
            duration: 0.8 + index * 0.08,
            ease: "power3.out",
          }),
        );

        const handlePointerMove = (event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          rotateTitleX(y * -10);
          rotateTitleY(x * 12);
          rotateStageX(y * -4);
          rotateStageY(x * 5);

          shapeX.forEach((to, index) => to(x * (24 + index * 12)));
          shapeY.forEach((to, index) => to(y * (18 + index * 10)));
        };

        const handlePointerLeave = () => {
          rotateTitleX(0);
          rotateTitleY(0);
          rotateStageX(0);
          rotateStageY(0);
          shapeX.forEach((to) => to(0));
          shapeY.forEach((to) => to(0));
        };

        root.addEventListener("pointermove", handlePointerMove, { passive: true });
        root.addEventListener("pointerleave", handlePointerLeave);

        const collapseTargets = [stage, title, portrait, ...shapes, ...letters].filter(Boolean);

        const collapse = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=115%",
            scrub: 0.9,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => gsap.set(collapseTargets, { willChange: "transform, opacity" }),
            onEnterBack: () => gsap.set(collapseTargets, { willChange: "transform, opacity" }),
            onLeave: () => gsap.set(collapseTargets, { willChange: "auto" }),
            onLeaveBack: () => gsap.set(collapseTargets, { willChange: "auto" }),
          },
        });

        collapse
          .to(
            stage,
            {
              z: -620,
              scale: 0.48,
              yPercent: -12,
              autoAlpha: 0,
              ease: "none",
            },
            0,
          )
          .to(
            shapes,
            {
              z: -900,
              scale: 0.35,
              autoAlpha: 0,
              stagger: 0.02,
              ease: "none",
            },
            0,
          );

        return () => {
          root.removeEventListener("pointermove", handlePointerMove);
          root.removeEventListener("pointerleave", handlePointerLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-svh overflow-hidden bg-black text-white [perspective:1200px]"
      aria-label="Portfolio hero"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_90%)]" />

      <div
        data-hero-stage
        data-hero-will-change
        className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center justify-center px-5 py-24 [transform-style:preserve-3d] md:px-8"
      >
        <div
          data-hero-shape
          data-hero-will-change
          className="absolute left-[7%] top-[18%] h-28 w-28 rounded-[2rem] border border-cyan-300/40 bg-cyan-300/20 shadow-[0_0_80px_rgba(34,211,238,0.38)] md:h-44 md:w-44"
        />
        <div
          data-hero-shape
          data-hero-will-change
          className="absolute right-[8%] top-[20%] h-24 w-44 rotate-12 rounded-full border border-fuchsia-300/40 bg-fuchsia-400/20 shadow-[0_0_90px_rgba(217,70,239,0.34)] md:h-36 md:w-72"
        />
        <div
          data-hero-shape
          data-hero-will-change
          className="absolute bottom-[14%] left-[18%] h-20 w-52 -rotate-6 rounded-full border border-lime-300/40 bg-lime-300/20 shadow-[0_0_80px_rgba(190,242,100,0.28)] md:h-28 md:w-80"
        />

        <div
          data-hero-portrait
          data-hero-element
          data-hero-will-change
          className="absolute bottom-[10%] right-[12%] hidden aspect-[4/5] w-40 rounded-[2rem] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.2),rgba(255,255,255,0.04)),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.36),transparent_30%)] shadow-2xl shadow-white/10 md:block lg:w-56"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
          <p
            data-hero-element
            className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-white/55 md:text-sm"
          >
            Portfolio 2026 / Next.js / GSAP
          </p>

          <h1
            data-hero-title
            data-hero-element
            data-hero-will-change
            className="flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-1 text-balance text-5xl font-black uppercase leading-[0.9] tracking-normal [transform-style:preserve-3d] sm:text-7xl md:text-8xl lg:text-9xl"
          >
            {TITLE_LETTERS.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                data-hero-letter
                data-hero-will-change
                className={letter === " " ? "w-3 sm:w-5 md:w-7" : "inline-block"}
                aria-hidden="true"
              >
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
            <span className="sr-only">{HERO_TITLE}</span>
          </h1>

          <p
            data-hero-element
            className="mt-7 max-w-2xl text-pretty text-base leading-7 text-white/62 md:text-lg"
          >
            I build resilient full-stack products with cinematic interfaces, clean systems,
            and motion that makes the experience feel engineered, not decorated.
          </p>
        </div>
      </div>
    </section>
  );
}
