// ── Helpers ───────────────────────────────────────────────────────────────────

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Constants ────────────────────────────────────────────────────────────────

const SECTORS = [
  { id: 'staat',             name: 'Staat und Verwaltung',       file: 'sector_staat.json',             color: '#1a3461' },
  { id: 'wirtschaft',        name: 'Wirtschaft',                 file: 'sector_wirtschaft.json',        color: '#1c2f3e' },
  { id: 'wissenschaft',      name: 'Wissenschaft und Forschung', file: 'sector_wissenschaft.json',      color: '#2d1a6e' },
  { id: 'zivilgesellschaft', name: 'Zivilgesellschaft',          file: 'sector_zivilgesellschaft.json', color: '#4a1a8c' },
  { id: 'medien',            name: 'Medien und Kultur',          file: 'sector_medien.json',            color: '#8b1248' },
  { id: 'religion',          name: 'Religionsgemeinschaften',    file: 'sector_religion.json',          color: '#0a3d38' },
];

const VOCAB = {
  openness: [
    { code: 'OP_01', label: 'Sofort publizierbar',           color: '#27ae60' },
    { code: 'OP_02', label: 'Nach Aufbereitung publizierbar', color: '#d4a017' },
    { code: 'OP_03', label: 'Nur Metadaten publizierbar',    color: '#c0392b' },
  ],
  theme: [
    { code: 'TH_01', label: 'Gesundheit' },        { code: 'TH_02', label: 'Bildung' },
    { code: 'TH_03', label: 'Soziales' },           { code: 'TH_04', label: 'Wirtschaft' },
    { code: 'TH_05', label: 'Verwaltung' },         { code: 'TH_06', label: 'Umwelt' },
    { code: 'TH_07', label: 'Finanzen' },           { code: 'TH_08', label: 'Recht' },
    { code: 'TH_09', label: 'Natur/Biodiversität' },{ code: 'TH_10', label: 'Wissenschaft/Technik' },
  ],
  object: [
    { code: 'OB_01', label: 'Personenbezogene Daten' }, { code: 'OB_02', label: 'Textdokumente' },
    { code: 'OB_03', label: 'Finanzdaten' },             { code: 'OB_04', label: 'Messungen / Sensordaten' },
    { code: 'OB_05', label: 'Geodaten' },                { code: 'OB_06', label: 'Mediendaten' },
    { code: 'OB_07', label: 'Transaktionsdaten' },       { code: 'OB_08', label: 'Metadaten' },
  ],
  granularity: [
    { code: 'GR_01', label: 'Einzelereignis / Rohdaten' }, { code: 'GR_02', label: 'Aggregiert' },
    { code: 'GR_03', label: 'Kleinräumig (Stadtteil / Gemeinde)' }, { code: 'GR_04', label: 'Individuell / Mikrodaten' },
  ],
  format: [
    { code: 'FT_01', label: 'CSV' },    { code: 'FT_02', label: 'JSON' },
    { code: 'FT_03', label: 'NetCDF / HDF5' }, { code: 'FT_04', label: 'XML' },
    { code: 'FT_05', label: 'GeoJSON' },{ code: 'FT_06', label: 'Shapefile' },
  ],
  license: [
    { code: 'LI_01', label: 'CC0 / Public Domain' }, { code: 'LI_02', label: 'CC BY 4.0' },
    { code: 'LI_03', label: 'Datenlizenz Deutschland' }, { code: 'LI_04', label: 'Proprietär / Restriktiv' },
  ],
};

const MIN_L4 = 15;

const VALID_CODES = {
  openness:    new Set(['OP_01','OP_02','OP_03']),
  theme:       new Set(['TH_01','TH_02','TH_03','TH_04','TH_05','TH_06','TH_07','TH_08','TH_09','TH_10']),
  object:      new Set(['OB_01','OB_02','OB_03','OB_04','OB_05','OB_06','OB_07','OB_08']),
  granularity: new Set(['GR_01','GR_02','GR_03','GR_04']),
  format:      new Set(['FT_01','FT_02','FT_03','FT_04','FT_05','FT_06']),
  license:     new Set(['LI_01','LI_02','LI_03','LI_04']),
};

// ── State ────────────────────────────────────────────────────────────────────

let sectorData    = null;
let currentSector = null;
let selectedL2    = null;
let selectedL3    = null;

// ── DOM refs ─────────────────────────────────────────────────────────────────

const sectorSel  = document.getElementById('sector-sel');
const l2Sel      = document.getElementById('l2-sel');
const l3Sel      = document.getElementById('l3-sel');
const l3Row      = document.getElementById('l3-row');
const coverageSt = document.getElementById('coverage-stat');
const countInput = document.getElementById('count-input');
const genBtn     = document.getElementById('gen-prompt-btn');
const promptOut  = document.getElementById('prompt-out');
const copyPrompt = document.getElementById('copy-prompt-btn');
const pasteArea  = document.getElementById('paste-area');
const validateBtn= document.getElementById('validate-btn');
const valOut     = document.getElementById('val-out');
const mergeBtn   = document.getElementById('merge-btn');
const dlSrc      = document.getElementById('dl-source-btn');
const dlCtx      = document.getElementById('dl-context-btn');
const statusEl   = document.getElementById('load-status');
const coverageWrap = document.getElementById('coverage-wrap');
const coverageList = document.getElementById('coverage-list');

// ── Boot ─────────────────────────────────────────────────────────────────────

SECTORS.forEach(s => {
  const opt = document.createElement('option');
  opt.value = s.id;
  opt.textContent = s.name;
  sectorSel.appendChild(opt);
});

sectorSel.addEventListener('change', () => loadSector(sectorSel.value));
l2Sel.addEventListener('change',     () => selectL2ById(l2Sel.value));
l3Sel.addEventListener('change',     () => selectL3ById(l3Sel.value));
genBtn.addEventListener('click',     generatePrompt);
copyPrompt.addEventListener('click', copyPromptText);
validateBtn.addEventListener('click',validatePaste);
mergeBtn.addEventListener('click',   mergeAndDownload);
dlSrc.addEventListener('click',      downloadSource);
dlCtx.addEventListener('click',      downloadContext);

// ── Data loading ─────────────────────────────────────────────────────────────

async function loadSector(id) {
  sectorData  = null;
  selectedL2  = null;
  selectedL3  = null;
  currentSector = SECTORS.find(s => s.id === id);

  l2Sel.innerHTML  = '<option value="">— L2 wählen —</option>';
  l3Sel.innerHTML  = '<option value="">Alle L3</option>';
  l2Sel.disabled   = true;
  l3Sel.disabled   = true;
  l3Row.hidden     = true;
  genBtn.disabled  = true;
  dlSrc.disabled   = true;
  dlCtx.disabled   = true;
  coverageSt.textContent = '';
  coverageWrap.hidden    = true;
  coverageList.innerHTML = '';
  clearOutputs();

  if (!currentSector) return;

  statusEl.textContent = 'Lade Daten…';
  statusEl.className   = 'ex-status';

  const base = import.meta.env.BASE_URL || './';
  try {
    const res = await fetch(`${base}data/${currentSector.file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    sectorData = await res.json();
  } catch (e) {
    statusEl.textContent = `Fehler: ${e.message}`;
    statusEl.className   = 'ex-status ex-error';
    return;
  }

  statusEl.textContent = '';
  populateL2Select();
  renderCoverage();
  dlSrc.disabled = false;
  dlCtx.disabled = false;
}

// ── Selectors ─────────────────────────────────────────────────────────────────

function countL4(node) {
  if (node.level === 4) return 1;
  return (node.children || []).reduce((s, c) => s + countL4(c), 0);
}

function populateL2Select() {
  l2Sel.innerHTML = '<option value="">— L2 wählen —</option>';
  (sectorData.children || []).forEach(l2 => {
    const cnt = countL4(l2);
    const opt = document.createElement('option');
    opt.value = l2.id;
    opt.textContent = `${l2.name}  (${cnt} L4)`;
    l2Sel.appendChild(opt);
  });
  l2Sel.disabled = false;
}

function selectL2ById(id) {
  selectedL2 = (sectorData?.children || []).find(n => n.id === id) || null;
  selectedL3 = null;

  l3Sel.innerHTML = '<option value="">Alle L3</option>';
  l3Row.hidden    = true;
  l3Sel.disabled  = true;
  genBtn.disabled = !selectedL2;
  clearOutputs();

  if (!selectedL2) { coverageSt.textContent = ''; return; }

  const cnt = countL4(selectedL2);
  const cls = cnt >= MIN_L4 ? 'ex-ok' : cnt >= MIN_L4 * 0.6 ? 'ex-warn' : 'ex-error';
  coverageSt.innerHTML = `<span class="${cls}">${cnt} L4-Einträge</span> · ${selectedL2.children?.length ?? 0} L3-Aktivitäten`;

  (selectedL2.children || []).forEach(l3 => {
    const opt = document.createElement('option');
    opt.value = l3.id;
    opt.textContent = `${l3.name}  (${countL4(l3)} L4)`;
    l3Sel.appendChild(opt);
  });
  if ((selectedL2.children || []).length) {
    l3Row.hidden   = false;
    l3Sel.disabled = false;
  }
}

function selectL3ById(id) {
  selectedL3 = id ? (selectedL2?.children || []).find(n => n.id === id) || null : null;
  clearOutputs();
}

// ── Coverage dashboard ────────────────────────────────────────────────────────

function renderCoverage() {
  coverageList.innerHTML = '';
  const l2nodes = sectorData.children || [];
  const total   = l2nodes.reduce((s, n) => s + countL4(n), 0);
  const below   = l2nodes.filter(n => countL4(n) < MIN_L4).length;

  const summary = document.createElement('p');
  summary.className = 'ex-cov-summary';
  summary.innerHTML = `<strong>${l2nodes.length}</strong> Org. · <strong>${total}</strong> L4-Einträge · <span class="${below ? 'ex-warn' : 'ex-ok'}">${below} unter ${MIN_L4}-Ziel</span>`;
  coverageList.appendChild(summary);

  l2nodes.forEach(node => {
    const cnt = countL4(node);
    const pct = Math.min(cnt / MIN_L4, 1);
    const cls = cnt >= MIN_L4 ? 'ok' : cnt >= MIN_L4 * 0.6 ? 'warn' : 'bad';
    const row = document.createElement('div');
    row.className = 'ex-cov-row';
    row.innerHTML = `
      <span class="ex-cov-name">${escHtml(node.name)}</span>
      <span class="ex-cov-cnt ex-cov-${cls}">${cnt}</span>
      <div class="ex-bar-wrap"><div class="ex-bar-fill ex-bar-${cls}" style="width:${Math.round(pct*100)}%"></div></div>`;
    coverageList.appendChild(row);
  });

  coverageWrap.hidden = false;
}

// ── Prompt generation ─────────────────────────────────────────────────────────

function collectExistingIds(node) {
  const ids = [];
  function walk(n) {
    if (n.level === 4) ids.push(n.id);
    (n.children || []).forEach(walk);
  }
  walk(node);
  return ids;
}

function generatePrompt() {
  if (!selectedL2) return;

  const target  = selectedL3 || selectedL2;
  const scope   = selectedL3
    ? `L3-Aktivität "${selectedL3.name}" innerhalb der L2-Organisation "${selectedL2.name}"`
    : `L2-Organisation "${selectedL2.name}"`;
  const ids     = collectExistingIds(target);
  const count   = parseInt(countInput.value, 10) || 10;
  const sector  = currentSector.name;
  const l4color = selectedL2.children?.[0]?.children?.[0]?.color
               ?? selectedL2.children?.[0]?.color
               ?? selectedL2.color;
  const l3info  = selectedL3 ? '' : `\nBestehende L3-Aktivitäten in dieser L2:\n${
    (selectedL2.children || []).map(l3 => `  - ${l3.name} (${countL4(l3)} L4 vorhanden)`).join('\n')}`;

  const prompt = `Du bist ein Datenexperte für deutsche Verwaltung, Gesellschaft und Wissenschaft.

AUFGABE:
Generiere exakt ${count} neue L4-Datentyp-Einträge für den Sektor "${sector}", ${scope}.${l3info}

Systematisch fragen:
1. Was ERHEBT diese Organisation? (Primärdaten)
2. Was PRODUZIERT sie als Output? (Berichte, Statistiken)
3. Was ist gesetzlich zur VERÖFFENTLICHUNG verpflichtet?
4. Was ist für ANDERE SEKTOREN wertvoll? (Cross-Sektor-Relevanz)

BEREITS VORHANDENE IDs (nicht wiederverwenden!):
${ids.length ? ids.map(i => `  "${i}"`).join('\n') : '  (keine)'}

VOKABULAR (nur diese Codes verwenden):

Openness (details.openness.class):
  OP_01 = Sofort publizierbar
  OP_02 = Nach Aufbereitung publizierbar
  OP_03 = Nur Metadaten publizierbar

Theme (details.theme.code):
  TH_01=Gesundheit  TH_02=Bildung  TH_03=Soziales  TH_04=Wirtschaft
  TH_05=Verwaltung  TH_06=Umwelt   TH_07=Finanzen  TH_08=Recht
  TH_09=Natur/Biodiversität  TH_10=Wissenschaft/Technik

Object (details.object.code):
  OB_01=Personenbezogene Daten  OB_02=Textdokumente  OB_03=Finanzdaten
  OB_04=Messungen/Sensordaten   OB_05=Geodaten       OB_06=Mediendaten
  OB_07=Transaktionsdaten       OB_08=Metadaten

Granularity (details.granularity.code):
  GR_01=Einzelereignis/Rohdaten  GR_02=Aggregiert  GR_03=Kleinräumig  GR_04=Mikrodaten

Format (details.format[].code):
  FT_01=CSV  FT_02=JSON  FT_03=NetCDF/HDF5  FT_04=XML  FT_05=GeoJSON  FT_06=Shapefile

License (details.license.code):
  LI_01=CC0/Public Domain  LI_02=CC BY 4.0  LI_03=Datenlizenz Deutschland  LI_04=Proprietär

PFLICHTSTRUKTUR (exakt so, kein Feld weglassen):
{
  "id": "unique-kebab-case-id",
  "level": 4,
  "name": "Anzeigename",
  "color": "${l4color}",
  "details": {
    "description": "Beschreibung des Datensatzes...",
    "openness": { "class": "OP_01", "label": "Sofort publizierbar", "explanation": "..." },
    "theme":       { "code": "TH_01" },
    "object":      { "code": "OB_01" },
    "granularity": { "code": "GR_01" },
    "format": [ { "code": "FT_01", "label": "CSV" } ],
    "license": { "code": "LI_01" },
    "relevance": 5,
    "processes": [ { "method": "Methode", "description": "Verarbeitungsbeschreibung" } ]
  }
}

KRITISCHE FEHLER vermeiden:
- NICHT "openness": {"code": ...} → muss "class" sein
- NICHT "formats": [...] → muss "format" (singular)
- NICHT den "details"-Wrapper weglassen
- Farbe "${l4color}" nicht ändern
- Keine reservierten Farben: #27ae60, #d4a017, #c0392b

AUSGABE:
Gib ausschließlich ein JSON-Array aus (kein Markdown, kein Kommentar, kein Codeblock):
[
  { ...erster Eintrag... },
  { ...zweiter Eintrag... }
]`;

  promptOut.value = prompt;
  copyPrompt.disabled = false;
  promptOut.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyPromptText() {
  navigator.clipboard.writeText(promptOut.value).then(() => {
    copyPrompt.textContent = '✓ Kopiert!';
    setTimeout(() => copyPrompt.textContent = 'Kopieren', 1800);
  });
}

// ── Validation ────────────────────────────────────────────────────────────────

function validatePaste() {
  valOut.innerHTML = '';
  mergeBtn.disabled = true;

  const raw = pasteArea.value.trim();
  if (!raw) { valOut.innerHTML = '<span class="ex-error">Kein Text eingefügt.</span>'; return; }

  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) {
    valOut.innerHTML = `<span class="ex-error">JSON-Fehler: ${escHtml(e.message)}</span>`;
    return;
  }

  if (!Array.isArray(parsed)) {
    valOut.innerHTML = '<span class="ex-error">Erwartet: JSON-Array [...]</span>';
    return;
  }

  const errors   = [];
  const warnings = [];
  const existingIds = new Set(sectorData ? collectExistingIds(sectorData) : []);
  const newIds      = new Set();

  parsed.forEach((node, i) => {
    const idx = `#${i+1} &quot;${escHtml(node.name ?? '?')}&quot;`;

    if (!node.id)                             errors.push(`${idx}: fehlendes "id"`);
    else if (!/^[a-z0-9-]+$/.test(node.id))  errors.push(`${idx}: id enthält ungültige Zeichen ("${escHtml(node.id)}")`);
    else if (existingIds.has(node.id))        errors.push(`${idx}: id "${escHtml(node.id)}" bereits vorhanden`);
    else if (newIds.has(node.id))             errors.push(`${idx}: id "${escHtml(node.id)}" doppelt im Batch`);
    else                                      newIds.add(node.id);

    if (node.level !== 4) errors.push(`${idx}: level muss 4 sein`);
    if (!node.name)        errors.push(`${idx}: fehlendes "name"`);
    if (!node.color)       errors.push(`${idx}: fehlendes "color"`);

    const d = node.details;
    if (!d) { errors.push(`${idx}: fehlendes "details"-Objekt`); return; }

    if (!d.description) errors.push(`${idx}: fehlendes details.description`);
    if (!d.openness)    errors.push(`${idx}: fehlendes details.openness`);
    else {
      if (d.openness.code && !d.openness.class) errors.push(`${idx}: openness.code → muss "class" heißen`);
      else if (!VALID_CODES.openness.has(d.openness.class)) errors.push(`${idx}: ungültiger openness.class "${escHtml(d.openness.class)}"`);
    }
    if (!d.theme?.code)        errors.push(`${idx}: fehlendes details.theme.code`);
    else if (!VALID_CODES.theme.has(d.theme.code)) errors.push(`${idx}: ungültiger theme.code "${escHtml(d.theme.code)}"`);
    if (!d.object?.code)       errors.push(`${idx}: fehlendes details.object.code`);
    else if (!VALID_CODES.object.has(d.object.code)) errors.push(`${idx}: ungültiger object.code "${escHtml(d.object.code)}"`);
    if (!d.granularity?.code)  errors.push(`${idx}: fehlendes details.granularity.code`);
    else if (!VALID_CODES.granularity.has(d.granularity.code)) errors.push(`${idx}: ungültiger granularity.code "${escHtml(d.granularity.code)}"`);

    if (d.formats && !d.format) errors.push(`${idx}: "formats" → muss "format" (singular) heißen`);
    if (!Array.isArray(d.format) || d.format.length === 0) errors.push(`${idx}: details.format muss ein nicht-leeres Array sein`);
    else d.format.forEach((f, fi) => {
      if (!VALID_CODES.format.has(f.code)) errors.push(`${idx}: ungültiger format[${fi}].code "${escHtml(f.code)}"`);
    });

    if (!d.license?.code) errors.push(`${idx}: fehlendes details.license.code`);
    else if (!VALID_CODES.license.has(d.license.code)) errors.push(`${idx}: ungültiger license.code "${escHtml(d.license.code)}"`);

    if (typeof d.relevance !== 'number' || d.relevance < 1 || d.relevance > 10) warnings.push(`${idx}: details.relevance sollte 1–10 sein`);
    if (!Array.isArray(d.processes) || d.processes.length === 0) warnings.push(`${idx}: keine details.processes angegeben`);
  });

  const lines = [];
  if (errors.length === 0 && warnings.length === 0) {
    lines.push(`<span class="ex-ok">✓ ${parsed.length} Einträge valide – bereit zum Einfügen.</span>`);
    mergeBtn.disabled = false;
    mergeBtn.dataset.validated = JSON.stringify(parsed);
  } else {
    if (errors.length)   lines.push(`<span class="ex-error">${errors.length} Fehler:</span>\n${errors.map(e => `  ✗ ${e}`).join('\n')}`);
    if (warnings.length) lines.push(`<span class="ex-warn">${warnings.length} Warnungen:</span>\n${warnings.map(w => `  ⚠ ${w}`).join('\n')}`);
    if (errors.length === 0) {
      lines.push(`<span class="ex-ok">Keine Fehler – ${parsed.length} Einträge einfügbar (trotz Warnungen).</span>`);
      mergeBtn.disabled = false;
      mergeBtn.dataset.validated = JSON.stringify(parsed);
    }
  }
  valOut.innerHTML = lines.join('\n\n');
}

// ── Merge & Download ──────────────────────────────────────────────────────────

function mergeAndDownload() {
  if (!mergeBtn.dataset.validated || !sectorData || !selectedL2) return;

  const newNodes = JSON.parse(mergeBtn.dataset.validated);
  const merged   = JSON.parse(JSON.stringify(sectorData));

  const l2 = (merged.children || []).find(n => n.id === selectedL2.id);
  if (!l2) { alert('L2-Knoten nicht gefunden.'); return; }

  let target = l2;
  if (selectedL3) {
    target = (l2.children || []).find(n => n.id === selectedL3.id) || l2;
  }

  if (!Array.isArray(target.children)) target.children = [];

  if (target.level === 2) {
    const lastL3 = target.children[target.children.length - 1];
    if (lastL3) {
      if (!Array.isArray(lastL3.children)) lastL3.children = [];
      lastL3.children.push(...newNodes);
    } else {
      target.children.push({ id: `${target.id}-daten`, level: 3, name: 'Daten', color: target.color, children: newNodes });
    }
  } else {
    target.children.push(...newNodes);
  }

  downloadJSON(merged, currentSector.file);
}

// ── File downloads ────────────────────────────────────────────────────────────

function downloadSource() {
  if (!sectorData) return;
  downloadJSON(sectorData, currentSector.file);
}

function downloadContext() {
  if (!sectorData) return;

  const vocabText = Object.entries(VOCAB).map(([key, items]) =>
    `### ${key}\n${items.map(i => `${i.code} = ${i.label}`).join('\n')}`
  ).join('\n\n');

  const pkg = {
    meta:       { generated: new Date().toISOString(), sector: currentSector.name, purpose: 'LLM context package for Datenatlas data expansion' },
    schema:     '## L4-Pflichtstruktur\n{"id":"unique-kebab-case-id","level":4,"name":"...","color":"#HEX","details":{"description":"...","openness":{"class":"OP_XX","label":"...","explanation":"..."},"theme":{"code":"TH_XX"},"object":{"code":"OB_XX"},"granularity":{"code":"GR_XX"},"format":[{"code":"FT_XX","label":"..."}],"license":{"code":"LI_XX"},"relevance":5,"processes":[{"method":"...","description":"..."}]}}',
    vocabulary: vocabText,
    sectorData: sectorData,
  };

  downloadJSON(pkg, `context_${currentSector.id}.json`);
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function clearOutputs() {
  promptOut.value     = '';
  copyPrompt.disabled = true;
  pasteArea.value     = '';
  valOut.innerHTML    = '';
  mergeBtn.disabled   = true;
  delete mergeBtn.dataset.validated;
}
