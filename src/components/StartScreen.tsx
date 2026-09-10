import { Testimonials } from "./Testimonials";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="screen text-center">
      <div className="card">
        {/*
          TODO: Bild 1 (Hero-/Brandbild von Renée) fehlt im Projekt und wurde
          nicht erfunden/durch ein Stockfoto ersetzt. Sobald die Datei
          bereitgestellt wird, hier als optimiertes <img> einbinden
          (siehe README, Abschnitt "Fehlende Assets").
        */}
        <span className="hero-badge">RückenbewusstSEIN · Renée Rubin</span>
        <h1 className="start-headline">Warum kommt dein Rückenschmerz immer wieder?</h1>
        <p style={{ color: "var(--color-petrol)", fontWeight: 600 }}>
          Der 3-Minuten-Rücken-Decoder für leistungsstarke Frauen, die schon vieles ausprobiert haben.
        </p>

        <p style={{ color: "var(--color-grau)" }}>
          Ärzte, Physio, Übungen und Osteopathie hast du hinter dir, aber der Schmerz kam immer wieder.
        </p>

        <p>Dann ist es Zeit, nicht noch mehr zu tun – sondern genauer hinzuschauen.</p>

        <p>Vielleicht gibt es eine Spur hinter deinem Schmerz, die dir bisher niemand gezeigt hat.</p>

        <p>
          Vielleicht fehlt dir jetzt gerade nur der Zusammenhang zwischen deinem Schmerz und dem, was sich in deinem
          Leben immer wieder zeigt.
        </p>

        <p>Finde in nur 3 Minuten heraus, welche Schmerz Spur du bisher vielleicht übersehen hast.</p>

        <button type="button" className="btn btn-primary" onClick={onStart}>
          RÜCKEN DECODER STARTEN
        </button>

        <p className="hint" style={{ marginTop: 16 }}>
          12 Fragen · ca. 3 Minuten · keine Diagnose · tiefer Einblick
        </p>

        <Testimonials />
      </div>
    </div>
  );
}
