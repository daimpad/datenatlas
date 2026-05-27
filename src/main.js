import { IsometricRenderer } from './renderer.js';
import { initControls }      from './controls.js';
import { openSidebar, closeSidebar } from './modal.js';
import { loadMain, loadSector }      from './dataLoader.js';
import { state, patchState }         from './state.js';

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas       = document.getElementById('map-canvas');
const loadingVeil  = document.getElementById('loading-veil');
const errorState   = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const errorRetry   = document.getElementById('error-retry');
const btnBack      = document.getElementById('btn-back');
const btnHome      = document.getElementById('btn-home');
const breadcrumbEl = document.getElementById('breadcrumb');
const levelNumEl   = document.getElementById('level-number');
const tooltip      = document.getElementById('tooltip');

// ── Init ──────────────────────────────────────────────────────────────────────
const renderer = new IsometricRenderer(canvas);

initControls({
  canvas,
  renderer,
  onTileClick: handleTileClick,
  onHover: handleHover,
});

btnBack.addEventListener('click', navigateBack);
btnHome.addEventListener('click', navigateHome);

// Retry button wires up to a replaceable callback
let _retryFn = null;
errorRetry.addEventListener('click', () => {
  hideError();
  _retryFn?.();
});

// Boot
(async () => {
  try {
    showLoading(true);
    const sectors = await loadMain();
    pushLevel(sectors, { id: null, name: 'Übersicht', level: 0 });
  } catch (err) {
    console.error(err);
    showError('Hauptdaten konnten nicht geladen werden.', () => location.reload());
  } finally {
    showLoading(false);
  }
})();

// ── Navigation ────────────────────────────────────────────────────────────────

function pushLevel(tiles, crumb) {
  state.breadcrumb.push({ ...crumb, tiles });
  patchState({
    zoomLevel:    crumb.level ?? state.zoomLevel,
    currentTiles: tiles,
    panOffset:    { x: 0, y: 0 },
  });
  renderer.setPan(0, 0);
  animateIn(tiles);
  updateChrome();
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
}

function navigateHome() {
  closeSidebar();
  while (state.breadcrumb.length > 1) state.breadcrumb.pop();
  const root = state.breadcrumb[0];
  patchState({ zoomLevel: 1, currentTiles: root.tiles, panOffset: { x:0, y:0 } });
  renderer.setPan(0, 0);
  animateIn(root.tiles);
  updateChrome();
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
}

// ── Tile click handler ────────────────────────────────────────────────────────

function handleTileClick(id) {
  const tile = state.currentTiles.find(t => t.id === id);
  if (!tile) return;

  // #1 — immediate visual pulse feedback
  renderer.startPulse(id);

  const hasChildren = tile.children?.length || tile.subFile;

  if (hasChildren) {
    // #2 — Levels 1-3: open sidebar with info + explore button
    openSidebar(tile, { onExplore: () => navigateDeeper(tile) });
  } else {
    // Level 4 / leaf node: open sidebar with full DSGVO details
    openSidebar(tile);
  }
}

async function navigateDeeper(tile) {
  closeSidebar();

  if (tile.level === 1 && tile.subFile) {
    try {
      showLoading(true);
      const sectorData = await loadSector(tile.id);
      const children   = sectorData.children ?? [];
      if (children.length) {
        await animateOut();
        pushLevel(children, { id: tile.id, name: tile.name, level: 2 });
      }
    } catch (err) {
      console.error('Failed to load sector:', err);
      // #3 — show error state with retry
      showError(
        `Sektor „${tile.name}" konnte nicht geladen werden.`,
        () => navigateDeeper(tile),
      );
    } finally {
      showLoading(false);
    }
    return;
  }

  if (tile.children?.length) {
    const nextLevel = (tile.level ?? 1) + 1;
    await animateOut();
    pushLevel(tile.children, { id: tile.id, name: tile.name, level: nextLevel });
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

// ── Transition animation ──────────────────────────────────────────────────────

const ANIM_DUR = 280;

function animateOut() {
  return new Promise(resolve => {
    const t0   = performance.now();
    const step = now => {
      const t = Math.min((now - t0) / ANIM_DUR, 1);
      renderer.setAlpha(1 - easeIn(t));
      if (t < 1) requestAnimationFrame(step); else resolve();
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

// ── Chrome updates ────────────────────────────────────────────────────────────

function updateChrome() {
  const crumbs = state.breadcrumb;
  const depth  = crumbs.length - 1;

  levelNumEl.textContent = Math.max(1, crumbs[crumbs.length - 1]?.level ?? 1);
  btnBack.disabled = depth < 1;
  btnHome.disabled = depth < 1;

  breadcrumbEl.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="crumb-sep">/</span>' : '';
    return `${sep}<span class="crumb ${isLast ? 'active' : ''}"
      data-index="${i}">${esc(c.name)}</span>`;
  }).join('');

  breadcrumbEl.querySelectorAll('.crumb:not(.active)').forEach(el => {
    el.addEventListener('click', () => navigateToCrumb(+el.dataset.index));
  });
}

// ── Loading / error state ─────────────────────────────────────────────────────

function showLoading(on) {
  loadingVeil.hidden = !on;
  if (on) hideError();
}

function showError(message, retryFn) {
  showLoading(false);
  errorMessage.textContent = message;
  _retryFn = retryFn ?? null;
  errorState.hidden = false;
}

function hideError() {
  errorState.hidden = true;
  _retryFn = null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str = '') {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}
