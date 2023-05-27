import { NextApiRequest, NextApiResponse } from "next";

import { isRateLimitedAPI } from "@/utils/ratelimit";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Export the handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rateLimited = await isRateLimitedAPI(req, res);
  if (rateLimited) {
    return res.status(429).json({ message: "Too many requests" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const modelsResponse = await openai.listModels();
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).json(modelsResponse.data);
  } catch (err) {
    console.error("Failed to load models ", err);
    res.status(500).json({ message: "Failed to load models" });
  }
}
