'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './toolkit-section.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight, Code2, Layers, Database, GitBranch } from 'lucide-react';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiWordpress,
  SiShopify,
  SiGit,
  SiGithub,
  SiHtml5,
  SiCss,
} from 'react-icons/si';

const SiCss3 = SiCss;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// ─── 4 Curated Pillar Cards (Elena Voss Style) ──────────────────────────────
export const TOOLKIT_CARDS = [
  {
    number: '01',
    title: 'Frontend Development',
    icon: Code2,
    skills: [
      'React.js & Next.js App Router',
      'TypeScript & Modern JavaScript',
      'Tailwind CSS & Design Systems',
      'GSAP & Motion Micro-interactions',
      'Responsive & Accessible UI Craft',
    ],
  },
  {
    number: '02',
    title: 'Backend & APIs',
    icon: Layers,
    skills: [
      'Node.js & Express.js Runtimes',
      'Next.js Server Actions & APIs',
      'RESTful & GraphQL Architectures',
      'Authentication & JWT Security',
      'Third-party Webhooks & Middleware',
    ],
  },
  {
    number: '03',
    title: 'Databases & CMS',
    icon: Database,
    skills: [
      'PostgreSQL & Supabase Backends',
      'SQLite & Prisma ORM Schema',
      'WordPress & WooCommerce Builds',
      'Shopify Liquid & Headless Stores',
      'Structured Content Modeling',
    ],
  },
  {
    number: '04',
    title: 'Development Workflow',
    icon: GitBranch,
    skills: [
      'Git & GitHub Team Workflows',
      'Vite, Turbopack & Fast Tooling',
      'Component-Driven Architecture',
      'Lighthouse & Web Vitals Optimization',
      'Cross-Browser QA & Debugging',
    ],
  },
];

// ─── Tech Stack Marquee Logos ────────────────────────────────────────────────
export const TECH_LOGOS = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'WordPress', icon: SiWordpress, color: '#21759B' },
  { name: 'Shopify', icon: SiShopify, color: '#7AB55C' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'GitHub', icon: SiGithub, color: '#FFFFFF' },
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
];

export default function ToolkitSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 501px)', () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const title = SplitText.create(section.querySelectorAll('.toolkit-title-line'), { type: 'chars', mask: 'chars', aria: 'auto' });
      gsap.from(title.chars, {
        yPercent: 110, duration: 1, stagger: 0.018, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      });
      gsap.from(section.querySelector('.toolkit-intro'), {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      });
      const scrollArea = section.querySelector('.toolkit-scroll');
      if (!scrollArea) return;

      // The reference row begins just beyond the right edge (about 104.6vw).
      // Giving GSAP an explicit start prevents the cards from flashing at x: 0
      // before the scroll-linked animation begins.
      gsap.fromTo(track,
        { x: () => section.clientWidth * 1.046 },
        {
          x: () => -Math.max(0, track.scrollWidth - section.clientWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: scrollArea,
            // Begin only as the card stage reaches the lower 70% of the viewport.
            // At the heading's initial position this leaves just the reference's
            // small card edge visible at the bottom-right.
            start: 'top 70%',
            end: 'bottom bottom',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    }, sectionRef);
    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="toolkit-section" aria-labelledby="toolkit-title">
      <header className="toolkit-heading">
        <p className="toolkit-label">04 / MY TOOLKIT</p>
        <h2 id="toolkit-title">
          <span className="toolkit-title-mask"><span className="toolkit-title-line">The technologies</span></span>
          <span className="toolkit-title-mask"><span className="toolkit-title-line">behind the work.</span></span>
        </h2>
        <p className="toolkit-intro">My practice is focused on solving real-world digital challenges with thoughtful engineering. From intuitive interfaces to reliable backends, explore the technologies behind every experience I build.</p>
      </header>
      <div className="toolkit-scroll">
        <div className="toolkit-sticky">
          <div ref={trackRef} className="toolkit-track">
            {TOOLKIT_CARDS.map(card => {
              const Icon = card.icon;
              return <article key={card.number} className="toolkit-card" tabIndex={0} aria-label={card.title}>
                <div className="toolkit-fill" aria-hidden="true" />
                <div className="toolkit-card-top">
                  <span className="toolkit-number"><Icon size={20} aria-hidden="true" />{card.number}</span>
                  <span className="toolkit-arrow" aria-hidden="true"><ArrowUpRight /><ArrowUpRight /></span>
                </div>
                <div className="toolkit-card-copy"><h3>{card.title}</h3><ul>{card.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
              </article>;
            })}
          </div>
        </div>
      </div>
      <div className="toolkit-marquee-wrap" aria-label="Core technologies marquee">
        <div className="toolkit-marquee-track">
          <div className="toolkit-marquee-set">
            {TECH_LOGOS.map((tech) => {
              const Icon = tech.icon;
              return (
                <span key={`tech-1-${tech.name}`} className="toolkit-logo-item">
                  <Icon size={19} style={{ color: tech.color }} aria-hidden="true" />
                  {tech.name}
                </span>
              );
            })}
          </div>
          <div className="toolkit-marquee-set" aria-hidden="true">
            {TECH_LOGOS.map((tech) => {
              const Icon = tech.icon;
              return (
                <span key={`tech-2-${tech.name}`} className="toolkit-logo-item">
                  <Icon size={19} style={{ color: tech.color }} aria-hidden="true" />
                  {tech.name}
                </span>
              );
            })}
          </div>
          <div className="toolkit-marquee-set" aria-hidden="true">
            {TECH_LOGOS.map((tech) => {
              const Icon = tech.icon;
              return (
                <span key={`tech-3-${tech.name}`} className="toolkit-logo-item">
                  <Icon size={19} style={{ color: tech.color }} aria-hidden="true" />
                  {tech.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
