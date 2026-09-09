import { useState, type FormEvent } from "react";
import { isValidEmail, isValidFirstName } from "../lib/validation";

interface EmailGateProps {
  onSubmit: (data: { firstName: string; email: string; website: string }) => void;
  onBack: () => void;
  submitting: boolean;
  errorMessage?: string;
}

export function EmailGate({ onSubmit, onBack, submitting, errorMessage }: EmailGateProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot – bleibt für Menschen unsichtbar & leer
  const [touched, setTouched] = useState(false);

  const firstNameValid = isValidFirstName(firstName);
  const emailValid = isValidEmail(email);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!firstNameValid || !emailValid) return;
    onSubmit({ firstName: firstName.trim(), email: email.trim(), website });
  }

  return (
    <div className="screen text-center">
      <div className="card">
        <h2>Dein Rücken wurde decodiert. ✨</h2>
        <p>Dein persönliches Ergebnis ist bereit.</p>
        <p>
          Gib jetzt deine E-Mail-Adresse ein und ich schicke dir deinen Rücken-Code direkt in dein Postfach.
        </p>

        {errorMessage ? (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="firstName">Vorname</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={touched && !firstNameValid}
              aria-describedby={touched && !firstNameValid ? "firstName-error" : undefined}
              required
            />
            {touched && !firstNameValid ? (
              <p id="firstName-error" className="field-error">
                Bitte gib deinen Vornamen ein.
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={touched && !emailValid}
              aria-describedby={touched && !emailValid ? "email-error" : undefined}
              required
            />
            {touched && !emailValid ? (
              <p id="email-error" className="field-error">
                Bitte gib eine gültige E-Mail-Adresse ein.
              </p>
            ) : null}
          </div>

          {/* Honeypot: für Menschen unsichtbar, Bots füllen es oft trotzdem aus. */}
          <div className="honeypot-field" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="question-nav">
            <button type="button" className="btn btn-secondary" onClick={onBack} disabled={submitting}>
              Zurück
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Wird gesendet …" : "Mein Ergebnis erhalten"}
            </button>
          </div>
        </form>

        <p className="disclaimer">
          Mit dem Absenden erhältst du dein Ergebnis per E-Mail sowie weiterführende Informationen von
          RückenbewusstSEIN. Informationen zum Datenschutz findest du in der Datenschutzerklärung auf{" "}
          <a href="https://rueckenbewusst-sein.de" target="_blank" rel="noreferrer">
            rueckenbewusst-sein.de
          </a>
          .
          {/*
            TODO: Sobald die genaue Datenschutz-URL sowie ein rechtlich
            geprüfter Einwilligungstext (Double-Opt-in-Hinweis für die
            anschließende Marketing-Automation) vorliegen, hier direkt
            verlinken/ergänzen. Siehe docs/brevo-setup.md, Abschnitt
            "Double Opt-in / Consent".
          */}
        </p>
      </div>
    </div>
  );
}
