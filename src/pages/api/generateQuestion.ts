import { NextApiRequest, NextApiResponse } from "next";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIModel } from "@/app/models/openAIModels";
import { PromptTemplate } from "langchain/prompts";
import { Question } from "@/app/questions";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    question: z.string().describe("A trivia question"),
    options: z
      .array(z.string().describe("4 options for the trivia question"))
      .length(4),
    // answer: z.string().describe("correct answer to the trivia question"),
  })
);

const formatInstructions = parser.getFormatInstructions();

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: `Generate a trivia question about this topic: {topic}. The difficulty level of this question should be: {level}. Instructions: Please do not repeat these past questions: {pastQuestions}. Please generate the entire question and options in this language: {language} \n{format_instructions}`,
  inputVariables: ["level", "topic", "pastQuestions", "language"],
  partialVariables: { format_instructions: formatInstructions },
});

interface MyNextApiRequest extends NextApiRequest {
  body: {
    topic: string;
    pastQuestions: Question[];
    difficulty: string;
    language: string;
    selectedOpenAIModel: OpenAIModel;
  };
}

// Export the handler
export default async function handler(
  req: MyNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { topic, pastQuestions, difficulty, language, selectedOpenAIModel } =
    req.body; // Change this line

  // Format pastQuestions into a string
  const pastQuestionsStr = pastQuestions
    .map((q) => `Question: ${q.question}`)
    .join("\n");

  const input = await prompt.format({
    level: difficulty,
    topic: topic,
    pastQuestions: pastQuestionsStr,
    language: language,
  });

  console.log(input);

  try {
    // You can initialize the model using the environment variables as per LangChain documentation
    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.5,
      modelName: selectedOpenAIModel.id,
    });

    // Initialize an LLMChain with the OpenAI model and the prompt
    const chain = new LLMChain({ llm: model, prompt: prompt });

    // Use the chain to generate a question
    const response = await chain.call({
      level: difficulty,
      topic: topic,
      language: language,
      pastQuestions: pastQuestionsStr,
    });

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
