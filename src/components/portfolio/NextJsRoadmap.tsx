import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { nextJsRoadmapItems } from '../../data/portfolioData';
import { Sparkles, Code, Play, RefreshCw, Layers, Zap, Terminal, CheckCircle2 } from 'lucide-react';

export const NextJsRoadmap: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'stagger' | 'magnetic' | 'elastic'>('stagger');
  const interactiveBoxRef = useRef<HTMLDivElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);

  // Live animation tester for user to test GSAP
  const triggerGsapDemo = (type: 'stagger' | 'magnetic' | 'elastic') => {
    setActiveDemo(type);
    const box = interactiveBoxRef.current;
    if (!box) return;

    gsap.killTweensOf(box);

    if (type === 'stagger') {
      gsap.fromTo(
        box,
        { scale: 0.8, rotation: -15, opacity: 0.5 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(2)' }
      );
    } else if (type === 'magnetic') {
      gsap.to(box, {
        keyframes: [
          { x: -20, duration: 0.1 },
          { x: 20, duration: 0.1 },
          { x: -10, duration: 0.1 },
          { x: 10, duration: 0.1 },
          { x: 0, duration: 0.1 },
        ],
        ease: 'power1.inOut',
      });
    } else if (type === 'elastic') {
      gsap.fromTo(
        box,
        { scaleY: 0.4, scaleX: 1.4 },
        { scaleY: 1, scaleX: 1, duration: 1.2, ease: 'elastic.out(1, 0.3)' }
      );
    }
  };

  return (
    <section id="nextjs-plan" className="py-24 bg-slate-950 text-slate-100 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
            NEXT.JS & GSAP BLUEPRINT.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed mt-2">
            Engineered to transition smoothly into the Next.js ecosystem with server-rendered speed and hardware-accelerated GSAP timelines.
          </p>
        </div>

        {/* 2 Column Layout: Architecture Cards & Live GSAP Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Architecture Items */}
          <div className="lg:col-span-7 space-y-6">
            {nextJsRoadmapItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
                    {item.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{item.animationPattern}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive GSAP Motion Lab & Code Blueprint */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Interactive GSAP Sandbox Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                    GSAP Motion Lab
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Live Interactive</span>
              </div>

              {/* Playground Stage */}
              <div
                ref={playAreaRef}
                className="h-44 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:1rem_1rem]" />

                {/* Animated Box Element */}
                <div
                  ref={interactiveBoxRef}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1px] shadow-[0_0_30px_rgba(59,130,246,0.35)] flex items-center justify-center text-white relative z-10 select-none cursor-pointer"
                  onClick={() => triggerGsapDemo(activeDemo)}
                >
                  <div className="w-full h-full rounded-[15px] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <span className="text-[10px] font-mono text-slate-300 uppercase">GSAP 3</span>
                  </div>
                </div>
              </div>

              {/* Animation Trigger Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => triggerGsapDemo('stagger')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeDemo === 'stagger'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>Back.out</span>
                </button>
                <button
                  onClick={() => triggerGsapDemo('magnetic')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeDemo === 'magnetic'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Jitter</span>
                </button>
                <button
                  onClick={() => triggerGsapDemo('elastic')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
                    activeDemo === 'elastic'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Elastic</span>
                </button>
              </div>
            </div>

            {/* Code Structure Blueprint Box */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-2 text-slate-200">
                  <Code className="w-4 h-4 text-blue-400" />
                  app/page.tsx (Next.js 15)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">SSR + GSAP</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-950/70 rounded-lg text-[11px] leading-relaxed">
{`// Client Boundary for GSAP animations
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.from('#hero-banner-img', {
      scale: 1.15,
      duration: 1.4,
      ease: 'power3.out'
    });
  }, { scope: container });

  return <div ref={container}>...</div>;
}`}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
