'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2 } from 'lucide-react';
import { ScrollAnimatedHeading } from './ui/text-scroll-animation';

// React Icons (Si sets) for all 13 technologies
import {
  SiReact,
  SiNextdotjs,
  SiWordpress,
  SiElementor,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
} from 'react-icons/si';

// Support both SiCss3 and SiCss naming conventions
const SiCss3 = SiCss;

export interface TechItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  /** Exact official brand logo color */
  color: string;
}

export const TECH_STACK: TechItem[] = [
  { id: 'react', name: 'React', icon: SiReact, color: '#61DAFB' },
  { id: 'nextjs', name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { id: 'html', name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { id: 'css', name: 'CSS', icon: SiCss3, color: '#1572B6' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { id: 'typescript', name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { id: 'javascript', name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { id: 'nodejs', name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  { id: 'express', name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
  { id: 'postgresql', name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { id: 'mongodb', name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
];

export interface TechStackProps {
  className?: string;
  /** Optional override for radial expand distance in pixels */
  expandRadius?: number;
}

export default function TechStack({ className = '', expandRadius }: TechStackProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const centerEmblemRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    // Safely register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const glowRing = glowRingRef.current;
      const centerContent = centerContentRef.current;
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      /* ========================================================================
       * VIEWPORT-SAFE RADIUS & LAYOUT MATH:
       * 
       * 1. Safe Viewport Radius:
       *    Guarantees that cards at the top and bottom never get clipped by the
       *    viewport edges. We calculate available vertical/horizontal radius
       *    leaving ~90px buffer from screen top/bottom.
       * 
       * 2. Angle Calculation:
       *    Total icons = TECH_STACK.length (13 items).
       *    Angle step = (360 / totalIcons) ≈ 27.69° per icon.
       *    Offset = -90° (places index 0 directly at 12 o'clock / top center).
       *    Radians = ((360 / totalIcons) * index - 90) * (Math.PI / 180).
       * 
       * 3. Polar-to-Cartesian Coordinates:
       *    X = radius * Math.cos(radians)
       *    Y = radius * Math.sin(radians)
       * ======================================================================== */
      const totalIcons = TECH_STACK.length;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Ensure cards have comfortable margin from viewport edges
      const maxVerticalRadius = Math.max(130, Math.floor(vh / 2) - 95);
      const maxHorizontalRadius = Math.max(140, Math.floor(vw / 2) - 75);
      const computedRadius = Math.min(maxVerticalRadius, maxHorizontalRadius, 235);

      const targetRadius = expandRadius || computedRadius;

      /* ========================================================================
       * REDUCED MOTION HANDLING:
       * Show all icons immediately in a static evenly-spaced circle ring.
       * Skip the scroll-driven expansion and pinning.
       * Keep only a gentle CSS/GSAP glow pulse.
       * ======================================================================== */
      if (prefersReducedMotion) {
        cards.forEach((card, index) => {
          const angleDeg = (360 / totalIcons) * index - 90;
          const rad = (angleDeg * Math.PI) / 180;
          const x = Math.round(targetRadius * Math.cos(rad));
          const y = Math.round(targetRadius * Math.sin(rad));

          gsap.set(card, {
            x,
            y,
            scale: 1,
            opacity: 1,
          });
        });

        if (centerContent) {
          gsap.set(centerContent, { opacity: 1, scale: 1, y: 0 });
        }

        if (glowRing) {
          gsap.to(glowRing, {
            scale: 1.1,
            opacity: 0.6,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
        return;
      }

      /* ========================================================================
       * INITIAL SCROLL EXPANSION SETUP:
       * - All icons start at center (x: 0, y: 0, scale: 0.5, opacity: 0)
       * - Center content starts hidden
       * - Radius starts at 0
       * ======================================================================== */
      cards.forEach((card) => {
        gsap.set(card, {
          x: 0,
          y: 0,
          scale: 0.5,
          opacity: 0,
        });
      });

      if (centerContent) {
        gsap.set(centerContent, { opacity: 0, y: 15 });
      }

      if (glowRing) {
        gsap.set(glowRing, { scale: 0.6, opacity: 0.2 });
      }

      /* ========================================================================
       * GSAP SCROLLTRIGGER TIMELINE:
       * - Pin the section during window scroll (pin: true, scrub: true)
       * - Radial expansion (radius 0 -> targetRadius)
       * - Glow intensity increases as energy radiates outward
       * - Center content ("My Toolkit") fades in at ~80% expansion
       * ======================================================================== */
      const progressObj = { radius: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinContainerRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // SCROLL-TO-RADIUS MAPPING:
      // Updates x, y positions for each icon every scroll tick based on the expanding radius.
      tl.to(
        progressObj,
        {
          radius: targetRadius,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            const currentR = progressObj.radius;
            cards.forEach((card, index) => {
              // Compute uniform angle around the 360-degree circle
              const angleDeg = (360 / totalIcons) * index - 90;
              const rad = (angleDeg * Math.PI) / 180;

              // Compute X and Y offsets from center
              const x = currentR * Math.cos(rad);
              const y = currentR * Math.sin(rad);

              gsap.set(card, { x, y });
            });
          },
        },
        0
      );

      // Accent-blue radial glow expansion & intensity surge
      if (glowRing) {
        tl.to(
          glowRing,
          {
            scale: 1.35,
            opacity: 0.85,
            duration: 1.0,
            ease: 'none',
          },
          0
        );
      }

      // Staggered fade & scale for each icon card (0 -> 1 opacity, 0.5 -> 1 scale)
      cards.forEach((card, index) => {
        const startPoint = 0.06 + (index / totalIcons) * 0.38;
        const duration = 0.35;

        tl.to(
          card,
          {
            opacity: 1,
            scale: 1,
            duration,
            ease: 'back.out(1.4)',
          },
          startPoint
        );
      });

      // Center Content ("My Toolkit") fades in once icons are ~80% expanded
      if (centerContent) {
        tl.to(
          centerContent,
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          },
          0.8
        );
      }
    }, sectionRef);

    // Cleanup: Kill ScrollTrigger and revert context on unmount
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current || st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });
    };
  }, [expandRadius]);

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className={`relative w-full overflow-hidden bg-[#09080B] text-[#F8F4F0] select-none ${className}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <div
        ref={pinContainerRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* ====================================================================
         * EMBER NOIR RADIAL ACCENT GLOW:
         * Warm orange & deep red centered pulse that intensifies as icons expand outward.
         * ==================================================================== */}
        <div
          ref={glowRingRef}
          aria-hidden="true"
          className="pointer-events-none absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] rounded-full will-change-transform opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 74, 22, 0.35) 0%, rgba(141, 22, 13, 0.15) 45%, rgba(9, 8, 11, 0) 70%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Top Center Main Section Heading with Host Grotesk 70.4px & Scroll Animation */}
        <div className="absolute top-6 sm:top-10 md:top-12 inset-x-0 flex flex-col items-center justify-center text-center z-20 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4A16]/10 border border-[#FF4A16]/25 text-[#FF4A16] text-xs font-sans tracking-wide mb-2.5 font-medium shadow-[0_0_15px_rgba(255,74,22,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#FF4A16] animate-pulse" />
            <span>CORE CAPABILITIES // MODERN STACK</span>
          </div>
          <ScrollAnimatedHeading
            text="My Toolkit"
            className="text-center"
            characterClassName="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold text-[#F8F4F0] tracking-normal leading-none"
            style={{ fontFamily: "var(--font-host-grotesk), sans-serif" }}
          />
        </div>

        {/* Accent ring around center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#FF4A16]/25 shadow-[0_0_25px_rgba(255,74,22,0.15)]"
        />

        {/* ====================================================================
         * CENTER EMBLEM:
         * Sits directly in the middle of the pinned section.
         * ==================================================================== */}
        <div
          ref={centerEmblemRef}
          className="relative z-10 flex flex-col items-center justify-center text-center max-w-[260px] sm:max-w-xs px-4 pointer-events-none select-none"
        >
          {/* Minimal center icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 mb-2 rounded-full bg-[#151216] border border-[#FF4A16]/30 flex items-center justify-center text-[#FF4A16] shadow-[0_0_22px_rgba(255,74,22,0.35)]">
            <Code2 className="w-6 h-6 text-[#FF4A16]" />
          </div>

          {/* Fading center text block */}
          <div ref={centerContentRef} className="space-y-1 pointer-events-auto">
            <span className="text-xs sm:text-sm font-semibold text-[#F8F4F0] tracking-wide uppercase">
              11 Core Technologies
            </span>
            <p className="text-xs text-[#B8AEB0] font-normal leading-relaxed max-w-[200px] mx-auto">
              Production-tested stack
            </p>
          </div>
        </div>

        {/* ====================================================================
         * RADIAL TECH ICONS (11 TOTAL):
         * ==================================================================== */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {TECH_STACK.map((tech, index) => {
            const IconComponent = tech.icon;

            return (
              <div
                key={tech.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto will-change-transform"
              >
                <div
                  className="group relative w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-2xl bg-[#151216] border border-[rgba(248,244,240,0.12)] hover:border-[#FF4A16] hover:bg-[#21181B] transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(255,74,22,0.35)] hover:scale-110 flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
                  title={tech.name}
                >
                  {/* Tech Icon rendered with authentic brand logo color */}
                  <IconComponent
                    className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                    style={{ color: tech.color }}
                  />

                  {/* Tech Name Label */}
                  <span className="text-[9.5px] sm:text-[10px] font-sans tracking-tight text-[#B8AEB0] group-hover:text-[#F8F4F0] transition-colors duration-300 text-center px-1 truncate max-w-[90%]">
                    {tech.name}
                  </span>

                  {/* Corner accent glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#FF4A16]/40 transition-colors pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
