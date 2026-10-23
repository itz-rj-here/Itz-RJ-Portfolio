import { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { Certificate } from "@/data/portfolio";
import { usePortfolioMutations } from "@/hooks/use-portfolio";
import { ImageInput } from "./ImageInput";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Award,
  ExternalLink,
  X,
  Check,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CertificatesManagerProps {
  certificates: Certificate[];
}

const emptyCert: Certificate = {
  id: "",
  title: "",
  issuer: "",
  issuerUrl: "",
  date: new Date().getFullYear().toString(),
  image: "",
};

export const CertificatesManager = ({ certificates }: CertificatesManagerProps) => {
  const { updateCertificates } = usePortfolioMutations();
  const [localCerts, setLocalCerts] = useState<Certificate[]>(certificates);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLocalCerts(certificates);
    setHasUnsavedOrder(false);
  }, [certificates]);

  const openCreateModal = () => {
    setIsNew(true);
    setEditingCert({
      ...emptyCert,
      id: `cert-${Date.now()}`,
    });
  };

  const openEditModal = (cert: Certificate) => {
    setIsNew(false);
    setEditingCert({ ...cert });
  };

  const persistOrder = async (nextList: Certificate[], successMessage = "Certificate order saved") => {
    setLocalCerts(nextList);
    setHasUnsavedOrder(false);
    try {
      await updateCertificates.mutateAsync(nextList);
      toast.success(successMessage);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save certificate order");
    }
  };

  const handleDragReorder = (newOrder: Certificate[]) => {
    setLocalCerts(newOrder);
    setHasUnsavedOrder(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (!editingCert.title.trim() || !editingCert.issuer.trim()) {
      toast.error("Certificate title and issuer are required");
      return;
    }

    const normalized: Certificate = {
      ...editingCert,
      title: editingCert.title.trim(),
      issuer: editingCert.issuer.trim(),
      issuerUrl: editingCert.issuerUrl?.trim() || undefined,
      date: editingCert.date.trim() || new Date().getFullYear().toString(),
      image: editingCert.image.trim() || "/placeholder.svg",
    };

    const nextList = isNew
      ? [normalized, ...localCerts]
      : localCerts.map((c) => (c.id === normalized.id ? normalized : c));

    try {
      await updateCertificates.mutateAsync(nextList);
      setLocalCerts(nextList);
      setHasUnsavedOrder(false);
      toast.success(isNew ? "Certificate added" : "Certificate updated");
      setEditingCert(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save certificate");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const nextList = localCerts.filter((c) => c.id !== id);
    try {
      await updateCertificates.mutateAsync(nextList);
      setLocalCerts(nextList);
      toast.success(`Removed "${title}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete certificate");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= localCerts.length) return;

    const reordered = [...localCerts];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    await persistOrder(reordered, "Certificate order updated");
  };

  const isFiltering = searchQuery.trim().length > 0;
  const filteredCerts = localCerts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Certificates & Awards</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drag and drop any certificate row by its handle to reorder, or add and edit credentials.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Filter certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44 sm:w-52"
          />
          {hasUnsavedOrder && (
            <button
              type="button"
              disabled={updateCertificates.isPending}
              onClick={() => persistOrder(localCerts, "New drag order saved to Supabase")}
              className="px-3.5 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              {updateCertificates.isPending ? (
                <>
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving Order...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" /> Save Drag Order
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>
      </div>

      {/* Certificates List with Drag & Drop Reorder */}
      {filteredCerts.length === 0 ? (
        <div className="py-16 text-center border border-border rounded-xl bg-card/40">
          <Award className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No certificates found</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Add your first certificate to display it in your achievements section.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>
      ) : isFiltering ? (
        /* Filtered View (Drag disabled while search filter is active) */
        <div className="divide-y divide-border border border-border rounded-xl bg-card/40 overflow-hidden">
          {filteredCerts.map((cert) => {
            const actualIndex = localCerts.findIndex((c) => c.id === cert.id);
            return (
              <div
                key={cert.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-11 rounded-lg overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center">
                    {cert.image && cert.image !== "/placeholder.svg" ? (
                      <img
                        src={cert.image}
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Award className="w-5 h-5 text-primary/40" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        #{actualIndex + 1}
                      </span>
                      <h3 className="font-display font-semibold text-sm text-foreground truncate">
                        {cert.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{cert.issuer}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{cert.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(cert)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cert.id, cert.title)}
                    aria-label={`Delete ${cert.title}`}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Interactive Drag-and-Drop Reorder List */
        <Reorder.Group
          axis="y"
          values={localCerts}
          onReorder={handleDragReorder}
          className="divide-y divide-border border border-border rounded-xl bg-card/40 overflow-hidden"
        >
          {localCerts.map((cert, index) => (
            <Reorder.Item
              key={cert.id}
              value={cert}
              onDragEnd={() => {
                persistOrder(localCerts, "Certificate order updated");
              }}
              whileDrag={{
                scale: 1.01,
                backgroundColor: "hsl(var(--secondary))",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
              }}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 hover:bg-secondary/30 transition-colors cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag Handle */}
                <div
                  className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-secondary/60 cursor-grab active:cursor-grabbing shrink-0"
                  title="Drag to reorder certificate"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-11 rounded-lg overflow-hidden bg-secondary border border-border shrink-0 flex items-center justify-center pointer-events-none">
                  {cert.image && cert.image !== "/placeholder.svg" ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Award className="w-5 h-5 text-primary/40" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary font-semibold tabular-nums">
                      #{index + 1}
                    </span>
                    <h3 className="font-display font-semibold text-sm text-foreground truncate">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{cert.issuer}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{cert.date}</span>
                    {cert.issuerUrl && (
                      <>
                        <span>·</span>
                        <a
                          href={cert.issuerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onPointerDown={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={index === 0 || updateCertificates.isPending}
                  onClick={() => handleMove(index, "up")}
                  aria-label="Move certificate up"
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === localCerts.length - 1 || updateCertificates.isPending}
                  onClick={() => handleMove(index, "down")}
                  aria-label="Move certificate down"
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(cert)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert.id, cert.title)}
                  aria-label={`Delete ${cert.title}`}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Certificate Modal Editor */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-display font-bold text-foreground">
                {isNew ? "Add New Certificate" : "Edit Certificate"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="e.g., Introduction to LLMs"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g., Sololearn"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Year / Date Earned *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    placeholder="e.g., 2026"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Issuer Website / Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingCert.issuerUrl || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issuerUrl: e.target.value })}
                  placeholder="https://www.sololearn.com/"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <ImageInput
                label="Certificate Image *"
                value={editingCert.image}
                onChange={(newUrl) => setEditingCert({ ...editingCert, image: newUrl })}
                placeholder="https://i.ibb.co.com/.../cert.png"
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCertificates.isPending}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateCertificates.isPending ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Save Certificate
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
