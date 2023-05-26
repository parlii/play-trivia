import { NextApiRequest, NextApiResponse } from "next";

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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await openai.listModels();
    console.log(response);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Failed to load models ", err);
    res.status(500).json({ message: "Failed to load models" });
  }
}
