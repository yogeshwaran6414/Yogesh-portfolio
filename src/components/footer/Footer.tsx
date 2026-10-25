import React from 'react';
import { ArrowUp, Code2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          <span className="text-slate-300 font-mono">
            DEV.PORTFOLIO &copy; {new Date().getFullYear()}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Next.js & GSAP Architecture</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with GSAP motion & Next.js readiness</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to top"
            id="footer-back-to-top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
