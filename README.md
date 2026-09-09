# Rücken-Decoder — RückenbewusstSEIN

„Der 3-Minuten-Rücken-Decoder“ von Renée Rubin – ein interaktiver
Reflexions-Selbsttest (12 Fragen), der einen Hauptcode, einen Sekundärcode
und eine aktuelle Spur berechnet und das Ergebnis per Brevo-E-Mail
zustellt. Ersetzt den bisherigen Involve.me-Funnel.

## Architektur (Kurzfassung)

- **Frontend:** React + TypeScript + Vite, mobile-first.
- **Server:** Cloudflare Pages Function (`functions/api/submit-quiz.ts`).
- **CRM/E-Mail:** Brevo (Kontakt anlegen/aktualisieren, Liste #24, Automation
  verschickt die Ergebnis-Mail).
- **Terminbuchung:** Calendly (Rückenkompass) – Link fehlt aktuell, siehe
  TODOs unten.
- **Keine Datenbank.** Der Server berechnet das Ergebnis zustandslos pro
  Request direkt aus den übermittelten Rohantworten.

**Wichtigste Architekturregel:** Die Anwendung berechnet Hauptcode,
Sekundärcode und aktuelle Spur **immer serverseitig neu** aus den
Rohantworten (`src/lib/scoring.ts`). Brevo berechnet nichts und wird nie mit
einem vom Client gesendeten "fertigen Ergebnis" gefüttert.

## 1. Voraussetzungen

- Node.js ≥ 20 (getestet mit Node 22)
- npm

## 2. Installation

```bash
npm install
```

## 3. Lokale Entwicklung

```bash
npm run dev
```

Öffnet die App unter `http://localhost:5173/decoder/`. **Hinweis:** Der
reine Vite-Dev-Server führt die Cloudflare Pages Function nicht aus – das
E-Mail-Gate lässt sich zwar durchklicken, der API-Call schlägt lokal ohne
Function-Runtime fehl. Für einen vollständigen lokalen Test inkl. API:

```bash
npm run preview:cf
```

(baut das Projekt und startet `wrangler pages dev` inkl. Functions, Mock-Brevo
ohne gesetzten API Key).

## 4. Environment Variables

Siehe `.env.example`. Wichtig:

- `VITE_APP_URL`, `VITE_CALENDLY_URL` – clientseitig, öffentlich.
- `BREVO_API_KEY`, `BREVO_LIST_ID`, `QUIZ_VERSION` – **ausschließlich
  serverseitig** in den Cloudflare Pages Environment Variables/Secrets
  hinterlegen, niemals in Git.

Ohne `BREVO_API_KEY` läuft die Funktion automatisch im **Mock-Modus**
(kein echter Netzwerkaufruf, siehe `src/lib/brevo.ts`).

## 5. Brevo Setup

Vollständige Anleitung: [`docs/brevo-setup.md`](docs/brevo-setup.md).
Copy-Paste-Inhalte für das Ergebnis-Mail-Template:
[`docs/brevo-email-content.md`](docs/brevo-email-content.md).

## 6. Cloudflare Setup

1. Cloudflare-Account, neues **Pages**-Projekt, verbunden mit diesem Repo.
2. Build-Command: `npm run build`, Output-Verzeichnis: `dist`.
3. Environment Variables/Secrets gemäß Abschnitt 4 setzen.
4. Deployment auslösen (automatisch bei Push, oder manuell via
   `npm run deploy` – erfordert lokal `wrangler login`).

## 7. Deployment

```bash
npm run build
npm run deploy   # wrangler pages deploy dist
```

**Es wurde in dieser Session kein automatisches Produktiv-Deployment
durchgeführt**, da Zugangsdaten (Cloudflare-Account, Brevo API Key,
finale Domain-Entscheidung) fehlen. Siehe Abschlussbericht für die
konkrete Liste offener Punkte.

## 8. Domain

Siehe [`docs/alfahosting-domain-setup.md`](docs/alfahosting-domain-setup.md)
für zwei dokumentierte Optionen (Subdomain vs. Pfad `/decoder` auf der
Hauptdomain) inkl. DNS-Details. **Die bestehende Website wird durch beide
Optionen nicht verändert oder gefährdet.**

## 9. Tests

```bash
npm run typecheck   # TypeScript, keine Emits
npm run lint        # ESLint
npm run test        # Vitest (Scoring, Validierung, Brevo-Client, API-Function)
npm run build        # Produktions-Build
```

Alle vier Kommandos müssen fehlerfrei durchlaufen, bevor deployed wird.

## 10. Troubleshooting

| Problem | Lösung |
|---|---|
| `npm run build` schlägt fehl | `npm run typecheck` für Details ausführen |
| API liefert 502 | Brevo API Key ungültig/fehlend – siehe `docs/brevo-setup.md` |
| Kein Ergebnis in der Mail | Automation/Template in Brevo prüfen (Website verschickt keine Mail selbst) |
| CORS/Netzwerkfehler im Dev-Modus | Erwartet bei `npm run dev` (keine Functions-Runtime) – `npm run preview:cf` nutzen |
| Ergebnis erscheint auf der Website | Das ist ein Bug – laut Vorgabe darf das Ergebnis NIE vor/ohne E-Mail-Versand angezeigt werden |

## Bekannte offene Punkte (TODO)

Diese Punkte fehlen als Zulieferung vom Auftraggeber und wurden bewusst
**nicht erfunden**:

- **Bilder:** Zwei persönliche Fotos von Renée (Hero-/Brandbild, Trust-/CTA-Bild) fehlen im Repository.
- **Testimonials:** Echte Testimonials aus Canva – siehe `content/testimonials.md`.
- **Schriften:** "Brittany" (Headline) und "Century Gothic" (Body) liegen nicht als lizenzierte Web-Font-Dateien vor; aktuell hochwertige Fallback-Stacks im Einsatz (`src/styles/global.css`).
- **Rückenkompass-URL:** Calendly-Link fehlt (`VITE_CALENDLY_URL`).
- **Brevo API Key:** Kein echter Key vorhanden – Mock-Modus aktiv.
- **Rechtstexte:** Datenschutzerklärung/Impressum sind nur als Link-Platzhalter im E-Mail-Gate vorgesehen, Inhalte fehlen.
- **Double-Opt-in/Consent-Text:** Rechtlich geprüfter Einwilligungstext für die Marketing-Automation fehlt, siehe `docs/brevo-setup.md`.
- **Finale Domain-Entscheidung:** Subdomain vs. Pfad `/decoder`, siehe `docs/alfahosting-domain-setup.md`.

Der vollständige Abschlussbericht mit allen Details befindet sich in der
finalen Nachricht dieser Session.
