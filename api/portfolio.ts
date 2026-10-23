import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPortfolioData, setCors } from "./_helpers.ts";
import { defaultPortfolioData } from "../src/data/portfolio.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await getPortfolioData();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    return res.status(200).json(defaultPortfolioData);
  }
}
