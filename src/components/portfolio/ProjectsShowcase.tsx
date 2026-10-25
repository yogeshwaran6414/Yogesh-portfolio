'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  ArrowUpRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  Folder,
  Layers,
  Code2,
} from 'lucide-react';
import { PROJECTS_DATA, type ProjectItem } from '../../data/projectsData';
import { useSectionHeadingReveal } from '../ui/use-section-heading-reveal';
import GlassFolder, { type FolderFile } from '../ui/glass-folder-cards';

export type FolderCategoryKey = 'applications' | 'ecommerce' | 'business';

export interface FolderCategoryConfig {
  key: FolderCategoryKey;
  title: string;
  countLabel: string;
  folderTag: string;
  description: string;
  art: 'ember' | 'verdant' | 'dusk';
  seed: number;
  projectIds: string[];
}

export const FOLDER_CATEGORIES: FolderCategoryConfig[] = [
  {
    key: 'applications',
    title: 'Applications',
    countLabel: '2 Projects',
    folderTag: 'Full-Stack SaaS & Web Applications',
    description:
      'Complex full-stack web applications engineered with Next.js, React, Node.js, and relational databases. Featuring multi-tenant isolation, real-time analytics, and transactional payment pipelines.',
    art: 'ember',
    seed: 42,
    projectIds: ['crm-dashboard', 'zypo'],
  },
  {
    key: 'ecommerce',
    title: 'E-commerce',
    countLabel: '2 Projects',
    folderTag: 'Production Stores & WooCommerce',
    description:
      'Direct-to-consumer online shopping destinations and WooCommerce storefronts tailored for wellness and spiritual goods. Featuring product catalogs, wishlists, and seamless checkout journeys.',
    art: 'verdant',
    seed: 18,
    projectIds: ['white-horse-herbals', 'divine-world'],
  },
  {
    key: 'business',
    title: 'Business Websites',
    countLabel: '5 Projects',
    folderTag: 'Client & Institutional Web Portals',
    description:
      'Speed-optimized business websites, editorial architecture portfolios, real estate showcases, tourism booking systems, and academic portals developed for client businesses.',
    art: 'dusk',
    seed: 93,
    projectIds: ['sky-park', 'business-bench', 'kranzo', 'utsava', 'sngc'],
  },
];

export default function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedFolderKey, setSelectedFolderKey] = useState<FolderCategoryKey | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);
  const lastActiveFolderTriggerRef = useRef<HTMLElement | null>(null);
  const lastActiveModalTriggerRef = useRef<HTMLElement | null>(null);

  useSectionHeadingReveal(sectionRef);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Selected folder configuration and its assigned projects
  const activeFolder = FOLDER_CATEGORIES.find((f) => f.key === selectedFolderKey) || null;
  const activeFolderProjects: ProjectItem[] = activeFolder
    ? activeFolder.projectIds
        .map((id) => PROJECTS_DATA.find((p) => p.id === id))
        .filter((p): p is ProjectItem => Boolean(p))
    : [];

  // Handle opening a folder (Level 1 -> Level 2)
  const handleOpenFolder = (key: FolderCategoryKey) => {
    lastActiveFolderTriggerRef.current = document.activeElement as HTMLElement;
    setSelectedFolderKey(key);
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the opened folder (Level 2 -> Level 1)
  const handleCloseFolder = () => {
    setSelectedFolderKey(null);
    if (!selectedProject) {
      document.body.style.overflow = '';
    }
    setTimeout(() => {
      lastActiveFolderTriggerRef.current?.focus();
    }, 60);
  };

  // Handle opening case-study spec modal
  const openModal = (project: ProjectItem) => {
    lastActiveModalTriggerRef.current = document.activeElement as HTMLElement;
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  // Handle closing case-study spec modal
  const closeModal = () => {
    setSelectedProject(null);
    if (!selectedFolderKey) {
      document.body.style.overflow = '';
    }
    setTimeout(() => {
      lastActiveModalTriggerRef.current?.focus();
    }, 50);
  };

  // Keyboard navigation: Escape key handling for modal and opened folder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          closeModal();
        } else if (selectedFolderKey) {
          handleCloseFolder();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, selectedFolderKey]);

  // Focus management when opening Level 2
  useEffect(() => {
    if (selectedFolderKey && !selectedProject) {
      setTimeout(() => {
        backBtnRef.current?.focus();
      }, 100);
    }
  }, [selectedFolderKey, selectedProject]);

  // Focus management when opening project modal
  useEffect(() => {
    if (selectedProject) {
      setTimeout(() => {
        modalCloseBtnRef.current?.focus();
      }, 100);
    }
  }, [selectedProject]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="en-section en-cream relative w-full overflow-hidden"
      aria-label="Selected Projects Showcase"
    >
      <div className="en-wrap relative z-10">
        {/* ================================================================
            SECTION HEADER (Preserved Ember Noir Design)
            ================================================================ */}
        <header className="en-heading mb-10 sm:mb-14" data-section-heading>
          <p className="en-label flex items-center gap-2.5 text-[#655a58] font-mono text-xs tracking-[0.2em] uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#FF4A16] shadow-[0_0_10px_#FF4A16]" />
            05 / SELECTED WORK
          </p>

          <div className="en-heading-grid mt-4">
            <h2
              className="text-[#201819] text-[clamp(2.4rem,4.5vw,4.5rem)] font-bold tracking-tight leading-[1.05]"
              style={{ fontFamily: 'var(--font-host-grotesk), sans-serif' }}
            >
              <span className="block overflow-hidden" style={{ color: 'inherit' }}>
                <span className="inline-block" style={{ color: 'inherit' }} data-section-heading-line>
                  A selection of
                </span>
              </span>
              <span className="block overflow-hidden" style={{ color: '#8D160D' }}>
                <span className="inline-block" style={{ color: '#8D160D' }} data-section-heading-line>
                  things I&apos;ve built.
                </span>
              </span>
            </h2>

            <p
              className="en-intro text-[#655a58] text-sm sm:text-base leading-relaxed mt-4 sm:mt-0 font-normal"
              data-section-heading-support
            >
              Interactive project archives organized by capability. Click any folder to inspect its projects.
            </p>
          </div>
        </header>

        {/* ================================================================
            LEVEL 1 — MAIN PROJECT FOLDERS
            Display three clickable project folders in the existing section
            ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12 items-end justify-items-center mb-8">
          {FOLDER_CATEGORIES.map((category, idx) => {
            const projectsForFolder = category.projectIds
              .map((id) => PROJECTS_DATA.find((p) => p.id === id))
              .filter((p): p is ProjectItem => Boolean(p));

            // Map real projects to folder file sheets with screenshots
            const folderFiles: FolderFile[] = projectsForFolder.map((p) => ({
              name: p.title,
              meta: p.subtitle || p.role,
              image: p.image,
            }));

            return (
              <div
                key={category.key}
                className="group flex flex-col items-center w-full max-w-[340px] focus-within:outline-none"
              >
                {/* 21st-inspired Interactive Glass Folder */}
                <div
                  className="cursor-pointer transition-transform duration-300 hover:-translate-y-2 select-none"
                  onClick={() => handleOpenFolder(category.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenFolder(category.key);
                    }
                  }}
                  aria-label={`Open ${category.title} folder containing ${projectsForFolder.length} projects`}
                >
                  <GlassFolder
                    label={category.title}
                    meta={category.countLabel}
                    art={category.art}
                    seed={category.seed}
                    tone="dark"
                    width={330}
                    action="none"
                    files={folderFiles}
                    onFileSelect={() => handleOpenFolder(category.key)}
                    onOpenChange={(isOpen) => {
                      if (isOpen) handleOpenFolder(category.key);
                    }}
                  />
                </div>

                {/* Folder Metadata & Clickable Trigger Card */}
                <div className="w-full mt-4 text-center px-2">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8D160D] font-bold">
                      0{idx + 1} / {category.title}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#201819]/8 text-[#201819] border border-[#201819]/12">
                      {category.countLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#524846] line-clamp-2 leading-relaxed mb-3">
                    {category.folderTag}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleOpenFolder(category.key)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-[#09080B] hover:bg-[#201819] text-[#F8F4F0] text-xs font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    aria-label={`View ${projectsForFolder.length} projects in ${category.title}`}
                  >
                    <span>Inspect {category.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4A16]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful microcopy */}
        <p className="text-center font-mono text-[11px] tracking-[0.16em] text-[#655a58] uppercase mt-10">
          Click any folder to inspect inside · Esc to close
        </p>
      </div>

      {/* ================================================================
          LEVEL 2 — OPENED FOLDER (Smooth Overlay View)
          Shows only the projects belonging to the selected folder
          ================================================================ */}
      <AnimatePresence>
        {activeFolder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="opened-folder-title"
          >
            {/* Backdrop with click-to-cancel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleCloseFolder}
              className="absolute inset-0 bg-[#09080B]/90 backdrop-blur-xl"
              aria-hidden="true"
            />

            {/* Opened Folder Panel */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0F0C10] text-[#F8F4F0] border border-[#FF4A16]/25 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col"
            >
              {/* Panel Top Header with Category Name & Clear Back/Cancel Action */}
              <div className="sticky top-0 z-20 bg-[#161217]/95 backdrop-blur-md px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A16] shadow-[0_0_10px_#FF4A16] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#B8AEB0]/80 block">
                      05 / Selected Work · Folder View
                    </span>
                    <h3
                      id="opened-folder-title"
                      className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3 truncate"
                      style={{ fontFamily: 'var(--font-host-grotesk), sans-serif' }}
                    >
                      <span>{activeFolder.title}</span>
                      <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#FF4A16]/15 text-[#FF4A16] border border-[#FF4A16]/30 shrink-0">
                        {activeFolderProjects.length}{' '}
                        {activeFolderProjects.length === 1 ? 'Project' : 'Projects'}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Back / Cancel Button at top of opened view */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    ref={backBtnRef}
                    onClick={handleCloseFolder}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white/10 hover:bg-[#FF4A16] text-white transition-all duration-200 text-xs sm:text-sm font-semibold tracking-wide border border-white/15 hover:border-[#FF4A16] shadow-sm active:scale-95 cursor-pointer"
                    aria-label="Back to all three folders"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Folders</span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-black/40 rounded font-mono border border-white/20">
                      ESC
                    </kbd>
                  </button>

                  <button
                    onClick={handleCloseFolder}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10 sm:hidden"
                    aria-label="Close folder view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Opened Folder Content Area */}
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                {/* Folder description note */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <p className="text-xs sm:text-sm text-[#B8AEB0] max-w-2xl leading-relaxed">
                    {activeFolder.description}
                  </p>
                  <span className="text-[11px] font-mono text-[#FF4A16] shrink-0 font-medium">
                    Showing {activeFolderProjects.length} of {activeFolderProjects.length} projects in this folder
                  </span>
                </div>

                {/* Displaying ONLY projects assigned to this folder */}
                <div
                  className={`grid gap-6 ${
                    activeFolderProjects.length === 2
                      ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {activeFolderProjects.map((project) => (
                    <article
                      key={project.id}
                      className="group rounded-2xl border border-white/10 bg-[#161217]/80 hover:bg-[#1C171E] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#FF4A16]/50 hover:shadow-[0_12px_35px_rgba(255,74,22,0.15)] overflow-hidden"
                    >
                      <div>
                        {/* Browser Window Frame Preview */}
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#09080B] mb-4">
                          <div className="bg-[#1D181F] px-3 py-1.5 flex items-center justify-between border-b border-white/10 select-none">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                              <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                              <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                            </div>
                            <span className="text-[9px] font-mono text-[#B8AEB0]/70 truncate max-w-[160px]">
                              {project.liveUrl.replace('https://', '')}
                            </span>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-[#FF4A16] hover:underline flex items-center gap-0.5"
                              aria-label={`Open ${project.title} live link in new tab`}
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>

                          {/* Real Screenshot Preview */}
                          <div
                            onClick={() => openModal(project)}
                            className="relative aspect-[16/10] w-full overflow-hidden bg-[#181417] cursor-pointer"
                          >
                            <img
                              src={project.image}
                              alt={project.imageAlt}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09080B]/90 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg">
                                <span>Inspect Full Specs</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4A16]" />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Category & Year */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono text-[#FF4A16] uppercase font-bold tracking-wider">
                            {project.category}
                          </span>
                          <span className="text-[11px] font-mono text-[#B8AEB0]">
                            {project.year || '2024–2025'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#FF6B35] transition-colors cursor-pointer"
                          style={{ fontFamily: 'var(--font-host-grotesk), sans-serif' }}
                          onClick={() => openModal(project)}
                        >
                          {project.title}
                        </h4>

                        {/* Subtitle / Role */}
                        <p className="text-xs font-mono text-[#B8AEB0]/80 mt-1">
                          {project.subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#D1C9C7] leading-relaxed mt-2.5 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Highlights (bullet point) */}
                        {project.highlights.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#B8AEB0] space-y-1">
                            <div className="flex items-start gap-1.5 line-clamp-1">
                              <span className="text-[#FF4A16] text-[11px] mt-0.5">✦</span>
                              <span className="truncate">{project.highlights[0]}</span>
                            </div>
                          </div>
                        )}

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {project.stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.06] text-[#E0D7D5] border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions: Case Study Specs + Direct Visit Live Site */}
                      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => openModal(project)}
                          className="text-xs font-semibold text-[#B8AEB0] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Case Study Specs</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4A16]" />
                        </button>

                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF4A16] hover:bg-[#FF6B35] text-white text-xs font-semibold transition-all duration-200 shadow-md active:scale-95"
                          aria-label={`Visit live website for ${project.title} (opens in new tab)`}
                        >
                          <span>Visit Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================
          CASE STUDY SPECS MODAL
          ================================================================ */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 18 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 18 }
              }
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#09080B] text-[#F8F4F0] border border-[#FF4A16]/25 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="sticky top-0 z-20 bg-[#120F14]/95 backdrop-blur-md px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A16] animate-pulse" />
                  <span className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#B8AEB0]">
                    {selectedProject.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#B8AEB0]/60 hidden sm:inline">
                    Press ESC to close
                  </span>
                  <button
                    ref={modalCloseBtnRef}
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4A16]"
                    aria-label="Close project modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                {/* Real Screenshot Preview */}
                <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/12 bg-[#151216] shadow-2xl">
                  {/* Browser Bar */}
                  <div className="bg-[#1A161C] px-4 py-2.5 flex items-center justify-between border-b border-white/10 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-xs font-mono text-[#B8AEB0] truncate max-w-[280px] sm:max-w-md">
                      {selectedProject.liveUrl}
                    </span>
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#FF4A16] hover:underline flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Image Display */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#09080B] overflow-hidden">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.imageAlt}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Project Specs & Narrative */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3
                        id="modal-project-title"
                        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white"
                        style={{ fontFamily: 'var(--font-host-grotesk), sans-serif' }}
                      >
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-[#FF6B35] mt-1">
                        Scope: {selectedProject.role}
                      </p>
                    </div>

                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#FF4A16] text-white hover:bg-[#FF6B35] font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(255,74,22,0.4)] active:scale-95"
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-sm sm:text-base text-[#B8AEB0] leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Verified Highlights */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#F8F4F0] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF4A16]" />
                    <span>Key Engineering & Deliverable Highlights</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedProject.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D1C9C7]">
                        <span className="text-[#FF4A16] font-bold text-sm mt-0.5">✦</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verified Tech Stack */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#B8AEB0]">
                    Verified Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-mono text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-xs sm:text-sm font-medium text-[#B8AEB0] hover:text-white transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>

                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F8F4F0] text-[#09080B] hover:bg-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95"
                  >
                    <span>Visit Live Site</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FF4A16]" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
