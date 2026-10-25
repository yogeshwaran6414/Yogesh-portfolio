import React, { useRef, useState, useEffect, useCallback } from 'react';
import { DeveloperPortraitSvg } from './DeveloperPortraitSvg';
import { SpidermanPortraitSvg } from './SpidermanPortraitSvg';

interface SpotlightRevealPortraitProps {
  baseImage: string;
  revealImage: string | null;
  heightPercent: number;
  portraitScale?: number;
  brushRadius?: number;
  isAdjustingRadius?: boolean;
  maskTheme?: 'light-blue' | 'classic-red';
  maskOpacity?: number;
  revealMode?: 'scattered' | 'spotlight';
  showLensRing?: boolean;
  alignX?: number;
  alignY?: number;
  alignScale?: number;
  isAlignMode?: boolean;
  autoDemo?: boolean;
  onBaseError?: () => void;
  onRevealError?: () => void;
  onSetHoverFaceClick?: () => void;
}

export const SpotlightRevealPortrait: React.FC<SpotlightRevealPortraitProps> = ({
  baseImage,
  revealImage,
  heightPercent,
  portraitScale = 1.0,
  brushRadius = 140,
  maskTheme = 'classic-red',
  maskOpacity = 0.9,
  alignX = 0,
  alignY = 0,
  alignScale = 1.0,
  isAlignMode = false,
  onBaseError,
  onRevealError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseImgRef = useRef<HTMLImageElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);

  const [baseImgFailed, setBaseImgFailed] = useState(false);
  const [revealImgFailed, setRevealImgFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Directly apply the radial mask centered EXACTLY on the cursor
  const updateMaskToCursor = useCallback(
    (clientX: number, clientY: number) => {
      const layer = revealLayerRef.current;
      if (!layer) return;

      const rect = layer.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Check if cursor is actually inside the image layer bounds
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsHovered(false);
        layer.style.opacity = '0';
        layer.style.webkitMaskImage = 'none';
        layer.style.maskImage = 'none';
        return;
      }

      // Calculate percentage position relative to the reveal layer itself
      const px = ((clientX - rect.left) / rect.width) * 100;
      const py = ((clientY - rect.top) / rect.height) * 100;

      // Center of the radial gradient is now 1:1 with cursor (zero offset)
      const maskStr = `radial-gradient(circle ${brushRadius}px at ${px}% ${py}%, black 0%, black 50%, rgba(0,0,0,0.65) 75%, transparent 100%)`;

      layer.style.opacity = '1';
      layer.style.webkitMaskImage = maskStr;
      layer.style.maskImage = maskStr;
      layer.style.webkitMaskRepeat = 'no-repeat';
      layer.style.maskRepeat = 'no-repeat';
    },
    [brushRadius]
  );

  // Pointer move: update mask in real-time with zero delay
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsHovered(true);
      updateMaskToCursor(e.clientX, e.clientY);
    },
    [updateMaskToCursor]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsHovered(true);
      updateMaskToCursor(e.clientX, e.clientY);
    },
    [updateMaskToCursor]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    const layer = revealLayerRef.current;
    if (layer) {
      layer.style.opacity = '0';
      layer.style.webkitMaskImage = 'none';
      layer.style.maskImage = 'none';
    }
  }, []);

  // Global window listener: If cursor exits window, immediately hide the mask
  useEffect(() => {
    const handleGlobalLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setIsHovered(false);
        const layer = revealLayerRef.current;
        if (layer) {
          layer.style.opacity = '0';
          layer.style.webkitMaskImage = 'none';
          layer.style.maskImage = 'none';
        }
      }
    };

    window.addEventListener('mouseout', handleGlobalLeave);
    return () => {
      window.removeEventListener('mouseout', handleGlobalLeave);
    };
  }, []);

  const transformStyle: React.CSSProperties = {
    transform: `translate3d(${alignX}px, ${alignY}px, 0) scale(${alignScale})`,
    transformOrigin: '50% 28%',
  };

  return (
    <div
      ref={containerRef}
      data-entrance="person"
      style={{
        height: `${heightPercent}vh`,
        transform: portraitScale !== 1.0 ? `scale(${portraitScale})` : undefined,
        transformOrigin: 'bottom center',
        transition: 'height 0.2s ease-out, transform 0.2s ease-out',
      }}
      className="relative w-full max-w-[96vw] sm:max-w-[850px] flex items-end justify-center pointer-events-auto cursor-pointer select-none group touch-none"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="relative w-auto h-full flex items-end justify-center">
        {/* ========================================================= */}
        {/* 1. BASE LAYER (Original Developer Photo / Portrait)       */}
        {/* ========================================================= */}
        {baseImage && !baseImgFailed ? (
          <img
            ref={baseImgRef}
            src={baseImage}
            alt="Developer Foreground"
            referrerPolicy="no-referrer"
            className="block h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] select-none pointer-events-none"
            onError={() => {
              setBaseImgFailed(true);
              onBaseError?.();
            }}
            id="parallax-person-img"
          />
        ) : (
          <div className="h-full w-auto flex items-end justify-center">
            <DeveloperPortraitSvg
              className={`h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-opacity duration-200 ${
                isAlignMode ? 'opacity-50' : 'opacity-100'
              }`}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. REVEAL LAYER (Spider-Man Mask or Custom Face)          */}
        {/* Only visible on active hover, exactly centered on cursor */}
        {/* ========================================================= */}
        <div
          ref={revealLayerRef}
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease-out',
            ...transformStyle,
          }}
          className={`absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-10 ${
            isAlignMode ? 'hidden' : 'block'
          }`}
        >
          {revealImage && !revealImgFailed ? (
            <img
              src={revealImage}
              alt="Custom Face Reveal"
              referrerPolicy="no-referrer"
              className="block h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
              style={{ opacity: maskOpacity }}
              onError={() => {
                setRevealImgFailed(true);
                onRevealError?.();
              }}
            />
          ) : (
            <SpidermanPortraitSvg
              theme={maskTheme}
              opacity={maskOpacity}
              faceOnly={true}
              className="block h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
            />
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. ALIGN MODE OVERLAY (Visible ONLY when calibrating)     */}
        {/* ========================================================= */}
        {isAlignMode && (
          <div
            style={transformStyle}
            className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none opacity-50 z-20"
          >
            {revealImage && !revealImgFailed ? (
              <img
                src={revealImage}
                alt="Custom Mask Align"
                referrerPolicy="no-referrer"
                className="block h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
              />
            ) : (
              <SpidermanPortraitSvg
                theme={maskTheme}
                opacity={maskOpacity}
                faceOnly={true}
                className="block h-full w-auto max-w-full object-contain object-bottom select-none pointer-events-none"
              />
            )}
          </div>
        )}

        {/* Calibration Guide Lines */}
        {isAlignMode && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-30 flex flex-col justify-end">
            <div className="relative w-full h-full flex items-end justify-center">
              <div className="absolute top-[18%] left-0 right-0 flex items-center justify-between px-2 border-t-2 border-dashed border-cyan-400 opacity-80">
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded shadow">
                  ▲ Top of Head
                </span>
                <span className="text-[9px] font-mono text-cyan-400">Target Match</span>
              </div>
              <div className="absolute top-[30%] left-0 right-0 flex items-center justify-between px-2 border-t border-dashed border-amber-400 opacity-80">
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded shadow">
                  ◉ Eye Level
                </span>
                <span className="text-[9px] font-mono text-amber-400">Eye-to-Eye</span>
              </div>
              <div className="absolute top-[42%] left-0 right-0 flex items-center justify-between px-2 border-t-2 border-solid border-red-500 opacity-90 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <span className="text-[10px] font-mono bg-red-950 text-red-300 px-1.5 py-0.5 rounded shadow font-bold">
                  ▼ Chin Line
                </span>
                <span className="text-[9px] font-mono text-red-400">Head-to-Chin Lock</span>
              </div>
              <div className="absolute top-[52%] left-0 right-0 flex items-center justify-between px-2 border-t border-dashed border-emerald-400 opacity-80">
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded shadow">
                  ▬ Shoulder Line
                </span>
                <span className="text-[9px] font-mono text-emerald-400">Shoulder-to-Shoulder</span>
              </div>
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-dashed border-blue-500/50 w-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
