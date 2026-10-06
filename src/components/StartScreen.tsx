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
        <span className="hero-badge">Renée Rubin</span>
        <h1 className="start-headline">Warum fühlt sich dein Leben manchmal so schwer an?</h1>
        <p style={{ color: "var(--color-petrol)", fontWeight: 600 }}>
          Der 3-Minuten-Decoder für starke Frauen, die viel tragen und schon vieles ausprobiert haben.
        </p>

        <p>Du funktionierst, organisierst und kümmerst dich um alle. Und trotzdem wird es nicht leichter.</p>

        <p>Dann ist es Zeit, nicht noch mehr zu tun – sondern genauer hinzuschauen.</p>

        <p>
          Vielleicht fehlt dir gerade nur der Blick darauf, welche Themen, Gefühle, Gedanken und Energien dich mehr
          tragen lassen, als nötig wäre. Dein Leben ist dabei dein Spiegel.
        </p>

        <p>Finde in nur 3 Minuten heraus, welches Muster du bisher vielleicht übersehen hast.</p>

        <button type="button" className="btn btn-primary" onClick={onStart}>
          DECODER STARTEN
        </button>

        <p className="hint" style={{ marginTop: 16 }}>
          12 Fragen · ca. 3 Minuten · tiefer Einblick
        </p>

        <Testimonials />
      </div>
    </div>
  );
}
