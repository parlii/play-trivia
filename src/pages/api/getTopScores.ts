import type { NextApiRequest, NextApiResponse } from "next";

import { sql } from "@vercel/postgres";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { rows } =
      await sql`SELECT * FROM scores ORDER BY score DESC LIMIT 10`;
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get top scores" });
  }
}
