import React, { useState } from 'react';
import CinematicHero from './components/hero/CinematicHero';
import Contact from './components/Contact';
import MiddleSections from './components/portfolio/MiddleSections';
import BeamWordmarkFooter from './components/ui/beam-wordmark-footer';
import EmberRevealLoader from './components/common/EmberRevealLoader';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="w-full min-h-screen bg-[#09080B] text-[#F8F4F0] selection:bg-[#FF4A16] selection:text-white">
      {isLoading && <EmberRevealLoader onComplete={() => setIsLoading(false)} />}
      <MiddleSections hero={<CinematicHero id="hero-content" />} />
      <Contact />
      <BeamWordmarkFooter
        brand="Yogeshwaran K."
        wordmark="YOGESH"
        background="#09080B"
        accent="#FF4A16"
        wordTop="#8D160D"
        wordFoot="#151216"
        ink="#F8F4F0"
        muted="#B8AEB0"
        socials={[
          { label: "GitHub", href: "https://github.com/yogeshwaran6414", icon: "github" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/yogesh-waran-893992446?utm_source=share_via&utm_content=profile&utm_medium=member_android", icon: "linkedin" },
          { label: "Instagram", href: "https://www.instagram.com/__dev.yogesh__?rpxt=MWZtamtjeGczMGk0eQ==", icon: "instagram" },
        ]}
        columns={[
          {
            title: "Navigation",
            links: [
              { label: "Hero", href: "#hero" },
              { label: "Services", href: "#services" },
              { label: "Approach", href: "#approach" },
              { label: "Toolkit", href: "#skills" },
              { label: "Work", href: "#projects" },
              { label: "Contact", href: "#contact" },
            ],
          },
          {
            title: "Services",
            links: [
              { label: "Full-Stack Development", href: "#contact" },
              { label: "WordPress Solutions", href: "#contact" },
              { label: "Web Applications", href: "#contact" },
              { label: "Headless CMS & APIs", href: "#contact" },
            ],
          },
        ]}
        credits={[
          { lead: "Crafted by ", label: "Yogeshwaran K.", href: "#hero" },
          { lead: "Ember Noir ", label: "Design System", tail: " // 2026" },
        ]}
      />
    </main>
  );
}
