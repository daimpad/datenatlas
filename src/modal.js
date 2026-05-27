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

export function openSidebar(tile) {
  body.innerHTML = buildContent(tile);
  sidebar.dataset.open = 'true';
}

export function closeSidebar() {
  sidebar.dataset.open = 'false';
}

// ── Content builders ──────────────────────────────────────────────────────────

const LEVEL_LABELS = ['', 'Sektor', 'Organisation', 'Aktivität', 'Datentyp'];
const BADGE_CLASS  = ['', 'l1',     'l2',           'l3',        'l4'];

function buildContent(tile) {
  const lvl = tile.level ?? 1;
  const badgeCls = BADGE_CLASS[lvl] ?? 'l1';
  const lvlLabel = LEVEL_LABELS[lvl] ?? 'Ebene';

  // Color swatch strip at top
  const strip = `<div style="height:4px;border-radius:4px 4px 0 0;background:${tile.color};margin:-22px -20px 18px;"></div>`;

  const badge = `<span class="sb-badge ${badgeCls}">◈ ${lvlLabel}</span>`;
  const title = `<h2 class="sb-title">${esc(tile.name)}</h2>`;
  const desc  = tile.description
    ? `<p class="sb-desc">${esc(tile.description)}</p>`
    : '';
  const header = `<div class="sb-header">${badge}${title}${desc}</div>`;

  // Level 4 → full detail
  if (lvl === 4 && tile.details) {
    return strip + header + buildLevel4(tile.details);
  }

  // Levels 1-3 → summary + hint
  const childCount = tile.children?.length ?? 0;
  const childLabel = { 1:'Organisationen', 2:'Aktivitäten', 3:'Datentypen' }[lvl] ?? 'Einträge';
  const meta = childCount
    ? `<div class="sb-meta"><span class="sb-meta-item"><strong>${childCount}</strong> ${childLabel}</span></div>`
    : '';

  const hint = lvl < 4
    ? `<div class="sb-hint">↗ Auf die Kachel klicken, um tiefer zu navigieren.</div>`
    : '';

  return strip + header + meta + hint;
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
