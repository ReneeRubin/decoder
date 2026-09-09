interface InterstitialScreenProps {
  text: string;
  onContinue: () => void;
}

export function InterstitialScreen({ text, onContinue }: InterstitialScreenProps) {
  return (
    <div className="screen text-center">
      <div className="card">
        <p style={{ fontSize: "1.2rem", color: "var(--color-petrol)", fontWeight: 600 }}>{text}</p>
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Weiter
        </button>
      </div>
    </div>
  );
}
