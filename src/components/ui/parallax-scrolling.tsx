'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, RefreshCw } from 'lucide-react';
import { PathDrawingPortfolioHero, PathDrawingScrollCue } from '@/components/ui/path-drawing-portfolio-hero';
import { FontSwitcher } from '@/components/ui/FontSwitcher';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fixed defaults matching server render — NO localStorage reads inside useState!
  const [heroFont, setHeroFont] = useState<string>('Sora');
  const [heroCase, setHeroCase] = useState<'uppercase' | 'normal'>('uppercase');
  const [animKey, setAnimKey] = useState<number>(0);
  const [userImage, setUserImage] = useState<string>('/portfolio.jpeg');
  const [toast, setToast] = useState<string | null>(null);

  // Read saved preferences safely after mount
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem('portfolio_hero_font');
      if (savedFont && savedFont !== 'Sora') {
        setHeroFont(savedFont);
      }
      const savedCase = localStorage.getItem('portfolio_hero_case');
      if (savedCase === 'uppercase' || savedCase === 'normal') {
        setHeroCase(savedCase);
      }
      const savedImg =
        localStorage.getItem('portfolio_bg_image') ||
        localStorage.getItem('portfolio_hero_image');
      if (savedImg && savedImg !== '/portfolio.jpeg') {
        setUserImage(savedImg);
      }
    } catch {}
  }, []);

  const handleFontChange = (font: string) => {
    setHeroFont(font);
    setAnimKey((k) => k + 1);
    try {
      localStorage.setItem('portfolio_hero_font', font);
    } catch {}
    setToast(`Font changed to ${font}`);
    setTimeout(() => setToast(null), 2500);

    // Refresh layout after font loading stabilizes
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  };

  const handleCaseChange = (newCase: 'uppercase' | 'normal') => {
    setHeroCase(newCase);
    setAnimKey((k) => k + 1);
    try {
      localStorage.setItem('portfolio_hero_case', newCase);
    } catch {}
  };

  const handleReplay = () => {
    setAnimKey((k) => k + 1);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      if (data) {
        setUserImage(data);
        try {
          localStorage.setItem('portfolio_bg_image', data);
        } catch {}
        setToast('Portrait photo updated');
        setTimeout(() => setToast(null), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !parallaxRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const headerElement = parallaxRef.current?.querySelector('.parallax__header');

      // 1. Synchronous, Smooth Entrance Animation
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entranceTl.fromTo(
        '[data-entrance="name"]',
        { y: '-80px', opacity: 0 },
        { y: '0px', opacity: 1, duration: 1.2, ease: 'power3.out' },
        0
      );

      entranceTl.fromTo(
        '[data-entrance="person"]',
        { y: '100px', opacity: 0, scale: 0.96 },
        { y: '0px', opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        0
      );

      entranceTl.fromTo(
        '[data-entrance="glow"]',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' },
        0
      );

      // 2. Parallax on Scroll
      if (headerElement) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          headerElement.querySelectorAll('[data-parallax-layer="2"]'),
          { yPercent: -25, ease: 'none' },
          0
        );
        tl.to(
          headerElement.querySelectorAll('[data-parallax-layer="3"]'),
          { yPercent: -12, ease: 'none' },
          0
        );
        tl.to(
          headerElement.querySelectorAll('[data-parallax-layer="1"]'),
          { yPercent: -18, opacity: 0.2, ease: 'none' },
          0
        );
      }
    }, parallaxRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      className="parallax"
      ref={parallaxRef}
      id="parallax-root"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      }}
    >
      {/* Hidden file selector */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        id="parallax-file-input"
      />

      {/* Side Font Family Studio Switcher */}
      <FontSwitcher
        currentFont={heroFont}
        onFontChange={handleFontChange}
        textCase={heroCase}
        onCaseChange={handleCaseChange}
        onReplay={handleReplay}
      />

      {/* Floating Header Control Bar */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex items-center gap-2.5">
        {/* Jump to About Me Section */}
        <a
          href="#about-me"
          className="px-4 py-1.5 rounded-full bg-[#3B82F6]/10 hover:bg-[#3B82F6] border border-[#3B82F6]/30 hover:border-[#3B82F6] text-xs font-medium text-blue-200 hover:text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center gap-2"
          id="parallax-about-me-btn"
          title="Scroll down to About section"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]" />
          <span>About</span>
        </a>

        {/* Upload Custom Photo */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900/85 hover:bg-zinc-800 border border-white/10 hover:border-[#3B82F6]/50 text-xs text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          id="parallax-upload-btn"
          title="Upload custom photo"
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Photo</span>
        </button>

        {userImage !== '/portfolio.jpeg' && (
          <button
            onClick={() => {
              setUserImage('/portfolio.jpeg');
              try {
                localStorage.removeItem('portfolio_bg_image');
              } catch {}
              setToast('Reset to default');
              setTimeout(() => setToast(null), 2000);
            }}
            className="p-1.5 rounded-full bg-zinc-900/85 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg cursor-pointer"
            title="Reset to default photo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {toast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 px-4 py-2 rounded-full bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs font-mono shadow-2xl animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Parallax Header Section with Sticky Layers */}
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>

          <div data-parallax-layers className="parallax__layers">
            {/* LAYER 1: Ambient Background & Subtle Glows */}
            <div
              data-parallax-layer="1"
              data-entrance="glow"
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              {/* Soft confident-blue radial glow */}
              <div className="w-[85vw] max-w-[900px] h-[55vh] rounded-full bg-[#3B82F6]/15 blur-[140px]" />
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
            </div>

            {/* LAYER 2: Path-Drawing Animated Name */}
            <div
              data-parallax-layer="2"
              className="parallax__layer-title absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none z-10 -translate-y-[6vh] sm:-translate-y-[8vh]"
            >
              <div
                data-entrance="name"
                className="w-full flex items-center justify-center pointer-events-auto"
              >
                <PathDrawingPortfolioHero
                  key={`${heroFont}-${heroCase}-${animKey}`}
                  brand={heroCase === 'uppercase' ? 'YOGESH' : 'Yogesh'}
                  tagline="Frontend Developer"
                  eyebrow="Portfolio"
                  fontFamily={heroFont}
                  fromColor="#f5f5f5"
                  toColor="#3B82F6"
                  loop={false}
                  durationSec={2.4}
                  showScrollCue={false}
                  className="w-full max-w-5xl"
                />
              </div>
            </div>

            {/* LAYER 3: Clean Person Foreground Photo (No Mask Overlay / No Clip-Path) */}
            <div
              data-parallax-layer="3"
              className="absolute inset-0 w-full h-full z-20 flex items-end justify-center pointer-events-none pb-0"
            >
              <div
                data-entrance="person"
                style={{
                  height: '84vh',
                  transformOrigin: 'bottom center',
                }}
                className="relative w-full max-w-[96vw] sm:max-w-[850px] flex items-end justify-center pointer-events-auto select-none"
              >
                <img
                  src={userImage}
                  alt="Yogesh - Frontend Developer"
                  referrerPolicy="no-referrer"
                  className="block h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] select-none pointer-events-none transition-transform duration-300"
                  onError={() => setUserImage('/portfolio.jpeg')}
                />
              </div>
            </div>
          </div>

          <div className="parallax__fade"></div>

          {/* Scroll Cue Indicator with theme colors and bounce animation */}
          <PathDrawingScrollCue
            target="#about-me"
            className="absolute bottom-6 sm:bottom-8 left-1/2 z-30 -translate-x-1/2"
          />
        </div>
      </section>
    </div>
  );
}
