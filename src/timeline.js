import { esc, trapFocus } from './utils.js';

let _index     = null;
let _mainTiles = null;

const FREQ_META = {
  FQ_01: { label: 'Echtzeit',      color: '#2563eb', short: 'RT'   },
  FQ_02: { label: 'Täglich',       color: '#0891b2', short: 'Tag'  },
  FQ_03: { label: 'Monatlich',     color: '#059669', short: 'Mon'  },
  FQ_04: { label: 'Jährlich',      color: '#7c3aed', short: 'Jahr' },
  FQ_05: { label: 'Unregelmäßig',  color: '#9ca3af', short: 'Unr'  },
};

export function initTimeline({ indexPromise, mainTiles }) {
  _mainTiles = mainTiles;

  const modal    = document.getElementById('timeline-modal');
  const closeBtn = document.getElementById('tl-close');
  const tlBtn    = document.getElementById('timeline-btn');

  indexPromise.then(idx => { _index = idx; if (!modal.hidden) render(); });

  let _trapCleanup = null;

  tlBtn.addEventListener('click', () => {
    if (!modal.hidden) return;
    render();
    modal.hidden = false;
    tlBtn.classList.add('active');
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
    tlBtn.classList.remove('active');
    tlBtn.focus();
  }
}

// ── Data computation ────────────────────────────────────────────────────────

function computeData() {
  const freqTotals = { FQ_01: 0, FQ_02: 0, FQ_03: 0, FQ_04: 0, FQ_05: 0 };
  const sectorMap  = new Map();   // sectorId → { name, color, freqs, years[] }
  const allYears   = [];

  for (const t of _mainTiles) {
    sectorMap.set(t.id, {
      id: t.id, name: t.name, color: t.color,
      freqs: { FQ_01: 0, FQ_02: 0, FQ_03: 0, FQ_04: 0, FQ_05: 0 },
      years: [],
    });
  }

  for (const entry of _index) {
    const sectorId = entry.breadcrumb[1]?.id;
    const s = sectorMap.get(sectorId);
    if (!s) continue;

    const temporal = entry.tile.details?.temporal;
    const fq = temporal?.update_frequency ?? 'FQ_05';
    const yr = temporal?.available_from   ?? null;

    freqTotals[fq] = (freqTotals[fq] ?? 0) + 1;
    s.freqs[fq]    = (s.freqs[fq]    ?? 0) + 1;

    if (yr) { s.years.push(yr); allYears.push(yr); }
  }

  return { freqTotals, sectors: [...sectorMap.values()], allYears };
}

// ── Chart helpers ───────────────────────────────────────────────────────────

const YEAR_START = 1980;
const YEAR_END   = 2024;

function buildCumulativePoints(allYears) {
  const counts = new Array(YEAR_END - YEAR_START + 1).fill(0);
  for (const y of allYears) {
    const idx = Math.max(0, Math.min(counts.length - 1, y - YEAR_START));
    counts[idx]++;
  }
  // cumulative sum
  const cumul = [];
  let running = 0;
  for (let i = 0; i < counts.length; i++) {
    running += counts[i];
    cumul.push(running);
  }
  return cumul;  // index 0 = year YEAR_START
}

function svgChart(allYears) {
  const W = 660, H = 172, PAD_L = 40, PAD_B = 36, PAD_R = 12, PAD_T = 10;
  const cw = W - PAD_L - PAD_R;
  const ch = H - PAD_B - PAD_T;

  const cumul   = buildCumulativePoints(allYears);
  const maxVal  = cumul[cumul.length - 1] || 1;
  const years   = YEAR_END - YEAR_START;  // number of intervals

  // SVG coordinate helpers
  const px = i => PAD_L + (i / years) * cw;
  const py = v => PAD_T + ch - (v / maxVal) * ch;

  // Area path
  const pts = cumul.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const bottomY  = py(0).toFixed(1);
  const areaPath = `M${px(0)},${py(cumul[0])} L${pts} L${px(years)},${bottomY} L${px(0)},${bottomY} Z`;
  const linePath = `M${px(0)},${py(cumul[0])} L${pts}`;

  // Y-axis ticks
  const yTicks = [0, Math.round(maxVal / 4), Math.round(maxVal / 2), Math.round(maxVal * 3/4), maxVal];
  const yLines = yTicks.map(v =>
    `<line x1="${PAD_L}" x2="${W - PAD_R}" y1="${py(v).toFixed(1)}" y2="${py(v).toFixed(1)}"
       stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
     <text x="${PAD_L - 6}" y="${(py(v) + 4).toFixed(1)}"
       font-size="9" text-anchor="end" fill="currentColor" opacity="0.45">
       ${v > 999 ? (v/1000).toFixed(1)+'k' : v}
     </text>`
  ).join('');

  // X-axis labels every 5 years
  const xLabels = [];
  for (let y = YEAR_START; y <= YEAR_END; y += 5) {
    const i = y - YEAR_START;
    xLabels.push(
      `<text x="${px(i).toFixed(1)}" y="${H - 4}"
         font-size="9" text-anchor="middle" fill="currentColor" opacity="0.5">${y}</text>`
    );
  }

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="tl-chart">
  <defs>
    <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.03"/>
    </linearGradient>
  </defs>
  ${yLines}
  ${xLabels.join('')}
  <path d="${areaPath}" fill="url(#tl-grad)"/>
  <path d="${linePath}" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="${px(years)}" cy="${py(maxVal)}" r="3.5" fill="#7c3aed"/>
  <text x="${(px(years) - 4).toFixed(1)}" y="${(py(maxVal) - 6).toFixed(1)}"
    font-size="9" text-anchor="end" fill="#7c3aed" font-weight="600">
    ${maxVal.toLocaleString('de-DE')}
  </text>
</svg>`;
}

// ── Frequency bar (like openness bar in stats) ──────────────────────────────

function freqBar(freqs, total, height = 12) {
  if (!total) return '';
  const segs = Object.entries(FREQ_META).map(([code, m]) => {
    const n = freqs[code] ?? 0;
    const w = Math.round(n / total * 100);
    return w ? `<div class="tl-seg" style="width:${w}%;background:${m.color}" title="${m.label}: ${n} (${w}%)"></div>` : '';
  }).join('');
  const r = height / 2;
  return `<div class="tl-bar" style="height:${height}px;border-radius:${r}px">${segs}</div>`;
}

// ── Render ──────────────────────────────────────────────────────────────────

function render() {
  const body = document.getElementById('tl-body');

  if (!_index) {
    body.innerHTML = `<div class="tl-loading"><div class="spinner"></div><p>Daten werden geladen…</p></div>`;
    return;
  }

  const { freqTotals, sectors, allYears } = computeData();
  // Denominator for all frequency percentages: every counted entry has a
  // frequency (year-less entries fall back to FQ_05), so this is the true base
  // and keeps every percentage ≤ 100 %. Year-based stats use `yearsAvail`.
  const total      = Object.values(freqTotals).reduce((a, b) => a + b, 0);
  const yearsAvail = allYears.length;

  if (!total) {
    body.innerHTML = `<div class="tl-loading"><p>Keine Zeitdaten verfügbar.</p></div>`;
    return;
  }

  // Summary cards: total, most common frequency, earliest, latest
  const topFreq   = Object.entries(freqTotals).sort((a, b) => b[1] - a[1])[0];
  const topMeta   = FREQ_META[topFreq[0]];
  const earliest  = yearsAvail ? Math.min(...allYears) : null;
  const newestPct = yearsAvail ? Math.round(allYears.filter(y => y >= 2015).length / yearsAvail * 100) : 0;

  const summaryCards = `
    <div class="tl-summary">
      <div class="tl-sum-card">
        <div class="tl-sum-num">${total.toLocaleString('de-DE')}</div>
        <div class="tl-sum-label">Datentypen gesamt</div>
      </div>
      <div class="tl-sum-card" style="border-color:${topMeta.color}33;background:${topMeta.color}0f">
        <div class="tl-sum-num" style="color:${topMeta.color}">${topFreq[1].toLocaleString('de-DE')}</div>
        <div class="tl-sum-pct">${Math.round(topFreq[1]/total*100)} %</div>
        <div class="tl-sum-label">${topMeta.label}</div>
      </div>
      <div class="tl-sum-card">
        <div class="tl-sum-num">${earliest ? 'ab ' + earliest : '—'}</div>
        <div class="tl-sum-label">Früheste Verfügbarkeit</div>
      </div>
      <div class="tl-sum-card">
        <div class="tl-sum-num">${newestPct} %</div>
        <div class="tl-sum-label">Verfügbar seit 2015+</div>
      </div>
    </div>`;

  // Frequency breakdown pills
  const freqPills = Object.entries(FREQ_META).map(([code, m]) => {
    const n = freqTotals[code] ?? 0;
    return `<div class="tl-freq-pill">
      <span class="tl-freq-dot" style="background:${m.color}"></span>
      <span class="tl-freq-name">${m.label}</span>
      <span class="tl-freq-n">${n.toLocaleString('de-DE')}</span>
      <span class="tl-freq-pct">${Math.round(n/total*100)} %</span>
    </div>`;
  }).join('');

  // Sector rows
  const sectorRows = sectors.map(s => {
    const st = Object.values(s.freqs).reduce((a, b) => a + b, 0);
    const topF = Object.entries(s.freqs).sort((a, b) => b[1] - a[1])[0];
    const topFMeta = FREQ_META[topF[0]];
    return `
      <div class="tl-sector-row">
        <div class="tl-sector-head">
          <span class="tl-sector-dot" style="background:${s.color}"></span>
          <span class="tl-sector-name">${esc(s.name)}</span>
          <span class="tl-sector-total">${st}</span>
        </div>
        ${freqBar(s.freqs, st, 8)}
        <div class="tl-sector-top">
          <span class="tl-freq-dot" style="background:${topFMeta.color}"></span>
          ${topFMeta.label} (${st ? Math.round(topF[1]/st*100) : 0} %)
        </div>
      </div>`;
  }).join('');

  body.innerHTML = `
    ${summaryCards}
    ${freqBar(freqTotals, total, 16)}
    <div class="tl-freq-legend">${freqPills}</div>

    <div class="tl-section-title">Kumulative Datenverfügbarkeit</div>
    ${svgChart(allYears)}
    <p class="tl-chart-caption">Schätzung: Wie viele Datentypen waren ab welchem Jahr verfügbar?${yearsAvail < total ? ` (basiert auf ${yearsAvail.toLocaleString('de-DE')} von ${total.toLocaleString('de-DE')} Datentypen mit Zeitangabe)` : ''}</p>

    <div class="tl-section-title">Aktualisierungshäufigkeit nach Sektor</div>
    <div class="tl-sectors">${sectorRows}</div>
  `;
}
