"use client";

import React, { useEffect, useRef } from "react";

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const hexToRgb = (hex: string, fallback: string = "255, 74, 22"): string => {
  const m = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec((hex || "").trim());
  if (!m) return fallback;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const n = parseInt(h, 16);
  return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
};

/** Where the beam sits (% across the section) for a pointer at `u` (0 → 1 across). */
export const beamTarget = (u: number, lo: number = 24, hi: number = 84): number =>
  lo + (hi - lo) * clamp(Number.isFinite(u) ? u : 0.5, 0, 1);

/** The beam's idle sway: two slow, unrelated sines so it never visibly loops. */
export const drift = (t: number, centre: number = 54, amp: number = 10): number =>
  centre + amp * (0.7 * Math.sin(t * 0.21) + 0.3 * Math.sin(t * 0.077 + 1.3));

/** Frame-rate independent ease toward a target: `k` is the fraction closed per 1/60s. */
export const approach = (from: number, to: number, k: number, dt: number): number =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

export interface HeroBeamGlowProps {
  accent?: string;
  angle?: string;
  className?: string;
}

const CSS = `
  .hbg-root {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    container-type: inline-size;
    z-index: 1;
  }
  .hbg-sky {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .hbg-wash {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(120% 90% at 8% 0%, rgba(var(--hbg-acc), .22), transparent 55%),
      radial-gradient(90% 70% at 92% 8%, rgba(var(--hbg-acc), .16), transparent 60%),
      linear-gradient(180deg, rgba(var(--hbg-acc), .08), transparent 70%);
  }
  .hbg-bands {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(90deg, rgba(var(--hbg-acc), .05) 0 1.6cqw, transparent 1.6cqw 4.2cqw);
    -webkit-mask-image: linear-gradient(100deg, #000 0%, transparent 60%);
    mask-image: linear-gradient(100deg, #000 0%, transparent 60%);
    opacity: .85;
  }
  .hbg-beam {
    position: absolute;
    inset: 0;
    filter: blur(calc(1px + 1.6cqw));
    background:
      linear-gradient(var(--hbg-ang),
        transparent calc(var(--hbg-b) - 12%),
        rgba(var(--hbg-acc), .12) calc(var(--hbg-b) - 5%),
        rgba(var(--hbg-acc), .42) var(--hbg-b),
        rgba(var(--hbg-acc), .10) calc(var(--hbg-b) + 4%),
        transparent calc(var(--hbg-b) + 10%)
      ),
      linear-gradient(var(--hbg-ang),
        transparent calc(var(--hbg-b) - 34%),
        rgba(var(--hbg-acc), .12) calc(var(--hbg-b) - 27%),
        transparent calc(var(--hbg-b) - 20%)
      );
  }
  .hbg-glow {
    position: absolute;
    inset: 0;
    opacity: var(--hbg-g);
    background: radial-gradient(circle 28cqw at var(--hbg-px) var(--hbg-py), rgba(var(--hbg-acc), .28), transparent 70%);
  }
  .hbg-grain {
    position: absolute;
    inset: 0;
    opacity: .14;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  }
`;

export function HeroBeamGlow({
  accent = "#FF4A16",
  angle = "118deg",
  className = "",
}: HeroBeamGlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ptr = useRef({ u: 0.5, x: 0, y: 0, inside: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Use parent section for pointer events (catches pointer across the hero banner)
    const targetEl = root.parentElement || root;

    const onPointer = (e: MouseEvent | PointerEvent) => {
      const r = targetEl.getBoundingClientRect();
      const p = ptr.current;
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      p.u = r.width ? p.x / r.width : 0.5;
      p.inside = true;
    };

    const onLeave = () => {
      ptr.current.inside = false;
    };

    targetEl.addEventListener("pointermove", onPointer, { passive: true });
    targetEl.addEventListener("pointerenter", onPointer, { passive: true });
    targetEl.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let last = performance.now();
    let t = last / 1000;
    let b = 54;
    let px = targetEl.clientWidth * 0.5;
    let py = targetEl.clientHeight * 0.5;
    let g = 0;

    const setProps = (bVal: number, pxVal: number, pyVal: number, gVal: number) => {
      root.style.setProperty("--hbg-b", bVal.toFixed(2) + "%");
      root.style.setProperty("--hbg-px", pxVal.toFixed(1) + "px");
      root.style.setProperty("--hbg-py", pyVal.toFixed(1) + "px");
      root.style.setProperty("--hbg-g", gVal.toFixed(3));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt;

      const p = ptr.current;
      const idle = drift(t);
      const target = p.inside ? beamTarget(p.u) * 0.78 + idle * 0.22 : idle;

      b = approach(b, target, 0.04, dt);
      px = approach(px, p.x, 0.16, dt);
      py = approach(py, p.y, 0.16, dt);
      g = approach(g, p.inside ? 1 : 0, 0.06, dt);

      setProps(b, px, py, g);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      targetEl.removeEventListener("pointermove", onPointer);
      targetEl.removeEventListener("pointerenter", onPointer);
      targetEl.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const vars = {
    "--hbg-acc": hexToRgb(accent),
    "--hbg-ang": angle,
    "--hbg-b": "54%",
    "--hbg-px": "50%",
    "--hbg-py": "50%",
    "--hbg-g": "0",
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className={`hbg-root ${className}`} style={vars} aria-hidden="true">
      <style>{CSS}</style>
      <div className="hbg-sky">
        <div className="hbg-wash" />
        <div className="hbg-bands" />
        <div className="hbg-beam" />
        <div className="hbg-glow" />
        <div className="hbg-grain" />
      </div>
    </div>
  );
}

export default HeroBeamGlow;
