"use client";

/**
 * InversionCircleScrollAnimation
 *
 * Scroll-driven animation merged from:
 *   +page.svelte                  → hero circle animation
 *   ContentSection.svelte         → scroll-reveal section
 *   Button.svelte                 → CTA button
 *
 * How it works:
 *   The wrapper div acts as the scroll track or container.
 *   Inside it lives a 300vh scroll track. The hero section is sticky inside
 *   that track, so it stays pinned while the track scrolls past.
 *
 *   Phase 1 (scroll 0→viewH):
 *     A black circle rises from below the screen to dead-centre.
 *     Easing: Power4 InOut (slow → fast → slow).
 *
 *   Phase 2 (scroll viewH→2×viewH):
 *     The circle expands from 380px diameter until it fills the screen.
 *     Easing: ease-in² (accelerates as it grows).
 *
 *   A CSS clip-path mirrors the circle position exactly, revealing
 *   white text inside the black circle → colour inversion effect.
 *
 *   Below the hero a ContentSection fades in (black→white background)
 *   when 35% of it enters the scroll container viewport.
 */

import React, { useEffect, useRef, useState } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const BALL_SIZE = 380; // px — fixed diameter during Phase 1 travel

type WRef = React.RefObject<HTMLDivElement | null>;

export interface InversionCircleScrollAnimationProps {
  standalone?: boolean;
  className?: string;
}

// ─── root export ──────────────────────────────────────────────────────────────
export default function InversionCircleScrollAnimation({
  standalone = false,
  className = "",
}: InversionCircleScrollAnimationProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Styles />
      <div
        ref={wrapperRef}
        className={`icsa-wrap ${standalone ? "icsa-standalone" : "icsa-embedded"} ${className}`}
      >
        <HeroSection wrapperRef={wrapperRef} standalone={standalone} />
        <ContentSection wrapperRef={wrapperRef} standalone={standalone} />
      </div>
    </>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
function HeroSection({
  wrapperRef,
  standalone,
}: {
  wrapperRef: WRef;
  standalone?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);

  useEffect(() => {
    const isWindow = !standalone;

    const measure = () => {
      if (isWindow) {
        setViewH(window.innerHeight || 600);
        setViewW(window.innerWidth || 800);
      } else {
        const el = wrapperRef.current;
        if (el) {
          setViewH(el.clientHeight);
          setViewW(el.clientWidth);
        }
      }
    };
    measure();

    const onScroll = () => {
      if (isWindow) {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const scrolled = Math.max(0, -rect.top);
        setScrollY(scrolled);
      } else {
        const el = wrapperRef.current;
        if (el) setScrollY(el.scrollTop);
      }
    };

    window.addEventListener("resize", measure, { passive: true });
    if (isWindow) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      const el = wrapperRef.current;
      el?.addEventListener("scroll", onScroll, { passive: true });
    }

    onScroll();

    return () => {
      window.removeEventListener("resize", measure);
      if (isWindow) {
        window.removeEventListener("scroll", onScroll);
      } else {
        const el = wrapperRef.current;
        el?.removeEventListener("scroll", onScroll);
      }
    };
  }, [wrapperRef, standalone]);

  // phase progress 0 → 1
  const p1 = clamp(scrollY / viewH);
  const p2 = clamp((scrollY - viewH) / viewH);

  // Power4 InOut
  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  // ease-in²
  const p2e = p2 * p2;

  // geometry
  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <div ref={trackRef} className="icsa-track">
      <section className="icsa-hero">
        {/* expanding black circle */}
        <div
          className="icsa-ball"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOff}px))`,
          }}
        />

        {/* black text — always visible */}
        <div className="icsa-layer icsa-dark">
          <h1>Design that moves.</h1>
          <p>Scroll to reveal the future.</p>
        </div>

        {/* white text — clipped to the circle (inversion) */}
        <div
          className="icsa-layer icsa-light"
          style={{ clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)` }}
        >
          <h1>Design that moves.</h1>
          <p>Scroll to reveal the future.</p>
        </div>
      </section>
    </div>
  );
}

// ─── ContentSection ───────────────────────────────────────────────────────────
function ContentSection({
  wrapperRef,
  standalone,
}: {
  wrapperRef: WRef;
  standalone?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = standalone ? wrapperRef.current : null;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { root, threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wrapperRef, standalone]);

  return (
    <section ref={ref} className={`icsa-cs${on ? " on" : ""}`}>
      <div className="icsa-inner">
        <span className="icsa-label">What comes next</span>
        <h2>
          Build with intention.
          <br />
          Ship with confidence.
        </h2>
        <p>
          Every great product starts with a clear vision and a simple idea.
          From a blank canvas to something remarkable — the only thing between
          you and it is the work.
        </p>
        <CTAButton />
      </div>
    </section>
  );
}

// ─── Button (from Button.svelte) ──────────────────────────────────────────────
function CTAButton() {
  const handleClick = () => {
    const el = document.getElementById("contact") || document.getElementById("project-inquiry");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button onClick={handleClick} className="icsa-btn" type="button">
      Get started
    </button>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── styles ───────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');

      .icsa-wrap *, .icsa-wrap *::before, .icsa-wrap *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      /* ── scroll container ──────────────────────────────────────────────
         standalone: own scroll context (height: 100vh)
         embedded: flows with the main document scroll
      ─────────────────────────────────────────────────────────────────── */
      .icsa-wrap {
        width: 100%;
        font-family: var(--font-inter), Inter, sans-serif;
        background: #fff;
      }

      .icsa-wrap.icsa-standalone {
        height: 100vh;
        overflow-y: scroll;
        overflow-x: clip;
      }

      .icsa-wrap.icsa-embedded {
        position: relative;
        overflow-x: clip;
      }

      /* 300 vh scroll room; hero sticks inside */
      .icsa-track {
        height: 300vh;
        position: relative;
        background: #fff;
      }

      /* pinned hero */
      .icsa-hero {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        background: #fff;
      }

      /* ball */
      .icsa-ball {
        position: absolute; top: 50%; left: 50%;
        border-radius: 50%; background: #000;
        will-change: transform, width, height;
      }

      /* text layers */
      .icsa-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        text-align: center; padding: 0 2rem;
        pointer-events: none;
      }
      .icsa-dark  { color: #000; z-index: 2; }
      .icsa-light { color: #fff; z-index: 3; will-change: clip-path; }

      .icsa-layer h1 {
        font-size: clamp(2.5rem, 7vw, 6rem);
        font-weight: 900; letter-spacing: -0.03em; line-height: 1.05;
        font-family: var(--font-sora), var(--font-inter), sans-serif;
      }
      .icsa-layer p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 400; margin-top: 1.25rem; opacity: .7;
      }

      /* ── content section ── */
      .icsa-cs {
        min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        padding: 6rem 2rem;
        background: #000; color: #fff;
        transition: background 2.4s cubic-bezier(.25,0,.1,1),
                    color      2.4s cubic-bezier(.25,0,.1,1);
      }
      .icsa-cs.on { background: #fff; color: #000; }

      .icsa-inner {
        max-width: 720px; text-align: center;
        display: flex; flex-direction: column;
        align-items: center; gap: 1.75rem;
      }

      .icsa-inner > * {
        opacity: 0; transform: translateY(24px);
        transition: opacity .7s ease, transform .7s ease;
      }
      .icsa-cs.on .icsa-inner > * { opacity: 1; transform: translateY(0); }

      .icsa-cs.on .icsa-label { transition-delay: .10s; }
      .icsa-cs.on h2          { transition-delay: .24s; }
      .icsa-cs.on p           { transition-delay: .38s; }
      .icsa-cs.on .icsa-btn   { transition-delay: .52s; }

      .icsa-label {
        font-size: .75rem; font-weight: 600;
        letter-spacing: .18em; text-transform: uppercase; opacity: .45;
      }
      .icsa-inner h2 {
        font-size: clamp(2rem, 6vw, 4rem);
        font-weight: 900; letter-spacing: -.03em; line-height: 1.08;
        font-family: var(--font-sora), var(--font-inter), sans-serif;
      }
      .icsa-inner p {
        font-size: clamp(1rem, 2vw, 1.2rem);
        line-height: 1.75; opacity: .6; max-width: 560px;
      }

      /* button */
      .icsa-btn {
        background: #FF4A16; color: #fff;
        padding: 12px 32px; border-radius: 9999px; border: none;
        cursor: pointer; font-family: inherit;
        font-size: 1rem; font-weight: 600; letter-spacing: .01em;
        transition: opacity .2s ease, transform .2s ease, background .2s ease;
        box-shadow: 0 4px 18px rgba(255, 74, 22, 0.35);
      }
      .icsa-btn:hover  { opacity: .9; transform: translateY(-2px); background: #FF6B35; }
      .icsa-btn:active { opacity: 1;   transform: translateY(0);    }
    `}</style>
  );
}
