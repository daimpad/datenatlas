const _cache = new Map();
const BASE = './data';

async function _fetch(filename) {
  if (_cache.has(filename)) return _cache.get(filename);
  const res = await fetch(`${BASE}/${filename}`);
  if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.status}`);
  const data = await res.json();
  _cache.set(filename, data);
  return data;
}

export const loadMain = () => _fetch('main.json');
export const loadSector = id => _fetch(`sector_${id}.json`);
export const loadSearchIndex = () => _fetch('search-index.json');
