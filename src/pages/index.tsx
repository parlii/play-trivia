import { useEffect, useState } from "react";

import Navbar from "@/app/components/NavBar";
import { Question } from "../app/questions";
import TriviaQuestion from "../app/components/TriviaQuestion";
import { useRouter } from "next/router";

export default function HomePage() {
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(10 * 60); // time remaining in seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      router.push({
        pathname: "/gameover",
        query: { score },
      });
    }
  }, [remainingTime]);

  const loadQuestion = async () => {
    try {
      const response = await fetch("/api/generateQuestion");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Failed to load question", error);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleOptionSelected = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes(mistakes + 1);
      if (mistakes + 1 >= 10) {
        router.push({
          pathname: "/gameover",
          query: { score },
        });
      }
    }
    loadQuestion(); // fetch a new question
  };

  return (
    <div>
      <Navbar />
      <h1>Welcome to Nepali Trivia</h1>
      <p>Score: {score}</p>
      <p>Mistakes: {mistakes}</p>
      <p>
        Time remaining: {Math.floor(remainingTime / 60)}:
        {remainingTime % 60 < 10 ? "0" : ""}
        {remainingTime % 60}
      </p>
      {question ? (
        <TriviaQuestion
          question={question}
          onOptionSelected={handleOptionSelected}
        />
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}
