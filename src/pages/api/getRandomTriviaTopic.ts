import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { isRateLimitedAPI } from "@/utils/ratelimit";
import { parseJsonResponse } from "@/utils/parse";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  const pastTopics = req.query.pastTopics as string;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            'You generate trivia topics. Reply only in JSON with a single key "topic".'
        },
        {
          role: "user",
          content: `Generate a single-word or short phrase topic for a trivia game that covers a specific field of knowledge or interest. Avoid these topics: ${pastTopics}.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const data = parseJsonResponse<{ topic: string }>(
      completion.choices[0].message?.content
    );
    res.status(200).json(data.topic);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
