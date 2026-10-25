'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AlertCircle, ArrowUpRight, CheckCircle2, ChevronDown, Loader2, Send } from 'lucide-react';
import { Badge7 } from '@/components/ui/cta69-utils/badge7';
import { Button12 } from '@/components/ui/cta69-utils/button12';
import { useSectionHeadingReveal } from '@/components/ui/use-section-heading-reveal';

export interface ContactProps {
  className?: string;
  directEmail?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

const BALL_SIZE = 380;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Contact({
  className = '',
  directEmail = 'k.yogesh6414@gmail.com',
  githubUrl = 'https://github.com/yogeshwaran6414',
  linkedinUrl = 'https://www.linkedin.com/in/yogesh-waran-893992446?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  instagramUrl = 'https://www.instagram.com/__dev.yogesh__?rpxt=MWZtamtjeGczMGk0eQ==',
}: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const successCardRef = useRef<HTMLDivElement>(null);
  useSectionHeadingReveal(sectionRef);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Form field state (persists across validation errors)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
    _spider_trap: '', // Anti-spam honeypot
  });

  // Track scroll position of the track relative to the viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const mqHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', mqHandler);

    const measure = () => {
      setViewH(window.innerHeight || 600);
      setViewW(window.innerWidth || 800);
    };
    measure();

    const onScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      setScrollY(scrolled);
    };

    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      mq.removeEventListener('change', mqHandler);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Form card entrance animation
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      if (formCardRef.current) gsap.set(formCardRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side required field validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your project message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: formData.service.trim(),
          message: formData.message.trim(),
          _spider_trap: formData._spider_trap,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setIsSuccess(true);
      } else {
        const errorText =
          result?.error ||
          `Failed to send message. Please try again or email me directly at ${directEmail}.`;
        setErrorMessage(errorText);
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setErrorMessage(
        `A network connection error occurred. Please check your connection or email me directly at ${directEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscussClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('project-inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const marqueePhrase = "Something useful";
  const marqueeLine = `${marqueePhrase} · `.repeat(8);

  // Inversion Circle calculations
  const p1 = clamp(scrollY / viewH);
  const p2 = clamp((scrollY - viewH) / viewH);

  // Power4 InOut for rising phase
  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  // ease-in² for expanding phase
  const p2e = p2 * p2;

  // Geometry
  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative w-full bg-[#09080B] text-[#F8F4F0] selection:bg-[#FF4A16] selection:text-white ${className}`}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* ========================================================
          SCROLL-DRIVEN INVERSION CIRCLE TRACK (Let's build something useful)
          ======================================================== */}
      <div
        ref={trackRef}
        className="relative w-full h-[260vh] bg-white overflow-x-clip"
      >
        <div className="sticky top-0 w-full h-[100vh] overflow-hidden bg-white select-none">
          
          {/* ──────────────────────────────────────────────────────────
              LAYER 1: BASE LIGHT/WHITE LAYER (Always visible underneath)
              ────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center px-5 sm:px-8 text-center pointer-events-auto z-0">
            <div className="max-w-3xl mx-auto flex flex-col items-center" data-section-heading>
              <span className="en-label text-[11px] tracking-[0.16em] uppercase font-semibold text-[#655A58] inline-flex items-center gap-3 before:content-[''] before:w-[7px] before:h-[7px] before:bg-[#FF4A16] before:rounded-full mb-6">
                06 / HAVE A PROJECT IN MIND?
              </span>
              <h2
                className="text-balance text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.04] tracking-tight text-[#09080B]"
                style={{ fontFamily: "var(--font-sora), var(--font-inter), sans-serif" }}
              >
                <span className="block overflow-hidden"><span className="inline-block" data-section-heading-line>Let’s build</span></span>
                <span className="block overflow-hidden"><span className="inline-block text-[#FF4A16]" data-section-heading-line>something useful.</span></span>
              </h2>
              <p className="mt-6 max-w-xl text-balance text-base sm:text-lg md:text-xl text-[#555052] leading-relaxed" data-section-heading-support>
                Have an idea for a website, software product, SaaS platform, or online store? Tell me what you’re planning, and let’s discuss a practical way to bring it to life.
              </p>
              <div className="flex items-center justify-center gap-6 mt-8">
                <a
                  href="#project-inquiry"
                  onClick={handleDiscussClick}
                  className="inline-flex items-center gap-3 rounded-full py-3 px-8 text-sm font-bold bg-[#FF4A16] text-[#09080B] hover:bg-[#FF6B35] transition-all shadow-[0_4px_20px_rgba(255,74,22,0.35)] cursor-pointer"
                >
                  <span>Discuss Your Project</span>
                  <ArrowUpRight size={18} />
                </a>
                <a
                  href={`mailto:${directEmail}`}
                  className="text-sm font-medium text-[#655A58] hover:text-[#09080B] underline underline-offset-4 transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              THE BLACK CIRCLE (Rises from below, then expands)
              ────────────────────────────────────────────────────────── */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full bg-[#09080B] will-change-transform pointer-events-none z-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            style={{
              width: prefersReducedMotion ? coverSize : ballSize,
              height: prefersReducedMotion ? coverSize : ballSize,
              transform: prefersReducedMotion
                ? 'translate(-50%, -50%)'
                : `translate(-50%, calc(-50% + ${yOff}px))`,
            }}
          />

          {/* ──────────────────────────────────────────────────────────
              LAYER 2: INVERTED DARK LAYER (Clipped to the rising/expanding circle)
              ────────────────────────────────────────────────────────── */}
          <div
            className="absolute inset-0 bg-[#09080B] overflow-hidden will-change-[clip-path] z-20 pointer-events-auto"
            style={{
              clipPath: prefersReducedMotion
                ? 'none'
                : `circle(${clipR}px at ${clipX}px ${clipY}px)`,
              WebkitClipPath: prefersReducedMotion
                ? 'none'
                : `circle(${clipR}px at ${clipX}px ${clipY}px)`,
            }}
          >
            {/* Atmospheric dark-to-red and orange ambient background glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(141, 22, 13, 0.45) 0%, rgba(255, 74, 22, 0.22) 35%, transparent 70%)',
                filter: 'blur(90px)',
              }}
            />

            {/* Giant scrolling backdrop from Cta69 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none"
            >
              <div className="flex w-max shrink-0 animate-cta69-marquee whitespace-nowrap text-[#F8F4F0]/[0.035]">
                {[0, 1].map((copy) => (
                  <span
                    key={copy}
                    className="text-[22vw] font-bold leading-none tracking-tighter md:text-[16vw]"
                  >
                    {marqueeLine}
                  </span>
                ))}
              </div>
            </div>

            {/* Centered Inverted Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-5 sm:px-8 text-center pointer-events-auto">
              <div className="max-w-3xl mx-auto flex flex-col items-center" data-section-heading>
                <Badge7
                  label="06 / HAVE A PROJECT IN MIND?"
                  bracket="none"
                  className="en-label text-[11px] tracking-[0.16em] uppercase font-semibold text-[#B8AEB0] inline-flex items-center gap-3 before:content-[''] before:w-[7px] before:h-[7px] before:bg-[#FF4A16] before:rounded-full mb-6"
                />
                <h2
                  className="text-balance text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.04] tracking-tight text-[#F8F4F0]"
                  style={{ fontFamily: "var(--font-sora), var(--font-inter), sans-serif" }}
                >
                  <span className="block overflow-hidden"><span className="inline-block" data-section-heading-line>Let’s build</span></span>
                  <span className="block overflow-hidden"><span className="inline-block text-[#FF4A16]" data-section-heading-line>something useful.</span></span>
                </h2>
                <p className="mt-6 max-w-xl text-balance text-base sm:text-lg md:text-xl text-[#B8AEB0] leading-relaxed" data-section-heading-support>
                  Have an idea for a website, software product, SaaS platform, or online store? Tell me what you’re planning, and let’s discuss a practical way to bring it to life.
                </p>
                <div className="flex items-center justify-center gap-6 mt-8">
                  <Button12
                    href="#project-inquiry"
                    label="Discuss Your Project"
                    tone="accent"
                    className="py-2.5 pl-7 pr-2.5 text-sm"
                    onClick={handleDiscussClick}
                  />
                  <a
                    href={`mailto:${directEmail}`}
                    className="text-sm font-medium text-[#B8AEB0] hover:text-[#F8F4F0] underline underline-offset-4 transition-colors"
                  >
                    Get in touch
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          CONTACT INQUIRY FORM CONTAINER (Revealed in full dark mode)
          ======================================================== */}
      <div
        id="project-inquiry"
        className="relative z-20 w-full max-w-2xl lg:max-w-3xl mx-auto px-5 sm:px-8 pt-10 pb-24 scroll-mt-20"
      >
        {/* Error State Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="w-full mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 transition-all animate-in fade-in duration-300"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Message could not be sent</p>
              <p className="text-xs text-red-300/90 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div
            ref={successCardRef}
            className="relative w-full py-16 px-8 rounded-3xl bg-[#151216] text-center flex flex-col items-center gap-5 shadow-2xl overflow-hidden border border-[rgba(248,244,240,0.14)]"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF4A16]/10 border border-[#FF4A16]/30 flex items-center justify-center text-[#FF4A16] shadow-[0_0_25px_rgba(255,74,22,0.2)]">
              <CheckCircle2 className="w-8 h-8 text-[#FF4A16]" />
            </div>

            <div className="space-y-2 relative z-10">
              <h3
                className="text-2xl sm:text-3xl font-bold text-[#F8F4F0] tracking-tight"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Thanks for reaching out — I&apos;ll get back to you soon.
              </h3>
              <p className="text-[#B8AEB0] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Your message has been received. Expect a prompt, direct reply shortly.
              </p>
            </div>
          </div>
        ) : (
          /* FORM CONTAINER */
          <div
            ref={formCardRef}
            className="relative w-full rounded-3xl bg-[#151216] shadow-2xl p-7 sm:p-10 border border-[rgba(248,244,240,0.14)]"
          >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 relative z-10">
              {/* Anti-spam Honeypot field */}
              <input
                type="text"
                name="_spider_trap"
                value={formData._spider_trap}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Row 1 Left: Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B8AEB0]"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-[#09080B] text-[#F8F4F0] placeholder-zinc-500 text-sm border border-[rgba(248,244,240,0.14)] rounded-xl transition-colors duration-200 focus:outline-none focus:border-[#FF4A16] focus:ring-1 focus:ring-[#FF4A16] disabled:opacity-50"
                />
              </div>

              {/* Row 1 Right: Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B8AEB0]"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  maxLength={30}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-[#09080B] text-[#F8F4F0] placeholder-zinc-500 text-sm border border-[rgba(248,244,240,0.14)] rounded-xl transition-colors duration-200 focus:outline-none focus:border-[#FF4A16] focus:ring-1 focus:ring-[#FF4A16] disabled:opacity-50"
                />
              </div>

              {/* Row 2 Left: Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B8AEB0]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  maxLength={150}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-[#09080B] text-[#F8F4F0] placeholder-zinc-500 text-sm border border-[rgba(248,244,240,0.14)] rounded-xl transition-colors duration-200 focus:outline-none focus:border-[#FF4A16] focus:ring-1 focus:ring-[#FF4A16] disabled:opacity-50"
                />
              </div>

              {/* Row 2 Right: Service Required (dropdown) */}
              <div className="space-y-2">
                <label
                  htmlFor="service"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B8AEB0]"
                >
                  Service Required
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3.5 pr-10 bg-[#09080B] text-[#F8F4F0] text-sm border border-[rgba(248,244,240,0.14)] rounded-xl transition-colors duration-200 focus:outline-none focus:border-[#FF4A16] focus:ring-1 focus:ring-[#FF4A16] disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#09080B] text-zinc-500">
                      Select a service...
                    </option>
                    <option value="Web Applications & SaaS" className="bg-[#09080B] text-[#F8F4F0]">
                      Web Applications & SaaS
                    </option>
                    <option value="Website Design & Development" className="bg-[#09080B] text-[#F8F4F0]">
                      Website Design & Development
                    </option>
                    <option value="WordPress Solutions" className="bg-[#09080B] text-[#F8F4F0]">
                      WordPress Solutions
                    </option>
                    <option value="E-commerce & Shopify" className="bg-[#09080B] text-[#F8F4F0]">
                      E-commerce & Shopify
                    </option>
                    <option value="Full-Stack Engineering" className="bg-[#09080B] text-[#F8F4F0]">
                      Full-Stack Engineering
                    </option>
                    <option value="Other Consultation" className="bg-[#09080B] text-[#F8F4F0]">
                      Other Consultation
                    </option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AEB0]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Row 3: Message (spanning full width of both columns) */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B8AEB0]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  placeholder="Tell me about your project, timeline, and goals..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-[#09080B] text-[#F8F4F0] placeholder-zinc-500 text-sm border border-[rgba(248,244,240,0.14)] rounded-xl transition-colors duration-200 focus:outline-none focus:border-[#FF4A16] focus:ring-1 focus:ring-[#FF4A16] disabled:opacity-50 resize-y min-h-[140px] block"
                />
              </div>

              {/* Row 4: Send Message Button (spanning full width of both columns) */}
              <div className="col-span-1 md:col-span-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 px-6 rounded-xl bg-[#FF4A16] hover:bg-[#FF6B35] text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_25px_rgba(255,74,22,0.35)] hover:shadow-[0_0_30px_rgba(255,74,22,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Social Links Row below form */}
        <div className="mt-12 flex items-center justify-center gap-5">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-11 h-11 rounded-xl bg-[#151216] border border-[rgba(248,244,240,0.14)] flex items-center justify-center text-[#B8AEB0] hover:text-[#F8F4F0] hover:border-[#FF4A16] hover:shadow-[0_0_15px_rgba(255,74,22,0.3)] transition-all duration-200"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-11 h-11 rounded-xl bg-[#151216] border border-[rgba(248,244,240,0.14)] flex items-center justify-center text-[#B8AEB0] hover:text-[#F8F4F0] hover:border-[#FF4A16] hover:shadow-[0_0_15px_rgba(255,74,22,0.3)] transition-all duration-200"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="w-11 h-11 rounded-xl bg-[#151216] border border-[rgba(248,244,240,0.14)] flex items-center justify-center text-[#B8AEB0] hover:text-[#F8F4F0] hover:border-[#FF4A16] hover:shadow-[0_0_15px_rgba(255,74,22,0.3)] transition-all duration-200"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
