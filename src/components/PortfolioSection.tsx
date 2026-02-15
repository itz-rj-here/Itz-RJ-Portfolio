import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/portfolio";
import { ArrowRight } from "lucide-react";

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <section id="portfolio" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8" ref={ref}>
        <motion.p
          className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          My recent work
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Featured <span className="gradient-text">Projects</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer hover:glow-border transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative overflow-hidden">
                <span className="text-4xl font-display font-bold text-muted-foreground/20">{project.title.charAt(0)}</span>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
