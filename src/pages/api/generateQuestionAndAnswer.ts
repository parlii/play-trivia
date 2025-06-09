import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Question } from "@/app/questions";
import { isRateLimitedAPI } from "@/utils/ratelimit";
import { z } from "zod";

const responseSchema = z.object({
  question: z.string().describe("A trivia question"),
  options: z
    .array(z.string().describe("4 options for the trivia question"))
    .length(4),
});

// Initialize the PromptTemplate
const prompt = ChatPromptTemplate.fromTemplate(
  `Generate a trivia question about this topic: {topic}. The difficulty level of this question should be: {level}. Instructions: Please do not repeat these past questions: {pastQuestions}. Please generate the entire question and options in this language: {language}`
);

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

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.4,
    modelName: "gpt-4o",
  });

  const chain = prompt.pipe(llm.withStructuredOutput(responseSchema));

  try {
    const response = await chain.invoke({
      level: difficulty,
      topic,
      language,
      pastQuestions: pastQuestionsStr,
    });
    res.status(200).json(response);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
