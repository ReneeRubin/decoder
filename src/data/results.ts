import type { MainCodeId, SpurId } from "../types";

/**
 * Vollständige Ergebnis-Inhalte laut fachlicher Vorgabe.
 *
 * WICHTIG: Diese Inhalte werden NICHT auf der Website angezeigt (siehe
 * Vorgabe Abschnitt 5 & 71 – kein Ergebnis vor/ohne E-Mail-Versand). Sie sind
 * die Single Source of Truth für den Aufbau des Brevo-Ergebnis-Mail-Templates
 * (siehe docs/brevo-email-content.md für die Copy-Paste-Fassung) und wurden
 * 1:1 aus der fachlichen Vorgabe übernommen – nichts wurde ergänzt oder frei
 * erfunden.
 */

export interface MainCodeContent {
  id: MainCodeId;
  title: string;
  subtitle: string;
  text: string;
  reflectionQuestions: [string, string, string];
  threeSecondFocus: string;
}

export const MAIN_CODE_CONTENT: Record<MainCodeId, MainCodeContent> = {
  A: {
    id: "A",
    title: "Die Funktionierende",
    subtitle:
      "Du kannst unglaublich viel tragen – und genau das kann dazu führen, dass du dich selbst dabei übersiehst.",
    text: `Du bist wahrscheinlich eine Frau, die nicht so schnell aufgibt. Auch wenn dein Körper längst signalisiert, dass es zu viel wird, läuft in dir häufig noch der Satz: „Das muss jetzt noch gehen."

Diese Fähigkeit hat dich weit gebracht. Gleichzeitig könnte genau hier eine wichtige Spur liegen: Wie oft bemerkst du deine eigenen Grenzen erst dann, wenn dein Körper dich dazu zwingt?

Das bedeutet nicht, dass dieses Muster die Ursache deiner Schmerzen ist. Aber es könnte ein Zusammenhang sein, den es sich lohnt, bewusster zu beobachten.`,
    reflectionQuestions: [
      "Wo mache ich gerade weiter, obwohl ich eigentlich eine Pause brauche?",
      "Was würde passieren, wenn ich nicht erst zusammenbrechen müsste, um innezuhalten?",
      "Was brauche ich gerade wirklich?",
    ],
    threeSecondFocus:
      "Halte heute einmal für drei Sekunden inne und frage dich: „Was brauche ich gerade – bevor ich weitermache?“",
  },
  B: {
    id: "B",
    title: "Die Verantwortungsträgerin",
    subtitle: "Du bist jemand, auf den sich andere verlassen können. Aber wer trägt eigentlich dich?",
    text: `Du scheinst viel Verantwortung zu übernehmen und Dinge gerne selbst in der Hand zu haben. Vielleicht bist du oft diejenige, die organisiert, entscheidet, auffängt und dafür sorgt, dass alles läuft.

Die spannende Frage ist nicht, ob du Verantwortung übernehmen kannst.

Sondern: Welche Verantwortung trägst du vielleicht längst, obwohl sie nicht alleine bei dir liegen müsste?`,
    reflectionQuestions: [
      "Was trage ich gerade, das ich nicht alleine tragen müsste?",
      "Wo könnte ich Unterstützung zulassen?",
      "Was würde ich abgeben, wenn ich nicht das Gefühl hätte, alles zusammenhalten zu müssen?",
    ],
    threeSecondFocus: "Welche eine Sache darf heute jemand anderes mittragen?",
  },
  C: {
    id: "C",
    title: "Die Kontrollierende",
    subtitle: "Du gibst viel – und möchtest verständlicherweise, dass Dinge funktionieren.",
    text: `Du scheinst Sicherheit stark darüber herzustellen, dass du Dinge planst, organisierst und im Griff behältst. Hohe Ansprüche können eine enorme Stärke sein.

Doch vielleicht gibt es Situationen, in denen dein System kaum noch Raum für Ungewissheit lässt.

Eine interessante Spur könnte deshalb sein: Wo versuchst du gerade, etwas zu kontrollieren, das sich nicht vollständig kontrollieren lässt?`,
    reflectionQuestions: [
      "Was versuche ich gerade unbedingt im Griff zu behalten?",
      "Was würde passieren, wenn ich nicht alles perfekt lösen müsste?",
      "Wo könnte ich ein kleines bisschen mehr loslassen?",
    ],
    threeSecondFocus: "Was darf heute einfach gut genug sein?",
  },
  D: {
    id: "D",
    title: "Die Angepasste",
    subtitle:
      "Du spürst oft sehr schnell, was andere brauchen. Die spannende Frage ist: Spürst du genauso schnell, was DU brauchst?",
    text: `Du scheinst eine hohe Sensibilität für andere Menschen und ihre Bedürfnisse zu haben. Das ist eine wunderschöne Stärke.

Doch genau diese Stärke kann dazu führen, dass die eigenen Bedürfnisse leiser werden.

Vielleicht lohnt sich deshalb ein neuer Blick darauf: Wo sagst du „Es ist schon okay“, obwohl ein Teil von dir eigentlich etwas anderes möchte?`,
    reflectionQuestions: [
      "Wo passe ich mich gerade an?",
      "Was würde ich wählen, wenn ich niemanden enttäuschen müsste?",
      "Was brauche ich, ohne es rechtfertigen zu müssen?",
    ],
    threeSecondFocus: "Frage dich bei deiner nächsten Entscheidung zuerst: „Was möchte ICH?“",
  },
  E: {
    id: "E",
    title: "Die Überladene",
    subtitle: "Vielleicht ist nicht eine Sache zu viel – sondern alles gleichzeitig.",
    text: `Du scheinst viele Dinge gleichzeitig im Kopf und im Leben zu halten. Aufgaben, Erwartungen, Verantwortung, Termine und Gedanken laufen parallel.

Vielleicht besteht die Herausforderung deshalb gar nicht darin, noch besser zu funktionieren.

Sondern darin, wieder einen echten inneren Stopp zu schaffen.

Ein möglicher Zusammenhang, den du beobachten kannst: Was passiert mit deinem Körper, wenn dein Leben dauerhaft keinen echten Zwischenraum mehr hat?`,
    reflectionQuestions: [
      "Was muss wirklich JETZT passieren?",
      "Was darf warten?",
      "Welche eine Sache würde heute am meisten Ruhe schaffen?",
    ],
    threeSecondFocus: "Eine Sache. Ein Moment. Drei Sekunden. Nicht alles gleichzeitig.",
  },
};

export interface SpurContent {
  id: SpurId;
  heading: string;
  text: string;
  threeSecondFocus: string;
}

export const SPUR_CONTENT: Record<SpurId, SpurContent> = {
  ENERGIE: {
    id: "ENERGIE",
    heading: "DEINE AKTUELLE SPUR: ENERGIE",
    text: `Dein Ergebnis deutet darauf hin, dass deine Energie gerade eine interessante Spur für dich sein könnte.

Vielleicht geht es deshalb nicht nur darum, wie viel Energie du hast, sondern auch darum, wofür du sie jeden Tag verwendest – und was dir davon zurückgibt.

Gerade wenn du viel leistest, kann es leicht passieren, dass du funktionierst, lange bevor du bemerkst, dass deine eigenen Ressourcen eigentlich schon ziemlich leer sind.

Das bedeutet nicht, dass deine Energie die Ursache deiner Schmerzen ist.

Aber es könnte eine spannende Frage sein, genauer hinzuschauen: Wo verbrauchst du gerade mehr Energie, als du zurückbekommst?`,
    threeSecondFocus:
      "Was gibt mir gerade Energie – und was zieht mir Energie? Nicht analysieren. Nur wahrnehmen.",
  },
  EMOTIONEN: {
    id: "EMOTIONEN",
    heading: "DEINE AKTUELLE SPUR: EMOTIONEN",
    text: `Bei dir könnten deine Emotionen eine interessante Spur sein.

Vielleicht spürst du viel – hast aber gelernt, Gefühle schnell zur Seite zu schieben, zu analysieren oder erst dann wahrzunehmen, wenn schon sehr viel zusammengekommen ist.

Gerade leistungsorientierte Frauen sind oft unglaublich gut darin, Gefühle zu managen.

Die spannendere Frage ist: Was passiert, wenn du nicht sofort etwas mit deinem Gefühl machen musst?

Du musst nichts lösen. Du darfst zunächst einfach wahrnehmen, was da ist.`,
    threeSecondFocus: "Was fühle ich gerade wirklich? Nicht warum. Nicht was soll ich damit machen. Nur: Was ist da?",
  },
  GEDANKEN: {
    id: "GEDANKEN",
    heading: "DEINE AKTUELLE SPUR: GEDANKEN",
    text: `Dein Ergebnis deutet darauf hin, dass dein Kopf gerade eine besonders interessante Spur sein könnte.

Vielleicht analysierst, planst und löst du sehr viel. Dein Denken ist wahrscheinlich eine große Stärke – doch manchmal läuft es auch dann weiter, wenn eigentlich längst Pause wäre.

Die Frage ist deshalb nicht: „Wie bekomme ich meinen Kopf endlich still?“

Sondern: „Welche Gedanken verdienen gerade wirklich meine Aufmerksamkeit?“

Auch hier geht es nicht darum, Gedanken als Ursache deines Schmerzes zu betrachten. Es geht darum, bewusster wahrzunehmen, wie du mit ihnen umgehst.`,
    threeSecondFocus: "Muss ich diesen Gedanken gerade lösen – oder darf ich ihn einfach wahrnehmen?",
  },
};

/**
 * Verbindungstexte für explizit vorgegebene Hauptcode+Spur-Kombinationen
 * (Vorgabe Abschnitt 39). Für alle anderen Kombinationen darf laut Vorgabe
 * KEINE medizinische Aussage erzeugt werden – stattdessen wird im Brevo-
 * Template eine vorsichtige Verbindung aus Hauptcode- und Spur-Text gebildet
 * (siehe generateConnectionText in scripts/generate-brevo-content.ts).
 */
export const EXPLICIT_CONNECTIONS: Partial<Record<`${MainCodeId}_${SpurId}`, string>> = {
  A_ENERGIE:
    "Du kannst sehr lange funktionieren. Deine Energie-Spur macht sichtbar, dass die entscheidende Frage vielleicht nicht lautet, wie du noch mehr schaffen kannst, sondern wann du beginnst, deine eigenen Ressourcen ernst zu nehmen.",
  B_EMOTIONEN:
    "Du trägst viel Verantwortung. Deine emotionale Spur könnte darauf hinweisen, dass du dabei häufig stark bleiben und deine eigenen Gefühle zurückstellen musst.",
  C_GEDANKEN:
    "Du möchtest Dinge verstehen und im Griff haben. Deine Gedanken-Spur zeigt, dass dein Kopf dabei möglicherweise sehr viel Verantwortung übernimmt.",
  D_EMOTIONEN:
    "Du nimmst andere sehr fein wahr. Deine emotionale Spur könnte deshalb interessant sein: Wo spürst du andere schneller als dich selbst?",
  E_GEDANKEN:
    "Du hältst viele Dinge gleichzeitig im Kopf. Deine Gedanken-Spur könnte deshalb besonders relevant sein: Was darf gerade wirklich deine Aufmerksamkeit bekommen – und was darf warten?",
};

export const RESULT_MESSAGE_INTRO = {
  notNeeded: "Was du jetzt nicht brauchst:\n\nNoch mehr Druck.\n\nNoch mehr Übungen.\n\nNoch eine Methode, die du drei Wochen ausprobierst und dann wieder beiseitelegst.",
  insteadNeeded:
    "Was du stattdessen zunächst brauchst, ist Klarheit darüber, welche Zusammenhänge bei DIR eine Rolle spielen könnten.",
};

export const RENI_TRUST_BLOCK = `Ich bin Renée Rubin – Expertin für RückenbewusstSEIN und Rückenheldin.

Ich beschäftige mich nicht nur damit, WO dein Rücken schmerzt, sondern mit der Frage, WAS sich hinter deinem wiederkehrenden Schmerz möglicherweise verbirgt.

Denn wenn du schon vieles ausprobiert hast und der Schmerz trotzdem immer wiederkommt, lohnt es sich, eine andere Frage zu stellen.

Nicht: Was muss ich noch gegen meinen Rücken tun?

Sondern: Was habe ich bisher vielleicht noch nicht verstanden?`;

export const RUECKENKOMPASS = {
  cta: "MEINEN RÜCKENKOMPASS ENTDECKEN",
  subtitle: "Kostenfreies Rückenkompass-Gespräch",
  headline: "Du hast jetzt eine Spur. Lass uns herausfinden, was wirklich dahintersteckt.",
  text: `Der Rücken-Decoder kann dir einen ersten Zusammenhang sichtbar machen.

Er kann dir aber nicht sagen, welche Stellschraube bei DIR tatsächlich entscheidend ist.

Genau dafür gibt es den Rückenkompass.`,
};

export const MEDICAL_DISCLAIMER =
  "Dieser Test ist ein Reflexions- und Selbstwahrnehmungsangebot und ersetzt keine medizinische Diagnose. Bei starken, neuen oder ungewöhnlichen Schmerzen, neurologischen Symptomen (z. B. Taubheit, Kraftverlust) oder anderen medizinisch relevanten Beschwerden wende dich bitte zeitnah an eine Ärztin oder einen Arzt.";

/** Reihenfolge der Ergebnis-Mail laut Vorgabe Abschnitt 38. */
export const EMAIL_CONTENT_ORDER = [
  "Dein Rücken-Code (Hauptcode-Titel)",
  "Hauptmuster (Subtitle)",
  "Was ich bei dir erkenne (Text + Reflexionsfragen)",
  "Deine aktuelle Spur (Heading)",
  "Erklärung der Spur (Text)",
  "Verbindung beider Ebenen (Connection-Text)",
  "Reflexionsfragen",
  "3-Sekunden-Fokus",
  "Medizinischer/seriöser Hinweis",
  "Reni Trust Block",
  "Rückenkompass CTA",
] as const;
