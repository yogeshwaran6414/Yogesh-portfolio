'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Globe, Sparkles, MoveRight } from 'lucide-react';
import { ScrollAnimatedHeading } from './ui/text-scroll-animation';

export interface ProjectCardItem {
  id: number;
  title: string;
  category: string;
  link: string;
  image: string;
}

export const MORE_PROJECTS_DATA: ProjectCardItem[] = [
   {
    id: 20,
    title: 'Business Bench',
    category: 'Premium Interior Website',
    link: 'https://wordpress-977481-6633926.cloudwaysapps.com/',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
   {
    id: 17,
    title: 'SNGC',
    category: 'Educational Site',
    link: 'https://wordpress-977481-6378976.cloudwaysapps.com/',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  },

  {
    id: 2,
    title: 'Calgery',
    category: 'SEO Site',
    link: 'https://appliancescalgaryrepair.com/',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },

 
  {
    id: 5,
    title: 'White Horse',
    category: 'WooCommerce',
    link: 'https://whitehorseherbals.com/',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Utsava',
    category: 'Tourist Site',
    link: 'https://utsavatravels.com/',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    title: 'Advika Groups',
    category: 'Static Site',
    link: 'https://advikagroups.com/',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
    {
    id: 15,
    title: 'Divine World',
    category: 'WooCommerce',
    link: 'https://divineworldindia.com/',
    image: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Gulftech',
    category: 'Educational Site',
    link: 'https://gulftechmep.in/',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
 
  {
    id: 10,
    title: 'Sky Park',
    category: 'Figma Site',
    link: 'https://skyparkproperties.in/',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 11,
    title: 'Grain Master',
    category: 'Static Site',
    link: 'https://grainmaster.in/',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 12,
    title: 'Innovetech',
    category: 'Product Catalogue',
    link: 'https://innovatec.in/',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
 


  {
    id: 16,
    title: 'Vhibor Enterprises',
    category: 'Static Products Site',
    link: 'https://wordpress-1633851-6520161.cloudwaysapps.com/',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
 
  {
    id: 18,
    title: 'Megum Tex',
    category: 'Clothing Website',
    link: 'https://wordpress-977481-6606626.cloudwaysapps.com/',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 19,
    title: 'Veeraj Holidays',
    category: 'Tourist Website',
    link: 'https://veerajholidays.com/',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  },
 
  {
    id: 21,
    title: 'Anusha Holidays',
    category: 'Tourist Website',
    link: 'https://anushaholidays.in/',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  },
];

export interface MoreProjectsProps {
  className?: string;
}

export default function MoreProjects({ className = '' }: MoreProjectsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // GSAP Horizontal Scroll Pinning & Scrubbing
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Reduced motion skips horizontal pinning; uses standard scrollable container
      return;
    }

    const container = containerRef.current;
    const track = trackRef.current;
    const progressBar = progressBarRef.current;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        if (!track) return 2000;
        return Math.max(0, track.scrollWidth - window.innerWidth + 80);
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${Math.max(getScrollAmount(), 1600)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              progressBar.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="more-projects"
      className={`relative w-full h-screen overflow-hidden bg-[#F3EDE5] text-[#201819] selection:bg-[#FF4A16] selection:text-white flex flex-col justify-between py-6 md:py-8 ${className}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* Inline styles for the Mouse-Spotlight Glow Card effect with Ember Noir orange hue (~15) */}
      <style jsx>{`
        .spider-glow-card {
          --x: 50%;
          --y: 50%;
          --xp: 0.5;
          --yp: 0.5;
          /* Accent ember orange hue 15 with narrow spread (10-20) */
          --hue: calc(15 - 5 + (12 * var(--xp, 0.5)));
          --spotlight-size: 320px;
          position: relative;
          background-color: #151216;
          border-radius: 1.25rem;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }

        /* Outer soft blur glow */
        .spider-glow-card::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: radial-gradient(
            var(--spotlight-size) circle at var(--x, 50%) var(--y, 50%),
            hsl(var(--hue) 95% 54% / 0.4),
            transparent 70%
          );
          filter: blur(14px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        /* Inner bright border ring via masked stroke */
        .spider-glow-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1.5px;
          background: radial-gradient(
            var(--spotlight-size) circle at var(--x, 50%) var(--y, 50%),
            hsl(var(--hue) 98% 58% / 0.95),
            transparent 65%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .spider-glow-card:hover::before,
        .spider-glow-card:hover::after {
          opacity: 1;
        }

        /* Surface spotlight illumination */
        .spider-glow-card-surface {
          background-image: radial-gradient(
            var(--spotlight-size) circle at var(--x, 50%) var(--y, 50%),
            hsl(var(--hue) 95% 55% / 0.12),
            transparent 75%
          );
        }

        /* Touch & reduced-motion fallback */
        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          .spider-glow-card {
            border-color: rgba(255, 74, 22, 0.25);
          }
          .spider-glow-card::before {
            opacity: 0.4;
            background: linear-gradient(135deg, rgba(255, 74, 22, 0.4), transparent 85%);
          }
          .spider-glow-card::after {
            opacity: 0.2;
            background: rgba(255, 74, 22, 0.15);
          }
        }
      `}</style>

      {/* Subtle ember ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 74, 22, 0.15) 0%, rgba(243, 237, 229, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top Center Section Header with Host Grotesk 70.4px & Scroll Animation */}
      <div className="w-full px-[5vw] sm:px-[6vw] z-10 shrink-0 pt-2 pb-2 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4A16]/10 border border-[#FF4A16]/25 text-[#FF4A16] text-xs font-sans tracking-wide mb-2.5 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CLIENT ARCHIVES // PRODUCTION BUILDS</span>
        </div>
        <ScrollAnimatedHeading
          text="21+ More Projects"
          className="text-center"
          characterClassName="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold text-[#201819] tracking-normal leading-none"
          style={{ fontFamily: "var(--font-host-grotesk), sans-serif" }}
        />
        <p className="text-xs sm:text-sm text-[#756A68] font-normal leading-relaxed pt-2 max-w-xl mx-auto text-center">
          A mix of full stack builds and WordPress sites shipped for real clients.
        </p>
      </div>

      {/* Horizontal Cards Track (Scrolls Horizontally on Document Scroll) */}
      <div className="relative z-10 w-full overflow-hidden flex-1 flex items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-6 px-6 sm:px-10 will-change-transform"
        >
          {MORE_PROJECTS_DATA.map((project, index) => (
            <a
              key={project.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xp = Math.max(0, Math.min(1, x / rect.width)).toFixed(3);
                const yp = Math.max(0, Math.min(1, y / rect.height)).toFixed(3);
                e.currentTarget.style.setProperty('--x', `${x}px`);
                e.currentTarget.style.setProperty('--y', `${y}px`);
                e.currentTarget.style.setProperty('--xp', xp);
                e.currentTarget.style.setProperty('--yp', yp);
              }}
              className="spider-glow-card group block w-[320px] sm:w-[350px] md:w-[370px] shrink-0 border border-[rgba(248,244,240,0.12)] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,74,22,0.35)] select-none cursor-pointer"
              aria-label={`Open project ${project.title}`}
            >
              {/* Card Surface */}
              <div className="spider-glow-card-surface relative z-10 flex flex-col h-[400px] sm:h-[420px] md:h-[430px] rounded-[inherit] overflow-hidden">
                
                {/* Project Image Banner Container */}
                <div className="relative w-full h-[54%] overflow-hidden bg-zinc-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151216] via-transparent to-black/30" />

                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/75 border border-white/10 backdrop-blur-md text-[11px] font-sans text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A16] inline-block mr-1.5" />
                    <span>{project.category}</span>
                  </div>

                  {/* External Link Action Button */}
                  <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-[#FF4A16] group-hover:border-[#FF4A16] transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Project index counter badge */}
                  <div className="absolute bottom-3 right-3 text-[11px] font-sans text-zinc-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {String(index + 1).padStart(2, '0')} / 21
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3
                      className="text-2xl sm:text-3xl font-semibold text-[#F8F4F0] group-hover:text-[#FF6B35] transition-colors tracking-tight leading-tight"
                      style={{ fontFamily: "var(--font-sora), sans-serif" }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#B8AEB0] font-normal leading-relaxed line-clamp-2">
                      Custom responsive web architecture built with modern frontend engineering and performance standards.
                    </p>
                  </div>

                  {/* Bottom live domain link */}
                  <div className="pt-3 border-t border-[rgba(248,244,240,0.12)] flex items-center justify-between text-xs text-[#B8AEB0] font-sans group-hover:text-[#F8F4F0] transition-colors">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#FF4A16] transition-colors shrink-0" />
                      <span className="truncate">
                        {project.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </span>
                    </div>
                    <span className="text-[#FF4A16] text-[11px] tracking-wider font-semibold shrink-0 group-hover:underline">
                      Live Preview →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Horizontal Scrub Progress Indicator */}
      <div className="w-full px-[5vw] sm:px-[6vw] z-10 shrink-0 pt-2">
        <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#FF4A16] to-[#FF6B35] rounded-full transition-all duration-75"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </section>
  );
}
