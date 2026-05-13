import { motion } from "framer-motion";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient bg */}
      <div className="absolute inset-0 gradient-bg" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, hsl(211 78% 51% / 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, hsl(199 92% 85% / 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Floating orbs */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: 100 + i * 60,
            height: 100 + i * 60,
            background: `radial-gradient(circle, hsl(211 78% 51% / ${0.04 + i * 0.02}) 0%, transparent 70%)`,
            left: `${15 + i * 25}%`,
            top: `${20 + i * 15}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

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

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Student developer crafting elegant digital experiences with clean code and creative vision.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => scrollTo("#portfolio")}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            View My Work
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-all"
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
