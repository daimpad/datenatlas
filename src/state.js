// Minimal event emitter + shared state store

const _listeners = {};

export const bus = {
  on(event, fn) {
    (_listeners[event] ??= []).push(fn);
    return () => { _listeners[event] = _listeners[event].filter(f => f !== fn); };
  },
  emit(event, payload) {
    (_listeners[event] ?? []).forEach(fn => fn(payload));
  },
};

export const state = {
  zoomLevel: 1,
  // breadcrumb: [{id, name, level, tiles?}]
  breadcrumb: [],
  // tiles currently on screen
  currentTiles: [],
  panOffset: { x: 0, y: 0 },
  hoveredId: null,
  selectedId: null,
  isAnimating: false,
};

export function patchState(updates) {
  Object.assign(state, updates);
  bus.emit('change', state);
}
