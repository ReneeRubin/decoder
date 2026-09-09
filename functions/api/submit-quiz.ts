import { calculateResult, formatSpurLabel, MAIN_CODE_LABELS } from "../../src/lib/scoring";
import { validateQuizSubmission } from "../../src/lib/validation";
import { upsertBrevoContact } from "../../src/lib/brevo";
import type { BrevoContactAttributes, QuizSubmitResponse } from "../../src/types";

/**
 * Cloudflare Pages Function: POST /api/submit-quiz
 *
 * Architekturregel (Vorgabe Abschnitt 4 & 9): Der Client sendet AUSSCHLIESSLICH
 * Rohantworten. Diese Funktion berechnet Hauptcode, Sekundärcode und aktuelle
 * Spur selbst neu – niemals wird ein vom Client mitgesendetes Ergebnis
 * übernommen. Die Response an den Client enthält NIE das Ergebnis (siehe
 * Abschnitt 5/71) – nur Erfolg/Fehler.
 */

export interface Env {
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  QUIZ_VERSION?: string;
}

const DEFAULT_LIST_ID = 24;

// Sehr einfaches, isolat-lokales Rate Limiting als zusätzliche Abuse-Bremse.
// WICHTIG: Dies ersetzt KEIN serverseitiges Rate Limiting auf Cloudflare-Ebene
// (Cloudflare Rate Limiting Rules im Dashboard) – das ist für Produktion
// zusätzlich TODO/empfohlen, da einzelne Isolates nicht global synchronisiert
// sind. Für V1 ohne zusätzliche Infrastruktur (KV/DB) ist dies eine bewusst
// einfache, kostenfreie erste Verteidigungslinie.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function jsonResponse(body: QuizSubmitResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  if (isRateLimited(ip)) {
    return jsonResponse({ success: false, error: "Zu viele Anfragen. Bitte versuche es später erneut." }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Ungültige Anfrage." }, 400);
  }

  const validation = validateQuizSubmission(
    body as { firstName?: unknown; email?: unknown; answers?: unknown; website?: unknown },
  );

  // Honeypot ausgelöst: Antwort wie "Erfolg" simulieren, aber nichts verarbeiten
  // (kein Hinweis an Bots, dass sie erkannt wurden).
  if (validation.isBot) {
    return jsonResponse({ success: true }, 200);
  }

  if (!validation.valid || !validation.data) {
    return jsonResponse({ success: false, error: validation.errors.join(" ") }, 400);
  }

  const { firstName, email, answers } = validation.data;

  // Serverseitige Neuberechnung – der Client hat zu keinem Zeitpunkt ein
  // fertiges Ergebnis mitgeschickt (es existiert im Frontend gar nicht).
  const version = env.QUIZ_VERSION ?? "v1";
  const result = calculateResult(answers, version);

  const attributes: BrevoContactAttributes = {
    FNAME: firstName,
    SCHMERZ_DECODER_ERGEBNIS: MAIN_CODE_LABELS[result.main.code],
    SCHMERZ_DECODER_SEKUNDAERCODE: MAIN_CODE_LABELS[result.main.secondaryCode],
    SCHMERZ_DECODER_SPUR: formatSpurLabel(result.spur.ids),
    SCHMERZ_DECODER_VERSION: result.version,
    SCHMERZ_DECODER_DATUM: result.calculatedAt.slice(0, 10),
  };

  const listId = Number.parseInt(env.BREVO_LIST_ID ?? "", 10) || DEFAULT_LIST_ID;

  const brevoResult = await upsertBrevoContact({ apiKey: env.BREVO_API_KEY, listId }, email, attributes);

  if (!brevoResult.success) {
    return jsonResponse({ success: false, error: "Dein Ergebnis konnte nicht verarbeitet werden." }, 502);
  }

  return jsonResponse({ success: true }, 200);
};

export const onRequestGet: PagesFunction = async () => {
  return jsonResponse({ success: false, error: "Method not allowed" }, 405);
};
