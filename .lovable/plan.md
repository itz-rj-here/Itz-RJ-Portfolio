

# It'z RJ — Elite Developer Portfolio

## Overview
A high-end, modern developer portfolio for **It'z RJ** (Md. Faiad Mahmud Adil) — a visually striking, deep-blue themed portfolio with cinematic intro, smooth animations, and professional-grade UI/UX.

---

## Design System
- **Color palette**: Midnight blue (#0B1E38), deep navy (#102A43), electric blue (#1E88E5), sky blue (#64B5F6), soft cyan glow (#B3E5FC)
- **Style**: Layered gradients, glass-morphism cards, subtle glow accents, generous whitespace
- **Typography**: Clean, modern sans-serif with strong visual hierarchy
- **Animations**: Framer Motion — fade-up on scroll, hover glows, smooth page transitions

---

## Pages & Sections

### 1. Cinematic Intro Screen
- Glowing particle text animation revealing "It'z RJ" (2-4 seconds)
- Skip Intro button
- Plays only on first visit (localStorage flag)
- Smooth transition into the main site

### 2. Header / Navigation
- Sticky header with glass-blur background on scroll
- Logo "It'z RJ" on the left
- Nav links: Home, About, Skills, Portfolio, Certificates, Contact Me (CTA)
- Underline hover animations with electric blue accent
- Mobile: animated hamburger → full-height slide panel

### 3. Hero Section
- Large glowing "It'z RJ" heading with professional tagline
- Two CTA buttons: "View My Work" and "Contact Me"
- Animated gradient / subtle particle background

### 4. About Section
- Split layout: profile image + glass-style bio card
- Full name reveal: **Md. Faiad Mahmud Adil (It'z RJ)**
- Developer journey, student background, tech philosophy

### 5. Skills / Tech Stack
- Categorized: Frontend, Programming, Tools & Technologies
- Animated skill cards with hover glow effects
- Proficiency indicators with smooth transitions

### 6. Portfolio Section
- Grid of project cards with gradient borders
- Hover: scale, glow, reveal "View Details"
- Placeholder projects to customize later

### 7. Project Detail Page (separate route)
- Case-study style layout with back navigation
- Hero image, description, stats row (tech count, features count)
- Live Demo & GitHub buttons
- Technology pill badges, key features list
- Scroll-triggered fade-up animations

### 8. Certificates Section
- Clean grid layout
- Click to open lightbox/modal preview
- Placeholder certificate entries

### 9. Contact Section
- Minimal contact form (name, email, message)
- Social media links
- Electric blue CTA button

### 10. Footer
- Branding, quick links, copyright

---

## Technical Approach
- **Framer Motion** for all animations (intro, scroll reveals, page transitions, hover effects)
- **React Router** for multi-page navigation (home, project details)
- **Responsive-first** design — premium feel on desktop, tablet, and mobile
- **Component-based architecture** — reusable Section, ProjectCard, SkillCard, GlassCard components
- No backend required — static content, form can be wired up later

