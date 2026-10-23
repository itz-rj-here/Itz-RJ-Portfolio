import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setExiting(true);
    setTimeout(() => {
      onComplete();
    }, 850);
  };

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2200; // Refined 2.2s minimalist sequence

    let rafId: number;
    const tick = (now: number) => {
      if (completedRef.current) return;
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Custom smooth quintic ease-out curve
      const eased = 1 - Math.pow(1 - ratio, 4);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(finishIntro, 180);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between p-8 md:p-14 overflow-hidden select-none bg-background"
      initial={{ y: "0%" }}
      animate={exiting ? { y: "-100%" } : { y: "0%" }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Subtle Core Brand Ambient Wash */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary) / 0.14) 0%, hsl(var(--accent) / 0.05) 45%, transparent 75%)",
        }}
      />

      {/* Top Minimalist Header */}
      <motion.div
        className="relative z-10 flex items-center justify-between text-xs text-muted-foreground"
        animate={exiting ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-display font-medium tracking-tight text-foreground/90">
          Md. Faiad Mahmud Adil
        </span>
        <button
          type="button"
          onClick={finishIntro}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </motion.div>

      {/* Center Minimalist Brand Lockup & Hairline Progress */}
      <motion.div
        className="relative z-10 my-auto w-full max-w-md mx-auto flex flex-col items-center text-center"
        animate={
          exiting
            ? { opacity: 0, y: -24, scale: 0.98 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Masked Wordmark Reveal */}
        <div className="overflow-hidden pb-2">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-foreground"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            It'z <span className="gradient-text">RJ</span>
          </motion.h1>
        </div>

        {/* Masked Subtitle Reveal */}
        <div className="overflow-hidden mt-1">
          <motion.p
            className="text-xs sm:text-sm text-muted-foreground tracking-[0.18em] uppercase font-medium"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Portfolio & Selected Works
          </motion.p>
        </div>

        {/* Minimalist Hairline Progress Track */}
        <div className="w-48 sm:w-56 h-[2px] bg-secondary/80 rounded-full overflow-hidden mt-8 relative">
          <div
            className="h-full w-full bg-gradient-to-r from-primary to-accent rounded-full origin-left transition-transform duration-75 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </motion.div>

      {/* Bottom Minimalist Counter & Location */}
      <motion.div
        className="relative z-10 flex items-end justify-between text-xs text-muted-foreground"
        animate={exiting ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-muted-foreground/70">Dhaka, Bangladesh</span>
        <span className="font-mono text-sm font-medium text-foreground/90 tabular-nums">
          {String(progress).padStart(2, "0")}%
        </span>
      </motion.div>

      {/* Subtle Bottom Hairline Edge */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </motion.div>
  );
};

export default IntroScreen;
