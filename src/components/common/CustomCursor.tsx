'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop / devices with a fine pointer (mouse)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Add class to body to suppress default arrow cursor
    document.body.classList.add('has-custom-cursor');

    let currentX = -100;
    let currentY = -100;

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant 0ms hardware-accelerated transform centered on hotspot
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    };

    const handlePointerDown = () => setIsClicking(true);
    const handlePointerUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Efficient hover detection on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], label, summary, [data-interactive="true"]'
      );
      setIsHovering(!!interactive);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  return (
    <div
      aria-hidden="true"
      className={`hidden md:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Clean Minimal Tech Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
      >
        <div
          className={`relative -ml-4 -mt-4 w-8 h-8 rounded-full border border-[#FF4A16]/40 transition-all duration-150 ease-out flex items-center justify-center ${
            isHovering
              ? 'scale-150 border-[#FF4A16] bg-[#FF4A16]/15 shadow-[0_0_15px_rgba(255,74,22,0.5)]'
              : isClicking
              ? 'scale-75 border-[#FF4A16] bg-[#FF4A16]/30'
              : 'scale-100 bg-[#FF4A16]/5'
          }`}
        >
          {/* Central Target Micro-Dot */}
          <span
            className={`rounded-full transition-all duration-150 ${
              isHovering
                ? 'w-1.5 h-1.5 bg-white shadow-[0_0_8px_#ffffff]'
                : 'w-1 h-1 bg-[#FF4A16] shadow-[0_0_6px_#FF4A16]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
