import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { ArrowRight, ExternalLink, FolderGit2 } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const { data } = usePortfolioData();
  const { projects } = data;
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Extract top recurring technologies for interactive filtering
  const topTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies.map((t) => t.trim())))
  ).slice(0, 5);
  const filterTabs = ["All", ...topTechs];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) =>
          p.technologies.some((t) => t.toLowerCase() === activeFilter.toLowerCase())
        );

  return (
    <section id="portfolio" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl" ref={ref}>
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <motion.p
              className="text-primary text-xs md:text-sm font-semibold mb-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
            >
              02. Selected Works & Case Studies
            </motion.p>
            <motion.h2
              className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 }}
            >
              Featured <span className="gradient-text">Projects</span>
            </motion.h2>
          </div>

          {/* Interactive Filter Tabs */}
          {filterTabs.length > 1 && (
            <div className="flex items-center gap-1 p-1 bg-secondary/70 border border-border rounded-xl overflow-x-auto">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bento Showcase Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {filteredProjects.map((project, i) => {
            const isSpotlight = i === 0 && activeFilter === "All";
            const hasFailed = failedImages.has(project.id);

            return (
              <motion.article
                key={project.id}
                className={`group rounded-2xl border border-border bg-card/60 overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-200 flex flex-col justify-between ${
                  isSpotlight ? "md:col-span-12 lg:grid lg:grid-cols-12" : "md:col-span-6"
                }`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                {/* Project Visual Container */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br from-primary/15 via-secondary to-background flex items-center justify-center ${
                    isSpotlight ? "lg:col-span-7 aspect-video lg:aspect-auto lg:min-h-[340px]" : "aspect-video"
                  }`}
                >
                  {project.image && !hasFailed ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={() => {
                        setFailedImages((prev) => new Set(prev).add(project.id));
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                      <FolderGit2 className="w-10 h-10 text-primary/50" />
                      <span className="text-sm font-display font-semibold text-foreground/80">
                        {project.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Project Details Container */}
                <div
                  className={`p-6 md:p-8 flex flex-col justify-between ${
                    isSpotlight ? "lg:col-span-5" : "flex-1"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Clean unboxed metadata with typographic separators */}
                    <p className="text-xs text-muted-foreground font-medium">
                      <span className="text-primary font-mono tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mx-2" aria-hidden="true">
                        ·
                      </span>
                      <span>{project.technologies.slice(0, 4).join(" · ")}</span>
                      {project.technologies.length > 4 && (
                        <span> · +{project.technologies.length - 4} more</span>
                      )}
                    </p>

                    <h3
                      className={`font-display font-bold text-foreground group-hover:text-primary transition-colors ${
                        isSpotlight ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p
                      className={`text-muted-foreground text-sm leading-relaxed ${
                        isSpotlight ? "line-clamp-4" : "line-clamp-2"
                      }`}
                    >
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                      Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                          className="p-2 rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} Live Demo`}
                          className="p-2 rounded-lg border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
