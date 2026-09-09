# Testimonials

TODO: Echte Testimonials aus Canva einfügen.

Laut Vorgabe existieren echte Testimonials in Canva, bereitgestellt vom
Auftraggeber. Diese Canva-Quelle konnte im Rahmen dieser Implementierung
technisch nicht ausgelesen werden (kein Zugriff/Export vorhanden).

**Es wurden bewusst KEINE Testimonials und KEINE Kundenresultate erfunden.**
Der Rücken-Decoder (Startseite, E-Mail-Gate, Erfolgsseite) zeigt aktuell
keine Testimonials an.

## Wie echte Testimonials später eingebunden werden

Sobald die echten Testimonials vorliegen (Text, Name/Kürzel, optional Foto,
optional Zuordnung zu einem Hauptcode A–E), bitte hier in folgendem Format
eintragen:

```md
## Testimonial 1
- Zugeordneter Hauptcode: A | B | C | D | E | allgemein
- Name/Kürzel:
- Zitat:
- Quelle/Einwilligung vorhanden: ja/nein
```

Der Code ist so vorbereitet, dass Testimonials leicht austauschbar sind:
Sobald echte Inhalte hier eingetragen sind, können sie z.B. in
`src/data/testimonials.ts` strukturiert übernommen und in der UI angezeigt
werden (aktuell bewusst nicht implementiert, um keine Platzhalter-/
Dummy-Inhalte auszuliefern).

**Wichtig:** Bitte nur Testimonials einfügen, für die eine Einwilligung zur
Veröffentlichung vorliegt (DSGVO).
