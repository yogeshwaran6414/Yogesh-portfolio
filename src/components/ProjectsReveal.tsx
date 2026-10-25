'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, Sparkles, ExternalLink, Compass } from 'lucide-react';

export interface ProjectsRevealProps {
  /** Target section ID to scroll into when clicking the CTA button */
  projectsId?: string;
  /** Optional custom click handler for the CTA button */
  onCtaClick?: () => void;
  /** Optional extra class names for the container */
  className?: string;
}

export default function ProjectsReveal({
  projectsId = 'projects',
  onCtaClick,
  className = '',
}: ProjectsRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const revealedLayerRef = useRef<HTMLDivElement>(null);
  const lensRimRef = useRef<HTMLDivElement>(null);
  const revealedContentRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const phase1ButtonsRef = useRef<HTMLDivElement>(null);

  const handleScrollToProjects = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    const target = document.getElementById(projectsId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDownALittle = () => {
    if (typeof window !== 'undefined') {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const phase1 = phase1Ref.current;
      const revealedLayer = revealedLayerRef.current;
      const lensRim = lensRimRef.current;
      const revealedContent = revealedContentRef.current;
      const ctaBtn = ctaBtnRef.current;

      /* ========================================================================
       * REDUCED MOTION HANDLING:
       * ======================================================================== */
      if (prefersReducedMotion) {
        if (phase1) gsap.set(phase1, { display: 'none', opacity: 0 });
        if (revealedLayer) {
          gsap.set(revealedLayer, {
            clipPath: 'circle(150% at 50% 50%)',
            opacity: 1,
          });
        }
        if (lensRim) gsap.set(lensRim, { display: 'none' });
        if (revealedContent) gsap.set(revealedContent, { opacity: 1, y: 0 });
        if (ctaBtn) gsap.set(ctaBtn, { opacity: 1, y: 0, pointerEvents: 'auto' });
        return;
      }

      /* ========================================================================
       * MATHEMATICALLY SYNCHRONIZED CIRCLE & CLIP-PATH STATE:
       * ======================================================================== */
      const R_BASE = 140;
      const maxRadius = Math.max(
        typeof window !== 'undefined' ? Math.hypot(window.innerWidth, window.innerHeight) * 1.15 : 2400,
        2200
      );

      const lens = {
        x: 50,
        y: 125,     // starts just below viewport
        r: R_BASE,
      };

      const applyLens = () => {
        const { x, y, r } = lens;

        if (revealedLayer) {
          const clip = `circle(${r}px at ${x}% ${y}%)`;
          revealedLayer.style.clipPath = clip;
          revealedLayer.style.setProperty('-webkit-clip-path', clip);
        }

        if (lensRim) {
          const scale = r / R_BASE;
          lensRim.style.left = `${x}%`;
          lensRim.style.top = `${y}%`;
          lensRim.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;

          // Smoothly fade out the rim as it expands well beyond screen edges
          const opacity = scale > 1.2 ? Math.max(0, 1 - (scale - 1.2) / 2.5) : 1;
          lensRim.style.opacity = `${opacity}`;
        }
      };

      // Set initial geometry
      applyLens();

      if (revealedContent) {
        gsap.set(revealedContent, { opacity: 0, scale: 0.95 });
      }

      if (ctaBtn) {
        gsap.set(ctaBtn, { opacity: 0, y: 20, pointerEvents: 'none' });
      }

      /* ========================================================================
       * SCROLLTRIGGER TIMELINE:
       * anticipation: 0 to prevent jitter/glitch against adjacent pinned sections
       * ======================================================================== */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinContainerRef.current,
          start: 'top top',
          end: '+=140%',
          scrub: 0.6,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      // PHASE 1: Circle rises from below to center
      tl.to(
        lens,
        {
          y: 50,
          duration: 0.35,
          ease: 'power1.out',
          onUpdate: applyLens,
        },
        0
      );

      // Fade out phase 1 headline and buttons as ball ascends
      if (phase1) {
        tl.to(
          phase1,
          {
            scale: 0.94,
            opacity: 0.1,
            duration: 0.15,
            ease: 'power1.in',
          },
          0.22
        );
      }

      // PHASE 2: Circle expands outward to reveal content
      tl.to(
        lens,
        {
          r: maxRadius,
          duration: 0.45,
          ease: 'power2.inOut',
          onUpdate: applyLens,
        },
        0.35
      );

      if (phase1) {
        tl.to(
          phase1,
          {
            opacity: 0,
            duration: 0.1,
            ease: 'power1.out',
          },
          0.35
        );
      }

      // Revealed content ("Featured Work") fades and scales into place
      if (revealedContent) {
        tl.to(
          revealedContent,
          {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'power1.out',
          },
          0.42
        );
      }

      // Buttons appear immediately once the ball reveals the section
      if (ctaBtn) {
        tl.to(
          ctaBtn,
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.25,
            ease: 'back.out(1.5)',
          },
          0.48
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects-reveal"
      className={`relative w-full overflow-hidden bg-[#0a0a0a] text-[#f5f5f5] select-none ${className}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <div
        ref={pinContainerRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Ambient subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(10, 10, 10, 0.95) 75%)',
          }}
        />

        {/* ====================================================================
         * BASE LAYER (PHASE 1 CONTENT):
         * Visible BEFORE scrolling. Includes headline AND interactive action buttons!
         * ==================================================================== */}
        <div
          ref={phase1Ref}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] text-xs font-mono mb-4 font-medium shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>PORTFOLIO SHOWCASE // ARCHIVES</span>
          </div>

          <h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#f5f5f5] tracking-tight max-w-5xl leading-none"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Selected Works & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5f5f5] via-zinc-300 to-zinc-500">
              Key Highlights.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#a1a1aa] max-w-lg leading-relaxed font-normal">
            Production full-stack platforms, client websites, and high-performance interactive interfaces.
          </p>

          {/* PHASE 1 ACTION BUTTONS (VISIBLE BEFORE SCROLLING) */}
          <div
            ref={phase1ButtonsRef}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto z-20"
          >
            <button
              type="button"
              onClick={handleScrollDownALittle}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#3B82F6] text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              <span>Scroll to Reveal Ball</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>

            <button
              type="button"
              onClick={handleScrollToProjects}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-blue-500/40 text-xs sm:text-sm font-medium transition-all backdrop-blur-md cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#3B82F6]" />
              <span>Explore 21+ Projects</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
         * REVEALED LAYER (EXPANDING CIRCLE & PROJECTS REVEAL):
         * Uses clip-path: circle(...) scrubbed smoothly via GSAP.
         * ==================================================================== */}
        <div
          ref={revealedLayerRef}
          className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-20 overflow-hidden"
          style={{
            clipPath: 'circle(140px at 50% 125%)',
            WebkitClipPath: 'circle(140px at 50% 125%)',
            willChange: 'clip-path, transform',
          }}
        >
          {/* Subtle minimal grid inside revealed circle */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Revealed Content: Heading & Action Buttons */}
          <div
            ref={revealedContentRef}
            className="relative z-30 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto will-change-transform"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] text-xs font-mono mb-3 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRODUCTION ARCHIVES</span>
            </div>

            <h2
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#f5f5f5] tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Featured Work
            </h2>

            <p className="mt-4 text-xs sm:text-sm md:text-base text-[#a1a1aa] font-normal leading-relaxed max-w-xl mx-auto">
              Explore 21+ production builds, e-commerce stores, and full-stack web applications shipped for real clients.
            </p>

            {/* REVEALED SECTION ACTION BUTTONS (PROMINENT & IMMEDIATELY CLICKABLE) */}
            <div
              ref={ctaBtnRef}
              className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pointer-events-auto"
            >
              <button
                type="button"
                onClick={handleScrollToProjects}
                aria-label="View 21 production projects"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#3B82F6] text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
              >
                <span>Explore 21+ Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 rounded-full bg-[#111114] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-blue-500/40 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-md"
              >
                <span>Get In Touch</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>
          </div>
        </div>

        {/* ====================================================================
         * MINIMAL GEOMETRIC CIRCLE RIM:
         * Centered at exact same coordinates and radius as the clip-path.
         * ==================================================================== */}
        <div
          ref={lensRimRef}
          aria-hidden="true"
          className="pointer-events-none absolute w-[280px] h-[280px] z-25 will-change-transform"
          style={{
            left: '50%',
            top: '125%',
            transform: 'translate3d(-50%, -50%, 0)',
            transformOrigin: 'center center',
          }}
        >
          <svg
            viewBox="0 0 280 280"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]"
          >
            {/* Outer subtle white ring */}
            <circle
              cx="140"
              cy="140"
              r="138"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
            />

            {/* Inner accent-blue ring */}
            <circle
              cx="140"
              cy="140"
              r="134"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="120 12"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
