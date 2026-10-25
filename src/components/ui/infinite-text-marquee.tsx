"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

export type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
  className?: string;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = "#contact",
  speed = 36,
  showTooltip = true,
  tooltipText = "Let's Build Together 🚀",
  fontSize = "clamp(2.5rem, 5vw, 4.8rem)",
  textColor = "#F8F4F0",
  hoverColor = "#FF4A16",
  className = "",
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const maxRotation = 8;

  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!showTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      const midpoint = window.innerWidth / 2;
      const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
      const rot = (distanceFromMidpoint / midpoint) * maxRotation;

      setRotation(e.clientX > midpoint ? rot : -rot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  // Clean trailing separator so we can format it uniformly
  const cleanText = text.trim().replace(/[✦—\s]+$/, "");
  const singleUnit = `${cleanText} ✦ `;
  // 2 repeats per track ensure plenty of content on all monitor widths
  const trackContent = `${singleUnit}${singleUnit}`;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let tween: gsap.core.Tween;

    // Small timeout to ensure DOM has rendered fonts and computed accurate scrollWidth
    const timer = setTimeout(() => {
      // Total scroll width is Track 1 + Track 2. Exactly half is Track 1.
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;

      // Reset transform cleanly
      gsap.set(track, { x: 0 });

      // Infinite seamless loop from 0 to -halfWidth
      tween = gsap.to(track, {
        x: -halfWidth,
        duration: Math.max(20, speed),
        ease: "none",
        repeat: -1,
      });

      tweenRef.current = tween;
    }, 60);

    return () => {
      clearTimeout(timer);
      if (tween) tween.kill();
    };
  }, [trackContent, speed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (tweenRef.current) {
      tweenRef.current.timeScale(0.25); // Smoothly slow down on hover so text can be read or clicked
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (tweenRef.current) {
      tweenRef.current.timeScale(1); // Resume normal scroll speed
    }
  };

  return (
    <>
      {showTooltip && (
        <div
          className={`following-tooltip fixed z-[99] pointer-events-none transition-opacity duration-300 font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-nowrap select-none shadow-[0_12px_40px_rgba(255,74,22,0.4)]
            ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            bg-[#FF4A16] text-[#F8F4F0] border border-[#FF6B35]/40 backdrop-blur-md
          `}
          style={{
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            transform: `rotateZ(${rotation}deg) translate(-50%, -135%)`,
            transitionProperty: "opacity, transform",
          }}
        >
          <p className="text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2">
            <span>{tooltipText}</span>
          </p>
        </div>
      )}

      <div className={`relative w-full overflow-hidden select-none ${className}`}>
        <div
          ref={trackRef}
          className="flex flex-nowrap w-max will-change-transform cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Track 1 */}
          <Link
            href={link}
            className="shrink-0 flex items-center py-4 sm:py-6"
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-bold tracking-tight py-1 m-0 transition-all duration-300 whitespace-nowrap"
              style={{
                fontSize,
                color: isHovered && hoverColor ? hoverColor : (textColor || undefined),
                transition: "color 0.3s ease, filter 0.3s ease",
                filter: isHovered && hoverColor ? "drop-shadow(0 0 25px rgba(255,74,22,0.5))" : undefined,
              }}
            >
              {trackContent}
            </span>
          </Link>

          {/* Track 2 (Identical clone for 100% mathematically seamless infinite loop) */}
          <Link
            href={link}
            className="shrink-0 flex items-center py-4 sm:py-6"
            aria-hidden="true"
            tabIndex={-1}
            style={{ textDecoration: "none" }}
          >
            <span
              className="font-bold tracking-tight py-1 m-0 transition-all duration-300 whitespace-nowrap"
              style={{
                fontSize,
                color: isHovered && hoverColor ? hoverColor : (textColor || undefined),
                transition: "color 0.3s ease, filter 0.3s ease",
                filter: isHovered && hoverColor ? "drop-shadow(0 0 25px rgba(255,74,22,0.5))" : undefined,
              }}
            >
              {trackContent}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InfiniteTextMarquee;
