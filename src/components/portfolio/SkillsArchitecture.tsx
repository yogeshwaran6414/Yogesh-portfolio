import React, { useState } from 'react';
import { skillsList } from '../../data/portfolioData';
import { Layers, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

export const SkillsArchitecture: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Architecture & Next.js', 'Frontend & Animation', 'Backend & Cloud'];

  const filteredSkills = activeCategory === 'All'
    ? skillsList
    : skillsList.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>CORE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Syne',sans-serif] tracking-tight">
              TECHNICAL STACK.
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {skill.name}
                </span>
                <span className="text-xs font-mono text-blue-400 font-medium">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {skill.highlight && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400/80 flex-shrink-0" />
                  <span>{skill.highlight}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
