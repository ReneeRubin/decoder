import type { QuizAnswers, QuizSubmitResponse } from "../types";

/**
 * Ruft die Cloudflare Pages Function /api/submit-quiz auf. Sendet
 * ausschließlich Rohantworten + Kontaktdaten – NIE ein fertiges Ergebnis
 * (das gibt es im Frontend gar nicht, siehe Vorgabe Abschnitt 9).
 */
export async function submitQuiz(input: {
  firstName: string;
  email: string;
  answers: QuizAnswers;
  website: string;
}): Promise<QuizSubmitResponse> {
  try {
    const response = await fetch("/api/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = (await response.json()) as QuizSubmitResponse;
    return data;
  } catch {
    return { success: false, error: "Verbindung fehlgeschlagen. Bitte versuche es erneut." };
  }
}
