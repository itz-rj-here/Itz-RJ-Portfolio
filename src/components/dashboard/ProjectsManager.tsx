import { useState } from "react";
import { Project } from "@/data/portfolio";
import { usePortfolioMutations } from "@/hooks/use-portfolio";
import { ImageInput } from "./ImageInput";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  X,
  Check,
  LoaderCircle,
  FolderGit2,
} from "lucide-react";
import { toast } from "sonner";

interface ProjectsManagerProps {
  projects: Project[];
}

const emptyProject: Project = {
  id: "",
  title: "",
  shortDescription: "",
  description: "",
  image: "",
  images: [],
  technologies: [],
  features: [],
  liveUrl: "",
  githubUrl: "",
};

export const ProjectsManager = ({ projects }: ProjectsManagerProps) => {
  const { updateProjects } = usePortfolioMutations();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [extraImageInput, setExtraImageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openCreateModal = () => {
    setIsNew(true);
    setEditingProject({
      ...emptyProject,
      id: `project-${Date.now()}`,
    });
    setTechInput("");
    setFeatureInput("");
    setExtraImageInput("");
  };

  const openEditModal = (project: Project) => {
    setIsNew(false);
    setEditingProject({
      ...project,
      images: project.images?.length ? [...project.images] : project.image ? [project.image] : [],
      technologies: [...project.technologies],
      features: [...project.features],
    });
    setTechInput("");
    setFeatureInput("");
    setExtraImageInput("");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    if (!editingProject.shortDescription.trim()) {
      toast.error("Short description is required");
      return;
    }

    const coverImage = editingProject.image.trim() || editingProject.images?.[0] || "/placeholder.svg";
    const galleryImages =
      editingProject.images && editingProject.images.length > 0
        ? editingProject.images
        : [coverImage];

    const normalized: Project = {
      ...editingProject,
      title: editingProject.title.trim(),
      shortDescription: editingProject.shortDescription.trim(),
      description: editingProject.description.trim() || editingProject.shortDescription.trim(),
      image: coverImage,
      images: galleryImages,
      liveUrl: editingProject.liveUrl?.trim() || undefined,
      githubUrl: editingProject.githubUrl?.trim() || undefined,
      seoTitle: editingProject.seoTitle?.trim() || undefined,
      seoDescription: editingProject.seoDescription?.trim() || undefined,
    };

    const nextList = isNew
      ? [normalized, ...projects]
      : projects.map((p) => (p.id === normalized.id ? normalized : p));

    try {
      await updateProjects.mutateAsync(nextList);
      toast.success(isNew ? "Project added to portfolio" : "Project updated");
      setEditingProject(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const nextList = projects.filter((p) => p.id !== id);
    try {
      await updateProjects.mutateAsync(nextList);
      toast.success(`Removed "${title}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    try {
      await updateProjects.mutateAsync(reordered);
      toast.success("Project order updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reorder projects");
    }
  };

  const addTech = () => {
    if (!editingProject || !techInput.trim()) return;
    if (!editingProject.technologies.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((t) => t !== tech),
    });
  };

  const addFeature = () => {
    if (!editingProject || !featureInput.trim()) return;
    setEditingProject({
      ...editingProject,
      features: [...editingProject.features, featureInput.trim()],
    });
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      features: editingProject.features.filter((_, i) => i !== idx),
    });
  };

  const addExtraImage = (url: string) => {
    if (!editingProject || !url.trim()) return;
    const current = editingProject.images || [];
    setEditingProject({
      ...editingProject,
      images: [...current, url.trim()],
    });
    setExtraImageInput("");
  };

  const removeExtraImage = (idx: number) => {
    if (!editingProject) return;
    const current = editingProject.images || [];
    setEditingProject({
      ...editingProject,
      images: current.filter((_, i) => i !== idx),
    });
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Featured Projects</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, edit, reorder, or remove portfolio projects and gallery screenshots.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44 sm:w-56"
          />
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Table / List */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center border border-border rounded-xl bg-card/40">
          <FolderGit2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Add your first project to showcase it on your portfolio.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add First Project
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-xl bg-card/40 overflow-hidden">
          {filteredProjects.map((project) => {
            const actualIndex = projects.findIndex((p) => p.id === project.id);
            return (
              <div
                key={project.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-20 h-12 rounded-lg overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <FolderGit2 className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        #{actualIndex + 1}
                      </span>
                      <h3 className="font-display font-semibold text-sm text-foreground truncate">
                        {project.title}
                      </h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Open Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {project.shortDescription}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 mt-1">
                      {project.technologies.join(" · ")}
                      {project.features.length > 0 && ` · ${project.features.length} features`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={actualIndex === 0 || updateProjects.isPending}
                    onClick={() => handleMove(actualIndex, "up")}
                    aria-label="Move project up"
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={actualIndex === projects.length - 1 || updateProjects.isPending}
                    onClick={() => handleMove(actualIndex, "down")}
                    aria-label="Move project down"
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.title)}
                    aria-label={`Delete ${project.title}`}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Editor */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-display font-bold text-foreground">
                {isNew ? "Add New Project" : `Edit Project: ${editingProject.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    placeholder="e.g., MYNT: Material You New Tab"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Short Summary (Card Preview) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.shortDescription}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, shortDescription: e.target.value })
                    }
                    placeholder="Concise 1-2 sentence overview for the project card"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Full Detailed Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    placeholder="Detailed explanation shown on the project detail page..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <ImageInput
                label="Primary Cover Image *"
                value={editingProject.image}
                onChange={(newUrl) => {
                  const updatedImages = editingProject.images?.length
                    ? [newUrl, ...editingProject.images.slice(1)]
                    : [newUrl];
                  setEditingProject({
                    ...editingProject,
                    image: newUrl,
                    images: updatedImages,
                  });
                }}
              />

              {/* Additional Gallery Screenshots */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <label className="text-xs font-medium text-muted-foreground block">
                  Additional Gallery Screenshots ({editingProject.images?.length || 0})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={extraImageInput}
                    onChange={(e) => setExtraImageInput(e.target.value)}
                    placeholder="Paste additional screenshot URL..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => addExtraImage(extraImageInput)}
                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap shrink-0"
                  >
                    Add URL
                  </button>
                </div>
                {editingProject.images && editingProject.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {editingProject.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group w-20 h-14 rounded-lg overflow-hidden border border-border bg-secondary"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(idx)}
                          className="absolute top-1 right-1 bg-background/80 text-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <label className="text-xs font-medium text-muted-foreground block">
                  Technologies Used
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="e.g., React, TypeScript, Tailwind CSS (Press Enter)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap shrink-0"
                  >
                    Add Tech
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editingProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-foreground"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <label className="text-xs font-medium text-muted-foreground block">
                  Key Features ({editingProject.features.length})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="e.g., Responsive dark/light theme support (Press Enter)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap shrink-0"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {editingProject.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/60 text-xs text-foreground"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-muted-foreground hover:text-destructive ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional SEO & Social Card Metadata */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <label className="text-xs font-medium text-muted-foreground block">
                  SEO & Social Sharing Metadata (Optional — auto-falls back to Title & Short Summary)
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={editingProject.seoTitle || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, seoTitle: e.target.value })
                      }
                      placeholder="Custom SEO Title (30-60 chars)"
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={editingProject.seoDescription || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          seoDescription: e.target.value,
                        })
                      }
                      placeholder="Custom Social Card Description (120-160 chars)"
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProjects.isPending}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateProjects.isPending ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Save Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
