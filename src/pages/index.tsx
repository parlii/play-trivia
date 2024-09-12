import {
  faInfoCircle,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingDots from "@/app/components/LoadingDots";
import { Question } from "../app/questions";
import TriviaQuestion from "../app/components/TriviaQuestion";

export default function HomePage() {
  // const [score, setScore] = useState(0);
  // const [mistakes, setMistakes] = useState(0);
  // const [remainingTime, setRemainingTime] = useState(10 * 60); // time remaining in seconds
  const [question, setQuestion] = useState<Question | null>(null);
  const [pastQuestions, setPastQuestions] = useState<Question[]>([]); // Add this line
  const [topic, setTopic] = useState<string>("");
  const [topicInputValue, setInputValue] = useState("");
  const [difficulty, setDifficulty] = useState("Easy"); // default difficulty to 'Easy'
  const [language, setLanguage] = useState("English"); // default language to 'English'
  const [temperature, setTemperature] = useState(0.5); // default temperature to 0.5
  const [pastTopics, setPastTopics] = useState<string[]>([]);
  const [loadingRandomTopic, setLoadingRandomTopic] = useState(false);

  const resetOptions = () => {
    setTopic("");
    setQuestion(null);
    setPastQuestions([]);
  };

  const getRandomTriviaTopic = async () => {
    let newPastTopics = pastTopics;
    // if topic and/or topicInputValue have value, add them to newPastTopics
    if (topic || topicInputValue) {
      newPastTopics = [...pastTopics, topic, topicInputValue];
    }
    // remove empty string from newPastTopics
    newPastTopics = newPastTopics.filter((topic) => topic != "");
    setPastTopics(newPastTopics);
    setLoadingRandomTopic(true);
    try {
      const response = await fetch(
        `/api/getRandomTriviaTopic?pastTopics=${newPastTopics}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const topic = await response.text();
      const cleanTopic = topic.replace(/[^\w\s]/gi, "");
      console.log(response);
      setInputValue(cleanTopic);
      setLoadingRandomTopic(false);
    } catch (error) {
      console.error(error);
    }
  };

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
          selectedOpenAIModel: 'gpt-4o-mini',
        }),
      });
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Failed to load question", error);
      alert(error);
    }
  };

  useEffect(() => {
    if (topic !== "") {
      loadQuestion();
    }
  }, [topic]);

  const incrementTemperature = () => {
    if (temperature < 1) {
      setTemperature((prevTemp) => parseFloat((prevTemp + 0.1).toFixed(1)));
    }
  };

  const decrementTemperature = () => {
    if (temperature > 0) {
      setTemperature((prevTemp) => parseFloat((prevTemp - 0.1).toFixed(1)));
    }
  };

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
    <div className="flex flex-col h-full justify-center items-center w-full">
      <div className="flex items-center justify-center p-4 w-full max-w-lg">
        {topic ? (
          <div className="flex flex-col justify-center items-center mx-auto w-full">
            <div>
              <p className="text-lg items-center justify-center font-medium text-gray-700 dark:text-gray-300 mb-6">
                Trivia Topic: {topic}
              </p>
            </div>
            <div className="grid md:flex gap-4 grid-cols-2 justify-between items-center md:items-start w-full">
              <p className="text-gray-700 dark:text-gray-300 mr-6">
                Difficulty{" "}
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {difficulty}
                </p>
              </p>
              <p className="text-gray-700 dark:text-gray-300 mr-6">
                Language
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {language}
                </p>
              </p>
              {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Score: {score}
            </p> */}
              {/* <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Mistakes: {mistakes}
            </p> */}
            </div>
          </div>
        ) : (
          <div className="flex bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-full max-w-lg">
              <div className="flex items-center mb-4">
                <input
                  placeholder="Enter a topic"
                  className="px-4 py-2 w-full rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
                  value={topicInputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loadingRandomTopic}
                />
                <button
                  className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition-colors relative group"
                  onClick={getRandomTriviaTopic}
                  disabled={loadingRandomTopic}
                  title="Ask AI for a random trivia topic"
                >
                  {loadingRandomTopic ? (
                    <LoadingDots dotLength={5} />
                  ) : (
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                  )}
                </button>
              </div>
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
              {/* <div className="mb-4 flex items-center">
                <label
                  htmlFor="spinner"
                  className="font-bold text-gray-700 dark:text-gray-300"
                >
                  AI temperature:
                </label>
                <div className="ml-4 flex items-center">
                  <button
                    onClick={decrementTemperature}
                    className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
                  >
                    -
                  </button>
                  <input
                    id="spinner"
                    name="value"
                    value={temperature}
                    readOnly
                    className="mx-2 px-2 py-1 w-16 text-center rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
                  />
                  <button
                    onClick={incrementTemperature}
                    className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-white outline-none focus:bg-gray-300 dark:focus:bg-gray-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                <a
                  href="https://ai.stackexchange.com/questions/32477/what-is-the-temperature-in-the-gpt-models"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2"
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  />
                </a>
              </div> */}
              {/* <TemperatureSlider
                temperature={temperature}
                setTemperature={setTemperature}
              /> */}
              <button
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded transition-colors"
                onClick={() => {
                  if (topicInputValue) {
                    setTopic(topicInputValue);
                  } else {
                    alert("Please enter a topic");
                  }
                }}
              >
                Load Question
              </button>
            </div>
          </div>
        )}
      </div>
      {topic && (
        <div className="flex flex-col justify-center w-full">
          {question && question.options ? (
            <>
              <TriviaQuestion
                question={question}
                // onOptionSelected={handleOptionSelected}
                topic={topic}
              />
              <div className="p-4 space-x-4 flex justify-between items-center w-full mb-4 mt-4">
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
                <LoadingDots dotLength={9} />
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
