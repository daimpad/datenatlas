let _themeIndex  = new Map();
let _objectIndex = new Map();
let _ready = false;

export function initRelated({ indexPromise }) {
  indexPromise.then(index => {
    for (const entry of index) {
      const th = entry.tile.details?.theme?.code;
      const ob = entry.tile.details?.object?.code;
      if (th) { if (!_themeIndex.has(th)) _themeIndex.set(th, []); _themeIndex.get(th).push(entry); }
      if (ob) { if (!_objectIndex.has(ob)) _objectIndex.set(ob, []); _objectIndex.get(ob).push(entry); }
    }
    _ready = true;
  });
}

export function findRelated(tile, excludeSectorId, limit = 5) {
  if (!_ready || !tile.details) return [];

  const th = tile.details.theme?.code;
  const ob = tile.details.object?.code;
  const scores = new Map();

  const score = (entries, pts) => {
    for (const e of entries) {
      if (e.tile.id === tile.id) continue;
      if (excludeSectorId && e.breadcrumb[1]?.id === excludeSectorId) continue;
      scores.set(e, (scores.get(e) ?? 0) + pts);
    }
  };

  if (th) score(_themeIndex.get(th) ?? [], 2);
  if (ob) score(_objectIndex.get(ob) ?? [], 1);

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([entry]) => entry);
}
