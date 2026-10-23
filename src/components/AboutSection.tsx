import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data } = usePortfolioData();

  const { projects, certificates, skillCategories, about } = data;
  const aboutImages = about.aboutImages.length
    ? about.aboutImages
    : [{ src: "https://i.ibb.co.com/gMdpT7xc/pfp.png", alt: "Default profile image" }];

  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

  const [currentImage, setCurrentImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const safeIndex = currentImage < aboutImages.length ? currentImage : 0;

  const goToImage = useCallback((idx: number) => setCurrentImage(idx), []);
  const prevSlide = useCallback(
    () => setCurrentImage((prev) => (prev - 1 + aboutImages.length) % aboutImages.length),
    [aboutImages.length]
  );
  const nextSlide = useCallback(
    () => setCurrentImage((prev) => (prev + 1) % aboutImages.length),
    [aboutImages.length]
  );

  useEffect(() => {
    if (aboutImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % aboutImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [aboutImages.length]);

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl" ref={ref}>
        <div className="max-w-2xl mb-14">
          <motion.p
            className="text-primary text-xs md:text-sm font-semibold mb-2"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            01. Background & Story
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08 }}
          >
            About <span className="gradient-text">Me</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Profile image carousel */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="relative rounded-2xl border border-border bg-card/60 overflow-hidden h-full min-h-[340px] flex flex-col justify-between group">
              <div className="relative flex-1 min-h-[300px] overflow-hidden bg-gradient-to-br from-primary/15 via-secondary to-background flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    {imageErrors.has(safeIndex) ? (
                      <span className="text-7xl font-display font-bold gradient-text">RJ</span>
                    ) : (
                      <img
                        src={aboutImages[safeIndex].src}
                        alt={aboutImages[safeIndex].alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => {
                          setImageErrors((prev) => new Set(prev).add(safeIndex));
                        }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                {aboutImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous profile photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/75 border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next profile photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/75 border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground/90 font-medium truncate">
                    {aboutImages[safeIndex].alt}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">
                    {safeIndex + 1} / {aboutImages.length}
                  </span>
                </div>
              </div>

              {/* Carousel Thumbnail / Indicator Bar */}
              {aboutImages.length > 1 && (
                <div className="p-3 border-t border-border bg-card/90 flex items-center justify-center gap-2">
                  {aboutImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToImage(i)}
                      aria-label={`Show profile image ${i + 1}: ${img.alt}`}
                      aria-current={i === safeIndex}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === safeIndex
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/60 w-3"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bio card */}
          <motion.div
            className="lg:col-span-7 rounded-2xl border border-border bg-card/60 p-7 md:p-9 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-border/70">
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    {about.fullName}
                  </h3>
                  <p className="text-primary text-xs md:text-sm font-medium mt-0.5">
                    {about.subtitle}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {about.location || "Dhaka, Bangladesh"}
                </span>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
                {about.bioParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/70">
              <div>
                <p className="text-xl md:text-2xl font-display font-bold text-primary font-mono tabular-nums">
                  {projects.length}+
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Featured Projects</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-display font-bold text-primary font-mono tabular-nums">
                  {certificates.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Certificates Earned</p>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-display font-bold text-primary font-mono tabular-nums">
                  {totalSkills}+
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Technologies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
