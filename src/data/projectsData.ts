export type ProjectCategory =
  | 'All Work'
  | 'Full-Stack'
  | 'E-commerce'
  | 'Business & Real Estate'
  | 'Travel & Education';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  filterCategories: ('Full-Stack' | 'E-commerce' | 'Business & Real Estate' | 'Travel & Education')[];
  description: string;
  highlights: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  liveUrl: string;
  isFeatured?: boolean;
  role: string;
  year?: string;
}

export const CATEGORIES: { label: ProjectCategory; value: ProjectCategory }[] = [
  { label: 'All Work', value: 'All Work' },
  { label: 'Full-Stack', value: 'Full-Stack' },
  { label: 'E-commerce', value: 'E-commerce' },
  { label: 'Business & Real Estate', value: 'Business & Real Estate' },
  { label: 'Travel & Education', value: 'Travel & Education' },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'crm-dashboard',
    title: 'CRM Dashboard',
    subtitle: 'Multi-Tenant SaaS Application',
    category: 'Full-Stack CRM Application',
    filterCategories: ['Full-Stack'],
    description:
      'A full-stack multi-tenant CRM application engineered with lead scoring, customizable deals pipeline, customer analytics dashboards, and an embeddable AI customer assistant for automated prospect inquiry handling.',
    highlights: [
      'Multi-tenant architecture with isolated tenant data and customizable sales deals pipeline',
      'Automated prospect lead scoring and real-time deal stage transitions',
      'Embeddable AI assistant designed to analyze incoming business leads and generate contextual responses',
      'Responsive analytics interface built with high-legibility data tables and pipeline boards',
    ],
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Vite', 'Tailwind CSS'],
    image: '/projects/crm-dashboard.png',
    imageAlt: 'Live browser preview of CRM Dashboard full-stack SaaS authentication and management interface',
    liveUrl: 'https://crm-dashboard-three-iota.vercel.app/login',
    isFeatured: true,
    role: 'Full-Stack Application Development',
    year: '2025',
  },
  {
    id: 'zypo',
    title: 'Zypo',
    subtitle: 'Production E-Commerce Platform',
    category: 'E-commerce Application with Admin Panel',
    filterCategories: ['Full-Stack', 'E-commerce'],
    description:
      'A complete full-stack e-commerce application featuring a customer-facing storefront and a dedicated administrative panel. Covers product catalog exploration, variant selections, shopping cart, user authentication, and Razorpay payment workflows.',
    highlights: [
      'Production storefront with category navigation, quick filtering, and responsive search bar',
      'Full administrative panel for product catalog maintenance, order tracking, and refund flows',
      'Secure transaction processing with Razorpay checkout integration',
      'Verified customer review submission engine and promotional coupon management',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Razorpay'],
    image: '/projects/zypo.png',
    imageAlt: 'Live browser preview of Zypo E-commerce platform storefront featuring categories and products',
    liveUrl: 'https://zypoecommerce.vercel.app/',
    isFeatured: true,
    role: 'Full-Stack E-commerce & Admin Development',
    year: '2025',
  },
  {
    id: 'white-horse-herbals',
    title: 'White Horse Herbals',
    subtitle: 'Herbal Wellness Store',
    category: 'Ayurvedic Wellness WooCommerce',
    filterCategories: ['E-commerce'],
    description:
      'Dedicated e-commerce online store developed for an Ayurvedic and herbal wellness brand. Features structured product categories, detailed botanical ingredient information, customer wishlists, and seamless shopping cart checkout.',
    highlights: [
      'Customized WooCommerce storefront tailored for herbal wellness items and formulations',
      'Responsive product grid with instant wishlist and cart interactions',
      'Streamlined checkout flow optimized for domestic customer orders',
    ],
    stack: ['WordPress', 'WooCommerce', 'Elementor', 'PHP', 'Custom CSS'],
    image: '/projects/white-horse.png',
    imageAlt: 'Live browser screenshot of White Horse Herbals Ayurvedic wellness online store',
    liveUrl: 'https://whitehorseherbals.com/',
    isFeatured: false,
    role: 'WooCommerce Store Development',
    year: '2024',
  },
  {
    id: 'divine-world',
    title: 'Divine World',
    subtitle: 'Spiritual Essentials E-Commerce',
    category: 'Spiritual Essentials WooCommerce',
    filterCategories: ['E-commerce'],
    description:
      'Direct-to-consumer online shopping destination delivering puja essentials, sacred ritual items, and authentic spiritual goods. Built with category filters, customer testimonials, and reliable payment options.',
    highlights: [
      'Category-driven shopping experience highlighting curated spiritual collections',
      'Optimized mobile navigation with quick product previews and search',
      'WooCommerce checkout integration with domestic fulfillment support',
    ],
    stack: ['WordPress', 'WooCommerce', 'Astra', 'Elementor', 'PHP'],
    image: '/projects/divine-world.png',
    imageAlt: 'Live browser screenshot of Divine World spiritual essentials e-commerce website',
    liveUrl: 'https://divineworldindia.com/',
    isFeatured: false,
    role: 'E-commerce Website Development',
    year: '2024',
  },
  {
    id: 'sky-park',
    title: 'Sky Park Properties',
    subtitle: 'Real Estate & Property Showcase',
    category: 'Real Estate Website',
    filterCategories: ['Business & Real Estate'],
    description:
      'High-impact real estate showcase website presenting residential and commercial properties. Includes architectural gallery views, floor layout specifications, project connectivity maps, and direct inquiry scheduling.',
    highlights: [
      'Visual showcase for premium residential real estate and developments',
      'Clear project highlights detailing floor plans, amenities, and location advantages',
      'Inquiry capture forms facilitating direct client communication with sales teams',
    ],
    stack: ['WordPress', 'Elementor', 'Custom CSS', 'PHP'],
    image: '/projects/sky-park.png',
    imageAlt: 'Live browser screenshot of Sky Park properties real estate web showcase',
    liveUrl: 'https://skyparkproperties.in/',
    isFeatured: false,
    role: 'Real Estate Website Development',
    year: '2024',
  },
  {
    id: 'business-bench',
    title: 'Business Bench',
    subtitle: 'Interior Design & Architecture',
    category: 'Premium Interior Website',
    filterCategories: ['Business & Real Estate'],
    description:
      'Editorial portfolio website crafted for an interior architecture and turnkey workspace design studio. Showcases commercial office fit-outs and luxury residential transformations with high-definition photography layouts.',
    highlights: [
      'Editorial portfolio layout highlighting turnkey interior transformations',
      'Detailed corporate workspace and residential design service descriptions',
      'High-resolution architectural photography galleries and client consultation CTAs',
    ],
    stack: ['WordPress', 'Astra Pro', 'Elementor', 'Custom Responsive CSS'],
    image: '/projects/business-bench.png',
    imageAlt: 'Live browser screenshot of Business Bench premium interior design and architecture studio website',
    liveUrl: 'https://wordpress-977481-6633926.cloudwaysapps.com/',
    isFeatured: false,
    role: 'Website Design & Development',
    year: '2024',
  },
  {
    id: 'utsava',
    title: 'Utsava Travels',
    subtitle: 'Tourism & Holiday Booking',
    category: 'Travel Website',
    filterCategories: ['Travel & Education'],
    description:
      'Tourism and vacation booking portal featuring curated holiday packages, regional tour circuits, and customized travel itinerary inquiries with direct booking consultation.',
    highlights: [
      'Comprehensive package catalog detailing daily travel itineraries and destination highlights',
      'Direct contact and WhatsApp consultation integrations for rapid quote generation',
      'Mobile-optimized booking experience for travelers exploring tour options',
    ],
    stack: ['WordPress', 'Astra', 'Elementor', 'Custom Tour Itinerary Flow'],
    image: '/projects/utsava.png',
    imageAlt: 'Live browser screenshot of Utsava Travels vacation booking and holiday packages website',
    liveUrl: 'https://utsavatravels.com/',
    isFeatured: false,
    role: 'Travel Website Development',
    year: '2024',
  },
  {
    id: 'sngc',
    title: 'SNGC',
    subtitle: 'Higher Educational Institution',
    category: 'Educational Website',
    filterCategories: ['Travel & Education'],
    description:
      'Institutional academic web portal developed for a higher education college. Organizes academic programs, departmental faculties, campus amenities, and admissions documentation into an accessible digital experience.',
    highlights: [
      'Comprehensive curriculum directory organizing undergraduate and postgraduate degree courses',
      'Campus facilities showcase, accreditation badges, and academic calendars',
      'Structured admissions information and downloadable student prospectuses',
    ],
    stack: ['WordPress', 'Astra', 'Elementor', 'Academic Portal Architecture'],
    image: '/projects/sngc.png',
    imageAlt: 'Live browser screenshot of SNGC educational institution college website',
    liveUrl: 'https://wordpress-977481-6378976.cloudwaysapps.com/',
    isFeatured: false,
    role: 'Educational Website Development',
    year: '2024',
  },
  {
    id: 'kranzo',
    title: 'Kranzo',
    subtitle: 'SEO & Performance Marketing',
    category: 'SEO-Focused Website',
    filterCategories: ['Business & Real Estate'],
    description:
      'Conversion-centered digital agency website engineered for search performance, structured digital marketing services, and client lead acquisition with high-speed page loading benchmarks.',
    highlights: [
      'Speed-optimized website structure with custom CSS styling and minimal render blockage',
      'Structured service modules detailing SEO audits, content growth, and digital marketing strategies',
      'Clear lead capture funnels and strategic call-to-action touchpoints',
    ],
    stack: ['WordPress', 'Custom CSS', 'Astra', 'Performance Optimization'],
    image: '/projects/kranzo.png',
    imageAlt: 'Live browser screenshot of Kranzo SEO and performance marketing website',
    liveUrl: 'https://wordpress-977481-6710006.cloudwaysapps.com/',
    isFeatured: false,
    role: 'SEO Website Development',
    year: '2024',
  },
];
