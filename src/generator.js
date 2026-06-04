// ── Cross-Sector-Fusion-Generator ─────────────────────────────────────────────

export const SECTOR_META = {
  staat:             { name: 'Staat & Verwaltung',       color: '#1e5799' },
  wirtschaft:        { name: 'Wirtschaft',               color: '#2c3e50' },
  wissenschaft:      { name: 'Wissenschaft & Forschung', color: '#4527a0' },
  zivilgesellschaft: { name: 'Zivilgesellschaft',        color: '#6d28d9' },
  medien:            { name: 'Medien & Kultur',          color: '#be185d' },
  religion:          { name: 'Religionsgemeinschaften',  color: '#134e4a' },
};

// ── Scenario matrix ───────────────────────────────────────────────────────────
// Each scenario defines two "arms" (a + b), each filtered by sector + theme or
// object code. The generator picks one real L4 entry from each arm at random.

export const SCENARIOS = [
  {
    id:    'klimarisiko',
    title: 'Klimarisiko-Karte',
    icon:  '🌡',
    story: 'Was, wenn Kommunen ihren Klimarisiko-Score direkt aus staatlichen Umweltmessdaten und Unternehmens-Finanzkennzahlen berechnen könnten? Diese Fusion macht die wirtschaftliche Verletzlichkeit durch den Klimawandel kleinräumig sichtbar – Grundlage für die erste datengetriebene Klimarisikoversicherung für Städte.',
    a: { sector: 'staat',      theme: 'TH_06' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  '📈',
    story: 'Wissenschaftliche Längsschnittstudien kennen den Bildungsweg. Unternehmensdaten kennen das Gehalt am Ende. Zusammengeführt entsteht der erste evidenzbasierte Rendite-Rechner für öffentliche Bildungsinvestitionen: Wie viel Steuer zahlt ein Hochschulabgänger mehr als ein Schulabbrecher – und rechtfertigt das die Investition?',
    a: { sector: 'wissenschaft', theme: 'TH_02' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  '🗺',
    story: 'Staatliche Sozialdaten kennen die Zahlen. Zivilgesellschaftliche Beratungsstatistiken kennen die Gesichter dahinter. Zusammengeführt entsteht eine granulare Vulnerabilitätskarte, die Hotspots sozialer Notlagen sichtbar macht – bevor sie zu Krisen werden.',
    a: { sector: 'staat',             theme: 'TH_03' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  '⛪',
    story: 'Religiöse Gemeinschaften betreiben Kitas, Hospize und Sozialstationen – deren Standorte fließen nie in kommunale Planungsprozesse ein. Geodaten religiöser Einrichtungen, überlagert mit kommunalen Standortdaten, erzeugen die erste Karte der unsichtbaren sozialen Infrastruktur Deutschlands.',
    a: { sector: 'religion', object: 'OB_05' },
    b: { sector: 'staat',    object: 'OB_05' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  '🦋',
    story: 'Was kostet ein Schmetterling? Wissenschaftliche Artenerfassungen und wirtschaftliche Flächennutzungsdaten, erstmals kombiniert, erlauben es, den volkswirtschaftlichen Wert der Biodiversität in Unternehmenskalkulationen zu verankern. Ein erster Schritt zum True-Cost-Accounting.',
    a: { sector: 'wissenschaft', theme: 'TH_09' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'medienspiegel-verwaltung',
    title: 'Medienspiegel der Gesellschaft',
    icon:  '📰',
    story: 'Medien beobachten gesellschaftliche Probleme und Wirtschaft täglich. Staatliche Sozialdaten messen dieselbe Realität in Statistiken. Zusammengeführt entsteht ein Spiegel: Wo berichtet die Öffentlichkeit über soziale Schieflagen, die in der Amtsstatistik längst sichtbar sind – und wo hinkt die Wahrnehmung der Realität hinterher?',
    a: { sector: 'medien', theme: 'TH_03' },
    b: { sector: 'staat',  theme: 'TH_03' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  '🏥',
    story: 'Staatliche Versorgungsdaten zeigen, wo Ärzte sitzen. Zivilgesellschaftliche Beratungsstatistiken zeigen, wo Menschen trotzdem nicht ankommen. Die Lücke zwischen Angebot und Inanspruchnahme zu messen ist der erste Schritt zur Gesundheitsgerechtigkeit.',
    a: { sector: 'staat',             theme: 'TH_01' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  '⚖️',
    story: 'Kommunale Haushaltsdaten gegen Unternehmens-Finanzberichte: Welcher Sektor legt seine Zahlen ehrlicher offen? Ein sektorübergreifender Transparenz-Index würde Druck auf intransparente Akteure erzeugen – und zeigen, wo Offenheit bereits gelebte Praxis ist.',
    a: { sector: 'staat',      theme: 'TH_07' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  '🔬',
    story: 'Wissenschaftliche Erkenntnisse bleiben oft in Journals vergraben. Verknüpft man Forschungsoutput-Daten mit dem tatsächlichen Datenbedarf zivilgesellschaftlicher Bildungsträger, lässt sich messen, welche Forschung gesellschaftlich ankommt – und welche nicht.',
    a: { sector: 'wissenschaft',      theme: 'TH_10' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  '🤝',
    story: 'Kirchen und Wohlfahrtsverbände leisten Milliarden an Sozialarbeit, die in keiner staatlichen Statistik als "Investition" erscheint. Kirchliche Sozialdaten gekreuzt mit staatlichen Sozialhilfedaten: der erste Versuch, das religiöse Sozialkapital als messbare volkswirtschaftliche Größe zu erfassen.',
    a: { sector: 'religion', theme: 'TH_03' },
    b: { sector: 'staat',    theme: 'TH_03' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  '🌍',
    story: 'Staatliche Umweltmessstationen erfassen was passiert. Wissenschaftliche Klimamodelle erklären warum. Diese Fusion bricht Forschungssilos auf: Rohdaten aus Messstationen direkt an Klimamodelle gekoppelt beschleunigen die Erkenntnisproduktion – und machen Behörden zu Forschungspartnern.',
    a: { sector: 'staat',        theme: 'TH_06' },
    b: { sector: 'wissenschaft', theme: 'TH_06' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  '⚖',
    story: 'Welche Gesetze schaffen es in die Schlagzeilen – und welche verändern das Leben still? Staatliche Rechtsdaten gekreuzt mit juristischen Mediendaten erzeugen einen "Legislative Attention Score": ein Frühwarnsystem für demokratische Wissenslücken, das zeigt, wo Justiz und öffentliche Wahrnehmung auseinanderdriften.',
    a: { sector: 'staat',  theme: 'TH_08' },
    b: { sector: 'medien', theme: 'TH_08' },
  },
];

// ── Filter logic ──────────────────────────────────────────────────────────────

let _index    = [];
let _ready    = false;
let _onNavigate = null;

export function initGenerator({ indexPromise, onNavigate }) {
  _onNavigate = onNavigate;
  indexPromise.then(idx => { _index = idx; _ready = true; });
}

function pickFromIndex({ sector, theme, object }) {
  const pool = _index.filter(e => {
    if (e.tile.level !== 4)                            return false;
    if (e.breadcrumb[1]?.id !== sector)                return false;
    if (theme  && e.tile.details?.theme?.code  !== theme)  return false;
    if (object && e.tile.details?.object?.code !== object) return false;
    return true;
  });
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Returns { scenario, entryA, entryB } or null if not ready / no match found
export function roll() {
  if (!_ready || !_index.length) return null;

  // Shuffle scenario order, then walk it until both arms yield a real match
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
  for (const scenario of shuffled) {
    const entryA = pickFromIndex(scenario.a);
    const entryB = pickFromIndex(scenario.b);
    if (entryA && entryB) return { scenario, entryA, entryB };
  }
  return null;
}

export function navigateToEntry(entry) {
  _onNavigate?.(entry);
}
