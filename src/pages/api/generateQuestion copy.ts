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
    question: z.string().describe("Nepali trivia question"),
    options: z
      .array(
        z.object({
          option: z.string().describe("Option 1 to trivia question"),
          explanation: z.string().describe("explanation of the option"),
        })
      )
      .length(4),
    answer: z.string().describe("Answer to trivia question"),
    confidence: z.object({
      level: z
        .string()
        .describe("Confidence level of the answer (high/medium/low)"),
      explanation: z
        .string()
        .describe(
          "explanation of the confidence level, cite a reputable source"
        ),
    }),
  })
);

const formatInstructions = parser.getFormatInstructions();

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: `Generate a trivia question about Nepali culture. Difficulty level: {level}\n{format_instructions}`,
  inputVariables: ["level"],
  partialVariables: { format_instructions: formatInstructions },
});

// "Generate a trivia question about Nepali culture. Difficulty level: hard\nYou must format your output as a JSON value that adheres to a given \"JSON Schema\" instance.\n\n\"JSON Schema\" is a declarative language that allows you to annotate and validate JSON documents.\n\nFor example, the example \"JSON Schema\" instance {{\"properties\": {{\"foo\": {{\"description\": \"a list of test words\", \"type\": \"array\", \"items\": {{\"type\": \"string\"}}}}}}, \"required\": [\"foo\"]}}}}\nwould match an object with one required property, \"foo\". The \"type\" property specifies \"foo\" must be an \"array\", and the \"description\" property semantically describes it as \"a list of test words\". The items within \"foo\" must be strings.\nThus, the object {{\"foo\": [\"bar\", \"baz\"]}} is a well-formatted instance of this example \"JSON Schema\". The object {{\"properties\": {{\"foo\": [\"bar\", \"baz\"]}}}} is not well-formatted.\n\nYour output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!\n\nHere is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:\n```json\n{\"type\":\"object\",\"properties\":{\"question\":{\"type\":\"string\",\"description\":\"Nepali trivia question\"},\"options\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"option\":{\"type\":\"string\",\"description\":\"Option 1 to trivia question\"},\"explanation\":{\"type\":\"string\",\"description\":\"explanation of the option\"}},\"required\":[\"option\",\"explanation\"],\"additionalProperties\":false}},\"answer\":{\"type\":\"string\",\"description\":\"Answer to trivia question\"},\"confidence\":{\"type\":\"object\",\"properties\":{\"level\":{\"type\":\"string\",\"description\":\"Confidence level of the answer\"},\"explanation\":{\"type\":\"string\",\"description\":\"explanation of the confidence level\"}},\"required\":[\"level\",\"explanation\"],\"additionalProperties\":false}},\"required\":[\"question\",\"options\",\"answer\",\"confidence\"],\"additionalProperties\":false,\"$schema\":\"http://json-schema.org/draft-07/schema#\"}\n```\n"

// You can initialize the model using the environment variables as per LangChain documentation
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.8,
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

  const input = await prompt.format({
    level: "hard",
  });

  console.log(input);

  try {
    // Use the chain to generate a question
    const response = await chain.call({ level: "hard" });

    // {\n text: "\nHere is an example of a correctly formatted output:\n```json\n{\n    \"question\": \"What is the traditional greeting of Nepal?\",\n    \"options\": [\n        {\n            \"option\": \"Namaste\",\n            \"explanation\": \"This is a Sanskrit phrase that literally translates to 'I bow to you'\"\n        },\n        {\n            \"option\": \"Nomoshkar\",\n            \"explanation\": \"This is a Bengali phrase that literally translates to 'greetings'\"\n        },\n        {\n            \"option\": \"Salaam\",\n            \"explanation\": \"This is an Arabic phrase that literally translates to 'peace'\"\n        }\n    ],\n    \"answer\": \"Namaste\",\n    \"confidence\": {\n        \"level\": \"hard\",\n        \"explanation\": \"This is a culturally specific greeting\"\n    }\n}\n``"\n},

    try {
      const parsedResponse: Question = await parser.parse(response.text);
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
