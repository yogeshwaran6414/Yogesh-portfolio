'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ParticleBackgroundProps {
  particleCount?: number;
  speed?: number;
  brightness?: number;
  glitterIntensity?: number;
  trailAmount?: number;
  reverse?: boolean;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  color: ColorRGB;
  twinklePhase: number;
  twinkleSpeed: number;
  size: number;
}

/**
 * Parses a 6-digit hex color (#ffffff, #3B82F6, #1d4ed8) to RGB components.
 * Precomputed once per color to avoid parsing strings inside 60fps draw loop.
 */
function parseHexColor(hex: string): ColorRGB {
  const clean = hex.replace('#', '').trim();
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export default function ParticleBackground({
  particleCount = 150,
  speed = 2,
  brightness = 40,
  glitterIntensity = 2,
  trailAmount = 92,
  reverse = true,
  color1 = '#F8F4F0',
  color2 = '#FF4A16',
  color3 = '#8D160D',
  className = '',
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Detect accessibility preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Accessibility check: Do not initialize canvas or requestAnimationFrame if reduced motion is preferred
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let fov = 300;

    // Color caching: parse color palette once up front
    const colorPalette: ColorRGB[] = [
      parseHexColor(color1),
      parseHexColor(color2),
      parseHexColor(color3),
    ];

    const maxDepth = 1000;

    // Star particle initialization helper
    const createStar = (initialSpread = true): StarParticle => {
      // 3D coordinate space centered at (0, 0)
      const spreadX = (width || 800) * 1.6;
      const spreadY = (height || 600) * 1.6;
      const z = initialSpread ? Math.random() * maxDepth : reverse ? maxDepth : 10;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      return {
        x: (Math.random() - 0.5) * spreadX,
        y: (Math.random() - 0.5) * spreadY,
        z,
        prevZ: z,
        color,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        size: 0.8 + Math.random() * 1.2,
      };
    };

    let stars: StarParticle[] = [];

    // Resize handler keeping crisp backing store matching device pixel ratio
    const updateDimensions = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      centerX = width / 2;
      centerY = height / 2;
      fov = Math.max(width, height) * 0.5;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initial solid background fill to avoid transparent flash
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
    };

    updateDimensions();

    // Populate particles
    stars = Array.from({ length: particleCount }, () => createStar(true));

    // Observe container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    // Trail amount calculation: 92 -> clearAlpha ~0.08, leaving 92% of the trail
    const clampedTrail = Math.min(99, Math.max(0, trailAmount));
    const clearAlpha = Math.max(0.01, (100 - clampedTrail) / 100);
    const baseBrightness = Math.max(0.05, Math.min(1, brightness / 100));

    // Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isRunning) return;

      const deltaMs = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;
      const deltaFactor = deltaMs / 16.667;

      // Soft trail clearing into Contact section's dark #0a0a0a background
      ctx.fillStyle = `rgba(10, 10, 10, ${clearAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Slower, calmer velocity tuned for subtle background accents
      const step = speed * 1.25 * deltaFactor;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.prevZ = star.z;

        // reverse: true -> particles drift outward smoothly away from center
        // reverse: false -> particles rush inward toward center
        if (reverse) {
          star.z -= step;
        } else {
          star.z += step;
        }

        // Current projected 2D coordinates
        const k = fov / Math.max(1, star.z);
        const currX = centerX + star.x * k;
        const currY = centerY + star.y * k;

        // Previous projected 2D coordinates for trail drawing
        const prevK = fov / Math.max(1, star.prevZ);
        const prevX = centerX + star.x * prevK;
        const prevY = centerY + star.y * prevK;

        // Boundary check: reset star if it moves out of depth or screen viewport
        const isOutOfBounds =
          star.z <= 1 ||
          star.z >= maxDepth ||
          currX < -50 ||
          currX > width + 50 ||
          currY < -50 ||
          currY > height + 50;

        if (isOutOfBounds) {
          stars[i] = createStar(false);
          continue;
        }

        // Glitter Twinkle / Sparkle modulation
        star.twinklePhase += star.twinkleSpeed * (1 + glitterIntensity * 0.3) * deltaFactor;
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        const glitterMod = 1 + (twinkle - 0.5) * (glitterIntensity * 0.35);

        // Depth-based scale and alpha
        const depthFactor = (maxDepth - star.z) / maxDepth;
        const radius = Math.max(0.4, star.size * (0.4 + depthFactor * 1.2));
        const alpha = Math.max(
          0.02,
          Math.min(1, baseBrightness * (0.25 + depthFactor * 0.75) * glitterMod)
        );

        const { r, g, b } = star.color;

        // 1. Draw smooth directional trail streak connecting prev and current positions
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
        ctx.lineWidth = radius * 0.85;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. Draw particle head / star point
        ctx.beginPath();
        ctx.arc(currX, currY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup: cancel RAF and disconnect ResizeObserver on unmount
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [
    prefersReducedMotion,
    particleCount,
    speed,
    brightness,
    glitterIntensity,
    trailAmount,
    reverse,
    color1,
    color2,
    color3,
  ]);

  // Reduced-motion fallback: clean static background color #0a0a0a without canvas or animations
  if (prefersReducedMotion) {
    return (
      <div
        className={`absolute inset-0 z-0 pointer-events-none bg-[#0a0a0a] ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
