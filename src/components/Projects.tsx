'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles, Bot, ShoppingCart, Layers, ExternalLink, MoveRight } from 'lucide-react';
import { ScrollAnimatedHeading } from './ui/text-scroll-animation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectCardData {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
  linkText: string;
  linkHref: string;
  isActionCard?: boolean;
}

export const FEATURED_CAROUSEL_DATA: ProjectCardData[] = [
  {
    id: 'ai-crm',
    badge: 'FLAGSHIP SAAS // SOLO BUILD',
    title: 'AI-Powered CRM & Lead Generation Dashboard',
    tagline: 'Multi-tenant SaaS with embeddable AI chatbot & live reporting',
    description:
      "A multi-tenant CRM SaaS built solo, with an embeddable AI chatbot that analyzes a business's website, scores incoming leads, and sends AI-personalized follow-up emails. Includes a full deals pipeline, a custom fields engine, and live reporting.",
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Gemini AI'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    linkText: 'View SaaS Architecture',
    linkHref: '#',
  },
  {
    id: 'ecommerce-suite',
    badge: 'PRODUCTION ARCHITECTURE',
    title: 'E-commerce Platform with Admin Panel',
    tagline: 'Storefront & admin suite with Razorpay payment workflows',
    description:
      'A complete storefront and admin panel covering product variants, cart, orders, Razorpay payments, product reviews, coupons, and a full refund flow.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Razorpay'],
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    linkText: 'Explore Storefront',
    linkHref: '#',
  },
  {
    id: 'more-work-closing',
    badge: 'PRODUCTION ARCHIVES // 21+ SHIPPED',
    title: '21+ More Projects',
    tagline: 'Mix of full stack builds & WordPress sites shipped for real clients',
    description:
      'A mix of full stack builds and WordPress sites shipped for real clients across various industries — including corporate portals, educational institutions, interior design studios, and WooCommerce platforms.',
    tags: ['WordPress', 'Elementor', 'Full Stack', 'WooCommerce', 'Client Work'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    linkText: 'View All 21+ Projects',
    linkHref: '#more-projects',
    isActionCard: true,
  },
];

export interface ProjectsProps {
  className?: string;
}

export default function Projects({ className = '' }: ProjectsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeDot, setActiveDot] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const track = trackRef.current;
    const cards = cardElementsRef.current.filter(Boolean) as HTMLDivElement[];

    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      /* ========================================================================
       * DISTANCE-TO-SCALE/OPACITY INTERPOLATION FORMULA:
       * 
       * 1. Target Center: C_viewport = window.innerWidth / 2.
       * 2. Card Center: C_card = card.getBoundingClientRect().left + (width / 2).
       * 3. Absolute Distance: d = Math.abs(C_card - C_viewport).
       * 4. Normalization Threshold: D_max = width + gap (approx. distance to adjacent card).
       * 5. Proximity Factor (0 to 1): factor = Math.max(0, 1 - (d / D_max)).
       * 
       * Scale Formula:
       *   scale = 0.85 + (1.08 - 0.85) * factor = 0.85 + 0.23 * factor
       *   -> EXACTLY 1.08 when centered (d = 0)
       *   -> Smoothly decays down toward 0.85 when moving away (d >= D_max)
       * 
       * Opacity Formula:
       *   opacity = 0.50 + (1.0 - 0.50) * factor = 0.50 + 0.50 * factor
       *   -> EXACTLY 1.0 when centered
       *   -> Smoothly fades toward 0.50 when moving away
       * 
       * Active Card Glow:
       *   The card closest to center (highest factor) receives the `.active-card-glow`
       *   pulsing accent blue (#3B82F6) border and elevated z-index (20).
       * ======================================================================== */
      const updateCardStyles = () => {
        const viewportCenter = window.innerWidth / 2;
        let minDistance = Infinity;
        let closestIndex = 0;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - viewportCenter);

          // Threshold: distance to adjacent card
          const maxDistance = rect.width + 48;
          // Smooth normalized proximity: 1 at exact center, 0 at >= maxDistance
          const factor = Math.max(0, Math.min(1, 1 - distance / maxDistance));

          // Continuous interpolation
          const scale = 0.85 + 0.23 * factor;
          const opacity = 0.5 + 0.5 * factor;
          const zIndex = Math.round(10 + factor * 10);

          card.style.transform = `scale(${scale})`;
          card.style.opacity = `${opacity}`;
          card.style.zIndex = `${zIndex}`;

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        // Toggle active glowing border and subtle box-shadow lift on the card closest to center
        cards.forEach((card, idx) => {
          const borderGlowEl = card.querySelector<HTMLElement>('.card-border-glow');
          const cardInner = card.querySelector<HTMLElement>('.card-inner-box');
          if (idx === closestIndex) {
            card.classList.add('is-center-active');
            if (borderGlowEl) {
              borderGlowEl.style.opacity = '1';
            }
            if (cardInner) {
              cardInner.style.boxShadow = '0 25px 60px -12px rgba(32, 24, 25, 0.45), 0 0 35px rgba(255, 74, 22, 0.35)';
            }
          } else {
            card.classList.remove('is-center-active');
            if (borderGlowEl) {
              borderGlowEl.style.opacity = '0';
            }
            if (cardInner) {
              cardInner.style.boxShadow = '0 10px 25px -5px rgba(32, 24, 25, 0.15)';
            }
          }
        });

        setActiveDot(closestIndex);
      };

      // Calculate total horizontal travel distance so all 3 cards can be centered sequentially
      const calculateTravelDistance = () => {
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];
        if (!firstCard || !lastCard) return 1600;

        const firstCenter = firstCard.offsetLeft + firstCard.offsetWidth / 2;
        const lastCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
        return Math.max(800, lastCenter - firstCenter);
      };

      const totalTravel = calculateTravelDistance();

      if (prefersReducedMotion) {
        // Reduced motion: initialize static center styling without horizontal scroll scrub
        updateCardStyles();
        return;
      }

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${totalTravel * 1.5}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -totalTravel,
          ease: 'none',
        }),
        onUpdate: () => {
          updateCardStyles();
        },
        onRefresh: () => {
          updateCardStyles();
        },
      });

      scrollTriggerRef.current = st;

      // Initial layout tick
      updateCardStyles();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Handle dot pagination click: smoothly scrolls the page to center the clicked card
  const handleDotClick = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st) {
      // Fallback if ScrollTrigger is not active (e.g. mobile/reduced motion)
      const targetCard = cardElementsRef.current[index];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
      return;
    }

    // Fraction along the pin timeline for card 0, 1, 2
    const totalCards = FEATURED_CAROUSEL_DATA.length;
    const progress = totalCards > 1 ? index / (totalCards - 1) : 0;
    const targetScroll = st.start + progress * (st.end - st.start);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className={`relative w-full h-screen overflow-hidden bg-[#F3EDE5] text-[#201819] selection:bg-[#FF4A16] selection:text-white flex flex-col justify-between py-8 md:py-10 select-none ${className}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* Accent Orange Pulsing Glow Styles */}
      <style jsx>{`
        @keyframes pulse-accent-glow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(255, 74, 22, 0.35), 0 0 50px rgba(255, 74, 22, 0.15), inset 0 0 15px rgba(255, 74, 22, 0.1);
            border-color: rgba(255, 74, 22, 0.85);
          }
          50% {
            box-shadow: 0 0 45px rgba(255, 74, 22, 0.65), 0 0 85px rgba(255, 74, 22, 0.3), inset 0 0 25px rgba(255, 74, 22, 0.2);
            border-color: rgba(255, 107, 53, 1);
          }
        }

        .active-card-glow {
          border: 2px solid rgba(255, 74, 22, 0.85);
          animation: pulse-accent-glow 3.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .active-card-glow {
            animation: none;
            box-shadow: 0 0 30px rgba(255, 74, 22, 0.45);
            border: 2px solid rgba(255, 74, 22, 0.85);
          }
        }
      `}</style>

      {/* Ambient background accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255, 74, 22, 0.14) 0%, rgba(243, 237, 229, 0) 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top Center Header with Host Grotesk 70.4px & Scroll Animation */}
      <div className="w-full px-[5vw] sm:px-[6vw] z-10 shrink-0 text-center flex flex-col items-center justify-center pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4A16]/10 border border-[#FF4A16]/20 text-[#FF4A16] text-xs font-mono mb-2.5 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FEATURED WORK // FLAGSHIP BUILDS</span>
        </div>
        <ScrollAnimatedHeading
          text="Featured Work"
          className="text-center"
          characterClassName="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold text-[#201819] tracking-normal leading-none"
          style={{ fontFamily: "var(--font-host-grotesk), sans-serif" }}
        />
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#756A68] font-sans justify-center mt-2.5">
          <span className="hidden sm:inline">Scroll down to slide & focus cards</span>
          <span className="inline-flex items-center gap-1.5 text-[#FF4A16] font-medium">
            <span>Card {activeDot + 1} of 3</span>
            <MoveRight className="w-4 h-4 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="relative z-10 w-full overflow-visible flex-1 flex items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-10 md:gap-12 will-change-transform"
          style={{
            /* Padding left & right ensures Card 1 and Card 3 can sit exactly in viewport center */
            paddingLeft: 'calc(50vw - clamp(280px, 27vw, 360px))',
            paddingRight: 'calc(50vw - clamp(280px, 27vw, 360px))',
          }}
        >
          {FEATURED_CAROUSEL_DATA.map((project, index) => {
            const isClosingCard = project.isActionCard;

            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardElementsRef.current[index] = el;
                }}
                className="relative shrink-0 w-[84vw] sm:w-[540px] md:w-[600px] lg:w-[660px] max-w-[680px] transition-[transform,opacity] duration-150 ease-out will-change-transform select-none"
                style={{
                  transformOrigin: 'center center',
                }}
              >
                {/* Glowing Pulsing Animated Accent-Blue Border (Visible on Center Active Card) */}
                <div
                  aria-hidden="true"
                  className="card-border-glow active-card-glow pointer-events-none absolute -inset-[2px] rounded-3xl transition-opacity duration-300 z-10"
                  style={{ opacity: index === 0 ? 1 : 0 }}
                />

                {/* Card Container */}
                <div className="card-inner-box relative rounded-3xl bg-[#151216] border border-[rgba(248,244,240,0.12)] overflow-hidden flex flex-col h-[460px] sm:h-[480px] md:h-[500px] shadow-2xl z-20 transition-shadow duration-300">
                  {/* Top Image Preview Banner */}
                  <div className="relative w-full h-[52%] overflow-hidden bg-black/40">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 opacity-85 hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151216] via-[#151216]/40 to-black/20" />

                    {/* Badge Pill */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-[#FF4A16] flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A16] inline-block animate-pulse" />
                      <span>{project.badge}</span>
                    </div>

                    {/* Card Index Badge */}
                    <div className="absolute top-4 right-4 text-[11px] font-mono text-[#B8AEB0] bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                      0{index + 1} / 03
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F8F4F0] tracking-tight leading-tight"
                        style={{ fontFamily: "var(--font-sora), sans-serif" }}
                      >
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#FF4A16] font-mono">
                        {project.tagline}
                      </p>

                      <p className="text-xs sm:text-sm text-[#B8AEB0] font-normal leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags & Action Link */}
                    <div className="pt-3 border-t border-[rgba(248,244,240,0.1)] flex flex-wrap items-center justify-between gap-3">
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md bg-[#09080B] border border-[rgba(248,244,240,0.1)] text-[11px] font-mono text-[#F8F4F0]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Link Button */}
                      {isClosingCard ? (
                        <a
                          href="#more-projects"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF4A16] hover:bg-[#FF6B35] text-white text-xs font-semibold tracking-wide transition-all shadow-[0_4px_15px_rgba(255,74,22,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <span>{project.linkText}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <a
                          href={project.linkHref}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF4A16] hover:text-[#FF6B35] tracking-wide transition-colors group/link cursor-pointer"
                        >
                          <span>{project.linkText}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Dot Pagination */}
      <div className="w-full px-[5vw] sm:px-[6vw] z-30 shrink-0 flex items-center justify-center gap-3.5 pt-2">
        {FEATURED_CAROUSEL_DATA.map((item, dotIdx) => {
          const isActive = activeDot === dotIdx;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDotClick(dotIdx)}
              aria-label={`Jump to project ${dotIdx + 1}: ${item.title}`}
              className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FF4A16] border-2 border-[#FF6B35] shadow-[0_0_14px_rgba(255,74,22,0.7)] scale-110'
                  : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-transparent border border-[#756A68] hover:border-[#201819]'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
