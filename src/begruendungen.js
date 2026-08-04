// ── Redaktionswerkzeug für Öffnungsbegründungen ──────────────────────────────
//
// Der Validator meldet, wie viele Begründungen unter fünf Wörtern liegen oder
// wortgleich mehrfach vorkommen. Dieses Werkzeug legt genau diese Einträge mit
// vollem Kontext vor, unterstützt beim Formulieren und gibt die geänderte
// Sektordatei zurück.
//
// Bewusst so gebaut: Vorschläge eines Sprachmodells landen ausschließlich in
// den Eingabefeldern, nie direkt in den Daten. Die Öffnungsbegründungen sollen
// gegenüber Datenschutzbeauftragten und Gremien verwendbar sein — dort ist ein
// unbelegter, aber selbstbewusst klingender Absatz schlechter als ein knapper
// richtiger Satz. Deshalb untersagt der Prompt das Erfinden von Fundstellen,
// und alles mit Rechtsbezug wird zur Prüfung markiert.

const SECTORS = [
  { id: 'staat',             name: 'Staat und Verwaltung',       file: 'sector_staat.json' },
  { id: 'wirtschaft',        name: 'Wirtschaft',                 file: 'sector_wirtschaft.json' },
  { id: 'wissenschaft',      name: 'Wissenschaft und Forschung', file: 'sector_wissenschaft.json' },
  { id: 'zivilgesellschaft', name: 'Zivilgesellschaft',          file: 'sector_zivilgesellschaft.json' },
  { id: 'medien',            name: 'Medien',                     file: 'sector_medien.json' },
  { id: 'kultur',            name: 'Kultur',                     file: 'sector_kultur.json' },
  { id: 'religion',          name: 'Religionsgemeinschaften',    file: 'sector_religion.json' },
  { id: 'bildung',           name: 'Bildung',                    file: 'sector_bildung.json' },
];

const MIN_WORDS = 5;   // gleiche Schwelle wie im Validator-Qualitätsbericht

// Fundstellen und Zuschreibungen an konkrete Stellen — nicht falsch, aber
// nachprüfbedürftig, weil ein Modell sie überzeugend erfinden kann.
const CLAIM_RE = /(§+\s*\d|Art\.\s*\d|Artikel\s+\d|Abs\.\s*\d|\bDSGVO\b|\bBDSG\b|\bIFG\b|\bStGB\b|\bSGB\b|\bGG\b|\bEU-Verordnung\b)/i;

function esc(s = '') {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;

const base = location.pathname.replace(/[^/]*$/, '');

let VOCAB = {};
let sectorData = null;      // geladene Sektordatei (wird in place bearbeitet)
let currentSector = null;
let entries = [];           // alle L4 mit Kontext
let shown = [];             // aktuell angezeigte Teilmenge
const touched = new Set();  // ids, deren Begründung in dieser Sitzung geändert wurde

const el = (id) => document.getElementById(id);
const sectorSel = el('sector-sel'), filterSel = el('filter-sel'), limitInput = el('limit-input');
const genBtn = el('gen-prompt-btn'), promptOut = el('prompt-out'), copyBtn = el('copy-btn');
const pasteArea = el('paste-area'), applyBtn = el('apply-btn'), applyStatus = el('apply-status');
const listEl = el('list'), dlBtn = el('dl-btn'), statusEl = el('load-status');
const prog = el('prog');

for (const s of SECTORS) {
  const o = document.createElement('option');
  o.value = s.id; o.textContent = s.name;
  sectorSel.appendChild(o);
}

fetch(`${base}data/vocabulary.json`)
  .then(r => r.json())
  .then(v => { VOCAB = v; })
  .catch(() => { /* Labels fallen auf Codes zurück */ });

function label(key, code) {
  return (VOCAB[key] ?? []).find(x => x.code === code)?.label ?? code ?? '';
}

// ── Laden ───────────────────────────────────────────────────────────────────
sectorSel.addEventListener('change', async () => {
  const sec = SECTORS.find(s => s.id === sectorSel.value);
  reset();
  if (!sec) return;
  currentSector = sec;
  statusEl.textContent = 'Lade …'; statusEl.classList.remove('err');
  try {
    const res = await fetch(`${base}data/${sec.file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    sectorData = await res.json();
  } catch (err) {
    statusEl.textContent = `Laden fehlgeschlagen: ${err.message}`;
    statusEl.classList.add('err');
    return;
  }
  collect();
  statusEl.textContent = `${entries.length.toLocaleString('de-DE')} Datentypen geladen`;
  filterSel.disabled = false; genBtn.disabled = false; dlBtn.disabled = false;
  prog.hidden = false;
  render();
});

function reset() {
  sectorData = null; currentSector = null; entries = []; shown = []; touched.clear();
  filterSel.disabled = true; genBtn.disabled = true; dlBtn.disabled = true;
  prog.hidden = true; promptOut.value = ''; copyBtn.disabled = true;
  statusEl.textContent = ''; statusEl.classList.remove('err');
  listEl.innerHTML = '<div class="empty">Zuerst einen Sektor wählen.</div>';
}

// Sammelt alle L4 mit ihrem Pfad und markiert wortgleiche Begründungen.
function collect() {
  entries = [];
  const counts = new Map();
  for (const org of sectorData.children ?? []) {
    for (const act of org.children ?? []) {
      for (const dt of act.children ?? []) {
        if (dt.level !== 4) continue;
        const expl = (dt.details?.openness?.explanation ?? '').trim();
        counts.set(expl, (counts.get(expl) ?? 0) + 1);
        entries.push({ node: dt, org: org.name, act: act.name, expl });
      }
    }
  }
  for (const e of entries) e.reused = (counts.get(e.expl) ?? 0) > 1;
}

// ── Auswahl und Anzeige ─────────────────────────────────────────────────────
filterSel.addEventListener('change', render);
limitInput.addEventListener('change', render);

function currentExpl(e) {
  return (e.node.details?.openness?.explanation ?? '').trim();
}

function matches(e, mode) {
  const short = words(currentExpl(e)) < MIN_WORDS;
  if (mode === 'short')  return short;
  if (mode === 'reused') return e.reused;
  if (mode === 'both')   return short || e.reused;
  return true;
}

function render() {
  if (!sectorData) return;
  const mode = filterSel.value;
  const limit = Math.max(1, Math.min(200, Number(limitInput.value) || 25));
  shown = entries.filter(e => matches(e, mode)).slice(0, limit);

  updateProgress();

  if (!shown.length) {
    listEl.innerHTML = '<div class="empty">Keine Einträge in dieser Auswahl — hier ist nichts offen.</div>';
    return;
  }

  listEl.innerHTML = shown.map((e, i) => {
    const d = e.node.details ?? {};
    const op = d.openness ?? {};
    const opColor = op.class === 'OP_01' ? '#27ae60' : op.class === 'OP_02' ? '#d4a017' : '#c0392b';
    const cur = currentExpl(e);
    const chips = [
      label('theme', d.theme?.code), label('object', d.object?.code),
      label('granularity', d.granularity?.code), label('license', d.license?.code),
    ].filter(Boolean).map(c => `<span class="chip">${esc(c)}</span>`).join('');
    return `<div class="item" style="--sev:${opColor}" data-i="${i}">
      <div class="item-path">${esc(e.org)} › ${esc(e.act)}</div>
      <div class="item-name">${esc(e.node.name)}</div>
      ${d.description ? `<div class="item-desc">${esc(d.description)}</div>` : ''}
      <div class="item-meta">
        <span class="chip op" style="color:${opColor}">${esc(op.label ?? op.class ?? '—')}</span>
        ${chips}
        ${e.reused ? '<span class="chip badge-reused">mehrfach im Sektor</span>' : ''}
      </div>
      <div class="item-cur">bisher: <b>${esc(cur) || '—'}</b></div>
      <textarea data-edit="${i}" placeholder="Begründung: Was macht diesen Datentyp publizierbar oder nicht?">${esc(cur)}</textarea>
      <div class="item-foot">
        <span class="wc" data-wc="${i}"></span>
        <span class="flag" data-flag="${i}" hidden>⚑ Rechtsbezug — bitte Fundstelle prüfen</span>
      </div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('textarea[data-edit]').forEach(ta => {
    const i = Number(ta.dataset.edit);
    updateFoot(i, ta.value);
    ta.addEventListener('input', () => {
      const e = shown[i];
      const val = ta.value.trim();
      e.node.details.openness.explanation = val;
      if (val && val !== e.expl) touched.add(e.node.id); else touched.delete(e.node.id);
      updateFoot(i, ta.value);
      updateProgress();
    });
  });
}

function updateFoot(i, value) {
  const w = words(value);
  const wc = listEl.querySelector(`[data-wc="${i}"]`);
  if (wc) {
    wc.textContent = `${w} ${w === 1 ? 'Wort' : 'Wörter'}`;
    wc.classList.toggle('good', w >= MIN_WORDS);
  }
  const flag = listEl.querySelector(`[data-flag="${i}"]`);
  if (flag) flag.hidden = !CLAIM_RE.test(value);
}

function updateProgress() {
  const short = entries.filter(e => words(currentExpl(e)) < MIN_WORDS).length;
  const reused = entries.filter(e => e.reused && currentExpl(e) === e.expl).length;
  el('p-done').textContent = touched.size.toLocaleString('de-DE');
  el('p-short').textContent = short.toLocaleString('de-DE');
  el('p-reused').textContent = reused.toLocaleString('de-DE');
  const openCount = entries.filter(e => words(currentExpl(e)) < MIN_WORDS || (e.reused && currentExpl(e) === e.expl)).length;
  const total = entries.length || 1;
  el('p-fill').style.width = `${((total - openCount) / total * 100).toFixed(1)}%`;
}

// ── Prompt ──────────────────────────────────────────────────────────────────
genBtn.addEventListener('click', () => {
  if (!shown.length) { promptOut.value = 'Keine Einträge in der Auswahl.'; return; }
  const items = shown.map(e => {
    const d = e.node.details ?? {};
    return {
      id: e.node.id,
      name: e.node.name,
      pfad: `${currentSector.name} › ${e.org} › ${e.act}`,
      beschreibung: d.description ?? '',
      oeffnungsklasse: `${d.openness?.class ?? ''} — ${d.openness?.label ?? ''}`,
      objekttyp: label('object', d.object?.code),
      granularitaet: label('granularity', d.granularity?.code),
      lizenz: label('license', d.license?.code),
      bisherige_begruendung: currentExpl(e),
    };
  });

  promptOut.value = `Du überarbeitest Begründungstexte für den Datenatlas (datenatlas.de).

Jeder Datentyp trägt eine Öffnungsklasse. Die Begründung erklärt, WARUM dieser
Datentyp so eingestuft ist — also welcher Mechanismus die Veröffentlichung
ermöglicht oder verhindert.

REGELN — bitte strikt einhalten:
1. Stütze dich AUSSCHLIESSLICH auf die unten gelieferten Angaben (Beschreibung,
   Öffnungsklasse, Objekttyp, Granularität, Lizenz).
2. Erfinde KEINE Paragrafen, Gesetzesfundstellen, Aktenzeichen oder Fristen.
   Nenne eine Rechtsgrundlage nur, wenn sie sich zwingend aus den Angaben ergibt.
3. Behaupte NICHT, dass bestimmte Behörden, Städte oder Organisationen etwas
   bereits veröffentlichen — das ist ohne Recherche nicht belegbar.
4. Benenne stattdessen den sachlichen Grund: Personenbezug vorhanden oder
   aufgelöst? Aggregiert oder Einzelfall? Veröffentlichungspflicht oder
   Ermessen? Welcher Aufbereitungsschritt wäre nötig?
5. 15 bis 40 Wörter, ein bis zwei Sätze, sachlicher Ton, deutsche Sprache.
6. Wenn die Angaben für eine tragfähige Begründung nicht ausreichen, gib die
   bisherige Begründung unverändert zurück, statt zu spekulieren.

AUSGABEFORMAT — ausschließlich dieses JSON-Array, ohne weiteren Text:
[{"id":"<id>","explanation":"<neue Begründung>"}]

ZU ÜBERARBEITENDE EINTRÄGE:
${JSON.stringify(items, null, 1)}`;
  copyBtn.disabled = false;
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(promptOut.value).then(() => {
    copyBtn.textContent = '✓ Kopiert';
    setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 1600);
  }).catch(() => {
    promptOut.focus(); promptOut.select();
    copyBtn.textContent = 'Bitte manuell kopieren';
    setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 2400);
  });
});

// ── Antwort übernehmen (nur in die Felder) ──────────────────────────────────
applyBtn.addEventListener('click', () => {
  applyStatus.classList.remove('err');
  let parsed;
  try {
    const raw = pasteArea.value.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    parsed = JSON.parse(raw);
  } catch (err) {
    applyStatus.textContent = `Kein gültiges JSON: ${err.message}`;
    applyStatus.classList.add('err');
    return;
  }
  if (!Array.isArray(parsed)) {
    applyStatus.textContent = 'Erwartet wird ein JSON-Array.';
    applyStatus.classList.add('err');
    return;
  }

  const byId = new Map(shown.map((e, i) => [e.node.id, i]));
  let applied = 0, unknown = 0, flagged = 0, tooShort = 0;
  for (const item of parsed) {
    const i = byId.get(item?.id);
    if (i === undefined) { unknown++; continue; }
    const val = String(item.explanation ?? '').trim();
    if (!val) continue;
    if (words(val) < MIN_WORDS) tooShort++;
    if (CLAIM_RE.test(val)) flagged++;
    const ta = listEl.querySelector(`textarea[data-edit="${i}"]`);
    if (ta) { ta.value = val; ta.dispatchEvent(new Event('input')); applied++; }
  }

  const parts = [`${applied} übernommen`];
  if (unknown)  parts.push(`${unknown} unbekannte id`);
  if (tooShort) parts.push(`${tooShort} unter ${MIN_WORDS} Wörtern`);
  if (flagged)  parts.push(`${flagged} mit Rechtsbezug — prüfen`);
  applyStatus.textContent = parts.join(' · ');
});

// ── Download ────────────────────────────────────────────────────────────────
dlBtn.addEventListener('click', () => {
  if (!sectorData || !currentSector) return;
  const blob = new Blob([JSON.stringify(sectorData, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = currentSector.file;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

window.addEventListener('beforeunload', (e) => {
  if (touched.size) { e.preventDefault(); e.returnValue = ''; }
});
