/**
 * validate-data.js
 * Validates all Datenatlas taxonomy JSON files against the schema.
 * Usage: node scripts/validate-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Vocabulary code sets — loaded from shared vocabulary.json
// ---------------------------------------------------------------------------
const _vocabRaw = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '../public/data/vocabulary.json'), 'utf8'
));
const VOCAB = Object.fromEntries(
  Object.entries(_vocabRaw)
    .filter(([, items]) => Array.isArray(items))
    .map(([key, items]) => [key, new Set(items.map(i => i.code))])
);

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const DATA_DIR = path.resolve(__dirname, '../public/data');

// Openness-class colors — reserved for the openness indicator, must NEVER be
// used as a tile color (see CLAUDE.md). Derived from vocabulary.json.
const RESERVED_COLORS = new Set(
  (_vocabRaw.openness || []).map(o => (o.color || '').toLowerCase()).filter(Boolean)
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isHexColor(v) {
  return typeof v === 'string' && HEX_COLOR_RE.test(v);
}

// Issue collectors
function makeIssues() {
  return { errors: [], warnings: [] };
}

function error(issues, msg) {
  issues.errors.push('  ✗ ' + msg);
}

function warn(issues, msg) {
  issues.warnings.push('  ⚠ ' + msg);
}

// ---------------------------------------------------------------------------
// Validate main.json
// ---------------------------------------------------------------------------
function validateMain(filePath) {
  const issues = makeIssues();
  let data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    issues.errors.push('  ✗ Invalid JSON: ' + e.message);
    return { issues, count: 0 };
  }

  if (!Array.isArray(data)) {
    error(issues, 'Root must be an array');
    return { issues, count: 0 };
  }

  data.forEach((entry, i) => {
    const loc = `entry[${i}] (id="${entry.id || ''}")`;
    if (!isNonEmptyString(entry.id))          error(issues, `${loc}: id must be a non-empty string`);
    if (entry.level !== 1)                     error(issues, `${loc}: level must be 1, got ${JSON.stringify(entry.level)}`);
    if (!isNonEmptyString(entry.name))         error(issues, `${loc}: name must be a non-empty string`);
    if (!isHexColor(entry.color))              error(issues, `${loc}: color must be a hex color (#rrggbb), got "${entry.color}"`);
    else if (RESERVED_COLORS.has(entry.color.toLowerCase()))
      error(issues, `${loc}: color "${entry.color}" is a reserved openness-indicator color`);
    if (!isNonEmptyString(entry.subFile))      error(issues, `${loc}: subFile must be a non-empty string`);
    if (!isNonEmptyString(entry.description))  error(issues, `${loc}: description must be a non-empty string`);
  });

  return { issues, count: data.length };
}

// ---------------------------------------------------------------------------
// Validate a single tile (any level)
// ---------------------------------------------------------------------------
function validateTileBase(tile, issues) {
  const loc = `tile (id="${tile.id || ''}", level=${tile.level})`;
  if (!isNonEmptyString(tile.id))    error(issues, `${loc}: id must be a non-empty string`);
  if (typeof tile.level !== 'number' || tile.level < 1 || tile.level > 6)
    error(issues, `${loc}: level must be a number 1–6, got ${JSON.stringify(tile.level)}`);
  if (!isNonEmptyString(tile.name))  error(issues, `${loc}: name must be a non-empty string`);
  if (!isHexColor(tile.color))       error(issues, `${loc}: color must be a hex color (#rrggbb), got "${tile.color}"`);
  else if (RESERVED_COLORS.has(tile.color.toLowerCase()))
    error(issues, `${loc}: color "${tile.color}" is a reserved openness-indicator color and must not be used as a tile color`);
}

// ---------------------------------------------------------------------------
// Validate L4 details object
// ---------------------------------------------------------------------------
function validateL4Details(tile, issues) {
  const id = tile.id || '?';
  const d = tile.details;

  if (!d || typeof d !== 'object') {
    error(issues, `L4 "${id}": missing details object`);
    return;
  }

  // description
  if (!isNonEmptyString(d.description))
    error(issues, `L4 "${id}": details.description must be a non-empty string`);

  // openness
  if (!d.openness || typeof d.openness !== 'object') {
    error(issues, `L4 "${id}": details.openness is missing`);
  } else {
    if (!VOCAB.openness.has(d.openness.class))
      error(issues, `L4 "${id}": details.openness.class "${d.openness.class}" not in ${[...VOCAB.openness].join(', ')}`);
    if (!isNonEmptyString(d.openness.label))
      error(issues, `L4 "${id}": details.openness.label must be a non-empty string`);
    if (!isNonEmptyString(d.openness.explanation))
      error(issues, `L4 "${id}": details.openness.explanation must be a non-empty string`);
  }

  // theme
  if (!d.theme || typeof d.theme !== 'object') {
    error(issues, `L4 "${id}": details.theme is missing`);
  } else if (!VOCAB.theme.has(d.theme.code)) {
    error(issues, `L4 "${id}": details.theme.code "${d.theme.code}" not in ${[...VOCAB.theme].join(', ')}`);
  }

  // object
  if (!d.object || typeof d.object !== 'object') {
    error(issues, `L4 "${id}": details.object is missing`);
  } else if (!VOCAB.object.has(d.object.code)) {
    error(issues, `L4 "${id}": details.object.code "${d.object.code}" not in ${[...VOCAB.object].join(', ')}`);
  }

  // granularity
  if (!d.granularity || typeof d.granularity !== 'object') {
    error(issues, `L4 "${id}": details.granularity is missing`);
  } else if (!VOCAB.granularity.has(d.granularity.code)) {
    error(issues, `L4 "${id}": details.granularity.code "${d.granularity.code}" not in ${[...VOCAB.granularity].join(', ')}`);
  }

  // format
  if (!Array.isArray(d.format) || d.format.length === 0) {
    error(issues, `L4 "${id}": details.format must be a non-empty array`);
  } else {
    d.format.forEach((f, fi) => {
      if (!f || typeof f !== 'object' || !VOCAB.format.has(f.code))
        error(issues, `L4 "${id}": details.format[${fi}].code "${f && f.code}" not in ${[...VOCAB.format].join(', ')}`);
    });
  }

  // license
  if (!d.license || typeof d.license !== 'object') {
    error(issues, `L4 "${id}": details.license is missing`);
  } else if (!VOCAB.license.has(d.license.code)) {
    error(issues, `L4 "${id}": details.license.code "${d.license.code}" not in ${[...VOCAB.license].join(', ')}`);
  }

  // relevance
  if (typeof d.relevance !== 'number' || d.relevance < 1 || d.relevance > 5)
    error(issues, `L4 "${id}": details.relevance must be a number 1–5, got ${JSON.stringify(d.relevance)}`);

  // processes
  if (!Array.isArray(d.processes) || d.processes.length === 0) {
    error(issues, `L4 "${id}": details.processes must be a non-empty array`);
  } else {
    d.processes.forEach((p, pi) => {
      if (!p || typeof p !== 'object') {
        error(issues, `L4 "${id}": details.processes[${pi}] must be an object`);
      } else {
        if (!isNonEmptyString(p.method))
          error(issues, `L4 "${id}": details.processes[${pi}].method must be a non-empty string`);
        if (!isNonEmptyString(p.description))
          error(issues, `L4 "${id}": details.processes[${pi}].description must be a non-empty string`);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Recursively walk all tiles in a sector file
// Returns { l2Count, l3Count, l4Count }
// ---------------------------------------------------------------------------
function walkTiles(nodes, issues) {
  let l2 = 0, l3 = 0, l4 = 0;

  for (const tile of nodes) {
    // Base field validation for every tile
    validateTileBase(tile, issues);

    const level = tile.level;

    if (level === 2) l2++;
    if (level === 3) l3++;
    if (level === 4) {
      l4++;
      validateL4Details(tile, issues);
    }

    // Recurse into children
    if (Array.isArray(tile.children) && tile.children.length > 0) {
      const sub = walkTiles(tile.children, issues);
      l2 += sub.l2Count;
      l3 += sub.l3Count;
      l4 += sub.l4Count;
    }

    // Structural rules
    if (level === 3) {
      const l4Children = (tile.children || []).filter(c => c.level === 4);
      if (l4Children.length < 3) {
        warn(issues, `L3 "${tile.id}" has only ${l4Children.length} L4 children (min: 3)`);
      }
    }

    if (level === 2) {
      const l3Children = (tile.children || []).filter(c => c.level === 3);
      if (l3Children.length < 1) {
        warn(issues, `L2 "${tile.id}" has no L3 children (min: 1)`);
      }
    }
  }

  return { l2Count: l2, l3Count: l3, l4Count: l4 };
}

// ---------------------------------------------------------------------------
// Validate a sector_*.json file
// ---------------------------------------------------------------------------
function validateSector(filePath) {
  const issues = makeIssues();
  let data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    issues.errors.push('  ✗ Invalid JSON: ' + e.message);
    return { issues, l2Count: 0, l3Count: 0, l4Count: 0 };
  }

  // Sector files are objects with { sectorId, children }
  let topLevelNodes;
  if (Array.isArray(data)) {
    topLevelNodes = data;
  } else if (data && Array.isArray(data.children)) {
    topLevelNodes = data.children;
  } else {
    error(issues, 'Expected root to be an array or { sectorId, children } object');
    return { issues, l2Count: 0, l3Count: 0, l4Count: 0 };
  }

  const counts = walkTiles(topLevelNodes, issues);
  return { issues, ...counts };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  console.log('Validating Datenatlas taxonomy data...\n');

  let totalFiles = 0;
  let totalL4 = 0;
  let totalWarnings = 0;
  let totalErrors = 0;

  // --- main.json ---
  const mainPath = path.join(DATA_DIR, 'main.json');
  const mainResult = validateMain(mainPath);
  totalFiles++;
  totalErrors += mainResult.issues.errors.length;
  totalWarnings += mainResult.issues.warnings.length;

  const mainHasIssues = mainResult.issues.errors.length + mainResult.issues.warnings.length > 0;
  const mainMark = mainResult.issues.errors.length > 0 ? '✗' : (mainResult.issues.warnings.length > 0 ? '⚠' : '✓');
  console.log(`${mainMark} main.json — ${mainResult.count} sectors`);
  [...mainResult.issues.errors, ...mainResult.issues.warnings].forEach(m => console.log(m));

  // --- sector_*.json files ---
  const sectorFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.match(/^sector_.*\.json$/))
    .sort()
    .map(f => path.join(DATA_DIR, f));

  for (const filePath of sectorFiles) {
    const fileName = path.basename(filePath);
    const result = validateSector(filePath);

    totalFiles++;
    totalL4 += result.l4Count;
    totalErrors += result.issues.errors.length;
    totalWarnings += result.issues.warnings.length;

    const mark = result.issues.errors.length > 0 ? '✗' : (result.issues.warnings.length > 0 ? '⚠' : '✓');
    console.log(
      `${mark} ${fileName} — ` +
      `${result.l2Count} L2 types, ` +
      `${result.l3Count} L3 activities, ` +
      `${result.l4Count} L4 data types`
    );
    [...result.issues.errors, ...result.issues.warnings].forEach(m => console.log(m));
  }

  // --- Global id uniqueness across all sector files ---
  const idFirst = new Map();
  const dupes = [];
  for (const filePath of sectorFiles) {
    const fileName = path.basename(filePath);
    let data;
    try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { continue; }
    const nodes = Array.isArray(data) ? data : (data.children ?? []);
    const walk = n => {
      if (n && n.id != null) {
        if (idFirst.has(n.id)) dupes.push(`id "${n.id}" doppelt (${idFirst.get(n.id)} & ${fileName})`);
        else idFirst.set(n.id, fileName);
      }
      (n.children ?? []).forEach(walk);
    };
    nodes.forEach(walk);
  }
  if (dupes.length) {
    console.log(`\n✗ ${dupes.length} doppelte IDs:`);
    dupes.slice(0, 50).forEach(d => console.log('  ✗ ' + d));
    if (dupes.length > 50) console.log(`  … und ${dupes.length - 50} weitere`);
    totalErrors += dupes.length;
  }

  // --- Content quality report ---
  // Not counted as warnings: these are editorial debt, not schema violations,
  // and the target of "0 warnings" should stay reachable. Reported so the debt
  // is visible and measurable instead of silently accumulating.
  {
    const byText = new Map();
    let short = 0, total = 0;
    for (const file of sectorFiles) {          // absolute paths already
      let data;
      try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
      catch { continue; }
      (function walk(n) {
        if (n.level === 4) {
          total++;
          const e = (n.details?.openness?.explanation ?? '').trim();
          const words = e ? e.split(/\s+/).length : 0;
          if (words < 5) short++;
          byText.set(e, (byText.get(e) ?? 0) + 1);
        }
        (n.children ?? []).forEach(walk);
      })({ children: data.children ?? [] });
    }
    const reused = [...byText.values()].filter(v => v > 1).reduce((a, b) => a + b, 0);
    const pct = n => total ? (n / total * 100).toFixed(0) : '0';
    console.log(
      `\nInhaltsqualität (Hinweis, keine Warnungen):\n` +
      `  Öffnungsbegründungen unter 5 Wörtern: ${short} (${pct(short)} %)\n` +
      `  mehrfach verwendete Begründungstexte: ${reused} Knoten (${pct(reused)} %)`
    );
  }

  // --- Summary ---
  console.log(
    `\nSummary: ${totalFiles} files, ${totalL4} L4 data types, ` +
    `${totalWarnings} warnings, ${totalErrors} errors`
  );

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
