// Shared utilities

export const OPENNESS_COLORS = {
  'OP_01': '#27ae60',  // Grün — sofort publizierbar
  'OP_02': '#d4a017',  // Gelb — nach Aufbereitung
  'OP_03': '#c0392b',  // Rot — nur Metadaten
};

export function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Validate hex color strings to prevent CSS injection
export function safeColor(color, fallback = '#4a5568') {
  return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : fallback;
}

// Apply the full color concept:
//   L1 — keep sector color (distinct per sector)
//   L2/L3 — override with sectorColor (monochrome within a sector)
//   L4/L6 — override with openness color (semantic: green/yellow/red)
export function applyTileColors(tiles, sectorColor = null) {
  return tiles.map(t => {
    const lvl = t.level ?? 0;
    if (lvl === 4 || lvl === 6) {
      const oc = t.details?.openness?.class;
      if (oc && OPENNESS_COLORS[oc]) return { ...t, color: OPENNESS_COLORS[oc] };
    }
    if ((lvl === 2 || lvl === 3) && sectorColor) {
      return { ...t, color: sectorColor };
    }
    return t;
  });
}

// Backward-compat alias (L1 overview still calls this without a sector color)
export const applyOpennessColors = (tiles) => applyTileColors(tiles);

// Trap keyboard focus inside el while it's open.
// Focuses first focusable child immediately (pass initialFocus:false to skip).
// Returns a cleanup function — call it on close.
export function trapFocus(el, { initialFocus = true } = {}) {
  const SEL = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusable = () => [...el.querySelectorAll(SEL)];

  function onKeydown(e) {
    if (e.key !== 'Tab') return;
    const nodes = focusable();
    if (!nodes.length) { e.preventDefault(); return; }
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  el.addEventListener('keydown', onKeydown);
  if (initialFocus) focusable()[0]?.focus();
  return () => el.removeEventListener('keydown', onKeydown);
}
