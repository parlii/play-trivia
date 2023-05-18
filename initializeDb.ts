import { sql } from "@vercel/postgres";

async function initializeDb() {
  try {
    const tableExists = await sql`SELECT to_regclass('public.scores')`;
    if (!tableExists.length) {
      await sql`
        CREATE TABLE scores (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          score INT NOT NULL
        )
      `;
      console.log("Created table scores");
    } else {
      console.log("Table scores already exists");
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

initializeDb();
