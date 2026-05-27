import { esc, safeColor } from './utils.js';

const sidebar  = document.getElementById('sidebar');
const body     = document.getElementById('sidebar-body');
const closeBtn = document.getElementById('sidebar-close');

closeBtn.addEventListener('click', closeSidebar);

document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !e.target.closest('#map-canvas'))
    closeSidebar();
});

let _onExplore = null;

export function openSidebar(tile, { onExplore, exploreLabel = 'Erkunden' } = {}) {
  _onExplore = onExplore ?? null;
  body.innerHTML = buildContent(tile, !!_onExplore, exploreLabel);
  sidebar.dataset.open = 'true';

  const btn = document.getElementById('sb-explore-btn');
  if (btn && _onExplore) {
    btn.addEventListener('click', () => {
      const cb = _onExplore;
      _onExplore = null;
      cb();
    }, { once: true });
  }
}

export function closeSidebar() {
  sidebar.dataset.open = 'false';
}

// ── Content builders ──────────────────────────────────────────────────────────

const LEVEL_LABELS = ['', 'Sektor', 'Organisation', 'Aktivität', 'Datentyp', 'Prozess', 'Datentyp'];
const BADGE_CLASS  = ['', 'l1',     'l2',           'l3',        'l4',       'l5',      'l6'];

function buildContent(tile, hasExplore = false, exploreLabel = 'Erkunden') {
  const lvl      = tile.level ?? 1;
  const badgeCls = BADGE_CLASS[lvl] ?? 'l4';
  const lvlLabel = LEVEL_LABELS[lvl] ?? 'Ebene';

  const strip  = `<div style="height:4px;border-radius:4px 4px 0 0;background:${safeColor(tile.color)};margin:-22px -20px 18px;"></div>`;
  const badge  = `<span class="sb-badge ${badgeCls}">◈ ${lvlLabel}</span>`;
  const title  = `<h2 class="sb-title">${esc(tile.name)}</h2>`;
  const desc   = tile.description ? `<p class="sb-desc">${esc(tile.description)}</p>` : '';
  const header = `<div class="sb-header">${badge}${title}${desc}</div>`;

  const exploreBtn = hasExplore
    ? `<button id="sb-explore-btn" class="sb-explore-btn">
         ${esc(exploreLabel)} <span class="sb-explore-arrow">→</span>
       </button>`
    : '';

  // ── Level 5 — Prozess ──
  if (lvl === 5) {
    const count = tile._relatedCount;
    const meta  = count != null
      ? `<div class="sb-meta"><span class="sb-meta-item">
           Sektorübergreifend <strong>${count}</strong> Datentypen
         </span></div>`
      : '';
    return strip + header + meta + exploreBtn;
  }

  // ── Level 4 or 6 — vollständiger Datentyp ──
  if ((lvl === 4 || lvl === 6) && tile.details) {
    return strip + header + exploreBtn + buildDetailSections(tile.details);
  }

  // ── Level 1–3 — Zusammenfassung ──
  const childCount = tile.children?.length ?? 0;
  const childLabel = { 1:'Organisationen', 2:'Aktivitäten', 3:'Datentypen' }[lvl] ?? 'Einträge';
  const meta = childCount
    ? `<div class="sb-meta">
         <span class="sb-meta-item"><strong>${childCount}</strong> ${childLabel}</span>
       </div>`
    : '';
  const fallback = !hasExplore
    ? `<div class="sb-hint">Keine weiteren Inhalte verfügbar.</div>`
    : '';

  return strip + header + meta + exploreBtn + fallback;
}

function buildDetailSections(d) {
  const parts = [];

  parts.push(section('&#x1F4CB; Beschreibung', `<p>${esc(d.description)}</p>`));

  if (d.openness) {
    const op = d.openness;
    const opClass = op.class === 'OP_01' ? 'op-gruen' : op.class === 'OP_02' ? 'op-gelb' : 'op-rot';
    const opIcon  = op.class === 'OP_01' ? '●' : op.class === 'OP_02' ? '◑' : '○';
    parts.push(section('&#x1F513; Öffnungsklasse', `
      <div class="openness-pill ${opClass}">${opIcon} ${esc(op.label)}</div>
      <p>${esc(op.explanation)}</p>`));
  }

  const metaItems = [];
  if (d.theme)       metaItems.push({ label: d.theme.label,       icon: '🏷' });
  if (d.object)      metaItems.push({ label: d.object.label,      icon: '📦' });
  if (d.granularity) metaItems.push({ label: d.granularity.label, icon: '🔍' });
  if (d.format?.length) {
    d.format.forEach(f => metaItems.push({ label: f.label, icon: '📄' }));
  }
  if (d.license)     metaItems.push({ label: d.license.label,     icon: '⚖' });
  if (metaItems.length) {
    const chips = metaItems.map(m =>
      `<span class="meta-chip">${m.label}</span>`
    ).join('');
    parts.push(section('&#x1F4CB; Metadaten', `<div class="meta-chips">${chips}</div>`));
  }

  if (d.relevance != null) {
    const dots = [1,2,3,4,5].map(i =>
      `<span class="rel-dot${i <= d.relevance ? ' on' : ''}"></span>`
    ).join('');
    parts.push(section('&#x2B50; Relevanz', `
      <div class="rel-row">
        <div class="rel-dots">${dots}</div>
        <span class="rel-label">${d.relevance} / 5</span>
      </div>`));
  }

  if (d.processes?.length) {
    const items = d.processes.map(p => `
      <div class="anon-item">
        <span class="anon-tag">${esc(p.method)}</span>
        <span class="anon-text">${esc(p.description)}</span>
      </div>`).join('');
    parts.push(section('&#x2699; Prozessbezug', `<div class="anon-list">${items}</div>`));
  }

  return parts.join('');
}

function section(title, inner) {
  return `<div class="sb-section">
    <div class="sb-section-title">${title}</div>
    ${inner}
  </div>`;
}

