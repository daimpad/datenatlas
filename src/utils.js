// Shared utilities for openness color mapping

export const OPENNESS_COLORS = {
  'OP_01': '#27ae60',  // Grün — sofort publizierbar
  'OP_02': '#d4a017',  // Gelb — nach Aufbereitung
  'OP_03': '#c0392b',  // Rot — nur Metadaten
};

// Override level-4 tile colors with their Öffnungsklasse color
export function applyOpennessColors(tiles) {
  return tiles.map(t => {
    if (t.level !== 4) return t;
    const oc = t.details?.openness?.class;
    return oc && OPENNESS_COLORS[oc] ? { ...t, color: OPENNESS_COLORS[oc] } : t;
  });
}
