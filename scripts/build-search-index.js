// Builds the slim client search index from the full taxonomy source files.
// Used by the Vite plugin (dev middleware + build emit) in vite.config.js and
// runnable standalone for inspection:  node scripts/build-search-index.js
//
// The index is a BUILD ARTIFACT derived from public/data/sector_*.json — it is
// never hand-edited and never committed. Adding new data types stays unchanged:
// edit the sector JSON, run the validator, commit. The index regenerates itself.
//
// Per L4 entry (short keys keep the payload small):
//   i  id            n  name
//   s  sectorId      o  orgId        a  activityId
//   sn sectorName    on orgName      an activityName
//   c  opennessClass th themeCode    ob objectCode
//   fq updateFreq    yr availableFrom
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function buildSlimIndex(dataDir) {
  const read = f => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));

  let main;
  try { main = read('main.json'); } catch { return JSON.stringify({ entries: [] }); }

  const entries = [];
  for (const sector of main) {
    if (!sector.subFile) continue;
    let sd;
    try { sd = read(sector.subFile); } catch { continue; }
    for (const org of sd.children ?? []) {
      for (const act of org.children ?? []) {
        for (const dt of act.children ?? []) {
          const d = dt.details ?? {};
          entries.push({
            i:  dt.id,
            n:  dt.name,
            s:  sector.id,  o:  org.id,   a:  act.id,
            sn: sector.name, on: org.name, an: act.name,
            c:  d.openness?.class ?? null,
            th: d.theme?.code ?? null,
            ob: d.object?.code ?? null,
            fq: d.temporal?.update_frequency ?? null,
            yr: d.temporal?.available_from ?? null,
          });
        }
      }
    }
  }
  return JSON.stringify({ entries });
}

// CLI mode: print size summary
if (import.meta.url === `file://${process.argv[1]}`) {
  const dataDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../public/data');
  const json = buildSlimIndex(dataDir);
  const { entries } = JSON.parse(json);
  console.log(`Slim index: ${entries.length} entries, ${(Buffer.byteLength(json) / 1048576).toFixed(2)} MB`);
}
