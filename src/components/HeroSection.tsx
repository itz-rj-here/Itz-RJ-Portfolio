import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Sparkles, Code2, Award, FolderGit2 } from "lucide-react";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, DiscordIcon } from "@/components/SocialIcons";

const defaultRoles = [
  "Student Developer",
  "Frontend Engineer",
  "Open Source Collaborator",
  "UI/UX Enthusiast",
  "Creative Technologist",
];

const HeroSection = () => {
  const { data } = usePortfolioData();
  const { about, projects, certificates, skillCategories, socialLinks } = data;

  const roles = about.heroRoles?.length ? about.heroRoles : defaultRoles;
  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
  const heroPortrait =
    about.aboutImages?.[0]?.src || "https://i.ibb.co.com/gMdpT7xc/pfp.png";
  const featuredProject = projects[0];

  const [roleIndex, setRoleIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [heroPortrait]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const iconMap = {
    Github: GithubIcon,
    Linkedin: LinkedinIcon,
    Instagram: InstagramIcon,
    Facebook: FacebookIcon,
    Discord: DiscordIcon,
  } as const;

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col justify-center overflow-hidden"
    >
      {/* Subtle architectural background atmosphere */}
      <div className="absolute inset-0 gradient-bg -z-20" />
      <div className="absolute inset-0 mesh-gradient opacity-60 -z-10" />
      <div
        className="absolute inset-0 opacity-[0.025] -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* 2-Column Split-Screen Hero */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
          {/* Left Column: Typographic Hierarchy & Primary Action */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            <motion.div
              className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="text-primary font-semibold">{about.fullName}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary/80" />
                {about.location || "Dhaka, Bangladesh"}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground leading-[1.08]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Hi, I'm <span className="gradient-text">It'z RJ</span> —{" "}
              <span className="text-foreground/95">
                {about.heroHeadline || "designing & engineering modern web experiences."}
              </span>
            </motion.h1>

            {/* Animated Role Switcher */}
            <motion.div
              className="h-7 flex items-center gap-2 text-sm md:text-base font-medium text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {roles[roleIndex % roles.length]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.p
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {about.heroBio ||
                "Frontend developer and open-source collaborator from Dhaka crafting high-performance interfaces with React, TypeScript, and clean architectural precision."}
            </motion.p>

            {/* CTA Buttons & Social Bar */}
            <motion.div
              className="pt-2 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
            >
              <button
                type="button"
                onClick={() => scrollTo("#portfolio")}
                className="group px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-all whitespace-nowrap shrink-0"
              >
                Explore Featured Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="px-6 py-3 rounded-lg border border-border bg-secondary/40 text-foreground text-sm font-medium hover:bg-secondary hover:border-primary/40 transition-colors whitespace-nowrap shrink-0"
              >
                Get in Touch
              </button>

              <div className="flex items-center gap-2 sm:ml-2">
                {socialLinks
                  .filter((s) => s.name.toLowerCase() !== "email" && s.icon !== "Mail")
                  .slice(0, 4)
                  .map((link) => {
                    const Icon = iconMap[link.icon as keyof typeof iconMap];
                    if (!Icon) return null;
                    return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${link.name}`}
                        className="w-10 h-10 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase Portrait Card */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div className="relative rounded-2xl border border-border bg-card/70 overflow-hidden shadow-2xl h-full min-h-[360px] flex flex-col justify-between">
              <div className="relative flex-1 min-h-[300px] overflow-hidden bg-gradient-to-br from-primary/15 via-secondary to-background flex items-center justify-center">
                {!imgError ? (
                  <img
                    src={heroPortrait}
                    alt={about.fullName}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <span className="text-7xl font-display font-bold gradient-text">RJ</span>
                )}
                {/* Measured contrast scrim at bottom of photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-primary font-medium">{about.subtitle}</p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {about.fullName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo("#about")}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 whitespace-nowrap shrink-0"
                  >
                    About Me →
                  </button>
                </div>
              </div>

              {/* Featured Project Strip inside Visual Card */}
              {featuredProject && (
                <div className="p-4 border-t border-border bg-card/90 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Latest Featured Project</p>
                    <p className="text-xs font-display font-semibold text-foreground truncate mt-0.5">
                      {featuredProject.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo("#portfolio")}
                    className="px-3 py-1.5 rounded-md bg-secondary border border-border text-xs font-medium text-foreground hover:border-primary/40 transition-colors whitespace-nowrap shrink-0"
                  >
                    View Project
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full-Width Quantitative Proof Strip Below the Hero Split */}
        <motion.div
          className="mt-14 pt-8 border-t border-border/70 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground font-mono tabular-nums">
                {projects.length}+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shipped Web & Open-Source Projects
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground font-mono tabular-nums">
                {certificates.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified Technical Certifications
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground font-mono tabular-nums">
                {totalSkills}+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Core Languages, Frameworks & Tools
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground font-mono tabular-nums">
                {skillCategories.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Specialized Engineering Domains
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
