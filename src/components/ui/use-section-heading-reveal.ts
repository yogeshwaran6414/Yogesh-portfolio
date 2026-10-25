'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Reuses the Section 4 (Toolkit) heading's masked character entrance and intro reveal
 * for Section 2 (What I Build) and Section 3 (Why Work With Me).
 */
export function useSectionHeadingReveal(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 501px)', () => {
      const splits: SplitText[] = [];
      const context = gsap.context(() => {
        // Collect headings: either scope itself or any descendants with data-section-heading
        const headings: HTMLElement[] = [];
        if (scope.hasAttribute('data-section-heading')) {
          headings.push(scope);
        } else {
          headings.push(...Array.from(scope.querySelectorAll<HTMLElement>('[data-section-heading]')));
        }

        headings.forEach((heading) => {
          const lines = heading.querySelectorAll<HTMLElement>('[data-section-heading-line]');
          if (!lines.length) return;

          // Split characters with masks matching Section 4 entrance animation
          const split = SplitText.create(lines, {
            type: 'chars',
            mask: 'chars',
            aria: 'auto',
          });
          splits.push(split);

          gsap.from(split.chars, {
            yPercent: 110,
            duration: 1,
            stagger: 0.018,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              once: true,
            },
          });

          // Section label fade and slide entrance
          const label = heading.querySelector<HTMLElement>('.en-label');
          if (label) {
            gsap.from(label, {
              y: 20,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                once: true,
              },
            });
          }

          // Supporting paragraph reveal matching Section 4 intro reveal
          const supportingCopy = heading.querySelectorAll<HTMLElement>('[data-section-heading-support]');
          if (supportingCopy.length) {
            gsap.from(supportingCopy, {
              y: 30,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 75%',
                once: true,
              },
            });
          }
        });
      }, scope);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        clearTimeout(timer);
        context.revert();
        splits.forEach((split) => split.revert());
      };
    });

    return () => media.revert();
  }, [scopeRef]);
}
