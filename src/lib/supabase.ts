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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment."
    );
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be signed in with Supabase to perform this action.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("payload")
        .eq("id", "main")
        .single();
      if (!error && data?.payload) {
        return data.payload as PortfolioData;
      }
    } catch {
      // Fallback to backend API
    }
  }

  try {
    const res = await fetch("/api/portfolio");
    if (!res.ok) throw new Error("Failed to fetch portfolio data");
    return (await res.json()) as PortfolioData;
  } catch {
    return defaultPortfolioData;
  }
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

export async function uploadImageFile(file: File): Promise<string> {
  // Try direct Supabase Storage upload first if 'portfolio' bucket is configured
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
      // Fallback to server upload endpoint
    }
  }

  const headers = await getAuthHeaders();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers,
          body: JSON.stringify({
            fileName: file.name,
            dataUrl,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Image upload failed");
        }
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function updateProjectsApi(projects: Project[]): Promise<Project[]> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/projects", {
    method: "PUT",
    headers,
    body: JSON.stringify({ projects }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save projects");
  return data.projects;
}

export async function updateCertificatesApi(certificates: Certificate[]): Promise<Certificate[]> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/certificates", {
    method: "PUT",
    headers,
    body: JSON.stringify({ certificates }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save certificates");
  return data.certificates;
}

export async function updateSkillsApi(skillCategories: SkillCategory[]): Promise<SkillCategory[]> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/skills", {
    method: "PUT",
    headers,
    body: JSON.stringify({ skillCategories }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save skills");
  return data.skillCategories;
}

export async function updateAboutApi(about: AboutData): Promise<AboutData> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/about", {
    method: "PUT",
    headers,
    body: JSON.stringify({ about }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save About section");
  return data.about;
}

export async function updateSocialsApi(
  socialLinks: SocialLink[],
  location?: string
): Promise<{ socialLinks: SocialLink[]; location?: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/socials", {
    method: "PUT",
    headers,
    body: JSON.stringify({ socialLinks, location }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save social links");
  return data;
}

export async function resetPortfolioApi(): Promise<PortfolioData> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/reset", {
    method: "POST",
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to reset portfolio data");
  return data;
}
