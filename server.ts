import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  defaultPortfolioData,
  PortfolioData,
  Project,
  Certificate,
  SkillCategory,
  AboutData,
  SocialLink,
} from "./src/data/portfolio.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));

// Local cache & static uploads directory
const DATA_DIR = path.resolve(process.cwd(), "data");
const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");
const STORE_PATH = path.join(DATA_DIR, "portfolio-store.json");

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Ignore on read-only serverless filesystems (e.g., Vercel)
}

// Serve uploaded images statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.warn("Supabase client initialization error:", e);
  }
}

/**
 * Creates a request-scoped Supabase client carrying the user's Bearer JWT
 * so Row Level Security (RLS) policies for `authenticated` users succeed.
 */
function getScopedSupabase(token?: string): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!token) return supabase;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

// Portfolio Data Store with Supabase + Local JSON Sync
async function getPortfolioData(token?: string): Promise<PortfolioData> {
  const client = getScopedSupabase(token);
  if (client) {
    try {
      const { data, error } = await client
        .from("portfolio_content")
        .select("payload")
        .eq("id", "main")
        .maybeSingle();
      if (!error && data && data.payload) {
        const remoteData = data.payload as PortfolioData;
        try {
          fs.writeFileSync(STORE_PATH, JSON.stringify(remoteData, null, 2), "utf-8");
        } catch {
          // Ignore on read-only filesystem
        }
        return remoteData;
      }
    } catch {
      // Fallback to local store if table is not created yet
    }
  }

  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as PortfolioData;
      return {
        projects: parsed.projects || defaultPortfolioData.projects,
        certificates: parsed.certificates || defaultPortfolioData.certificates,
        skillCategories: parsed.skillCategories || defaultPortfolioData.skillCategories,
        about: parsed.about || defaultPortfolioData.about,
        socialLinks: parsed.socialLinks || defaultPortfolioData.socialLinks,
      };
    }
  } catch {
    // Fallback to default seed
  }

  // Pre-seed with default portfolio items on first load
  await savePortfolioData(defaultPortfolioData, token);
  return JSON.parse(JSON.stringify(defaultPortfolioData));
}

async function savePortfolioData(data: PortfolioData, token?: string): Promise<void> {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore on read-only serverless filesystem
  }

  const client = getScopedSupabase(token);
  if (client) {
    try {
      const { error } = await client
        .from("portfolio_content")
        .upsert(
          { id: "main", payload: data, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );
      if (error) {
        console.warn("Supabase upsert warning:", error.message);
      }
    } catch (e) {
      console.warn("Supabase save error:", e);
    }
  }
}

interface AuthenticatedRequest extends Request {
  supabaseToken?: string;
}

// Supabase Authentication Middleware
async function requireSupabaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!supabase) {
    res.status(503).json({
      error: "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing Supabase access token" });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired Supabase session" });
      return;
    }
    req.supabaseToken = token;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized: Failed to verify Supabase token" });
  }
}

// ---------------------------------------------------------------------------
// Portfolio Content & Upload API Endpoints
// ---------------------------------------------------------------------------

// GET full portfolio data (Public)
app.get("/api/portfolio", async (_req: Request, res: Response) => {
  try {
    const data = await getPortfolioData();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    res.json(defaultPortfolioData);
  }
});

// PUT full portfolio data (Supabase Authenticated)
app.put("/api/portfolio", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { portfolio } = req.body as { portfolio: PortfolioData };
    if (!portfolio || typeof portfolio !== "object") {
      res.status(400).json({ error: "Invalid portfolio payload" });
      return;
    }
    await savePortfolioData(portfolio, req.supabaseToken);
    res.json({ portfolio });
  } catch (error) {
    console.error("Error saving full portfolio:", error);
    res.status(500).json({ error: "Failed to save portfolio data" });
  }
});

// POST image upload (Supabase Authenticated)
app.post("/api/upload", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileName, dataUrl } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string") {
      res.status(400).json({ error: "Missing image dataUrl" });
      return;
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: "Invalid image data format" });
      return;
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

    // Upload to Supabase Storage bucket 'portfolio' using the user's authenticated token
    const client = getScopedSupabase(req.supabaseToken);
    if (client) {
      try {
        const { data: uploadData, error: uploadError } = await client.storage
          .from("portfolio")
          .upload(`uploads/${uniqueName}`, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = client.storage
            .from("portfolio")
            .getPublicUrl(`uploads/${uniqueName}`);
          if (publicUrlData?.publicUrl) {
            res.json({ url: publicUrlData.publicUrl });
            return;
          }
        }
      } catch {
        // Fallback to local static file if bucket doesn't exist yet
      }
    }

    const filePath = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    res.json({ url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// PUT update projects list
app.put("/api/projects", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projects } = req.body as { projects: Project[] };
    if (!Array.isArray(projects)) {
      res.status(400).json({ error: "Invalid projects array" });
      return;
    }
    const data = await getPortfolioData(req.supabaseToken);
    data.projects = projects;
    await savePortfolioData(data, req.supabaseToken);
    res.json({ projects: data.projects });
  } catch (error) {
    console.error("Error updating projects:", error);
    res.status(500).json({ error: "Failed to update projects" });
  }
});

// PUT update certificates list
app.put(
  "/api/certificates",
  requireSupabaseAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { certificates } = req.body as { certificates: Certificate[] };
      if (!Array.isArray(certificates)) {
        res.status(400).json({ error: "Invalid certificates array" });
        return;
      }
      const data = await getPortfolioData(req.supabaseToken);
      data.certificates = certificates;
      await savePortfolioData(data, req.supabaseToken);
      res.json({ certificates: data.certificates });
    } catch (error) {
      console.error("Error updating certificates:", error);
      res.status(500).json({ error: "Failed to update certificates" });
    }
  }
);

// PUT update skills categories & items
app.put("/api/skills", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { skillCategories } = req.body as { skillCategories: SkillCategory[] };
    if (!Array.isArray(skillCategories)) {
      res.status(400).json({ error: "Invalid skillCategories array" });
      return;
    }
    const data = await getPortfolioData(req.supabaseToken);
    data.skillCategories = skillCategories;
    await savePortfolioData(data, req.supabaseToken);
    res.json({ skillCategories: data.skillCategories });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ error: "Failed to update skills" });
  }
});

// PUT update About section (bio text + profile images)
app.put("/api/about", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { about } = req.body as { about: AboutData };
    if (!about || typeof about !== "object") {
      res.status(400).json({ error: "Invalid about data" });
      return;
    }
    const data = await getPortfolioData(req.supabaseToken);
    data.about = about;
    await savePortfolioData(data, req.supabaseToken);
    res.json({ about: data.about });
  } catch (error) {
    console.error("Error updating about section:", error);
    res.status(500).json({ error: "Failed to update about section" });
  }
});

// PUT update social links & contact info
app.put("/api/socials", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { socialLinks, location } = req.body as {
      socialLinks: SocialLink[];
      location?: string;
    };
    if (!Array.isArray(socialLinks)) {
      res.status(400).json({ error: "Invalid socialLinks array" });
      return;
    }
    const data = await getPortfolioData(req.supabaseToken);
    data.socialLinks = socialLinks;
    if (typeof location === "string") {
      data.about.location = location;
    }
    await savePortfolioData(data, req.supabaseToken);
    res.json({ socialLinks: data.socialLinks, location: data.about.location });
  } catch (error) {
    console.error("Error updating social links:", error);
    res.status(500).json({ error: "Failed to update social links" });
  }
});

// POST reset to initial pre-seeded portfolio items
app.post("/api/reset", requireSupabaseAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const freshSeed = JSON.parse(JSON.stringify(defaultPortfolioData)) as PortfolioData;
    await savePortfolioData(freshSeed, req.supabaseToken);
    res.json(freshSeed);
  } catch (error) {
    console.error("Error resetting portfolio data:", error);
    res.status(500).json({ error: "Failed to reset portfolio data" });
  }
});

// ---------------------------------------------------------------------------
// Vite Dev Middleware / Production Static Serving
// ---------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
