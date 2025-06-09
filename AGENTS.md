# Repository Guide for LLM Agents

## Using `AGENTS.md`

This Markdown document explains how LLM agents should work in this repository.
You may place additional `AGENTS.md` files in subfolders for more specific
instructions; nested files override parent guidance. Some setups also check
`.currsorrules` or `CLAUDE.md` for organization-wide policies.

### Contribution Guidelines
- Follow the TypeScript and Next.js patterns already present.
- Run `npm run lint` before committing so ESLint passes.
- Document any future test commands here for agents to run.

### How the Agent Should Work
- Focus exploration on the `src` directory.
- Keep pull request messages concise with **Summary** and **Testing** sections.
- Update documentation whenever new features are added.

This project is a Next.js 13 application written in TypeScript. It serves an AI powered trivia game that generates questions with OpenAI via LangChain. The repository uses the classic `pages` router while placing reusable components under `src/app`.

## Directory Overview

- **`src/pages/`** – Next.js pages. `index.tsx` hosts the game flow and calls the APIs in `/api`. Extra pages include `blocked.tsx`, `gameover.tsx`, and `leaderboard.tsx`.
- **`src/pages/api/`** – API routes called by the front end:
  - `generateQuestion.ts` – creates a question and options using OpenAI.
  - `checkAnswer.ts` – verifies if the user answer is correct and explains why.
  - `getRandomTriviaTopic.ts` – produces a suggested topic.
  - `generateQuestionAndAnswer.ts` – similar to `generateQuestion` (unused but kept as reference).
- **`src/app/`** – Shared React components and utilities such as `TriviaQuestion.tsx` and `LoadingDots.tsx`.
- **`src/utils/ratelimit.ts`** – Upstash Redis based limiter used by API routes and `src/middleware.ts` to restrict requests.

## Core Functionality

1. **Trivia Generation** – `/api/generateQuestion` constructs a prompt using LangChain, requesting a question in the chosen topic, difficulty, and language. The result is parsed with Zod.
2. **Answer Checking** – `/api/checkAnswer` accepts the question and user option, queries OpenAI to confirm correctness, and returns an explanation.
3. **Random Topic** – `/api/getRandomTriviaTopic` suggests a new trivia topic, avoiding previously used ones.
4. **Rate Limiting** – each API call and page load is limited to 5 requests every 10 seconds per IP using Upstash.

## Development Notes

- The project requires `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` environment variables.
- Styling is done with Tailwind CSS; dark mode is supported.
- Components reside in `src/app/components/` and are imported using the `@/` alias defined in `tsconfig.json`.

## Goals & Focus Areas

- Deliver a lightweight trivia game that works in multiple languages and difficulty levels.
- Keep the AI interactions structured and constrained using LangChain parsers.
- Use rate limiting to protect API usage.
- Future improvements may include scoring, persistent leaderboards, and better UI/UX.

This file should help agents quickly orient themselves before making changes or adding new features.
