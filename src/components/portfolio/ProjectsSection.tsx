import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { portfolioProjects } from '../../data/portfolioData';
import { ArrowUpRight, Github, Sparkles, ExternalLink } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 bg-slate-950 text-slate-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRAFTED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
              FEATURED PROJECTS.
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
            Engineered with Next.js architecture, robust TypeScript backbones, and responsive GSAP interactive kinetics.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]"
              id={`project-card-${project.id}`}
            >
              {/* Card Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Metric pill */}
                {project.metrics && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-emerald-400">
                    {project.metrics}
                  </div>
                )}

                {/* External link button */}
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shadow-md">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-['Syne',sans-serif]">
                    {project.title}
                  </h3>
                  <p className="text-xs text-blue-300/90 font-mono">
                    {project.tagline}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed pt-1">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-[11px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
