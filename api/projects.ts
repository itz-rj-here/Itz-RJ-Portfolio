import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getPortfolioData, savePortfolioData, setCors } from "./_helpers.ts";
import type { Project } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { projects } = req.body as { projects: Project[] };
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: "Invalid projects array" });
    }
    const data = await getPortfolioData();
    data.projects = projects;
    await savePortfolioData(data);
    return res.status(200).json({ projects: data.projects });
  } catch (error) {
    console.error("Error updating projects:", error);
    return res.status(500).json({ error: "Failed to update projects" });
  }
}
