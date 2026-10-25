'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MoveRight, ChevronDown } from 'lucide-react';
import HeroBeamGlow from './HeroBeamGlow';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const ROTATING_ROLES = [
  'Software Developer',
  'Frontend Developer',
  'Full-Stack Developer',
  'E-commerce Developer',
  'WordPress Developer',
];

export interface CinematicHeroProps {
  className?: string;
  id?: string;
}

export default function CinematicHero({ className = '', id = 'hero' }: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const portraitContainerRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const titleDescRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);
  const availabilityBadgeRef = useRef<HTMLDivElement>(null);

  // Rotating dynamic developer roles with visibility and accessibility awareness
  const [roleIndex, setRoleIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', onMotionChange);

    // If user prefers reduced motion, keep static role without cycling
    if (mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', onMotionChange);
    }

    let intervalId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          setRoleIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
        }, 3000);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Pause cycling when document/tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  // Smooth scroll helper
  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !heroRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grab animated elements safely
    const headlineLines = headlineRef.current
      ? headlineRef.current.querySelectorAll('.hero-headline-line')
      : [];
    const titleDescItems = titleDescRef.current
      ? titleDescRef.current.querySelectorAll('.hero-fade-item')
      : [];
    const ctaButtons = ctaGroupRef.current
      ? ctaGroupRef.current.querySelectorAll('.hero-cta-btn')
      : [];

    // REDUCED MOTION: render immediately without entrance motion
    if (prefersReducedMotion) {
      if (bgRef.current) gsap.set(bgRef.current, { opacity: 1, scale: 1 });
      if (navRef.current) gsap.set(navRef.current, { opacity: 1, y: 0 });
      if (headlineLines.length) gsap.set(headlineLines, { yPercent: 0, opacity: 1 });
      if (portraitContainerRef.current) gsap.set(portraitContainerRef.current, { opacity: 1, x: 0, scale: 1 });
      if (titleDescItems.length) gsap.set(titleDescItems, { opacity: 1, y: 0 });
      if (ctaButtons.length) gsap.set(ctaButtons, { opacity: 1, y: 0 });
      if (availabilityBadgeRef.current) gsap.set(availabilityBadgeRef.current, { opacity: 1, y: 0 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1, y: 0 });
      return;
    }

    let cleanupEntrance: (() => void) | null = null;

    // MAIN ENTRANCE TIMELINE (runs once on initial page load, synchronized with intro loader)
    const ctx = gsap.context(() => {
      // 1. Pre-set initial hidden values immediately so no static elements appear while waiting
      if (bgRef.current) gsap.set(bgRef.current, { opacity: 0, scale: 1.05 });
      if (navRef.current) gsap.set(navRef.current, { opacity: 0, y: -16 });
      let split: any = null;
      if (headlineLines.length) {
        split = SplitText.create(headlineLines, { type: 'chars', mask: 'chars', aria: 'auto' });
        if (split.chars) {
          gsap.set(split.chars, { yPercent: 115, opacity: 0 });
        }
      }
      if (portraitContainerRef.current) {
        gsap.set(portraitContainerRef.current, { opacity: 0, x: 75 });
      }
      if (titleDescItems.length) {
        gsap.set(titleDescItems, { opacity: 0, y: 18 });
      }
      if (ctaButtons.length) {
        gsap.set(ctaButtons, { opacity: 0, y: 20 });
      }
      if (availabilityBadgeRef.current) {
        gsap.set(availabilityBadgeRef.current, { opacity: 0, y: 14 });
      }
      if (scrollIndicatorRef.current) {
        gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 12 });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      // Phase 1 — 0 to 850 ms:
      // Background fades in, subtle zoom-out revealing the cinematic scene.
      if (bgRef.current) {
        tl.to(
          bgRef.current,
          { opacity: 1, scale: 1, duration: 0.85, ease: 'power2.out' },
          0
        );
      }

      // Phase 2 — 150 to 800 ms:
      // The logo/name and top-right contact button fade in and move upward into position.
      if (navRef.current) {
        tl.to(
          navRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          0.15
        );
      }

      // Phase 3 — 250 to 1100 ms:
      // The main headline reveals one line at a time using overflow-hidden text wrappers and translateY transitions.
      if (split && split.chars) {
        tl.to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.015,
            ease: 'power4.out',
          },
          0.25
        );
      }

      // Phase 4 — 350 to 1350 ms:
      // The portrait slides in from the right, fades in, and settles into place without overshoot.
      if (portraitContainerRef.current) {
        tl.to(
          portraitContainerRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
          },
          0.35
        );
      }

      // Phase 5 — 650 to 1300 ms:
      // The professional title and supporting description fade in and move upward slightly.
      if (titleDescItems.length) {
        tl.to(
          titleDescItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
          },
          0.65
        );
      }

      // Phase 6 — 850 to 1500 ms:
      // The two CTA buttons appear with a stagger.
      if (ctaButtons.length) {
        tl.to(
          ctaButtons,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out',
          },
          0.85
        );
      }

      // Phase 7 — 1050 to 1600 ms:
      // Scroll indicator and availability label appear.
      if (availabilityBadgeRef.current) {
        tl.to(
          availabilityBadgeRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          1.05
        );
      }

      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          1.15
        );
      }

      // Synchronize playhead: play entrance when loader doors part open
      let hasTriggered = false;
      const playEntrance = () => {
        if (hasTriggered) return;
        hasTriggered = true;
        tl.play();
      };

      const hasActiveLoader =
        (typeof window !== 'undefined' && Boolean((window as any).__HAS_EMBER_LOADER__)) ||
        Boolean(document.querySelector('[data-ember-loader="true"]'));

      const isAlreadyReady =
        typeof window !== 'undefined' && Boolean((window as any).__HERO_ENTRANCE_TRIGGERED__);

      if (!hasActiveLoader || isAlreadyReady) {
        playEntrance();
      } else {
        const handleStart = () => playEntrance();
        window.addEventListener('hero:start-entrance', handleStart, { once: true });
        const fallbackTimer = window.setTimeout(playEntrance, 3600);

        cleanupEntrance = () => {
          window.removeEventListener('hero:start-entrance', handleStart);
          window.clearTimeout(fallbackTimer);
        };
      }

      // SCROLL-LINKED PARALLAX (subtle depth on scroll down on the image, never scrubbing opacity)
      if (portraitImgRef.current) {
        gsap.to(portraitImgRef.current, {
          y: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        });
      }

      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          y: 35,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    }, heroRef);

    // DESKTOP CURSOR-BASED PARALLAX (subtle, restrained ~8-12px movement)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return; // Desktop only

      const { innerWidth, innerHeight } = window;
      const xNorm = e.clientX / innerWidth - 0.5; // -0.5 to 0.5
      const yNorm = e.clientY / innerHeight - 0.5;

      // Portrait responds with ~10-12px movement
      if (portraitImgRef.current) {
        gsap.to(portraitImgRef.current, {
          x: xNorm * 12,
          y: yNorm * 8,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      // Background responds more subtly (~3px movement)
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          x: -xNorm * 3.5,
          y: -yNorm * 2.5,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cleanupEntrance?.();
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id={id}
      aria-label="Portfolio Introduction"
      className={`relative w-full h-[100svh] min-h-[560px] max-h-[100svh] overflow-hidden bg-[#09080B] text-[#F8F4F0] flex flex-col justify-between select-none ${className}`}
      style={{
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
      }}
    >
      {/* ========================================================
          LAYER A: BACKGROUND & ENHANCED EMBER NOIR ATMOSPHERIC LIGHTING
          ======================================================== */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden will-change-transform"
      >
        {/* Cinematic Background Image (1024x575 local asset preserved) */}
        <img
          ref={bgImgRef}
          src="/hero-bg.png"
          alt="Cinematic atmospheric stage background with burnt orange lighting"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[25%_20%] sm:object-[center_20%] lg:object-[center_30%] scale-100 will-change-transform"
        />

        {/* Dynamic Beam & Cursor Glow Effect — Exact design from BeamWordmarkFooter */}
        <HeroBeamGlow accent="#FF4A16" />

        {/* 
          STRENGTHENED LEFT RADIAL GLOW:
          Upper-left and mid-left areas noticeably brighter with orange (#FF4A16)
          blending into deep red (#8D160D), burgundy (#31090D), and finally black (#09080B).
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at 18% 34%,
                rgba(255, 74, 22, 0.72) 0%,
                rgba(255, 74, 22, 0.35) 24%,
                rgba(141, 22, 13, 0.22) 46%,
                transparent 70%
              ),
              radial-gradient(
                ellipse at 48% 42%,
                rgba(49, 9, 13, 0.40) 0%,
                transparent 64%
              ),
              linear-gradient(
                90deg,
                rgba(9, 8, 11, 0.12) 0%,
                rgba(9, 8, 11, 0.28) 44%,
                rgba(9, 8, 11, 0.82) 100%
              )
            `,
          }}
        />

        {/* Supporting atmospheric orange bloom for headline area */}
        <div
          aria-hidden="true"
          className="absolute top-[12%] -left-[10%] w-[58vw] h-[58vw] max-w-[680px] max-h-[680px] rounded-full pointer-events-none opacity-55 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 74, 22, 0.5) 0%, rgba(141, 22, 13, 0.28) 42%, rgba(49, 9, 13, 0.15) 60%, transparent 75%)',
            filter: 'blur(85px)',
          }}
        />

        {/* Top Header Shadow Gradient */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(9, 8, 11, 0.88) 0%, rgba(9, 8, 11, 0.35) 65%, transparent 100%)',
          }}
        />

        {/* Bottom Seamless Fade into Page Background (#09080B) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(9, 8, 11, 0.6) 45%, rgba(9, 8, 11, 0.95) 85%, #09080B 100%)',
          }}
        />
      </div>

      {/* ========================================================
          LAYER B: PORTRAIT (Right-Anchored Transparent PNG preserved)
          ======================================================== */}
      <div
        ref={portraitContainerRef}
        className="absolute z-10 bottom-0 right-0 sm:right-[1vw] md:right-[2vw] lg:right-[4vw] xl:right-[5vw] w-[85vw] sm:w-[62vw] md:w-[48vw] lg:w-[42vw] xl:w-[40vw] max-w-[680px] 2xl:max-w-[780px] h-[75svh] sm:h-[82svh] lg:h-[90svh] pointer-events-none flex items-end justify-end select-none will-change-transform"
      >
        {/* Subtle orange atmospheric rim glow behind portrait's right shoulder & hair */}
        <div
          aria-hidden="true"
          className="absolute right-[6%] top-[16%] w-[360px] h-[360px] rounded-full pointer-events-none opacity-50 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 74, 22, 0.45) 0%, rgba(141, 22, 13, 0.22) 40%, transparent 70%)',
            filter: 'blur(75px)',
          }}
        />

        {/* Subtle blue glow on the portrait's opposite edge (front/left edge) */}
        <div
          aria-hidden="true"
          className="absolute left-[10%] bottom-[25%] w-[320px] h-[320px] rounded-full pointer-events-none opacity-40 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(59, 130, 246, 0.15) 45%, transparent 70%)',
            filter: 'blur(65px)',
          }}
        />

        {/* High-Resolution Portrait Image (Preserving transparent background & facial details) */}
        <img
          ref={portraitImgRef}
          src="/hero-portrait-trimmed.png"
          alt="Yogeshwaran K. - Full-Stack Developer & WordPress Specialist"
          fetchPriority="high"
          decoding="async"
          className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] will-change-transform"
        />

        {/* Soft bottom mask overlay so portrait sinks cleanly into the dark floor */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(9, 8, 11, 0.5) 60%, #09080B 100%)',
          }}
        />
      </div>

      {/* ========================================================
          LAYER C: TEXT, NAVIGATION, & INTERACTIVE UI
          ======================================================== */}

      {/* TOP NAVIGATION (Transparent, high legibility) */}
      <header
        ref={navRef}
        className="relative z-30 w-full px-[5vw] sm:px-[6vw] pt-6 sm:pt-8 pb-3 flex items-center justify-between"
      >
        {/* Top-Left Logo / Name */}
        <a
          href="#hero"
          className="group inline-flex items-center gap-2.5 text-[#F8F4F0] transition-opacity"
          aria-label="Yogeshwaran K. Portfolio Homepage"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A16] shadow-[0_0_12px_#FF4A16] transition-transform duration-300 group-hover:scale-125" />
          <span
            className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#F8F4F0]/95 group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-sora), 'Sora', sans-serif" }}
          >
            YOGESHWARAN K.
          </span>
        </a>

        {/* Top-Right Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo('#contact')}
            className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#F8F4F0] bg-white/[0.04] border border-[rgba(248,244,240,0.14)] hover:border-[#FF4A16]/70 hover:bg-white/[0.08] hover:text-white transition-all duration-300 shadow-[0_4px_18px_rgba(0,0,0,0.4)] hover:shadow-[0_0_22px_rgba(255,74,22,0.3)] active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <span>Get in Touch</span>
          </button>
        </div>
      </header>

      {/* MAIN HERO CONTENT (Anchored on Left with consistent 5vw margin) */}
      <div className="relative z-20 w-full px-[5vw] sm:px-[6vw] my-auto py-1 sm:py-2 flex flex-col justify-center flex-1 overflow-visible">
        <div className="w-full lg:max-w-[56vw] xl:max-w-[52vw]">
          

          {/* Main Headline (Split into 4 independent animated lines) */}
          <h1
            ref={headlineRef}
            className="text-[#F8F4F0] font-bold tracking-normal uppercase leading-[0.93] text-[clamp(1.75rem,3.8vw,4.1rem)] text-balance"
            style={{
              fontFamily: "var(--font-host-grotesk), sans-serif",
            }}
          >
            <span className="block overflow-hidden py-0.5">
              <span className="hero-headline-line block will-change-transform">
                BUILDING
              </span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <span className="hero-headline-line block will-change-transform">
                DIGITAL
              </span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <span className="hero-headline-line block will-change-transform">
                EXPERIENCES
              </span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <span className="hero-headline-line block will-change-transform text-[#F8F4F0] drop-shadow-[0_4px_24px_rgba(255,74,22,0.25)]">
                THAT MOVE YOU.
              </span>
            </span>
          </h1>

          {/* Dynamic Animated Role Switcher & Supporting Description */}
          <div ref={titleDescRef} className="space-y-2.5 mt-3 sm:mt-4">
            <div className="hero-fade-item min-h-[38px] flex items-center gap-2.5 sm:gap-3 flex-wrap text-sm sm:text-base font-medium text-[#F8F4F0]">
              <span className="text-[#F8F4F0]/80 text-xs sm:text-sm font-mono uppercase tracking-[0.16em] font-semibold shrink-0">
                SPECIALIZING IN
              </span>
              <div className="relative inline-flex items-center overflow-hidden h-7 sm:h-8 md:h-9 min-w-[200px] sm:min-w-[240px] md:min-w-[270px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={roleIndex}
                    initial={prefersReducedMotion ? false : { y: '115%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { y: '-115%', opacity: 0 }}
                    transition={{
                      y: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.22, ease: 'easeOut' },
                    }}
                    className="inline-block text-white font-bold text-base sm:text-lg md:text-xl tracking-tight whitespace-nowrap select-none will-change-transform drop-shadow-[0_2px_14px_rgba(255,74,22,0.25)]"
                    style={{
                      fontFamily: "var(--font-host-grotesk), sans-serif",
                    }}
                  >
                    {ROTATING_ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <p className="hero-fade-item text-xs sm:text-sm md:text-base text-[#B8AEB0] max-w-lg leading-relaxed font-normal">
              I build modern websites, web applications, and digital experiences that help businesses turn ideas into real results.
            </p>
          </div>

          {/* Call-to-Action Buttons (Ember Noir primary cream + secondary transparent) */}
          <div
            ref={ctaGroupRef}
            className="flex items-center gap-3.5 mt-4 sm:mt-5 flex-wrap"
          >
            {/* Primary Cream Button with Dark Text */}
            <button
              onClick={() => scrollTo('#projects')}
              className="hero-cta-btn group relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#F8F4F0] text-[#09080B] font-semibold text-xs sm:text-sm md:text-base tracking-wide transition-all duration-300 shadow-[0_4px_25px_rgba(255,74,22,0.22)] hover:shadow-[0_0_35px_rgba(255,74,22,0.45)] hover:bg-[#F3EDE5] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore My Work</span>
              <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#FF4A16]" />
            </button>

            {/* Secondary Transparent Button with Subtle Light Border */}
            <button
              onClick={() => scrollTo('#contact')}
              className="hero-cta-btn inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-transparent border border-[rgba(248,244,240,0.18)] hover:border-[rgba(248,244,240,0.4)] hover:bg-white/[0.04] text-[#F8F4F0] font-medium text-xs sm:text-sm md:text-base tracking-wide transition-all duration-300 active:scale-[0.98] cursor-pointer backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,74,22,0.15)]"
            >
              Let&apos;s Talk
            </button>
          </div>

          {/* Availability Label (Mobile/Tablet inline placement) */}
          <div className="mt-4 md:hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151216]/80 border border-[rgba(248,244,240,0.14)] backdrop-blur-md text-[11px] font-mono tracking-wide text-[#B8AEB0]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>Available for Freelance Projects</span>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER CONTROLS: Scroll Indicator & Desktop Availability Badge */}
      <footer className="relative z-30 w-full px-[5vw] sm:px-[6vw] pb-3 sm:pb-5 pt-1 flex items-center justify-between shrink-0">
        {/* Scroll Indicator at the bottom */}
        <button
          ref={scrollIndicatorRef}
          onClick={() => scrollTo('#services')}
          className="group inline-flex items-center gap-3 text-[#B8AEB0] hover:text-[#F8F4F0] transition-colors cursor-pointer select-none"
          aria-label="Scroll to explore portfolio sections"
        >
          <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.25em] uppercase text-[#B8AEB0] group-hover:text-[#F8F4F0] transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-7 h-7 rounded-full border border-[rgba(248,244,240,0.14)] group-hover:border-[rgba(248,244,240,0.4)] flex items-center justify-center transition-all duration-300 group-hover:bg-white/5">
            <ChevronDown className="w-3.5 h-3.5 text-[#B8AEB0] group-hover:text-[#F8F4F0] transition-transform duration-300 group-hover:translate-y-0.5" />
          </div>
        </button>

        {/* Small Supporting Label on the Right (Desktop) */}
        <div
          ref={availabilityBadgeRef}
          className="hidden md:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151216]/80 border border-[rgba(248,244,240,0.14)] backdrop-blur-md text-xs font-mono tracking-wide text-[#B8AEB0] shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>Available for Freelance Projects</span>
        </div>
      </footer>
    </section>
  );
}
