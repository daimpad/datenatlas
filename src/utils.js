// Shared utilities for risk color mapping

export const RISK_COLORS = {
  'risk-low':      '#27ae60',
  'risk-medium':   '#d4a017',
  'risk-high':     '#e67e22',
  'risk-veryhigh': '#c0392b',
};

// Override level-4 tile colors with their DSGVO risk class color
export function applyRiskColors(tiles) {
  return tiles.map(t => {
    if (t.level !== 4) return t;
    const rc = t.details?.dsgvoRisk?.riskClass;
    return rc && RISK_COLORS[rc] ? { ...t, color: RISK_COLORS[rc] } : t;
  });
}
