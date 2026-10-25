import React, { useState } from 'react';
import { HeroData } from '../../types';
import { Mail, Github, Linkedin, Twitter, Send, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface ContactSectionProps {
  heroData: HeroData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ heroData }) => {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(heroData.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3500);
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 text-slate-100 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
            LET'S BUILD SOMETHING EXTRAORDINARY.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have a project in mind, an engineering role, or looking to build a high-performance Next.js application with GSAP motion? Let's connect.
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {formSent ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">Message Sent!</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. I'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono text-slate-400">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono text-slate-400">Project Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your Next.js or animation vision..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>{heroData.socials.email}</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
                  id="contact-submit-btn"
                >
                  <span>Send Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Social Links Row */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-4">
            <a
              href={heroData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={heroData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={heroData.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
