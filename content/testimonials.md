# Testimonials

**Status: Teilweise umgesetzt.** Drei echte Zitate (2× Alexandra, 1× Verena)
sind in `src/data/testimonials.ts` hinterlegt und auf der Startseite
(`src/components/Testimonials.tsx`) sichtbar. Für drei weitere Personen
liegt bisher nur eine Namens-/Code-Zuordnung vor, aber **noch kein
Zitat-Text** – siehe "Noch offen" unten.

## Code-Zuordnung (von Renée vorgegeben)

| Hauptcode | Titel | Person | Zitat vorhanden? |
|---|---|---|---|
| A | Die Funktionierende | Anja | ❌ noch nicht |
| B | Die Verantwortungsträgerin | Barbara | ❌ noch nicht |
| C | Die Kontrollierende | Verena | ✅ ja |
| D | Die Angepasste | Lorenza | ❌ noch nicht |
| E | Die Überladene | Alexandra, Julia | ✅ ja (Alexandra, 2 Zitate) · Julia ❌ noch nicht |

## Vorhandene Zitate

### Alexandra (Typ E – Die Überladene)
1. "Ich bin in meiner Mitte angekommen, habe Frieden gemacht mit so vielen
   Dingen. Ich kann sagen, dass ich glücklich, entspannt, angstfrei und
   schmerzfrei bin." – nach 4 Monaten Begleitung
2. "Mein Rücken ist stark und stabil, meine Psyche ebenso. Ich habe auch
   wieder viel mehr Energie. Es ist unglaublich, wie sich alles ins
   Positive gewandelt hat." – Follow-up einige Monate später
- Quelle: WhatsApp-Nachrichten an Renée, von ihr bereitgestellt

### Verena (Typ C – Die Kontrollierende)
- "Seit ich mit meiner Vision arbeite, bin ich seit rund 5 Wochen
  schmerzfrei im unteren Rücken. Du hast mir vieles gezeigt, was ich
  eigentlich fast verloren hatte."
- Quelle: WhatsApp-Nachricht an Renée, von ihr bereitgestellt

## Noch offen (TODO)

Für folgende Personen liegt nur Name + Code-Zuordnung vor, **kein**
Zitat-Text. Es wurde **nichts erfunden** – bitte die konkreten
WhatsApp-Nachrichten/Zitate nachreichen:

- **Anja** (Typ A – Die Funktionierende)
- **Barbara** (Typ B – Die Verantwortungsträgerin)
- **Lorenza** (Typ D – Die Angepasste)
- **Julia** (Typ E – Die Überladene)

## Wichtiger Hinweis zur Einwilligung (DSGVO)

Alle Zitate stammen aus ursprünglich **privaten** WhatsApp-Nachrichten.
Renée hat sie zur Verwendung auf der Website bereitgestellt; eine
dokumentierte, ausdrückliche schriftliche Einwilligung der Klientinnen zur
**öffentlichen Veröffentlichung** liegt uns hier nicht vor. Bitte vor dem
Go-Live final bei den Klientinnen bestätigen (lassen), dass die
Veröffentlichung von Vorname + Zitat auf der Website/in der Ergebnis-Mail
in Ordnung ist.

Volle Nachnamen aus den Chat-Screenshots wurden **bewusst nicht**
verwendet.

## Wie weitere Testimonials ergänzt werden

Neue Einträge einfach in `src/data/testimonials.ts` als weiteres Objekt im
`TESTIMONIALS`-Array ergänzen (`name`, `quote`, `context`, optional
`mainCode`, optional `showOnSite: false` um ein Zitat nur für die
Brevo-Zuordnung zu halten statt es auf der Startseite zu zeigen).

**Verwendung der Code-Zuordnung:** Die Website selbst zeigt Testimonials
weiterhin ohne Code-Bezug (vor Kenntnis des Ergebnisses). Die Zuordnung ist
für die Brevo-Ergebnis-Mail gedacht, damit z.B. eine Nutzerin mit Hauptcode
E ("Die Überladene") das passende Alexandra-Zitat in ihrer Mail sieht.
Siehe `docs/brevo-email-content.md`.
