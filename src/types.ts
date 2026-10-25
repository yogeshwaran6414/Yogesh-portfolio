export interface HeroData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  status: string;
  location: string;
  availableForFreelance: boolean;
  socials: {
    github: string;
    linkedin: string;
    instagram?: string;
    twitter: string;
    email: string;
  };
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
}

export interface SkillItem {
  name: string;
  category: 'Frontend & Animation' | 'Backend & Cloud' | 'Architecture & Next.js';
  level: number;
  highlight?: string;
  iconName?: string;
}

export interface NextJsFeature {
  title: string;
  badge: string;
  description: string;
  animationPattern: string;
}
