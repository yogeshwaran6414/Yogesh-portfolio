'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TextHoverEffectProps {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: TextHoverEffectProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<{ x: number | null; y: number | null }>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn('select-none uppercase cursor-pointer', className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="25%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#80EEB4" />
              <stop offset="75%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#A855F7" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* 1. Base Outline Layer */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.35"
        style={{
          fontFamily: "var(--font-sora), 'Sora', sans-serif",
          opacity: hovered ? 0.7 : 0.18,
          letterSpacing: '-0.02em',
        }}
        className="fill-transparent stroke-neutral-300 text-7xl font-bold dark:stroke-neutral-700 transition-opacity duration-300"
      >
        {text}
      </text>

      {/* 2. Animated Drawing Stroke Layer with Site Accent Blue */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.35"
        style={{
          fontFamily: "var(--font-sora), 'Sora', sans-serif",
          letterSpacing: '-0.02em',
        }}
        className="fill-transparent stroke-[#3B82F6] text-7xl font-bold dark:stroke-[#3B82F6]/70"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.text>

      {/* 3. Gradient-Masked Hover Reveal Layer */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.4"
        mask="url(#textMask)"
        style={{
          fontFamily: "var(--font-sora), 'Sora', sans-serif",
          letterSpacing: '-0.02em',
        }}
        className="fill-transparent text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 10%, rgba(15, 15, 17, 0.4) 50%, rgba(59, 130, 246, 0.16) 100%)',
      }}
    />
  );
};

export function HoverFooter() {
  // Real portfolio navigation link data
  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'About', href: '#about-me' },
        { label: 'Tech Stack', href: '#tech-stack' },
        { label: 'Featured Work', href: '#projects' },
        { label: 'More Work', href: '#projects' },
      ],
    },
    {
      title: 'Get In Touch',
      links: [
        { label: 'Contact', href: '#contact' },
        // TODO: Replace "#" with actual resume PDF link once uploaded (e.g. "/resume.pdf")
        { label: 'Resume / CV', href: '#' },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3B82F6]" />,
      // TODO: Replace with your primary public email if different
      text: 'yogesh@webnox.in',
      href: 'mailto:yogesh@webnox.in',
    },
    {
      icon: <MapPin size={18} className="text-[#3B82F6]" />,
      // TODO: Fill in specific city if desired
      text: 'India',
    },
    // TODO: Phone entry commented out per portfolio design preferences
    // {
    //   icon: <Phone size={18} className="text-[#3B82F6]" />,
    //   text: "+91 98765 43210",
    //   href: "tel:+919876543210",
    // },
  ];

  // Developer-relevant social media icons
  const socialLinks = [
    {
      icon: <Github size={20} />,
      label: 'GitHub',
      href: 'https://github.com/yogeshwaran6414',
    },
    {
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/yogesh-waran-893992446?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    },
  ];

  return (
    <footer className="bg-[#0b0b0e] border-t border-white/5 relative h-fit rounded-3xl overflow-hidden m-4 sm:m-8 text-zinc-300">
      <div className="max-w-7xl mx-auto p-8 sm:p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
              <span
                className="text-white text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-sora), 'Sora', sans-serif" }}
              >
                Yogesh
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Frontend developer building fast, production-ready web experiences — from full stack SaaS products to client sites.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-base font-semibold mb-5 tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-[#3B82F6] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-base font-semibold mb-5 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3B82F6] text-zinc-400 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-zinc-400">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-zinc-800/80 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-5 text-zinc-400">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#3B82F6] transition-colors p-2 rounded-lg hover:bg-zinc-800/60"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Yogesh. All rights reserved.
          </p>
        </div>
      </div>

      {/* Signature Big Interactive Text Hover Effect (Desktop-only) */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 pointer-events-auto">
        <TextHoverEffect text="YOGESH" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
