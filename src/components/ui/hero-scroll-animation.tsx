'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '../../data/projectsData';
import './hero-scroll-animation.css';

interface HeroScrollAnimationProps {
  hero: React.ReactNode;
  children: React.ReactNode;
}

const COLLAGE_COLUMNS = [
  PROJECTS_DATA.filter((_, index) => index % 2 === 0),
  PROJECTS_DATA.filter((_, index) => index % 2 === 1),
];

function ProjectCollage() {
  return <div className="hero-project-backdrop-sticky" aria-hidden="true">
      {COLLAGE_COLUMNS.map((projects, columnIndex) => (
        <div className={`hero-project-column hero-project-column-${columnIndex + 1}`} key={columnIndex}>
          {projects.map((project, imageIndex) => (
            <figure className="hero-project-tile" key={project.id}>
              <img src={project.image} alt="" loading={imageIndex < 2 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ))}
        </div>
      ))}
  </div>;
}

/**
 * Reference-style hero handoff: the full-viewport hero contracts into the
 * centre while the existing second section resolves behind it. No section
 * content is duplicated or changed.
 */
export default function HeroScrollAnimation({ hero, children }: HeroScrollAnimationProps) {
  const stage = useRef<HTMLDivElement>(null);
  const outgoing = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      animate: '(prefers-reduced-motion: no-preference) and (min-height: 560px)',
      desktop: '(min-width: 768px)',
    }, context => {
      if (!context.conditions?.animate || !stage.current || !outgoing.current || !backdrop.current) return;

      const targetScale = context.conditions.desktop ? 0.5 : 0.76;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'hero-shrink',
          trigger: stage.current,
          start: 'top top',
          // A 300vh stage gives the sticky hero exactly two viewports to shrink.
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(outgoing.current,
        { scale: 1 },
        { scale: targetScale, duration: 1 },
        0,
      );
      timeline.fromTo(backdrop.current,
        { autoAlpha: 0.35, filter: 'blur(24px)', scale: 1.025 },
        { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 0.5 },
        0,
      );
    }, stage);
    return () => media.revert();
  }, []);

  return <>
    <div id="hero" className="hero-scroll-stage" ref={stage}>
      <div ref={backdrop} className="hero-project-backdrop"><ProjectCollage /></div>
      <div className="hero-scroll-outgoing" ref={outgoing}>{hero}</div>
    </div>
    <div id="services" className="hero-scroll-incoming">{children}</div>
  </>;
}
