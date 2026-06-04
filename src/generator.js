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
    story: 'Was, wenn Kommunen ihren Klimarisiko-Score direkt aus staatlichen Umweltmessdaten und Unternehmens-Finanzkennzahlen berechnen könnten? Diese Fusion macht die wirtschaftliche Verletzlichkeit durch den Klimawandel kleinräumig sichtbar – Grundlage für die erste datengetriebene Klimarisikoversicherung für Städte.',
    a: { sector: 'staat',      theme: 'TH_06' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  'fa-chart-line',
    story: 'Wissenschaftliche Längsschnittstudien kennen den Bildungsweg. Unternehmensdaten kennen das Gehalt am Ende. Zusammengeführt entsteht der erste evidenzbasierte Rendite-Rechner für öffentliche Bildungsinvestitionen: Wie viel Steuer zahlt ein Hochschulabgänger mehr als ein Schulabbrecher – und rechtfertigt das die Investition?',
    a: { sector: 'wissenschaft', theme: 'TH_02' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  'fa-map',
    story: 'Staatliche Sozialdaten kennen die Zahlen. Zivilgesellschaftliche Beratungsstatistiken kennen die Gesichter dahinter. Zusammengeführt entsteht eine granulare Vulnerabilitätskarte, die Hotspots sozialer Notlagen sichtbar macht – bevor sie zu Krisen werden.',
    a: { sector: 'staat',             theme: 'TH_03' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  'fa-church',
    story: 'Religiöse Gemeinschaften betreiben Kitas, Hospize und Sozialstationen – deren Standorte fließen nie in kommunale Planungsprozesse ein. Geodaten religiöser Einrichtungen, überlagert mit kommunalen Standortdaten, erzeugen die erste Karte der unsichtbaren sozialen Infrastruktur Deutschlands.',
    a: { sector: 'religion', object: 'OB_05' },
    b: { sector: 'staat',    object: 'OB_05' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  'fa-leaf',
    story: 'Was kostet ein Schmetterling? Wissenschaftliche Artenerfassungen und wirtschaftliche Flächennutzungsdaten, erstmals kombiniert, erlauben es, den volkswirtschaftlichen Wert der Biodiversität in Unternehmenskalkulationen zu verankern. Ein erster Schritt zum True-Cost-Accounting.',
    a: { sector: 'wissenschaft', theme: 'TH_09' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'medienspiegel-gesellschaft',
    title: 'Medienspiegel der Gesellschaft',
    icon:  'fa-newspaper',
    story: 'Medien beobachten gesellschaftliche Probleme täglich. Staatliche Sozialdaten messen dieselbe Realität in Statistiken. Zusammengeführt entsteht ein Spiegel: Wo berichtet die Öffentlichkeit über soziale Schieflagen, die in der Amtsstatistik längst sichtbar sind – und wo hinkt die Wahrnehmung der Realität hinterher?',
    a: { sector: 'medien', theme: 'TH_03' },
    b: { sector: 'staat',  theme: 'TH_03' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  'fa-hospital',
    story: 'Staatliche Versorgungsdaten zeigen, wo Ärzte sitzen. Zivilgesellschaftliche Beratungsstatistiken zeigen, wo Menschen trotzdem nicht ankommen. Die Lücke zwischen Angebot und Inanspruchnahme zu messen ist der erste Schritt zur Gesundheitsgerechtigkeit.',
    a: { sector: 'staat',             theme: 'TH_01' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  'fa-scale-balanced',
    story: 'Kommunale Haushaltsdaten gegen Unternehmens-Finanzberichte: Welcher Sektor legt seine Zahlen ehrlicher offen? Ein sektorübergreifender Transparenz-Index würde Druck auf intransparente Akteure erzeugen – und zeigen, wo Offenheit bereits gelebte Praxis ist.',
    a: { sector: 'staat',      theme: 'TH_07' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  'fa-microscope',
    story: 'Wissenschaftliche Erkenntnisse bleiben oft in Journals vergraben. Verknüpft man Forschungsoutput-Daten mit dem tatsächlichen Datenbedarf zivilgesellschaftlicher Bildungsträger, lässt sich messen, welche Forschung gesellschaftlich ankommt – und welche nicht.',
    a: { sector: 'wissenschaft',      theme: 'TH_10' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  'fa-handshake',
    story: 'Kirchen und Wohlfahrtsverbände leisten Milliarden an Sozialarbeit, die in keiner staatlichen Statistik als "Investition" erscheint. Kirchliche Sozialdaten gekreuzt mit staatlichen Sozialhilfedaten: der erste Versuch, das religiöse Sozialkapital als messbare volkswirtschaftliche Größe zu erfassen.',
    a: { sector: 'religion', theme: 'TH_03' },
    b: { sector: 'staat',    theme: 'TH_03' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  'fa-earth-europe',
    story: 'Staatliche Umweltmessstationen erfassen was passiert. Wissenschaftliche Klimamodelle erklären warum. Diese Fusion bricht Forschungssilos auf: Rohdaten aus Messstationen direkt an Klimamodelle gekoppelt beschleunigen die Erkenntnisproduktion – und machen Behörden zu Forschungspartnern.',
    a: { sector: 'staat',        theme: 'TH_06' },
    b: { sector: 'wissenschaft', theme: 'TH_06' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  'fa-gavel',
    story: 'Welche Gesetze schaffen es in die Schlagzeilen – und welche verändern das Leben still? Staatliche Rechtsdaten gekreuzt mit juristischen Mediendaten erzeugen einen "Legislative Attention Score": ein Frühwarnsystem für demokratische Wissenslücken, das zeigt, wo Justiz und öffentliche Wahrnehmung auseinanderdriften.',
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
