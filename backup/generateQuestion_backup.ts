import { NextApiRequest, NextApiResponse } from "next";

import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { Question } from "@/app/questions";

// You can initialize the model using the environment variables as per LangChain documentation
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.8,
});

const jsonTemplate = `{
  "question": "What is the capital of Nepal?",
  "options": [
    {
      "text": "Kathmandu",
      "explanation": "Correct! Kathmandu is the capital and largest city of Nepal."
    },
    {
      "text": "Pokhara",
      "explanation": "Incorrect. Pokhara is a major tourist destination in Nepal but not the capital. The capital is Kathmandu."
    },
    {
      "text": "Biratnagar",
      "explanation": "Incorrect. Biratnagar is an industrial city in southeastern Nepal but not the capital. The capital is Kathmandu."
    },
    {
      "text": "Birgunj",
      "explanation": "Incorrect. Birgunj is a city in southern Nepal near the border with India but not the capital. The capital is Kathmandu."
    }
  ],
  "answer": "Kathmandu"
}`
  .replaceAll("{", "{{")
  .replaceAll("}", "}}")
  .replaceAll("[", "[[")
  .replaceAll("]", "]]");

// Define the prompt template:
const template =
  `You are an assistant that only speaks JSON. Do not write normal text. Generate a trivia question about Nepali culture in JSON. {placeholder} Include the question, options, explanation, and answer in this format:
` + jsonTemplate;

const parsedTemplate = template.replace(/\n/g, "");

console.log(parsedTemplate);

// const template = "What is the capital of {placeholder}?";

// Initialize the PromptTemplate
const prompt = new PromptTemplate({
  template: parsedTemplate,
  inputVariables: ["placeholder"],
});

// Initialize an LLMChain with the OpenAI model and the prompt
const chain = new LLMChain({ llm: model, prompt: prompt });

// Export the handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const test = await prompt.format({ placeholder: "Nepal" });
  console.log(test);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Use the chain to generate a question
    const response = await chain.call({ placeholder: "temp" });
    const generatedQuestion = response.text;

    // make sure that the generate question is of the desired format Question
    // export interface Question {
    //   question: string;
    //   options: Option[];
    //   answer: string;
    // }

    // export interface Option {
    //   text: string;
    //   explanation: string;
    // }

    // Parse the generated question into the desired format
    const parsedQuestion: Question = JSON.parse(generatedQuestion);
    res.status(200).json(parsedQuestion);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Failed to generate question" });
  }
}
