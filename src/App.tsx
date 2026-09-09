import { useMemo, useState } from "react";
import { QUIZ_QUESTIONS } from "./data/quiz";
import { StartScreen } from "./components/StartScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { InterstitialScreen } from "./components/InterstitialScreen";
import { EmailGate } from "./components/EmailGate";
import { SuccessScreen } from "./components/SuccessScreen";
import { Footer } from "./components/Footer";
import { trackEvent } from "./lib/analytics";
import { submitQuiz } from "./lib/api";
import type { QuizAnswers } from "./types";

type Step =
  | { kind: "start" }
  | { kind: "question"; index: number }
  | { kind: "interstitial"; afterIndex: number; text: string }
  | { kind: "email" }
  | { kind: "success" };

export default function App() {
  const [step, setStep] = useState<Step>({ kind: "start" });
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const totalQuestions = QUIZ_QUESTIONS.length;

  function goToStep(nextIndex: number) {
    if (nextIndex >= totalQuestions) {
      setStep({ kind: "email" });
      trackEvent({ name: "quiz_completed" });
      return;
    }
    setStep({ kind: "question", index: nextIndex });
  }

  function handleStart() {
    trackEvent({ name: "quiz_started" });
    setStep({ kind: "question", index: 0 });
  }

  function handleSelect(question: (typeof QUIZ_QUESTIONS)[number], optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    trackEvent({ name: "question_answered", questionNumber: question.number });
  }

  function handleNext(question: (typeof QUIZ_QUESTIONS)[number], index: number) {
    if (question.interstitial) {
      setStep({ kind: "interstitial", afterIndex: index, text: question.interstitial });
    } else {
      goToStep(index + 1);
    }
  }

  function handleBackFromQuestion(index: number) {
    if (index === 0) {
      setStep({ kind: "start" });
    } else {
      setStep({ kind: "question", index: index - 1 });
    }
  }

  async function handleEmailSubmit(data: { firstName: string; email: string; website: string }) {
    setSubmitting(true);
    setSubmitError(undefined);
    trackEvent({ name: "email_submitted" });

    const result = await submitQuiz({ ...data, answers });

    setSubmitting(false);

    if (result.success) {
      trackEvent({ name: "brevo_success" });
      setStep({ kind: "success" });
    } else {
      trackEvent({ name: "brevo_error" });
      setSubmitError(result.error ?? "Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    }
  }

  const currentQuestion = useMemo(() => {
    if (step.kind === "question") return QUIZ_QUESTIONS[step.index];
    return undefined;
  }, [step]);

  return (
    <main className="app-shell">
      {step.kind === "start" && <StartScreen onStart={handleStart} />}

      {step.kind === "question" && currentQuestion && (
        <QuestionScreen
          question={currentQuestion}
          totalQuestions={totalQuestions}
          selectedOptionId={answers[currentQuestion.id]}
          onSelect={(optionId) => handleSelect(currentQuestion, optionId)}
          onNext={() => handleNext(currentQuestion, step.index)}
          onBack={() => handleBackFromQuestion(step.index)}
          canGoBack
        />
      )}

      {step.kind === "interstitial" && (
        <InterstitialScreen
          text={step.text}
          onContinue={() => goToStep(step.afterIndex + 1)}
          onBack={() => setStep({ kind: "question", index: step.afterIndex })}
        />
      )}

      {step.kind === "email" && (
        <EmailGate
          onSubmit={handleEmailSubmit}
          onBack={() => setStep({ kind: "question", index: totalQuestions - 1 })}
          submitting={submitting}
          errorMessage={submitError}
        />
      )}

      {step.kind === "success" && <SuccessScreen />}

      <Footer />
    </main>
  );
}
