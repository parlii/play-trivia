import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { isRateLimitedAPI } from "@/utils/ratelimit";

// Initialize the PromptTemplate
const prompt = ChatPromptTemplate.fromTemplate(
  `Generate a single-word or short phrase topic for a trivia game that covers a specific field of knowledge or interest. It can be one of these or an entirely new topic: Dinosaurs, Inventions, Mythology, Literature, Composers, Painters, World Capitals, Olympic Games, Nobel Laureates, Astronomy, World Cuisines, Famous Battles, National Parks, Marine Life, Ancient Civilizations, Scientific Discoveries, Board Games, World Religions. However, certain topics have already been used. For example, Do not repeat these topics: {pastTopics}.`
);

// You can initialize the model using the environment variables as per LangChain documentation
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.8,
  modelName: "gpt-4o",
});

const chain = prompt.pipe(llm);

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
    const response = await chain.invoke({ pastTopics });
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
