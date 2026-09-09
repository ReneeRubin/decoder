import { QUIZ_QUESTIONS } from "../data/quiz";
import type { QuizAnswers } from "../types";

/** Bewusst simples, robustes E-Mail-Format (RFC-vollständige Validierung ist nicht Ziel von V1). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);
}

export function isValidFirstName(firstName: unknown): firstName is string {
  if (typeof firstName !== "string") return false;
  const trimmed = firstName.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_NAME_LENGTH;
}

/** Entfernt Steuerzeichen und kürzt auf eine sinnvolle Maximallänge, bevor Werte an Brevo gehen. */
export function sanitizeText(value: string, maxLength: number): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, maxLength);
}

/**
 * Prüft, dass für JEDE der 12 Fragen eine gültige, existierende Options-ID
 * übergeben wurde. Das verhindert sowohl fehlende Antworten als auch
 * manipulierte/erfundene Antwort-IDs, die die Score-Berechnung verfälschen
 * könnten (Vorgabe Abschnitt 9: "Die vom Browser übermittelten Score-Werte
 * dürfen niemals vertraut werden" – hier geht es zusätzlich darum, dass auch
 * die Rohantworten selbst plausibel sein müssen).
 */
export function validateAnswers(answers: unknown): ValidationResult {
  const errors: string[] = [];

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { valid: false, errors: ["Antworten fehlen oder haben ein ungültiges Format."] };
  }

  const typedAnswers = answers as QuizAnswers;

  for (const question of QUIZ_QUESTIONS) {
    const chosen = typedAnswers[question.id];
    if (typeof chosen !== "string" || chosen.length === 0) {
      errors.push(`Antwort für Frage ${question.number} fehlt.`);
      continue;
    }
    const optionExists = question.options.some((o) => o.id === chosen);
    if (!optionExists) {
      errors.push(`Antwort für Frage ${question.number} ist ungültig.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export interface QuizSubmissionInput {
  firstName?: unknown;
  email?: unknown;
  answers?: unknown;
  website?: unknown;
}

export interface ValidatedQuizSubmission {
  firstName: string;
  email: string;
  answers: QuizAnswers;
}

export interface QuizSubmissionValidation {
  valid: boolean;
  errors: string[];
  data?: ValidatedQuizSubmission;
  /** true, wenn das Honeypot-Feld befüllt wurde (=> vermutlich Bot, Submit soll still verworfen werden). */
  isBot: boolean;
}

export function validateQuizSubmission(input: QuizSubmissionInput): QuizSubmissionValidation {
  const errors: string[] = [];

  // Honeypot: unsichtbares Feld, das nur Bots ausfüllen. Menschliche Nutzerinnen sehen es nie.
  const isBot = typeof input.website === "string" && input.website.trim().length > 0;

  if (!isValidFirstName(input.firstName)) {
    errors.push("Bitte gib deinen Vornamen ein.");
  }

  if (!isValidEmail(input.email)) {
    errors.push("Bitte gib eine gültige E-Mail-Adresse ein.");
  }

  const answersResult = validateAnswers(input.answers);
  errors.push(...answersResult.errors);

  if (errors.length > 0 || isBot) {
    return { valid: false, errors, isBot };
  }

  return {
    valid: true,
    errors: [],
    isBot: false,
    data: {
      firstName: sanitizeText(input.firstName as string, 80),
      email: (input.email as string).trim().toLowerCase(),
      answers: input.answers as QuizAnswers,
    },
  };
}
