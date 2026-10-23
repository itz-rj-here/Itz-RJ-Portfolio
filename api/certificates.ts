import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, getPortfolioData, savePortfolioData, setCors } from "./_helpers.ts";
import type { Certificate } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorized = await requireAuth(req, res);
  if (!authorized) return;

  try {
    const { certificates } = req.body as { certificates: Certificate[] };
    if (!Array.isArray(certificates)) {
      return res.status(400).json({ error: "Invalid certificates array" });
    }
    const data = await getPortfolioData();
    data.certificates = certificates;
    await savePortfolioData(data);
    return res.status(200).json({ certificates: data.certificates });
  } catch (error) {
    console.error("Error updating certificates:", error);
    return res.status(500).json({ error: "Failed to update certificates" });
  }
}
