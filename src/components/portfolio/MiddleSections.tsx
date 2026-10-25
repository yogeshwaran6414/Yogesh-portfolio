'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Plus, Minus, Code2, Database, Layers, GitBranch, Globe } from 'lucide-react';
import { services, principles, skillGroups } from '../../data/middleSections';
import HeroScrollAnimation from '../ui/hero-scroll-animation';
import InfiniteTextMarquee from '../ui/infinite-text-marquee';
import ProjectsShowcase from './ProjectsShowcase';
import ToolkitSection from './ToolkitSection';
import { useSectionHeadingReveal } from '../ui/use-section-heading-reveal';
import './middle-sections.css';

const icons = [Code2, Layers, Database, Globe, GitBranch];
const number = (i: number) => String(i + 1).padStart(2, '0');

function SectionHeading({ label, title, accent, children }: { label: string; title: string; accent?: string; children: React.ReactNode }) {
  const headingRef = useRef<HTMLElement>(null);
  useSectionHeadingReveal(headingRef);

  return <header ref={headingRef} className="en-heading" data-section-heading><p className="en-label">{label}</p><div className="en-heading-grid"><h2><span className="block overflow-hidden" style={{ color: 'inherit' }}><span className="inline-block" style={{ color: 'inherit' }} data-section-heading-line>{title}</span></span>{accent && <span className="block overflow-hidden"><span className="inline-block" data-section-heading-line>{accent}</span></span>}</h2><p className="en-intro" data-section-heading-support>{children}</p></div></header>;
}

function Preview({ kind }: { kind: string }) {
  return <div className={`en-preview en-preview-${kind}`} aria-hidden="true">
    <div className="en-browser"><i /><i /><i /><span>DESIGNED AROUND YOUR BUSINESS</span></div>
    {kind === 'dashboard' ? <div className="en-dashboard"><aside><b>orbit<span>®</span></b><i /><i /><i /><i /></aside><div><small>WORKSPACE / OVERVIEW</small><h4>A clearer perspective.</h4><div className="en-metrics"><span>Projects<b>24</b></span><span>In progress<b>08</b></span><span>Completed<b>16</b></span></div><div className="en-chart">{[25, 42, 34, 57, 45, 73, 65, 87, 78, 95].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></div></div>
    : kind === 'store' ? <div className="en-store"><small>FORM & EVERYDAY</small><h4>Objects with intention.</h4><div className="en-products">{['01', '02', '03'].map(n => <div key={n}><i /><span>ESSENTIAL / {n}</span></div>)}</div></div>
    : <div className="en-site"><small>{kind === 'editorial' ? 'THE JOURNAL / VOL. 01' : 'INDEPENDENT STUDIO / DIGITAL EXPERIENCES'}</small><h4>{kind === 'editorial' ? <>A space for<br /><em>new perspectives.</em></> : <>Good ideas.<br /><em>Beautifully built.</em></>}</h4><div className="en-orbit" /><span>EXPLORE THE POSSIBILITIES ↗</span></div>}
    <div className="en-preview-caption">ILLUSTRATIVE INTERFACE CONCEPT</div>
  </div>;
}

function Services({ id = 'services' }: { id?: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Accordion changes alter the positions of all subsequent scroll triggers.
    let timer: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
    if (root.current) observer.observe(root.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  return <section id={id} className="en-section en-dark"><div className="en-wrap">
    <SectionHeading label="02 / WHAT I BUILD" title="Digital solutions." accent="Built around your business.">From custom software and SaaS applications to business websites and online stores, I build digital experiences tailored to your goals, your users, and the way your business works.</SectionHeading>
    <div className="en-services" ref={root}><div className="en-service-list">{services.map((service, i) => {
      const isExpanded = expanded === i;
      return (
        <article className={`en-service ${active === i ? 'is-active' : ''}`} key={service.title} onMouseEnter={() => setActive(i)}>
          <h3>
            <button 
              type="button" 
              aria-expanded={isExpanded} 
              aria-controls={`service-panel-${i}`} 
              id={`service-toggle-${i}`} 
              onFocus={() => setActive(i)} 
              onClick={() => { setActive(i); setExpanded(isExpanded ? null : i); }}
            >
              <span className="en-number">{number(i)}</span>
              <span>{service.title}</span>
              <ArrowUpRight className="en-service-arrow" aria-hidden="true" />
              <span className="en-service-toggle-icon" aria-hidden="true">
                <span className={`en-icon-wrapper ${isExpanded ? 'is-open' : ''}`}>
                  <Plus size={17} className="en-icon-plus" />
                  <Minus size={17} className="en-icon-minus" />
                </span>
              </span>
            </button>
          </h3>
          <p className="en-short">{service.short}</p>
          <div 
            id={`service-panel-${i}`} 
            role="region" 
            aria-labelledby={`service-toggle-${i}`} 
            aria-hidden={!isExpanded}
            className={`en-service-collapse ${isExpanded ? 'is-expanded' : ''}`}
          >
            <div className="en-service-collapse-inner">
              <div className="en-service-detail">
                <div className="en-mobile-preview"><Preview kind={service.preview} /></div>
                <p>{service.description}</p>
                <ul className="en-capabilities">{service.capabilities.map(c => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </div>
        </article>
      );
    })}</div><div className="en-service-preview">{services.map((s, i) => <div className={`en-preview-layer ${active === i ? 'is-active' : ''}`} key={s.preview}><Preview kind={s.preview} /></div>)}<p className="en-preview-note"><span>IDEA → INTERFACE → EXPERIENCE</span><span>0{active + 1} / 04</span></p></div></div>
    <div className="en-service-end"><div><small>Have a project in mind?</small><p>Let’s build something useful.</p></div><a className="en-button" href="#contact">Discuss Your Project <ArrowUpRight size={19} /></a></div>
  </div></section>;
}

export default function MiddleSections({ hero }: { hero?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.en-reveal').forEach(el => gsap.from(el, { y: 24, opacity: 0, duration: 0.75, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } }));
        gsap.utils.toArray<HTMLElement>('.en-skill-group').forEach(el => gsap.from(el.querySelectorAll('li'), { y: 8, opacity: 0, stagger: 0.045, duration: 0.4, scrollTrigger: { trigger: el, start: 'top 94%', once: true } }));
        gsap.from('.en-principle-line', { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.en-principles', start: 'top 75%', end: 'bottom 75%', scrub: true } });
      }, root);
      return () => ctx.revert();
    });
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.en-project').forEach(el => gsap.fromTo(el.querySelector('.en-project-image'), { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } }));
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);

  return <div ref={root} className="ember-middle">
    {hero ? <HeroScrollAnimation hero={hero}><Services id="services-content" /></HeroScrollAnimation> : <Services />}

    {/* Infinite Text Marquee — inserted directly after the 2nd section (Services) */}
    <div className="relative w-full border-y border-[rgba(248,244,240,0.08)] bg-gradient-to-b from-[#09080B] via-[#141014] to-[#09080B] overflow-hidden z-20">
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF4A16]/50 to-transparent" 
      />
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF4A16]/25 to-transparent" 
      />
      <InfiniteTextMarquee
        text="FULL-STACK DEVELOPER ✦ WORDPRESS SPECIALIST ✦ FRONTEND ENGINEER ✦ NEXT.JS & REACT ✦ WEB APPLICATIONS ✦ HEADLESS CMS & APIS ✦ E-COMMERCE SOLUTIONS"
        link="#contact"
        speed={38}
        tooltipText="Let's Build Together 🚀"
        fontSize="clamp(2.5rem, 5vw, 4.8rem)"
        textColor="#F8F4F0"
        hoverColor="#FF4A16"
        showTooltip={true}
        className="py-1 tracking-tight uppercase"
      />
    </div>

    <section id="approach" className="en-section en-cream"><div className="en-wrap">
      <SectionHeading label="03 / WHY WORK WITH ME" title="A thoughtful approach." accent="From first idea to final product.">Every project has different goals and challenges. I focus on understanding what you need, choosing a practical approach, and building digital solutions that are useful, maintainable, and aligned with your business.</SectionHeading>
      <div className="en-principles"><div className="en-principle-line" aria-hidden="true" />{principles.map(([title, text], i) => <article className="en-principle en-reveal" key={title}><span className="en-number">{number(i)}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <p className="en-footnote">THOUGHTFUL BY DESIGN. PRACTICAL BY NATURE.</p>
    </div></section>
    {/* 04 / MY TOOLKIT — 4 glassmorphic cards, scroll reveal, and tech logos marquee */}
    <ToolkitSection />
    {/* 05 / Selected Work upgraded to interactive showcase */}
    <ProjectsShowcase />
  </div>;
}
