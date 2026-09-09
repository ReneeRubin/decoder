/**
 * Echte Kunden-Testimonials, bereitgestellt von Renée (WhatsApp-Nachrichten
 * von Klientinnen). Zur Wahrung der Privatsphäre wird nur der Vorname
 * verwendet, nicht der vollständige Name aus dem Chat-Verlauf.
 *
 * WICHTIG: Es liegt keine dokumentierte, ausdrückliche schriftliche
 * Einwilligung zur ÖFFENTLICHEN Veröffentlichung dieser ursprünglich
 * privaten Nachrichten vor – nur die Bereitstellung durch die Absenderin
 * (Renée) selbst. Bitte vor Live-Schaltung final bestätigen, dass die
 * Klientinnen mit der Veröffentlichung (Vorname + Zitat) einverstanden
 * sind. Nichts an den Zitaten wurde inhaltlich verändert, nur gekürzt.
 */

export interface Testimonial {
  name: string;
  quote: string;
  context: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alexandra",
    quote:
      "Ich bin in meiner Mitte angekommen, habe Frieden gemacht mit so vielen Dingen. Ich kann sagen, dass ich glücklich, entspannt, angstfrei und schmerzfrei bin.",
    context: "nach 4 Monaten Begleitung",
  },
  {
    name: "Verena",
    quote:
      "Seit ich mit meiner Vision arbeite, bin ich seit rund 5 Wochen schmerzfrei im unteren Rücken. Du hast mir vieles gezeigt, was ich eigentlich fast verloren hatte.",
    context: "schmerzfrei im unteren Rücken",
  },
];
