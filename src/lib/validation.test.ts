import { describe, expect, it } from "vitest";
import { isValidEmail, validateAnswers, validateQuizSubmission } from "./validation";

function fullValidAnswers() {
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
    q11: "A",
    q12: "A",
  };
}

describe("15. ungültige E-Mail", () => {
  it("lehnt offensichtlich ungültige E-Mail-Adressen ab", () => {
    expect(isValidEmail("keine-email")).toBe(false);
    expect(isValidEmail("fehlt@")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });

  it("akzeptiert eine plausible E-Mail-Adresse", () => {
    expect(isValidEmail("anna@example.com")).toBe(true);
  });

  it("validateQuizSubmission liefert Fehler bei ungültiger E-Mail", () => {
    const result = validateQuizSubmission({
      firstName: "Anna",
      email: "keine-email",
      answers: fullValidAnswers(),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/E-Mail/);
  });
});

describe("16. fehlende Antwort", () => {
  it("erkennt eine fehlende Antwort auf eine Pflichtfrage", () => {
    const answers = fullValidAnswers();
    // @ts-expect-error – bewusst eine Antwort entfernen, um das Fehlerhandling zu testen.
    delete answers.q7;
    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Frage 7"))).toBe(true);
  });

  it("erkennt eine ungültige/erfundene Options-ID", () => {
    const answers = { ...fullValidAnswers(), q3: "Z" };
    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Frage 3"))).toBe(true);
  });

  it("validateQuizSubmission scheitert bei fehlenden Antworten trotz gültiger Kontaktdaten", () => {
    const result = validateQuizSubmission({
      firstName: "Anna",
      email: "anna@example.com",
      answers: { q1: "A" },
    });
    expect(result.valid).toBe(false);
    expect(result.data).toBeUndefined();
  });
});

describe("Honeypot", () => {
  it("markiert eine Anfrage mit befülltem Honeypot-Feld als Bot", () => {
    const result = validateQuizSubmission({
      firstName: "Anna",
      email: "anna@example.com",
      answers: fullValidAnswers(),
      website: "http://spam.example",
    });
    expect(result.isBot).toBe(true);
    expect(result.valid).toBe(false);
  });
});
