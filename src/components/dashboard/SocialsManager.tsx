import { useState, useEffect } from "react";
import { SocialLink } from "@/data/portfolio";
import { usePortfolioMutations } from "@/hooks/use-portfolio";
import { Plus, Trash2, Check, LoaderCircle, Share2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface SocialsManagerProps {
  socialLinks: SocialLink[];
  location: string;
}

const ICON_OPTIONS = ["Github", "Linkedin", "Facebook", "Instagram", "Discord", "Mail"];

export const SocialsManager = ({ socialLinks, location }: SocialsManagerProps) => {
  const { updateSocials } = usePortfolioMutations();
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [loc, setLoc] = useState(location || "Dhaka, Bangladesh");
  const [newLink, setNewLink] = useState<SocialLink>({
    name: "",
    url: "",
    icon: "Github",
  });

  useEffect(() => {
    setLinks(socialLinks);
    setLoc(location || "Dhaka, Bangladesh");
  }, [socialLinks, location]);

  const handleSave = async (nextLinks: SocialLink[], nextLocation: string) => {
    setLinks(nextLinks);
    setLoc(nextLocation);
    try {
      await updateSocials.mutateAsync({ socialLinks: nextLinks, location: nextLocation });
      toast.success("Contact & social links updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update social links");
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name.trim() || !newLink.url.trim()) {
      toast.error("Platform name and URL are required");
      return;
    }

    const next = [
      ...links,
      {
        id: `social-${Date.now()}`,
        name: newLink.name.trim(),
        url: newLink.url.trim(),
        icon: newLink.icon,
      },
    ];
    setNewLink({ name: "", url: "", icon: "Github" });
    await handleSave(next, loc);
  };

  const handleRemove = async (idx: number) => {
    const next = links.filter((_, i) => i !== idx);
    await handleSave(next, loc);
  };

  const updateField = (idx: number, field: keyof SocialLink, value: string) => {
    const next = [...links];
    next[idx] = { ...next[idx], [field]: value };
    setLinks(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            Social Links & Contact Info
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage social media profiles, email address, and location shown in the Contact section.
          </p>
        </div>
        <button
          type="button"
          disabled={updateSocials.isPending}
          onClick={() => handleSave(links, loc)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          {updateSocials.isPending ? (
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

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Social Links List */}
        <div className="lg:col-span-8 space-y-3">
          {links.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-border bg-card/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <select
                value={item.icon}
                onChange={(e) => updateField(idx, "icon", e.target.value)}
                className="px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon} Icon
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={item.name}
                onChange={(e) => updateField(idx, "name", e.target.value)}
                placeholder="Platform Name"
                className="sm:w-36 px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              />

              <input
                type="text"
                value={item.url}
                onChange={(e) => updateField(idx, "url", e.target.value)}
                placeholder="https://... or mailto:..."
                className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              />

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label={`Remove ${item.name}`}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive self-end sm:self-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Location & Add New Social */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl border border-border bg-card/50 space-y-3">
            <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Contact Location
            </h3>
            <input
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="Dhaka, Bangladesh"
              className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
            />
            <button
              type="button"
              onClick={() => handleSave(links, loc)}
              className="w-full py-2 rounded-lg bg-secondary border border-border text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Update Location
            </button>
          </div>

          <form
            onSubmit={handleAddLink}
            className="p-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-3"
          >
            <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" /> Add Social Link
            </h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Platform Name</label>
              <input
                type="text"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                placeholder="e.g., GitHub"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Icon</label>
              <select
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Profile URL</label>
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90"
            >
              <Plus className="w-3.5 h-3.5" /> Add Social Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
