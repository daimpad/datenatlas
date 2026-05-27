export const state = {
  zoomLevel: 1,
  breadcrumb: [],
  currentTiles: [],
  panOffset: { x: 0, y: 0 },
  hoveredId: null,
  selectedId: null,
  isAnimating: false,
};

export function patchState(updates) {
  Object.assign(state, updates);
}
