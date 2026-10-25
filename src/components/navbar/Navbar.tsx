import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Code2, Menu, X, ArrowUpRight, Upload } from 'lucide-react';

interface NavbarProps {
  onOpenPhotoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPhotoModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
              <Code2 className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              DEV<span className="text-blue-500 font-mono">.PORTFOLIO</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              NEXT.JS & GSAP
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1.5 backdrop-blur-md">
          <button
            onClick={() => scrollToSection('hero')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
            id="nav-link-hero"
          >
            Banner
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
            id="nav-link-projects"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
            id="nav-link-skills"
          >
            Tech Stack
          </button>
          <button
            onClick={() => scrollToSection('nextjs-plan')}
            className="px-3.5 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded-full transition-colors flex items-center gap-1"
            id="nav-link-nextjs"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            Next.js Blueprint
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
            id="nav-link-contact"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Photo Upload Trigger */}
          <button
            onClick={onOpenPhotoModal}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-1.5 transition-all shadow-sm"
            id="nav-sync-photo-btn"
            title="Upload or sync portfolio.jpeg hero image"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Sync Hero Photo</span>
          </button>

          {/* Available Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden lg:inline">Available Now</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => scrollToSection('contact')}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide shadow-[0_0_16px_rgba(37,99,235,0.4)] transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
            id="nav-cta-hire-btn"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenPhotoModal}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400"
            aria-label="Upload Hero Photo"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            id="nav-mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-4 flex flex-col gap-3 backdrop-blur-2xl">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-left text-sm py-2 text-slate-200 border-b border-slate-900"
          >
            Banner & Hero
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="text-left text-sm py-2 text-slate-200 border-b border-slate-900"
          >
            Featured Projects
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className="text-left text-sm py-2 text-slate-200 border-b border-slate-900"
          >
            Tech Stack
          </button>
          <button
            onClick={() => scrollToSection('nextjs-plan')}
            className="text-left text-sm py-2 text-blue-400 border-b border-slate-900"
          >
            Next.js & GSAP Architecture
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-left text-sm py-2 text-slate-200"
          >
            Contact
          </button>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPhotoModal();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Sync / Upload portfolio.jpeg
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
