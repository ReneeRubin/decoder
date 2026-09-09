import { describe, expect, it } from "vitest";
import {
  calculateCurrentSpur,
  calculateMainCode,
  formatSpurLabel,
} from "./scoring";
import type { QuizAnswers } from "../types";

/**
 * Alle Erwartungswerte in dieser Datei wurden von Hand anhand der
 * Gewichtungstabelle aus der fachlichen Vorgabe (Abschnitte 16–29)
 * nachgerechnet – nicht aus dem Code abgeleitet.
 */

const NEUTRAL_SPUR: Partial<QuizAnswers> = { q10: "E", q11: "E", q12: "E" };

function withAllOption(letter: string): QuizAnswers {
  return {
    q1: letter,
    q2: letter,
    q3: letter,
    q4: letter,
    q5: letter,
    q6: letter,
    q7: letter,
    q8: letter,
    q9: letter,
    ...NEUTRAL_SPUR,
  };
}

describe("calculateMainCode – konsistente Buchstaben-Antworten (Fragen 1-9)", () => {
  it("1. Alle A-Antworten -> Hauptcode A, Sekundärcode D, kein knapper Abstand", () => {
    const result = calculateMainCode(withAllOption("A"));
    expect(result.scores).toEqual({ A: 12, B: 2, C: 0, D: 5, E: 1 });
    expect(result.code).toBe("A");
    expect(result.secondaryCode).toBe("D");
    expect(result.showSecondary).toBe(false);
  });

  it("2. Alle B-Antworten -> Hauptcode A (!), Sekundärcode B, knapper Abstand < 3", () => {
    const result = calculateMainCode(withAllOption("B"));
    expect(result.scores).toEqual({ A: 9, B: 7, C: 1, D: 0, E: 1 });
    expect(result.code).toBe("A");
    expect(result.secondaryCode).toBe("B");
    expect(result.showSecondary).toBe(true);
  });

  it("3. Alle C-Antworten -> Hauptcode C, Sekundärcode D (Tie-Break D vs. E via Alphabet-Fallback)", () => {
    const result = calculateMainCode(withAllOption("C"));
    expect(result.scores).toEqual({ A: 0, B: 1, C: 14, D: 2, E: 2 });
    expect(result.code).toBe("C");
    expect(result.secondaryCode).toBe("D");
    expect(result.showSecondary).toBe(false);
  });

  it("4. Alle D-Antworten -> Hauptcode D, Sekundärcode E", () => {
    const result = calculateMainCode(withAllOption("D"));
    expect(result.scores).toEqual({ A: 1, B: 2, C: 3, D: 9, E: 4 });
    expect(result.code).toBe("D");
    expect(result.secondaryCode).toBe("E");
    expect(result.showSecondary).toBe(false);
  });

  it("5. Alle E-Antworten -> Hauptcode E, Sekundärcode A (Vierer-Tie via Alphabet-Fallback)", () => {
    const result = calculateMainCode(withAllOption("E"));
    expect(result.scores).toEqual({ A: 0, B: 0, C: 0, D: 0, E: 15 });
    expect(result.code).toBe("E");
    expect(result.secondaryCode).toBe("A");
    expect(result.showSecondary).toBe(false);
  });
});

describe("calculateMainCode – Mischprofil & Tie-Breaker", () => {
  it("6. Mischprofil ergibt eine plausible, korrekt aufsummierte Kombination", () => {
    const answers: QuizAnswers = {
      q1: "D", // A+1, E+1
      q2: "D", // C+1, E+1
      q3: "A", // D+2
      q4: "E", // E+2
      q5: "E", // E+3 (Signature-Frage)
      q6: "E", // E+2
      q7: "D", // E+2
      q8: "E", // E+2
      q9: "E", // E+2
      ...NEUTRAL_SPUR,
    };
    const result = calculateMainCode(answers);
    // A: 1 | C: 1 | D: 2 | E: 1+1+2+3+2+2+2+2 = 15
    expect(result.scores).toEqual({ A: 1, B: 0, C: 1, D: 2, E: 15 });
    expect(result.code).toBe("E");
    expect(result.secondaryCode).toBe("D");
    expect(result.showSecondary).toBe(false);
  });

  it("7. Hauptcode-Tie-Break: Dreier-Gleichstand A/C/D wird über Frage 5 zugunsten C aufgelöst", () => {
    const answers: QuizAnswers = {
      q1: "A", // A+2
      q2: "E", // (0)
      q3: "E", // E+2
      q4: "A", // B+2
      q5: "C", // C+3 (Signature-Frage entscheidet den Tie-Break)
      q6: "F", // D+2
      q7: "E", // (0)
      q8: "F", // (0)
      q9: "A", // A+1, D+1
      ...NEUTRAL_SPUR,
    };
    const result = calculateMainCode(answers);
    // A: 2+1=3 | B: 2 | C: 3 | D: 2+1=3 | E: 2
    expect(result.scores).toEqual({ A: 3, B: 2, C: 3, D: 3, E: 2 });
    expect(result.code).toBe("C");
  });

  it("8. Sekundärcode-Tie-Break: nach Wahl des Hauptcodes entscheidet Frage 6 zwischen A und D", () => {
    // Gleiche Antworten wie Test 7: nach Wahl von C als Hauptcode bleiben
    // A und D mit je 3 Punkten gleichauf. Frage 6 = "F" -> Typ D gewinnt.
    const answers: QuizAnswers = {
      q1: "A",
      q2: "E",
      q3: "E",
      q4: "A",
      q5: "C",
      q6: "F",
      q7: "E",
      q8: "F",
      q9: "A",
      ...NEUTRAL_SPUR,
    };
    const result = calculateMainCode(answers);
    expect(result.code).toBe("C");
    expect(result.secondaryCode).toBe("D");
    // Abstand Hauptcode (3) zu Sekundärcode (3) = 0 < 3 -> ergänzende Facette anzeigen.
    expect(result.showSecondary).toBe(true);
  });
});

describe("calculateCurrentSpur – Fragen 10-12", () => {
  it("9. Energie-Spur wird korrekt erkannt", () => {
    const result = calculateCurrentSpur({ q10: "A", q11: "E", q12: "E" });
    expect(result.scores).toEqual({ ENERGIE: 3, EMOTIONEN: 1, GEDANKEN: 1 });
    expect(result.ids).toEqual(["ENERGIE"]);
  });

  it("10. Emotionen-Spur wird korrekt erkannt", () => {
    const result = calculateCurrentSpur({ q10: "E", q11: "A", q12: "E" });
    expect(result.scores).toEqual({ ENERGIE: 2, EMOTIONEN: 3, GEDANKEN: 1 });
    expect(result.ids).toEqual(["EMOTIONEN"]);
  });

  it("11. Gedanken-Spur wird korrekt erkannt", () => {
    const result = calculateCurrentSpur({ q10: "E", q11: "E", q12: "A" });
    expect(result.scores).toEqual({ ENERGIE: 2, EMOTIONEN: 1, GEDANKEN: 3 });
    expect(result.ids).toEqual(["GEDANKEN"]);
  });

  it("12. Gleichstand bei Spuren zeigt beide Dimensionen in Prioritätsreihenfolge", () => {
    const result = calculateCurrentSpur({ q10: "A", q11: "E", q12: "A" });
    expect(result.scores).toEqual({ ENERGIE: 3, EMOTIONEN: 1, GEDANKEN: 3 });
    expect(result.ids).toEqual(["ENERGIE", "GEDANKEN"]);
    expect(formatSpurLabel(result.ids)).toBe("Energie + Gedanken");
  });
});

describe("Unabhängigkeit von Hauptcode und Spur", () => {
  it("13. Fragen 10-12 verändern den Hauptcode NICHT", () => {
    const baseMainAnswers: QuizAnswers = {
      q1: "A",
      q2: "A",
      q3: "B",
      q4: "B",
      q5: "A",
      q6: "A",
      q7: "B",
      q8: "A",
      q9: "A",
    };

    const withSpurA = calculateMainCode({ ...baseMainAnswers, q10: "A", q11: "A", q12: "A" });
    const withSpurE = calculateMainCode({ ...baseMainAnswers, q10: "E", q11: "E", q12: "E" });
    const withoutSpur = calculateMainCode(baseMainAnswers);

    expect(withSpurA).toEqual(withoutSpur);
    expect(withSpurE).toEqual(withoutSpur);
  });
});
