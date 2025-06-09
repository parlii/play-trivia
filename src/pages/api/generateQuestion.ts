import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Question } from "@/app/questions";
import { isRateLimitedAPI } from "@/utils/ratelimit";
import { parseJsonResponse } from "@/utils/parse";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MyNextApiRequest extends NextApiRequest {
  body: {
    topic: string;
    pastQuestions: Question[];
    difficulty: string;
    language: string;
  };
}

// Export the handler
export default async function handler(
  req: MyNextApiRequest,
  res: NextApiResponse
) {
  const rateLimited = await isRateLimitedAPI(req, res);
  if (rateLimited) {
    return res.status(429).json({ message: "Too many requests" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { topic, pastQuestions, difficulty, language } =
    req.body; // Change this line

  // Format pastQuestions into a string
  const pastQuestionsStr = pastQuestions
    .map((q) => `Question: ${q.question}`)
    .join("\n");

  const prompt = `Generate a trivia question about this topic: ${topic}. The difficulty level of this question should be: ${difficulty}. Instructions: Please do not repeat these past questions: ${pastQuestionsStr}. Please generate the entire question and options in this language: ${language}. Respond with JSON containing \\"question\\" and \\"options\\".`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            'You are a helpful assistant that generates trivia questions. Respond only in JSON.'
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const data = parseJsonResponse<Question>(
      completion.choices[0].message?.content
    );
    res.status(200).json(data);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
