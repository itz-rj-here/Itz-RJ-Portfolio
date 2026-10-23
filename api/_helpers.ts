import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  defaultPortfolioData,
  type PortfolioData,
} from "../src/data/portfolio.ts";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export function getSupabase(): SupabaseClient | null {
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = getSupabase();
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
      // Fallback to default
    }
  }
  return JSON.parse(JSON.stringify(defaultPortfolioData));
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase
      .from("portfolio_content")
      .upsert({ id: "main", payload: data, updated_at: new Date().toISOString() });
  }
}

export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({
      error: "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    });
    return false;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !String(authHeader).startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing Supabase access token" });
    return false;
  }

  const token = String(authHeader).slice("Bearer ".length).trim();

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired Supabase session" });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: "Unauthorized: Failed to verify Supabase token" });
    return false;
  }
}

/** Enable CORS for Vercel serverless functions */
export function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
