# Testimonials

**Status: Umgesetzt.** Zwei echte Testimonials wurden von Renée bereitgestellt
(als WhatsApp-Nachrichten von Klientinnen) und sind in
`src/data/testimonials.ts` hinterlegt sowie auf der Startseite
(`src/components/Testimonials.tsx`) eingebunden.

## Testimonial 1
- Zugeordneter Hauptcode: allgemein
- Name: Alexandra (Vorname, aus Datenschutzgründen ohne Nachname)
- Zitat (gekürzt): "Ich bin in meiner Mitte angekommen, habe Frieden gemacht
  mit so vielen Dingen. Ich kann sagen, dass ich glücklich, entspannt,
  angstfrei und schmerzfrei bin." – nach 4 Monaten Begleitung
- Quelle: WhatsApp-Nachricht an Renée, von ihr bereitgestellt

## Testimonial 2
- Zugeordneter Hauptcode: allgemein
- Name: Verena (Vorname)
- Zitat (gekürzt): "Seit ich mit meiner Vision arbeite, bin ich seit rund
  5 Wochen schmerzfrei im unteren Rücken. Du hast mir vieles gezeigt, was
  ich eigentlich fast verloren hatte." – schmerzfrei im unteren Rücken
- Quelle: WhatsApp-Nachricht an Renée, von ihr bereitgestellt

## Wichtiger Hinweis zur Einwilligung (DSGVO)

Beide Zitate stammen aus ursprünglich **privaten** WhatsApp-Nachrichten.
Renée hat sie zur Verwendung auf der Website bereitgestellt; eine
dokumentierte, ausdrückliche schriftliche Einwilligung der Klientinnen zur
**öffentlichen Veröffentlichung** liegt uns hier nicht vor. Bitte vor dem
Go-Live final bei Alexandra und Verena bestätigen (lassen), dass die
Veröffentlichung von Vorname + Zitat auf der Website in Ordnung ist – im
Zweifel kurz nachfragen, das reicht i.d.R. als Nachweis.

Volle Nachnamen aus den Chat-Screenshots wurden **bewusst nicht**
verwendet.

## Wie weitere Testimonials ergänzt werden

Neue Einträge einfach in `src/data/testimonials.ts` als weiteres Objekt im
`TESTIMONIALS`-Array ergänzen (`name`, `quote`, `context`). Eine feste
Zuordnung zu einzelnen Hauptcodes (A–E) ist aktuell nicht implementiert, da
Testimonials nur auf der Startseite (vor Kenntnis des Ergebnisses) gezeigt
werden – passend wäre eine code-spezifische Auswahl in der Brevo-
Ergebnis-Mail, siehe `docs/brevo-email-content.md`.
