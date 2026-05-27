import { applyRiskColors } from './utils.js';

// ── Index building ─────────────────────────────────────────────────────────────

export function buildSearchIndex(mainTiles, sectorPairs) {
  const index = [];
  const rootCrumb = { id: null, name: 'Übersicht', level: 0, tiles: mainTiles };

  for (const [sectorTile, sectorData] of sectorPairs) {
    const l2tiles    = applyRiskColors(sectorData.children ?? []);
    const sectorCrumb = { id: sectorTile.id, name: sectorTile.name, level: 2, tiles: l2tiles };

    for (const org of sectorData.children ?? []) {
      const l3tiles  = applyRiskColors(org.children ?? []);
      const orgCrumb = { id: org.id, name: org.name, level: 3, tiles: l3tiles };

      for (const activity of org.children ?? []) {
        const l4tiles      = applyRiskColors(activity.children ?? []);
        const activityCrumb = { id: activity.id, name: activity.name, level: 4, tiles: l4tiles };

        for (const dataType of activity.children ?? []) {
          const tile = applyRiskColors([dataType])[0];
          index.push({
            tile,
            breadcrumb:  [rootCrumb, sectorCrumb, orgCrumb, activityCrumb],
            displayPath: `${sectorTile.name} · ${org.name} · ${activity.name}`,
          });
        }
      }
    }
  }

  return index;
}

// ── UI ─────────────────────────────────────────────────────────────────────────

export function initSearch({ indexPromise, onNavigate }) {
  const header    = document.getElementById('header');
  const toggleBtn = document.getElementById('search-toggle');
  const inputEl   = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  let _index = null;
  indexPromise.then(idx => { _index = idx; });

  toggleBtn.addEventListener('click', () => {
    const opening = !header.classList.contains('search-mode');
    if (opening) openSearch();
    else          closeSearch();
  });

  inputEl.addEventListener('input', () => render(query()));

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'Enter') {
      const first = resultsEl.querySelector('.sr-item');
      first?.click();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && !resultsEl.contains(e.target))
      closeSearch();
  });

  function openSearch() {
    header.classList.add('search-mode');
    inputEl.value = '';
    inputEl.focus();
    render([]);
  }

  function closeSearch() {
    header.classList.remove('search-mode');
    resultsEl.hidden = true;
  }

  function query() {
    const q = inputEl.value.trim();
    if (!_index || q.length < 2) return [];
    const lower = q.toLowerCase();
    return _index.filter(r =>
      r.tile.name.toLowerCase().includes(lower) ||
      r.tile.details?.description?.toLowerCase().includes(lower) ||
      r.displayPath.toLowerCase().includes(lower)
    ).slice(0, 9);
  }

  function render(results) {
    if (!results.length) { resultsEl.hidden = true; return; }
    resultsEl.innerHTML = results.map((r, i) => `
      <div class="sr-item" data-i="${i}">
        <span class="sr-dot" style="background:${r.tile.color}"></span>
        <div class="sr-text">
          <span class="sr-name">${esc(r.tile.name)}</span>
          <span class="sr-path">${esc(r.displayPath)}</span>
        </div>
      </div>`).join('');
    resultsEl.hidden = false;
    resultsEl.querySelectorAll('.sr-item').forEach(el => {
      el.addEventListener('click', () => {
        closeSearch();
        onNavigate(results[+el.dataset.i]);
      });
    });
  }

  return { close: closeSearch };
}

function esc(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
