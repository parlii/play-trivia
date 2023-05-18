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
  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
};

export default TriviaQuestion;
