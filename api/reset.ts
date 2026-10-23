import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, savePortfolioData, setCors } from "./_helpers.ts";
import { defaultPortfolioData, type PortfolioData } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const freshSeed = JSON.parse(JSON.stringify(defaultPortfolioData)) as PortfolioData;
    await savePortfolioData(freshSeed);
    return res.status(200).json(freshSeed);
  } catch (error) {
    console.error("Error resetting portfolio data:", error);
    return res.status(500).json({ error: "Failed to reset portfolio data" });
  }
}
