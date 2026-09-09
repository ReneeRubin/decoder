import type { QuizQuestion } from "../types";
import { ProgressBar } from "./ProgressBar";

interface QuestionScreenProps {
  question: QuizQuestion;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function QuestionScreen({
  question,
  totalQuestions,
  selectedOptionId,
  onSelect,
  onNext,
  onBack,
  canGoBack,
}: QuestionScreenProps) {
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
                  onChange={() => onSelect(option.id)}
                />
                <span className="option-label">{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="question-nav">
          <button type="button" className="btn btn-secondary" onClick={onBack} disabled={!canGoBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-primary" onClick={onNext} disabled={!selectedOptionId}>
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
