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
        <h1>Warum kommt dein Rückenschmerz immer wieder?</h1>
        <p style={{ color: "var(--color-petrol)", fontWeight: 600 }}>
          Der 3-Minuten-Rücken-Decoder für leistungsstarke Frauen, die schon vieles ausprobiert haben.
        </p>

        <p>
          Du hast schon vieles gegen deinen Rückenschmerz ausprobiert – Übungen, Bewegung, Physio, Dehnen, vielleicht
          sogar komplette Trainingsprogramme. Es wird besser. Und dann kommt der Schmerz wieder.
        </p>

        <p>
          Vielleicht fehlt dir nicht die nächste Methode.
          <br />
          Vielleicht fehlt dir der Zusammenhang.
        </p>

        <p>
          Finde in wenigen Minuten heraus, welches unbewusste Muster bei dir eine Rolle spielen könnte – und worauf
          dein Körper dich möglicherweise aufmerksam macht.
        </p>

        <button type="button" className="btn btn-primary" onClick={onStart}>
          Meinen Rücken-Decoder starten
        </button>

        <p className="hint" style={{ marginTop: 16 }}>
          12 Fragen · ca. 3 Minuten · keine Diagnose
        </p>

        <Testimonials />
      </div>
    </div>
  );
}
