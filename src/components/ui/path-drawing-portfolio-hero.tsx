'use client';

import React, { useId, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: string;
  badge?: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: 'Sora', name: 'Sora', family: "var(--font-sora), 'Sora', sans-serif", category: 'Geometric', badge: 'Active / Modern' },
  { id: 'Outfit', name: 'Outfit', family: "var(--font-outfit), 'Outfit', sans-serif", category: 'Geometric', badge: 'Clean & Airy' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', family: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif", category: 'Tech Sans', badge: 'High-Tech' },
  { id: 'Space Grotesk', name: 'Space Grotesk', family: "var(--font-space), 'Space Grotesk', monospace, sans-serif", category: 'Display', badge: 'Brutalist Code' },
  { id: 'Syne', name: 'Syne', family: "var(--font-syne), 'Syne', sans-serif", category: 'Display', badge: 'Bold Editorial' },
  { id: 'Montserrat', name: 'Montserrat', family: "var(--font-montserrat), 'Montserrat', sans-serif", category: 'Sans-Serif', badge: 'Punchy Industrial' },
  { id: 'Orbitron', name: 'Orbitron', family: "var(--font-orbitron), 'Orbitron', sans-serif", category: 'Futuristic', badge: 'Cyberpunk' },
  { id: 'Cinzel', name: 'Cinzel', family: "var(--font-cinzel), 'Cinzel', serif", category: 'Serif', badge: 'Cinematic' },
  { id: 'Inter', name: 'Inter', family: "var(--font-inter), 'Inter', sans-serif", category: 'Sans-Serif', badge: 'Swiss Minimal' },
];

export function resolveFontFamily(fontName?: string): string {
  if (!fontName) return "var(--font-sora), 'Sora', sans-serif";
  const matched = AVAILABLE_FONTS.find(
    (f) => f.id.toLowerCase() === fontName.toLowerCase() || f.name.toLowerCase() === fontName.toLowerCase()
  );
  return matched ? matched.family : `${fontName}, var(--font-sora), 'Sora', sans-serif`;
}

/**
 * Exact-ink rasterization helper: renders the SVG text to an offscreen canvas
 * to measure actual visible ink pixels at any stroke-dash configuration.
 */
async function rasterInk(
  svgEl: SVGSVGElement,
  modifyTextFn: (text: SVGTextElement) => void,
  fontFamilyCSS?: string
): Promise<number> {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const textEl = clone.querySelector('text');
  if (!textEl) return 0;

  modifyTextFn(textEl);
  textEl.setAttribute('stroke', '#ffffff');
  textEl.style.stroke = '#ffffff';

  // Inlines computed font family so canvas rasterization accurately renders using the loaded web font
  if (fontFamilyCSS) {
    textEl.style.fontFamily = fontFamilyCSS;
  } else {
    const originalText = svgEl.querySelector('text');
    if (originalText) {
      const computedFont = window.getComputedStyle(originalText).fontFamily;
      if (computedFont) textEl.style.fontFamily = computedFont;
    }
  }

  const baseVal = svgEl.viewBox.baseVal;
  const width = Math.max(1, Math.round(baseVal.width || 860));
  const height = Math.max(1, Math.round(baseVal.height || 240));
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.style.visibility = 'visible';

  const blob = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('svg raster failed'));
      image.src = url;
    });

    const canvasW = Math.max(1, Math.round(0.45 * width));
    const canvasH = Math.max(1, Math.round(0.45 * height));
    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 0;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, 0, 0, canvasW, canvasH);

    const data = ctx.getImageData(0, 0, canvasW, canvasH).data;
    let inkCount = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 12) inkCount += 1;
    }
    return inkCount;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Measures exact stroke dash length needed to cover >= 99.4% of total ink pixels.
 */
async function measureExactDashLength(svgEl: SVGSVGElement, fontFamilyCSS?: string): Promise<number> {
  const totalInk = await rasterInk(svgEl, (text) => {
    text.style.strokeDasharray = 'none';
    text.style.strokeDashoffset = '0';
  }, fontFamilyCSS);

  if (totalInk <= 0) throw new Error('empty ink');

  const testDash = async (dashLen: number) => {
    const ink = await rasterInk(svgEl, (text) => {
      text.style.strokeDasharray = `${dashLen} 100000`;
      text.style.strokeDashoffset = '0';
    }, fontFamilyCSS);
    return ink >= 0.994 * totalInk;
  };

  let maxDash = 64;
  while (maxDash < 24000 && !(await testDash(maxDash))) {
    maxDash *= 2;
  }

  let minDash = 1;
  while (minDash < maxDash) {
    const mid = (minDash + maxDash) >> 1;
    if (await testDash(mid)) {
      maxDash = mid;
    } else {
      minDash = mid + 1;
    }
  }

  return Math.max(1, minDash);
}

export interface SvgPathDrawingTextAnimationProps {
  text: string;
  fontFamily?: string;
  fromColor?: string;
  toColor?: string;
  strokeWidth?: number;
  durationSec?: number;
  loop?: boolean;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  fontSize?: number;
  className?: string;
}

export function SvgPathDrawingTextAnimation({
  text,
  fontFamily = 'Sora',
  fromColor = '#f5f5f5',
  toColor = '#3B82F6',
  strokeWidth = 2.4,
  durationSec = 2.4, // Smooth ~2-2.5s draw-in
  loop = false,      // Run once by default, then reveal full solid text
  viewBoxWidth = 860,
  viewBoxHeight = 240,
  fontSize = 148,
  className,
}: SvgPathDrawingTextAnimationProps) {
  const id = useId().replace(/:/g, '');
  const gradientId = `pathGradient-${id}`;
  const fillGradientId = `pathFillGradient-${id}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const [dashLength, setDashLength] = useState(0);
  const [fillOpacity, setFillOpacity] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const trimmed = text.trim();
  const resolvedFont = resolveFontFamily(fontFamily);

  // Exact dash measurement on text or font change
  useEffect(() => {
    if (!trimmed || shouldReduceMotion || !svgRef.current) return;
    let cancelled = false;
    setFillOpacity(0);

    (async () => {
      try {
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.ready;
        }
        if (cancelled || !svgRef.current) return;
        const measured = await measureExactDashLength(svgRef.current, resolvedFont);
        if (!cancelled) {
          setDashLength(measured);
        }
      } catch {
        const t = strokeTextRef.current;
        if (!t || cancelled) return;
        setDashLength(
          Math.max(
            1,
            Math.ceil(1.15 * (t.getComputedTextLength() || trimmed.length * fontSize * 0.62))
          )
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trimmed, fontSize, viewBoxWidth, strokeWidth, shouldReduceMotion, resolvedFont]);

  // Stroke-dash draw-in animation + smooth solid fill reveal
  useLayoutEffect(() => {
    const textElement = strokeTextRef.current;
    if (!textElement) return;

    if (shouldReduceMotion || dashLength <= 0) {
      textElement.style.strokeDashoffset = '0';
      textElement.style.strokeDasharray = 'none';
      setFillOpacity(1);
      return;
    }

    textElement.style.strokeDasharray = `${dashLength} ${dashLength}`;
    textElement.style.strokeDashoffset = String(dashLength);
    setFillOpacity(0);

    const speed = dashLength / (1000 * Math.max(0.8, durationSec));
    let currentOffset = dashLength;
    let lastTime = performance.now();
    let frameId = 0;

    const animate = (currentTime: number) => {
      const delta = Math.min(48, currentTime - lastTime);
      lastTime = currentTime;
      currentOffset -= speed * delta;

      if (currentOffset <= 0) {
        currentOffset = 0;
        textElement.style.strokeDashoffset = '0';
        setFillOpacity(1);

        if (!loop) {
          // Finished: keep text permanently solid and visible
          return;
        }
        currentOffset = dashLength;
      }

      // Smoothly cross-fade fill as stroke approaches 70-100% completion
      const progress = 1 - currentOffset / dashLength;
      if (progress >= 0.65) {
        const fillAlpha = Math.min(1, (progress - 0.65) / 0.35);
        setFillOpacity(fillAlpha);
      } else {
        setFillOpacity(0);
      }

      textElement.style.strokeDashoffset = String(currentOffset);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [dashLength, durationSec, loop, shouldReduceMotion, resolvedFont]);

  if (!trimmed) return null;

  const isVisible = dashLength > 0 || !!shouldReduceMotion;

  return (
    <div
      className={cn('flex min-h-[160px] sm:min-h-[220px] md:min-h-[280px] w-full items-center justify-center', className)}
      data-tsuna-id="svg-path-drawing-text-animation"
    >
      <svg
        ref={svgRef}
        width="1000"
        height="420"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="h-auto w-full max-w-full overflow-visible"
        role="img"
        aria-label={trimmed}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <defs>
          {/* Stroke Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>

          {/* Solid Fill Gradient */}
          <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>

        {/* 1. Solid Fill Text Layer: emerges seamlessly as stroke finishes so name is 100% readable and solid */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={`url(#${fillGradientId})`}
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily={resolvedFont}
          letterSpacing="-0.03em"
          className="select-none pointer-events-none"
          style={{
            opacity: shouldReduceMotion ? 1 : fillOpacity,
            filter: 'drop-shadow(0 20px 45px rgba(0, 0, 0, 0.95))',
            transition: shouldReduceMotion ? 'none' : 'opacity 0.25s ease-out',
          }}
        >
          {trimmed}
        </text>

        {/* 2. Crisp Stroke Outline Text: draws left-to-right as a white-to-blue gradient */}
        <text
          ref={strokeTextRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily={resolvedFont}
          letterSpacing="-0.03em"
          className="select-none"
          style={{
            filter: 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.5))',
          }}
        >
          {trimmed}
        </text>
      </svg>
    </div>
  );
}

export interface PathDrawingScrollCueProps {
  target?: string;
  className?: string;
}

export function PathDrawingScrollCue({
  target = '#about-me',
  className,
}: PathDrawingScrollCueProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={target}
      aria-label="Scroll down to content"
      className={cn(
        'group flex flex-col items-center gap-2 text-zinc-400 hover:text-[#3B82F6] transition-colors cursor-pointer select-none pointer-events-auto',
        className
      )}
      initial={!shouldReduceMotion && { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-zinc-400 group-hover:text-[#3B82F6] transition-colors">
        Scroll
      </span>
      <div className="path-drawing-scroll-cue flex flex-col items-center">
        <span
          aria-hidden
          className="block h-8 w-[1.5px] origin-top bg-gradient-to-b from-[#f5f5f5] via-[#3B82F6] to-transparent shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        />
        <svg
          className="w-3.5 h-3.5 -mt-1 text-[#3B82F6] opacity-80 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </motion.a>
  );
}

export interface PathDrawingPortfolioHeroProps {
  brand?: string;
  tagline?: string;
  eyebrow?: string;
  fontFamily?: string;
  fromColor?: string;
  toColor?: string;
  loop?: boolean;
  durationSec?: number;
  children?: React.ReactNode;
  className?: string;
  showScrollCue?: boolean;
  scrollTarget?: string;
}

export function PathDrawingPortfolioHero({
  brand = 'Yogesh',
  tagline = 'Frontend Developer',
  eyebrow = 'Portfolio',
  fontFamily = 'Sora',
  fromColor = '#f5f5f5',
  toColor = '#3B82F6',
  loop = false,
  durationSec = 2.4,
  children,
  className,
  showScrollCue = true,
  scrollTarget = '#about-me',
}: PathDrawingPortfolioHeroProps) {
  const brandTrimmed = brand.trim();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!brandTrimmed) return null;
  const isReduced = !!shouldReduceMotion || !mounted;

  // Responsive fontSize & viewBoxWidth logic based on name character count:
  // "Yogesh" has 6 characters, utilizing the largest tier (fontSize: 148, viewBoxWidth: 860)
  const charCount = brandTrimmed.length;
  const fontSize = charCount > 12 ? 72 : charCount > 8 ? 96 : 148;
  const viewBoxWidth = charCount > 8 ? 1100 : 860;
  const viewBoxHeight = charCount > 8 ? 200 : 240;

  return (
    <div
      data-tsuna-id="path-drawing-portfolio-hero"
      className={cn(
        'relative flex w-full flex-col items-center justify-center bg-transparent text-white',
        className
      )}
    >
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-4 pb-4 pt-6 text-center sm:px-8 sm:pb-6">
        {eyebrow ? (
          <motion.p
            className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60 sm:mb-4 sm:text-xs"
            initial={!isReduced && { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <h1 className="sr-only">{brandTrimmed}</h1>

        <motion.div
          className="w-full flex items-center justify-center"
          initial={!isReduced && { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <SvgPathDrawingTextAnimation
            text={brandTrimmed}
            fontFamily={fontFamily}
            fromColor={fromColor}
            toColor={toColor}
            className="w-full"
            fontSize={fontSize}
            viewBoxWidth={viewBoxWidth}
            viewBoxHeight={viewBoxHeight}
            strokeWidth={2.4}
            durationSec={durationSec}
            loop={loop}
          />
        </motion.div>

        {tagline ? (
          <motion.p
            className="mt-2 max-w-md text-xs sm:text-sm font-medium tracking-wide uppercase text-blue-300/80 sm:mt-3"
            initial={!isReduced && { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {tagline}
          </motion.p>
        ) : null}
      </div>

      {showScrollCue && (
        <PathDrawingScrollCue
          target={scrollTarget}
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
        />
      )}

      {children}

      <style jsx global>{`
        @keyframes path-drawing-scroll-cue {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.85;
          }
          50% {
            transform: translateY(6px);
            opacity: 0.35;
          }
        }
        .path-drawing-scroll-cue {
          animation: path-drawing-scroll-cue 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .path-drawing-scroll-cue {
            animation: none;
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}

export default PathDrawingPortfolioHero;
