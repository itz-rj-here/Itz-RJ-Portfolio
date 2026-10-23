import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = usePortfolioData();
  const project = data.projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const [currentImg, setCurrentImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = project?.images?.length ? project.images : project ? [project.image] : [];
  const prevImg = useCallback(() => setCurrentImg((p) => (p - 1 + images.length) % images.length), [images.length]);
  const nextImg = useCallback(() => setCurrentImg((p) => (p + 1) % images.length), [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") prevImg();
      else if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prevImg, nextImg]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Project not found</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://itzrj.vercel.app";
  const seoTitle = project.seoTitle?.trim() || `${project.title} | It'z RJ's Portfolio`;
  const metaDescription = (project.seoDescription?.trim() || project.shortDescription).slice(
    0,
    160
  );
  const seoKeywords = (
    project.seoKeywords?.length ? project.seoKeywords : project.technologies
  ).join(", ");
  const canonicalUrl = `${origin}/project/${project.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.seoTitle?.trim() || project.title,
    headline: project.seoTitle?.trim() || project.title,
    description: metaDescription,
    image: project.image,
    url: canonicalUrl,
    keywords: seoKeywords,
    author: {
      "@type": "Person",
      name: data.about.fullName || "Md. Faiad Mahmud Adil",
      alternateName: "It'z RJ",
    },
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={project.image} />
        <meta property="og:image:alt" content={project.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={project.image} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Back nav */}
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </motion.button>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Project image gallery */}
          <div className="relative rounded-2xl glass-card overflow-hidden mb-10 group">
            <div
              className="w-full flex items-center justify-center cursor-pointer"
              style={{ aspectRatio: "16 / 9" }}
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={images[currentImg]}
                  alt={`${project.title} screenshot ${currentImg + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImg}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      aria-label={`Show image ${i + 1} of ${images.length}`}
                      aria-current={i === currentImg}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentImg ? "bg-primary w-5" : "bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImg ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">{project.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">{project.description}</p>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            <motion.div
              className="glass-card px-6 py-4 rounded-xl text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-display font-bold text-primary">{project.technologies.length}</p>
              <p className="text-muted-foreground text-xs mt-1">Technologies</p>
            </motion.div>
            <motion.div
              className="glass-card px-6 py-4 rounded-xl text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-display font-bold text-primary">{project.features.length}</p>
              <p className="text-muted-foreground text-xs mt-1">Key Features</p>
            </motion.div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-12">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Live Demo <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-border text-foreground flex items-center gap-2 hover:bg-secondary hover:border-primary/30 transition-all"
              >
                GitHub <GithubIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Technologies */}
          <motion.div
            className="mb-12 p-6 rounded-2xl border border-border bg-card/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">
              Technologies & Architecture
            </h2>
            <p className="text-sm text-primary font-medium leading-relaxed">
              {project.technologies.join(" · ")}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="border border-border bg-card/60 p-4 rounded-xl flex items-start gap-3"
                >
                  <span className="text-xs font-mono text-primary font-semibold tabular-nums mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-muted-foreground text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              src={images[currentImg]}
              alt="Full view"
              className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  aria-label="Previous image"
                  className="absolute left-6 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  aria-label="Next image"
                  className="absolute right-6 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
