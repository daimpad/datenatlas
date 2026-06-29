import { IsometricRenderer } from './renderer.js';
import { initWizard, openWizardWithContext } from './wizard.js';
import { initControls }      from './controls.js';
import { openSidebar, closeSidebar } from './modal.js';
import { loadMain, loadSector, loadSearchIndex } from './dataLoader.js';
import { state, patchState }         from './state.js';
import { applyTileColors, applyOpennessColors, esc, trapFocus, OPENNESS_COLORS } from './utils.js';
import { buildSearchIndex, initSearch } from './search.js';
import { initStats }  from './stats.js';
import { initExport }   from './export.js';
import { initRelated, findRelated } from './related.js';
import { initGenerator } from './generator.js';
import { initTimeline }  from './timeline.js';

// ── Build hash ────────────────────────────────────────────────────────────────
const _buildHashEl = document.getElementById('build-hash');
if (_buildHashEl) { try { _buildHashEl.textContent = __APP_VERSION__; } catch { _buildHashEl.textContent = 'v2.0'; } }

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
{
  const obCleanup = trapFocus(onboarding);
  function dismissOnboarding() { obCleanup(); onboarding.hidden = true; }
  document.getElementById('ob-start').addEventListener('click', dismissOnboarding);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !onboarding.hidden) dismissOnboarding(); });
}

// ── Info modal ────────────────────────────────────────────────────────────────
let _infoTrapCleanup = null;
function openInfoModal() {
  if (!infoModal.hidden) return;
  infoModal.hidden = false;
  infoBtn.classList.add('active');
  _infoTrapCleanup = trapFocus(infoModal);
}
function closeInfoModal() {
  _infoTrapCleanup?.(); _infoTrapCleanup = null;
  infoModal.hidden = true;
  infoBtn.classList.remove('active');
  infoBtn.focus();
}

infoBtn.addEventListener('click', openInfoModal);
imClose.addEventListener('click', closeInfoModal);
infoModal.addEventListener('click', e => { if (e.target === infoModal) closeInfoModal(); });
// Feature shortcuts: clicking a feature entry closes the info modal and triggers the tool
infoModal.addEventListener('click', e => {
  const action = e.target.closest('[data-action]');
  if (!action) return;
  closeInfoModal();
  document.getElementById(action.dataset.action)?.click();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !infoModal.hidden && mobileSheet.hidden) closeInfoModal(); });

// ── Mobile action sheet ───────────────────────────────────────────────────────
const mobileSheet = document.getElementById('mobile-sheet');
const moreBtn = document.getElementById('more-btn');
let _sheetTrapCleanup = null;

function openMobileSheet() {
  if (!mobileSheet.hidden) return;
  mobileSheet.hidden = false;
  _sheetTrapCleanup = trapFocus(mobileSheet);
}
function closeMobileSheet() {
  _sheetTrapCleanup?.(); _sheetTrapCleanup = null;
  mobileSheet.hidden = true;
  moreBtn.focus();
}

moreBtn.addEventListener('click', openMobileSheet);
mobileSheet.querySelector('.ms-backdrop').addEventListener('click', closeMobileSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileSheet.hidden) closeMobileSheet(); });
mobileSheet.querySelectorAll('.ms-item[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeMobileSheet();
    document.getElementById(btn.dataset.target)?.click();
  });
});
// External tool links open in a new tab; close the sheet behind them.
mobileSheet.querySelectorAll('.ms-item--ext').forEach(link => {
  link.addEventListener('click', closeMobileSheet);
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

// Load a sector on demand and drill to sector/org/activity, rebuilding the
// breadcrumb from the root. Optionally opens the sidebar for `leafId`. Shared by
// deep-link restore (restoreFromHash) and jump-to-result navigation
// (navigateToEntry) so neither needs the full taxonomy preloaded.
async function drillToPath(sectorId, orgId, actId, leafId = null) {
  _focusedId = null;
  renderer.setFocused(null);
  closeSidebar();

  const sectorTile = _mainTiles.find(t => t.id === sectorId);
  if (!sectorTile?.subFile) {
    showError(`Sektor „${sectorId}" nicht gefunden.`, navigateHome);
    return;
  }

  try {
    showLoading(true);
    const sc = sectorTile.color;
    const sectorData = await loadSector(sectorTile.id);

    // Reset to the root crumb, then push the resolved levels
    state.breadcrumb = [state.breadcrumb[0]];
    let tiles = applyTileColors(sectorData.children ?? [], sc);
    let level = 2;
    state.breadcrumb.push({ id: sectorTile.id, name: sectorTile.name, level: 2, tiles, sectorColor: sc });

    if (orgId) {
      const l2tile = tiles.find(t => t.id === orgId);
      if (l2tile?.children?.length) {
        tiles = applyTileColors(l2tile.children, sc);
        level = 3;
        state.breadcrumb.push({ id: l2tile.id, name: l2tile.name, level: 3, tiles, sectorColor: sc });

        if (actId) {
          const l3tile = tiles.find(t => t.id === actId);
          if (l3tile?.children?.length) {
            tiles = applyTileColors(l3tile.children, sc);
            level = 4;
            state.breadcrumb.push({ id: l3tile.id, name: l3tile.name, level: 4, tiles, sectorColor: sc });
          }
        }
      }
    }

    patchState({ zoomLevel: level, currentTiles: tiles, panOffset: { x: 0, y: 0 } });
    renderer.setTiles(tiles);
    renderer.setPan(0, 0);
    updateChrome();
    applyFilter();

    if (leafId) {
      const target = tiles.find(t => t.id === leafId);
      if (target) openSidebar(target, sidebarOpts(target));
    }
  } catch (err) {
    console.error('Navigation failed:', err);
    showError('Eintrag konnte nicht geladen werden.', navigateHome);
  } finally {
    showLoading(false);
  }
}

async function restoreFromHash(hash) {
  const decoded = decodeURIComponent(hash.replace(/^#/, ''));
  if (!decoded) return;
  const [s, o, a] = decoded.split('/').filter(Boolean);
  if (!s) return;
  await drillToPath(s, o, a, null);
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

// Map<processName, searchIndexEntry[]> — populated lazily by ensureFullIndex()
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

// Slim search index (always loaded): powers search, stats, timeline, related and
// the generator. Each slim record is adapted to the entry shape those consumers
// already expect ({ tile, breadcrumb, displayPath, searchText }) so they need no
// changes. _addr carries the ids needed for on-demand navigation.
let _index = [];
let _slimResolve;
const _slimIndexPromise = new Promise(r => { _slimResolve = r; });

function adaptEntry(e) {
  const displayPath = `${e.sn} · ${e.on} · ${e.an}`;
  const details = {};
  if (e.c)  details.openness = { class: e.c };
  if (e.th) details.theme    = { code: e.th };
  if (e.ob) details.object   = { code: e.ob };
  if (e.fq || e.yr) details.temporal = { update_frequency: e.fq ?? undefined, available_from: e.yr ?? undefined };
  return {
    tile: { id: e.i, name: e.n, level: 4, color: OPENNESS_COLORS[e.c] ?? '#4a5568', details },
    breadcrumb: [
      { id: null, name: 'Übersicht',  level: 0 },
      { id: e.s,  name: e.sn, level: 2 },
      { id: e.o,  name: e.on, level: 3 },
      { id: e.a,  name: e.an, level: 4 },
    ],
    displayPath,
    searchText: `${e.n} ${displayPath}`.toLowerCase(),
    _addr: { s: e.s, o: e.o, a: e.a, i: e.i },
  };
}

// Full per-node index (real details + process methods) — built lazily, only when
// a feature truly needs cross-sector full data: CSV "export all" and process
// exploration (L4→L5→L6). Most visits never trigger it, sparing the ~16 MB load.
let _fullIndexPromise = null;
function ensureFullIndex() {
  if (_fullIndexPromise) return _fullIndexPromise;
  _fullIndexPromise = (async () => {
    methodIndex = methodIndex ?? new Map();
    const entries = [];
    for (const t of _mainTiles.filter(t => t.subFile)) {
      try {
        const data = await loadSector(t.id);
        const part = buildSearchIndex(_mainTiles, [[t, data]]);
        entries.push(...part);
        for (const entry of part) {
          for (const p of entry.tile.details?.processes ?? []) {
            if (!methodIndex.has(p.method)) methodIndex.set(p.method, []);
            methodIndex.get(p.method).push(entry);
          }
        }
      } catch { /* skip failed sectors */ }
      await new Promise(r => setTimeout(r, 0)); // keep the event loop responsive
    }
    return entries;
  })();
  return _fullIndexPromise;
}

(async () => {
  const _initialHash = location.hash;

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

    // Load the slim index in the background; it powers search/stats/timeline/related/generator
    loadSearchIndex()
      .then(slim => { _index = (slim.entries ?? []).map(adaptEntry); _slimResolve(_index); })
      .catch(err => { console.error('Search index failed to load:', err); _slimResolve([]); });

    initSearch({ indexPromise: _slimIndexPromise, getLiveIndex: () => _index, onNavigate: navigateToEntry });
    initStats(    { indexPromise: _slimIndexPromise, mainTiles: sectors });
    initTimeline( { indexPromise: _slimIndexPromise, mainTiles: sectors });
    initExport({ ensureFullIndex });
    initRelated({ indexPromise: _slimIndexPromise });
    initGenerator({ indexPromise: _slimIndexPromise, onNavigate: navigateToEntry });
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

// Jump to a slim-index entry (search result, related item, generator tile):
// load its sector on demand, drill to it, and open its full detail sidebar.
function navigateToEntry(entry) {
  const a = entry?._addr;
  if (!a) return;
  return drillToPath(a.s, a.o, a.a, a.i);
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
    const orgId      = state.breadcrumb.find(c => c.level === 3)?.id ?? null;
    const related    = findRelated(tile, sectorId);
    const displayPath = state.breadcrumb
      .filter(c => c.id != null && c.level >= 2 && c.level <= 3)
      .map(c => c.name).join(' · ');
    const opts = {
      related,
      onNavigate: navigateToEntry,
      onWizard:   () => openWizardWithContext({ sectorId, orgId, tileName: tile.name, displayPath }),
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
    // Cross-sector process links need the full per-node index — load it on demand.
    showLoading(true);
    try { await ensureFullIndex(); } finally { showLoading(false); }
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


