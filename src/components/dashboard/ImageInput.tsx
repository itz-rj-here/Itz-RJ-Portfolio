import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, LoaderCircle, Image as ImageIcon, X } from "lucide-react";
import { uploadImageFile } from "@/lib/supabase";
import { toast } from "sonner";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  placeholder?: string;
  aspectRatio?: "16/9" | "1/1" | "4/3";
}

export const ImageInput = ({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.png",
  aspectRatio = "16/9",
}: ImageInputProps) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image file must be under 15MB.");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      setImgError(false);
      onChange(uploadedUrl);
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex items-center gap-1 p-0.5 bg-secondary rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === "url"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Image URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === "upload"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setImgError(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 pr-9 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear image URL"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2.5 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-sm text-foreground flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin text-primary" />
                <span>Uploading image...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-primary" />
                <span>Choose Image from Device</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Live Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border bg-secondary/40 flex items-center justify-center max-h-44">
          {!imgError ? (
            <img
              src={value}
              alt="Preview"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className={`object-contain max-h-40 w-auto ${
                aspectRatio === "1/1" ? "aspect-square" : "aspect-video"
              }`}
            />
          ) : (
            <div className="py-6 px-4 text-center flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImageIcon className="w-6 h-6 text-primary/40" />
              <span className="text-xs">Image preview unavailable — verify URL</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
