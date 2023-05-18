import { useEffect, useState } from "react";

import { Question } from "../questions";

interface TriviaQuestionProps {
  question: Question;
  onOptionSelected: (isCorrect: boolean) => void;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  question,
  onOptionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");

  const handleOptionClick = async (option: string) => {
    setSelectedOption(option);

    const response = await fetch("/api/checkAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, option }),
    });
    const data = await response.json();

    onOptionSelected(data.answer === "correct");
    setExplanation(data.explanation);
  };

  useEffect(() => {
    setExplanation("");
  }, [question]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = isSelected && explanation.startsWith("Correct!");
          const isIncorrect = isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`${
                isCorrect
                  ? "bg-green-400"
                  : isIncorrect
                  ? "bg-red-400"
                  : "bg-gray-300"
              } p-4 rounded-md shadow-md text-center focus:outline-none`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center">{explanation}</p>
    </div>
  );
};

export default TriviaQuestion;
