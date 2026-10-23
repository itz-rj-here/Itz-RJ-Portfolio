import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getSupabase, setCors } from "./_helpers.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { fileName, dataUrl } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string") {
      return res.status(400).json({ error: "Missing image dataUrl" });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image data format" });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
    };
    const ext = extMap[mimeType] || "png";
    const safeBase = (fileName || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .slice(0, 40);
    const uniqueName = `${safeBase}-${Date.now()}.${ext}`;

    const supabase = getSupabase();
    if (supabase) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(`uploads/${uniqueName}`, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(`uploads/${uniqueName}`);
        if (publicUrlData?.publicUrl) {
          return res.status(200).json({ url: publicUrlData.publicUrl });
        }
      }
    }

    return res.status(500).json({
      error: "Image upload requires Supabase Storage bucket 'portfolio' to be configured.",
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
}
