"use client";

import { ArrowUpRight, ChevronUp, Mail } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CONTACT_EMAIL = "stariverh@gmail.com";

export function SiteFooter() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;

      const line = root.querySelector<HTMLElement>("[data-footer-line]");
      const glow = root.querySelector<HTMLElement>("[data-footer-glow]");
      const title = root.querySelector<HTMLElement>("[data-footer-title]");
      const copy = root.querySelector<HTMLElement>("[data-footer-copy]");
      const email = root.querySelector<HTMLElement>("[data-footer-email]");
      const contactButton = root.querySelector<HTMLElement>("[data-footer-contact]");
      const topButton = root.querySelector<HTMLElement>("[data-footer-top]");
      const metaItems = gsap.utils.toArray<HTMLElement>("[data-footer-meta]");
      const magneticTargets = gsap.utils.toArray<HTMLElement>("[data-footer-magnetic]");

      if (!line || !glow || !title || !copy || !email || !contactButton || !topButton) return;

      const mm = gsap.matchMedia();
      const safe =
        contextSafe ??
        (<T extends (...args: never[]) => unknown>(fn: T) => fn);

      mm.add("(prefers-reduced-motion: reduce), (max-width: 767px)", () => {
        gsap.set([line, glow, title, copy, email, contactButton, topButton, ...metaItems], {
          clearProps: "transform,opacity,willChange",
        });

        gsap.set(line, {
          autoAlpha: 0.28,
          scaleX: 1,
          transformOrigin: "center center",
        });

        gsap.fromTo(
          [title, copy, email, contactButton, topButton, ...metaItems],
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
          },
        );

        gsap.set(glow, { autoAlpha: 0 });
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const headlineParts = [title, copy, email, contactButton, topButton, ...metaItems];

        gsap.set(root, { perspective: 1200 });
        gsap.set(line, {
          autoAlpha: 0,
          scaleX: 0,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        });
        gsap.set(glow, {
          autoAlpha: 0,
          scale: 0.72,
          xPercent: -50,
          yPercent: -50,
          willChange: "transform, opacity",
        });
        gsap.set(headlineParts, {
          autoAlpha: 0,
          y: 34,
          willChange: "transform, opacity",
        });
        gsap.set(magneticTargets, {
          willChange: "transform, opacity",
        });

        const intro = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            end: "top 48%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        intro
          .to(line, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 1,
            ease: "elastic.out(1, 0.75)",
          })
          .to(
            [title, copy],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "expo.out",
            },
            0.16,
          )
          .to(
            [email, contactButton],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "expo.out",
            },
            0.26,
          )
          .to(
            [topButton, ...metaItems],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: "power3.out",
            },
            0.34,
          );

        const glowX = gsap.quickTo(glow, "x", {
          duration: 0.22,
          ease: "power3.out",
        });
        const glowY = gsap.quickTo(glow, "y", {
          duration: 0.22,
          ease: "power3.out",
        });
        const glowScale = gsap.quickTo(glow, "scale", {
          duration: 0.26,
          ease: "power3.out",
        });
        const glowScaleX = gsap.quickTo(glow, "scaleX", {
          duration: 0.24,
          ease: "power3.out",
        });
        const glowScaleY = gsap.quickTo(glow, "scaleY", {
          duration: 0.24,
          ease: "power3.out",
        });
        const glowOpacity = gsap.quickTo(glow, "opacity", {
          duration: 0.2,
          ease: "power2.out",
        });

        let lastX = 0;
        let lastY = 0;
        let lastTime = performance.now();

        const moveGlow = safe((event: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const now = performance.now();
          const dt = Math.max(now - lastTime, 16);
          const dx = x - lastX;
          const dy = y - lastY;
          const speed = Math.hypot(dx, dy) / dt;
          const lagX = x - dx * 0.16 - rect.width * 0.5;
          const lagY = y - dy * 0.16 - rect.height * 0.5;
          const stretchX = 1 + gsap.utils.clamp(0, 0.34, speed * 0.22);
          const stretchY = 1 - gsap.utils.clamp(0, 0.12, speed * 0.06);

          glowX(lagX);
          glowY(lagY);
          glowScale(1 + gsap.utils.clamp(0, 0.22, speed * 0.08));
          glowScaleX(stretchX);
          glowScaleY(stretchY);
          glowOpacity(0.18 + gsap.utils.clamp(0, 0.14, speed * 0.04));

          lastX = x;
          lastY = y;
          lastTime = now;
        });

        const enterGlow = safe(() => {
          gsap.to(glow, {
            autoAlpha: 0.22,
            duration: 0.18,
            ease: "power2.out",
          });
        });

        const leaveGlow = safe(() => {
          gsap.to(glow, {
            autoAlpha: 0,
            scale: 0.72,
            scaleX: 1,
            scaleY: 1,
            duration: 0.24,
            ease: "power2.out",
          });
        });

        root.addEventListener("pointermove", moveGlow, { passive: true });
        root.addEventListener("pointerenter", enterGlow);
        root.addEventListener("pointerleave", leaveGlow);

        const magneticCleanups = magneticTargets.map((target) => {
          const targetGlow = safe(() => {
            gsap.to(glow, {
              autoAlpha: 0.3,
              scale: 1.18,
              duration: 0.22,
              ease: "power3.out",
            });
          });

          const resetGlow = safe(() => {
            gsap.to(glow, {
              autoAlpha: 0.18,
              scale: 0.96,
              scaleX: 1,
              scaleY: 1,
              duration: 0.22,
              ease: "power2.out",
            });
          });

          const moveTarget = safe((event: PointerEvent) => {
            const rect = target.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(target, {
              x: gsap.utils.clamp(-14, 14, x * 18),
              y: gsap.utils.clamp(-14, 14, y * 18),
              rotate: gsap.utils.clamp(-4, 4, x * 4),
              scale: 1.04,
              duration: 0.22,
              ease: "power3.out",
              overwrite: "auto",
            });
          });

          const onLeave = safe(() => {
            leaveTarget();
            resetGlow();
          });

          const leaveTarget = safe(() => {
            gsap.to(target, {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 0.24,
              ease: "power3.out",
              overwrite: "auto",
            });
          });

          target.addEventListener("pointermove", moveTarget, { passive: true });
          target.addEventListener("pointerenter", targetGlow);
          target.addEventListener("pointerleave", onLeave);

          return () => {
            target.removeEventListener("pointermove", moveTarget);
            target.removeEventListener("pointerenter", targetGlow);
            target.removeEventListener("pointerleave", onLeave);
          };
        });

        const clearWillChange = () => {
          gsap.set([line, glow, title, copy, email, contactButton, topButton, ...metaItems], {
            willChange: "auto",
          });
        };

        intro.eventCallback("onComplete", clearWillChange);
        intro.eventCallback("onReverseComplete", clearWillChange);

        return () => {
          root.removeEventListener("pointermove", moveGlow);
          root.removeEventListener("pointerenter", enterGlow);
          root.removeEventListener("pointerleave", leaveGlow);
          magneticCleanups.forEach((cleanup) => cleanup());
          clearWillChange();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer
      ref={rootRef}
      id="contact"
      className="relative isolate overflow-hidden bg-black px-5 py-24 text-white md:px-8 md:py-32"
      aria-label="Site footer"
    >
      <div
        data-footer-glow
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 blur-3xl opacity-0 mix-blend-screen"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto h-px w-full max-w-7xl bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.95)_22%,rgba(255,255,255,0.85)_50%,rgba(217,70,239,0.95)_78%,transparent)] opacity-90" />
        <div
          data-footer-line
          className="mx-auto h-px w-full max-w-7xl origin-center bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.95)_22%,rgba(217,70,239,0.95)_78%,transparent)] opacity-0"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 lg:gap-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-white/35">
              Final signal
            </p>

            <h2
              data-footer-title
              className="mt-5 text-balance text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Let&apos;s Work Together
            </h2>

            <p
              data-footer-copy
              className="mt-5 max-w-2xl text-pretty text-sm leading-7 text-white/58 md:text-base"
            >
              Selective availability for full-stack builds, motion systems, and the kind of
              product work that benefits from sharp execution.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                data-footer-email
                data-footer-magnetic
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/84 backdrop-blur-xl transition-colors duration-200 hover:border-cyan-300/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <Mail className="h-4 w-4 text-cyan-300" />
                <span>{CONTACT_EMAIL}</span>
              </a>

              <button
                data-footer-contact
                data-footer-magnetic
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${CONTACT_EMAIL}`;
                }}
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white text-sm font-semibold text-black transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
              >
                <span className="px-4">Contact Me</span>
                <ArrowUpRight className="mr-4 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid gap-3 border-t border-white/10 pt-6 text-sm leading-7 text-white/58 md:text-base">
              <p data-footer-meta>2026 An Xitong. All rights reserved.</p>
              <p data-footer-meta>
                Built with Next.js, React 19, Tailwind CSS, shadcn/ui, and GSAP.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/32">
                Back to origin
              </span>

              <button
                data-footer-top
                data-footer-magnetic
                type="button"
                aria-label="Back to top"
                onClick={scrollToTop}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/82 backdrop-blur-xl transition-colors duration-200 hover:border-fuchsia-300/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <ChevronUp className="h-4 w-4 text-fuchsia-300" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

