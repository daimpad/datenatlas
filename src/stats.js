import { esc, trapFocus } from './utils.js';

let _index     = null;
let _mainTiles = null;

export function initStats({ indexPromise, mainTiles }) {
  _mainTiles = mainTiles;

  const modal    = document.getElementById('stats-modal');
  const closeBtn = document.getElementById('st-close');
  const statsBtn = document.getElementById('stats-btn');

  indexPromise.then(idx => { _index = idx; });

  let _trapCleanup = null;

  statsBtn.addEventListener('click', () => {
    if (!modal.hidden) return;
    render();
    modal.hidden = false;
    statsBtn.classList.add('active');
    _trapCleanup = trapFocus(modal);
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  function close() {
    _trapCleanup?.(); _trapCleanup = null;
    modal.hidden = true;
    statsBtn.classList.remove('active');
    statsBtn.focus();
  }
}

function computeStats() {
  const sectors = new Map();
  for (const t of _mainTiles) {
    sectors.set(t.id, { id: t.id, name: t.name, color: t.color, op01: 0, op02: 0, op03: 0, total: 0 });
  }
  for (const entry of _index) {
    const sectorId = entry.breadcrumb[1]?.id;
    const s = sectors.get(sectorId);
    if (!s) continue;
    const cls = entry.tile.details?.openness?.class;
    s.total++;
    if (cls === 'OP_01') s.op01++;
    else if (cls === 'OP_02') s.op02++;
    else s.op03++;
  }
  return [...sectors.values()];
}

function pct(n, total) {
  return total ? Math.round(n / total * 100) : 0;
}

function bar(op01, op02, op03, total, height = 12) {
  if (!total) return '';
  const w01 = pct(op01, total);
  const w02 = pct(op02, total);
  const w03 = 100 - w01 - w02;
  const r   = height / 2;
  const style = `height:${height}px;border-radius:${r}px`;
  return `<div class="st-bar" style="${style}">
    ${op01 ? `<div class="st-seg st-seg--green"  style="width:${w01}%" title="${op01} (${w01}%)"></div>` : ''}
    ${op02 ? `<div class="st-seg st-seg--yellow" style="width:${w02}%" title="${op02} (${w02}%)"></div>` : ''}
    ${op03 ? `<div class="st-seg st-seg--red"    style="width:${w03}%" title="${op03} (${w03}%)"></div>` : ''}
  </div>`;
}

function render() {
  const body = document.getElementById('st-body');

  if (!_index) {
    body.innerHTML = `<div class="st-loading"><div class="spinner"></div><p>Daten werden geladen…</p></div>`;
    return;
  }

  const stats  = computeStats();
  const total  = stats.reduce((s, x) => s + x.total, 0);
  const totOp01 = stats.reduce((s, x) => s + x.op01, 0);
  const totOp02 = stats.reduce((s, x) => s + x.op02, 0);
  const totOp03 = stats.reduce((s, x) => s + x.op03, 0);

  body.innerHTML = `
    <div class="st-summary">
      <div class="st-sum-card">
        <div class="st-sum-num">${total.toLocaleString('de-DE')}</div>
        <div class="st-sum-label">Datentypen gesamt</div>
      </div>
      <div class="st-sum-card st-sum-card--green">
        <div class="st-sum-num">${totOp01}</div>
        <div class="st-sum-pct">${pct(totOp01, total)} %</div>
        <div class="st-sum-label">Sofort publizierbar</div>
      </div>
      <div class="st-sum-card st-sum-card--yellow">
        <div class="st-sum-num">${totOp02}</div>
        <div class="st-sum-pct">${pct(totOp02, total)} %</div>
        <div class="st-sum-label">Nach Aufbereitung</div>
      </div>
      <div class="st-sum-card st-sum-card--red">
        <div class="st-sum-num">${totOp03}</div>
        <div class="st-sum-pct">${pct(totOp03, total)} %</div>
        <div class="st-sum-label">Nur Metadaten</div>
      </div>
    </div>

    ${bar(totOp01, totOp02, totOp03, total, 18)}

    <div class="st-heading">Nach Sektor</div>

    <div class="st-sectors">
      ${stats.map(s => `
        <div class="st-sector-card">
          <div class="st-sector-head">
            <span class="st-sector-dot" style="background:${s.color}"></span>
            <span class="st-sector-name">${esc(s.name)}</span>
            <span class="st-sector-total">${s.total}</span>
          </div>
          ${bar(s.op01, s.op02, s.op03, s.total, 10)}
          <div class="st-legend">
            <span class="st-leg-item"><span class="st-leg-dot st-leg-dot--green"></span>${s.op01} · ${pct(s.op01, s.total)} %</span>
            <span class="st-leg-item"><span class="st-leg-dot st-leg-dot--yellow"></span>${s.op02} · ${pct(s.op02, s.total)} %</span>
            <span class="st-leg-item"><span class="st-leg-dot st-leg-dot--red"></span>${s.op03} · ${pct(s.op03, s.total)} %</span>
          </div>
        </div>`).join('')}
    </div>
  `;
}
