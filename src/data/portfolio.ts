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
  issuerUrl?: string;
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
    title: "MYNT: Material You New Tab",
    description: "MYNT: Material You New Tab is a browser extension designed to enhance the new tab experience with a visually appealing interface inspired by Google's Material You design system. The extension includes features like customizable themes, clock animations, and more, offering users a unique and dynamic browsing experience. The main author of the project is XengShi, and I am a collaborator and maintainer, contributing to its development and ensuring smooth updates and improvements.",
    shortDescription: "MYNT: Material You New Tab is a versatile browser extension that personalizes your New Tab page with customizable themes, a welcoming message, and various handy tools, all while integrating seamlessly with your preferred search engine.",
    image: "https://i.ibb.co.com/Qj1g42hn/portfolio1.jpg",
    images: ["https://i.ibb.co.com/Qj1g42hn/portfolio1.jpg"],
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "Integrated Search",
      "Customizable Themes",
      "Wallpaper",
      "Personalized Greeting",
      "Clock & Time Display",
      "Live Weather Updates",
      "Quick Shortcuts",
      "AI Tools", 
      "To-Do List", 
      "Sidebar Bookmarks", 
      "Google Apps", 
      "Backup & Reset", 
      "Language Support", 
      "Browser Compatibility",
    ],
    liveUrl: "https://prem-k-r.github.io/MaterialYouNewTab/",
    githubUrl: "https://github.com/prem-k-r/MaterialYouNewTab/",
  },
  {
    id: "project-2",
    title: "TATBD's Ultimate Wallpapers",
    description: "TATBD's Ultimate Wallpapers is a project aimed at providing high-quality wallpapers for various devices, curated by the TeenAgeTechBD community. The project offers a collection of stunning, diverse wallpapers that cater to different tastes and preferences. The main author of the project is Saimon Islam Prantik, and I am a collaborator and maintainer, working to expand the wallpaper collection and maintain the project.",
    shortDescription: "High-quality wallpaper collection curated by the TeenAgeTechBD community.",
    image: "https://i.ibb.co.com/1f9nn9yc/portfolio2.jpg",
    images: ["https://i.ibb.co.com/1f9nn9yc/portfolio2.jpg"],
    technologies: ["HTML", "CSS", "JavaScript"],
    features: [
      "Curated wallpaper collections",
      "High-resolution images",
      "Responsive gallery layout",
    ],
    liveUrl: "https://teenagetechbd.github.io/wallpapers/",
    githubUrl: "https://github.com/TeenAgeTechBD/wallpapers",
  },
  {
    id: "project-3",
    title: "Elevate Clothing",
    description: "Elevate Clothing is a fashion e-commerce platform that offers a curated selection of trendy apparel and accessories. The project focuses on providing a seamless shopping experience with features like personalized recommendations, user reviews, and a secure checkout process. I'm the main author and Co-Founder of the project, and maintaining, contributing to its development and ensuring a smooth user experience.",
    shortDescription: "Fashion e-commerce platform offering a seamless, personalized shopping experience.",
    image: "https://i.ibb.co.com/1tXdVNLz/portfolio3.png",
    images: ["https://i.ibb.co.com/1tXdVNLz/portfolio3.png"],
    technologies: ["Vite", "TypeScript", "React", "Tailwind CSS"],
    features: [
      "Personalized recommendations",
      "User reviews",
      "Secure checkout",
      "Curated product catalog",
    ],
    liveUrl: "https://elevateclothing.netlify.app/",
  },
  {
    id: "project-4",
    title: "Masud Hasan — Portfolio",
    description:
      "Masud Hasan — Portfolio is a modern, responsive portfolio website showcasing the work and profile of Masud Hasan, a Lecturer, Online Educator, Actor, Criminologist & Digital Creator from Dhaka, Bangladesh. The site highlights his expertise in ICT education and digital creation with smooth animations and an accessible, visually engaging design, built for fast performance and easy maintenance. Powered by React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, and Framer Motion, it provides a solid and scalable foundation for his personal brand.",
    shortDescription:
      "A modern, responsive portfolio for Masud Hasan featuring dark/light mode, animated sections, and an accessible UI built with React, TypeScript, and Tailwind CSS.",
    image: "https://i.ibb.co.com/PR0N4zH/portfolio4.png",
    images: ["https://i.ibb.co.com/PR0N4zH/portfolio4.png"],
    technologies: ["React 18", "Vite", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion"],
    features: [
      "Responsive design",
      "Dark / light mode theme support",
      "Animated sections powered by Framer Motion",
      "Accessible UI using shadcn/ui and Radix primitives",
      "Fast performance and optimized build setup",
    ],
    liveUrl: "https://masudhasan.vercel.app/",
    githubUrl: "https://github.com/itz-rj-here/masud-hasan-portfolio",
  },
];

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Introduction to HTML",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2025",
    image: "https://i.ibb.co.com/Ldngz8Qh/cert1.png",
  },
  {
    id: "cert-2",
    title: "Participation in General Knowledge Quiz",
    issuer: "Let's Know The World",
    issuerUrl: "https://www.facebook.com/Letsknowtheworldofficial/",
    date: "2025",
    image: "https://i.ibb.co.com/xtk7YkmQ/cert2.png",
  },
  {
    id: "cert-3",
    title: "Participation in IQ Quiz",
    issuer: "Let's Know The World",
    issuerUrl: "https://www.facebook.com/Letsknowtheworldofficial/",
    date: "2025",
    image: "https://i.ibb.co.com/Fb6swbQd/cert3.png",
  },
  {
    id: "cert-4",
    title: "Participation in English Quiz",
    issuer: "Let's Know The World",
    issuerUrl: "https://www.facebook.com/Letsknowtheworldofficial/",
    date: "2025",
    image: "https://i.ibb.co.com/FbdCv3vf/cert4.png",
  },
  {
    id: "cert-5",
    title: "AI Magic & Content Creation",
    issuer: "ICT Olympiad Bangladesh",
    issuerUrl: "https://www.ictolympiadbangladesh.com/",
    date: "2026",
    image: "https://i.ibb.co.com/xqWnYsz5/cert5.png",
  },
    {
    id: "cert-6",
    title: "Introduction to CSS",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/S40BBCcM/cert6.jpg",
  },
  {
    id: "cert-7",
    title: "Tech for Everyone",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/YTT7H8G9/cert7.jpg",
  },
  {
    id: "cert-8",
    title: "Vibe Coding",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/1Y69xMhk/cert8.jpg",
  },
  {
    id: "cert-9",
    title: "Write with AI",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/wZqwrsNs/cert9.jpg",
  },
  {
    id: "cert-10",
    title: "Prompt Engineering",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/BVG4yv6d/cert10.jpg",
  },
  {
    id: "cert-11",
    title: "Introduction to LLMs",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/qLqB4bSk/cert11.jpg",
  },
  {
    id: "cert-12",
    title: "Machine Learning for Beginners",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/5hBdnpKx/cert12.jpg",
  },
  {
    id: "cert-13",
    title: "Visualize Your Data",
    issuer: "Sololearn",
    issuerUrl: "https://www.sololearn.com/",
    date: "2026",
    image: "https://i.ibb.co.com/8nZk3hHp/cert13.jpg",
  }
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
  { name: "Facebook", url: "https://www.facebook.com/itzrjhere/", icon: "Facebook" },
  { name: "Instagram", url: "https://www.instagram.com/certified_valochele/", icon: "Instagram" },
  { name: "GitHub", url: "https://github.com/itz-rj-here", icon: "Github" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/itz-rj/", icon: "Linkedin" },
  { name: "Discord", url: "https://discordapp.com/users/722033282631467069/", icon: "Discord" },
  { name: "Email", url: "mailto:faiadmahmudadil@gmail.com", icon: "Mail" },
];
