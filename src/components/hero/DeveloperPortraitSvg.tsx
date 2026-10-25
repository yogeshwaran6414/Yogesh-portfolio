import React from 'react';

interface DeveloperPortraitSvgProps {
  className?: string;
  glowColor?: string;
}

export const DeveloperPortraitSvg: React.FC<DeveloperPortraitSvgProps> = ({
  className = '',
  glowColor = '#2563eb',
}) => {
  return (
    <svg
      viewBox="0 0 800 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full object-contain object-bottom select-none ${className}`}
      aria-label="Developer Portrait Hero Background"
    >
      <defs>
        <radialGradient id="blueGlassesGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.45" />
          <stop offset="70%" stopColor={glowColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>

        <linearGradient id="skinGrad" x1="400" y1="200" x2="400" y2="650" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e3a77d" />
          <stop offset="60%" stopColor="#cf9063" />
          <stop offset="100%" stopColor="#b4754b" />
        </linearGradient>

        <linearGradient id="hairGrad" x1="400" y1="80" x2="400" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1815" />
          <stop offset="50%" stopColor="#120e0c" />
          <stop offset="100%" stopColor="#080605" />
        </linearGradient>

        <linearGradient id="shirtGrad" x1="400" y1="460" x2="400" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f8fafc" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="shirtShadowGrad" x1="400" y1="480" x2="400" y2="700" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </linearGradient>

        {/* Filter for glowing neon blue spectacle frame */}
        <filter id="neonBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#1d4ed8" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Centered Character Group */}
      <g id="character-root">
        {/* Ambient Radial Rim Light behind head and shoulders */}
        <circle cx="400" cy="300" r="320" fill="url(#blueGlassesGlow)" />

        {/* Full Torso, Chest, Arms & White T-Shirt (Spans from y=470 to y=1000) */}
        <g id="body-and-shirt">
          {/* Main T-Shirt Body including broad shoulders, chest, and arms */}
          <path
            d="M 340 470 
               C 280 480 180 505 80 560 
               C 50 580 35 630 30 700 
               C 25 780 15 900 10 1000 
               L 790 1000 
               C 785 900 775 780 770 700 
               C 765 630 750 580 720 560 
               C 620 505 520 480 460 470 
               Q 400 480 340 470 Z"
            fill="url(#shirtGrad)"
          />

          {/* Torso & Arm Seam Contours (Left and Right Sleeve Definition) */}
          <path
            d="M 120 585 C 130 680 145 780 150 900 L 155 1000"
            stroke="#cbd5e1"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 680 585 C 670 680 655 780 650 900 L 645 1000"
            stroke="#cbd5e1"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Pectoral & Chest Muscle Definition Folds */}
          <path
            d="M 280 610 Q 340 645 390 625"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 520 610 Q 460 645 410 625"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M 400 535 L 400 660"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 6"
            fill="none"
            opacity="0.5"
          />

          {/* Gentle Fabric Folds at Waist/Ribs */}
          <path
            d="M 160 760 Q 240 780 320 765"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 640 760 Q 560 780 480 765"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 175 870 Q 280 890 380 880"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 625 870 Q 520 890 420 880"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />

          {/* Crew-Neck Collar Ribbing */}
          <path
            d="M 335 465 Q 400 515 465 465 Q 400 482 335 465 Z"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Collar Shadow on chest */}
          <path
            d="M 335 475 Q 400 528 465 475 Q 400 500 335 475 Z"
            fill="url(#shirtShadowGrad)"
          />
        </g>

        {/* Head, Face, Hair, Glasses Scaled to Perfect Proportions */}
        <g id="head-and-face" transform="translate(400, 255) scale(0.66) translate(-400, -380)">
          {/* Neck base extending into collar */}
          <g id="neck-structure">
            <path
              d="M 345 540 L 345 745 Q 400 770 455 745 L 455 540 Z"
              fill="#c48559"
            />
            <path
              d="M 345 560 Q 400 640 455 560 Q 400 600 345 560 Z"
              fill="#9c633a"
              opacity="0.6"
            />
          </g>

        {/* Head, Face & Ears */}
        <g id="face-structure">
          {/* Left Ear */}
          <ellipse cx="285" cy="430" rx="20" ry="38" fill="#cf9063" transform="rotate(-5 285 430)" />
          <ellipse cx="286" cy="430" rx="11" ry="24" fill="#a86940" />

          {/* Right Ear */}
          <ellipse cx="515" cy="430" rx="20" ry="38" fill="#cf9063" transform="rotate(5 515 430)" />
          <ellipse cx="514" cy="430" rx="11" ry="24" fill="#a86940" />

          {/* Head Contour */}
          <path
            d="M 295 380 C 290 280 320 200 400 200 C 480 200 510 280 505 380 C 502 460 485 540 450 580 C 420 605 380 605 350 580 C 315 540 298 460 295 380 Z"
            fill="url(#skinGrad)"
          />

          {/* Jawline & Chin definition */}
          <path
            d="M 330 520 Q 400 610 470 520"
            stroke="#9e663e"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* Voluminous Dark Hair */}
        <g id="hair">
          <path
            d="M 275 350 C 265 260 285 160 340 120 C 380 90 440 90 480 125 C 525 165 535 240 525 350 C 510 320 495 315 480 320 C 440 335 360 335 320 320 C 305 315 290 320 275 350 Z"
            fill="url(#hairGrad)"
          />
          {/* Front Quiff Hair Tufts */}
          <path
            d="M 330 140 C 350 110 380 100 410 115 C 440 95 475 110 480 140 C 460 130 420 125 390 135 C 360 125 340 130 330 140 Z"
            fill="#2b221d"
          />
        </g>

        {/* Facial Features */}
        <g id="facial-features">
          {/* Eyebrows */}
          <path d="M 320 375 Q 355 360 385 375" stroke="#1c1613" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M 415 375 Q 445 360 480 375" stroke="#1c1613" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="355" cy="410" rx="20" ry="12" fill="#ffffff" />
          <ellipse cx="445" cy="410" rx="20" ry="12" fill="#ffffff" />
          <circle cx="356" cy="410" r="10" fill="#2d1c13" />
          <circle cx="444" cy="410" r="10" fill="#2d1c13" />
          <circle cx="356" cy="410" r="4.5" fill="#000000" />
          <circle cx="444" cy="410" r="4.5" fill="#000000" />
          <circle cx="359" cy="407" r="2.5" fill="#ffffff" />
          <circle cx="447" cy="407" r="2.5" fill="#ffffff" />

          {/* Nose */}
          <path
            d="M 398 395 L 396 465 Q 400 478 404 465 L 402 395"
            stroke="#ad6c3f"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M 386 465 Q 400 480 414 465" stroke="#94572d" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Beard / Goatee & Mustache */}
          <g id="beard">
            <path
              d="M 370 515 Q 400 508 430 515 Q 418 528 400 525 Q 382 528 370 515 Z"
              fill="#1c1613"
              opacity="0.9"
            />
            <path d="M 394 542 L 406 542 L 402 555 L 398 555 Z" fill="#1c1613" opacity="0.85" />
            <path
              d="M 365 565 C 375 600 400 610 400 610 C 400 610 425 600 435 565 C 418 580 382 580 365 565 Z"
              fill="#1a1411"
            />
            <path
              d="M 325 500 Q 345 565 375 585 Q 400 595 425 585 Q 455 565 475 500"
              stroke="#1a1411"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="2 4"
              fill="none"
              opacity="0.45"
            />
          </g>

          {/* Lips */}
          <path
            d="M 372 528 Q 400 523 428 528 Q 400 540 372 528 Z"
            fill="#a8594e"
          />
          <path d="M 374 528 Q 400 531 426 528" stroke="#682c23" strokeWidth="2" fill="none" />
        </g>

        {/* Signature Blue-Framed Rectangular Spectacles */}
        <g id="signature-blue-glasses" filter="url(#neonBlueGlow)">
          <rect
            x="310"
            y="375"
            width="82"
            height="62"
            rx="14"
            fill="#1d4ed8"
            fillOpacity="0.08"
            stroke="#2563eb"
            strokeWidth="7.5"
          />
          <rect
            x="408"
            y="375"
            width="82"
            height="62"
            rx="14"
            fill="#1d4ed8"
            fillOpacity="0.08"
            stroke="#2563eb"
            strokeWidth="7.5"
          />
          <path
            d="M 392 398 Q 400 393 408 398"
            stroke="#2563eb"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 310 392 L 285 410"
            stroke="#1d4ed8"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 490 392 L 515 410"
            stroke="#1d4ed8"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 322 388 L 340 388"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 420 388 L 438 388"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
        </g>
      </g>
    </svg>
  );
};
