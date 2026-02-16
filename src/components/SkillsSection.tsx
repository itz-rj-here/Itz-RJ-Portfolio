import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skillCategories } from "@/data/portfolio";

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8" ref={ref}>
        <motion.p
          className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          What I work with
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          Skills & <span className="gradient-text">Tech Stack</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.name}
              className="glass-card p-6 rounded-2xl hover:glow-border transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + catIdx * 0.15 }}
            >
              <h3 className="text-lg font-display font-semibold text-foreground mb-6">{category.name}</h3>
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill, skillIdx) => (
                  <motion.span
                    key={skill.name}
                    className="px-4 py-2 rounded-xl bg-secondary border border-border text-sm text-muted-foreground cursor-default select-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + catIdx * 0.1 + skillIdx * 0.05 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "hsl(211 78% 51% / 0.15)",
                      borderColor: "hsl(211 78% 51% / 0.4)",
                      color: "hsl(207 90% 68%)",
                      boxShadow: "0 0 20px hsl(211 78% 51% / 0.2)",
                    }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
