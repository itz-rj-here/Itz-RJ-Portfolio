import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const roles = [
  "Student Developer",
  "Web Enthusiast",
  "Open Source Contributor",
  "Frontend Developer",
  "Creative Coder",
];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentRole.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 80);
    } else if (!isDeleting && charIndex === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 40);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const displayText = roles[roleIndex].slice(0, charIndex);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  // Memoize particles so they don't recalculate on each render
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        width: 100 + i * 60,
        height: 100 + i * 60,
        left: `${15 + i * 18}%`,
        top: `${20 + i * 12}%`,
        opacity: 0.04 + i * 0.02,
        delay: i * 2,
      })),
    []
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient bg */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      {/* Floating orbs */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            width: p.width,
            height: p.height,
            background: `radial-gradient(circle, hsl(211 78% 51% / ${p.opacity}) 0%, transparent 70%)`,
            left: p.left,
            top: p.top,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Animated grid lines (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(211 78% 51% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(211 78% 51% / 0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          className="text-primary text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to my world
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl font-display font-bold glow-text text-foreground mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          It'z RJ
        </motion.h1>

        {/* Typewriter role text */}
        <motion.div
          className="h-10 md:h-12 flex items-center justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-lg md:text-2xl text-accent font-display font-medium">
            {displayText}
          </span>
          <span className="w-0.5 h-6 md:h-8 bg-accent ml-1 animate-typewriter-blink" />
        </motion.div>

        <motion.p
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Crafting elegant digital experiences with clean code and creative vision.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <button
            onClick={() => scrollTo("#portfolio")}
            className="group px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              View My Work
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </span>
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-secondary hover:border-primary/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Contact Me
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
