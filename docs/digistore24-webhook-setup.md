# Digistore24 → Brevo VIP-Webhook: Setup-Anleitung

Diese Anleitung beschreibt Schritt für Schritt, wie der Webhook
(`functions/api/digistore24-webhook.ts`) in Digistore24, Brevo und Cloudflare
verkabelt wird. Sie richtet sich bewusst an Einsteiger:innen – jeder Schritt
ist einzeln erklärt.

## Überblick: Was passiert hier eigentlich?

1. Eine Kundin kauft das VIP-Paket (27 €, Digistore24-Produkt-ID `734497`).
2. Digistore24 schickt daraufhin automatisch eine Nachricht ("Webhook"/"IPN")
   an eine URL, die zu dieser Website gehört.
3. Der Code in `functions/api/digistore24-webhook.ts` prüft: Kommt diese
   Nachricht wirklich von Digistore24 (nicht von jemand anderem, der die URL
   erraten hat)? Und: Ist das wirklich ein bezahlter Kauf des VIP-Pakets?
4. Wenn ja: Der Kontakt wird in Brevo angelegt/aktualisiert, der Liste "VIP"
   (#26) zugeordnet und das Attribut `VIP_2609` auf `vipaktiv` gesetzt.
5. Die bereits in Brevo eingerichtete Automation reagiert auf die
   Listenzuordnung und verschickt die Willkommensmail.

## Schritt 1: Digistore24-Produkt prüfen

- Produkt-ID **734497** (VIP-Paket, 27 €) ist bereits im Code hinterlegt
  (`DIGISTORE24_VIP_PRODUCT_ID` in `wrangler.toml`).
- Bitte einmal in Digistore24 (Verkäufer-Login) unter **Produkte** prüfen,
  dass 734497 wirklich das richtige Produkt ist.

## Schritt 2: Was ist die "IPN-Passphrase" und warum brauche ich sie?

Stell es dir wie ein **gemeinsames Geheimwort** zwischen Digistore24 und
deinem Webhook vor:

- Du trägst ein Passwort (die "Passphrase") sowohl bei Digistore24 als auch
  bei Cloudflare (als Secret) ein.
- Bei jedem Kauf berechnet Digistore24 aus den Bestelldaten **plus** diesem
  Passwort einen "Fingerabdruck" (die Signatur, `sha_sign`) und schickt ihn
  mit.
- Dein Webhook berechnet denselben Fingerabdruck selbst (er kennt ja auch das
  Passwort) und vergleicht beide. Stimmen sie überein, ist sicher: Die
  Nachricht kam wirklich von Digistore24 und wurde unterwegs nicht verändert.
- **Ohne dieses Passwort** könnte theoretisch jede beliebige Person im
  Internet eine gefälschte "Kauf erfolgreich"-Nachricht an deine Webhook-URL
  schicken und sich selbst kostenlos in deine VIP-Liste eintragen.

Kurz: Es ist kein Passwort, mit dem sich jemand irgendwo *einloggt* – es dient
nur dazu, echte Digistore24-Nachrichten von gefälschten zu unterscheiden.

### Vorgeschlagene Passphrase

Damit du dir kein eigenes Passwort ausdenken musst, hier ein sicherer,
zufällig generierter Vorschlag:

```
88fd7350cc5c2de086abcd1e7842791eb85b1b2ee5e82541c6ead00de91b332e
```

Du kannst diesen Wert direkt verwenden. Wichtig ist nur: **Exakt derselbe
Wert** muss an zwei Stellen eingetragen werden (Schritt 3 und Schritt 4) –
sonst stimmt die Prüfung nie überein und Digistore24-Käufe werden abgelehnt.

### Schritt 3: Passphrase bei Digistore24 eintragen

1. Bei [digistore24.com](https://www.digistore24.com) als Verkäufer:in
   einloggen.
2. Zum VIP-Produkt (ID 734497) navigieren.
3. Dort den Bereich für **Auslieferung / Webhook / IPN** öffnen (Digistore24
   nennt das je nach Kontoversion z. B. "Auslieferung", "Webhooks" oder
   "IPN-Einstellungen" – die genaue Bezeichnung konnte ich aus dieser
   Umgebung heraus nicht abschließend prüfen, siehe Hinweis unten).
4. Ein Feld für **Passwort / Passphrase** suchen und dort den obigen Wert
   eintragen.
5. In dasselbe Formular gehört auch die **Webhook-URL** (siehe Schritt 5).
6. Speichern.

**Wenn du das Feld nicht findest:** Screenshot vom entsprechenden
Digistore24-Bildschirm hier posten – dann kann ich dir zeigen, wo genau du
klicken musst.

### Schritt 4: Passphrase als Cloudflare Secret eintragen

Zwei Möglichkeiten – so, wie es für dich einfacher ist:

**Option A – über das Cloudflare-Dashboard (kein Terminal nötig):**

1. [dash.cloudflare.com](https://dash.cloudflare.com) öffnen → **Workers &
   Pages** → das Projekt `rueckenbewusst-decoder` auswählen.
2. **Settings** → **Environment variables**.
3. Unter "Production" (und ggf. "Preview") eine neue Variable hinzufügen:
   - Name: `DIGISTORE24_IPN_PASSPHRASE`
   - Wert: derselbe Wert wie in Schritt 3
   - **Wichtig:** Haken bei "Encrypt" / als **Secret** markieren, nicht als
     normale Variable.
4. Speichern. Ein neues Deployment ist danach nötig, damit die Variable
   wirksam wird (Cloudflare bietet dafür meist einen "Redeploy"-Button an).

**Option B – über die Kommandozeile (falls du `wrangler` nutzt):**

```bash
npx wrangler pages secret put DIGISTORE24_IPN_PASSPHRASE --project-name rueckenbewusst-decoder
```

Der Befehl fragt danach interaktiv nach dem Wert – dort den Wert aus
Schritt 3 einfügen (wird beim Tippen nicht angezeigt, das ist normal).

## Schritt 5: Webhook-URL bei Digistore24 eintragen

Die URL hat die Form:

```
https://<deine-domain>/api/digistore24-webhook
```

- Falls die Website schon unter einer eigenen Domain läuft (z. B.
  `rueckenbewusst-sein.de`), dann: `https://rueckenbewusst-sein.de/api/digistore24-webhook`
- Falls noch keine eigene Domain verbunden ist, findest du die
  `*.pages.dev`-URL im Cloudflare-Dashboard unter dem Projekt
  `rueckenbewusst-decoder` (z. B.
  `https://rueckenbewusst-decoder.pages.dev/api/digistore24-webhook`).

Diese URL trägst du im selben Digistore24-Formular wie die Passphrase
(Schritt 3) als Webhook-/IPN-URL ein.

## Schritt 6: Brevo-Liste und Attribut prüfen

- Liste **#26** ("VIP") muss existieren – bitte einmal in Brevo unter
  **Kontakte → Listen** bestätigen, dass die ID wirklich 26 ist.
- Attribut `VIP_2609` muss existieren. Der Webhook schreibt den Text
  `vipaktiv` hinein. **Bitte prüfen:** Ist `VIP_2609` in Brevo als
  **Text-Attribut** angelegt? Falls es z. B. als Zahl oder Ja/Nein-Attribut
  angelegt ist, muss der Wert angepasst werden (Bescheid geben, dann passe
  ich `BREVO_VIP_ATTRIBUTE_VALUE` entsprechend an).
- Die Automation, die beim Eingang in Liste #26 startet, ist laut
  Vorgabe bereits eingerichtet – hier ist nichts weiter zu tun.

## Schritt 7: Testen

1. Erst lokal/isoliert testen (ohne dass eine echte Kundin kaufen muss):
   Digistore24 bietet im selben Webhook-Formular meist einen Button
   **"Test-IPN senden"** an. Damit schickt Digistore24 einen Beispiel-Aufruf
   an deine URL.
2. Im Cloudflare-Dashboard unter **Workers & Pages → Projekt → Logs** prüfen,
   ob der Aufruf ankam und ob er als Erfolg (`OK`, Status 200) oder Fehler
   verarbeitet wurde.
3. Bei einem echten Testkauf (z. B. über den Digistore24-Testmodus, falls
   vorhanden) prüfen, ob der Kontakt in Brevo in Liste #26 auftaucht und die
   Willkommensmail ankommt.

**Wichtiger Hinweis zum Feld-Mapping:** Der Code liest aus der
Digistore24-Nachricht die Felder `email`, `first_name`/`last_name`,
`product_id`, `order_id`, `order_is_paid` und `event`. Diese Namen stammen
aus öffentlich zugänglichen Digistore24-Referenzen, konnten aber wegen
Netzwerkbeschränkungen in dieser Arbeitsumgebung nicht 1:1 gegen die
aktuelle offizielle Doku (dev.digistore24.com) abgeglichen werden. **Nach dem
ersten Test-IPN (Schritt 7.1) bitte kurz Rückmeldung geben, ob der Kontakt
korrekt mit Vorname/Nachname in Brevo ankommt** – falls nicht, schicke mir
die im Cloudflare-Log sichtbaren Feldnamen (keine echten Kundendaten nötig),
dann passe ich das Mapping in `src/lib/digistore24.ts` gezielt an.

## Health-Check

`GET https://<deine-domain>/api/digistore24-webhook` liefert `{"status":"ok"}`
mit HTTP 200 – ohne Kundendaten. Damit kannst du jederzeit prüfen, ob der
Endpunkt erreichbar ist.

## Zusammenfassung: Secrets & Variablen

| Name                          | Wert                                    | Secret? |
|--------------------------------|------------------------------------------|---------|
| `BREVO_API_KEY`                | (echter Brevo v3-API-Key, `xkeysib-...`) | ✅ ja    |
| `DIGISTORE24_IPN_PASSPHRASE`   | siehe Schritt 2/3/4                       | ✅ ja    |
| `BREVO_VIP_LIST_ID`            | `26`                                      | nein    |
| `BREVO_VIP_ATTRIBUTE_VALUE`    | `vipaktiv`                                | nein    |
| `DIGISTORE24_VIP_PRODUCT_ID`   | `734497`                                  | nein    |

Die vier nicht-geheimen Werte sind bereits in `wrangler.toml` als
Standardwerte hinterlegt – du musst sie nur im Cloudflare-Dashboard
überschreiben, falls sie sich mal ändern.
