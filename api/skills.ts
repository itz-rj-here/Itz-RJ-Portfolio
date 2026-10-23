import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getPortfolioData, savePortfolioData, setCors } from "./_helpers.ts";
import type { SkillCategory } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { skillCategories } = req.body as { skillCategories: SkillCategory[] };
    if (!Array.isArray(skillCategories)) {
      return res.status(400).json({ error: "Invalid skillCategories array" });
    }
    const data = await getPortfolioData();
    data.skillCategories = skillCategories;
    await savePortfolioData(data);
    return res.status(200).json({ skillCategories: data.skillCategories });
  } catch (error) {
    console.error("Error updating skills:", error);
    return res.status(500).json({ error: "Failed to update skills" });
  }
}
