# Meta (Facebook) Pixel & Lead-Tracking

## Was bisher fehlte

Auf der Seite war bisher **überhaupt kein** Meta-Pixel installiert (auch
kein Basis-Code) – deshalb konnte Meta gar nichts zählen, unabhängig von
irgendeiner URL.

## Was jetzt eingebaut ist

1. **Danke-Seite `/ty1`**: Nach erfolgreichem Quiz-Abschluss (Kontakt wurde
   erfolgreich an Brevo übergeben) leitet die Seite den Browser per echtem
   Redirect auf `/ty1` weiter (nicht nur ein interner Zustandswechsel –
   Meta braucht einen echten Seitenaufruf, um dort einen frischen PageView
   zu sehen). Dort wird ganz normal die bekannte "Geschafft"-Seite gezeigt.
2. **Meta-Pixel Basis-Code** in `index.html` – aktiviert sich automatisch,
   sobald `VITE_META_PIXEL_ID` gesetzt ist (siehe unten). Ohne gesetzte ID
   ist der Code ein reines No-op (keine Anfrage an Meta, keine Fehler).
3. **Lead-Event**: Sobald `/ty1` geladen wird UND eine Pixel-ID gesetzt
   ist, feuert automatisch `fbq('track', 'Lead')` – das ist Metas
   Standard-Event für Lead-Generierung (empfohlen von Meta selbst,
   zuverlässiger als reine URL-Zuordnung).

## Was ich von dir brauche

**Erforderlich – Pixel-ID:**

1. In Meta Events Manager (business.facebook.com/events_manager) →
   Datenquellen → dein Pixel auswählen → Einstellungen → die **Pixel-ID**
   kopieren (eine Zahl, z.B. `123456789012345`).
2. Diese ID einsetzen:
   - Lokal: in `.env` als `VITE_META_PIXEL_ID=...`
   - Produktiv: in Cloudflare Pages → Projekt → Settings → Environment
     variables → `VITE_META_PIXEL_ID` (kein Secret, aber trotzdem dort
     hinterlegen)
3. Neu deployen (Environment Variables werden nur beim Build gelesen).

**Danach in Meta Ads Manager einrichten (eine der beiden Optionen, gerne
auch beide parallel):**

- **Option A – Standard-Event "Lead" (empfohlen):** In deiner Kampagne als
  Conversion-Event einfach "Lead" auswählen. Das ist robuster als
  URL-Matching und ermöglicht Metas Lead-Optimierung für die
  Anzeigenausspielung.
- **Option B – URL-basierte benutzerdefinierte Conversion (wie ursprünglich
  angefragt):** Events Manager → Benutzerdefinierte Conversions → Neue
  Conversion → Regel "URL enthält `/ty1`" → Event-Typ z.B. "Lead".

**Optional, für noch zuverlässigeres Tracking (iOS/Werbeblocker-resistent):**
Meta empfiehlt zusätzlich die **Conversions API** (serverseitiges Tracking,
das den Lead-Event zusätzlich direkt von unserem Server an Meta schickt,
unabhängig vom Browser-Pixel). Dafür bräuchte ich zusätzlich:
- Einen **Access Token** aus dem Events Manager (Einstellungen → Conversions
  API → "Access Token generieren")
Das ist ein separater, etwas größerer Schritt – sag Bescheid, falls du das
zusätzlich willst, dann bauen wir das in `functions/api/submit-quiz.ts` mit
ein.
