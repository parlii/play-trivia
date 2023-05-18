import { Option, Question } from "../questions";

import { useState } from "react";

interface TriviaQuestionProps {
  question: Question;
  onOptionSelected: (isCorrect: boolean) => void;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  question,
  onOptionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [explanation, setExplanation] = useState("");

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    const isCorrect = question.answer === option.text;
    setExplanation(option.explanation);
    onOptionSelected(isCorrect);
  };

  const getOptionClass = (option: Option) => {
    if (!selectedOption) return "bg-gray-200 hover:bg-gray-300";
    if (selectedOption === option) {
      return question.answer === option.text ? "bg-green-400" : "bg-red-400";
    }
    return "bg-gray-200";
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`px-4 py-2 my-1 cursor-pointer rounded ${getOptionClass(
              option
            )}`}
          >
            {option.text}
          </li>
        ))}
      </ul>
      {selectedOption && (
        <div className="mt-4 p-4 bg-blue-100 rounded-md">
          <p className="text-base">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default TriviaQuestion;
