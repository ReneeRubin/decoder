# Domain-Anbindung: rueckenbewusst-sein.de (Alfahosting) + Cloudflare Pages

Ziel laut Vorgabe: `https://rueckenbewusst-sein.de/decoder`. Die **bestehende
Website darf dabei nicht beschädigt werden.**

Es gibt zwei technisch saubere Wege. Beide werden hier dokumentiert, damit
eine informierte Entscheidung getroffen werden kann. **Keiner der beiden
Wege wurde in dieser Session tatsächlich ausgeführt** (kein Zugriff auf
Alfahosting- oder Cloudflare-Zugangsdaten) – es handelt sich um eine
Anleitung zur manuellen Umsetzung.

## Option A (empfohlen): Subdomain, z.B. `decoder.rueckenbewusst-sein.de`

**Warum empfohlen:** Kein Eingriff in die bestehende Website oder deren
DNS-Records, keine Nameserver-Änderung nötig, minimales Risiko, in
5 Minuten umsetzbar.

**Schritte:**

1. Cloudflare-Account anlegen (falls nicht vorhanden) und ein **Pages**-Projekt
   für dieses Repository erstellen (Build-Command `npm run build`,
   Output-Verzeichnis `dist`).
2. Im Pages-Projekt unter **Custom domains** die Subdomain
   `decoder.rueckenbewusst-sein.de` hinzufügen. Cloudflare zeigt daraufhin
   einen benötigten **CNAME-Eintrag** an (Ziel: `<projekt>.pages.dev`).
3. Bei Alfahosting (dort, wo aktuell die DNS-Zone von
   `rueckenbewusst-sein.de` verwaltet wird) **einen neuen CNAME-Record**
   hinzufügen:
   - Name: `decoder`
   - Ziel: `<projekt>.pages.dev` (von Cloudflare vorgegeben)
   - **Bestehende Records (A/CNAME/MX/TXT der Hauptdomain) bleiben
     unverändert.**
4. Cloudflare stellt automatisch ein TLS-Zertifikat für die Subdomain aus.
5. `VITE_APP_URL` in den Cloudflare Pages Environment Variables auf
   `https://decoder.rueckenbewusst-sein.de` setzen; `vite.config.ts`
   `base` entsprechend auf `/` ändern (aktuell `/decoder/`, siehe unten).

**Nachteil:** URL lautet `.../decoder.rueckenbewusst-sein.de` statt
`.../rueckenbewusst-sein.de/decoder` (Pfad statt Subdomain). Fachlich
gleichwertig, aber nicht exakt wie ursprünglich gewünscht.

## Option B: Pfad `/decoder` auf der Hauptdomain (wie ursprünglich gewünscht)

Das setzt voraus, dass **die komplette Domain über Cloudflare läuft**
(Cloudflare wird zum DNS-/Proxy-Provider), damit ein **Cloudflare Worker
Route** für den Pfad `/decoder*` konfiguriert werden kann, der Requests an
das Pages-Projekt weiterleitet – die bestehende Website läuft dabei über
Cloudflare unverändert zu Alfahosting weiter (Cloudflare als reiner Proxy
davor).

**Das ist ein größerer Eingriff, weil die Nameserver der Domain geändert
werden müssen.** Bitte diesen Schritt bewusst und in Absprache mit der Person
durchführen, die die Domain bei Alfahosting verwaltet.

**Schritte:**

1. Domain bei Cloudflare hinzufügen ("Add a Site").
2. Cloudflare scannt die bestehenden DNS-Records automatisch. **Vor dem
   Nameserver-Wechsel unbedingt prüfen und dokumentieren**, dass alle
   bestehenden Records (A-Record der Website, MX-Records für E-Mail,
   TXT-Records für SPF/DKIM/Domainbestätigungen etc.) korrekt übernommen
   wurden. **Keinen bestehenden Record löschen.**
3. Nameserver bei Alfahosting (Domainverwaltung) auf die von Cloudflare
   angezeigten Nameserver umstellen. Das kann bis zu 24–48h dauern, bis es
   global wirksam ist.
4. Sobald die Domain aktiv auf Cloudflare läuft: Pages-Projekt wie in
   Option A anlegen (Build-Command `npm run build`, Output `dist`).
5. Einen **Worker** erstellen, der Requests an `rueckenbewusst-sein.de/decoder*`
   an das Pages-Projekt weiterleitet, z.B.:

   ```js
   export default {
     async fetch(request) {
       const url = new URL(request.url);
       const target = new URL(url.pathname + url.search, "https://<projekt>.pages.dev");
       return fetch(target, request);
     },
   };
   ```

6. Unter **Worker Routes** die Route `rueckenbewusst-sein.de/decoder*` auf
   diesen Worker legen.
7. **Wichtig:** Damit sowohl die statischen Assets als auch der API-Endpunkt
   (`/api/submit-quiz`) unter dem Präfix `/decoder` korrekt erreichbar sind,
   muss entweder
   - das Pages-Projekt seine Build-Ausgabe selbst unter `/decoder/`
     bereitstellen (z.B. `build.outDir: "dist/decoder"` in `vite.config.ts`
     und den Function-Ordner nach `functions/decoder/api/submit-quiz.ts`
     verschieben), **oder**
   - der Worker den Pfad beim Weiterleiten entsprechend umschreibt.

   **Dies ist als TODO zu behandeln und vor dem Go-Live final zu testen**,
   da es ohne echten Cloudflare-Account in dieser Session nicht end-to-end
   verifiziert werden konnte.

## Aktuelle Code-Konfiguration

- `vite.config.ts` ist aktuell auf `base: "/decoder/"` eingestellt (passend
  zu Option B / dem ursprünglich gewünschten Pfad).
- Für Option A (Subdomain) muss `base` auf `"/"` geändert und
  `VITE_APP_URL` angepasst werden.
- Diese Entscheidung bitte **vor dem ersten Produktiv-Deployment** treffen
  und hier dokumentieren, welche Option gewählt wurde.

## HTTPS

Cloudflare stellt für beide Optionen automatisch TLS-Zertifikate aus
(Universal SSL). Keine manuelle Zertifikatsverwaltung nötig.

## Deployment-Workflow (nach DNS-Entscheidung)

1. `npm run build` lokal zur Kontrolle.
2. Cloudflare Pages Projekt mit diesem Git-Repository verbinden (empfohlen:
   automatisches Deployment bei Push auf den Hauptbranch).
3. Environment Variables/Secrets im Pages-Projekt setzen (siehe
   `docs/brevo-setup.md`, Abschnitt 5).
4. Deployment abwarten, danach Rauchtest gemäß README durchführen.

**Es wurde in dieser Session bewusst NICHT automatisch produktiv deployt**,
da die dafür nötigen Zugangsdaten (Cloudflare-Account, finale
Domain-Entscheidung, Brevo API Key) fehlen.
