interface InterstitialScreenProps {
  text: string;
  onContinue: () => void;
  onBack: () => void;
}

export function InterstitialScreen({ text, onContinue, onBack }: InterstitialScreenProps) {
  return (
    <div className="screen text-center">
      <div className="card">
        <p style={{ fontSize: "1.2rem", color: "var(--color-petrol)", fontWeight: 600 }}>{text}</p>
        <div className="question-nav">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-primary" onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
