'use client';

import React, { useState, useEffect } from 'react';
import { Type, RotateCcw, Sparkles, ChevronDown, Check, X } from 'lucide-react';
import { AVAILABLE_FONTS, FontOption } from './path-drawing-portfolio-hero';

export interface FontSwitcherProps {
  currentFont?: string;
  onFontChange?: (fontName: string) => void;
  textCase?: 'uppercase' | 'normal';
  onCaseChange?: (newCase: 'uppercase' | 'normal') => void;
  onReplay?: () => void;
}

export function FontSwitcher({
  currentFont: controlledFont,
  onFontChange,
  textCase: controlledCase,
  onCaseChange,
  onReplay,
}: FontSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  // FIX PART 1: Fixed default initial state matching server-render (NEVER read localStorage inside useState)
  const [internalFont, setInternalFont] = useState<string>('Sora');
  const [internalCase, setInternalCase] = useState<'uppercase' | 'normal'>('uppercase');

  // Read saved preference strictly inside useEffect after mount to eliminate hydration mismatch
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem('portfolio_hero_font') || localStorage.getItem('font');
      if (savedFont) {
        setInternalFont(savedFont);
        if (onFontChange && !controlledFont) {
          onFontChange(savedFont);
        }
      }
      const savedCase = localStorage.getItem('portfolio_hero_case');
      if (savedCase === 'uppercase' || savedCase === 'normal') {
        setInternalCase(savedCase);
        if (onCaseChange && !controlledCase) {
          onCaseChange(savedCase);
        }
      }
    } catch {}
  }, []);

  const activeFont = controlledFont ?? internalFont;
  const activeCase = controlledCase ?? internalCase;

  const handleFontSelect = (fontId: string) => {
    setInternalFont(fontId);
    try {
      localStorage.setItem('portfolio_hero_font', fontId);
      localStorage.setItem('font', fontId);
    } catch {}
    if (onFontChange) {
      onFontChange(fontId);
    }
  };

  const handleCaseSelect = (newCase: 'uppercase' | 'normal') => {
    setInternalCase(newCase);
    try {
      localStorage.setItem('portfolio_hero_case', newCase);
    } catch {}
    if (onCaseChange) {
      onCaseChange(newCase);
    }
  };

  return (
    <div className="fixed top-4 left-4 sm:top-5 sm:left-6 z-50 flex flex-col items-start font-sans">
      {/* Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-xs font-medium text-zinc-200 hover:text-white border border-blue-500/30 hover:border-blue-400 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(59,130,246,0.18)] flex items-center gap-2 cursor-pointer group"
          id="hero-font-picker-btn"
          title="Change Hero Font Family"
        >
          <Type className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="hidden xs:inline text-zinc-400">Font:</span>
          <span className="font-semibold text-blue-300 group-hover:text-blue-200">
            {activeFont}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Quick Replay Button */}
        {onReplay && (
          <button
            onClick={onReplay}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-blue-300 border border-white/10 hover:border-blue-500/40 backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            title="Replay SVG Draw Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Replay</span>
          </button>
        )}
      </div>

      {/* Floating Font Studio Drawer Panel */}
      {isOpen && (
        <div className="mt-2.5 w-72 sm:w-80 rounded-2xl bg-zinc-950/95 border border-blue-500/25 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200 select-none">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                Hero Font Family
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Letter Casing & Controls Row */}
          <div className="flex items-center justify-between py-2.5 border-b border-zinc-800/60">
            <span className="text-[11px] text-zinc-400 font-medium">Text Style:</span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <button
                onClick={() => handleCaseSelect('uppercase')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  activeCase === 'uppercase'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                YOGESH
              </button>
              <button
                onClick={() => handleCaseSelect('normal')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  activeCase === 'normal'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Yogesh
              </button>
            </div>
          </div>

          {/* Font List */}
          <div className="mt-2.5 max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {AVAILABLE_FONTS.map((font: FontOption) => {
              const isSelected = activeFont === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => handleFontSelect(font.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/15 border border-blue-500/50 text-white'
                      : 'bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      style={{ fontFamily: font.family }}
                      className="text-sm font-semibold tracking-wide"
                    >
                      {font.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">{font.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {font.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-blue-500/30 text-blue-200'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {font.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Helpful Footer Note */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
            <p className="text-[10px] leading-relaxed text-zinc-400">
              💡 <span className="text-zinc-300">Click any font</span> to preview live in the hero. Tell me which one you like and I will lock it in permanently!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FontSwitcher;
