/**
 * Zentrale Client-Konfiguration. Alle Werte kommen aus Vite-Env-Variablen
 * (Prefix VITE_, siehe .env.example) und werden NIE hartcodiert im Code verteilt.
 *
 * Secrets (z.B. BREVO_API_KEY) gehören NICHT hierher – die stehen ausschließlich
 * serverseitig in den Cloudflare Pages Functions Environment Variables
 * (siehe functions/api/submit-quiz.ts und docs/brevo-setup.md).
 */

export const QUIZ_VERSION = "v1";

export const APP_URL = import.meta.env.VITE_APP_URL ?? "https://rueckenbewusst-sein.de/decoder";

/**
 * TODO: Rückenkompass-Calendly-URL fehlt. Muss vom Auftraggeber bereitgestellt
 * und als VITE_CALENDLY_URL in den Umgebungsvariablen (Cloudflare Pages Projekt-
 * einstellungen bzw. .env) hinterlegt werden. Bis dahin bleibt der Wert leer und
 * jede UI, die ihn nutzt, muss das TODO sichtbar machen statt einen Platzhalter-
 * Link zu erfinden.
 */
export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? "";

/**
 * TODO: URL eines Brevo-Anmeldeformulars für Liste #24 fehlt noch. Wird auf
 * der Erfolgsseite verlinkt ("Keine E-Mail erhalten?"), damit Kontakte, die
 * sich früher abgemeldet haben oder auf der Blockliste stehen, sich über
 * ein reguläres Double-Opt-in-Formular selbst reaktivieren können, statt
 * dass unser Server das serverseitig prüfen/umgehen muss. Erstellung siehe
 * docs/brevo-setup.md, Abschnitt "Reaktivierungs-Formular". Solange kein
 * Wert gesetzt ist, wird der Link auf der Erfolgsseite nicht angezeigt.
 */
export const BREVO_REACTIVATION_FORM_URL = import.meta.env.VITE_BREVO_REACTIVATION_FORM_URL ?? "";

export const TOTAL_QUESTIONS = 12;
