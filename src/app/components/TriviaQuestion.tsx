import { CheckAnswerResponse, Question } from "../questions";
import { useEffect, useState } from "react";

interface TriviaQuestionProps {
  question: Question;
  onOptionSelected: (isCorrect: boolean | null) => void;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  question,
  onOptionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showBlinkingEffect, setShowBlinkingEffect] = useState(false);
  const [answerResponse, setAnswerResponse] =
    useState<CheckAnswerResponse | null>(null);

  const handleOptionClick = async (userSelectedOption: string) => {
    setSelectedOption(userSelectedOption);
    setShowBlinkingEffect(true);

    const response = await fetch("/api/checkAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, userSelectedOption }),
    });
    const data: CheckAnswerResponse = await response.json();

    setAnswerResponse(data);
    onOptionSelected(data.correct_answer === userSelectedOption);
    setShowBlinkingEffect(false);
  };

  useEffect(() => {
    setAnswerResponse(null);
  }, [question]);

  return (
    <div className=" p-6 rounded-md shadow-md w-full max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isOptionCorrect =
            isSelected && answerResponse && answerResponse.correct;
          const isOptionIncorrect =
            isSelected && answerResponse && !answerResponse.correct;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`${
                isSelected && showBlinkingEffect
                  ? "animate-blinking bg-green-400 text-white"
                  : isOptionCorrect
                  ? "bg-green-400 text-white"
                  : isOptionIncorrect
                  ? "bg-red-400 text-white"
                  : "bg-gray-300 text-gray-800"
              } p-4 rounded-md shadow-md text-center focus:outline-none`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center">{answerResponse?.explanation}</p>
    </div>
  );
};

export default TriviaQuestion;
