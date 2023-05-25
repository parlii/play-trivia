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
    correct: z.boolean().describe("was the answer correct?"),
    explanation: z
      .string()
      .describe(
        "explanation of why the user choosen answer is correct/incorrect and a description of the correct answer"
      ),
    correct_answer: z
      .string()
      .describe(
        "the correct answer from the 4 options listed to the trivia question"
      ),
    confidence: z
      .enum(["high", "medium", "low"])
      .describe(
        "confidence level of the AI in its judgement of the user's choosen answer"
      ),
  })
);

const formatInstructions = parser.getFormatInstructions();

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: `This trivia question  about {topic} was presented to the user with these 4 options. {question}. The user picked: {answer}\n Was it correct? The correct answer MUST be one of the 4 options listed.  \n{format_instructions}`,
  inputVariables: ["question", "answer", "topic"],
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const topic: string = req.query.topic as string;

  // extract question and answer from the request
  const { question, userSelectedOption } = req.body;
  console.log(question, userSelectedOption);

  const input = await prompt.format({
    topic: topic,
    question: JSON.stringify(question),
    answer: userSelectedOption,
  });

  console.log(input);

  try {
    // Use the chain to generate a question
    const response = await chain.call({
      question: JSON.stringify(question),
      answer: userSelectedOption,
      topic: topic,
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
