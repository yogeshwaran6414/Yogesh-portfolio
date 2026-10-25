'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface EmberRevealLoaderProps {
  onComplete?: () => void;
}

export default function EmberRevealLoader({ onComplete }: EmberRevealLoaderProps) {
  const masterContainerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);

  // Vertical Energy Beam along the center seam (NO horizontal lines)
  const beamWrapperRef = useRef<HTMLDivElement>(null);
  const verticalBeamCoreRef = useRef<HTMLDivElement>(null);
  const verticalBeamHaloRef = useRef<HTMLDivElement>(null);
  const leadingLightRef = useRef<HTMLDivElement>(null);
  const centerSeamGlowRef = useRef<HTMLDivElement>(null);

  // Background Nebula Haze inside doors
  const leftNebulaRef = useRef<HTMLDivElement>(null);
  const rightNebulaRef = useRef<HTMLDivElement>(null);

  // Typography & Monogram
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const monogramContainerRef = useRef<HTMLDivElement>(null);
  const monogramSvgRef = useRef<SVGSVGElement>(null);
  const nameTextRef = useRef<HTMLDivElement>(null);
  const taglineTextRef = useRef<HTMLDivElement>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).__HAS_EMBER_LOADER__ = true;
    (window as any).__HERO_ENTRANCE_TRIGGERED__ = false;

    // Lock scrolling while the intro animation is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const notifyHeroEntrance = () => {
      if ((window as any).__HERO_ENTRANCE_TRIGGERED__) return;
      (window as any).__HERO_ENTRANCE_TRIGGERED__ = true;
      window.dispatchEvent(new CustomEvent('hero:start-entrance'));
    };

    const finish = () => {
      notifyHeroEntrance();
      document.body.style.overflow = originalOverflow || '';
      setIsCompleted(true);
      onComplete?.();
    };

    // REDUCED MOTION: brief, gentle fade-out
    if (prefersReducedMotion) {
      notifyHeroEntrance();
      const timer = window.setTimeout(finish, 150);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = originalOverflow || '';
      };
    }

    // Safety fallback timer to prevent getting stuck under any condition
    const safetyTimer = window.setTimeout(finish, 4800);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safetyTimer);
          finish();
        },
      });

      // ======================================================================
      // PHASE 1 — Pure Black Screen (0.0s – 0.2s)
      // ======================================================================
      gsap.set(masterContainerRef.current, { opacity: 1 });
      gsap.set([leftDoorRef.current, rightDoorRef.current], { xPercent: 0 });

      // Vertical beam hidden initially
      gsap.set(verticalBeamCoreRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        opacity: 0,
      });
      gsap.set(verticalBeamHaloRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        opacity: 0,
      });
      gsap.set(leadingLightRef.current, {
        top: '0%',
        opacity: 0,
        scale: 0.5,
      });

      // Background haze & seam glow hidden initially
      gsap.set([leftNebulaRef.current, rightNebulaRef.current], {
        opacity: 0,
        scale: 0.85,
      });
      gsap.set(centerSeamGlowRef.current, { opacity: 0, scaleY: 0.8 });

      // Monogram & Typography hidden initially
      gsap.set(monogramContainerRef.current, {
        opacity: 0,
        scale: 0.85,
        transformOrigin: 'center center',
      });
      gsap.set(monogramSvgRef.current, {
        filter: 'brightness(0.2) drop-shadow(0 0 0px #FF4A16)',
      });
      gsap.set(nameTextRef.current, { yPercent: 115, opacity: 0 });
      gsap.set(taglineTextRef.current, { yPercent: 115, opacity: 0 });

      // ======================================================================
      // PHASE 2 — Vertical Energy Beam Sweeps from Top to Bottom (0.2s – 0.9s)
      // Visibly travels downward through the center
      // ======================================================================
      // 1. Leading light ray emerges from top edge
      tl.to(
        leadingLightRef.current,
        {
          opacity: 1,
          scale: 1.2,
          duration: 0.15,
          ease: 'power2.out',
        },
        0.2
      );

      // 2. Leading light travels down to center
      tl.to(
        leadingLightRef.current,
        {
          top: '50%',
          scale: 1.4,
          duration: 0.4,
          ease: 'power2.in',
        },
        0.2
      );

      // Core beam follows the leading light
      tl.to(
        [verticalBeamCoreRef.current, verticalBeamHaloRef.current],
        {
          scaleY: 0.55,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.in',
        },
        0.2
      );

      // Atmospheric ember haze softly blooms
      tl.to(
        [leftNebulaRef.current, rightNebulaRef.current],
        {
          opacity: 0.85,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.35
      );

      // 3. Leading light sweeps from center down to bottom edge
      tl.to(
        leadingLightRef.current,
        {
          top: '100%',
          opacity: 0.2,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.6
      );

      // Core beam extends all the way to 100% height
      tl.to(
        [verticalBeamCoreRef.current, verticalBeamHaloRef.current],
        {
          scaleY: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.6
      );

      // ======================================================================
      // PHASE 3 — Monogram “Y” Ignition (0.6s – 1.3s)
      // As the beam sweeps through, the 3D beveled monogram illuminates
      // ======================================================================
      tl.to(
        monogramContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.6
      );

      tl.to(
        monogramSvgRef.current,
        {
          filter:
            'brightness(1.3) drop-shadow(0 0 28px #FF4A16) drop-shadow(0 0 65px rgba(255,107,53,0.75))',
          duration: 0.55,
          ease: 'power2.out',
        },
        0.6
      );

      tl.to(
        monogramSvgRef.current,
        {
          filter:
            'brightness(1.05) drop-shadow(0 0 18px #FF4A16) drop-shadow(0 0 45px rgba(255,74,22,0.5))',
          duration: 0.45,
          ease: 'sine.inOut',
        },
        1.15
      );

      // ======================================================================
      // PHASE 4 — Reveal Name & Tagline (1.1s – 1.7s)
      // Clean vertical mask reveal for YOGESHWARAN K. and DESIGN. DEVELOP. DELIVER.
      // ======================================================================
      tl.to(
        nameTextRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        1.1
      );

      tl.to(
        taglineTextRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        },
        1.35
      );

      // ======================================================================
      // PHASE 5 — Reading Hold (1.7s – 2.9s)
      // ~1.2s comfortable reading hold so the visitor can comfortably read
      // the monogram, name, and tagline.
      // Subtle organic breathing of the center seam keeps it alive.
      // ======================================================================
      tl.to(
        centerSeamGlowRef.current,
        {
          opacity: 0.75,
          scaleY: 1,
          duration: 0.6,
          ease: 'sine.inOut',
        },
        1.7
      );

      tl.to(
        centerSeamGlowRef.current,
        {
          opacity: 0.95,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        },
        2.3
      );

      // ======================================================================
      // PHASE 6 — Door Opening Transition: LEFT & RIGHT (2.95s – 3.75s)
      // 1. Light intensifies along the vertical seam
      // 2. Left door slides smoothly to the LEFT (-100%)
      // 3. Right door slides smoothly to the RIGHT (+100%)
      // Unveiling the hero section underneath!
      // ======================================================================
      // Seam light flare crescendo
      tl.to(
        [centerSeamGlowRef.current, verticalBeamCoreRef.current, verticalBeamHaloRef.current],
        {
          opacity: 1.6,
          scaleX: 2.2,
          duration: 0.25,
          ease: 'power2.in',
        },
        2.9
      );

      // Double-doors part: Left door slides LEFT (-100%), Right door slides RIGHT (+100%)
      tl.to(
        leftDoorRef.current,
        {
          xPercent: -100,
          duration: 0.75,
          ease: 'power3.inOut',
          onStart: () => {
            notifyHeroEntrance();
          },
        },
        3.05
      );

      tl.to(
        rightDoorRef.current,
        {
          xPercent: 100,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        3.05
      );

      // Central content and vertical seam dissolve as the doors part open
      tl.to(
        contentWrapperRef.current,
        {
          opacity: 0,
          scale: 1.05,
          duration: 0.45,
          ease: 'power2.in',
        },
        3.05
      );

      tl.to(
        [
          beamWrapperRef.current,
          verticalBeamCoreRef.current,
          verticalBeamHaloRef.current,
          centerSeamGlowRef.current,
        ],
        {
          opacity: 0,
          scaleX: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        3.15
      );

      // Master container cleanup
      tl.to(
        masterContainerRef.current,
        {
          opacity: 0,
          duration: 0.1,
          ease: 'none',
        },
        3.72
      );
    }, masterContainerRef);

    return () => {
      window.clearTimeout(safetyTimer);
      ctx.revert();
      document.body.style.overflow = originalOverflow || '';
      (window as any).__HAS_EMBER_LOADER__ = false;
      notifyHeroEntrance();
    };
  }, [onComplete]);

  if (isCompleted) return null;

  return (
    <aside
      ref={masterContainerRef}
      data-ember-loader="true"
      role="status"
      aria-label="Loading portfolio experience"
      aria-live="polite"
      className="fixed inset-0 z-[99999] text-[#F8F4F0] select-none pointer-events-auto overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        willChange: 'opacity',
      }}
    >
      {/* =====================================================================
          LEFT DOOR PANEL (0% to 50% width)
          Slides to the LEFT (xPercent: -100) when opening
          ===================================================================== */}
      <div
        ref={leftDoorRef}
        className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden bg-[#050303]"
        style={{ willChange: 'transform' }}
      >
        {/* Left half of atmospheric ember nebula */}
        <div
          ref={leftNebulaRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[min(800px,120vw)] h-[min(800px,120vw)] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 74, 22, 0.35) 0%, rgba(200, 45, 12, 0.18) 30%, rgba(120, 20, 8, 0.06) 58%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* =====================================================================
          RIGHT DOOR PANEL (50% to 100% width)
          Slides to the RIGHT (xPercent: 100) when opening
          ===================================================================== */}
      <div
        ref={rightDoorRef}
        className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden bg-[#050303]"
        style={{ willChange: 'transform' }}
      >
        {/* Right half of atmospheric ember nebula */}
        <div
          ref={rightNebulaRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[min(800px,120vw)] h-[min(800px,120vw)] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 74, 22, 0.35) 0%, rgba(200, 45, 12, 0.18) 30%, rgba(120, 20, 8, 0.06) 58%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* =====================================================================
          VERTICAL ENERGY BEAM (From Top to Bottom along Center Seam)
          NO horizontal lines anywhere
          ===================================================================== */}
      <div
        ref={beamWrapperRef}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center"
        style={{ width: '120px', willChange: 'opacity, transform' }}
      >
        {/* Soft Ambient Seam Glow */}
        <div
          ref={centerSeamGlowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 74, 22, 0.08) 25%, rgba(255, 107, 53, 0.45) 50%, rgba(255, 74, 22, 0.08) 75%, transparent 100%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Vertical Beam Halo (Atmospheric Orange Glow) */}
        <div
          ref={verticalBeamHaloRef}
          className="absolute top-0 bottom-0 w-[50px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 74, 22, 0.1) 25%, rgba(255, 107, 53, 0.6) 50%, rgba(255, 74, 22, 0.1) 75%, transparent 100%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Vertical Beam Core (Razor-thin pure white-hot 2px line) */}
        <div
          ref={verticalBeamCoreRef}
          className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none"
          style={{
            boxShadow:
              '0 0 6px 1px #FFFFFF, 0 0 16px 3px #FF6B35, 0 0 35px 8px #FF4A16, 0 0 75px 18px #8D160D',
          }}
        />

        {/* Leading Light Head traveling down during Phase 2 */}
        <div
          ref={leadingLightRef}
          className="absolute top-0 w-[22px] h-[22px] -translate-y-1/2 pointer-events-none flex items-center justify-center"
          style={{ willChange: 'top, opacity, transform' }}
        >
          <div
            className="w-[10px] h-[10px] bg-white rounded-full"
            style={{
              boxShadow:
                '0 0 18px 6px #FFFFFF, 0 0 40px 14px #FF6B35, 0 0 75px 24px #FF4A16',
            }}
          />
        </div>
      </div>

      {/* =====================================================================
          CENTER COMPOSITION: Monogram “Y”, Name, and Tagline
          Positioned directly at the center of the viewport
          ===================================================================== */}
      <div
        ref={contentWrapperRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        style={{ willChange: 'opacity, transform' }}
      >
        {/* 3D Beveled Monogram “Y” matching the reference image */}
        <div
          ref={monogramContainerRef}
          className="mb-5 sm:mb-6 relative flex items-center justify-center"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Monogram Backlight Aura */}
          <div
            className="absolute -inset-8 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 107, 53, 0.45) 0%, rgba(255, 74, 22, 0.2) 45%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Precision 3D Faceted Vector Monogram “Y” */}
          <svg
            ref={monogramSvgRef}
            viewBox="0 0 96 112"
            className="w-[80px] h-[94px] sm:w-[94px] sm:h-[110px] md:w-[104px] md:h-[122px] overflow-visible"
            aria-hidden="true"
            style={{ willChange: 'filter' }}
          >
            <defs>
              {/* Left Arm Outer Shadow Facet */}
              <linearGradient id="door-facet-left-outer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8A2C14" />
                <stop offset="50%" stopColor="#5E1A0B" />
                <stop offset="100%" stopColor="#2E0A04" />
              </linearGradient>

              {/* Left Arm Inner Specular Facet */}
              <linearGradient id="door-facet-left-inner" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF7A30" />
                <stop offset="45%" stopColor="#DE4F18" />
                <stop offset="100%" stopColor="#7E200A" />
              </linearGradient>

              {/* Right Arm Inner Fiery Facet */}
              <linearGradient id="door-facet-right-inner" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFB35C" />
                <stop offset="40%" stopColor="#FF6B1A" />
                <stop offset="100%" stopColor="#C93608" />
              </linearGradient>

              {/* Right Arm Outer Golden Highlight Facet */}
              <linearGradient id="door-facet-right-outer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE0A3" />
                <stop offset="35%" stopColor="#FF9933" />
                <stop offset="70%" stopColor="#E65210" />
                <stop offset="100%" stopColor="#8A2006" />
              </linearGradient>

              {/* Stem Left Facet (Shadow) */}
              <linearGradient id="door-facet-stem-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6E2310" />
                <stop offset="100%" stopColor="#3B0E05" />
              </linearGradient>

              {/* Stem Right Facet (Highlight) */}
              <linearGradient id="door-facet-stem-right" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFA64D" />
                <stop offset="45%" stopColor="#E65B15" />
                <stop offset="100%" stopColor="#A82F08" />
              </linearGradient>

              {/* Top Rim Specular Gradient */}
              <linearGradient id="door-rim-highlight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8844" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFE0A0" />
              </linearGradient>
            </defs>

            {/* 3D Beveled Monogram Facets */}
            <g>
              {/* 1. Left Arm - Outer Facet */}
              <polygon
                points="0,0 14,0 48,52 36,52"
                fill="url(#door-facet-left-outer)"
              />

              {/* 2. Left Arm - Inner Facet */}
              <polygon
                points="14,0 28,0 48,40 48,52"
                fill="url(#door-facet-left-inner)"
              />

              {/* 3. Right Arm - Inner Facet */}
              <polygon
                points="48,40 68,0 82,0 48,52"
                fill="url(#door-facet-right-inner)"
              />

              {/* 4. Right Arm - Outer Facet */}
              <polygon
                points="82,0 96,0 60,52 48,52"
                fill="url(#door-facet-right-outer)"
              />

              {/* 5. Stem - Left Facet */}
              <polygon
                points="36,52 48,52 48,112 36,112"
                fill="url(#door-facet-stem-left)"
              />

              {/* 6. Stem - Right Facet */}
              <polygon
                points="48,52 60,52 60,112 48,112"
                fill="url(#door-facet-stem-right)"
              />

              {/* Center Bevel Ridge Lines */}
              <polyline
                points="14,0 48,52"
                fill="none"
                stroke="#FFC285"
                strokeWidth="0.8"
                opacity="0.85"
              />
              <polyline
                points="82,0 48,52"
                fill="none"
                stroke="#FFF3DC"
                strokeWidth="1.2"
                opacity="0.95"
              />
              <line
                x1="48"
                y1="52"
                x2="48"
                y2="112"
                stroke="#FFF3DC"
                strokeWidth="1.2"
                opacity="0.9"
              />

              {/* Top Edge Rim Lighting */}
              <line
                x1="0"
                y1="0.5"
                x2="28"
                y2="0.5"
                stroke="url(#door-rim-highlight)"
                strokeWidth="1"
              />
              <line
                x1="68"
                y1="0.5"
                x2="96"
                y2="0.5"
                stroke="url(#door-rim-highlight)"
                strokeWidth="1.2"
              />
            </g>
          </svg>
        </div>

        {/* Name: YOGESHWARAN K. with vertical mask */}
        <div className="overflow-hidden py-1 mb-2">
          <h1
            ref={nameTextRef}
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.38em] text-[#FFFFFF] uppercase leading-tight font-sans text-center"
            style={{
              fontFamily:
                "var(--font-sora), var(--font-host-grotesk), 'Montserrat', sans-serif",
              textShadow:
                '0 0 14px rgba(255, 120, 50, 0.5), 0 0 30px rgba(255, 74, 22, 0.35)',
            }}
          >
            YOGESHWARAN K.
          </h1>
        </div>

        {/* Tagline: DESIGN. DEVELOP. DELIVER. with vertical mask (NO horizontal line) */}
        <div className="overflow-hidden py-1">
          <p
            ref={taglineTextRef}
            className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.32em] uppercase text-[#F2C2A0] text-center"
            style={{
              fontFamily:
                "var(--font-sora), var(--font-host-grotesk), 'Inter', sans-serif",
              textShadow:
                '0 0 10px rgba(255, 107, 53, 0.5), 0 0 20px rgba(255, 74, 22, 0.3)',
            }}
          >
            DESIGN. DEVELOP. DELIVER.
          </p>
        </div>
      </div>
    </aside>
  );
}
