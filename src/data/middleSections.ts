// Portfolio copy is kept here so services, skills and projects are easy to edit.
export const services = [
  { title: 'Custom Software & SaaS Development', short: 'Custom applications and SaaS products designed around your business workflows and product ideas.', description: 'I develop custom software, SaaS platforms, business dashboards, and web applications that help businesses manage workflows, organize information, and deliver digital services. Whether you need an MVP, an internal business tool, or a subscription-based product, I can help turn your requirements into a working solution.', capabilities: ['Custom software development', 'SaaS application development', 'MVP development', 'Business dashboards', 'Workflow automation'], preview: 'dashboard' },
  { title: 'Website Design & Development', short: 'Responsive websites designed to communicate your brand and support your business goals.', description: 'I build modern business websites, landing pages, and custom web experiences that work across desktop, tablet, and mobile. I focus on usability, responsive layouts, performance, maintainable code, and search-engine-friendly structure.', capabilities: ['Business websites', 'Landing pages', 'Custom website development', 'Responsive web design', 'Website redesign'], preview: 'website' },
  { title: 'E-commerce & Shopify Development', short: 'Online stores that make product discovery and purchasing simple for customers.', description: 'I develop e-commerce experiences tailored to your products, customers, and business model. From Shopify storefronts to custom online stores, I focus on responsive product pages, clear navigation, store customization, and a smooth shopping journey.', capabilities: ['Shopify store development', 'E-commerce website development', 'Product catalogue setup', 'Payment integration', 'Store customization'], preview: 'store' },
  { title: 'WordPress Development', short: 'Flexible WordPress websites that are easy to manage and adapt as your business grows.', description: 'I build and customize WordPress websites for businesses that need control over their content and online presence. From company websites to WooCommerce stores, I can tailor WordPress to the requirements of your project.', capabilities: ['WordPress website development', 'Custom theme development', 'Plugin customization', 'WooCommerce development', 'Website maintenance'], preview: 'editorial' },
] as const;

export const principles = [
  ['Solutions Built Around Your Goals', 'I start by understanding your requirements, users, and business objectives before deciding how to approach the project.'],
  ['Design Meets Functionality', 'I aim to combine clean, intuitive interfaces with reliable functionality so the finished product looks good and works as expected.'],
  ['Practical, Adaptable Development', 'I choose technologies and implementation approaches suited to the project, with attention to maintainability and future improvements.'],
  ['Direct Communication', 'I value clear communication, transparent discussions, and regular updates so expectations and project priorities remain aligned.'],
] as const;

// Technologies named in the brief; PostgreSQL is also documented in existing project data.
// Remove or edit any item here as your actual experience changes.
export const skillGroups = [
  { title: 'Frontend Development', items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Bootstrap'] },
  { title: 'Backend Development', items: ['Node.js', 'Express.js', 'API integration'] },
  { title: 'Databases', items: ['SQLite', 'PostgreSQL'] },
  { title: 'CMS & E-commerce', items: ['WordPress', 'Shopify', 'WooCommerce'] },
  { title: 'Development Workflow', items: ['Git', 'GitHub', 'Responsive development', 'Debugging and testing'] },
];

export interface SelectedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  placeholder?: boolean;
}

// Unverified projects remain editable drafts, never published as completed work.
export const projectDrafts: SelectedProject[] = [
  { id: 'nxt-trendz', title: 'Nxt Trendz', category: 'E-commerce Web Application', description: 'Project details awaiting confirmation.', tags: [], placeholder: true },
  { id: 'food-munch', title: 'Food Munch', category: 'Restaurant Website', description: 'Project details awaiting confirmation.', tags: [], placeholder: true },
  { id: 'todos', title: 'Todos Application', category: 'Productivity Application', description: 'Project details awaiting confirmation.', tags: [], placeholder: true },
  { id: 'business-dashboard', title: 'Business Dashboard', category: 'Business Web Application', description: 'Project details awaiting confirmation.', tags: [], placeholder: true },
];
