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

// Override level-4 tile colors with their Öffnungsklasse color
export function applyOpennessColors(tiles) {
  return tiles.map(t => {
    if (t.level !== 4) return t;
    const oc = t.details?.openness?.class;
    return oc && OPENNESS_COLORS[oc] ? { ...t, color: OPENNESS_COLORS[oc] } : t;
  });
}
