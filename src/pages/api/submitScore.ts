import type { NextApiRequest, NextApiResponse } from "next";

import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, score } = req.body;
  if (!name || !score) {
    return res.status(400).json({ message: "Missing name or score" });
  }

  try {
    await sql`INSERT INTO scores (name, score) VALUES (${name}, ${score})`;
    res.status(200).json({ message: "Score submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit score" });
  }
}
