import { IsometricRenderer } from './renderer.js';
import { initWizard, openWizardWithContext } from './wizard.js';
import { initControls }      from './controls.js';
import { openSidebar, closeSidebar } from './modal.js';
import { loadMain, loadSector }      from './dataLoader.js';
import { state, patchState }         from './state.js';
import { applyTileColors, applyOpennessColors, esc } from './utils.js';
import { buildSearchIndex, initSearch } from './search.js';
import { initStats }  from './stats.js';
import { initExport }   from './export.js';
import { initRelated, findRelated } from './related.js';
import { initGenerator } from './generator.js';

// ── Build hash ────────────────────────────────────────────────────────────────
const _buildHashEl = document.getElementById('build-hash');
if (_buildHashEl) { try { _buildHashEl.textContent = __BUILD_HASH__; } catch { /* raw source, not built */ } }

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas        = document.getElementById('map-canvas');
const loadingVeil   = document.getElementById('loading-veil');
const errorState    = document.getElementById('error-state');
const errorMessage  = document.getElementById('error-message');
const errorRetry    = document.getElementById('error-retry');
const btnBack       = document.getElementById('btn-back');
const btnHome       = document.getElementById('btn-home');
const breadcrumbEl  = document.getElementById('breadcrumb');
const tooltip       = document.getElementById('tooltip');
const filterBar     = document.getElementById('filter-bar');
const filterToggle  = document.getElementById('filter-toggle');
const filterCount   = document.getElementById('filter-count');
const lovNumber     = document.getElementById('lov-number');
const lovMax        = document.getElementById('lov-max');
const onboarding    = document.getElementById('onboarding');
const shareBtn      = document.getElementById('share-btn');
const shareToast    = document.getElementById('share-toast');
const logoEl        = document.getElementById('logo');
const infoBtn       = document.getElementById('info-btn');
const infoModal     = document.getElementById('info-modal');
const imClose       = document.getElementById('im-close');

// ── Init ──────────────────────────────────────────────────────────────────────
const renderer = new IsometricRenderer(canvas);
initWizard();

initControls({ canvas, renderer, onTileClick: handleTileClick, onHover: handleHover });

btnBack.addEventListener('click', navigateBack);
btnHome.addEventListener('click', navigateHome);
logoEl.addEventListener('click', navigateHome);

breadcrumbEl.addEventListener('click', e => {
  const crumb = e.target.closest('.crumb');
  if (!crumb || crumb.classList.contains('active')) return;
  navigateToCrumb(+crumb.dataset.index);
});

let _retryFn = null;
errorRetry.addEventListener('click', () => { hideError(); _retryFn?.(); });

// ── Onboarding ────────────────────────────────────────────────────────────────
// Always show on every page load — no localStorage
document.getElementById('ob-start').addEventListener('click', () => {
  onboarding.hidden = true;
});

// ── Info modal ────────────────────────────────────────────────────────────────
function openInfoModal()  { infoModal.hidden = false; infoBtn.classList.add('active'); }
function closeInfoModal() { infoModal.hidden = true;  infoBtn.classList.remove('active'); }

infoBtn.addEventListener('click', openInfoModal);
imClose.addEventListener('click', closeInfoModal);
infoModal.addEventListener('click', e => { if (e.target === infoModal) closeInfoModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !infoModal.hidden) closeInfoModal(); });

// ── Mobile action sheet ───────────────────────────────────────────────────────
const mobileSheet = document.getElementById('mobile-sheet');
document.getElementById('more-btn').addEventListener('click', () => { mobileSheet.hidden = false; });
mobileSheet.querySelector('.ms-backdrop').addEventListener('click', () => { mobileSheet.hidden = true; });
mobileSheet.querySelectorAll('.ms-item[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    mobileSheet.hidden = true;
    document.getElementById(btn.dataset.target)?.click();
  });
});

// ── Canvas keyboard navigation ────────────────────────────────────────────────

canvas.setAttribute('tabindex', '0');
canvas.setAttribute('aria-label', 'Isometrische Karte – Navigationstasten: Pfeile, Enter, Escape');

let _focusedId = null;

function _setFocus(id) {
  _focusedId = id;
  renderer.setFocused(id);
  if (id) {
    const tile = state.currentTiles.find(t => t.id === id);
    if (tile) openSidebar(tile, sidebarOpts(tile));
  }
}

canvas.addEventListener('keydown', e => {
  const tiles = state.currentTiles;
  if (!tiles.length) return;

  if (e.key === 'Escape') {
    // Don't steal Escape from the info-modal handler (document keydown) when it's open
    if (!infoModal.hidden) return;
    if (_focusedId) { _setFocus(null); closeSidebar(); }
    else navigateBack();
    e.preventDefault();
    return;
  }

  if (e.key === 'Enter' || e.key === ' ') {
    if (_focusedId) {
      const tile = tiles.find(t => t.id === _focusedId);
      if (tile) navigateDeeper(tile);
    }
    e.preventDefault();
    return;
  }

  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
  e.preventDefault();

  // Determine grid layout from renderer
  const cols  = renderer.cols;
  const total = tiles.length;

  let idx = _focusedId ? tiles.findIndex(t => t.id === _focusedId) : -1;
  if (idx < 0) idx = 0;
  else {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    if (e.key === 'ArrowRight') idx = Math.min(total - 1, idx + 1);
    if (e.key === 'ArrowLeft')  idx = Math.max(0, idx - 1);
    // ArrowDown/Up: only move if the target cell exists in the grid (no wrap to wrong column)
    if (e.key === 'ArrowDown') { const t = (row + 1) * cols + col; if (t < total) idx = t; }
    if (e.key === 'ArrowUp')   { const t = (row - 1) * cols + col; if (t >= 0)    idx = t; }
  }

  _setFocus(tiles[idx].id);
});

// Clear focus ring when canvas loses keyboard focus, but don't close the sidebar
// (blur fires before the click on sidebar buttons, which would swallow them)
canvas.addEventListener('blur', () => {
  _setFocus(null);
});

// ── Share / deep-link ─────────────────────────────────────────────────────────
let _hashEnabled = false;
let _shareTimer  = null;

shareBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(location.href).then(() => {
    shareBtn.classList.add('copied');
    shareToast.hidden = false;
    clearTimeout(_shareTimer);
    _shareTimer = setTimeout(() => {
      shareBtn.classList.remove('copied');
      shareToast.hidden = true;
    }, 2000);
  });
});

function updateHash() {
  if (!_hashEnabled) return;
  const lvl = currentLevel();
  if (lvl > 4) return;
  const path = state.breadcrumb
    .filter(c => c.id != null)
    .map(c => c.id)
    .join('/');
  history.replaceState(null, '', path ? '#' + path : location.pathname);
}

async function restoreFromHash(hash) {
  const decoded = decodeURIComponent(hash.replace(/^#/, ''));
  if (!decoded) return;
  const segments = decoded.split('/').filter(Boolean);
  if (!segments.length) return;

  const sectorTile = _mainTiles.find(t => t.id === segments[0]);
  if (!sectorTile?.subFile) {
    showError(`Link ungültig: Sektor „${segments[0]}" nicht gefunden.`, navigateHome);
    return;
  }

  try {
    showLoading(true);
    const sc = sectorTile.color;
    const sectorData = await loadSector(sectorTile.id);
    _indexSector(sectorTile, sectorData);
    const l2tiles = applyTileColors(sectorData.children ?? [], sc);
    state.breadcrumb.push({ id: sectorTile.id, name: sectorTile.name, level: 2, tiles: l2tiles, sectorColor: sc });
    if (segments.length === 1) { _finish(2, l2tiles); return; }

    const l2tile = l2tiles.find(t => t.id === segments[1]);
    if (!l2tile) {
      _finish(2, l2tiles);
      showError(`Eintrag „${segments[1]}" nicht gefunden — zeige Sektor.`, hideError);
      return;
    }
    if (!l2tile.children?.length) { _finish(2, l2tiles); return; }
    const l3tiles = applyTileColors(l2tile.children, sc);
    state.breadcrumb.push({ id: l2tile.id, name: l2tile.name, level: 3, tiles: l3tiles, sectorColor: sc });
    if (segments.length === 2) { _finish(3, l3tiles); return; }

    const l3tile = l3tiles.find(t => t.id === segments[2]);
    if (!l3tile) {
      _finish(3, l3tiles);
      showError(`Eintrag „${segments[2]}" nicht gefunden — zeige Organisation.`, hideError);
      return;
    }
    if (!l3tile.children?.length) { _finish(3, l3tiles); return; }
    const l4tiles = applyTileColors(l3tile.children, sc);
    state.breadcrumb.push({ id: l3tile.id, name: l3tile.name, level: 4, tiles: l4tiles, sectorColor: sc });
    _finish(4, l4tiles);
  } catch (err) {
    console.error('URL restore failed:', err);
    showError('Link konnte nicht geladen werden.', navigateHome);
  } finally {
    showLoading(false);
  }

  function _finish(lvl, tiles) {
    patchState({ zoomLevel: lvl, currentTiles: tiles, panOffset: { x: 0, y: 0 } });
    renderer.setTiles(tiles);
    renderer.setPan(0, 0);
    updateChrome();
  }
}

// ── Filter ────────────────────────────────────────────────────────────────────
const filterState = { openness: null };
let filterOpen    = false;

const _searchInputEl = document.getElementById('search-input');
const _headerEl      = document.getElementById('header');

function syncFilterToggleVisibility() {
  const hasQuery = _headerEl.classList.contains('search-mode') && _searchInputEl.value.trim().length > 0;
  filterToggle.hidden = !hasQuery;
  if (!hasQuery && filterOpen) {
    filterOpen = false;
    filterToggle.classList.remove('active');
    syncFilterBar();
  }
}

_searchInputEl.addEventListener('input', syncFilterToggleVisibility);
new MutationObserver(syncFilterToggleVisibility).observe(_headerEl, { attributes: true, attributeFilter: ['class'] });

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
  filterBar.hidden = !filterOpen;
}

function applyFilter() {
  syncFilterBar();
  renderer.setDimmedIds(new Set());
  filterCount.hidden = true;

  if (filterState.openness === null) return;

  // Filter search result items in the dropdown
  const resultsEl = document.getElementById('search-results');
  if (!resultsEl.hidden) {
    let shown = 0, total = 0;
    resultsEl.querySelectorAll('.sr-item').forEach(el => {
      const dot = el.querySelector('.sr-dot');
      // openness class is stored as data attribute by search renderer
      const opClass = el.dataset.opClass;
      const match = !opClass || opClass === filterState.openness;
      el.hidden = !match;
      total++;
      if (match) shown++;
    });
    filterCount.textContent = `${shown} von ${total}`;
    filterCount.hidden = false;
  }
}

document.getElementById('search-results').addEventListener('search-rendered', () => {
  if (filterOpen) applyFilter();
});

function tileMatchesFilter(tile) {
  if (filterState.openness !== null &&
      tile.details?.openness?.class !== filterState.openness) return false;
  return true;
}

// ── Process index (for L5 → L6 cross-sector lookup) ──────────────────────────

// Map<processName, searchIndexEntry[]> — built incrementally in _indexSector
let methodIndex = null;

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

// Growing search index — sectors are added as they load
const _liveIndex = [];
let   _indexResolve;
// Resolves once ALL sectors have been indexed (for stats/export/related/generator)
const _fullIndexPromise = new Promise(r => { _indexResolve = r; });
// Tracks which sector ids have already been indexed
const _indexedSectors = new Set();

// Index a single already-loaded sector; idempotent
function _indexSector(sectorTile, sectorData) {
  if (_indexedSectors.has(sectorTile.id)) return;
  _indexedSectors.add(sectorTile.id);
  const newEntries = buildSearchIndex(_mainTiles, [[sectorTile, sectorData]]);
  _liveIndex.push(...newEntries);
  // Incrementally extend methodIndex instead of rebuilding from scratch each time
  if (!methodIndex) methodIndex = new Map();
  for (const entry of newEntries) {
    for (const p of entry.tile.details?.processes ?? []) {
      if (!methodIndex.has(p.method)) methodIndex.set(p.method, []);
      methodIndex.get(p.method).push(entry);
    }
  }
}

// Load sectors one by one in the background; prioritize `firstId` if given
async function _buildIndexLazy(sectors, firstId) {
  const ordered = firstId
    ? [sectors.find(t => t.id === firstId), ...sectors.filter(t => t.id !== firstId)].filter(Boolean)
    : sectors;
  for (const t of ordered.filter(t => t.subFile)) {
    try {
      const data = await loadSector(t.id);
      _indexSector(t, data);
    } catch { /* skip failed sectors */ }
    // yield between each sector so the event loop stays responsive
    await new Promise(r => setTimeout(r, 0));
  }
  _indexResolve(_liveIndex);
}

(async () => {
  const _initialHash = location.hash;
  const _firstSector = _initialHash ? _initialHash.replace(/^#/, '').split('/')[0] : null;

  try {
    showLoading(true);
    const sectors = await loadMain();
    _mainTiles = sectors;
    pushLevel(sectors, { id: null, name: 'Alle Sektoren', level: 0 });

    if (_initialHash && _initialHash !== '#') {
      await restoreFromHash(_initialHash);
    }
    _hashEnabled = true;
    updateHash();

    // Start background index build after initial render; prioritize current sector
    setTimeout(() => _buildIndexLazy(sectors, _firstSector), 0);

    initSearch({ indexPromise: _fullIndexPromise, getLiveIndex: () => _liveIndex, onNavigate: navigateToSearchResult });
    initStats({ indexPromise: _fullIndexPromise, mainTiles: sectors });
    initExport({ indexPromise: _fullIndexPromise });
    initRelated({ indexPromise: _fullIndexPromise });
    initGenerator({ indexPromise: _fullIndexPromise, onNavigate: navigateToSearchResult });
  } catch (err) {
    console.error(err);
    showError('Hauptdaten konnten nicht geladen werden.', () => location.reload());
  } finally {
    showLoading(false);
  }
})();

// ── Navigation ────────────────────────────────────────────────────────────────

function currentLevel() {
  return state.breadcrumb[state.breadcrumb.length - 1]?.level ?? 0;
}

function pushLevel(tiles, crumb) {
  _focusedId = null;
  renderer.setFocused(null);
  // Inherit sectorColor from crumb or from the nearest ancestor that has one
  const sectorColor = crumb.sectorColor
    ?? state.breadcrumb.slice().reverse().find(c => c.sectorColor)?.sectorColor
    ?? null;
  const processed = applyTileColors(tiles, sectorColor);
  state.breadcrumb.push({ ...crumb, tiles: processed, sectorColor });
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
  _focusedId = null;
  renderer.setFocused(null);
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
    const opts = { onExplore: () => navigateDeeper(tile), exploreLabel: 'Erkunden' };
    // L2: offer a direct link to the data expansion tool
    if (lvl === 2) {
      const sectorId = state.breadcrumb.find(c => c.level === 2)?.id
        ?? state.breadcrumb[state.breadcrumb.length - 1]?.id;
      opts.onExpand = () => {
        const base = import.meta.env?.BASE_URL ?? './';
        const url  = `${base}expand.html?sector=${encodeURIComponent(sectorId)}&l2=${encodeURIComponent(tile.id)}`;
        window.open(url, '_blank');
      };
    }
    return opts;
  }

  // L4 or L6 (cross-sector data type): navigate to its linked processes
  if (lvl === 4 || lvl === 6) {
    const sectorId   = state.breadcrumb.find(c => c.level === 2)?.id ?? null;
    const related    = findRelated(tile, sectorId);
    const displayPath = state.breadcrumb
      .filter(c => c.id != null && c.level >= 2 && c.level <= 3)
      .map(c => c.name).join(' · ');
    const opts = {
      related,
      onNavigate: navigateToSearchResult,
      onWizard:   () => openWizardWithContext({ sectorId, tileName: tile.name, displayPath }),
    };
    if (tile.details?.processes?.length) {
      opts.onExplore    = () => navigateDeeper(tile);
      opts.exploreLabel = 'Verwandte Prozesse erkunden';
    }
    return opts;
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
      _indexSector(tile, data);         // index immediately so search works right away
      const children = data.children ?? [];
      if (children.length) {
        await animateOut(tile.id);
        pushLevel(children, { id: tile.id, name: tile.name, level: 2, sectorColor: tile.color });
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

  const lvlDisplay = Math.max(1, lvl);
  const maxDisplay = lvl <= 4 ? '4' : '∞';
  lovNumber.textContent  = lvlDisplay;
  lovMax.textContent     = maxDisplay;
  btnBack.disabled = crumbs.length <= 1;
  btnHome.disabled = crumbs.length <= 1;

  breadcrumbEl.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="crumb-sep">/</span>' : '';
    return `${sep}<span class="crumb ${isLast ? 'active' : ''}" data-index="${i}">${esc(c.name)}</span>`;
  }).join('');

  updateHash();
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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


