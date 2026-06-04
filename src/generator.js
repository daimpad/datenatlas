// ── Cross-Sector-Fusion-Generator ─────────────────────────────────────────────
import { esc } from './utils.js';

export const SECTOR_META = {
  staat:             { name: 'Staat & Verwaltung',       color: '#1e5799' },
  wirtschaft:        { name: 'Wirtschaft',               color: '#2c3e50' },
  wissenschaft:      { name: 'Wissenschaft & Forschung', color: '#4527a0' },
  zivilgesellschaft: { name: 'Zivilgesellschaft',        color: '#6d28d9' },
  medien:            { name: 'Medien & Kultur',          color: '#be185d' },
  religion:          { name: 'Religionsgemeinschaften',  color: '#134e4a' },
};

export const SCENARIOS = [
  {
    id:    'klimarisiko',
    title: 'Klimarisiko-Karte',
    icon:  'fa-temperature-half',
    story: 'Staatliche Umweltmessdaten des Deutschen Wetterdienstes und des Umweltbundesamtes dokumentieren kleinräumig Extremwetterereignisse, Hitzebelastung und Überflutungswahrscheinlichkeiten. Unternehmensbilanzen und Branchenstatistiken erfassen die wirtschaftliche Exposition gegenüber klimabedingten Risiken – jedoch in einem anderen Bezugsrahmen und einer anderen räumlichen Auflösung. Eine belastbare Verknüpfung beider Quellen erfordert die Entwicklung gemeinsamer Raumbezugseinheiten sowie die Lösung datenschutzrechtlicher Fragen bei der Zuordnung unternehmensbezogener Daten zu Gemeindeebenen. Versuche einer solchen Integration existieren im Rahmen der TCFD-Empfehlungen vorrangig für Finanzinstitute, fehlen aber für kommunale Planungszwecke weitgehend. Eine systematische Verknüpfung könnte Planungsbehörden eine differenziertere Grundlage für Klimaanpassungsstrategien bieten als die derzeit verfügbaren aggregierten Risikoatlanten.',
    a: { sector: 'staat',      theme: 'TH_06' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  'fa-chart-line',
    story: 'Die fiskalische Rendite öffentlicher Bildungsinvestitionen ist in der Bildungsökonomie seit Jahrzehnten Forschungsgegenstand, für Deutschland aber aufgrund der Datenlage nur begrenzt belastbar kalkulierbar. Das Nationale Bildungspanel (NEPS) verfolgt Bildungsbiografien längsschnittlich, enthält jedoch keine direkten Angaben zu späteren Erwerbseinkommen und Steuerzahlungen. Eine Verknüpfung mit Daten der Deutschen Rentenversicherung oder des Mikrozensus würde es erlauben, Bildungsniveau und kumulierte Abgabenleistung über den Erwerbsverlauf systematisch in Beziehung zu setzen – methodisch und datenschutzrechtlich anspruchsvoll, aber grundsätzlich realisierbar. Bestehende OECD-Schätzungen weisen private Bildungsrenditen von fünf bis zwölf Prozent jährlich aus, während fiskalische Nettorenditen aufgrund von Ausbildungssubventionen und unterschiedlichen Transferleistungsquoten deutlich komplexer zu bestimmen sind. Eine auf deutschen Mikrodaten basierende Berechnung würde die Debatte über Bildungsausgaben auf eine empirisch tragfähigere Grundlage stellen.',
    a: { sector: 'wissenschaft', theme: 'TH_02' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  'fa-map',
    story: 'Staatliche Sozialdaten – darunter Grundsicherungsquoten, Arbeitslosenzahlen und Daten zur Wohnraumversorgung von Bundesagentur und Statistischen Ämtern – erfassen soziale Notlagen auf Kreis- oder Gemeindeebene. Beratungsstatistiken von Schuldnerberatungsstellen, Wohlfahrtsverbänden und Sozialhilfeträgern der freien Wohlfahrtspflege dokumentieren dagegen konkrete Bedarfslagen, die aggregierten Behördenstatistiken häufig vorangehen oder inhaltlich ergänzen. Ihre systematische Zusammenführung scheitert bisher an fehlender Standardisierung der Erhebungsformate freier Träger und an datenschutzrechtlichen Hürden bei der Weitergabe fallbezogener Daten. Dabei könnte eine kombinierte Analyse zeigen, ob und wo staatliche Sozialhilfedaten die tatsächliche Bedarfslage strukturell untererfassen – etwa bei Gruppen, die staatliche Leistungen aus unterschiedlichen Gründen nicht in Anspruch nehmen. Solche Instrumente werden im Kontext evidenzbasierter Sozialplanung diskutiert, sind aber mangels standardisierter Schnittstellen bislang kaum implementiert.',
    a: { sector: 'staat',             theme: 'TH_03' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  'fa-church',
    story: 'Religiöse Träger – Caritas, Diakonie, jüdische Wohlfahrt, aber auch kleinere Gemeinden – betreiben in Deutschland eine erhebliche Zahl sozialer Einrichtungen: Kindertagesstätten, Hospize, Pflegeeinrichtungen und Beratungsstellen. Deren geografische Verteilung ist in keinem einheitlichen nationalen Register erfasst; kirchliche Träger melden Standortdaten selektiv an Bundesstatistiken, ohne dass eine konsistente Gesamtkarte existiert. Eine Überlagerung verfügbarer Geodaten religiöser Einrichtungen mit kommunalen Sozialplanungsdaten würde Versorgungslücken sichtbar machen, die bei rein staatlicher Infrastrukturbetrachtung unsichtbar bleiben. In einzelnen Kommunen wird dies bereits im Rahmen integrierter Sozialraumanalysen praktiziert; eine bundesweit methodisch einheitliche Perspektive fehlt jedoch. Eine solche Analyse wäre keine Bewertung konfessioneller Trägerschaft, sondern eine analytische Grundlage für informierte kommunale Daseinsvorsorgeplanung.',
    a: { sector: 'religion', object: 'OB_05' },
    b: { sector: 'staat',    object: 'OB_05' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  'fa-leaf',
    story: 'Die ökonomische Bewertung biologischer Vielfalt ist Gegenstand eines wachsenden Forschungsfelds, das unter dem Begriff Natural Capital Accounting in internationalen Rahmenwerken wie SEEA und TNFD institutionalisiert wird. In Deutschland liefern wissenschaftliche Artenerfassungsprogramme – Florenkartierungen der Länder, Insektenmonitoring-Programme, Biotopkartierungen der Bundesländer – räumlich differenzierte Biodiversitätsdaten. Unternehmen erfassen Flächennutzung und wirtschaftliche Aktivitäten in Geschäftsberichten und Umweltberichten, ohne dass diese systematisch auf ökosystemare Auswirkungen hin ausgewertet würden. Eine Verknüpfung beider Datenstränge würde es ermöglichen, wirtschaftlich genutzte Flächen mit dem Stand der Biodiversitätsforschung in Beziehung zu setzen – ein notwendiger Schritt, um regulatorische Anforderungen wie die EU-Taxonomieverordnung mit empirischer Substanz zu füllen. Die methodischen Herausforderungen sind erheblich, insbesondere hinsichtlich räumlicher Skalierung und der Zurechnung diffuser Unternehmensauswirkungen auf konkrete Biodiversitätsverluste.',
    a: { sector: 'wissenschaft', theme: 'TH_09' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'medienspiegel-gesellschaft',
    title: 'Medienspiegel der Gesellschaft',
    icon:  'fa-newspaper',
    story: 'Ob massenmediale Berichterstattung gesellschaftliche Problemlagen proportional abbildet, wird in der Kommunikationswissenschaft unter dem Konzept des Agenda-Settings untersucht. Staatliche Sozialdaten – Armutsgefährdungsquoten, Obdachlosenzahlen, Grundsicherungsbezug – bieten eine empirisch belastbare Referenzebene für soziale Realitäten. Mediendaten erfordern eine systematische Inhaltsanalyse großer Textkorpora, deren Aufwand mit NLP-Methoden deutlich gesunken ist. Eine methodisch kontrollierte Verknüpfung beider Quellen über Zeitreihenanalysen auf Kreisebene könnte zeigen, ob mediale Aufmerksamkeit sozialen Krisen zeitlich voranläuft, nachläuft oder bestimmte Bevölkerungsgruppen strukturell unterrepräsentiert. Für Deutschland liegen entsprechende Studien nur vereinzelt vor; eine datengestützte Analyse auf Basis bestehender Medienarchive und amtlicher Statistiken wäre methodisch realisierbar und forschungspolitisch relevant.',
    a: { sector: 'medien', theme: 'TH_03' },
    b: { sector: 'staat',  theme: 'TH_03' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  'fa-hospital',
    story: 'Kassenärztliche Vereinigungen und das Bundesamt für Soziale Sicherung führen Daten zur Versorgungsdichte ambulanter und stationärer Gesundheitsversorgung nach Planungsbereichen. Beratungsorganisationen – Sozialverbände, Migrationsberatungsstellen, Selbsthilfeeinrichtungen – dokumentieren parallel Fälle nicht in Anspruch genommener Gesundheitsleistungen (Non-Take-Up), die in GKV-Abrechnungsdaten strukturell unsichtbar bleiben. Die Differenz zwischen formaler Versorgungsdichte und tatsächlicher Inanspruchnahme ist ein zentrales Forschungsobjekt der Versorgungsforschung, für Deutschland kleinräumig aber kaum dokumentiert. Eine Verknüpfung beider Datenstränge würde erlauben, Regionen und Bevölkerungsgruppen mit hohem Zugangsbarriererisiko zu identifizieren – eine Grundlage, die für zielgruppenspezifische Interventionen deutlich präziser wäre als bundesweite Aggregatstatistiken. Methodisch erfordert dies neben Datenanonymisierung eine Operationalisierung von Non-Take-Up-Indikatoren aus heterogenen Beratungsstatistiken.',
    a: { sector: 'staat',             theme: 'TH_01' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  'fa-scale-balanced',
    story: 'Transparenz im Haushaltswesen ist für öffentliche Körperschaften durch das Haushaltsgrundsätzegesetz und für Kapitalgesellschaften durch §§ 325 ff. HGB unterschiedlich reguliert, ohne dass ein einheitlicher Maßstab für Offenlegungsqualität existiert. Auf kommunaler Ebene variieren Vollständigkeit und Aktualität veröffentlichter Jahresabschlüsse erheblich; eine bundesweite Systematisierung fehlt trotz vereinzelter kommunalwirtschaftlicher Studien. Auf der Unternehmensseite erlaubt das Bundesanzeiger-Register eine automatisierte Auswertung des Offenlegungsverhaltens, das je nach Unternehmensgröße und Rechtsform stark variiert. Ein komparativer Transparenzindex, der öffentliche und privatwirtschaftliche Akteure nach gemeinsamen Kriterien – Vollständigkeit, Aktualität, Maschinenlesbarkeit – bewertet, würde eine für Forschung und Zivilgesellschaft nützliche Vergleichsbasis schaffen. Entsprechende Ansätze existieren auf europäischer Ebene (OpenTED, Open Spending), sind aber auf nationaler Ebene nicht flächendeckend umgesetzt.',
    a: { sector: 'staat',      theme: 'TH_07' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  'fa-microscope',
    story: 'Der Transfer wissenschaftlicher Erkenntnisse in gesellschaftliche Praxis ist ein zentrales Thema der Wissenschaftssoziologie und Forschungspolitik, wird aber überwiegend qualitativ untersucht. Forschungsoutput-Daten aus Repositorien wie dem GEPRIS der DFG oder dem CORDIS-System der EU-Kommission ermöglichen eine thematische und institutionelle Klassifizierung von Projekten und Publikationen. Bedarfsprofile zivilgesellschaftlicher Bildungsträger – Volkshochschulen, Wohlfahrtsverbände, außerschulische Einrichtungen – sind in Jahresprogrammen und Fördermittelanträgen dokumentiert, wurden aber nie systematisch mit dem wissenschaftlichen Publikationsgeschehen abgeglichen. Eine quantitative Analyse dieser Lücke würde Felder identifizieren, in denen gesellschaftlicher Erkenntnisbedarf und Forschungsoutput systematisch auseinanderklaffen. Research-Practice Gaps sind in der angloamerikanischen Bildungsforschung methodisch etabliert; für den deutschen Kontext fehlen entsprechende datengestützte Studien.',
    a: { sector: 'wissenschaft',      theme: 'TH_10' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  'fa-handshake',
    story: 'Religiöse Träger erbringen über die Spitzenverbände der freien Wohlfahrtspflege – Caritas, Diakonie, Zentralwohlfahrtsstelle der Juden – umfangreiche soziale Dienstleistungen, die teils durch staatliche Zuwendungen kofinanziert werden. Die volkswirtschaftliche Gesamtbedeutung dieses Sektors ist bisher nur unzureichend quantifiziert, da kirchliche Statistiken heterogen und selten mit amtlichen Sozialstatistiken kompatibel sind. Ein methodisch belastbarer Vergleich würde Daten der Bundesarbeitsgemeinschaft der Freien Wohlfahrtspflege (BAGFW) mit Daten des Statistischen Bundesamts zu öffentlichen Sozialausgaben in Beziehung setzen. Die konzeptionelle Herausforderung liegt in der Abgrenzung: Was gilt als substitutiv zu staatlichen Leistungen, was als komplementär? Solche Analysen sind in der Welfare-Mix-Forschung methodisch thematisiert, in Deutschland empirisch aber kaum umgesetzt.',
    a: { sector: 'religion', theme: 'TH_03' },
    b: { sector: 'staat',    theme: 'TH_03' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  'fa-earth-europe',
    story: 'Deutschland verfügt mit dem Deutschen Wetterdienst, dem Umweltbundesamt und den Messnetzen der Landesumweltämter über eines der dichtesten Umweltmessnetze weltweit, dessen Rohdaten jedoch in institutionell getrennten Systemen mit unterschiedlichen Formaten und Zugangsmodalitäten vorliegen. Gleichzeitig arbeiten Klimaforschungsinstitute – MPI für Meteorologie, Helmholtz-Zentrum Hereon, Potsdam-Institut für Klimafolgenforschung – mit Klimamodellen, die auf validierten Beobachtungsdaten als Input angewiesen sind. Eine standardisierte Echtzeit-Schnittstelle zwischen Messnetz-Rohdaten und wissenschaftlichen Modellierungsinfrastrukturen würde die Validierungsqualität der Modelle verbessern und die Reaktionsgeschwindigkeit auf Extremereignisse erhöhen. Technische Vorarbeiten existieren in Form europäischer Datenaustauschstandards (INSPIRE-Richtlinie, Copernicus Climate Data Store), sind für nationale Forschungsanwendungen aber noch nicht flächendeckend nutzbar. Das zentrale Hemmnis ist weniger technischer Natur als vielmehr institutionell: die Überwindung von Datenhaltungssilos zwischen Bundesbehörden und Forschungseinrichtungen.',
    a: { sector: 'staat',        theme: 'TH_06' },
    b: { sector: 'wissenschaft', theme: 'TH_06' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  'fa-gavel',
    story: 'Bundesregierung und Bundestag veröffentlichen Daten zu Gesetzgebungsverfahren, Bundesratsdrucksachen und Plenarprotokollen als maschinenlesbare Datensätze, die eine quantitative Analyse der Gesetzgebungstätigkeit grundsätzlich ermöglichen. Mediendatenbanken dokumentieren parallel die journalistische Verarbeitung rechtlicher Entwicklungen – allerdings überwiegend hinter Paywalls und ohne standardisierte Schnittstellen zur Forschungsnutzung. Eine korrelative Analyse, welche Gesetzgebungsvorhaben überproportional mediale Aufmerksamkeit erhalten und welche kaum berichtet werden, würde demokratische Blindstellen im öffentlichen Diskurs sichtbar machen. Solche Fragestellungen werden in der politischen Kommunikationsforschung unter dem Begriff der Medialisierung von Politik untersucht, erfordern für eine systematische Umsetzung aber Datenzugangsvereinbarungen zwischen Medienhäusern und Forschungseinrichtungen, die in Deutschland selten existieren. Ein öffentlich zugänglicher Aufmerksamkeitsindex auf Basis offener Daten wäre ein wertvolles Instrument für demokratische Transparenz, steht aber vor erheblichen urheberrechtlichen Hürden bei der Nutzung redaktioneller Inhalte.',
    a: { sector: 'staat',  theme: 'TH_08' },
    b: { sector: 'medien', theme: 'TH_08' },
  },
];

// ── Filter logic ──────────────────────────────────────────────────────────────

let _index      = [];
let _ready      = false;
let _onNavigate = null;
let _currentResult = null;

export function initGenerator({ indexPromise, onNavigate }) {
  _onNavigate = onNavigate;
  indexPromise.then(idx => { _index = idx; _ready = true; });

  const modal      = document.getElementById('gen-modal');
  const closeBtn   = document.getElementById('gen-close');
  const rollBtn    = document.getElementById('gen-roll-btn');
  const triggerBtn = document.getElementById('gen-btn');

  triggerBtn.addEventListener('click', () => {
    modal.hidden = false;
    triggerBtn.classList.add('active');
    if (!_currentResult) _doRoll();
  });

  closeBtn.addEventListener('click', () => _close());
  modal.addEventListener('click', e => { if (e.target === modal) _close(); });
  rollBtn.addEventListener('click', () => _doRoll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) _close(); });

  function _close() {
    modal.hidden = true;
    triggerBtn.classList.remove('active');
  }
}

function _doRoll() {
  const result   = document.getElementById('gen-result');
  const rollIcon = document.getElementById('gen-roll-icon');

  rollIcon.classList.remove('spinning');
  void rollIcon.offsetWidth;
  rollIcon.classList.add('spinning');
  rollIcon.addEventListener('animationend', () => rollIcon.classList.remove('spinning'), { once: true });

  if (!_ready) {
    result.innerHTML = '<div class="gen-empty">Daten werden noch geladen…</div>';
    return;
  }

  result.classList.add('rolling');

  setTimeout(() => {
    const r = roll();
    if (r) {
      _currentResult = r;
      _renderResult(r);
    } else {
      result.innerHTML = '<div class="gen-empty">Kein passendes Szenario gefunden.</div>';
    }
    result.classList.remove('rolling');
  }, 190);
}

function _renderResult({ scenario, entryA, entryB }) {
  document.getElementById('gen-scenario-icon').innerHTML    = `<i class="fa-solid ${scenario.icon}"></i>`;
  document.getElementById('gen-scenario-title').textContent = scenario.title;
  document.getElementById('gen-story').textContent          = scenario.story;

  const tilesEl = document.getElementById('gen-tiles');
  tilesEl.innerHTML = buildTile(entryA, 'a') + '<div class="gen-connector"><i class="fa-solid fa-bolt"></i></div>' + buildTile(entryB, 'b');

  tilesEl.querySelectorAll('.gen-tile').forEach(el => {
    const handler = () => {
      const entry = el.dataset.side === 'a' ? entryA : entryB;
      navigateToEntry(entry);
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function buildTile(entry, side) {
  const sectorId  = entry.breadcrumb[1]?.id ?? '';
  const meta      = SECTOR_META[sectorId] ?? { name: sectorId, color: '#888' };
  const pathParts = entry.breadcrumb
    .filter(c => c.id != null && c.level >= 2 && c.level <= 3)
    .map(c => c.name);
  const pathStr   = pathParts.join(' · ');

  return `<div class="gen-tile" data-side="${side}" style="background:${meta.color};border-color:rgba(0,0,0,0.10);" tabindex="0" role="button">
    <div class="gen-tile-sector">
      <span class="gen-tile-dot" style="background:rgba(255,255,255,0.35)"></span>
      <span class="gen-tile-sector-name">${esc(meta.name)}</span>
    </div>
    <div class="gen-tile-name">${esc(entry.tile.name)}</div>
    <div class="gen-tile-path">${esc(pathStr)}</div>
    <div class="gen-tile-arrow"><i class="fa-solid fa-arrow-right"></i></div>
  </div>`;
}

function pickFromIndex({ sector, theme, object }) {
  const pool = _index.filter(e => {
    if (e.tile.level !== 4)                                    return false;
    if (e.breadcrumb[1]?.id !== sector)                        return false;
    if (theme  && e.tile.details?.theme?.code  !== theme)      return false;
    if (object && e.tile.details?.object?.code !== object)     return false;
    return true;
  });
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function roll() {
  if (!_ready || !_index.length) return null;
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
  for (const scenario of shuffled) {
    const entryA = pickFromIndex(scenario.a);
    const entryB = pickFromIndex(scenario.b);
    if (entryA && entryB) return { scenario, entryA, entryB };
  }
  return null;
}

export function navigateToEntry(entry) {
  document.getElementById('gen-modal').hidden = true;
  document.getElementById('gen-btn').classList.remove('active');
  _onNavigate?.(entry);
}
