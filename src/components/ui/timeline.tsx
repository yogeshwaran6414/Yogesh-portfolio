// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollAnimatedHeading } from "./text-scroll-animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the
   context is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

export type Month = keyof typeof monthOrder;

export type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  content: string;
};

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
  topJourneyData?: JourneyItem[];
  bottomJourneyData?: JourneyItem[];
  id?: string;
  className?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

export const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "2020-march",
    year: "2020",
    month: "March",
    content: "Signal research turns scattered notes into a clear product thesis",
  },
  {
    id: "2021-july",
    year: "2021",
    month: "July",
    content: "Founding release ships with the first live customer journeys",
  },
  {
    id: "2023-april",
    year: "2023",
    month: "April",
    content: "Automation layer connects insight, publishing, and sales motion",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    content: "New markets open with localized launches and faster onboarding",
  },
];

export const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "2020-november",
    year: "2020",
    month: "November",
    content: "Prototype sprint validates the experience with real operators",
  },
  {
    id: "2022-october",
    year: "2022",
    month: "October",
    content: "Community feedback reshapes the roadmap into sharper releases",
  },
  {
    id: "2025-september",
    year: "2025",
    month: "September",
    content: "Companion mobile workflows make the timeline travel-ready",
  },
];

export default function Timeline({
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  activeColor = "#ff5f00",
  backgroundColor = "var(--color-background, #ffffff)",
  duration,
  scrollDuration = 1.2,
  topJourneyData: topJourneyProp,
  bottomJourneyData: bottomJourneyProp,
  id = "journey",
  className = "",
}: TimelineProps) {
  const topJourneyData = topJourneyProp ?? defaultTopJourneyData;
  const bottomJourneyData = bottomJourneyProp ?? defaultBottomJourneyData;

  const allJourneyItems = React.useMemo(() => {
    return [...topJourneyData, ...bottomJourneyData].sort((a, b) => {
      const yearDiff = Number(a.year) - Number(b.year);
      if (yearDiff !== 0) return yearDiff;
      return monthOrder[a.month] - monthOrder[b.month];
    });
  }, [topJourneyData, bottomJourneyData]);

  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);
  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const isMobile = window.innerWidth < 600;
    const slidePercent = isMobile ? -58 : -52;
    const lineWidth = isMobile ? "80%" : "98%";
    const lineStart = isMobile ? "top 25%" : "top 20%";
    const slideEnd = isMobile ? "85% 50%" : "92% bottom";
    const lineEnd = isMobile ? "82% 50%" : "92% bottom";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: slideEnd,
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });

    tl.fromTo(
      wholeSliderRef.current,
      { xPercent: 0 },
      { xPercent: slidePercent },
    );

    if (reducedMotion) {
      gsap.set(".journey-line", { width: lineWidth });
      return;
    }

    gsap.to(".journey-line", {
      width: lineWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: lineStart,
        end: lineEnd,
        scrub: true,
      },
    });
  }, { dependencies: [reducedMotion], scope: sectionRef });

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = allJourneyItems;

    items.forEach((item) => {
      gsap.set(`.jl-${item.id}`, {
        scaleY: reducedMotion ? 1 : 0.25,
        opacity: reducedMotion ? 1 : 0.45,
      });
      gsap.set(`.jd-${item.id}`, {
        scale: reducedMotion ? 1 : 0.75,
        opacity: reducedMotion ? 1 : 0.6,
      });
      gsap.set(`.card-${item.id}`, {
        opacity: reducedMotion ? 1 : 0.9,
      });
    });

    const createItemTimeline = (
      item: JourneyItem,
      startPos: number,
      endPos: number,
    ) => {
      const lineSelector = `.jl-${item.id}`;
      const dotSelector = `.jd-${item.id}`;
      const cardSelector = `.card-${item.id}`;

      if (reducedMotion) {
        gsap.set(lineSelector, { scaleY: 1, opacity: 1 });
        gsap.set(dotSelector, { scale: 1, opacity: 1 });
        gsap.set(cardSelector, { opacity: 1 });
        return;
      }

      const isTop = topJourneyData.some((topItem) => topItem.id === item.id);
      gsap.set(lineSelector, {
        transformOrigin: isTop ? "bottom center" : "top center",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `${startPos}% 40%`,
          end: `${endPos}% 55%`,
          scrub: true,
        },
      });

      timeline
        .to(lineSelector, {
          scaleY: 1,
          opacity: 1,
          duration: normalizedDuration * 0.4,
        })
        .to(
          dotSelector,
          {
            scale: 1.35,
            opacity: 1,
            boxShadow: "0 0 16px rgba(255, 74, 22, 0.8)",
            duration: normalizedDuration * 0.4,
          },
          "<",
        )
        .to(
          cardSelector,
          {
            opacity: 1,
            duration: normalizedDuration * 0.4,
            ease: "power2.out",
          },
          "<",
        );

      return timeline;
    };

    const positions: ReadonlyArray<readonly [number, number]> =
      window.innerWidth < 600
        ? [
            [8, 20],
            [16, 28],
            [24, 36],
            [32, 44],
            [40, 52],
            [48, 60],
            [56, 68],
          ]
        : [
            [4, 16],
            [12, 24],
            [20, 32],
            [28, 40],
            [36, 48],
            [44, 56],
            [52, 64],
          ];

    items.forEach((item, index) => {
      const pos = positions[index] || [
        Math.min(90, 4 + index * 8),
        Math.min(98, 16 + index * 8),
      ];
      createItemTimeline(item, pos[0], pos[1]);
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [normalizedDuration, reducedMotion, allJourneyItems], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`h-[180vw] max-[600px]:h-[350vh] w-full relative ${className}`}
      style={sectionStyle}
    >
      <div className="h-screen max-h-[100svh] w-screen sticky top-0 overflow-hidden flex flex-col justify-between py-4 sm:py-6 md:py-8">
        
        {/* Top Center Main Section Heading with Host Grotesk & Spaced Typography */}
        <div className="w-full px-[5vw] sm:px-[6vw] flex flex-col items-center justify-center text-center z-20 shrink-0 pt-2">
          {periodLabel && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4A16]/10 border border-[#FF4A16]/20 text-[#FF4A16] text-xs font-mono mb-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF4A16] animate-pulse" />
              <span>{periodLabel}</span>
            </div>
          )}
          <ScrollAnimatedHeading
            text={title}
            className="text-center"
            characterClassName="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold tracking-normal text-[#201819]"
            style={{ fontFamily: "var(--font-host-grotesk), sans-serif" }}
          />
        </div>

        {/* Timeline Horizontal Track (Fits 100% inside viewport, zero cut off) */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-x-hidden overflow-y-visible my-auto">
          <div
            ref={wholeSliderRef}
            className="relative flex h-[440px] sm:h-[480px] max-h-[64vh] w-[210vw] items-center px-[6vw] max-[600px]:h-[70vh] max-[600px]:w-[700vw] max-[600px]:px-[7vw]"
          >
            {/* Center Horizontal Journey Line */}
            <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 flex items-center h-fit z-10 pointer-events-none">
              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_12px_rgba(255,74,22,0.6)]"
                style={activeStyle}
              />
              <div
                className="h-[2px] w-[0%] rounded-full journey-line"
                style={activeStyle}
              />
              <div
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_12px_rgba(255,74,22,0.6)]"
                style={activeStyle}
              />
            </div>

            {/* Top Half: Top Milestones (Above Center Line) */}
            <div className="absolute inset-x-0 top-0 h-1/2 flex items-end">
              <div className="w-full flex items-end gap-x-[14vw] ml-[3vw] max-[600px]:gap-x-[40vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className={`card-${item.id} relative w-[28vw] min-w-[260px] max-w-[360px] flex flex-col items-start justify-end pb-1 max-[600px]:w-[70vw] transition-opacity duration-300`}
                  >
                    {/* Content Box */}
                    <div className="space-y-1.5 mb-2 bg-[#F8F4F0] border border-[#201819]/15 rounded-xl p-3 shadow-md hover:border-[#FF4A16]/50 transition-colors w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4A16]/10 text-[#FF4A16] text-[11px] font-mono font-bold">
                        <span>{item.year}</span>
                        <span>·</span>
                        <span>{item.month}</span>
                      </div>
                      <p
                        className={`description-${item.id} text-xs sm:text-[13px] text-[#201819] leading-snug`}
                      >
                        {item.content}
                      </p>
                    </div>

                    {/* Vertical Connector Down to Center Line */}
                    <div className="relative w-full flex flex-col items-center">
                      <div
                        className={`size-2.5 rounded-full jd-${item.id} relative z-20`}
                        style={activeStyle}
                      />
                      <div
                        className={`w-[2px] h-6 sm:h-8 origin-bottom jl-${item.id}`}
                        style={activeStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Half: Bottom Milestones (Below Center Line) */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-start">
              <div className="w-full flex items-start gap-x-[18vw] ml-[15vw] max-[600px]:gap-x-[40vw] max-[600px]:ml-[25vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className={`card-${item.id} relative w-[28vw] min-w-[260px] max-w-[360px] flex flex-col items-start justify-start pt-1 max-[600px]:w-[70vw] transition-opacity duration-300`}
                  >
                    {/* Vertical Connector Up to Center Line */}
                    <div className="relative w-full flex flex-col items-center mb-2">
                      <div
                        className={`w-[2px] h-6 sm:h-8 origin-top jl-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`size-2.5 rounded-full jd-${item.id} relative z-20`}
                        style={activeStyle}
                      />
                    </div>

                    {/* Content Box */}
                    <div className="space-y-1.5 bg-[#F8F4F0] border border-[#201819]/15 rounded-xl p-3 shadow-md hover:border-[#FF4A16]/50 transition-colors w-full">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4A16]/10 text-[#FF4A16] text-[11px] font-mono font-bold">
                        <span>{item.year}</span>
                        <span>·</span>
                        <span>{item.month}</span>
                      </div>
                      <p
                        className={`description-${item.id} text-xs sm:text-[13px] text-[#201819] leading-snug`}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom subtle scroll hint */}
        <div className="w-full text-center z-10 shrink-0 pb-1">
          <span className="text-[11px] font-mono text-[#756A68] uppercase tracking-widest">
            Scroll to explore milestone journey // 2021 — 2026
          </span>
        </div>
      </div>
    </section>
  );
}
