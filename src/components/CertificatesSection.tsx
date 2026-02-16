import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { certificates } from "@/data/portfolio";
import { Award, X } from "lucide-react";

const CertificatesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="certificates" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8" ref={ref}>
        <motion.p
          className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          Achievements
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          My <span className="gradient-text">Certificates</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              className="glass-card rounded-2xl cursor-pointer hover:glow-border transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelected(cert.id)}
            >
              {/* Certificate thumbnail */}
              <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center overflow-hidden">
                {cert.image && cert.image !== "/placeholder.svg" ? (
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <Award className="w-10 h-10 text-primary/40" />
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display font-semibold text-foreground text-sm mb-1">{cert.title}</h3>
                <p className="text-muted-foreground text-xs">{cert.issuer} • {cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="glass-card rounded-2xl max-w-2xl w-full relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground bg-background/60 rounded-full p-1.5">
              <X className="w-5 h-5" />
            </button>
            {(() => {
              const cert = certificates.find((c) => c.id === selected);
              if (!cert) return null;
              return (
                <>
                  {/* Large certificate image */}
                  <div className="w-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4 md:p-8">
                    {cert.image && cert.image !== "/placeholder.svg" ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-auto max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Award className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">{cert.title}</h3>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    <p className="text-primary text-sm mt-1">{cert.date}</p>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default CertificatesSection;
