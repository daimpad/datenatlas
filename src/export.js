import { state } from './state.js';

import { LABELS } from './vokabular.js';

// Der Export beschriftete früher über eigene Kopien dieser Tabellen. Solange
// die Daten Labels trugen, die ihrem Code widersprachen, sagte die CSV etwas
// anderes als die Sidebar zum selben Knoten. Beide lesen jetzt LABELS.
const THEME = LABELS, OBJECT = LABELS, GRANULARITY = LABELS,
      LICENSE = LABELS, FORMAT = LABELS, OPENNESS = LABELS;

const HEADERS = ['Name','Sektor','Organisation','Aktivität','Öffnungsklasse','Thema','Objekttyp','Granularität','Format','Lizenz','Relevanz','Beschreibung'];

export function initExport({ ensureFullIndex }) {
  let _busy = false;

  document.getElementById('export-btn').addEventListener('click', async () => {
    const crumbs = state.breadcrumb;
    const level  = crumbs[crumbs.length - 1]?.level ?? 0;

    // Viewing a single activity's data types — already fully loaded in state.
    if (level === 4) {
      exportCurrentView(crumbs);
      return;
    }

    // Exporting everything needs the full per-node index — load it on demand.
    if (_busy) return;
    _busy = true;
    showToast('Daten werden vorbereitet…');
    try {
      const idx = await ensureFullIndex();
      exportFullIndex(idx);
    } catch {
      showToast('Export fehlgeschlagen.');
    } finally {
      _busy = false;
    }
  });
}

function exportCurrentView(crumbs) {
  const sektor  = crumbs.find(c => c.level === 2)?.name ?? '';
  const org     = crumbs.find(c => c.level === 3)?.name ?? '';
  const activity = crumbs.find(c => c.level === 4)?.name ?? '';

  const rows = state.currentTiles
    .filter(t => t.level === 4 && t.details)
    .map(t => tileRow(t, sektor, org, activity));

  const slug = slugify(sektor || 'export');
  download(csvString(rows), `datenatlas-${slug}.csv`);
}

function exportFullIndex(index) {
  const rows = index
    .filter(e => e.tile.details)
    .map(e => {
      const [sektor, org, activity] = e.displayPath.split(' · ');
      return tileRow(e.tile, sektor, org, activity);
    });
  download(csvString(rows), 'datenatlas-alle-datentypen.csv');
}

function tileRow(tile, sektor, org, activity) {
  const d = tile.details ?? {};
  return [
    tile.name,
    sektor,
    org,
    activity,
    OPENNESS[d.openness?.class] ?? d.openness?.class ?? '',
    THEME[d.theme?.code]       ?? d.theme?.code       ?? '',
    OBJECT[d.object?.code]     ?? d.object?.code      ?? '',
    GRANULARITY[d.granularity?.code] ?? d.granularity?.code ?? '',
    (d.format ?? []).map(f => FORMAT[f.code] ?? f.code).join('; '),
    LICENSE[d.license?.code]   ?? d.license?.code     ?? '',
    d.relevance ?? '',
    d.description ?? '',
  ];
}

function csvString(rows) {
  const lines = [HEADERS, ...rows].map(r =>
    r.map(f => {
      const s = String(f ?? '');
      return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')
  );
  return '﻿' + lines.join('\r\n'); // BOM for Excel UTF-8
}

function download(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

function slugify(s) {
  return s.toLowerCase().replace(/[äöü]/g, c => ({ ä:'ae', ö:'oe', ü:'ue' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function showToast(msg) {
  const t = document.getElementById('share-toast');
  if (!t) return;
  const prev = t.textContent;
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; t.textContent = prev; }, 2000);
}
