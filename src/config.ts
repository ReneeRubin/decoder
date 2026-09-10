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
 * Brevo-Anmeldeformular für Liste #24. Wird auf der Erfolgsseite verlinkt
 * ("Keine E-Mail erhalten?"), damit Kontakte, die sich früher abgemeldet
 * haben oder auf der Blockliste stehen, sich über ein reguläres
 * Double-Opt-in-Formular selbst reaktivieren können. Kein Secret (öffentlich
 * einsehbares Anmeldeformular), daher als Default fest hinterlegt – kann bei
 * Bedarf per VITE_BREVO_REACTIVATION_FORM_URL überschrieben werden (siehe
 * docs/brevo-setup.md, Abschnitt "Reaktivierungs-Formular").
 */
export const BREVO_REACTIVATION_FORM_URL =
  import.meta.env.VITE_BREVO_REACTIVATION_FORM_URL ??
  "https://5cc45ce8.sibforms.com/serve/MUIFAB33IJ0WRBbfddCKjSxt5BJyeuUULgx1W3xe9dKLfshlweedFjAoHffOH27gGbTZyF9eUIyzs453cqiqDNgJgRljHcbVsQLOsbwS4193vK7YAI1TARdM9NwX4TLn17NZWJI0oRaz1Nq3OqHyFUWeTaF73vIkhz_Gn9qUk9BEA-ByvuQ4-kxNXcUnqAyVpgaw6yAfBDAXOO9T";

export const TOTAL_QUESTIONS = 12;
