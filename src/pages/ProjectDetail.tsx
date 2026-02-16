import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Project not found</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Back nav */}
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </motion.button>

        {/* Hero */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Project image */}
          <div className="h-64 md:h-80 rounded-2xl glass-card overflow-hidden mb-10 flex items-center justify-center">
            <span className="text-8xl font-display font-bold text-muted-foreground/10">{project.title.charAt(0)}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">{project.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">{project.description}</p>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            <div className="glass-card px-6 py-4 rounded-xl text-center">
              <p className="text-2xl font-display font-bold text-primary">{project.technologies.length}</p>
              <p className="text-muted-foreground text-xs mt-1">Technologies</p>
            </div>
            <div className="glass-card px-6 py-4 rounded-xl text-center">
              <p className="text-2xl font-display font-bold text-primary">{project.features.length}</p>
              <p className="text-muted-foreground text-xs mt-1">Key Features</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-12">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Live Demo <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="px-6 py-3 rounded-lg border border-border text-foreground flex items-center gap-2 hover:bg-secondary transition-colors"
              >
                GitHub <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Technologies */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 cursor-default"
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: "hsl(211 78% 51% / 0.25)",
                    boxShadow: "0 0 20px hsl(211 78% 51% / 0.3)",
                    borderColor: "hsl(211 78% 51% / 0.5)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
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
                <div key={i} className="glass-card p-4 rounded-xl flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-muted-foreground text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
