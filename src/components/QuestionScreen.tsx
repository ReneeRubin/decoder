import type { QuizQuestion } from "../types";
import { ProgressBar } from "./ProgressBar";

interface QuestionScreenProps {
  question: QuizQuestion;
  totalQuestions: number;
  selectedOptionId?: string;
  onAnswer: (optionId: string) => void;
}

export function QuestionScreen({ question, totalQuestions, selectedOptionId, onAnswer }: QuestionScreenProps) {
  return (
    <div className="screen">
      <ProgressBar current={question.number} total={totalQuestions} />
      <div className="card">
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend className="question-text">{question.text}</legend>
          <div className="options">
            {question.options.map((option) => (
              <label className="option" key={option.id}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() => onAnswer(option.id)}
                />
                <span className="option-label">{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
