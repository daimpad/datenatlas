import { applyOpennessColors, esc } from './utils.js';

// ── Index building ─────────────────────────────────────────────────────────────

export function buildSearchIndex(mainTiles, sectorPairs) {
  const index = [];
  const rootCrumb = { id: null, name: 'Übersicht', level: 0, tiles: mainTiles };

  for (const [sectorTile, sectorData] of sectorPairs) {
    const l2tiles    = applyOpennessColors(sectorData.children ?? []);
    const sectorCrumb = { id: sectorTile.id, name: sectorTile.name, level: 2, tiles: l2tiles };

    for (const org of sectorData.children ?? []) {
      const l3tiles  = applyOpennessColors(org.children ?? []);
      const orgCrumb = { id: org.id, name: org.name, level: 3, tiles: l3tiles };

      for (const activity of org.children ?? []) {
        const l4tiles      = applyOpennessColors(activity.children ?? []);
        const activityCrumb = { id: activity.id, name: activity.name, level: 4, tiles: l4tiles };

        for (const dataType of activity.children ?? []) {
          const tile = applyOpennessColors([dataType])[0];
          const displayPath = `${sectorTile.name} · ${org.name} · ${activity.name}`;
          index.push({
            tile,
            breadcrumb:  [rootCrumb, sectorCrumb, orgCrumb, activityCrumb],
            displayPath,
            // Precomputed lowercase blob so query() does one includes() per entry
            // instead of three toLowerCase() calls on every keystroke.
            searchText: `${tile.name} ${tile.details?.description ?? ''} ${displayPath}`.toLowerCase(),
          });
        }
      }
    }
  }

  return index;
}

// ── UI ─────────────────────────────────────────────────────────────────────────

export function initSearch({ indexPromise, getLiveIndex, onNavigate }) {
  const header    = document.getElementById('header');
  const toggleBtn = document.getElementById('search-toggle');
  const inputEl   = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');

  // Use the live (growing) index for immediate results; full index when resolved
  let _fullIndex = null;
  indexPromise.then(idx => {
    _fullIndex = idx;
    // If the search is open with a pending query, refresh now that the index is ready
    if (header.classList.contains('search-mode') && inputEl.value.trim().length >= 2) {
      render(query());
    }
  });

  function _index() {
    return _fullIndex ?? (getLiveIndex ? getLiveIndex() : []);
  }

  toggleBtn.addEventListener('click', () => {
    const opening = !header.classList.contains('search-mode');
    if (opening) openSearch();
    else          closeSearch();
  });

  let _debounce = null;
  inputEl.addEventListener('input', () => {
    clearTimeout(_debounce);
    _debounce = setTimeout(() => render(query()), 120);
  });

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

  // Open the search overlay pre-filled with `term` (used for the ?q= deep link /
  // sitelinks searchbox). Results render as soon as the index is available: the
  // indexPromise handler above re-runs the query when it resolves.
  function openWithQuery(term) {
    const q = String(term ?? '').trim();
    if (!q) return;
    openSearch();
    inputEl.value = q;
    render(query());
  }

  function closeSearch() {
    header.classList.remove('search-mode');
    resultsEl.hidden = true;
  }

  function query() {
    const q = inputEl.value.trim();
    const idx = _index();
    if (!idx.length || q.length < 2) return [];
    const lower = q.toLowerCase();
    const out = [];
    for (const r of idx) {
      // Fall back to live lowercasing for any entry built before searchText existed
      const hay = r.searchText
        ?? `${r.tile.name} ${r.tile.details?.description ?? ''} ${r.displayPath}`.toLowerCase();
      if (hay.includes(lower)) { out.push(r); if (out.length === 9) break; }
    }
    return out;
  }

  function render(results) {
    const q = inputEl.value.trim();

    // Below 2 chars: keep the dropdown hidden (also the case right after opening)
    if (q.length < 2) { resultsEl.hidden = true; resultsEl.innerHTML = ''; return; }

    // No matches: distinguish "index still loading" from a genuine empty result,
    // so the dropdown doesn't just silently vanish while the user is typing.
    if (!results.length) {
      const ready = _index().length > 0;
      resultsEl.innerHTML = `<div class="sr-empty">${
        ready ? `Keine Treffer für „${esc(q)}"` : 'Suchindex wird geladen …'
      }</div>`;
      resultsEl.hidden = false;
      return;
    }

    resultsEl.innerHTML = results.map((r, i) => `
      <div class="sr-item" data-i="${i}" data-op-class="${esc(r.tile.details?.openness?.class ?? '')}">
        <span class="sr-dot" style="background:${r.tile.color}"></span>
        <div class="sr-text">
          <span class="sr-name">${esc(r.tile.name)}</span>
          <span class="sr-path">${esc(r.displayPath)}</span>
        </div>
      </div>`).join('');
    resultsEl.hidden = false;
    resultsEl.dispatchEvent(new CustomEvent('search-rendered', { bubbles: true }));
    resultsEl.querySelectorAll('.sr-item').forEach(el => {
      el.addEventListener('click', () => {
        closeSearch();
        onNavigate(results[+el.dataset.i]);
      });
    });
  }

  return { close: closeSearch, openWithQuery };
}

