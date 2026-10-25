import { HeroData, Project, SkillItem, NextJsFeature } from '../types';

export const initialHeroData: HeroData = {
  name: 'Creative Full-Stack Developer',
  role: 'Next.js Specialist & Creative Technologist',
  tagline: 'Bridging high-performance engineering with fluid GSAP kinetic motion.',
  bio: 'Specializing in Next.js App Router, reactive frontends, and cinematic GSAP web animations. Obsessed with high frame rates, type-safe architecture, and memorable interactive experiences.',
  status: 'Available for freelance & full-time roles',
  location: 'Open to Remote Worldwide',
  availableForFreelance: true,
  socials: {
    github: 'https://github.com/yogeshwaran6414',
    linkedin: 'https://www.linkedin.com/in/yogesh-waran-893992446?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    instagram: 'https://www.instagram.com/__dev.yogesh__?rpxt=MWZtamtjeGczMGk0eQ==',
    twitter: 'https://twitter.com',
    email: 'k.yogesh6414@gmail.com',
  },
};

export const techStackItems: string[] = [
  'Next.js 15',
  'GSAP Animation Suite',
  'React 19',
  'TypeScript',
  'Tailwind CSS v4',
  'Framer Motion',
  'Node.js & Express',
  'PostgreSQL',
  'Server Components',
  'Lenis Smooth Scroll',
  'Three.js / WebGL',
  'GraphQL',
];

export const portfolioProjects: Project[] = [
  {
    id: 'kinetic-saas',
    title: 'Aura Cloud Platform',
    tagline: 'Enterprise analytics dashboard with GSAP micro-interactions',
    description: 'Built with Next.js App Router, Tailwind, and GSAP timeline choreography. Features real-time telemetry metrics, smooth SVG charts, and zero-latency layout transitions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    tags: ['Next.js', 'GSAP', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    metrics: '99/100 Lighthouse Performance',
  },
  {
    id: 'studio-creative',
    title: 'Vanguard Design Studio',
    tagline: 'Immersive award-winning agency portfolio with kinetic typography',
    description: 'A cutting-edge showcase site featuring mouse-driven parallax, text split scroll reveals, and magnetic UI components powered by GSAP ScrollTrigger.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    tags: ['React', 'GSAP Timeline', 'WebGL', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    metrics: 'Awwwards Site of the Day nominee',
  },
  {
    id: 'hyper-commerce',
    title: 'Chronos Luxury Store',
    tagline: 'Headless e-commerce experience with sub-second page loads',
    description: 'Ultra-refined luxury storefront built with Next.js Server Components, streaming SSR, and fluid product card interactive transitions.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
    tags: ['Next.js App Router', 'Stripe', 'Tailwind', 'GSAP'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    metrics: '1.2s avg time to interactive',
  },
];

export const skillsList: SkillItem[] = [
  { name: 'Next.js (App Router, RSC)', category: 'Architecture & Next.js', level: 95, highlight: 'Server Actions, Streaming, ISR' },
  { name: 'GSAP (GreenSock)', category: 'Frontend & Animation', level: 92, highlight: 'Timelines, ScrollTrigger, Flip' },
  { name: 'React 19 & Hooks', category: 'Frontend & Animation', level: 96, highlight: 'Concurrent Mode, Custom Hooks' },
  { name: 'TypeScript', category: 'Architecture & Next.js', level: 94, highlight: 'Strict Typing, Generics, DX' },
  { name: 'Tailwind CSS v4', category: 'Frontend & Animation', level: 95, highlight: 'Design Systems, Fluid Typography' },
  { name: 'Framer Motion', category: 'Frontend & Animation', level: 90, highlight: 'Layout animations, Gestures' },
  { name: 'Node.js & Express', category: 'Backend & Cloud', level: 88, highlight: 'RESTful APIs, Microservices' },
  { name: 'PostgreSQL & ORMs', category: 'Backend & Cloud', level: 85, highlight: 'Prisma, Drizzle, Indexing' },
  { name: 'Performance Optimization', category: 'Architecture & Next.js', level: 92, highlight: 'Core Web Vitals, Bundle analysis' },
];

export const nextJsRoadmapItems: NextJsFeature[] = [
  {
    title: 'Hybrid Rendering & Server Components',
    badge: 'Next.js 15 Ready',
    description: 'Zero-bundle-size React Server Components for heavy static layouts, combined with client boundaries only where dynamic GSAP animation hooks are required.',
    animationPattern: 'Server-hydrated dom markers with immediate GSAP entrance timelines',
  },
  {
    title: 'Smooth Page Transitions & View Transitions API',
    badge: 'UX Upgrade',
    description: 'Seamless cross-route morphing so hero banners and project cards glide effortlessly without white flashes or abrupt layout shifts.',
    animationPattern: 'GSAP Flip & document.startViewTransition wrapper integration',
  },
  {
    title: 'Optimized Media & WebP/AVIF Pipeline',
    badge: 'Asset Delivery',
    description: 'Next/image automatic sizing, priority LCP hero image loading, responsive srcset generation, and blur-up placeholders.',
    animationPattern: 'Hardware-accelerated CSS transforms with GSAP ticker loop',
  },
  {
    title: 'Lenis Smooth Scroll + ScrollTrigger Synchronization',
    badge: 'Kinetic Motion',
    description: 'Unified virtual scroll delta piping into GSAP ScrollTrigger to ensure stutter-free 60/120fps scrolling on both desktop and mobile devices.',
    animationPattern: 'gsap.ticker.add((time) => lenis.raf(time * 1000))',
  },
];
