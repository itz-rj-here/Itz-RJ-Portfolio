import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const aboutImages = [
  { src: "https://i.ibb.co.com/gMdpT7xc/pfp.png", alt: "Default profile image" },
  { src: "https://i.ibb.co.com/fVwCzWCK/pfp2.png", alt: "Real profile image" },
  { src: "https://i.ibb.co.com/Q7WxxM2F/pfp3.png", alt: "At the DU" },
  { src: "https://i.ibb.co.com/TMjGtdqj/pfp4.png", alt: "At a tour" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % aboutImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8" ref={ref}>
        <motion.p
          className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Get to know me
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          About <span className="gradient-text">Me</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Profile image carousel */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden glow-border relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <img
                      src={aboutImages[currentImage].src}
                      alt={aboutImages[currentImage].alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.innerHTML =
                          '<span class="text-7xl font-display font-bold gradient-text">RJ</span>';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Image indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {aboutImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentImage
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 -z-10 blur-sm" />
            </div>
          </motion.div>

          {/* Bio card */}
          <motion.div
            className="glass-card p-8 rounded-2xl"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-display font-semibold mb-1 text-foreground">
              Md. Faiad Mahmud Adil
            </h3>
            <p className="text-primary text-sm mb-5 font-medium">aka It'z RJ</p>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                I'm a passionate student developer on a mission to build clean, impactful digital experiences. My journey into programming started with curiosity and quickly grew into a deep love for creating things that people actually use.
              </p>
              <p>
                With a focus on frontend development and a growing interest in full-stack technologies, I bring together design sensibility and technical skills to craft modern web applications.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, and constantly pushing my boundaries as a developer.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
