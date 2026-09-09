import { MAIN_QUESTIONS, QUIZ_QUESTIONS, SPUR_QUESTIONS } from "../data/quiz";
import type {
  MainCodeId,
  MainCodeResult,
  MainCodeScoreBoard,
  QuizAnswers,
  QuizResult,
  SpurId,
  SpurResult,
  SpurScoreBoard,
} from "../types";

const ALL_MAIN_CODES: MainCodeId[] = ["A", "B", "C", "D", "E"];

/**
 * Priorisierte Reihenfolge der Spur-Dimensionen. Entspricht der fachlichen
 * Reihenfolge "Frage 10 vor Frage 11 vor Frage 12" (Energie/Emotionen/Gedanken)
 * und wird als deterministische Sortier-/Tie-Break-Reihenfolge verwendet
 * (siehe calculateCurrentSpur).
 */
const SPUR_PRIORITY_ORDER: SpurId[] = ["ENERGIE", "EMOTIONEN", "GEDANKEN"];

export const MAIN_CODE_LABELS: Record<MainCodeId, string> = {
  A: "Die Funktionierende",
  B: "Die Verantwortungsträgerin",
  C: "Die Kontrollierende",
  D: "Die Angepasste",
  E: "Die Überladene",
};

export const SPUR_LABELS: Record<SpurId, string> = {
  ENERGIE: "Energie",
  EMOTIONEN: "Emotionen",
  GEDANKEN: "Gedanken",
};

/** Ab welchem Punkteabstand gilt der Hauptcode als klar eindeutig (Vorgabe Abschnitt 25). */
const MAIN_CODE_CLEAR_GAP = 3;

/** Summiert die Hauptcode-Punkte ausschließlich aus Fragen 1–9. */
export function computeMainScores(answers: QuizAnswers): MainCodeScoreBoard {
  const scores: MainCodeScoreBoard = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const question of MAIN_QUESTIONS) {
    const chosenOptionId = answers[question.id];
    if (!chosenOptionId) continue;
    const option = question.options.find((o) => o.id === chosenOptionId);
    if (!option?.mainWeights) continue;
    for (const key of Object.keys(option.mainWeights) as MainCodeId[]) {
      scores[key] += option.mainWeights[key] ?? 0;
    }
  }
  return scores;
}

/** Summiert die Spur-Punkte ausschließlich aus Fragen 10–12. Beeinflusst NIE den Hauptcode. */
export function computeSpurScores(answers: QuizAnswers): SpurScoreBoard {
  const scores: SpurScoreBoard = { ENERGIE: 0, EMOTIONEN: 0, GEDANKEN: 0 };
  for (const question of SPUR_QUESTIONS) {
    const chosenOptionId = answers[question.id];
    if (!chosenOptionId) continue;
    const option = question.options.find((o) => o.id === chosenOptionId);
    if (!option?.spurWeights) continue;
    for (const key of Object.keys(option.spurWeights) as SpurId[]) {
      scores[key] += option.spurWeights[key] ?? 0;
    }
  }
  return scores;
}

/**
 * Ermittelt den einzelnen Haupt-Typ, den eine bestimmte Antwort auf eine
 * Hauptcode-Frage vergibt. Wird ausschließlich für den Tie-Breaker über
 * Frage 5 bzw. Frage 6 benötigt – dort vergibt laut Vorgabe jede Option
 * Punkte an genau einen Typ.
 */
function dominantMainType(questionId: string, answers: QuizAnswers): MainCodeId | undefined {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  const chosenOptionId = answers[questionId];
  const option = question?.options.find((o) => o.id === chosenOptionId);
  const weights = option?.mainWeights;
  if (!weights) return undefined;
  const entries = Object.entries(weights) as [MainCodeId, number][];
  if (entries.length === 0) return undefined;
  return entries.reduce((best, current) => (current[1] > best[1] ? current : best))[0];
}

/**
 * Deterministischer Tie-Breaker für den Hauptcode (Vorgabe Abschnitt 25):
 * 1. Frage 5 (Signature-Frage) – der dort gewählte Typ gewinnt, falls er
 *    unter den gleichauf liegenden Kandidaten ist.
 * 2. Frage 6 – gleiches Prinzip als zweiter Tie-Breaker.
 * 3. Alphabetischer Fallback (A vor B vor C vor D vor E). Dieser dritte
 *    Schritt ist in der fachlichen Vorgabe NICHT spezifiziert, aber für ein
 *    deterministisches Ergebnis technisch notwendig, falls Fragen 5 und 6
 *    den Gleichstand nicht auflösen (z.B. weil beide Antworten keinem der
 *    verbliebenen Kandidaten zugeordnet sind).
 */
function resolveMainCodeTie(candidates: MainCodeId[], answers: QuizAnswers): MainCodeId {
  if (candidates.length === 1) return candidates[0];

  const q5Type = dominantMainType("q5", answers);
  if (q5Type && candidates.includes(q5Type)) return q5Type;

  const q6Type = dominantMainType("q6", answers);
  if (q6Type && candidates.includes(q6Type)) return q6Type;

  return [...candidates].sort()[0];
}

function topCandidates(scores: MainCodeScoreBoard, pool: MainCodeId[]): MainCodeId[] {
  const max = Math.max(...pool.map((t) => scores[t]));
  return pool.filter((t) => scores[t] === max);
}

/**
 * Berechnet Hauptcode UND Sekundärcode (Vorgabe Abschnitt 25).
 * Der Sekundärcode wird IMMER berechnet (er wird immer an Brevo übermittelt),
 * `showSecondary` markiert lediglich, ob der Abstand < 3 Punkte beträgt und
 * der Sekundärcode inhaltlich als ergänzende Facette kommuniziert werden soll.
 */
export function calculateMainCode(answers: QuizAnswers): MainCodeResult {
  const scores = computeMainScores(answers);

  const mainCandidates = topCandidates(scores, ALL_MAIN_CODES);
  const code = resolveMainCodeTie(mainCandidates, answers);

  const remaining = ALL_MAIN_CODES.filter((t) => t !== code);
  const secondaryCandidates = topCandidates(scores, remaining);
  const secondaryCode = resolveMainCodeTie(secondaryCandidates, answers);

  const gap = scores[code] - scores[secondaryCode];
  const showSecondary = gap < MAIN_CODE_CLEAR_GAP;

  return { code, secondaryCode, showSecondary, scores };
}

/** Praktischer Alias, falls nur der Sekundärcode benötigt wird. */
export function calculateSecondaryCode(answers: QuizAnswers): MainCodeId {
  return calculateMainCode(answers).secondaryCode;
}

/**
 * Berechnet die aktuelle Spur ausschließlich aus Fragen 10–12 (Vorgabe
 * Abschnitt 29). Tie-Break-Regel:
 * 1. "Stärkere Herausforderung" entspricht bereits dem reinen Punktewert –
 *    da jede der drei Fragen ausschließlich auf ihre eigene Dimension
 *    einzahlt, ist dieser Schritt im aktuellen Scoring-Modell bereits durch
 *    den Score selbst abgedeckt und liefert bei einem Gleichstand keine
 *    zusätzliche Information.
 * 2. Frage 10 vor Frage 11 vor Frage 12 – wird als stabile Prioritäts-/
 *    Sortierreihenfolge der Dimensionen verwendet (SPUR_PRIORITY_ORDER).
 * 3. Bleiben nach Schritt 1+2 mehrere Dimensionen gleichauf, werden ALLE
 *    gleichauf liegenden Dimensionen zurückgegeben (`ids.length > 1`), in
 *    der Prioritätsreihenfolge sortiert – z.B. "Energie + Gedanken". Das
 *    entspricht wörtlich der Vorgabe ("Zeige beide").
 */
export function calculateCurrentSpur(answers: QuizAnswers): SpurResult {
  const scores = computeSpurScores(answers);
  const max = Math.max(...SPUR_PRIORITY_ORDER.map((s) => scores[s]));
  const ids = SPUR_PRIORITY_ORDER.filter((s) => scores[s] === max);
  return { ids, scores };
}

export function formatSpurLabel(ids: SpurId[]): string {
  return ids.map((id) => SPUR_LABELS[id]).join(" + ");
}

/** Führt Hauptcode- und Spur-Berechnung zu einem vollständigen, versionierten Ergebnis zusammen. */
export function calculateResult(answers: QuizAnswers, version: string): QuizResult {
  return {
    main: calculateMainCode(answers),
    spur: calculateCurrentSpur(answers),
    version,
    calculatedAt: new Date().toISOString(),
  };
}
