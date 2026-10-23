import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getPortfolioData, savePortfolioData, setCors } from "./_helpers.ts";
import type { AboutData } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { about } = req.body as { about: AboutData };
    if (!about || typeof about !== "object") {
      return res.status(400).json({ error: "Invalid about data" });
    }
    const data = await getPortfolioData();
    data.about = about;
    await savePortfolioData(data);
    return res.status(200).json({ about: data.about });
  } catch (error) {
    console.error("Error updating about section:", error);
    return res.status(500).json({ error: "Failed to update about section" });
  }
}
