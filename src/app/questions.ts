export interface Question {
  question: string;
  options: string[];
  // answer: string;
  // confidence: Confidence;
}

export interface CheckAnswerResponse {
  correct: boolean;
  explanation: string;
  confidence: string;
  correct_answer: string;
}
