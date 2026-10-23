import { useState, useEffect } from "react";
import { AboutData, AboutImage } from "@/data/portfolio";
import { usePortfolioMutations } from "@/hooks/use-portfolio";
import { ImageInput } from "./ImageInput";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  LoaderCircle,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface AboutManagerProps {
  about: AboutData;
}

export const AboutManager = ({ about }: AboutManagerProps) => {
  const { updateAbout } = usePortfolioMutations();
  const [formState, setFormState] = useState<AboutData>(about);
  const [newImg, setNewImg] = useState<AboutImage>({ src: "", alt: "" });

  useEffect(() => {
    setFormState(about);
  }, [about]);

  const handleSave = async (nextAbout: AboutData) => {
    setFormState(nextAbout);
    try {
      await updateAbout.mutateAsync(nextAbout);
      toast.success("About section updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save About section");
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImg.src.trim()) {
      toast.error("Please provide an image URL or upload a file");
      return;
    }

    const added: AboutImage = {
      src: newImg.src.trim(),
      alt: newImg.alt.trim() || `Profile image ${formState.aboutImages.length + 1}`,
    };

    const nextAbout: AboutData = {
      ...formState,
      aboutImages: [...formState.aboutImages, added],
    };

    setNewImg({ src: "", alt: "" });
    await handleSave(nextAbout);
  };

  const handleRemoveImage = async (idx: number) => {
    if (formState.aboutImages.length <= 1) {
      toast.error("At least one profile image is required in the About carousel");
      return;
    }
    const nextAbout: AboutData = {
      ...formState,
      aboutImages: formState.aboutImages.filter((_, i) => i !== idx),
    };
    await handleSave(nextAbout);
  };

  const handleMoveImage = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formState.aboutImages.length) return;

    const reordered = [...formState.aboutImages];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);

    await handleSave({ ...formState, aboutImages: reordered });
  };

  const updateImageField = (idx: number, field: keyof AboutImage, value: string) => {
    const updated = [...formState.aboutImages];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormState({ ...formState, aboutImages: updated });
  };

  const updateParagraph = (idx: number, text: string) => {
    const updated = [...formState.bioParagraphs];
    updated[idx] = text;
    setFormState({ ...formState, bioParagraphs: updated });
  };

  const addParagraph = () => {
    setFormState({
      ...formState,
      bioParagraphs: [...formState.bioParagraphs, ""],
    });
  };

  const removeParagraph = (idx: number) => {
    if (formState.bioParagraphs.length <= 1) return;
    setFormState({
      ...formState,
      bioParagraphs: formState.bioParagraphs.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            About Section & Profile Images
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update your rotating profile photos in the About carousel and edit your bio text.
          </p>
        </div>
        <button
          type="button"
          disabled={updateAbout.isPending}
          onClick={() => handleSave(formState)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          {updateAbout.isPending ? (
            <>
              <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" /> Save All Changes
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Carousel Images Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              About Section Carousel Images ({formState.aboutImages.length})
            </h3>
          </div>

          {/* Existing Carousel Images */}
          <div className="space-y-3">
            {formState.aboutImages.map((img, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-card/50 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center">
                  <img
                    src={img.src}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary font-semibold tabular-nums">
                      Slide #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateImageField(idx, "alt", e.target.value)}
                      placeholder="Image caption / alt text"
                      className="flex-1 px-2.5 py-1 rounded-md bg-secondary border border-border text-xs text-foreground"
                    />
                  </div>
                  <ImageInput
                    label="Replace Image URL or Upload File"
                    value={img.src}
                    aspectRatio="1/1"
                    onChange={(newUrl) => updateImageField(idx, "src", newUrl)}
                  />
                </div>

                <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveImage(idx, "up")}
                    aria-label="Move slide up"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === formState.aboutImages.length - 1}
                    onClick={() => handleMoveImage(idx, "down")}
                    aria-label="Move slide down"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    aria-label="Remove profile image"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Profile Image Card */}
          <form
            onSubmit={handleAddImage}
            className="p-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-4"
          >
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">
              Add New Image to About Carousel
            </h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Caption / Alt Description
              </label>
              <input
                type="text"
                value={newImg.alt}
                onChange={(e) => setNewImg({ ...newImg, alt: e.target.value })}
                placeholder="e.g., At the university campus"
                className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
              />
            </div>
            <ImageInput
              label="Profile Photo (URL or Upload)"
              value={newImg.src}
              aspectRatio="1/1"
              onChange={(url) => setNewImg({ ...newImg, src: url })}
              placeholder="https://i.ibb.co.com/.../pfp.png"
            />
            <button
              type="submit"
              disabled={updateAbout.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> Add Photo to Carousel
            </button>
          </form>
        </div>

        {/* Bio Text & Profile Details Column */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Bio & Identity Details
          </h3>

          <div className="p-5 rounded-xl border border-border bg-card/50 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Full Display Name
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Handle / Subtitle
              </label>
              <input
                type="text"
                value={formState.subtitle}
                onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
              />
            </div>

            <div className="pt-2 border-t border-border/60 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Landing Hero Headline Statement
                </label>
                <input
                  type="text"
                  value={formState.heroHeadline || ""}
                  onChange={(e) => setFormState({ ...formState, heroHeadline: e.target.value })}
                  placeholder="Designing & engineering modern web experiences."
                  className="w-full px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Landing Hero Lead Summary
                </label>
                <textarea
                  rows={2}
                  value={formState.heroBio || ""}
                  onChange={(e) => setFormState({ ...formState, heroBio: e.target.value })}
                  placeholder="Short summary displayed on the landing hero section..."
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground leading-relaxed resize-y"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Bio Paragraphs ({formState.bioParagraphs.length})
                </label>
                <button
                  type="button"
                  onClick={addParagraph}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Paragraph
                </button>
              </div>

              {formState.bioParagraphs.map((para, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Paragraph {idx + 1}</span>
                    {formState.bioParagraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(idx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground leading-relaxed resize-y"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={updateAbout.isPending}
              onClick={() => handleSave(formState)}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90"
            >
              <Check className="w-4 h-4" /> Save Bio & Profile Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
