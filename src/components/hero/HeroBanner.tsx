import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  Upload,
  Code2,
  Terminal,
  Zap,
  Layers,
  Cpu,
} from 'lucide-react';
import { HeroData } from '../../types';
import { DeveloperPortraitSvg } from './DeveloperPortraitSvg';

interface HeroBannerProps {
  heroData: HeroData;
  heroImage: string;
  onOpenPhotoModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  heroData,
  heroImage,
  onOpenPhotoModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const floatingBadge1Ref = useRef<HTMLDivElement>(null);
  const floatingBadge2Ref = useRef<HTMLDivElement>(null);

  // When heroImage changes, reset error state
  useEffect(() => {
    setImgLoadError(false);
    setImgLoaded(false);
  }, [heroImage]);

  // Master GSAP entrance animation timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Subtle initial states
      gsap.set(
        [
          badgeRef.current,
          titleLine1Ref.current,
          titleLine2Ref.current,
          bioRef.current,
          actionsRef.current,
          metricsRef.current,
          imageFrameRef.current,
          floatingBadge1Ref.current,
          floatingBadge2Ref.current,
        ],
        { opacity: 0, y: 30 }
      );

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.1,
      })
        .to(
          titleLine1Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.3'
        )
        .to(
          titleLine2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .to(
          bioRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .to(
          actionsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.4'
        )
        .to(
          metricsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.4'
        )
        .to(
          imageFrameRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'back.out(1.2)',
          },
          '-=0.9'
        )
        .to(
          [floatingBadge1Ref.current, floatingBadge2Ref.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
          },
          '-=0.5'
        );

      // Continuous ambient floating animations for badges
      gsap.to(floatingBadge1Ref.current, {
        y: -10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(floatingBadge2Ref.current, {
        y: 8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });

      // Pulsing blue neon rim light matching glasses
      gsap.to(glowRef.current, {
        scale: 1.12,
        opacity: 0.75,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Parallax Tilt Effect on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(imageFrameRef.current, {
      rotationY: x * 0.035,
      rotationX: -y * 0.035,
      transformPerspective: 1000,
      ease: 'power1.out',
      duration: 0.5,
    });
  };

  const handleMouseLeave = () => {
    if (!imageFrameRef.current) return;
    gsap.to(imageFrameRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power2.out',
      duration: 0.8,
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(heroData.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100"
    >
      {/* Background Decorative Grid & Glow Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Blue Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Kinetic Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Status Pill */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-sm backdrop-blur-md"
              id="hero-status-badge"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              <span className="text-xs font-mono font-medium text-slate-300">
                Next.js Architecture • GSAP Animations
              </span>
              <span className="text-slate-600 font-mono">|</span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Active
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <h1
                ref={titleLine1Ref}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-['Syne',sans-serif]"
              >
                CRAFTING NEXT-GEN
              </h1>
              <h1
                ref={titleLine2Ref}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 leading-[1.08] font-['Syne',sans-serif]"
              >
                KINETIC EXPERIENCES.
              </h1>
            </div>

            {/* Subheading & Bio */}
            <p
              ref={bioRef}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              Full-stack developer building high-performance web applications with{' '}
              <span className="text-blue-400 font-medium">Next.js 15 App Router</span> and cinematic{' '}
              <span className="text-sky-300 font-medium">GSAP motion choreography</span>. Bringing tactile polish, strict type-safety, and fluid 60fps animations to every viewport.
            </p>

            {/* Action Buttons */}
            <div
              ref={actionsRef}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(37,99,235,0.45)] transition-all flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                id="hero-cta-projects"
              >
                <span>Explore Featured Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#nextjs-plan"
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-sm font-medium transition-all flex items-center gap-2 hover:border-slate-600"
                id="hero-cta-nextjs-plan"
              >
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Next.js Blueprint</span>
              </a>

              <button
                onClick={copyEmail}
                className="px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-medium transition-all flex items-center gap-2"
                id="hero-copy-email-btn"
                title="Copy developer email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono">Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics & Highlights */}
            <div
              ref={metricsRef}
              className="pt-4 grid grid-cols-3 gap-6 border-t border-slate-800/80 w-full max-w-xl"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  100<span className="text-blue-500">%</span>
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  Type-Safe TypeScript
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  60<span className="text-blue-500">FPS</span>
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  GSAP Hardware Motion
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                  Next.js
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  Ready Architecture
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Section Banner with Photo */}
          <div
            className="lg:col-span-5 flex flex-col items-center justify-center relative select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Radial Rim Glow backing the image frame */}
            <div
              ref={glowRef}
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-600/30 blur-[100px] pointer-events-none -z-10"
            />

            {/* The Main Hero Banner Frame */}
            <div
              ref={imageFrameRef}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl p-2 bg-gradient-to-b from-blue-500/30 via-slate-800/60 to-slate-900/80 border border-blue-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.25)] backdrop-blur-xl group transition-all duration-300"
              id="hero-banner-image-container"
            >
              {/* Inner card container */}
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 relative flex items-center justify-center">
                
                {/* Tech grid overlay watermark inside frame */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none z-10" />

                {/* The Hero Image: attempts /portfolio.jpeg, or user uploaded dataUrl */}
                {!imgLoadError ? (
                  <img
                    src={heroImage}
                    alt="Developer Hero Portrait with signature blue glasses"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center transition-all duration-700 ${
                      imgLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-90'
                    } group-hover:scale-105`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => {
                      // Graceful fallback to styled vector illustration if /portfolio.jpeg not yet present
                      setImgLoadError(true);
                    }}
                    id="hero-banner-img"
                  />
                ) : (
                  /* Stylized fallback matching user photo features */
                  <div className="w-full h-full relative">
                    <DeveloperPortraitSvg glowColor="#2563eb" />
                  </div>
                )}

                {/* Subtle vignette gradient at base of portrait */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-10" />

                {/* Top Badge: "HERO BANNER PHOTO" */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-blue-500/40 backdrop-blur-md text-[11px] font-mono text-blue-300 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>portfolio.jpeg</span>
                </div>

                {/* Quick Swap/Upload Photo trigger pill button */}
                <button
                  onClick={onOpenPhotoModal}
                  className="absolute top-3.5 right-3.5 z-20 p-2 rounded-xl bg-slate-900/90 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition-all duration-200 group/btn"
                  title="Upload or change hero image (portfolio.jpeg)"
                  id="hero-banner-swap-photo-btn"
                >
                  <Upload className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                </button>

                {/* Bottom Overlay Label inside the image banner */}
                <div className="absolute bottom-4 inset-x-4 z-20 flex items-end justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-white tracking-wide">
                        CREATIVE TECHNOLOGIST
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Specialized in Next.js & GSAP
                    </p>
                  </div>

                  {/* Visual sound/motion wave indicator */}
                  <div className="flex items-end gap-1 h-5 px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800">
                    <span className="w-1 bg-blue-500 rounded-full h-2 animate-[pulse_1s_ease-in-out_infinite]" />
                    <span className="w-1 bg-sky-400 rounded-full h-4 animate-[pulse_1.4s_ease-in-out_infinite]" />
                    <span className="w-1 bg-indigo-500 rounded-full h-3 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  </div>
                </div>

              </div>
            </div>

            {/* Floating GSAP Badge 1 (Top Left) */}
            <div
              ref={floatingBadge1Ref}
              className="absolute -top-4 -left-4 sm:-left-8 z-30 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-blue-500/40 shadow-xl shadow-black/60 backdrop-blur-xl flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400">STACK ENGINE</div>
                <div className="text-xs font-bold text-white font-mono">Next.js 15 App Router</div>
              </div>
            </div>

            {/* Floating GSAP Badge 2 (Bottom Right) */}
            <div
              ref={floatingBadge2Ref}
              className="absolute -bottom-4 -right-4 sm:-right-6 z-30 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl shadow-black/60 backdrop-blur-xl flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400">ANIMATION</div>
                <div className="text-xs font-bold text-white font-mono">GSAP Timeline Motion</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
