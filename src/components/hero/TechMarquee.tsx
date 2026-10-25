import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { techStackItems } from '../../data/portfolioData';
import { Sparkles, Terminal, Code2, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const TechMarquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Smooth GSAP infinite horizontal scroll
    const totalWidth = track.scrollWidth / 2;
    const animation = gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    const onMouseEnter = () => animation.timeScale(0.4);
    const onMouseLeave = () => animation.timeScale(1);

    track.addEventListener('mouseenter', onMouseEnter);
    track.addEventListener('mouseleave', onMouseLeave);

    return () => {
      animation.kill();
      track.removeEventListener('mouseenter', onMouseEnter);
      track.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Double list to create seamless infinite loop
  const duplicatedList = [...techStackItems, ...techStackItems];

  return (
    <div
      ref={marqueeRef}
      className="relative w-full overflow-hidden py-6 bg-slate-950 border-y border-slate-800/80 select-none"
      id="tech-marquee"
    >
      {/* Edge gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-center gap-6 whitespace-nowrap will-change-transform cursor-grab active:cursor-grabbing"
      >
        {duplicatedList.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-colors shadow-sm group"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
            <span className="text-xs sm:text-sm font-mono font-medium text-slate-300 group-hover:text-white tracking-wide">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
