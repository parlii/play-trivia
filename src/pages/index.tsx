import questions, { Question } from "../app/questions";
import { useEffect, useState } from "react";

import Navbar from "@/app/components/NavBar";
import TriviaQuestion from "../app/components/TriviaQuestion";
import { useRouter } from "next/router";

export default function HomePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(10 * 60); // time remaining in seconds

  const router = useRouter();

  // Update remaining time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // End game after 10 minutes of inactivity
  useEffect(() => {
    if (remainingTime <= 0) {
      router.push({
        pathname: "/gameover",
        query: { score },
      });
    }
  }, [remainingTime]);

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
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setRemainingTime(10 * 60); // reset the timer
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
      {currentQuestionIndex < questions.length ? (
        <TriviaQuestion
          question={questions[currentQuestionIndex]}
          onOptionSelected={handleOptionSelected}
        />
      ) : (
        <p>No more questions!</p>
      )}
    </div>
  );
}
