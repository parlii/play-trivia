import { NextApiRequest, NextApiResponse } from "next";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { Question } from "@/app/questions";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    question: z.string().describe("A trivia question"),
    options: z
      .array(z.string().describe("4 options for the trivia question"))
      .length(4),
    answer: z.string().describe("correct answer to the trivia question"),
  })
);

const formatInstructions = parser.getFormatInstructions();

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: `Generate a trivia question about this topic: {topic}. Difficulty level: {level}\n{format_instructions}`,
  inputVariables: ["level", "topic"],
  partialVariables: { format_instructions: formatInstructions },
});

// You can initialize the model using the environment variables as per LangChain documentation
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.8,
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

  const topic: string = req.query.topic as string;

  // const input = await prompt.format({
  //   level: "easy",
  //   topic: topic,
  // });

  // console.log(input);

  try {
    // Use the chain to generate a question
    const response = await chain.call({ level: "hard", topic: topic });

    try {
      const parsedResponse: Question = await parser.parse(response.text);
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
