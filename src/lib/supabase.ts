import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  defaultPortfolioData,
  PortfolioData,
  Project,
  Certificate,
  SkillCategory,
  AboutData,
  SocialLink,
} from "@/data/portfolio";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_CACHE_KEY = "itz_rj_portfolio_cache_v1";

function getLocalCache(): PortfolioData | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortfolioData;
    if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.certificates)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function setLocalCache(data: PortfolioData) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function normalizePortfolioData(raw: Partial<PortfolioData>): PortfolioData {
  return {
    projects: Array.isArray(raw.projects) ? raw.projects : defaultPortfolioData.projects,
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
      : defaultPortfolioData.certificates,
    skillCategories: Array.isArray(raw.skillCategories)
      ? raw.skillCategories
      : defaultPortfolioData.skillCategories,
    about:
      raw.about && typeof raw.about === "object"
        ? { ...defaultPortfolioData.about, ...raw.about }
        : defaultPortfolioData.about,
    socialLinks: Array.isArray(raw.socialLinks)
      ? raw.socialLinks
      : defaultPortfolioData.socialLinks,
  };
}

/**
 * Safely parses a fetch Response as JSON without throwing
 * `Unexpected token 'A', "A server e"... is not valid JSON` when deployed on static hosts like Vercel.
 */
async function safeParseJson<T = Record<string, unknown>>(res: Response): Promise<T | null> {
  try {
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();
    if (!text) return null;
    if (contentType.includes("application/json") || text.trim().startsWith("{")) {
      return JSON.parse(text) as T;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches portfolio data directly from Supabase (`portfolio_content` table).
 * Works 100% serverless on Vercel as well as locally.
 */
export async function fetchPortfolioData(): Promise<PortfolioData> {
  // 1. Primary Source of Truth: Supabase `portfolio_content` table
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("payload, updated_at")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data?.payload) {
        const normalized = normalizePortfolioData(data.payload as Partial<PortfolioData>);
        setLocalCache(normalized);
        return normalized;
      }

      // If the table exists (`!error`) but has no `'main'` row yet, seed it automatically if authenticated
      if (!error && !data) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const seedSource = getLocalCache() || defaultPortfolioData;
        if (session?.access_token) {
          await supabase.from("portfolio_content").upsert(
            {
              id: "main",
              payload: seedSource,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        }
      }
    } catch {
      // Fall through if offline
    }
  }

  // 2. Secondary Source: Optional local Express server if running locally
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const apiData = await safeParseJson<Partial<PortfolioData>>(res);
      if (apiData && Array.isArray(apiData.projects)) {
        const normalized = normalizePortfolioData(apiData);
        setLocalCache(normalized);
        return normalized;
      }
    }
  } catch {
    // Ignore on Vercel / static hosting
  }

  // 3. Tertiary Source: Browser cache or default seed
  return getLocalCache() || defaultPortfolioData;
}

/**
 * Persists the entire PortfolioData object directly to Supabase (`portfolio_content` table).
 * Never fails on Vercel even when `/api/*` Express routes are absent.
 */
export async function saveFullPortfolioData(nextData: PortfolioData): Promise<PortfolioData> {
  const normalized = normalizePortfolioData(nextData);
  setLocalCache(normalized);

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Environment Variables."
    );
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Your Supabase login session has expired. Please sign in again.");
  }

  // Direct upsert to Supabase `portfolio_content` table
  const { error: supabaseError } = await supabase.from("portfolio_content").upsert(
    {
      id: "main",
      payload: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  // Best-effort sync to local Express server when running in dev container (ignored on Vercel)
  try {
    await fetch("/api/portfolio", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ portfolio: normalized }),
    });
  } catch {
    // Expected on Vercel static deployment; ignore safely
  }

  if (supabaseError) {
    // Give a clear, actionable message if the SQL script hasn't been run in Supabase yet
    if (
      supabaseError.code === "42P01" ||
      supabaseError.message.includes("portfolio_content") ||
      supabaseError.message.includes("schema cache")
    ) {
      throw new Error(
        "Table 'public.portfolio_content' was not found in your Supabase project. Please run the provided SQL setup script in your Supabase SQL Editor."
      );
    }
    throw new Error(`Supabase error: ${supabaseError.message}`);
  }

  return normalized;
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ token: string; email: string }> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables."
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.session) {
    throw new Error(error?.message || "Invalid Supabase login credentials");
  }

  // On login, ensure Supabase `portfolio_content` has the initial or cached data seeded
  try {
    const { data: existingRow, error: selectErr } = await supabase
      .from("portfolio_content")
      .select("id, payload")
      .eq("id", "main")
      .maybeSingle();

    if (!selectErr && !existingRow) {
      const initialPayload = getLocalCache() || defaultPortfolioData;
      await supabase.from("portfolio_content").upsert(
        {
          id: "main",
          payload: initialPayload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    } else if (!selectErr && existingRow?.payload) {
      setLocalCache(normalizePortfolioData(existingRow.payload as Partial<PortfolioData>));
    }
  } catch {
    // Ignore if table hasn't been created in SQL Editor yet
  }

  return {
    token: data.session.access_token,
    email: data.user.email || email,
  };
}

export async function checkAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  if (!supabase) {
    return { authenticated: false };
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      email: session.user.email,
    };
  } catch {
    return { authenticated: false };
  }
}

export async function logoutAdmin(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function updateSupabasePassword(newPassword: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Compresses/resizes an image file into a clean Data URL fallback if Supabase Storage
 * bucket isn't created yet, ensuring uploads work on Vercel without a backend server.
 */
function fileToOptimizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // If small (< 400KB) or SVG/GIF, return directly
      if (file.size < 400 * 1024 || file.type.includes("svg") || file.type.includes("gif")) {
        resolve(result);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file: File): Promise<string> {
  // 1. Primary: Direct upload to Supabase Storage bucket 'portfolio'
  if (supabase) {
    try {
      const ext = file.name.split(".").pop() || "png";
      const safeBase = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .toLowerCase()
        .slice(0, 40);
      const filePath = `uploads/${safeBase}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // Fall through to optimized Data URL fallback
    }
  }

  // 2. Serverless-safe fallback for Vercel if 'portfolio' storage bucket is not yet created
  return fileToOptimizedDataUrl(file);
}

export async function updateProjectsApi(projects: Project[]): Promise<PortfolioData> {
  const current = await fetchPortfolioData();
  return saveFullPortfolioData({
    ...current,
    projects,
  });
}

export async function updateCertificatesApi(certificates: Certificate[]): Promise<PortfolioData> {
  const current = await fetchPortfolioData();
  return saveFullPortfolioData({
    ...current,
    certificates,
  });
}

export async function updateSkillsApi(skillCategories: SkillCategory[]): Promise<PortfolioData> {
  const current = await fetchPortfolioData();
  return saveFullPortfolioData({
    ...current,
    skillCategories,
  });
}

export async function updateAboutApi(about: AboutData): Promise<PortfolioData> {
  const current = await fetchPortfolioData();
  return saveFullPortfolioData({
    ...current,
    about,
  });
}

export async function updateSocialsApi(
  socialLinks: SocialLink[],
  location?: string
): Promise<PortfolioData> {
  const current = await fetchPortfolioData();
  return saveFullPortfolioData({
    ...current,
    socialLinks,
    about: {
      ...current.about,
      ...(typeof location === "string" ? { location } : {}),
    },
  });
}

export async function resetPortfolioApi(): Promise<PortfolioData> {
  const freshSeed = JSON.parse(JSON.stringify(defaultPortfolioData)) as PortfolioData;
  return saveFullPortfolioData(freshSeed);
}
