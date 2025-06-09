import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { isRateLimitedAPI } from "@/utils/ratelimit";
import { z } from "zod";

const responseSchema = z.object({
  correct: z.boolean().describe("was the userAnswer correct?"),
  explanation: z
    .string()
    .describe(
      "explanation of why the user choosen userAnswer is correct/incorrect and a description of the correct userAnswer"
    ),
  correct_answer: z
    .string()
    .describe("the correct answer from the 4 options listed to the trivia question"),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("confidence level of the AI in its judgement of the user's choosen userAnswer"),
});

// Initialize the PromptTemplate
const prompt = ChatPromptTemplate.fromTemplate(
  `Given the following trivia question and four options provided to the user about {topic}: {question}.  The user selected: {userAnswer}\n Was their answer correct? Please note, the correct userAnswer is guaranteed to be within the provided options.`
);

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.1,
  modelName: "gpt-4o",
});

const chain = prompt.pipe(llm.withStructuredOutput(responseSchema));

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

  try {
    const response = await chain.invoke({
      question: JSON.stringify(question),
      userAnswer: userSelectedOption,
      topic,
    });
    res.status(200).json(response);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
