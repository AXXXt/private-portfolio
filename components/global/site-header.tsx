"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type NavTone = "cyan" | "fuchsia";

type NavItem = {
  label: string;
  href: string;
  tone: NavTone;
};

const NAV_ITEMS = [
  { label: "Home", href: "/#home", tone: "cyan" },
  { label: "Skills", href: "/#skills", tone: "fuchsia" },
  { label: "Projects", href: "/#projects", tone: "cyan" },
  { label: "Timeline", href: "/#timeline", tone: "fuchsia" },
  { label: "Contact", href: "/#contact", tone: "cyan" },
] satisfies readonly NavItem[];

const SCRAMBLE_CHARS = "$%&#@?*!/<>+=-_";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createScramble({
  element,
  finalText,
  delay = 0,
  duration = 420,
}: {
  element: HTMLElement;
  finalText: string;
  delay?: number;
  duration?: number;
}) {
  const letters = Array.from(finalText);
  const start = window.setTimeout(() => {
    const startedAt = performance.now();
    let raf = 0;

    const tick = (time: number) => {
      const progress = clamp((time - startedAt) / duration, 0, 1);
      const revealCount = Math.floor(progress * letters.length);

      element.textContent = letters
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;
          return SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0] ?? char;
        })
        .join("");

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        element.textContent = finalText;
      }
    };

    raf = window.requestAnimationFrame(tick);

    stopHandles.push(() => {
      window.cancelAnimationFrame(raf);
      element.textContent = finalText;
    });
  }, delay);

  const stopHandles: Array<() => void> = [];

  return () => {
    window.clearTimeout(start);
    stopHandles.forEach((stop) => stop());
  };
}

export function SiteHeader() {
  const rootRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const middleLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const buttonTlRef = useRef<gsap.core.Timeline | null>(null);
  const scrambleStopsRef = useRef<Array<() => void>>([]);
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    isOpenRef.current = isOpen;

    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const menuTl = menuTlRef.current;
    const buttonTl = buttonTlRef.current;
    const overlay = overlayRef.current;

    if (!menuTl || !buttonTl || !overlay) return;

    if (isOpen) {
      gsap.set(overlay, { pointerEvents: "auto" });
      buttonTl.play(0);
      menuTl.play(0);
    } else {
      scrambleStopsRef.current.forEach((stop) => stop());
      scrambleStopsRef.current = [];
      buttonTl.reverse();
      menuTl.reverse();
    }
  }, [isOpen]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const menuButton = menuButtonRef.current;
      const topLine = topLineRef.current;
      const middleLine = middleLineRef.current;
      const bottomLine = bottomLineRef.current;
      const overlay = overlayRef.current;
      const panel = panelRef.current;

      if (!root || !menuButton || !topLine || !middleLine || !bottomLine || !overlay || !panel) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce), (max-width: 767px)", () => {
        gsap.set(overlay, {
          autoAlpha: isOpenRef.current ? 1 : 0,
          scaleY: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0 round 0rem)",
          pointerEvents: isOpenRef.current ? "auto" : "none",
        });

        gsap.set(panel, {
          autoAlpha: isOpenRef.current ? 1 : 0,
          y: 0,
          scale: 1,
        });

        gsap.set("[data-menu-item]", {
          autoAlpha: isOpenRef.current ? 1 : 0,
          y: 0,
          skewX: 0,
        });

        buttonTlRef.current = gsap.timeline({ paused: true }).to(
          [topLine, middleLine, bottomLine],
          {
            duration: 0.18,
            ease: "power2.out",
          },
          0,
        );

        buttonTlRef.current
          .to(topLine, { y: 8, rotate: 45, scaleX: 1.05, duration: 0.22 }, 0)
          .to(middleLine, { autoAlpha: 0, scaleX: 0.2, duration: 0.16 }, 0)
          .to(bottomLine, { y: -8, rotate: -45, scaleX: 1.05, duration: 0.22 }, 0);

        menuTlRef.current = gsap
          .timeline({ paused: true })
          .to(overlay, {
            autoAlpha: 1,
            scaleY: 1,
            y: 0,
            duration: 0.36,
            ease: "power2.out",
            onStart: () => {
              gsap.set(overlay, { pointerEvents: "auto" });
            },
          })
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            0.05,
          )
          .to(
            "[data-menu-item]",
            {
              autoAlpha: 1,
              y: 0,
              skewX: 0,
              duration: 0.28,
              stagger: 0.04,
              ease: "power2.out",
            },
            0.1,
          );

        return () => {
          gsap.set(overlay, { pointerEvents: "none" });
        };
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]");
        const itemEntries = items.map((item) => {
          const text = item.querySelector<HTMLElement>("[data-menu-text]");
          const sheen = item.querySelector<HTMLElement>("[data-menu-sheen]");
          const tone = item.dataset.tone === "fuchsia" ? "fuchsia" : "cyan";
          return { item, text, sheen, tone };
        });

        gsap.set(overlay, {
          autoAlpha: isOpenRef.current ? 1 : 0,
          scaleY: isOpenRef.current ? 1 : 0.08,
          y: isOpenRef.current ? 0 : -28,
          clipPath: isOpenRef.current
            ? "inset(0 0 0% 0 round 0rem)"
            : "inset(0 0 96% 0 round 2rem)",
          transformOrigin: "top center",
          pointerEvents: isOpenRef.current ? "auto" : "none",
        });

        gsap.set(panel, {
          autoAlpha: isOpenRef.current ? 1 : 0,
          y: isOpenRef.current ? 0 : 44,
          scale: isOpenRef.current ? 1 : 0.96,
          transformPerspective: 1200,
        });

        gsap.set(items, {
          autoAlpha: isOpenRef.current ? 1 : 0,
          y: isOpenRef.current ? 0 : 50,
          skewX: isOpenRef.current ? 0 : 15,
          transformOrigin: "left center",
        });

        gsap.set([topLine, middleLine, bottomLine], {
          transformOrigin: "50% 50%",
        });

        buttonTlRef.current = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.22 } })
          .to(topLine, { y: 8, rotate: 45, scaleX: 1.05 }, 0)
          .to(middleLine, { autoAlpha: 0, scaleX: 0.15 }, 0)
          .to(bottomLine, { y: -8, rotate: -45, scaleX: 1.05 }, 0);

        menuTlRef.current = gsap
          .timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onReverseComplete: () => {
              gsap.set(overlay, { pointerEvents: "none" });
            },
          })
          .to(overlay, {
            autoAlpha: 1,
            scaleY: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0 round 0rem)",
            duration: 0.92,
            ease: "elastic.out(1, 0.75)",
            onStart: () => {
              gsap.set(overlay, { pointerEvents: "auto" });
            },
          })
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.48,
              ease: "power3.out",
            },
            0.12,
          )
          .to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              skewX: 0,
              duration: 0.58,
              stagger: 0.075,
              ease: "expo.out",
              onStart: () => {
                scrambleStopsRef.current.forEach((stop) => stop());
                scrambleStopsRef.current = [];

                itemEntries.forEach((entry, index) => {
                  if (!entry.text) return;

                  scrambleStopsRef.current.push(
                    createScramble({
                      element: entry.text,
                      finalText: entry.text.dataset.finalText ?? entry.text.textContent ?? "",
                      delay: 60 + index * 70,
                      duration: 420,
                    }),
                  );
                });
              },
            },
            0.24,
          );

        const magneticX = gsap.quickTo(menuButton, "x", {
          duration: 0.28,
          ease: "power3.out",
        });
        const magneticY = gsap.quickTo(menuButton, "y", {
          duration: 0.28,
          ease: "power3.out",
        });
        const magneticRotate = gsap.quickTo(menuButton, "rotate", {
          duration: 0.35,
          ease: "power3.out",
        });
        const magneticScale = gsap.quickTo(menuButton, "scale", {
          duration: 0.24,
          ease: "power3.out",
        });

        const handleButtonMove = (event: PointerEvent) => {
          const rect = menuButton.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          magneticX(clamp(x * 18, -18, 18));
          magneticY(clamp(y * 18, -18, 18));
          magneticRotate(clamp(x * 5, -5, 5));
          magneticScale(1.04);
        };

        const resetButton = () => {
          magneticX(0);
          magneticY(0);
          magneticRotate(0);
          magneticScale(1);
        };

        const handleButtonEnter = () => {
          magneticScale(1.04);
        };

        menuButton.addEventListener("pointermove", handleButtonMove, { passive: true });
        menuButton.addEventListener("pointerleave", resetButton);
        menuButton.addEventListener("pointercancel", resetButton);
        menuButton.addEventListener("pointerenter", handleButtonEnter);

        const hoverCleanup = itemEntries.map((entry) => {
          if (!entry.item || !entry.text || !entry.sheen) return () => void 0;

          const hoverColor = entry.tone === "fuchsia" ? "#f0abfc" : "#67e8f9";
          const baseColor = "rgba(255,255,255,0.92)";

          const onEnter = () => {
            gsap.killTweensOf([entry.text, entry.sheen]);
            gsap.to(entry.text, {
              color: hoverColor,
              duration: 0.16,
              ease: "power1.out",
            });
            gsap.fromTo(
              entry.sheen,
              { xPercent: -130, autoAlpha: 0 },
              {
                xPercent: 130,
                autoAlpha: 1,
                duration: 0.68,
                ease: "power3.out",
              },
            );
          };

          const onLeave = () => {
            gsap.to(entry.text, {
              color: baseColor,
              duration: 0.2,
              ease: "power2.out",
            });
            gsap.to(entry.sheen, {
              autoAlpha: 0,
              xPercent: 160,
              duration: 0.18,
              ease: "power1.out",
            });
          };

          entry.item.addEventListener("pointerenter", onEnter);
          entry.item.addEventListener("pointerleave", onLeave);

          return () => {
            entry.item.removeEventListener("pointerenter", onEnter);
            entry.item.removeEventListener("pointerleave", onLeave);
          };
        });

        if (isOpenRef.current) {
          buttonTlRef.current.progress(1);
          menuTlRef.current.progress(1);
        }

        return () => {
          menuButton.removeEventListener("pointermove", handleButtonMove);
          menuButton.removeEventListener("pointerleave", resetButton);
          menuButton.removeEventListener("pointercancel", resetButton);
          menuButton.removeEventListener("pointerenter", handleButtonEnter);
          hoverCleanup.forEach((cleanup) => cleanup());
          scrambleStopsRef.current.forEach((stop) => stop());
          scrambleStopsRef.current = [];
          magneticX(0);
          magneticY(0);
          magneticRotate(0);
          magneticScale(1);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const closeMenu = () => setIsOpen(false);

  return (
    <header ref={rootRef} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex max-w-7xl justify-end px-4 pt-4 md:px-8 md:pt-6">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="site-navigation-overlay"
          onClick={toggleMenu}
          className="pointer-events-auto relative z-[60] flex h-11 items-center gap-3 rounded-full border border-white/10 bg-black/55 px-4 text-white backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-0 md:h-12 md:px-5"
        >
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70 md:block">
            Menu
          </span>

          <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
            <span
              ref={topLineRef}
              className="block h-px w-full origin-center bg-white transition-[background-color] duration-200"
            />
            <span
              ref={middleLineRef}
              className="block h-px w-full origin-center bg-white transition-[background-color] duration-200"
            />
            <span
              ref={bottomLineRef}
              className="block h-px w-full origin-center bg-white transition-[background-color] duration-200"
            />
          </span>
        </button>
      </div>

      <div
        id="site-navigation-overlay"
        ref={overlayRef}
        aria-hidden={!isOpen}
        className="pointer-events-none fixed inset-0 z-50 bg-black/95 text-white opacity-0 [clip-path:inset(0_0_96%_0_round_2rem)]"
        onClick={closeMenu}
      >
        <div
          ref={panelRef}
          className="flex h-full w-full items-center justify-center px-6 py-24"
          onClick={(event) => event.stopPropagation()}
        >
          <nav aria-label="Primary navigation" className="w-full max-w-5xl">
            <ul className="flex w-full flex-col items-center gap-4 md:gap-5">
              {NAV_ITEMS.map((item, index) => (
                <li key={item.label} className="w-full">
                  <Link
                    href={item.href}
                    data-menu-item
                    data-tone={item.tone}
                    onClick={closeMenu}
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-5 py-4 text-center text-4xl font-black uppercase leading-none tracking-tight text-white/90 transition-colors duration-200 hover:border-white/20 md:px-6 md:py-5 md:text-6xl"
                  >
                    <span
                      data-menu-sheen
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-[-35%] w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] opacity-0 mix-blend-screen"
                    />
                    <span className="relative z-10" data-menu-text data-final-text={item.label}>
                      {item.label}
                    </span>
                    <span className="sr-only">{item.label}</span>

                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                        item.tone === "fuchsia"
                          ? "bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.15),transparent_62%)]"
                          : "bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_62%)]"
                      }`}
                    />

                    <span className="pointer-events-none absolute -right-1 top-1/2 hidden -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25 md:block">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
