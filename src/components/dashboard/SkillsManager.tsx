import { useState, useEffect } from "react";
import { SkillCategory } from "@/data/portfolio";
import { usePortfolioMutations } from "@/hooks/use-portfolio";
import { Plus, Trash2, Check, LoaderCircle, Cpu } from "lucide-react";
import { toast } from "sonner";

interface SkillsManagerProps {
  skillCategories: SkillCategory[];
}

export const SkillsManager = ({ skillCategories }: SkillsManagerProps) => {
  const { updateSkills } = usePortfolioMutations();
  const [categories, setCategories] = useState<SkillCategory[]>(skillCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, { name: string; level: number }>>({});

  useEffect(() => {
    setCategories(skillCategories);
  }, [skillCategories]);

  const handleSaveAll = async (nextCategories: SkillCategory[]) => {
    setCategories(nextCategories);
    try {
      await updateSkills.mutateAsync(nextCategories);
      toast.success("Skills updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update skills");
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists");
      return;
    }

    const next = [...categories, { name: trimmed, skills: [] }];
    setNewCategoryName("");
    await handleSaveAll(next);
  };

  const deleteCategory = async (idx: number) => {
    const next = categories.filter((_, i) => i !== idx);
    await handleSaveAll(next);
  };

  const updateCategoryName = (idx: number, name: string) => {
    const next = [...categories];
    next[idx] = { ...next[idx], name };
    setCategories(next);
  };

  const updateSkillLevel = (catIdx: number, skillIdx: number, level: number) => {
    const next = [...categories];
    const skills = [...next[catIdx].skills];
    skills[skillIdx] = { ...skills[skillIdx], level };
    next[catIdx] = { ...next[catIdx], skills };
    setCategories(next);
  };

  const updateSkillName = (catIdx: number, skillIdx: number, name: string) => {
    const next = [...categories];
    const skills = [...next[catIdx].skills];
    skills[skillIdx] = { ...skills[skillIdx], name };
    next[catIdx] = { ...next[catIdx], skills };
    setCategories(next);
  };

  const addSkillToCategory = async (catIdx: number) => {
    const draft = newSkillInputs[catIdx] || { name: "", level: 80 };
    if (!draft.name.trim()) {
      toast.error("Enter a skill name");
      return;
    }

    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      skills: [
        ...next[catIdx].skills,
        { name: draft.name.trim(), level: Math.min(100, Math.max(5, Number(draft.level) || 80)) },
      ],
    };

    setNewSkillInputs({ ...newSkillInputs, [catIdx]: { name: "", level: 80 } });
    await handleSaveAll(next);
  };

  const removeSkill = async (catIdx: number, skillIdx: number) => {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      skills: next[catIdx].skills.filter((_, i) => i !== skillIdx),
    };
    await handleSaveAll(next);
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Skills & Tech Stack</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage skill categories, add technologies, and fine-tune proficiency percentages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={addCategory} className="flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name..."
              className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </form>
          <button
            type="button"
            disabled={updateSkills.isPending}
            onClick={() => handleSaveAll(categories)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {updateSkills.isPending ? (
              <>
                <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="py-16 text-center border border-border rounded-xl bg-card/40">
          <Cpu className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No skill categories defined</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {categories.map((cat, catIdx) => {
            const draft = newSkillInputs[catIdx] || { name: "", level: 80 };
            return (
              <div
                key={catIdx}
                className="border border-border rounded-xl bg-card/50 p-5 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                      className="font-display font-semibold text-base text-foreground bg-transparent border-b border-transparent focus:border-primary focus:outline-none px-1 py-0.5 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => deleteCategory(catIdx)}
                      aria-label={`Delete ${cat.name} category`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {cat.skills.map((skill, skillIdx) => (
                      <div
                        key={skillIdx}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/60 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkillName(catIdx, skillIdx, e.target.value)}
                            className="bg-transparent text-xs font-medium text-foreground focus:outline-none border-b border-transparent focus:border-primary w-full"
                          />
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono text-primary font-semibold tabular-nums">
                              {skill.level}%
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSkill(catIdx, skillIdx)}
                              aria-label={`Remove ${skill.name}`}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={100}
                          step={5}
                          value={skill.level}
                          onChange={(e) =>
                            updateSkillLevel(catIdx, skillIdx, Number(e.target.value))
                          }
                          className="w-full accent-primary h-1.5 bg-secondary rounded-lg cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Skill to Category */}
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Add Skill to {cat.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Skill name..."
                      value={draft.name}
                      onChange={(e) =>
                        setNewSkillInputs({
                          ...newSkillInputs,
                          [catIdx]: { ...draft, name: e.target.value },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkillToCategory(catIdx);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground"
                    />
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={draft.level}
                      onChange={(e) =>
                        setNewSkillInputs({
                          ...newSkillInputs,
                          [catIdx]: { ...draft, level: Number(e.target.value) },
                        })
                      }
                      className="w-16 px-2 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground font-mono tabular-nums text-center"
                    />
                    <button
                      type="button"
                      onClick={() => addSkillToCategory(catIdx)}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                      aria-label="Add skill"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
