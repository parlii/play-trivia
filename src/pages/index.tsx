import { useEffect, useState } from "react";

import Navbar from "@/app/components/NavBar";
import { Question } from "../app/questions";
import TriviaQuestion from "../app/components/TriviaQuestion";
import { useRouter } from "next/router";

export default function HomePage() {
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  // const [remainingTime, setRemainingTime] = useState(10 * 60); // time remaining in seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const timerId = setInterval(() => {
  //     setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
  //   }, 1000);

  //   return () => clearInterval(timerId);
  // }, []);

  // useEffect(() => {
  //   if (remainingTime <= 0) {
  //     router.push({
  //       pathname: "/gameover",
  //       query: { score },
  //     });
  //   }
  // }, [remainingTime]);

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

  const handleOptionSelected = (isCorrect: boolean | null) => {
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
    // loadQuestion(); // fetch a new question
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        {/* <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-200">
          Nepali Trivia
        </h1> */}
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Score: {score}
        </p>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Mistakes: {mistakes}
        </p>
      </div>
      <div className="flex-1">
        {question ? (
          <TriviaQuestion
            question={question}
            onOptionSelected={handleOptionSelected}
          />
        ) : (
          <div className="p-6 rounded-md shadow-md w-full max-w-lg mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">
              Asking AI for a Nepali trivia question...
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
