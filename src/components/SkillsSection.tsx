import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio";

const SkillsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data } = usePortfolioData();
  const { skillCategories } = data;

  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl" ref={ref}>
        <div className="max-w-2xl mb-14">
          <motion.p
            className="text-primary text-xs md:text-sm font-semibold mb-2"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            03. Engineering Capabilities
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08 }}
          >
            Skills & <span className="gradient-text">Tech Stack</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.name}
              className="rounded-2xl border border-border bg-card/60 p-6 md:p-7 flex flex-col justify-between"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + catIdx * 0.1 }}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/70">
                  <h3 className="text-lg font-display font-bold text-foreground">
                    {category.name}
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground tabular-nums">
                    {category.skills.length} skills
                  </span>
                </div>

                {/* Clean Tabular Skill Proficiency Rows */}
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{skill.name}</span>
                        <span className="font-mono font-semibold text-primary tabular-nums">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-700 ease-out origin-left"
                          style={{
                            transform: `scaleX(${inView ? skill.level / 100 : 0})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean unboxed summary footer */}
              <p className="mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                {category.skills.map((s) => s.name).join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
