import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getPortfolioData, savePortfolioData, setCors } from "./_helpers.ts";
import type { SocialLink } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { socialLinks, location } = req.body as {
      socialLinks: SocialLink[];
      location?: string;
    };
    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({ error: "Invalid socialLinks array" });
    }
    const data = await getPortfolioData();
    data.socialLinks = socialLinks;
    if (typeof location === "string") {
      data.about.location = location;
    }
    await savePortfolioData(data);
    return res.status(200).json({ socialLinks: data.socialLinks, location: data.about.location });
  } catch (error) {
    console.error("Error updating social links:", error);
    return res.status(500).json({ error: "Failed to update social links" });
  }
}
