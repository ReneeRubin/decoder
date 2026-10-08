import type { MainCodeId } from "../types";

/**
 * Echte Kunden-Testimonials, bereitgestellt von Renée (WhatsApp-Nachrichten
 * von Klientinnen). Zur Wahrung der Privatsphäre wird nur der Vorname
 * verwendet, nicht der vollständige Name aus dem Chat-Verlauf.
 *
 * `mainCode` ordnet ein Testimonial optional einem Hauptcode zu (von Renée
 * vorgegeben, nicht selbst interpretiert) – relevant für die spätere
 * Auswahl in der Brevo-Ergebnis-Mail (siehe docs/brevo-email-content.md).
 * Auf der Website selbst werden Testimonials weiterhin OHNE Code-Bezug
 * gezeigt (Startseite, vor Kenntnis des Ergebnisses).
 *
 * WICHTIG: Es liegt keine dokumentierte, ausdrückliche schriftliche
 * Einwilligung zur ÖFFENTLICHEN Veröffentlichung dieser ursprünglich
 * privaten Nachrichten vor – nur die Bereitstellung durch die Absenderin
 * (Renée) selbst. Bitte vor Live-Schaltung final bestätigen, dass die
 * Klientinnen mit der Veröffentlichung (Vorname + Zitat) einverstanden
 * sind. Nichts an den Zitaten wurde inhaltlich verändert, nur gekürzt.
 *
 * TODO: Für Barbara (Typ B), Anja (Typ A) und Lorenza (Typ D) liegen bisher
 * nur Name + Code-Zuordnung vor, aber noch kein Zitat-Text/Screenshot.
 * Julia (Typ E) fehlt ebenfalls noch als Zitat. Bitte nachreichen, siehe
 * content/testimonials.md.
 */

export interface Testimonial {
  name: string;
  quote: string;
  context: string;
  mainCode?: MainCodeId;
  /** false = wird nur für Doku/E-Mail-Zuordnung gehalten, nicht auf der Startseite gezeigt (z.B. um doppelte Namen zu vermeiden). */
  showOnSite?: boolean;
}

/**
 * Meta-konform gekürzt (10/2026): Aussagen über Schmerzen, Körper oder
 * Heilung stehen bewusst NICHT im Website-Code, damit Meta die Seite nicht
 * als gesundheitsbezogen einstuft. Die vollständigen Zitate stehen in
 * content/testimonials.md (für die E-Mails).
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alexandra",
    quote: "Ich bin in meiner Mitte angekommen, habe Frieden gemacht mit so vielen Dingen.",
    context: "nach 4 Monaten Begleitung",
    mainCode: "E",
  },
  {
    name: "Verena",
    quote: "Du hast mir vieles gezeigt, was ich eigentlich fast verloren hatte.",
    context: "nach der Begleitung",
    mainCode: "C",
  },
];

export const SITE_TESTIMONIALS = TESTIMONIALS.filter((t) => t.showOnSite !== false);
