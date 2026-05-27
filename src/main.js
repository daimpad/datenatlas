import { IsometricRenderer } from './renderer.js';
import { initControls }      from './controls.js';
import { openSidebar, closeSidebar } from './modal.js';
import { loadMain, loadSector }      from './dataLoader.js';
import { state, patchState }         from './state.js';
import { applyOpennessColors, esc }   from './utils.js';
import { buildSearchIndex, initSearch } from './search.js';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('map-canvas');
const loadingVeil   = document.getElementById('loading-veil');
const errorState    = document.getElementById('error-state');
const errorMessage  = document.getElementById('error-message');
const errorRetry    = document.getElementById('error-retry');
const btnBack       = document.getElementById('btn-back');
const btnHome       = document.getElementById('btn-home');
const breadcrumbEl  = document.getElementById('breadcrumb');
const levelNumEl    = document.getElementById('level-number');
const levelMaxEl    = document.getElementById('level-max');
const tooltip       = document.getElementById('tooltip');
const filterBar     = document.getElementById('filter-bar');
const filterToggle  = document.getElementById('filter-toggle');
const filterCount   = document.getElementById('filter-count');
const onboarding    = document.getElementById('onboarding');

// ── Init ──────────────────────────────────────────────────────────────────────
const renderer = new IsometricRenderer(canvas);

initControls({ canvas, renderer, onTileClick: handleTileClick, onHover: handleHover });

btnBack.addEventListener('click', navigateBack);
btnHome.addEventListener('click', navigateHome);

let _retryFn = null;
errorRetry.addEventListener('click', () => { hideError(); _retryFn?.(); });

// ── Onboarding ────────────────────────────────────────────────────────────────
const OB_KEY = 'datenatlas_onboarded_v1';
onboarding.hidden = !!localStorage.getItem(OB_KEY);
document.getElementById('ob-start').addEventListener('click', () => {
  localStorage.setItem(OB_KEY, '1');
  onboarding.hidden = true;
});

// ── Filter ────────────────────────────────────────────────────────────────────
const filterState = { openness: null };
let filterOpen    = false;

filterToggle.addEventListener('click', () => {
  filterOpen = !filterOpen;
  filterToggle.classList.toggle('active', filterOpen);
  syncFilterBar();
});

document.getElementById('fc-openness').addEventListener('click', e => {
  const btn = e.target.closest('.fc');
  if (!btn) return;
  filterState.openness = btn.dataset.op || null;
  setActiveChip('fc-openness', btn);
  applyFilter();
});

function setActiveChip(groupId, activeBtn) {
  document.getElementById(groupId).querySelectorAll('.fc')
    .forEach(b => b.classList.toggle('active', b === activeBtn));
}

function syncFilterBar() {
  const atL4 = currentLevel() === 4;
  filterBar.hidden = !(filterOpen && atL4);
}

function applyFilter() {
  syncFilterBar();
  const atL4 = currentLevel() === 4;
  if (!atL4 || filterState.openness === null) {
    renderer.setDimmedIds(new Set());
    filterCount.hidden = true;
    return;
  }
  const visible = state.currentTiles.filter(t => tileMatchesFilter(t));
  renderer.setDimmedIds(new Set(
    state.currentTiles.filter(t => !tileMatchesFilter(t)).map(t => t.id)
  ));
  filterCount.textContent = `${visible.length} von ${state.currentTiles.length}`;
  filterCount.hidden = false;
}

function tileMatchesFilter(tile) {
  if (filterState.openness !== null &&
      tile.details?.openness?.class !== filterState.openness) return false;
  return true;
}

// ── Process index (for L5 → L6 cross-sector lookup) ──────────────────────────

// Map<processName, searchIndexEntry[]>
let methodIndex = null;

function buildMethodIndex(searchIdx) {
  const mi = new Map();
  for (const entry of searchIdx) {
    for (const p of entry.tile.details?.processes ?? []) {
      if (!mi.has(p.method)) mi.set(p.method, []);
      mi.get(p.method).push(entry);
    }
  }
  return mi;
}

// Colors assigned to process categories
const PROCESS_COLORS = [
  ['beratung',         '#1a6eb5'],
  ['bildung',          '#7d3c98'],
  ['fundraising',      '#0e6655'],
  ['förder',           '#7e5109'],
  ['monitoring',       '#1d6a39'],
  ['evaluation',       '#7d6608'],
  ['netzwerk',         '#5d6d7e'],
  ['politik',          '#1a5276'],
  ['kampagnen',        '#616a6b'],
  ['forschung',        '#5d4d7e'],
  ['öffentlichkeit',   '#0e4d2e'],
  ['veranstaltung',    '#4a2070'],
];

function processColor(name) {
  const key = name.toLowerCase();
  for (const [prefix, color] of PROCESS_COLORS) {
    if (key.includes(prefix)) return color;
  }
  return '#4a5568';
}

// ── Boot ──────────────────────────────────────────────────────────────────────
let _mainTiles = [];

(async () => {
  try {
    showLoading(true);
    const sectors = await loadMain();
    _mainTiles = sectors;
    pushLevel(sectors, { id: null, name: 'Übersicht', level: 0 });

    const indexPromise = buildIndexInBackground(sectors);
    indexPromise.then(idx => { methodIndex = buildMethodIndex(idx); });
    initSearch({ indexPromise, onNavigate: navigateToSearchResult });
  } catch (err) {
    console.error(err);
    showError('Hauptdaten konnten nicht geladen werden.', () => location.reload());
  } finally {
    showLoading(false);
  }
})();

async function buildIndexInBackground(mainTiles) {
  const pairs = await Promise.all(
    mainTiles.filter(t => t.subFile).map(async t => {
      try   { return [t, await loadSector(t.id)]; }
      catch { return null; }
    })
  );
  return buildSearchIndex(mainTiles, pairs.filter(Boolean));
}

// ── Navigation ────────────────────────────────────────────────────────────────

function currentLevel() {
  return state.breadcrumb[state.breadcrumb.length - 1]?.level ?? 0;
}

function pushLevel(tiles, crumb) {
  const processed = applyOpennessColors(tiles);
  state.breadcrumb.push({ ...crumb, tiles: processed });
  patchState({ zoomLevel: crumb.level ?? state.zoomLevel, currentTiles: processed, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(processed);
  updateChrome();
  applyFilter();
}

function navigateBack() {
  if (state.breadcrumb.length <= 1) return;
  closeSidebar();
  state.breadcrumb.pop();
  const prev = state.breadcrumb[state.breadcrumb.length - 1];
  patchState({ zoomLevel: prev.level ?? 1, currentTiles: prev.tiles, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(prev.tiles);
  updateChrome();
  applyFilter();
}

function navigateHome() {
  closeSidebar();
  while (state.breadcrumb.length > 1) state.breadcrumb.pop();
  const root = state.breadcrumb[0];
  patchState({ zoomLevel: 1, currentTiles: root.tiles, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(root.tiles);
  updateChrome();
  applyFilter();
}

function navigateToCrumb(index) {
  if (index >= state.breadcrumb.length - 1) return;
  closeSidebar();
  while (state.breadcrumb.length - 1 > index) state.breadcrumb.pop();
  const target = state.breadcrumb[state.breadcrumb.length - 1];
  patchState({ zoomLevel: target.level ?? 1, currentTiles: target.tiles, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(target.tiles);
  updateChrome();
  applyFilter();
}

function navigateToSearchResult(result) {
  closeSidebar();
  state.breadcrumb = result.breadcrumb.map(c => ({ ...c }));
  const last = state.breadcrumb[state.breadcrumb.length - 1];
  patchState({ zoomLevel: last.level, currentTiles: last.tiles, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(last.tiles);
  updateChrome();
  applyFilter();
  const target = last.tiles.find(t => t.id === result.tile.id);
  if (target) openSidebar(target, sidebarOpts(target));
}

// ── Tile click handler ────────────────────────────────────────────────────────

function handleTileClick(id) {
  const tile = state.currentTiles.find(t => t.id === id);
  if (!tile) return;
  renderer.startPulse(id);
  openSidebar(tile, sidebarOpts(tile));
}

// Returns the sidebar options (explore callback + label) appropriate for the tile's level
function sidebarOpts(tile) {
  const lvl = tile.level ?? 1;

  // L1–L3: standard drill-down
  if (lvl <= 3 && (tile.children?.length || tile.subFile)) {
    return { onExplore: () => navigateDeeper(tile), exploreLabel: 'Erkunden' };
  }

  // L4 or L6 (cross-sector data type): navigate to its linked processes
  if ((lvl === 4 || lvl === 6) && tile.details?.processes?.length) {
    return {
      onExplore: () => navigateDeeper(tile),
      exploreLabel: 'Verwandte Prozesse erkunden',
    };
  }

  // L5 (process): navigate to related data types across sectors
  if (lvl === 5) {
    return {
      onExplore: () => navigateDeeper(tile),
      exploreLabel: 'Verwandte Datentypen',
    };
  }

  return {};
}

async function navigateDeeper(tile) {
  closeSidebar();
  const lvl = tile.level ?? 1;

  // ── L1 sector: load from JSON ──
  if (lvl === 1 && tile.subFile) {
    try {
      showLoading(true);
      const data     = await loadSector(tile.id);
      const children = data.children ?? [];
      if (children.length) {
        await animateOut(tile.id);
        pushLevel(children, { id: tile.id, name: tile.name, level: 2 });
      }
    } catch (err) {
      console.error(err);
      showError(`Sektor „${tile.name}" konnte nicht geladen werden.`, () => navigateDeeper(tile));
    } finally {
      showLoading(false);
    }
    return;
  }

  // ── L2–L3: standard children ──
  if (lvl >= 2 && lvl <= 3 && tile.children?.length) {
    await animateOut(tile.id);
    pushLevel(tile.children, { id: tile.id, name: tile.name, level: lvl + 1 });
    return;
  }

  // ── L4 or L6: show linked processes as L5 tiles ──
  if ((lvl === 4 || lvl === 6) && tile.details?.processes?.length) {
    const processes = tile.details.processes;
    const l5 = processes.map(p => {
      const related = methodIndex?.get(p.method) ?? [];
      return {
        id:              `process-${slugify(p.method)}`,
        level:           5,
        name:            p.method,
        color:           processColor(p.method),
        description:     p.description,
        navigable:       related.length > 0,
        _methodName:     p.method,
        _relatedCount:   related.length,
      };
    });
    await animateOut(tile.id);
    pushLevel(l5, { id: `processes-${tile.id}`, name: `Prozesse · ${tile.name}`, level: 5 });
    return;
  }

  // ── L5 method: show all data types using this method as L6 tiles ──
  if (lvl === 5) {
    const entries = methodIndex?.get(tile._methodName) ?? [];
    if (!entries.length) return;
    const l6 = entries.map(e => ({
      id:          `xref-${e.tile.id}-${slugify(tile._methodName)}`,
      level:       6,
      name:        e.tile.name,
      color:       e.tile.color,
      description: e.displayPath,
      details:     e.tile.details,
      navigable:   !!(e.tile.details?.processes?.length),
      _methodName: tile._methodName,
    }));
    await animateOut(tile.id);
    pushLevel(l6, { id: `types-${slugify(tile._methodName)}`, name: `${tile.name} · Datentypen`, level: 6 });
    return;
  }
}

// ── Hover / tooltip ──────────────────────────────────────────────────────────

function handleHover(id, clientX, clientY) {
  if (!id) { tooltip.hidden = true; return; }
  const tile = state.currentTiles.find(t => t.id === id);
  if (!tile) { tooltip.hidden = true; return; }
  tooltip.textContent = tile.name;
  tooltip.hidden = false;
  tooltip.style.left = `${clientX + 14}px`;
  tooltip.style.top  = `${clientY - 30}px`;
}

// ── Animations ────────────────────────────────────────────────────────────────

const ANIM_DUR = 280;

function animateOut(tileId) {
  const center = tileId ? renderer.getTileCenter(tileId) : null;
  if (center) canvas.style.transformOrigin = `${center.x}px ${center.y}px`;
  return new Promise(resolve => {
    const t0   = performance.now();
    const step = now => {
      const t = Math.min((now - t0) / ANIM_DUR, 1);
      renderer.setAlpha(1 - easeIn(t));
      if (center) canvas.style.transform = `scale(${1 + 0.09 * easeIn(t)})`;
      if (t < 1) requestAnimationFrame(step);
      else { canvas.style.transform = ''; canvas.style.transformOrigin = ''; resolve(); }
    };
    requestAnimationFrame(step);
  });
}

function animateIn(tiles) {
  renderer.setTiles(tiles);
  renderer.setAlpha(0);
  const t0   = performance.now();
  const step = now => {
    const t = Math.min((now - t0) / ANIM_DUR, 1);
    renderer.setAlpha(easeOut(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const easeIn  = t => t * t;
const easeOut = t => 1 - (1 - t) ** 2;

// ── Chrome ────────────────────────────────────────────────────────────────────

function updateChrome() {
  const crumbs = state.breadcrumb;
  const lvl    = crumbs[crumbs.length - 1]?.level ?? 1;

  levelNumEl.textContent  = Math.max(1, lvl);
  levelMaxEl.textContent  = lvl <= 4 ? '/ 4' : '/ ∞';
  btnBack.disabled = crumbs.length <= 1;
  btnHome.disabled = crumbs.length <= 1;

  breadcrumbEl.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="crumb-sep">/</span>' : '';
    return `${sep}<span class="crumb ${isLast ? 'active' : ''}" data-index="${i}">${esc(c.name)}</span>`;
  }).join('');

  breadcrumbEl.querySelectorAll('.crumb:not(.active)').forEach(el => {
    el.addEventListener('click', () => navigateToCrumb(+el.dataset.index));
  });
}

// ── Loading / error ───────────────────────────────────────────────────────────

function showLoading(on) { loadingVeil.hidden = !on; if (on) hideError(); }

function showError(message, retryFn) {
  showLoading(false);
  errorMessage.textContent = message;
  _retryFn = retryFn ?? null;
  errorState.hidden = false;
}

function hideError() { errorState.hidden = true; _retryFn = null; }

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

