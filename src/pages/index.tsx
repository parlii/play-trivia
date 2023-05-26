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
  const [pastQuestions, setPastQuestions] = useState<Question[]>([]); // Add this line
  const [topic, setTopic] = useState<string>("");
  const [inputValue, setInputValue] = useState("Nepal");
  const [difficulty, setDifficulty] = useState("Easy"); // default difficulty to 'Easy'
  const [language, setLanguage] = useState("English"); // default language to 'English'

  const router = useRouter();

  const resetOptions = () => {
    setInputValue("Nepal");
    setDifficulty("Easy");
    setLanguage("English");
    setTopic("");
    setQuestion(null);
    setPastQuestions([]);
  };

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
    let newPastQuestions = pastQuestions;
    if (question) {
      newPastQuestions = [...pastQuestions, question];
      setPastQuestions((prevQuestions) => [...prevQuestions, question]);
    }

    setQuestion(null);
    try {
      console.log(topic);
      if (topic == "") {
        alert("no topic you fool");
      }
      const response = await fetch(`/api/generateQuestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          pastQuestions: newPastQuestions,
          difficulty: difficulty,
          language: language, // include language in the POST request
        }),
      });
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
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Topic: {topic}
            </p>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Difficulty: {difficulty}
            </p>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              Language: {language}
            </p>
            {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Score: {score}
            </p> */}
            {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Mistakes: {mistakes}
            </p> */}
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <input
              placeholder="Enter a topic"
              className="px-4 py-2 mb-4 w-full rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Difficulty:
              </span>
              <label className="ml-4">
                <input
                  type="radio"
                  value="Easy"
                  className="mr-2"
                  checked={difficulty === "Easy"}
                  onChange={() => setDifficulty("Easy")}
                />
                Easy
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  value="Medium"
                  className="mr-2"
                  checked={difficulty === "Medium"}
                  onChange={() => setDifficulty("Medium")}
                />
                Medium
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  value="Hard"
                  className="mr-2"
                  checked={difficulty === "Hard"}
                  onChange={() => setDifficulty("Hard")}
                />
                Hard
              </label>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Language:
              </span>
              <select
                value={language}
                className="ml-4 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Nepali">Nepali</option>
                <option value="French">French</option>
                <option value="Cantonese">Cantonese</option>
                <option value="Mandarin">Mandarin</option>
              </select>
            </div>
            <button
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded transition-colors"
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
            <>
              <TriviaQuestion
                question={question}
                // onOptionSelected={handleOptionSelected}
                topic={topic}
              />
              <div className="fixed bottom-0 right-0 p-4 space-x-4 flex justify-between items-center w-full">
                <button
                  className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded transition-colors"
                  onClick={() => resetOptions()}
                >
                  Reset Options
                </button>
                <button
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded transition-colors"
                  onClick={() => loadQuestion()}
                >
                  Load Another Question
                </button>
              </div>
            </>
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
