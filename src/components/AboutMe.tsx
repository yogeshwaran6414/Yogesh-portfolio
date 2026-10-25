'use client';

import React from 'react';
import Timeline, { JourneyItem } from './ui/timeline';

// Existing milestones and journey content of Yogeshwaran K. mapped to the Timeline structure
const topJourneyData: JourneyItem[] = [
  {
    id: '2021-july',
    year: '2021',
    month: 'July',
    content: 'Signal research turns curiosity into a focused journey in web development and software engineering.',
  },
  {
    id: '2023-april',
    year: '2023',
    month: 'April',
    content: 'Completed B.Com and enrolled in an intensive 2-year full stack development course to master the craft.',
  },
  {
    id: '2024-october',
    year: '2024',
    month: 'October',
    content: 'Frontend Developer at Webnox, building responsive, production-ready interfaces for diverse clients.',
  },
  {
    id: '2026-may',
    year: '2026',
    month: 'May',
    content: 'Delivering full-stack SaaS applications, headless CMS, and bespoke WordPress web experiences.',
  },
];

const bottomJourneyData: JourneyItem[] = [
  {
    id: '2022-november',
    year: '2022',
    month: 'November',
    content: 'Prototype sprints validate responsive web development practices with real business use-cases.',
  },
  {
    id: '2025-september',
    year: '2025',
    month: 'September',
    content: 'Milestone reached: 21+ websites shipped across full-stack SaaS products and WordPress solutions.',
  },
  {
    id: '2026-january',
    year: '2026',
    month: 'January',
    content: 'Crafting performant web experiences, modern motion engineering, and freelance digital solutions.',
  },
];

export default function AboutMe() {
  return (
    <div id="about" className="relative w-full">
      {/* Top transition edge from dark hero into warm cream */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(9, 8, 11, 0.45) 0%, transparent 100%)',
        }}
      />

      <Timeline
        id="about-me"
        title="About Me"
        periodLabel="2021 — 2026 // Journey"
        backgroundColor="#F3EDE5"
        textColor="#201819"
        mutedTextColor="#756A68"
        activeColor="#FF4A16"
        duration={1.2}
        topJourneyData={topJourneyData}
        bottomJourneyData={bottomJourneyData}
      />
    </div>
  );
}
