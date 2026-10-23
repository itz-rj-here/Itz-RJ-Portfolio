# Portfolio Content Management System & Admin Dashboard

This plan introduces a complete backend and secure Admin Dashboard so you can dynamically manage your portfolio's projects, certificates, skills, About section (bio & profile carousel images), and social/contact links without editing code.

## User Review & Critical Decisions

> [!IMPORTANT]
> Please review the confirmed choices from our discussion before we provision the database and build the backend and dashboard.

- **Confirmed Image Input Strategy**: Dual support for **Image URLs and Direct File Uploads**. You can either paste an external image link or upload an image file directly from your device in the dashboard.
- **Confirmed Dashboard Scope**: Full CRUD and reordering for **Projects** and **Certificates**, editing **Skill Categories & Proficiency Levels**, editing **About Section Bio Text & Profile Carousel Images**, and managing **Social Media Links & Contact Info** (location, email).
- **Confirmed Data Migration**: **Pre-seed the database** automatically with all 5 existing projects, 27 certificates, 3 skill categories, 4 profile images, bio paragraphs, and 6 social links so your live portfolio retains 100% of its current content immediately.
- **Database & Auth Provisioning**: In AI Studio, managed PostgreSQL (Cloud SQL with Drizzle ORM) + Firebase Authentication provides the native Supabase-equivalent relational backend and authentication flow.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms your static portfolio into a dynamic, database-driven web application paired with a dedicated `/login` page and `/dashboard` content management studio.
- **Target Audience / Persona**:
  - *Public Visitors*: Experience fast, seamless browsing of your latest projects, certificates, skills, and bio.
  - *Portfolio Owner (You)*: Sign in via `/login` to access `/dashboard`, where you can add new certificates, publish or reorder projects, adjust skill bars, upload new profile photos, and update contact links in real time.
- **Key Value**: Eliminates manual code edits and redeployments whenever you earn a new certificate, complete a project, or refresh your bio and photos.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Public Portfolio Flow (`/`, `/project/:id`)**:
   - Fetches live portfolio data from the backend API (falling back gracefully to initial static defaults while loading or if offline).
   - Dynamically renders the About carousel images, bio paragraphs, live project/certificate/skill counters, project cards, skill progress bars, certificate gallery, and contact/social links.
2. **Admin Authentication Flow (`/login`)**:
   - Clean, focused login view matching the portfolio's deep-slate & cobalt-glow aesthetic.
   - Supports authenticated sign-in to verify ownership before granting access to `/dashboard` and mutating API routes.
3. **Dashboard Management Flow (`/dashboard`)**:
   - **Overview / Quick Stats Bar**: Displays total counts of Projects, Certificates, Skills, and Profile Images using tabular numerals (`tabular-nums`).
   - **Projects Tab**: High-density list and modal/drawer editor to create, edit, delete, and reorder projects (Up/Down controls), manage technology tags, key feature lists, live/GitHub URLs, and upload/link cover & gallery screenshots.
   - **Certificates Tab**: Searchable grid/table to add new certificates, upload certificate images or paste URLs, set issuer name & URL, date, reorder items, or remove outdated entries.
   - **Skills Tab**: Manage skill categories (e.g., Frontend, Programming, Tools) and add, edit, or delete individual skills with an interactive proficiency slider (`0%`–`100%`).
   - **About & Profile Images Tab**: Edit display name, subtitle (`aka It'z RJ`), multi-paragraph bio text, and manage the rotating profile image carousel (upload new photos, edit alt text, reorder, or delete).
   - **Contact & Socials Tab**: Update location text, contact email, and social media links (GitHub, LinkedIn, Facebook, Instagram, Discord).

### Visual Identity & Theme
- **Aesthetic Direction**: Dark, sleek developer studio console that harmonizes with the existing portfolio theme while following SaaS dashboard clarity rules (single-elevation depth, crisp 1px borders, zero visual clutter).
- **Color Palette & Mood**:
  - *Canvas*: Deep Slate Navy (`--background: 214 60% 11%`)
  - *Surfaces*: Elevated Slate (`--card: 213 55% 14%`) with subtle hairline borders (`--border: 213 40% 22%`)
  - *Primary Accent*: Electric Cobalt (`--primary: 211 78% 51%`) and Sky Cyan (`--accent: 207 90% 68%`)
- **Typography & Hierarchy**:
  - *Headings & Navigation*: `Space Grotesk` / geometric display sans with tight tracking.
  - *Body & Controls*: `Inter` / clean sans-serif for forms and tables, with `tabular-nums` on all skill percentages, sort orders, and item counters.
- **Interactive Feedback & Motion**:
  - Instant toast notifications (`sonner`) on every create, update, reorder, and delete action.
  - Live image preview thumbnail inside forms whenever a file is uploaded or a URL is pasted.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Image Upload & URL Input**
  - *Chosen Approach*: Build a reusable `ImageInput` component supporting both external URLs and direct file upload (converted/stored via backend upload endpoint or optimized data URI/static serving).
  - *Why*: Lets you keep existing `ibb.co` links while making it effortless to drag-and-drop new certificate images or project screenshots directly from your computer.
- **Decision 2: Seamless Pre-Seeding & Fallback**
  - *Chosen Approach*: Automatically seed the database on startup/first run with all data from `portfolio.ts`, and include a "Reset / Sync Default Data" utility in the dashboard if needed.
  - *Why*: Guarantees zero data loss during transition and ensures the public site never renders empty sections.
- **Decision 3: Dedicated Sort Order (`sortOrder`) Columns**
  - *Chosen Approach*: Store an explicit integer `sortOrder` on Projects, Certificates, Skill Categories, and About Images.
  - *Why*: Enables reliable custom reordering from the dashboard so your best projects and newest certificates always appear first.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         React SPA Frontend (Vite)                        │
├────────────────────────────────────┬─────────────────────────────────────┤
│        Public Portfolio Views      │       Admin CMS Views (/login)      │
│  ┌──────────────────────────────┐  │  ┌───────────────────────────────┐  │
│  │ Index (/) & ProjectDetail    │  │  │ DashboardShell (/dashboard)   │  │
│  │  ├─ AboutSection (Dynamic)   │  │  │  ├─ ProjectsManager (CRUD+↕)  │  │
│  │  ├─ SkillsSection (Dynamic)  │  │  │  ├─ CertificatesManager       │  │
│  │  ├─ PortfolioSection         │  │  │  ├─ SkillsManager             │  │
│  │  ├─ CertificatesSection      │  │  │  ├─ AboutProfileManager       │  │
│  │  └─ ContactSection & Footer  │  │  │  └─ SocialsContactManager     │  │
│  └──────────────┬───────────────┘  └──┴───────────────┬───────────────┘  │
└─────────────────┼─────────────────────────────────────┼──────────────────┘
                  │ GET /api/portfolio                  │ Bearer Token / Auth
                  ▼                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Express Backend Server (server.ts)                   │
│  ├─ GET  /api/portfolio          (Public aggregated portfolio payload)   │
│  ├─ POST /api/upload             (Multipart/base64 image upload handler) │
│  ├─ CRUD /api/projects           (Create, update, delete, reorder)       │
│  ├─ CRUD /api/certificates       (Create, update, delete, reorder)       │
│  ├─ PUT  /api/skills             (Update categories & skill levels)      │
│  ├─ PUT  /api/about              (Update bio text & profile images)      │
│  └─ PUT  /api/socials            (Update social links & contact info)    │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ Drizzle ORM / Database Driver
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                Persistent Database & Auth (Auto-Seeded)                  │
│  ├─ projects        (id, title, desc, shortDesc, image, images[], ...)   │
│  ├─ certificates    (id, title, issuer, issuerUrl, date, image, order)   │
│  ├─ skill_categories(id, name, skills JSONB, sortOrder)                  │
│  ├─ about_profile   (id, fullName, nickname, bioParagraphs[], images[])  │
│  └─ social_links    (id, name, url, icon, sortOrder)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities
1. **Projects**: `id`, `title`, `description`, `shortDescription`, `image` (cover), `images` (array of gallery URLs), `technologies` (array of strings), `features` (array of strings), `liveUrl`, `githubUrl`, `sortOrder`.
2. **Certificates**: `id`, `title`, `issuer`, `issuerUrl`, `date`, `image`, `sortOrder`.
3. **Skill Categories**: `id`, `name`, `skills` (array of `{ name: string, level: number }`), `sortOrder`.
4. **About & Contact Settings**: `fullName`, `subtitle`, `location`, `bioParagraphs` (array of strings), `aboutImages` (array of `{ src: string, alt: string }`).
5. **Social Links**: `id`, `name`, `url`, `icon`, `sortOrder`.

### Interactive Component & State Mapping
- **Data Fetching & Cache Invalidation**: Uses `@tanstack/react-query` (`useQuery(['portfolio'])`) across public sections and dashboard managers. Any mutation in `/dashboard` immediately invalidates `['portfolio']`, updating both the dashboard and public pages without a page reload.
- **Image Upload Handler**: Supports selecting a local image file (validating type & size, converting/uploading to the backend) or pasting an external URL, with instant visual preview and error fallback.
- **Reordering Controls**: Each project, certificate, and profile image row includes Up/Down reorder buttons that swap `sortOrder` values and persist the new sequence to the backend.
