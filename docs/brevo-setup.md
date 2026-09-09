# Brevo-Setup für den Rücken-Decoder

Diese Anleitung beschreibt die manuelle Konfiguration in Brevo, die für den
Rücken-Decoder benötigt wird. Die Anwendung selbst berechnet das komplette
Ergebnis serverseitig (Hauptcode, Sekundärcode, aktuelle Spur) und übergibt
nur die fertigen Textwerte an Brevo – Brevo berechnet nichts (siehe
README.md, Architekturregel).

## 1. Liste #24 – "Leadmagnet Schmerz Decoder"

- Liste **muss bereits existieren** (ID 24, Name "Leadmagnet Schmerz Decoder").
- Diese Liste wird von der Anwendung verwendet, um neue/aktualisierte
  Kontakte automatisch zuzuordnen (`listIds: [24]` im Contacts-API-Aufruf).
- **TODO/Prüfen:** Bitte bestätigen, dass Liste-ID 24 in eurem Brevo-Account
  tatsächlich noch "Leadmagnet Schmerz Decoder" ist (IDs können sich bei
  gelöschten/neu angelegten Listen ändern). Falls abweichend, `BREVO_LIST_ID`
  in den Cloudflare Pages Environment Variables anpassen.

## 2. Bestehendes Attribut

- `SCHMERZ_DECODER_ERGEBNIS` (Text) – **bleibt unverändert**, wird von der
  Anwendung weiterhin mit dem Titel des Hauptcodes befüllt (z.B.
  "Die Funktionierende").

## 3. Neue Attribute (in Brevo unter Kontakte → Einstellungen → Attribute anlegen)

| Attribut-Name                        | Typ   | Beispielwert                |
|---------------------------------------|-------|------------------------------|
| `SCHMERZ_DECODER_SPUR`                | Text  | "Energie" oder "Energie + Gedanken" |
| `SCHMERZ_DECODER_SEKUNDAERCODE`       | Text  | "Die Überladene"             |
| `SCHMERZ_DECODER_VERSION` (optional)  | Text  | "v1"                         |
| `SCHMERZ_DECODER_DATUM` (optional)    | Datum | 2026-01-15                   |

Bitte **keine weiteren Attribute** für die einzelnen 12 Fragen anlegen – die
Rohantworten verlassen den Server nie in Richtung Brevo, sie werden nur für
die Berechnung verwendet.

## 4. API Key

- Brevo → Einstellungen (Zahnrad oben rechts) → **SMTP & API** → **API Keys**
  → neuen Key erstellen (z.B. "Rücken-Decoder Produktion").
- Der Key wird **ausschließlich** als Cloudflare Pages Secret hinterlegt
  (siehe unten) – niemals in Git, niemals im Frontend.
- **TODO:** Es liegt aktuell kein echter API Key vor. Ohne Key läuft die
  Anwendung automatisch im **Mock-Modus** (`src/lib/brevo.ts`): Es wird kein
  echter Kontakt angelegt, aber die Funktion verhält sich sonst identisch.

## 5. Environment Variables (Cloudflare Pages)

Im Cloudflare Pages Projekt unter **Settings → Environment variables**
(getrennt für "Production" und "Preview" pflegen):

| Name              | Wert                          | Secret? |
|-------------------|-------------------------------|---------|
| `BREVO_API_KEY`   | (echter Brevo API Key)        | ✅ ja    |
| `BREVO_LIST_ID`   | `24`                          | nein    |
| `QUIZ_VERSION`    | `v1`                          | nein    |

Siehe auch `.env.example` im Projekt-Root für die lokale Entwicklung.

## 6. Automation Trigger

In Brevo unter **Automations** eine neue Automation anlegen:

1. **Trigger:** "Kontakt wird zu einer Liste hinzugefügt" → Liste **#24**
   ("Leadmagnet Schmerz Decoder").
2. Optionaler Schritt: kurze Wartezeit (z.B. 1–2 Minuten), falls gewünscht.
3. **Aktion:** Ergebnis-E-Mail versenden (siehe Punkt 7).
4. **Danach:** Follow-up-Sequenz gemäß eurer bestehenden Marketing-Strategie.

Die Website selbst verschickt **keine** E-Mail (kein SMTP, kein
Marketing-Mailing) – ausschließlich die Kontakt-/Listenzuordnung via API.

## 7. Ergebnis-Mail (Template)

- Die vollständigen Ergebnistexte (Hauptcode-Beschreibungen,
  Spur-Beschreibungen, Verbindungstexte, Reflexionsfragen, 3-Sekunden-Fokus,
  Trust-Block, Rückenkompass-CTA) sind **Single Source of Truth** in
  `src/data/results.ts` hinterlegt – 1:1 aus der fachlichen Vorgabe
  übernommen.
- Da Brevo selbst keine bedingte "wenn ERGEBNIS = X, dann Text Y"-Logik pro
  Wort so granular abbildet wie unser Scoring, empfehlen wir in Brevo:
  - **Ein Automation-Pfad pro Hauptcode** (5 Zweige via "Split basierend auf
    Bedingung" auf `SCHMERZ_DECODER_ERGEBNIS`), ODER
  - **Ein E-Mail-Template mit Merge-Tags**, das nur die variablen Kernwerte
    (`{{contact.SCHMERZ_DECODER_ERGEBNIS}}`,
    `{{contact.SCHMERZ_DECODER_SEKUNDAERCODE}}`,
    `{{contact.SCHMERZ_DECODER_SPUR}}`, `{{contact.FNAME}}`) einsetzt und die
    fünf möglichen Lang-Texte als bedingte Blöcke enthält.
- **TODO:** Die konkrete Betreffzeile wird laut Vorgabe final in Brevo
  gepflegt (Vorschläge siehe Vorgabe Abschnitt 43 / Abschlussbericht).
- **TODO:** Die vollständigen Ergebnistexte müssen einmalig manuell (oder per
  Copy-Paste aus `src/data/results.ts`) in das Brevo-Template übertragen
  werden – das ist außerhalb des Scopes dieser Code-Lieferung, da Brevo
  Templates nicht per Code-Repository verwaltet.

## 8. Follow-up

- Die Follow-up-Sequenz nach der Ergebnis-Mail liegt in eurer Verantwortung
  (bestehende Automation-Logik). Die Website liefert dafür lediglich den
  Trigger (Listenzuordnung).

## 9. Testkontakt

Zum Testen des kompletten Funnels:

1. Sicherstellen, dass `BREVO_API_KEY` in der **Preview**-Umgebung von
   Cloudflare Pages gesetzt ist (oder bewusst im Mock-Modus ohne Key testen).
2. Den Decoder mit einer eigenen Test-E-Mail-Adresse komplett durchklicken.
3. In Brevo unter **Kontakte** prüfen, ob der Kontakt mit den korrekten
   Attributen angelegt/aktualisiert und Liste #24 zugeordnet wurde.
4. Prüfen, ob die Automation ausgelöst wurde und die Ergebnis-Mail ankommt
   (auch Spam-/Werbeordner prüfen).
5. Danach den Testkontakt bei Bedarf wieder aus Liste #24 entfernen, damit
   er nicht die Follow-up-Sequenz doppelt durchläuft.

## 10. Fehlerbehebung

| Symptom | Mögliche Ursache | Lösung |
|---|---|---|
| API-Antwort `502` beim Submit | Brevo API nicht erreichbar oder API Key ungültig | API Key prüfen, Brevo-Statusseite prüfen |
| Kontakt wird angelegt, aber Attribute fehlen | Attribute in Brevo nicht angelegt (Tippfehler im Namen) | Attributnamen exakt wie in Abschnitt 3 anlegen |
| Kontakt landet nicht in Liste #24 | `BREVO_LIST_ID` falsch gesetzt | Environment Variable in Cloudflare Pages prüfen |
| Automation läuft nicht an | Trigger falsch konfiguriert oder Automation deaktiviert | Automation-Status und Trigger-Liste in Brevo prüfen |
| Doppelte Kontakte statt Update | `updateEnabled` nicht gesetzt (sollte in unserem Code immer `true` sein) | Code in `src/lib/brevo.ts` prüfen, ggf. Brevo-Support kontaktieren |
| Lokal kein API-Call sichtbar | Kein `BREVO_API_KEY` gesetzt → bewusster Mock-Modus | Für echten Test Key in `.env`/Cloudflare setzen |
