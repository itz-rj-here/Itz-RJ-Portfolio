import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [phase, setPhase] = useState<"particles" | "text" | "exit">("particles");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 3000);
    const t3 = setTimeout(onComplete, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 0.8,
  }));

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(214 60% 8%), hsl(213 55% 12%), hsl(214 60% 8%))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: `hsl(211 78% ${50 + Math.random() * 30}%)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6, 1, 0],
                scale: [0, 1.5, 1, 1.2, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
              }}
              transition={{ duration: 2.5, delay: p.delay, ease: "easeInOut" }}
            />
          ))}

          {/* Glowing center orb */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(211 78% 51% / 0.3) 0%, transparent 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Brand text */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={phase === "text" ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold glow-text text-foreground tracking-tight">
              It'z RJ
            </h1>
            <motion.p
              className="mt-4 text-muted-foreground text-lg tracking-widest uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Developer & Creator
            </motion.p>
          </motion.div>

          {/* Skip button */}
          <motion.button
            onClick={() => { setPhase("exit"); setTimeout(onComplete, 600); }}
            className="absolute bottom-8 right-8 text-muted-foreground/60 hover:text-foreground text-sm tracking-wide transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Skip Intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
