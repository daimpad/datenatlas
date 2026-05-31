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
