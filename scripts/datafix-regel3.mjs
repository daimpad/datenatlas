// One-off: löst die 41 Regel-3-Verstöße auf, die der Qualitätsbericht meldet.
//
// Regel 3 des Begründungs-Regelwerks (src/begruendungs-regeln.js): Eine
// Begründung darf nicht behaupten, dass eine Organisation etwas bereits
// veröffentlicht — und ebenso wenig, dass sie es nicht tut. Beides ist ohne
// Recherche nicht belegbar und veraltet, sobald sich die Praxis ändert. Die
// Begründungen sollen gegenüber Datenschutzbeauftragten zitierbar bleiben;
// „wird schon veröffentlicht" ist dort kein Argument, sondern eine Behauptung,
// die der Gegenüber sofort prüfen kann.
//
// Das ist ausdrücklich KEIN Massengenerieren im Sinne der Warnung in CLAUDE.md.
// Dort geht es um die kurzen, aber zutreffenden Begründungen, die durch
// Aufblähen schlechter würden. Diese 41 sind das Gegenteil: sie sind falsch,
// weil sie Unbelegbares behaupten. Regel 6 des Regelwerks sieht für genau
// diesen Fall Neubildung vor.
//
// Jede neue Begründung stützt sich ausschließlich auf die Felder des Eintrags
// (Beschreibung, Öffnungsklasse, Objekttyp, Granularität, Lizenz) und nennt den
// sachlichen Mechanismus statt fremder Praxis. Rechtsgrundlagen erscheinen nur,
// wo sie in der Beschreibung selbst stehen (VerdStatG, DSA Art. 15,
// § 42 SGB VIII) — nichts davon ist hinzuerfunden.
//
// Zusätzlich sechs Feldkorrekturen: Einträge, deren Objekttyp oder
// Granularität der eigenen Beschreibung widerspricht. Sie stehen hier, weil
// eine Begründung sonst gegen ein Feld argumentieren müsste, das selbst falsch
// ist.
//
// Run: node scripts/datafix-regel3.mjs
import fs from 'fs';

const DIR = 'public/data';

// ── Feldkorrekturen ─────────────────────────────────────────────────────────
const FIELDS = {
  // OB_01 bei Beschreibungen, die Personenbezug ausdrücklich ausschließen
  'staat-stundenplan_daten':        { object: 'OB_08', why: 'Beschreibung: „ohne Lehrerpersonenbezug"' },
  'stundenplan_daten':              { object: 'OB_08', why: 'Beschreibung: „ohne Lehrerpersonenbezug"' },
  'vs-sicherheitsüberprüfungs-zahlen': { object: 'OB_08', why: 'aggregierte Verfahrenszahlen ohne Einzelergebnisse' },
  'mf-politbarometer':              { object: 'OB_08', why: 'ausgewiesen werden Anteilswerte, nicht Einzelinterviews' },
  // Evaluationsberichte sind Textdokumente, keine Messwerte; und sie bewerten
  // Programme, nicht einzelne Geförderte.
  'wirkungsanalysen-foerderung':    { object: 'OB_02', granularity: 'GR_02', why: 'Evaluationsberichte über Programme' },
  // Ausweisung je Bundesland ist GR_02 — GR_03 wäre Stadtteil/Gemeinde.
  'fachschule-fachkraeftemangel-branchen': { granularity: 'GR_02', why: 'Ausweisung je Bundesland' },
};

// ── Neue Begründungen ───────────────────────────────────────────────────────
const TEXTS = {
  'emeld-erstwohn-1':
    'Aggregierte Einwohnerzahlen nach Bezirk und Altersgruppe enthalten keinen Personenbezug; sie dienen der kommunalen Bedarfsplanung und stehen unter einer freien Datenlizenz, sind also unmittelbar publizierbar.',
  'staat-gesellschaft-bevoelkerungsprognose':
    'Prognosewerte sind berechnete Kennzahlen ohne Bezug auf einzelne Personen. Als Planungsgrundlage der Daseinsvorsorge besteht kein Schutzinteresse, das einer Veröffentlichung entgegenstünde.',
  'staat-stundenplan_daten':
    'Fächer, Klassenstufen und Raumzuordnungen sind Organisationsdaten der Schule; ohne Lehrerbezug entsteht kein Personenbezug. Die freie Lizenz erlaubt die maschinenlesbare Bereitstellung ohne weitere Aufbereitung.',
  'zoll-infra-grenzkontrollpunkte':
    'Standorte, Öffnungszeiten und Abfertigungskapazitäten beschreiben Infrastruktur, nicht Personen oder Einzelvorgänge. Die Angaben sind laut Beschreibung für die Logistikplanung Dritter bestimmt und frei lizenziert.',
  'vs-bericht-internet-radikalisierung':
    'Der Bericht nennt identifizierte Kanäle; deren Ausweisung wäre vor einer Veröffentlichung zu schwärzen. Die aggregierten Angaben zu Plattformen und Reichweiten bleiben danach als Lagebild publizierbar.',
  'vs-sicherheitsüberprüfungs-zahlen':
    'Verfahrenszahlen, Überprüfungsstufen und Bearbeitungszeiten sind über alle Verfahren aggregiert und lassen keine Rückschlüsse auf überprüfte Personen oder Einzelergebnisse zu; die freie Datenlizenz erlaubt die strukturierte Bereitstellung.',
  'destatis-lohnstatistik-verdienste':
    'Durchschnittswerte je Wirtschaftszweig und Bundesland sind vollständig aggregiert, ein Personen- oder Betriebsbezug besteht nicht. Die Erhebung beruht auf gesetzlicher Grundlage (VerdStatG), die Datenlizenz erlaubt die Weiterverwendung.',
  'sta-am-tarifentgelte':
    'Tarifindizes und Abdeckungsquoten sind über Wirtschaftszweige und Tarifregionen aggregiert; einzelne Beschäftigte oder Betriebe sind darin nicht erkennbar. Die freie Datenlizenz erlaubt die strukturierte Bereitstellung.',
  'lma-medienfusionskontrolle':
    'Aufsichtsberichte über die Konzentrationsprüfung von Medienübernahmen dokumentieren behördliches Handeln, nicht Personen. An der Berichtsfassung ist kein Geheimhaltungsinteresse erkennbar, und die freie Datenlizenz erlaubt die Weiterverwendung.',
  'lma-beschwerdestatistik-plattformen':
    'Der Digital Services Act (Art. 15) sieht halbjährliche Transparenzberichte der Plattformen vor. Die Aggregation der Landesmedienanstalten daraus enthält keine Nutzerdaten und steht unter Public-Domain-Lizenz.',
  'lma-jms-beschwerdestatistik':
    'Beschwerdezahlen nach Inhaltstyp sind über das Jahr aggregiert; weder beschwerdeführende Personen noch Einzelvorgänge sind darin enthalten. Unter freier Datenlizenz ohne weitere Aufbereitung publizierbar.',
  'jugendamt-inobhutnahmen-statistik':
    'Falldaten nach § 42 SGB VIII sind personenbezogen. Die Jahresstatistik ist aggregiert, doch die Gliederung nach Alter, Geschlecht und Anlass erfordert Zusammenfassung oberhalb einer Mindestfallzahl, damit Einzelfälle nicht rekonstruierbar werden.',
  'immo-markt-gewerbe-mieten':
    'Einzelne Mietverträge sind Geschäftsdaten der Beteiligten. Publizierbar sind Durchschnittsmieten und Leerstandsquoten erst nach Aggregation über mehrere Objekte je Mikrolage; die restriktive Lizenz bleibt davon unberührt.',
  'mf-politbarometer':
    'Ausgewiesen werden Anteilswerte über Befragtengruppen; die Einzelinterviews gehen nicht in die Veröffentlichung ein, ein Personenbezug besteht damit nicht. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'fahrzeugexport-zielmarkt-statistiken':
    'Exportvolumina nach Zielland und Fahrzeugsegment sind über alle Ausfuhren summiert; einzelne Unternehmen oder Lieferungen sind darin nicht erkennbar. Amtliche Statistik unter freier Datenlizenz.',
  'fi-beratung-politikgutachten':
    'Gutachten für Bundes- und Landesministerien enthalten keine personenbezogenen Daten. Sie entstehen im Auftrag öffentlicher Stellen und stehen unter CC BY — einer Veröffentlichung steht damit nichts entgegen.',
  'akad-st-konsensberichte':
    'Konsensberichte dokumentieren den Stand wissenschaftlicher Einigkeit und sind ihrem Zweck nach für die öffentliche Debatte bestimmt. Sie enthalten keine personenbezogenen Daten und stehen unter CC BY.',
  'adw-stellungnahmen-ad-hoc-gutachten':
    'Kurzgutachten zu wissenschaftspolitischen Fragen enthalten keine personenbezogenen Daten. Als Auftragsarbeit für Ministerien unter CC-BY-Lizenz ist die Weitergabe mit Quellenangabe ohne Aufbereitung möglich.',
  'wirkungsanalysen-foerderung':
    'Evaluationsberichte bewerten Programme, nicht einzelne Geförderte; Publikations- und Patentkennzahlen sind über die Programme aggregiert. Die Public-Domain-Lizenz erlaubt die uneingeschränkte Weiterverwendung.',
  'wirkungsanalysen-foerderinstrumente':
    'Die Studien weisen Effekte auf Ebene der Förderinstrumente aus, nicht je gefördertem Wissenschaftler; damit besteht kein Personenbezug. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'ffo-evaluation-programmevaluation-berichte':
    'Externe Evaluationsberichte bewerten Programme und deren Wirkung, nicht einzelne Personen oder Anträge; ein Personenbezug entsteht dabei nicht. Unter Public-Domain-Lizenz besteht keine Beschränkung der Weiterverwendung.',
  'wiss-wirtschaftsforschung-konjunkturprognosen':
    'Prognosewerte für BIP, Inflation und Arbeitslosigkeit sind gesamtwirtschaftliche Kennzahlen ohne Bezug zu Personen oder einzelnen Unternehmen. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'wiss-wirtschaftsforschung-haushaltsberatung':
    'Analysen zu Schuldenbremse, Steuerreformwirkungen und Ausgabenstruktur beziehen sich auf öffentliche Haushalte, nicht auf private Finanzdaten. Ein Schutzinteresse besteht nicht; CC BY erlaubt die Weiterverwendung.',
  'umweltbildungs-teilnehmerzahlen':
    'Teilnahme- und Reichweitenzahlen sind über Angebote und Einrichtungen summiert; einzelne Teilnehmende sind darin nicht erkennbar. Die CC-BY-Lizenz erlaubt die Weiterverwendung mit Quellenangabe.',
  'mediathek-nutzung':
    'Abrufzahlen je Sendung und Genre sind Nutzungssummen ohne Personenbezug. Der Aufbereitungsschritt ist die Zusammenführung der Einzelauswertungen zu einer durchgehenden Zeitreihe; eine Veröffentlichungspflicht dafür besteht nicht.',
  'rundfunkbeitrag-verwendungsnachweis':
    'Die Mittelverwendung des Rundfunkbeitrags ist eine Finanzkennzahl nach Programmbereichen; personenbezogene oder wettbewerbsrelevante Angaben sind darin nicht enthalten. Die Public-Domain-Lizenz erlaubt die strukturierte Bereitstellung.',
  'oer-eigenproduktionsquote':
    'Anteilswerte an der Sendezeit je Sender und Genre sind Programmkennzahlen ohne Personenbezug. Sie entstehen im Rahmen der Programmstrukturanalyse der Medienanstalten und stehen unter CC BY.',
  'medien-sportmedien-sportshow-einschaltquoten':
    'Quoten und Marktanteile je Sendung sind Reichweitenkennzahlen ohne Personenbezug. Die Beschränkung liegt bei den Nutzungsrechten an der Erhebung; erforderlich ist die Trennung frei verwendbarer Eckwerte vom lizenzgebundenen Detailbestand.',
  'ao-ams-top-sendungen-mediathek-monat':
    'Ein Ranking der meistabgerufenen Sendungen fasst Abrufe je Titel zusammen; Nutzerinnen und Nutzer sind darin nicht unterscheidbar. Die freie Datenlizenz erlaubt die Bereitstellung ohne weitere Aufbereitung.',
  'werbung-online-anteil':
    'Der Marktanteil der Online-Werbung ist eine Summe über alle Vermarkter; einzelne Unternehmensumsätze sind daraus nicht ableitbar. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'werbeausgaben-branchen-werbetreibende':
    'Werbebudgets einzelner Unternehmen sind Geschäftsdaten. Publizierbar sind sie erst nach Aggregation zu Branchensummen; die Ausweisung je Werbetreibendem bleibt durch die restriktive Lizenz der Erhebung gebunden.',
  'kulturfoerderatlas-bundesprojekte-sparte-region':
    'Zuwendungsempfänger sind Einrichtungen, nicht Personen, und die Fördersummen sind Ausgaben öffentlicher Mittel. Ein Geheimhaltungsinteresse ist nicht erkennbar; die Public-Domain-Lizenz erlaubt die strukturierte Bereitstellung.',
  'bvmi-digitaler-download-umsatz':
    'Die Umsätze sind über die meldenden Unternehmen zusammengefasst; weder einzelne Käufe noch Firmenanteile sind daraus ableitbar. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'amazon-buchhandel-marktanteil-deutschland':
    'Die Werte sind Schätzungen aus mehreren Branchenquellen, keine gemeldeten Umsätze. Vor einer Veröffentlichung ist die methodische Vereinheitlichung der Quellen nötig; deren restriktive Lizenzen bleiben zu beachten.',
  'juedisch-gemeindezählung':
    'Gezählt werden Gemeinden nach Größe, Region und Verbandsstruktur — die Einheit ist die Gemeinde, nicht das Mitglied. Ein Personenbezug entsteht dadurch nicht; CC BY erlaubt die Weiterverwendung.',
  'ditib-haushalt-moscheebaufoerderung':
    'Einnahmen und Bauausgaben eines Verbandes sind Finanzdaten ohne Personenbezug. Die Quellen liegen in unterschiedlich gebundener Form vor; erforderlich ist ihre Trennung und Zusammenführung zu einer einheitlichen Aufstellung.',
  'stundenplan_daten':
    'Fächer, Klassenstufen und Raumzuordnungen sind Organisationsdaten der Schule; ohne Lehrerbezug entsteht kein Personenbezug. Die freie Lizenz erlaubt die maschinenlesbare Bereitstellung ohne weitere Aufbereitung.',
  'loesungsquoten-ausbildungsvertraege-berufsfeld':
    'Lösungsquoten sind Anteilswerte je Berufsfeld und Bundesland, gebildet über alle Verträge; einzelne Auszubildende oder Betriebe sind darin nicht erkennbar. Unter freier Datenlizenz unmittelbar publizierbar.',
  'fachschule-internationale-anerkennung':
    'Äquivalenzfeststellungen und Verfahrensdauern sind nach Ländern zusammengefasst; einzelne Antragstellende sind darin nicht enthalten. Die CC-BY-Lizenz erlaubt die Weiterverwendung mit Quellenangabe.',
  'fachschule-fachkraeftemangel-branchen':
    'Offene Stellen, Vakanzzeiten und Engpasskennziffern sind je Berufsfeld und Bundesland aggregiert; weder Betriebe noch Bewerbende sind darin erkennbar. CC BY erlaubt die Weiterverwendung mit Quellenangabe.',
  'auslandsschule-sprachzertifikate-portfolio':
    'Gezählt werden Zertifizierungen nach Art und Region, nicht einzelne Prüflinge; ein Personenbezug entsteht dadurch nicht. Die CC-BY-Lizenz erlaubt die Weiterverwendung mit Quellenangabe.',
};

// Muss zum Muster in scripts/validate-data.js und src/begruendungen.js passen.
const PRACTICE_RE = /(veröffentlich(en|t) (bislang |bisher |in der regel |derzeit )?keine|(bereits|schon) (teilweise |weitgehend )?(öffentlich|frei) (zugänglich|verfügbar|abrufbar)|werden (bereits|regelmäßig|routinemäßig|standardmäßig) (veröffentlicht|publiziert|bereitgestellt)|teilweise (öffentlich|frei) (zugänglich|verfügbar)|(stellen|stellt) (die )?(daten )?nicht (öffentlich )?(bereit|zur verfügung)|geben (die daten )?nicht (heraus|frei))/i;
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// Selbstkontrolle, bevor irgendetwas geschrieben wird: Kein neuer Text darf
// selbst gegen Regel 3 verstoßen oder das Längenband von Regel 5 verlassen.
const bad = [];
for (const [id, t] of Object.entries(TEXTS)) {
  if (PRACTICE_RE.test(t)) bad.push(`${id}: verstößt selbst gegen Regel 3`);
  const w = words(t);
  if (w < 20 || w > 45) bad.push(`${id}: ${w} Wörter (Ziel 20–45)`);
}
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }

const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
const seen = new Set();
let nText = 0, nField = 0;
const log = [];

for (const s of main) {
  if (!s.subFile) continue;
  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const hadNL = raw.endsWith('\n');
  const data = JSON.parse(raw);
  let touched = 0;

  (function walk(node) {
    if (node.level === 4 && (TEXTS[node.id] || FIELDS[node.id])) {
      seen.add(node.id);
      const d = node.details;
      const parts = [];
      const f = FIELDS[node.id];
      if (f?.object && d.object?.code !== f.object) {
        parts.push(`object ${d.object.code}→${f.object}`); d.object.code = f.object; nField++;
      }
      if (f?.granularity && d.granularity?.code !== f.granularity) {
        parts.push(`granularity ${d.granularity.code}→${f.granularity}`); d.granularity.code = f.granularity; nField++;
      }
      const t = TEXTS[node.id];
      if (t && d.openness?.explanation !== t) {
        parts.push('Begründung neu gebildet'); d.openness.explanation = t; nText++;
      }
      if (parts.length) { touched++; log.push(`  ${node.id}: ${parts.join(', ')}${f ? `  — ${f.why}` : ''}`); }
    }
    (node.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (touched) fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

const missing = [...new Set([...Object.keys(TEXTS), ...Object.keys(FIELDS)])].filter(id => !seen.has(id));
console.log(log.join('\n'));
if (missing.length) console.log(`\n  ⚠ nicht gefunden: ${missing.join(', ')}`);
console.log(`\n  ── ${nText} Begründungen neu gebildet, ${nField} Felder korrigiert`);
