import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { selectedAnswer, correctAnswer } = req.body;

  try {
    let isCorrect = false;
    let additionalInfo = "";

    if (selectedAnswer === correctAnswer) {
      isCorrect = true;
      // Provide additional information about the correct answer
      additionalInfo = "Kathmandu is the capital and largest city of Nepal.";
    }

    res.status(200).json({ isCorrect, additionalInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify answer" });
  }
}
