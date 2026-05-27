// Builds and controls the sidebar panel

const sidebar  = document.getElementById('sidebar');
const body     = document.getElementById('sidebar-body');
const closeBtn = document.getElementById('sidebar-close');

closeBtn.addEventListener('click', closeSidebar);

// Click outside closes
document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) &&
      !e.target.closest('#map-canvas'))
    closeSidebar();
});

let _onExplore = null;

export function openSidebar(tile, { onExplore } = {}) {
  _onExplore = onExplore ?? null;
  body.innerHTML = buildContent(tile, !!_onExplore);
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

const LEVEL_LABELS = ['', 'Sektor', 'Organisation', 'Aktivität', 'Datentyp'];
const BADGE_CLASS  = ['', 'l1',     'l2',           'l3',        'l4'];

function buildContent(tile, hasExplore = false) {
  const lvl      = tile.level ?? 1;
  const badgeCls = BADGE_CLASS[lvl] ?? 'l1';
  const lvlLabel = LEVEL_LABELS[lvl] ?? 'Ebene';

  // Color swatch strip at top
  const strip = `<div style="height:4px;border-radius:4px 4px 0 0;background:${tile.color};margin:-22px -20px 18px;"></div>`;

  const badge  = `<span class="sb-badge ${badgeCls}">◈ ${lvlLabel}</span>`;
  const title  = `<h2 class="sb-title">${esc(tile.name)}</h2>`;
  const desc   = tile.description
    ? `<p class="sb-desc">${esc(tile.description)}</p>`
    : '';
  const header = `<div class="sb-header">${badge}${title}${desc}</div>`;

  // Level 4 → full detail (no explore button)
  if (lvl === 4 && tile.details) {
    return strip + header + buildLevel4(tile.details);
  }

  // Levels 1-3 → summary card + children count + explore button
  const childCount = tile.children?.length ?? 0;
  const childLabel = { 1:'Organisationen', 2:'Aktivitäten', 3:'Datentypen' }[lvl] ?? 'Einträge';
  const meta = childCount
    ? `<div class="sb-meta">
        <span class="sb-meta-item"><strong>${childCount}</strong> ${childLabel}</span>
       </div>`
    : '';

  const exploreBtn = hasExplore
    ? `<button id="sb-explore-btn" class="sb-explore-btn">
        Erkunden <span class="sb-explore-arrow">→</span>
       </button>`
    : `<div class="sb-hint">Keine weiteren Inhalte verfügbar.</div>`;

  return strip + header + meta + exploreBtn;
}

function buildLevel4(d) {
  const parts = [];

  // Description
  parts.push(section('📋 Beschreibung', `<p>${esc(d.description)}</p>`));

  // Open data potential
  if (d.openDataPotential) {
    const od = d.openDataPotential;
    const score = od.scoreValue ?? 0;          // 0–3
    const dots  = [0,1,2,3].map(i =>
      `<span class="od-dot${i < score ? ' on' : ''}"></span>`
    ).join('');
    const inner = `
      <div class="od-row">
        <div class="od-dots">${dots}</div>
        <span class="od-score-label">${esc(od.score)}</span>
      </div>
      <p>${esc(od.explanation)}</p>`;
    parts.push(section('🔓 Open-Data-Potenzial', inner));
  }

  // DSGVO risk
  if (d.dsgvoRisk) {
    const dr = d.dsgvoRisk;
    const pill = `<span class="risk-pill ${dr.riskClass ?? 'risk-medium'}">⚠ ${esc(dr.level)}</span>`;
    const articles = (dr.articles ?? []).map(a =>
      `<span class="law-pill">${esc(a)}</span>`).join('');
    const inner = `
      ${pill}
      <p>${esc(dr.explanation)}</p>
      ${articles ? `<div class="law-pills">${articles}</div>` : ''}`;
    parts.push(section('🔒 DSGVO-Risikoanalyse', inner));
  }

  // Anonymization
  if (d.anonymization?.length) {
    const items = d.anonymization.map(m => `
      <div class="anon-item">
        <span class="anon-tag">${esc(m.method)}</span>
        <span class="anon-text">${esc(m.description)}</span>
      </div>`).join('');
    parts.push(section('🧪 Anonymisierungs&shy;empfehlung',
      `<div class="anon-list">${items}</div>`));
  }

  return parts.join('');
}

function section(title, inner) {
  return `<div class="sb-section">
    <div class="sb-section-title">${title}</div>
    ${inner}
  </div>`;
}

function esc(str = '') {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
