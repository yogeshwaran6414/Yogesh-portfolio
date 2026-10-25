import React from 'react';

interface SpidermanPortraitSvgProps {
  className?: string;
  theme?: 'light-blue' | 'classic-red';
  opacity?: number;
  faceOnly?: boolean;
}

export const SpidermanPortraitSvg: React.FC<SpidermanPortraitSvgProps> = ({
  className = '',
  theme = 'light-blue',
  opacity = 0.82,
  faceOnly = true,
}) => {
  const isLightBlue = theme === 'light-blue';

  return (
    <svg
      viewBox="0 0 800 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-contain object-bottom select-none ${className}`}
      style={{ opacity }}
      aria-label="Glowing Spider-Man Face Mask"
    >
      <defs>
        {/* ========================================================= */}
        {/* 1. LIGHT-BLUE / NEON CYAN HOLOGRAPHIC THEME GRADIENTS     */}
        {/* ========================================================= */}

        {/* Luminous Light Blue Translucent Face Mask Shield */}
        <linearGradient id="spideyFaceGlowGrad" x1="400" y1="200" x2="400" y2="610" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#0284c7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.75" />
        </linearGradient>

        {/* 3D Spherical Face Curvature Radial Glow (Non-dark, luminous center) */}
        <radialGradient id="spideyFaceSphereGlow" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="75%" stopColor="#0284c7" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.55" />
        </radialGradient>

        {/* Neon Light-Blue Outer Rim Border Gradient */}
        <linearGradient id="neonRimGrad" x1="290" y1="200" x2="510" y2="610" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="30%" stopColor="#00f0ff" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Radiant Spider Eye Lens (Brilliant White to Light Cyan) */}
        <linearGradient id="spideyEyeLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f0f9ff" />
          <stop offset="70%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Eye Bezel Frame Gradient (Deep Sleek Azure, not pitch black) */}
        <linearGradient id="spideyEyeBezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* ========================================================= */}
        {/* 2. CLASSIC RED ALTERNATIVE GRADIENTS                      */}
        {/* ========================================================= */}
        <linearGradient id="suitRedGrad" x1="400" y1="120" x2="400" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#dc2626" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#991b1b" stopOpacity="0.9" />
        </linearGradient>

        {/* ========================================================= */}
        {/* 3. GLOW AND SHADOW FILTERS                                */}
        {/* ========================================================= */}

        {/* Intense Neon Cyan Aura Filter */}
        <filter id="neonCyanGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00f0ff" floodOpacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#38bdf8" floodOpacity="0.65" />
        </filter>

        {/* Eye Lens Brilliant White & Cyan Aura Filter */}
        <filter id="eyeLensGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#00f0ff" floodOpacity="0.75" />
        </filter>

        {/* Subtle Web Trace Glow */}
        <filter id="webTraceGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00f0ff" floodOpacity="0.8" />
        </filter>

        {/* Subtle Futuristic Hexagonal Micro-Grid Pattern */}
        <pattern id="spideyHexPattern" width="10" height="10" patternUnits="userSpaceOnUse">
          <polygon
            points="5,0 9.33,2.5 9.33,7.5 5,10 0.67,7.5 0.67,2.5"
            fill="none"
            stroke={isLightBlue ? '#38bdf8' : '#fca5a5'}
            strokeWidth="0.65"
            opacity="0.22"
          />
        </pattern>
      </defs>

      <g id="spiderman-mask-root">
        {/* Optional Ambient Rim Halo behind Face */}
        <g id="spiderman-ambient-aura" transform="translate(400, 255) scale(0.66) translate(-400, -380)">
          <ellipse
            cx="400"
            cy="400"
            rx="145"
            ry="210"
            fill={isLightBlue ? 'rgba(0, 240, 255, 0.15)' : 'rgba(239, 68, 68, 0.15)'}
            filter="url(#neonCyanGlow)"
          />
        </g>

        {/* ========================================================= */}
        {/* GLOWING SPIDER-MAN FACE MASK                              */}
        {/* Uses the exact coordinate transform as DeveloperPortrait: */}
        {/* transform="translate(400, 255) scale(0.66) translate(-400, -380)" */}
        {/* Perfectly locks to user's head, eyes, and chin 1:1!        */}
        {/* ========================================================= */}
        <g id="spiderman-face-mask" transform="translate(400, 255) scale(0.66) translate(-400, -380)">
          {/* 1. MASK BASE SILHOUETTE (Covers ONLY the face!) */}
          <g id="mask-base-layer">
            {/* Luminous Light-Blue / Cyan Translucent Shield */}
            <path
              d="M 295 380 
                 C 290 280 320 200 400 200 
                 C 480 200 510 280 505 380 
                 C 502 460 485 540 450 580 
                 C 420 605 380 605 350 580 
                 C 315 540 298 460 295 380 Z"
              fill={isLightBlue ? 'url(#spideyFaceGlowGrad)' : 'url(#suitRedGrad)'}
            />

            {/* 3D Curved Skull Shading Layer (Highlights forehead and cheeks, non-dark) */}
            <path
              d="M 295 380 
                 C 290 280 320 200 400 200 
                 C 480 200 510 280 505 380 
                 C 502 460 485 540 450 580 
                 C 420 605 380 605 350 580 
                 C 315 540 298 460 295 380 Z"
              fill="url(#spideyFaceSphereGlow)"
            />

            {/* Subtle Futuristic Nano-Hex Grid Overlay */}
            <path
              d="M 295 380 
                 C 290 280 320 200 400 200 
                 C 480 200 510 280 505 380 
                 C 502 460 485 540 450 580 
                 C 420 605 380 605 350 580 
                 C 315 540 298 460 295 380 Z"
              fill="url(#spideyHexPattern)"
            />

            {/* Glowing Neon Contour Boundary Stroke */}
            <path
              d="M 295 380 
                 C 290 280 320 200 400 200 
                 C 480 200 510 280 505 380 
                 C 502 460 485 540 450 580 
                 C 420 605 380 605 350 580 
                 C 315 540 298 460 295 380 Z"
              stroke={isLightBlue ? 'url(#neonRimGrad)' : '#ef4444'}
              strokeWidth="3.2"
              fill="none"
              filter={isLightBlue ? 'url(#neonCyanGlow)' : undefined}
            />
          </g>

          {/* 2. GLOWING SPIDER WEBBING MATRIX (Light Blue & Neon Cyan) */}
          <g
            id="spiderman-webbing"
            stroke={isLightBlue ? '#38bdf8' : '#7f1d1d'}
            strokeWidth="2.4"
            strokeLinecap="round"
            filter={isLightBlue ? 'url(#webTraceGlow)' : undefined}
          >
            {/* Radial Web Spokes from between the eyes (x=400, y=410) */}
            <line x1="400" y1="410" x2="400" y2="200" strokeWidth="3" stroke={isLightBlue ? '#00f0ff' : '#991b1b'} />
            <line x1="400" y1="410" x2="435" y2="205" />
            <line x1="400" y1="410" x2="465" y2="225" />
            <line x1="400" y1="410" x2="495" y2="270" />
            <line x1="400" y1="410" x2="505" y2="330" />
            <line x1="400" y1="410" x2="500" y2="400" />
            <line x1="400" y1="410" x2="475" y2="470" />
            <line x1="400" y1="410" x2="445" y2="540" />
            <line x1="400" y1="410" x2="420" y2="585" />
            <line x1="400" y1="410" x2="400" y2="600" strokeWidth="3" stroke={isLightBlue ? '#00f0ff' : '#991b1b'} />
            <line x1="400" y1="410" x2="380" y2="585" />
            <line x1="400" y1="410" x2="355" y2="540" />
            <line x1="400" y1="410" x2="325" y2="470" />
            <line x1="400" y1="410" x2="300" y2="400" />
            <line x1="400" y1="410" x2="295" y2="330" />
            <line x1="400" y1="410" x2="305" y2="270" />
            <line x1="400" y1="410" x2="335" y2="225" />
            <line x1="400" y1="410" x2="365" y2="205" />

            {/* Concentric Forehead Webbing Arcs */}
            <path d="M 370 340 Q 400 355 430 340" fill="none" />
            <path d="M 345 295 Q 400 320 455 295" fill="none" />
            <path d="M 325 250 Q 400 280 475 250" fill="none" />
            <path d="M 310 215 Q 400 245 490 215" fill="none" />

            {/* Concentric Lower Face & Chin Webbing Arcs */}
            <path d="M 375 480 Q 400 465 425 480" fill="none" />
            <path d="M 355 525 Q 400 505 445 525" fill="none" />
            <path d="M 345 565 Q 400 545 455 565" fill="none" />

            {/* Web Intersection Luminous Micro-Nodes */}
            {isLightBlue && (
              <g fill="#00f0ff">
                <circle cx="400" cy="350" r="2.2" />
                <circle cx="400" cy="310" r="2.2" />
                <circle cx="400" cy="265" r="2.2" />
                <circle cx="400" cy="470" r="2.2" />
                <circle cx="400" cy="515" r="2.2" />
                <circle cx="400" cy="555" r="2.2" />
                <circle cx="345" cy="295" r="1.8" />
                <circle cx="455" cy="295" r="1.8" />
                <circle cx="355" cy="525" r="1.8" />
                <circle cx="445" cy="525" r="1.8" />
              </g>
            )}
          </g>

          {/* 3. ICONIC GLOWING SPIDER-MAN EYES */}
          {/* Centered at x=355 and x=445, y=410 matching developer eyes/glasses */}
          <g id="spiderman-eyes">
            {/* =================== LEFT EYE =================== */}
            <g id="left-eye">
              {/* Outer Bezel (Sleek deep navy/azure with neon cyan rim) */}
              <path
                d="M 390 398 C 385 360, 345 350, 310 365 C 285 378, 280 415, 292 445 C 308 475, 350 495, 388 475 C 392 455, 393 422, 390 398 Z"
                fill={isLightBlue ? 'url(#spideyEyeBezelGrad)' : '#09090b'}
                stroke={isLightBlue ? '#00f0ff' : '#18181b'}
                strokeWidth="2.8"
                filter={isLightBlue ? 'url(#neonCyanGlow)' : undefined}
              />
              {/* Radiant White/Cyan Luminous Reflective Lens */}
              <path
                d="M 382 402 C 378 370, 345 362, 318 375 C 298 386, 294 416, 304 442 C 318 466, 352 482, 380 466 C 384 448, 384 420, 382 402 Z"
                fill="url(#spideyEyeLensGrad)"
                filter="url(#eyeLensGlow)"
              />
              {/* High-Tech Lens Glare / Slit Accent */}
              <path
                d="M 370 385 Q 340 375 315 390"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M 365 440 Q 335 445 315 425"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </g>

            {/* =================== RIGHT EYE =================== */}
            <g id="right-eye">
              {/* Outer Bezel (Sleek deep navy/azure with neon cyan rim) */}
              <path
                d="M 410 398 C 415 360, 455 350, 490 365 C 515 378, 520 415, 508 445 C 492 475, 450 495, 412 475 C 408 455, 407 422, 410 398 Z"
                fill={isLightBlue ? 'url(#spideyEyeBezelGrad)' : '#09090b'}
                stroke={isLightBlue ? '#00f0ff' : '#18181b'}
                strokeWidth="2.8"
                filter={isLightBlue ? 'url(#neonCyanGlow)' : undefined}
              />
              {/* Radiant White/Cyan Luminous Reflective Lens */}
              <path
                d="M 418 402 C 422 370, 455 362, 482 375 C 502 386, 506 416, 496 442 C 482 466, 448 482, 420 466 C 416 448, 416 420, 418 402 Z"
                fill="url(#spideyEyeLensGrad)"
                filter="url(#eyeLensGlow)"
              />
              {/* High-Tech Lens Glare / Slit Accent */}
              <path
                d="M 430 385 Q 460 375 485 390"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M 435 440 Q 465 445 485 425"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </g>
          </g>

          {/* 4. HIGH-TECH CHEEK AND JAW HUD ACCENTS (Light Blue Theme) */}
          {isLightBlue && (
            <g stroke="#00f0ff" strokeWidth="1.4" opacity="0.75">
              {/* Left Cheek Sensor Node */}
              <circle cx="318" cy="485" r="2.5" fill="#00f0ff" />
              <line x1="318" y1="485" x2="335" y2="495" />
              {/* Right Cheek Sensor Node */}
              <circle cx="482" cy="485" r="2.5" fill="#00f0ff" />
              <line x1="482" y1="485" x2="465" y2="495" />
              {/* Chin Center Light Bar */}
              <line x1="388" y1="585" x2="412" y2="585" strokeWidth="2" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
