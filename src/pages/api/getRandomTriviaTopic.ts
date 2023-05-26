import { NextApiRequest, NextApiResponse } from "next";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    topic: z.string().describe("A new topic for a game of trivia"),
  })
);

const formatInstructions = parser.getFormatInstructions();

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: `Generate a single-word or short phrase topic for a trivia game that covers a specific field of knowledge or interest. Example topics: Dinosaurs, Inventions, Mythology, Literature, Composers, Painters, World Capitals, Olympic Games, Nobel Laureates, Astronomy, World Cuisines, Movie Directors, Famous Battles, National Parks,Marine Life, Ancient Civilizations, Scientific Discoveries, Board Games, World Religions. However, certain topics have already been used. Do not repeat these: {pastTopics}.`,
  inputVariables: ["pastTopics"],
  //   partialVariables: { format_instructions: formatInstructions },
});

// You can initialize the model using the environment variables as per LangChain documentation
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-3.5-turbo",
});

// Initialize an LLMChain with the OpenAI model and the prompt
const chain = new LLMChain({ llm: model, prompt: prompt });

// Export the handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const pastTopics = req.query.pastTopics as string;
  try {
    // Use the chain to generate a question
    const response = await chain.call({
      pastTopics: pastTopics,
    });

    try {
      const parsedResponse = await parser.parse(response.text);
      console.log(parsedResponse);
      res.status(200).json(parsedResponse);
    } catch (e) {
      console.error("Failed to parse bad output: ", e);
      const fixParser = OutputFixingParser.fromLLM(
        new OpenAI({ temperature: 0 }),
        parser
      );
      const output = await fixParser.parse(response.text);
      console.log("Fixed output: ", output);
      res.status(200).json(output);
    }
  } catch (err) {
    console.error("Failed to generate question: ", err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
