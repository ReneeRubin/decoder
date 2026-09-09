import { describe, expect, it } from "vitest";
import { onRequestPost, type Env } from "./submit-quiz";
import type { QuizSubmitResponse } from "../../src/types";

function buildContext(body: unknown, env: Partial<Env> = {}) {
  const request = new Request("https://rueckenbewusst-sein.de/api/submit-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.1" },
    body: JSON.stringify(body),
  });

  // Minimaler EventContext-Mock – für unsere Funktion werden nur request/env benötigt.
  return { request, env } as unknown as Parameters<typeof onRequestPost>[0];
}

function fullValidAnswers() {
  // Ergibt Hauptcode A (siehe scoring.test.ts, "Alle A-Antworten").
  return {
    q1: "A",
    q2: "A",
    q3: "A",
    q4: "A",
    q5: "A",
    q6: "A",
    q7: "A",
    q8: "A",
    q9: "A",
    q10: "A",
    q11: "E",
    q12: "E",
  };
}

describe("17. manipulierte Score-Daten", () => {
  it("ignoriert ein vom Client mitgesendetes fertiges Ergebnis vollständig", async () => {
    const response = await onRequestPost(
      buildContext(
        {
          firstName: "Anna",
          email: "anna@example.com",
          answers: fullValidAnswers(),
          // Manipulationsversuch: Client behauptet, das Ergebnis sei bereits berechnet.
          result: "Die Überladene",
          mainCode: "E",
          score: 999,
        },
        {}, // kein BREVO_API_KEY -> Mock-Modus, kein echter Netzwerkaufruf nötig
      ),
    );

    const body = (await response.json()) as QuizSubmitResponse;
    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    // Die Response selbst darf laut Vorgabe (Abschnitt 5/71) ohnehin nie ein
    // Ergebnis enthalten – die eigentliche serverseitige Neuberechnung wird
    // in scoring.test.ts ausführlich verifiziert.
  });
});

describe("End-to-End-Simulation (Vorgabe Abschnitt 58)", () => {
  it("liefert bei vollständigem, gültigem Submit Erfolg zurück und leakt kein Ergebnis", async () => {
    const response = await onRequestPost(
      buildContext({
        firstName: "Anna",
        email: "anna@example.com",
        answers: fullValidAnswers(),
      }),
    );
    const body = (await response.json()) as QuizSubmitResponse;
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(JSON.stringify(body)).not.toMatch(/Funktionierende|Überladene|Energie|Emotionen|Gedanken/);
  });

  it("lehnt eine unvollständige Antwort ab (fehlende Frage)", async () => {
    const response = await onRequestPost(
      buildContext({
        firstName: "Anna",
        email: "anna@example.com",
        answers: { q1: "A" },
      }),
    );
    const body = (await response.json()) as QuizSubmitResponse;
    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("lehnt eine ungültige E-Mail-Adresse ab", async () => {
    const response = await onRequestPost(
      buildContext({
        firstName: "Anna",
        email: "nicht-valide",
        answers: fullValidAnswers(),
      }),
    );
    expect(response.status).toBe(400);
  });

  it("verwirft eine Anfrage mit ausgefülltem Honeypot-Feld still (kein Fehler an Bots)", async () => {
    const response = await onRequestPost(
      buildContext({
        firstName: "Bot",
        email: "bot@example.com",
        answers: fullValidAnswers(),
        website: "http://spam.example",
      }),
    );
    const body = (await response.json()) as QuizSubmitResponse;
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });
});
