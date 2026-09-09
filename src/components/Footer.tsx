/**
 * Minimaler Footer mit Pflichtlinks (Vorgabe Abschnitt 63). Die Ziel-URLs
 * sind TODO, da noch keine rechtlich geprüften Texte/URLs vorliegen –
 * verlinkt vorerst auf die Hauptdomain, wo die bestehenden Rechtstexte der
 * Marke liegen.
 */
export function Footer() {
  return (
    <footer style={{ padding: "24px 16px", textAlign: "center", fontSize: "0.8rem", opacity: 0.7 }}>
      <a href="https://rueckenbewusst-sein.de" target="_blank" rel="noreferrer">
        Datenschutz
      </a>
      {" · "}
      <a href="https://rueckenbewusst-sein.de" target="_blank" rel="noreferrer">
        Impressum
      </a>
    </footer>
  );
}
