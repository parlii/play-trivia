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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const topic: string = req.query.topic as string;

  // extract question and userAnswer from the request
  const { question, userSelectedOption } = req.body;
  console.log(question, userSelectedOption);

  const prompt = `Given the following trivia question and four options provided to the user about ${topic}: ${JSON.stringify(
    question
  )}. The user selected: ${userSelectedOption}. Was their answer correct? Respond with JSON containing \\"correct\\", \\"explanation\\", \\"correct_answer\\", and \\"confidence\\" (high|medium|low).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            'You evaluate trivia answers. Reply only in the specified JSON format.'
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const data = parseJsonResponse(
      completion.choices[0].message?.content
    );
    res.status(200).json(data);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
