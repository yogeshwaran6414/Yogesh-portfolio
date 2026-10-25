'use client';

import React, { useEffect, useRef, useState, useCallback, useId } from 'react';

/**
 * ============================================================================
 * HERO SPIDER-MAN MASK REVEAL COMPONENT
 * ============================================================================
 * 
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      DROP-IN SETUP FOR YOUR SVG                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ 1. PLACE YOUR TRACED SVG PATH:                                          ║
 * ║    Replace `DEFAULT_MASK_PATH_DATA` below (or pass via `maskPathData`   ║
 * ║    prop) with the exact path data from your `mask-outline.svg`.         ║
 * ║                                                                          ║
 * ║ 2. CRITICAL VIEWBOX ALIGNMENT NOTE:                                     ║
 * ║    The SVG `viewBox` (default "0 0 800 1000") MUST MATCH THE EXACT       ║
 * ║    WIDTH AND HEIGHT OF YOUR HERO PHOTO in Figma/Illustrator when you     ║
 * ║    traced the mask. Any discrepancy in aspect ratio or viewBox bounds   ║
 * ║    will offset the mask relative to your facial features.               ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

export const DEFAULT_MASK_VIEWBOX = '0 0 800 1000';

/**
 * Fallback mask path template.
 * REPLACE THIS STRING with your hand-traced mask-outline.svg path(s),
 * or pass your path via the `maskPathData` prop.
 */
export const DEFAULT_MASK_PATH_DATA =
  'M 400,180 C 450,180 530,220 545,310 C 560,400 550,510 500,600 C 465,660 415,700 400,710 C 385,700 335,660 300,600 C 250,510 240,400 255,310 C 270,220 350,180 400,180 Z ' +
  // Angular Eyes / Lenses
  'M 330,370 C 355,360 380,380 385,410 C 385,425 365,450 330,460 C 305,455 295,420 305,390 C 315,375 325,372 330,370 Z ' +
  'M 470,370 C 445,360 420,380 415,410 C 415,425 435,450 470,460 C 495,455 505,420 495,390 C 485,375 475,372 470,370 Z ' +
  // Web Strands across the face
  'M 400,180 L 400,710 M 270,340 Q 400,380 530,340 M 255,420 Q 400,470 545,420 M 270,510 Q 400,560 530,510 M 310,610 Q 400,650 490,610';

export interface HeroMaskRevealProps {
  /** The clean base photo URL or path (full color, always rendered underneath) */
  baseImage: string;
  /** Optional custom recolored/treated mask overlay photo. Defaults to baseImage treated with Spider-Man mask filter */
  maskOverlayImage?: string;
  /** Image alt text */
  alt?: string;
  /** Container height or custom classes */
  className?: string;
  /** Radius in pixels of the soft reveal window (default: 75px) */
  revealRadius?: number;
  /** Duration of full top-to-bottom scan cycle in ms (default: 2600ms) */
  scanDuration?: number;
  /** Traced SVG path d-attribute. If omitted, DEFAULT_MASK_PATH_DATA is used */
  maskPathData?: string;
  /** SVG viewBox matching the photo's original pixel dimensions (default: "0 0 800 1000") */
  viewBox?: string;
}

export const HeroMaskReveal: React.FC<HeroMaskRevealProps> = ({
  baseImage,
  maskOverlayImage,
  alt = 'Developer Hero Portrait',
  className = '',
  revealRadius = 75,
  scanDuration = 2600,
  maskPathData = DEFAULT_MASK_PATH_DATA,
  viewBox = DEFAULT_MASK_VIEWBOX,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const coreGradientRef = useRef<SVGLinearGradientElement>(null);

  // Generate unique IDs for SVG clipPaths and gradients to prevent DOM collisions
  const uniqueId = useId().replace(/:/g, '');
  const clipId = `mask-clip-${uniqueId}`;
  const gradientId = `scan-grad-${uniqueId}`;
  const coreGradientId = `scan-core-grad-${uniqueId}`;

  // Accessibility and touch detection
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Pointer position & smooth reveal decay state
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const currentRadiusRef = useRef<number>(0);
  const targetRadiusRef = useRef<number>(0);
  const rafRevealIdRef = useRef<number | null>(null);

  // Check touch devices and reduced-motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(touchQuery.matches);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 1. IDLE ANIMATION: Top-to-Bottom Continuous Scan Glow
  // --------------------------------------------------------------------------
  useEffect(() => {
    // If reduced motion is requested, keep the glow static and skip RAF
    if (reducedMotion) return;

    let scanRafId: number;
    const startTime = performance.now();

    const animateScan = (now: number) => {
      const elapsed = (now - startTime) % scanDuration;
      const progress = elapsed / scanDuration; // 0.0 -> 1.0

      // Animate gradient from -35% (above the top) to 135% (below the bottom)
      const center = -0.35 + progress * 1.7;
      const spread = 0.22; // width of the highlight band

      const y1 = Math.max(-0.5, center - spread);
      const y2 = Math.min(1.5, center + spread);

      if (gradientRef.current) {
        gradientRef.current.setAttribute('y1', `${(y1 * 100).toFixed(2)}%`);
        gradientRef.current.setAttribute('y2', `${(y2 * 100).toFixed(2)}%`);
      }

      if (coreGradientRef.current) {
        coreGradientRef.current.setAttribute('y1', `${(y1 * 100).toFixed(2)}%`);
        coreGradientRef.current.setAttribute('y2', `${(y2 * 100).toFixed(2)}%`);
      }

      scanRafId = requestAnimationFrame(animateScan);
    };

    scanRafId = requestAnimationFrame(animateScan);

    return () => {
      cancelAnimationFrame(scanRafId);
    };
  }, [reducedMotion, scanDuration]);

  // --------------------------------------------------------------------------
  // 2. HOVER REVEAL: Smooth Cursor-Following Soft Window Punch
  // --------------------------------------------------------------------------
  const updateOverlayMask = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Smooth asymptotic decay/glide toward target radius (~300ms feel)
    const decaySpeed = targetRadiusRef.current > currentRadiusRef.current ? 0.35 : 0.12;
    currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * decaySpeed;

    const r = currentRadiusRef.current;
    const { x, y } = mousePosRef.current;

    if (r > 0.5) {
      // Punches a soft circular window through the RED OVERLAY LAYER:
      // Center (0% - 40%) is TRANSPARENT (reveals the base photo underneath)
      // Edge (40% - 100%) feathers smoothly into BLACK (keeps the mask intact)
      const maskGradient = `radial-gradient(circle ${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, transparent 0%, transparent 42%, rgba(0,0,0,0.85) 80%, black 100%)`;
      overlay.style.webkitMaskImage = maskGradient;
      overlay.style.maskImage = maskGradient;
    } else {
      // Fully covered (no reveal hole)
      overlay.style.webkitMaskImage = 'none';
      overlay.style.maskImage = 'none';
    }

    // Continue loop until radius settles at 0 or target
    if (Math.abs(targetRadiusRef.current - currentRadiusRef.current) > 0.2 || targetRadiusRef.current > 0) {
      rafRevealIdRef.current = requestAnimationFrame(updateOverlayMask);
    } else {
      rafRevealIdRef.current = null;
    }
  }, []);

  const scheduleMaskUpdate = useCallback(() => {
    if (!rafRevealIdRef.current) {
      rafRevealIdRef.current = requestAnimationFrame(updateOverlayMask);
    }
  }, [updateOverlayMask]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // On touch devices or reduced motion, skip cursor follow reveal
    if (isTouchDevice || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    targetRadiusRef.current = revealRadius;
    setIsHovered(true);
    scheduleMaskUpdate();
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchDevice || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    targetRadiusRef.current = revealRadius;
    setIsHovered(true);
    scheduleMaskUpdate();
  };

  const handlePointerLeave = () => {
    if (isTouchDevice || reducedMotion) return;

    // Smoothly decay reveal hole back to 0px on leave (~300ms ease-out)
    targetRadiusRef.current = 0;
    setIsHovered(false);
    scheduleMaskUpdate();
  };

  useEffect(() => {
    return () => {
      if (rafRevealIdRef.current) {
        cancelAnimationFrame(rafRevealIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none touch-none cursor-pointer overflow-hidden ${className}`}
      style={{
        // Maintain consistent container aspect ratio matching traced photo
        aspectRatio: '8 / 10',
      }}
    >
      {/* ====================================================================
       * SVG DEFS (Shared clipPath & animated linearGradients)
       * ==================================================================== */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* 
            ClipPath using the traced Spider-Man mask outline path.
            Uses objectBoundingBox scaling so it always scales 1:1 with photo!
          */}
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={maskPathData} />
          </clipPath>

          {/* Animated Spider-Man Red Scan Gradient (4-6px outer stroke glow) */}
          <linearGradient
            id={gradientId}
            ref={gradientRef}
            x1="0%"
            y1={reducedMotion ? '0%' : '-30%'}
            x2="0%"
            y2={reducedMotion ? '100%' : '30%'}
          >
            <stop offset="0%" stopColor="#e62429" stopOpacity="0" />
            <stop offset="35%" stopColor="#e62429" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="65%" stopColor="#e62429" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e62429" stopOpacity="0" />
          </linearGradient>

          {/* Animated Pure White Core Scan Gradient (Pinpoint laser highlight) */}
          <linearGradient
            id={coreGradientId}
            ref={coreGradientRef}
            x1="0%"
            y1={reducedMotion ? '0%' : '-30%'}
            x2="0%"
            y2={reducedMotion ? '100%' : '30%'}
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ====================================================================
       * LAYER 1: BASE LAYER
       * The real, unedited full-color photo. Always rendered at the bottom.
       * ==================================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img
          src={baseImage}
          alt={alt}
          className="w-full h-full object-cover object-center block"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* ====================================================================
       * LAYER 2: OVERLAY LAYER (Red Mask Visual)
       * Clipped strictly to the traced mask-outline path.
       * Soft circular window is punched through on cursor hover.
       * ==================================================================== */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 will-change-[mask-image] transition-[opacity] duration-300"
        style={{
          // Clip the red treated image strictly to the traced mask area
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        {/*
          The overlay image: If a dedicated recolored mask image is passed, render it.
          Otherwise, render the base photo enhanced with an intense Spider-Man red grade.
        */}
        <div className="relative w-full h-full">
          <img
            src={maskOverlayImage || baseImage}
            alt="Spider-Man Mask Overlay"
            className="w-full h-full object-cover object-center block"
            style={{
              // Authentic Spider-Man suit red filter grade if using base image
              filter: maskOverlayImage
                ? undefined
                : 'sepia(0.85) saturate(4.5) hue-rotate(-50deg) contrast(1.25) brightness(0.92)',
            }}
          />

          {/* Red suit weave atmospheric tint overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#e62429]/35 mix-blend-multiply pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-red-950/70 via-transparent to-red-900/30 mix-blend-color-dodge pointer-events-none"
          />
        </div>
      </div>

      {/* ====================================================================
       * LAYER 3: IDLE ANIMATION — TOP-TO-BOTTOM SCAN GLOW
       * Renders the traced SVG path stroke with animated gradient & drop-shadow glow.
       * Plays continuously regardless of hover state.
       * ==================================================================== */}
      <svg
        viewBox={viewBox}
        className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Ambient base stroke so the web/mask contours are subtly visible */}
        <path
          d={maskPathData}
          fill="none"
          stroke="#e62429"
          strokeWidth="1.6"
          strokeOpacity="0.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4-6px Outer Spider-Man Red Traveling Glow */}
        <path
          d={maskPathData}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 6px #e62429) drop-shadow(0 0 14px rgba(230,36,41,0.8))',
          }}
        />

        {/* 1.5px Sharp Pure White Core Highlight Traveling with the Scan */}
        <path
          d={maskPathData}
          fill="none"
          stroke={`url(#${coreGradientId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 4px #ffffff)',
          }}
        />
      </svg>

      {/* Subtle indicator ring at the cursor position during hover */}
      {isHovered && !isTouchDevice && !reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/30 z-30 transition-opacity duration-150"
          style={{
            left: `${mousePosRef.current.x}px`,
            top: `${mousePosRef.current.y}px`,
            width: `${revealRadius * 2}px`,
            height: `${revealRadius * 2}px`,
            boxShadow: '0 0 16px rgba(230,36,41,0.25) inset',
          }}
        />
      )}
    </div>
  );
};

export default HeroMaskReveal;
