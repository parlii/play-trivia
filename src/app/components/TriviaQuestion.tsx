import { Question } from "../questions";
import { useState } from "react";

interface TriviaQuestionProps {
  question: Question;
  onOptionSelected: (isCorrect: boolean) => void;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  question,
  onOptionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option === question.correctOption) {
      onOptionSelected(true);
    } else {
      onOptionSelected(false);
    }
  };

  return (
    <div>
      <h2>{question.text}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li key={index} onClick={() => handleOptionClick(option)}>
            {option} {selectedOption === option && "(selected)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TriviaQuestion;
