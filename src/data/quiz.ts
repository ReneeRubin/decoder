import type { QuizQuestion } from "../types";

/**
 * Die 12 Fragen des Rücken-Decoders.
 *
 * Fragen 1–9 bestimmen den HAUPTCODE (5 Typen A–E).
 * Fragen 10–12 bestimmen ausschließlich die AKTUELLE SPUR (Energie/Emotionen/Gedanken)
 * und dürfen den Hauptcode NICHT beeinflussen (siehe Vorgabe Abschnitt 15 & 29).
 *
 * Gewichtungen sind 1:1 aus der fachlichen Vorgabe übernommen. Nichts hier ist
 * frei erfunden – bei Unklarheiten wurde nichts ergänzt, sondern die Vorgabe
 * wörtlich umgesetzt.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    number: 1,
    id: "q1",
    group: "main",
    text: "Wenn dein Rücken sich wieder meldet – was passiert meistens zuerst?",
    options: [
      {
        id: "A",
        text: "Ich mache erstmal weiter. Ich kann mich jetzt nicht auch noch darum kümmern.",
        mainWeights: { A: 2 },
      },
      {
        id: "B",
        text: "Ich frage mich sofort, was ich körperlich falsch gemacht habe.",
        mainWeights: { C: 1 },
      },
      {
        id: "C",
        text: "Ich werde unruhig und möchte schnell wieder Kontrolle über meinen Körper bekommen.",
        mainWeights: { C: 2 },
      },
      {
        id: "D",
        text: "Ich ärgere mich vor allem darüber, dass ich schon wieder ausgebremst werde.",
        mainWeights: { A: 1, E: 1 },
      },
      {
        id: "E",
        text: "Ich merke plötzlich, dass eigentlich gerade alles zu viel ist.",
        mainWeights: { E: 2 },
      },
    ],
  },
  {
    number: 2,
    id: "q2",
    group: "main",
    text: "Wie reagierst du meistens, wenn du merkst: Eigentlich brauche ich gerade eine Pause?",
    options: [
      {
        id: "A",
        text: "Ich mache trotzdem weiter. Es gibt gerade Wichtigeres.",
        mainWeights: { A: 2 },
      },
      {
        id: "B",
        text: "Ich verschiebe die Pause auf später.",
        mainWeights: { A: 1, E: 1 },
      },
      {
        id: "C",
        text: "Ich erledige erst noch schnell alles, was offen ist.",
        mainWeights: { E: 2 },
      },
      {
        id: "D",
        text: "Ich mache die Pause – aber nur, wenn wirklich alles erledigt ist.",
        mainWeights: { C: 1, E: 1 },
      },
      {
        id: "E",
        text: "Ich nehme die Pause inzwischen meistens ernst.",
        mainWeights: {},
      },
    ],
  },
  {
    number: 3,
    id: "q3",
    group: "main",
    text: "Wann übergehst du dich selbst am ehesten?",
    options: [
      { id: "A", text: "Wenn andere etwas von mir brauchen.", mainWeights: { D: 2 } },
      { id: "B", text: "Wenn viel zu tun ist.", mainWeights: { A: 2 } },
      {
        id: "C",
        text: "Wenn ich das Gefühl habe, dass etwas sonst nicht richtig erledigt wird.",
        mainWeights: { B: 1, C: 1 },
      },
      {
        id: "D",
        text: "Wenn ich mir etwas vorgenommen habe und es unbedingt schaffen möchte.",
        mainWeights: { C: 2 },
      },
      { id: "E", text: "Wenn gleichzeitig zu viele Dinge passieren.", mainWeights: { E: 2 } },
    ],
  },
  {
    number: 4,
    id: "q4",
    group: "main",
    text: "Was sind gerade deine größten Herausforderungen im Alltag?",
    options: [
      {
        id: "A",
        text: "Zu viel Verantwortung und zu viele Menschen, die etwas von mir brauchen.",
        mainWeights: { B: 2 },
      },
      {
        id: "B",
        text: "Ich habe das Gefühl, ständig funktionieren zu müssen.",
        mainWeights: { A: 2 },
      },
      {
        id: "C",
        text: "Ich möchte allem gerecht werden und mache mir selbst viel Druck.",
        mainWeights: { C: 2 },
      },
      {
        id: "D",
        text: "Ich habe Schwierigkeiten, meine eigenen Bedürfnisse wirklich ernst zu nehmen.",
        mainWeights: { D: 2 },
      },
      { id: "E", text: "Ich habe zu viele Dinge gleichzeitig im Kopf.", mainWeights: { E: 2 } },
    ],
  },
  {
    number: 5,
    id: "q5",
    group: "main",
    text: "Welcher Satz läuft bei dir manchmal leise im Hintergrund?",
    options: [
      {
        id: "A",
        text: "Ich muss das noch fertig machen. Ich kann jetzt nicht ausfallen.",
        mainWeights: { A: 3 },
      },
      { id: "B", text: "Wenn ich es nicht mache, macht es keiner.", mainWeights: { B: 3 } },
      { id: "C", text: "Ich muss alles im Griff haben.", mainWeights: { C: 3 } },
      { id: "D", text: "Es ist schon okay. Ich komme später dran.", mainWeights: { D: 3 } },
      { id: "E", text: "Ich muss nur noch schnell alles schaffen.", mainWeights: { E: 3 } },
    ],
    interstitial: "Interessant. Genau hier beginnt der Blick hinter den Schmerz.",
  },
  {
    number: 6,
    id: "q6",
    group: "main",
    text: "Was passiert meistens, wenn du an deine Grenzen kommst?",
    options: [
      { id: "A", text: "Ich merke es erst sehr spät.", mainWeights: { A: 2 } },
      { id: "B", text: "Ich funktioniere trotzdem weiter.", mainWeights: { A: 2 } },
      {
        id: "C",
        text: "Ich versuche noch mehr zu organisieren oder zu kontrollieren.",
        mainWeights: { C: 2 },
      },
      {
        id: "D",
        text: "Ich werde gereizt, weil ich das Gefühl habe, dass alles an mir hängt.",
        mainWeights: { B: 2 },
      },
      {
        id: "E",
        text: "Ich fühle mich innerlich überladen und weiß gar nicht, wo ich anfangen soll.",
        mainWeights: { E: 2 },
      },
      {
        id: "F",
        text: "Ich sage anderen zu, obwohl ich eigentlich schon voll bin.",
        mainWeights: { D: 2 },
      },
    ],
  },
  {
    number: 7,
    id: "q7",
    group: "main",
    text: "Wie leicht fällt es dir, spontan zu sagen, was DU gerade brauchst?",
    options: [
      {
        id: "A",
        text: "Ehrlich gesagt weiß ich es oft gar nicht.",
        mainWeights: { D: 2, A: 1 },
      },
      { id: "B", text: "Ich weiß es – aber meistens ist gerade keine Zeit dafür.", mainWeights: { A: 2 } },
      { id: "C", text: "Ich weiß es, erlaube es mir aber nicht immer.", mainWeights: { D: 2 } },
      {
        id: "D",
        text: "Ich weiß ziemlich genau, was ich brauche, setze es aber oft erst um, wenn alles andere erledigt ist.",
        mainWeights: { E: 2 },
      },
      {
        id: "E",
        text: "Ich kann meine Bedürfnisse inzwischen gut wahrnehmen und ernst nehmen.",
        mainWeights: {},
      },
    ],
  },
  {
    number: 8,
    id: "q8",
    group: "main",
    text: "Wenn du einmal nicht nur auf deinen Rücken, sondern auf dein Leben schaust: Wo könnte gerade etwas nicht mehr wirklich stimmig sein?",
    options: [
      {
        id: "A",
        text: "Ich leiste viel, aber ich habe zu wenig Raum für mich.",
        mainWeights: { A: 1, E: 1 },
      },
      {
        id: "B",
        text: "Ich trage Verantwortung, die eigentlich nicht nur bei mir liegen müsste.",
        mainWeights: { B: 2 },
      },
      {
        id: "C",
        text: "Ich versuche, eine Situation unbedingt unter Kontrolle zu halten.",
        mainWeights: { C: 2 },
      },
      {
        id: "D",
        text: "Ich passe mich an etwas an, obwohl ich eigentlich etwas anderes möchte.",
        mainWeights: { D: 2 },
      },
      { id: "E", text: "Es gibt gerade einfach zu viele Baustellen gleichzeitig.", mainWeights: { E: 2 } },
      {
        id: "F",
        text: "Eigentlich ist mein Leben stimmig – ich verstehe nur meinen wiederkehrenden Schmerz nicht.",
        mainWeights: {},
      },
    ],
    interstitial: "Du bist fast da. Gleich siehst du, welches Muster bei dir besonders deutlich wird.",
  },
  {
    number: 9,
    id: "q9",
    group: "main",
    text: "Wenn dein Rücken dich morgen nicht mehr ausbremsen würde – was wäre ein echter kleiner Schritt, den du in deinem Leben wieder machen würdest?",
    options: [
      {
        id: "A",
        text: "Ich würde mir endlich wieder Zeit für mich nehmen.",
        mainWeights: { A: 1, D: 1 },
      },
      {
        id: "B",
        text: "Ich würde eine Verantwortung abgeben oder Hilfe annehmen.",
        mainWeights: { B: 2 },
      },
      {
        id: "C",
        text: "Ich würde etwas tun, obwohl ich noch nicht weiß, wie alles ausgeht.",
        mainWeights: { C: 2 },
      },
      {
        id: "D",
        text: "Ich würde endlich etwas tun, was ICH möchte – nicht nur, was andere brauchen.",
        mainWeights: { D: 2 },
      },
      {
        id: "E",
        text: "Ich würde eine Sache nach der anderen angehen, statt alles gleichzeitig schaffen zu wollen.",
        mainWeights: { E: 2 },
      },
    ],
  },
  {
    number: 10,
    id: "q10",
    group: "spur",
    text: "Wie fühlt sich deine Energie im Alltag meistens an?",
    options: [
      {
        id: "A",
        text: "Ich bin ständig auf Sendung. Ich funktioniere, obwohl ich mich eigentlich längst leer fühle.",
        spurWeights: { ENERGIE: 3 },
      },
      {
        id: "B",
        text: "Ich habe Phasen, in denen ich voller Energie bin – und dann bin ich plötzlich komplett leer.",
        spurWeights: { ENERGIE: 2 },
      },
      {
        id: "C",
        text: "Ich bin oft müde und erschöpft, selbst wenn ich eigentlich genug geschlafen habe.",
        spurWeights: { ENERGIE: 3 },
      },
      {
        id: "D",
        text: "Ich habe Energie, aber sie zerstreut sich auf tausend Dinge. Ich kann mich schwer auf eine Sache fokussieren.",
        spurWeights: { ENERGIE: 3 },
      },
      {
        id: "E",
        text: "Ich halte meine Energie gut zusammen – aber ich merke, dass ich dafür sehr viel Kontrolle brauche.",
        spurWeights: { ENERGIE: 2 },
      },
    ],
  },
  {
    number: 11,
    id: "q11",
    group: "spur",
    text: "Was passiert meistens mit deinen Emotionen, wenn es im Alltag schwierig wird?",
    options: [
      {
        id: "A",
        text: "Ich schiebe sie erstmal zur Seite. Dafür ist gerade keine Zeit.",
        spurWeights: { EMOTIONEN: 3 },
      },
      {
        id: "B",
        text: "Ich spüre sehr viel – aber ich weiß oft nicht, was davon eigentlich meins ist oder was ich damit machen soll.",
        spurWeights: { EMOTIONEN: 3 },
      },
      {
        id: "C",
        text: "Ich versuche zu verstehen, warum ich mich so fühle, und analysiere es.",
        spurWeights: { EMOTIONEN: 3 },
      },
      {
        id: "D",
        text: "Ich merke meine Gefühle vor allem dann, wenn ich schon ziemlich voll bin.",
        spurWeights: { EMOTIONEN: 3 },
      },
      {
        id: "E",
        text: "Ich spüre meine Gefühle und kann sie meistens annehmen, ohne sofort etwas lösen zu müssen.",
        spurWeights: { EMOTIONEN: 1 },
      },
    ],
  },
  {
    number: 12,
    id: "q12",
    group: "spur",
    text: "Was passiert in deinem Kopf, wenn du ein Problem nicht sofort lösen kannst?",
    options: [
      {
        id: "A",
        text: "Ich denke so lange darüber nach, bis ich eine Lösung gefunden habe.",
        spurWeights: { GEDANKEN: 3 },
      },
      {
        id: "B",
        text: "Mein Kopf springt sofort zu den nächsten zehn Dingen, die noch erledigt werden müssen.",
        spurWeights: { GEDANKEN: 3 },
      },
      {
        id: "C",
        text: "Ich frage mich, was ich falsch gemacht habe und was ich besser machen müsste.",
        spurWeights: { GEDANKEN: 3 },
      },
      {
        id: "D",
        text: "Ich denke zuerst darüber nach, was andere jetzt von mir brauchen.",
        spurWeights: { GEDANKEN: 3 },
      },
      {
        id: "E",
        text: "Ich kann einen Gedanken auch mal stehen lassen und später wieder darauf zurückkommen.",
        spurWeights: { GEDANKEN: 1 },
      },
    ],
  },
];

export const MAIN_QUESTIONS = QUIZ_QUESTIONS.filter((q) => q.group === "main");
export const SPUR_QUESTIONS = QUIZ_QUESTIONS.filter((q) => q.group === "spur");
