/**
 * Erfolgsseite. Zeigt AUSDRÜCKLICH kein Ergebnis (kein Hauptcode, keine
 * Spur, keine Analyse) – siehe Vorgabe Abschnitt 5, 11 & 71. Das Ergebnis
 * kommt ausschließlich per Brevo-E-Mail.
 */
export function SuccessScreen() {
  return (
    <div className="screen text-center">
      <div className="card">
        {/*
          TODO: Bild 2 (Trust-/Ergebnis-/CTA-Bild von Renée) fehlt im Projekt.
          Sobald bereitgestellt, hier als optimiertes <img> einbinden.
        */}
        <h2>Geschafft. ✨</h2>
        <p>Dein Rücken wurde decodiert.</p>
        <p>Dein persönliches Ergebnis ist jetzt auf dem Weg in dein Postfach.</p>
        <p style={{ fontWeight: 600, color: "var(--color-petrol)" }}>Schau jetzt in deine E-Mails.</p>
        <p className="hint">
          Falls du die Mail nicht sofort siehst, schau bitte auch in deinen Spam- oder Werbeordner.
        </p>
      </div>
    </div>
  );
}
