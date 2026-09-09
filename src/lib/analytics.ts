/**
 * Zentrale Tracking-Events (Vorgabe Abschnitt 54). Absichtlich minimal:
 * KEINE E-Mail-Adressen, KEINE Antwortinhalte, KEINE sonstigen
 * personenbezogenen Daten werden an Analytics übergeben.
 *
 * Diese Datei definiert nur die Schnittstelle. An welchen Analytics-Provider
 * (z.B. Plausible, Cloudflare Web Analytics) tatsächlich gesendet wird, ist
 * TODO – dafür fehlen aktuell Zugangsdaten/Entscheidung des Auftraggebers.
 * Bis dahin wird ausschließlich in die Browser-Konsole geloggt (no-op in
 * Produktion möglich, siehe trackEvent).
 */

export type AnalyticsEvent =
  | { name: "quiz_started" }
  | { name: "question_answered"; questionNumber: number }
  | { name: "quiz_completed" }
  | { name: "email_submitted" }
  | { name: "brevo_success" }
  | { name: "brevo_error" }
  | { name: "calendly_clicked" };

// TODO: Echten Analytics-Provider anbinden (z.B. Cloudflare Web Analytics /
// Plausible). Aktuell nur Konsolen-Log für lokale Entwicklung/Debugging.
export function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", event.name, event);
  }
}
