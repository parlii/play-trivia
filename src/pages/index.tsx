import { useEffect, useState } from "react";

import Navbar from "@/app/components/NavBar";
import { Question } from "../app/questions";
import TriviaQuestion from "../app/components/TriviaQuestion";
import { useRouter } from "next/router";

export default function HomePage() {
  // const [score, setScore] = useState(0);
  // const [mistakes, setMistakes] = useState(0);
  // const [remainingTime, setRemainingTime] = useState(10 * 60); // time remaining in seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const LoadingDots = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
      const timer = setInterval(() => {
        setDots((dots) => (dots.length < 9 ? dots + "." : ""));
      }, 500); // This will update every half second

      return () => clearInterval(timer); // Clear interval on unmount
    }, []);

    return <span>{dots}</span>;
  };

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
    setQuestion(null);
    try {
      console.log(topic);
      if (topic == "") {
        alert("no topic you fool");
      }
      const response = await fetch(`/api/generateQuestion?topic=${topic}`);
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Failed to load question", error);
    }
  };

  useEffect(() => {
    if (topic !== "") {
      loadQuestion();
    }
  }, [topic]);

  // const handleOptionSelected = (isCorrect: boolean | null) => {
  //   if (isCorrect) {
  //     // setScore(score + 1);
  //   } else {
  //     // setMistakes(mistakes + 1);
  //     if (mistakes + 1 >= 10) {
  //       router.push({
  //         pathname: "/gameover",
  //         query: { score },
  //       });
  //     }
  //   }
  //   // loadQuestion(); // fetch a new question
  // };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        {/* new input field to select topic */}
        {topic ? (
          <>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Topic: {topic}
            </p>
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
              onClick={() => loadQuestion()}
            >
              Load Another Question
            </button>
            {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Score: {score}
            </p> */}
            {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Mistakes: {mistakes}
            </p> */}
          </>
        ) : (
          <div>
            <input
              placeholder="Enter a topic"
              style={{ color: "black" }} // change text color here
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
              onClick={() => {
                if (inputValue) {
                  setTopic(inputValue);
                } else {
                  alert("Please enter a topic");
                }
              }}
            >
              Load Question
            </button>
          </div>
        )}
      </div>
      {topic && (
        <div className="flex-1">
          {question && question.options ? (
            <TriviaQuestion
              question={question}
              // onOptionSelected={handleOptionSelected}
              topic={topic}
            />
          ) : (
            <div className="p-6 rounded-md shadow-md w-full max-w-lg mx-auto mt-10">
              <h2 className="text-xl font-semibold mb-4">
                Asking AI for {topic} trivia question
                <LoadingDots />
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
