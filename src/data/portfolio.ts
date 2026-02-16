export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images?: string[];
  technologies: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with product management, cart functionality, and payment integration. Built with modern web technologies for optimal performance and user experience.",
    shortDescription: "Modern e-commerce solution with seamless checkout experience.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    technologies: ["React", "Tailwind CSS", "Firebase", "Stripe"],
    features: ["Product catalog with filtering", "Shopping cart & wishlist", "Secure payment processing", "Order tracking dashboard"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-2",
    title: "Task Management App",
    description: "A collaborative task management application featuring real-time updates, team workspaces, and productivity analytics. Designed to streamline project workflows.",
    shortDescription: "Collaborative task manager with real-time team features.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    features: ["Drag & drop task boards", "Real-time collaboration", "Productivity analytics", "Team workspace management"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-3",
    title: "Weather Dashboard",
    description: "An elegant weather dashboard providing real-time forecasts, interactive maps, and historical data visualization. Features location-based automatic updates.",
    shortDescription: "Real-time weather tracking with beautiful data visualization.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    technologies: ["React", "Tailwind CSS", "OpenWeather API", "Chart.js"],
    features: ["5-day forecast", "Interactive weather maps", "Location auto-detect", "Historical data charts"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-4",
    title: "Portfolio Generator",
    description: "A dynamic portfolio generator that allows developers to create stunning portfolios with customizable themes, sections, and deployment options.",
    shortDescription: "Create stunning developer portfolios with zero effort.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    technologies: ["React", "JavaScript", "CSS3", "GitHub API"],
    features: ["Customizable themes", "GitHub integration", "One-click deploy", "SEO optimization"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const certificates: Certificate[] = [
  { id: "cert-1", title: "Web Development Fundamentals", issuer: "Coursera", date: "2024", image: "/placeholder.svg" },
  { id: "cert-2", title: "React Developer Certificate", issuer: "Meta", date: "2024", image: "/placeholder.svg" },
  { id: "cert-3", title: "JavaScript Algorithms", issuer: "freeCodeCamp", date: "2023", image: "/placeholder.svg" },
  { id: "cert-4", title: "Responsive Web Design", issuer: "freeCodeCamp", date: "2023", image: "/placeholder.svg" },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      { name: "HTML5", level: 90 },
      { name: "CSS3", level: 85 },
      { name: "JavaScript", level: 80 },
      { name: "React", level: 75 },
      { name: "Tailwind CSS", level: 85 },
    ],
  },
  {
    name: "Programming",
    skills: [
      { name: "Java", level: 70 },
      { name: "TypeScript", level: 65 },
      { name: "Python", level: 55 },
    ],
  },
  {
    name: "Tools & Technologies",
    skills: [
      { name: "Git & GitHub", level: 80 },
      { name: "Firebase", level: 65 },
      { name: "REST APIs", level: 75 },
      { name: "VS Code", level: 90 },
    ],
  },
];

export const socialLinks = [
  { name: "GitHub", url: "#", icon: "Github" },
  { name: "LinkedIn", url: "#", icon: "Linkedin" },
  { name: "Twitter", url: "#", icon: "Twitter" },
  { name: "Email", url: "mailto:hello@itzrj.dev", icon: "Mail" },
];
