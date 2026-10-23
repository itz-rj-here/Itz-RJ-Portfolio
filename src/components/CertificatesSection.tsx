import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { Award, X, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const INITIAL_VISIBLE = 8;

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeIssuer, setActiveIssuer] = useState<string>("All");
  const [failedCerts, setFailedCerts] = useState<Set<string>>(new Set());

  const { data } = usePortfolioData();
  const { certificates } = data;

  const issuers = ["All", ...Array.from(new Set(certificates.map((c) => c.issuer.trim())))];

  const filteredCerts =
    activeIssuer === "All"
      ? certificates
      : certificates.filter((c) => c.issuer.toLowerCase() === activeIssuer.toLowerCase());

  const visibleCerts = showAll ? filteredCerts : filteredCerts.slice(0, INITIAL_VISIBLE);
  const hasMore = filteredCerts.length > INITIAL_VISIBLE;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="certificates" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.p
              className="text-primary text-xs md:text-sm font-semibold mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
            >
              04. Verified Credentials ({certificates.length})
            </motion.p>
            <motion.h2
              className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 }}
            >
              My <span className="gradient-text">Certificates</span>
            </motion.h2>
          </div>

          {/* Interactive Issuer Filter Controls */}
          {issuers.length > 2 && (
            <div className="flex items-center gap-1 p-1 bg-secondary/70 border border-border rounded-xl overflow-x-auto">
              {issuers.map((issuer) => {
                const isActive = activeIssuer === issuer;
                return (
                  <button
                    key={issuer}
                    type="button"
                    onClick={() => {
                      setActiveIssuer(issuer);
                      setShowAll(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {issuer}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {visibleCerts.map((cert, i) => {
              const hasFailed = failedCerts.has(cert.id);
              return (
                <motion.div
                  key={cert.id}
                  className="rounded-2xl border border-border bg-card/60 cursor-pointer hover:border-primary/40 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    delay: i < INITIAL_VISIBLE ? 0.05 * i : 0.03 * (i - INITIAL_VISIBLE),
                  }}
                  onClick={() => setSelected(cert.id)}
                >
                  {/* Certificate thumbnail */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-secondary to-background flex items-center justify-center overflow-hidden relative">
                    {cert.image && cert.image !== "/placeholder.svg" && !hasFailed ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => {
                          setFailedCerts((prev) => new Set(prev).add(cert.id));
                        }}
                      />
                    ) : (
                      <Award className="w-10 h-10 text-primary/40" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      <span>{cert.issuer}</span>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-mono tabular-nums">{cert.date}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show More / Less toggle */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="group flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-secondary/40 text-xs font-semibold text-foreground hover:border-primary/40 transition-colors whitespace-nowrap shrink-0"
            >
              {showAll ? (
                <>
                  Show Fewer Certificates{" "}
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Show All {filteredCerts.length} Certificates{" "}
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="border border-border bg-card rounded-2xl max-w-2xl w-full relative overflow-hidden shadow-2xl"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close certificate preview"
                className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground bg-background/80 border border-border rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {(() => {
                const cert = certificates.find((c) => c.id === selected);
                if (!cert) return null;
                return (
                  <>
                    <div className="w-full bg-secondary/40 flex items-center justify-center p-4 md:p-8">
                      {cert.image && cert.image !== "/placeholder.svg" && !failedCerts.has(cert.id) ? (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          referrerPolicy="no-referrer"
                          className="w-auto max-w-full max-h-[65vh] object-contain rounded-xl shadow-lg"
                        />
                      ) : (
                        <div className="text-center py-12">
                          <Award className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                          <p className="text-muted-foreground text-sm">Certificate preview</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {cert.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span>Issued by {cert.issuer}</span>
                          <span className="mx-1.5">·</span>
                          <span className="font-mono tabular-nums">{cert.date}</span>
                        </p>
                      </div>
                      {cert.issuerUrl && (
                        <a
                          href={cert.issuerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 whitespace-nowrap shrink-0 self-start sm:self-auto"
                        >
                          Verify Issuer <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;
