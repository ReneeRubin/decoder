/**
 * Zentrale Datentypen für den Rücken-Decoder.
 * Keine `any`-Typen – siehe Vorgabe Abschnitt 56.
 */

export type MainCodeId = "A" | "B" | "C" | "D" | "E";

export type SpurId = "ENERGIE" | "EMOTIONEN" | "GEDANKEN";

/** Eine einzelne Antwortoption innerhalb einer Frage. */
export interface AnswerOption {
  /** Buchstabe der Option, z.B. "A". Dient als eindeutige ID innerhalb der Frage. */
  id: string;
  text: string;
  /** Punkte auf die fünf Hauptcode-Typen (nur Fragen 1–9). */
  mainWeights?: Partial<Record<MainCodeId, number>>;
  /** Punkte auf die drei Spur-Dimensionen (nur Fragen 10–12). */
  spurWeights?: Partial<Record<SpurId, number>>;
}

export type QuestionGroup = "main" | "spur";

export interface QuizQuestion {
  /** 1-basierter Fragenindex (1–12), entspricht der fachlichen Nummerierung. */
  number: number;
  id: string;
  group: QuestionGroup;
  text: string;
  options: AnswerOption[];
  /** Optionaler Zwischentext, der NACH der Beantwortung dieser Frage angezeigt wird. */
  interstitial?: string;
}

/** Rohantwort einer Nutzerin: Fragen-ID -> gewählte Options-ID. */
export type QuizAnswers = Record<string, string>;

export interface MainCodeScoreBoard {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

export interface SpurScoreBoard {
  ENERGIE: number;
  EMOTIONEN: number;
  GEDANKEN: number;
}

export interface MainCodeResult {
  code: MainCodeId;
  /** Sekundärcode ist immer berechnet (wird immer an Brevo übermittelt). */
  secondaryCode: MainCodeId;
  /** true, wenn der Abstand < 3 Punkte beträgt und der Sekundärcode inhaltlich ergänzend gezeigt werden soll. */
  showSecondary: boolean;
  scores: MainCodeScoreBoard;
}

export interface SpurResult {
  /** Ein oder zwei Spuren, wenn nach allen Tie-Breakern weiterhin Gleichstand besteht. */
  ids: SpurId[];
  scores: SpurScoreBoard;
}

export interface QuizResult {
  main: MainCodeResult;
  spur: SpurResult;
  version: string;
  calculatedAt: string;
}

export interface EmailGateData {
  firstName: string;
  email: string;
}

/** Vom Client gesendetes Submit-Payload. Enthält ausschließlich Rohantworten – NIE fertige Scores. */
export interface QuizSubmitRequest {
  firstName: string;
  email: string;
  answers: QuizAnswers;
  /** Honeypot-Feld gegen einfache Bots. Muss leer sein. */
  website?: string;
}

export interface QuizSubmitResponse {
  success: boolean;
  error?: string;
}

export interface BrevoContactAttributes {
  FNAME: string;
  SCHMERZ_DECODER_ERGEBNIS: string;
  SCHMERZ_DECODER_SEKUNDAERCODE: string;
  SCHMERZ_DECODER_SPUR: string;
  SCHMERZ_DECODER_VERSION: string;
  SCHMERZ_DECODER_DATUM: string;
}

export interface BrevoContactPayload {
  email: string;
  attributes: BrevoContactAttributes;
  listIds: number[];
  updateEnabled: true;
}
