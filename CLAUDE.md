# Datenatlas – CLAUDE.md

## Project Overview

Datenatlas is an isometric canvas-based data taxonomy explorer built with vanilla JS + Vite. It visualizes public data types across sectors of German society using a four-level hierarchy rendered as isometric tiles.

**Live URL**: [datenatlas.de](https://datenatlas.de) — deployed automatically from `main` (GitHub Pages + Netcup FTP, see Build & Deploy).
**Workflow**: feature branch → PR → merge to `main`. Never commit directly to `main`.

---

## Architecture

```
src/
  main.js         — app bootstrap, navigation, breadcrumb, onboarding, index adapter
  renderer.js     — isometric tile engine (canvas-based)
  state.js        — navigation state & history
  controls.js     — pan/zoom, touch gestures, keyboard navigation
  dataLoader.js   — lazy loading of sector files and the search index
  search.js       — search (slim index) + opt-in deep search over descriptions
  modal.js        — detail sidebar and generic modal system (trap focus)
  expand.js       — data expansion tool (logic behind expand.html)
  begruendungen.js        — openness-justification editor (logic behind begruendungen.html)
  begruendungs-regeln.js  — the justification ruleset, shared with scripts/ (see Validation)
  related.js      — "Ähnliche Datensätze" (cross-sector similarity)
  export.js       — CSV export of visible L4 types
  wizard.js       — "Daten öffnen" wizard (5-step modal)
  stats.js        — openness statistics dashboard
  timeline.js     — availability curve + update frequencies
  generator.js    — Datenkombinator (32 cross-sector fusion scenarios)
  utils.js        — esc(), trapFocus(), safeUrl(), OPENNESS_COLORS
  style.css       — CSS variables, layout, modal styles
public/
  data/           — taxonomy JSON (one per sector + main.json + vocabulary.json)
  fonts/          — local font assets
  logo.svg, favicon.svg, og-image.png, site.webmanifest, robots.txt, .htaccess
index.html          — single-page shell (the map)
ueber.html          — static project description, linked from the footer
expand.html         — data expansion tool (internal)
begruendungen.html  — openness-justification editor (internal)
vite.config.js      — build plugins: search-index, minify-data-json, seo,
                      static-pages, precompress
docs/
  ueber-den-datenatlas.md — project description as a document
scripts/
  validate-data.js       — data validator (run before every commit)
  build-search-index.js  — builds the slim search index (build artifact)
  build-static-pages.js  — builds the crawlable sector/organisation pages
  build-og-image.js      — builds the 1200×630 social image
  datafix-*.mjs          — one-off data corrections (record of past runs)
```

All four HTML files are separate build inputs. The map and the project
description are indexable; both tools are `noindex`.

**Build**: `npm run build` → `dist/`  
**Dev server**: `npm run dev`

### Search index — do NOT hand-edit

`data/search-index.json` is a **build artifact** generated from the sector files;
it is never committed. Adding data types stays unchanged: edit the sector JSON,
validate, commit — the index rebuilds itself.

Format v2 keeps it small: entries are positional arrays referencing a shared
path table instead of repeating sector/org/activity as id *and* name on every
entry (1.16 MB instead of 3.00 MB). `adaptIndex()` in `main.js` restores the
entry shape that search/stats/timeline/related/generator expect — **if you change
the index format, change `adaptIndex()` and the id extraction in `expand.js` too.**

### Crawlable static pages

The canvas hides all 10.149 data types behind hash fragments, which search
engines do not index as separate URLs. `build-static-pages.js` therefore emits
**155 pages** at build time: `/sektor/<id>/` (8) and `/sektor/<id>/<org>.html`
(147). They are generated from the sector files — no maintenance, new data types
appear automatically.

Deliberately **no page per data type**: an organisation page carries ~69 data
types (~5.700 words); a data-type page would carry ~82 words — thin content that
would hurt the domain. Keep it that way when extending.

The crawlable sector outline in `index.html` links these pages rather than the
hash deep links; without that they would be reachable only via the sitemap.

---

## Data Hierarchy

```
L1  Sektor         (sector_*.json root)
L2  Organisation   (e.g. Universität, Statistisches Amt)
L3  Aktivität      (e.g. Forschungsdatenmanagement)
L4  Datentyp       (leaf node – the actual data product)
```

### Active Sector Files (main.json)

Sektoren sind konsequent nach **Trägertyp** gegliedert (wer produziert die Daten).

L1 colors are authoritative in `public/data/main.json`. L2–L4 are the intended
per-level colors — **use these when adding nodes.** Each level is a lighter or
darker variant of the sector hue; L4 is uniform per sector.

| File | Sektor | L1-Color | L2-Color | L3-Color | L4-Color |
|------|--------|----------|----------|----------|----------|
| `sector_staat.json` | Staat & Verwaltung | `#1a3461` | `#2980b9` | `#3498db` | `#2471a3` |
| `sector_wirtschaft.json` | Wirtschaft | `#1c2f3e` | `#d35400` | `#e67e22` | `#ca6f1e` |
| `sector_wissenschaft.json` | Wissenschaft & Forschung | `#2d1a6e` | `#4527a0` | `#5e35b1` | `#3d1a87` |
| `sector_zivilgesellschaft.json` | Zivilgesellschaft | `#4a1a8c` | `#6d28d9` | `#7c3aed` | `#6d28d9` |
| `sector_medien.json` | Medien | `#8b1248` | `#be185d` | `#db2777` | `#9d174d` |
| `sector_kultur.json` | Kultur | `#701a75` | `#8b1a91` | `#a21caf` | `#5c1560` |
| `sector_religion.json` | Religionsgemeinschaften | `#0a3d38` | `#1a6b65` | `#0f766e` | `#0d5c57` |
| `sector_bildung.json` | Bildung | `#b45309` | `#b45309` | `#d97706` | `#92400e` |

All eight sector files are active; there are no unreferenced leftovers.

Every tile now matches this table exactly — the legacy drift from earlier sector
layouts and the Medien→Kultur split was normalised (`scripts/datafix-colors.mjs`).
Kultur has its own palette derived from its L1 gradient instead of the pink it
inherited from Medien. Keep it that way: assign colors from this table, never by
copying a neighbouring node.

**CRITICAL**: Tile and sector colors must NEVER be `#27ae60`, `#d4a017`, or
`#c0392b` — those are reserved for openness indicators. The validator enforces
this (it caught four such tiles in `sector_medien.json`).

---

## L4 Node Format

Every L4 data type node **must** follow this exact structure (validator enforces all fields):

```json
{
  "id": "unique-kebab-case-id",
  "level": 4,
  "name": "Anzeigename des Datentyps",
  "color": "#4527a0",
  "details": {
    "description": "Beschreibung des Datensatzes...",
    "openness": {
      "class": "OP_01",
      "label": "Sofort publizierbar",
      "explanation": "Begründung der Offenheitsklasse"
    },
    "theme":       { "code": "TH_01" },
    "object":      { "code": "OB_01" },
    "granularity": { "code": "GR_01" },
    "format": [
      { "code": "FT_01", "label": "CSV" }
    ],
    "license": { "code": "LI_01" },
    "relevance": 5,
    "processes": [
      { "method": "Methode", "description": "Beschreibung der Verarbeitungsmethode" }
    ],
    "temporal": {
      "available_from": 2003,
      "update_frequency": "FQ_02"
    }
  }
}
```

`relevance` is a 1–5 scale. Every L4 node currently carries **≥ 5 processes** and
a `temporal` block (100 % coverage) — keep both when adding nodes, otherwise the
timeline and process navigation degrade.

**Common mistakes to avoid**:
- Do NOT use `"openness": { "code": "OP_01" }` — must be `"class"` not `"code"`
- Do NOT use `"formats": [...]` — must be `"format"` (singular)
- Do NOT omit the `"details"` wrapper — all metadata goes inside it
- Do NOT use reserved openness colors as tile colors
- Do NOT reuse an `id` — they must be unique **across all sector files**
- Do NOT combine `OP_03` (metadata only) with a free license (`LI_01`–`LI_03`)

---

## Vocabulary Codes

### Openness (details.openness.class)
| Code | Color | Bedeutung |
|------|-------|-----------|
| `OP_01` | `#27ae60` (green) | Sofort publizierbar |
| `OP_02` | `#d4a017` (yellow) | Nach Aufbereitung publizierbar |
| `OP_03` | `#c0392b` (red) | Nur Metadaten publizierbar |

### Theme (details.theme.code)
| Code | Thema |
|------|-------|
| `TH_01` | Gesundheit |
| `TH_02` | Bildung |
| `TH_03` | Soziales |
| `TH_04` | Wirtschaft |
| `TH_05` | Verwaltung |
| `TH_06` | Umwelt |
| `TH_07` | Finanzen |
| `TH_08` | Recht |
| `TH_09` | Natur/Biodiversität |
| `TH_10` | Wissenschaft/Technik |

### Object Type (details.object.code)
| Code | Typ |
|------|-----|
| `OB_01` | Personenbezogene Daten |
| `OB_02` | Textdokumente |
| `OB_03` | Finanzdaten |
| `OB_04` | Messungen / Sensordaten |
| `OB_05` | Geodaten |
| `OB_06` | Mediendaten |
| `OB_07` | Transaktionsdaten |
| `OB_08` | Metadaten |

### Granularity (details.granularity.code)
| Code | Granularität |
|------|-------------|
| `GR_01` | Einzelereignis / Rohdaten |
| `GR_02` | Aggregiert (zeitlich oder räumlich) |
| `GR_03` | Kleinräumig (Stadtteil / Gemeinde) |
| `GR_04` | Individuell / Mikrodaten |

**`granularity` meint die Ausweisungsebene, nicht die Erhebungsebene** — die
Ebene, auf der der *beschriebene* Datensatz existiert, nicht die, auf der
einmal erhoben wurde. „Bundesweite Vergleichsarbeiten auf Kreisebene" ist
`GR_03`, nicht `GR_02`: erhoben bundesweit, ausgewiesen kleinräumig. Der Atlas
bewertet Veröffentlichbarkeit, und dafür zählt, was man in die Hand bekommt.

Ein Vorschlag, beide Ebenen als getrennte Felder zu führen, wurde verworfen:
das wäre ein Pflichtfeld für alle 10.149 Einträge, um eine Mehrdeutigkeit zu
lösen, die eine Definition schon löst. Ein Massenlauf über den Bestand wäre
ebenfalls falsch — ein Suchmuster findet 136 `GR_03`-Einträge mit Bund/Land-
Wörtern, aber deren Beschreibungen nennen die Erhebung *und* die Ausweisung,
und das Muster kann beide nicht trennen. Genau die Verwechslung, um die es
geht, steckt im Muster selbst. Einzelfälle beim Anfassen korrigieren.

`GR_04` heißt **personenbezogene** Mikrodaten. Einzelereignisse ohne
Personenbezug (Fahrten, Buchungen, Messungen) sind `GR_01`.

### Format (details.format[].code)
| Code | Format |
|------|--------|
| `FT_01` | CSV |
| `FT_02` | JSON |
| `FT_03` | NetCDF / HDF5 |
| `FT_04` | XML |
| `FT_05` | GeoJSON |
| `FT_06` | Shapefile |

### License (details.license.code)
| Code | Lizenz |
|------|--------|
| `LI_01` | CC0 / Public Domain |
| `LI_02` | CC BY 4.0 |
| `LI_03` | Datenlizenz Deutschland |
| `LI_04` | Proprietär / Restriktiv |

### Update Frequency (details.temporal.update_frequency)
| Code | Häufigkeit |
|------|-----------|
| `FQ_01` | Echtzeit / Kontinuierlich |
| `FQ_02` | Täglich |
| `FQ_03` | Monatlich |
| `FQ_04` | Jährlich |
| `FQ_05` | Unregelmäßig |

All vocabulary codes live in `public/data/vocabulary.json` — the validator reads
them from there, so add new codes to that file first.

---

## Validation

Always validate before committing:

```bash
node scripts/validate-data.js
```

The validator checks:
- All required fields in `details` wrapper
- `openness.class` (not `.code`)
- `format` array (not `formats`)
- Valid vocab codes (from `vocabulary.json`)
- **Globally unique ids** across all sector files
- **Reserved openness colors** not used as tile or sector colors
- No structural anomalies in hierarchy

Target: **0 warnings, 0 errors**. Exits with code 1 on errors and runs on every
pull request via `.github/workflows/validate-data.yml`.

It then prints a **content-quality report** — deliberately not warnings, so the
"0 warnings" target stays reachable while the editorial debt stays visible:

```
Inhaltsqualität (Hinweis, keine Warnungen):
  Öffnungsbegründungen unter 5 Wörtern: 0 (0 %)
  mehrfach verwendete Begründungstexte: 1448 Knoten (14 %)
  Aussagen über fremde Veröffentlichungspraxis: 776
  Beschreibung widerspricht den Metadaten: 0
```

Zwei der vier Kennzahlen stehen auf null. Die **kurzen Begründungen** wurden in
vierzehn Stapeln über `scripts/apply-begruendungen.mjs` abgearbeitet (942 → 0);
die **Metadaten-Widersprüche** einzeln (8 → 0). Offen sind die 1.448 formelhaft
wiederverwendeten Texte und die 776 Praxisaussagen — beide brauchen je einen
individuell geschriebenen Satz, keinen Massenlauf.

Die Zahl 776 ist **kein Anstieg gegenüber der früher dokumentierten 41**,
sondern die erste ehrliche Messung: das alte Muster traf fast nichts. Wer die
Kennzahl weiter verschärft, wird sie erneut steigen sehen — das ist der Zweck.

Work these off with `begruendungen.html` — it has one filter per metric.
**Do not bulk-generate the justifications.** The short ones
("Haushaltsöffentlichkeit.", "Amtliche Statistik.") are terse but correct;
inflating them means inventing statutes and practice claims. The site tells
users to cite these justifications to data protection officers — a short
correct sentence beats an unsourced paragraph. The tool's prompt forbids
invented references, model output only ever lands in the input fields, and
anything with a legal reference is flagged for checking.

The third metric implements **rule 3** of the justification ruleset: a
justification must not claim that some organisation already publishes
something — nor that it does not. Both are unverifiable without research and
both go stale when the practice changes. The check is deliberately narrow (set
phrases plus a Pflicht/Modal exception, not keywords) and lives **once**, as
`claimsThirdPartyPractice()` in `src/begruendungs-regeln.js` — the validator,
the browser tool and the batch applier all import it. It used to be a copied
`PRACTICE_RE` in four places, which is exactly how it came to report 41 hits
where there were 776.

### The justification ruleset — one source

`src/begruendungs-regeln.js` holds the prompt (`RULES`), the four answer
statuses and the length target. Both consumers import it: the browser tool and
`scripts/build-begruendungs-prompt.mjs`. It used to be copy-pasted into each,
and the two copies had already drifted apart — one asked for 15–40 words and
did not know rule 8 at all. Edit the module, never a consumer.

Two of the four statuses (`unzureichend`, `widerspruechlich`) mean the model
returns the *old* text on purpose rather than speculating. Those are the
ruleset's safety valve, and in practice its most valuable output: the refusals
are what surfaced six entries whose object type contradicted their own
description. The tool shows them but does not count them as revisions.

---

## Build & Deploy

### Local Development
```bash
npm run dev         # starts Vite dev server
npm run build       # builds to dist/
```

### Deployment — automatic, no manual steps

Merging to `main` deploys. Do **not** hand-copy files to a `gh-pages` branch.

| Workflow | Purpose |
|----------|---------|
| `.github/workflows/deploy.yml` | GitHub Pages |
| `.github/workflows/deploy-netcup.yml` | Netcup via FTP (`/httpdocs/`) |
| `.github/workflows/validate-data.yml` | validator + build (PR and push) |
| `.github/workflows/codeql.yml` | security analysis |

The build also emits `.br`/`.gz` siblings for large text assets
(`precompress` plugin); `public/.htaccess` serves them on Apache/Netcup by
`Accept-Encoding`. GitHub Pages ignores them and gzips on its own.

### SEO artifacts

The `seo` plugin generates from `main.json` at build time: JSON-LD
(`WebSite` incl. `SearchAction` for the `?q=` deep link, `Organization`,
`DataCatalog` with the 8 sectors as `Dataset`), a screen-reader/crawler-readable
sector outline (the canvas has no readable content), and `sitemap.xml`
(157 URLs incl. the static pages). Adding or renaming a sector requires no edits
here — the pages, the outline and the sitemap all follow `main.json`.

Each sector `Dataset` declares a real `distribution` pointing at its public JSON
file plus `license` and `isAccessibleForFree`, and its `url` points at the static
sector page. **Keep it that way**: a `Dataset` without a reachable distribution,
or pointing at a hash fragment that is no page, is misleading structured data.

Two rules the Search Console taught us the hard way:

- Catalog membership is `includedInDataCatalog`, **not** `isPartOf`. `isPartOf`
  is inherited from `CreativeWork` and expects a `CreativeWork`; pointing it at
  a `DataCatalog` produced *„Ungültiger Objekttyp für Feld isPartOf"*.
- **Every `@id` reference carries its `@type`.** A bare `{"@id": …}` pointing at
  a sibling — or worse, at the enclosing node — is not reliably resolved by
  Google's parser, which then reports *„falscher Namensraum"*. `isPartOf` with a
  typed `WebSite` (as in `ueber.html` and the static pages) was never the
  problem; the untyped back-references were.

### Analytics

GoatCounter, cookiefrei. The snippet lives once in `scripts/analytics.js` and
reaches the pages two ways: the `analytics()` plugin injects it into
`index.html` and `ueber.html`, `build-static-pages.js` writes it into the 155
generated pages. **157 of 160 built HTML files carry it** — the three without
are `expand.html`, `begruendungen.html` (internal tools, `noindex`) and the
Google verification file (plain text). Change the endpoint in the module, never
in a page.

`apply: 'build'` keeps the dev server out of the statistics.

**The canvas is not counted beyond the first view.** All map navigation is hash
based (`#medien/zdf`), and `count.js` records one pageview on load. So the
numbers answer "which of the 157 URLs get found", not "how is the map used".
Counting hash changes would need an explicit `goatcounter.count({path})` call
on navigation — a deliberate decision, not an oversight.

The repository is licensed under **MPL-2.0** (see `LICENSE`) — README,
`ueber.html` and `docs/` claimed MIT until this was corrected. Check `LICENSE`
before restating the licence anywhere.

---

## Renderer Notes

Tile dimensions (×1.5 scale): W=240, H=120, D=42  
Dimmed tile color (Wissenschaft): `#c8b8e8`  
CSS accent color: `--accent: #6200a8`  
Footer brand: `nozilla | bits & bytes mit ❤`

---

## Adding New Data

When expanding a sector JSON:

1. Use the `d4()` helper pattern (see below) to avoid format mistakes
2. Assign `id` values in kebab-case, unique **across all sector files**
3. Use the L4 color of that sector from the table above (e.g. `#3d1a87` for Wissenschaft)
4. Give every node ≥ 5 processes and a `temporal` block
5. Run validator after each batch
6. Commit before moving to the next task

There is no index to rebuild by hand — `search-index.json` regenerates on build.

**Python d4() helper** (for scripted bulk additions):

```python
C = "#3d1a87"  # L4 color of the sector being extended

def d4(id, name, desc, op_cls, op_lbl, op_expl, th, ob, gr, fmts, li, rel, procs,
       year=2015, freq="FQ_04"):
    return {
        "id": id, "level": 4, "name": name, "color": C,
        "details": {
            "description": desc,
            "openness": {"class": op_cls, "label": op_lbl, "explanation": op_expl},
            "theme": {"code": th}, "object": {"code": ob}, "granularity": {"code": gr},
            "format": [{"code": f[0], "label": f[1]} for f in fmts],
            "license": {"code": li}, "relevance": rel,
            "processes": [{"method": p[0], "description": p[1]} for p in procs],
            "temporal": {"available_from": year, "update_frequency": freq},
        }
    }
```

---

## Current Sector Statistics

*Update this table after every expansion sprint.*

| Sektor | L2 | L3 | L4 | Ø L4/L2 |
|--------|----|----|-----|---------|
| staat | 46 | 125 | 3174 | 69,0 |
| wirtschaft | 23 | 67 | 1587 | 69,0 |
| wissenschaft | 19 | 52 | 1311 | 69,0 |
| zivilgesellschaft | 20 | 58 | 1386 | 69,3 |
| medien | 12 | 35 | 828 | 69,0 |
| kultur | 5 | 15 | 345 | 69,0 |
| religion | 10 | 30 | 690 | 69,0 |
| bildung | 12 | 36 | 828 | 69,0 |
| **Gesamt** | **147** | **418** | **10.149** | **69,0** |

---

## Expansion Roadmap

### Qualitätsziel

Jeder L2-Knoten soll mindestens erreichen:
- **3 L3-Aktivitäten** (was tut diese Organisation?)
- **5 L4-Datentypen pro L3** → 15 L4 pro L2 minimum
- **Kein L4 ohne echte Datenquelle** (konkrete Behörde, API, Register, Studie)
- **Openness realistisch**: OP_01 nur wenn tatsächlich publizierbar

### Sprint-Format

Jeder Sprint = ein Sektor = ein PR. Ablauf:

```
1. AUDIT   — python3 -c "..." um L4-Dichte je L2 zu messen
2. PLAN    — Liste welche L2 < 15 L4 haben + welche L2 fehlen
3. BUILD   — Python-Skript schreiben, ausführen
4. VALID   — node scripts/validate-data.js → 0 errors
5. COMMIT  — git add / commit / push
6. PR      — mcp__github__create_pull_request
7. UPDATE  — Statistik-Tabelle oben aktualisieren + Sprint abhaken
```

### L4-Generierungsprinzipien

Für jeden L2-Knoten (Organisationstyp) systematisch fragen:
- Was **erhebt** diese Organisation? (Primärdaten)
- Was **produziert** sie als Output? (Berichte, Statistiken)
- Was ist **gesetzlich zur Veröffentlichung** verpflichtet?
- Was ist **für andere Sektoren** wertvoll? (Cross-Sektor-Relevanz)

### Sprint-Backlog

Priorität nach Ø L4/L2 (niedrig = dringend). Nach Abschluss abhaken und Statistiktabelle aktualisieren.

**Phase 1 — Tiefenausbau (bestehende L2 auf ≥ 15 L4 bringen)**

- [x] **S-01** `zivilgesellschaft` — Alle 16 L2 auf ≥ 15 L4 (aktuell Ø 9,0) → +96 L4 ✓ (PR #35)
- [x] **S-02** `wirtschaft` — Legacy-Cleanup (21→13 L2) + alle auf ≥15 L4 → +42 L4, Farbfixes ✓ (PR #36)
- [x] **S-03** `wissenschaft` — Alle 16 L2 auf ≥ 15 L4 → +49 L4 ✓ (PR #37)
- [x] **S-04** `medien` — Alle 12 L2 auf ≥ 15 L4 (Tief+Breit kombiniert) → +95 L4 ✓ (PR #38)

**Phase 2 — Breitenausbau (fehlende L2-Knoten ergänzen)**

- [x] **S-05** `medien` — 7 → 12 L2: Deutschlandradio, ZDF Digital, ARD Online, dpa, Landesmedienanstalten ✓ (PR #38)
- [x] **S-06** `staat` — Tiefenausbau (29→33 L2, alle ≥15 L4) + Breit: +4 L2 (Justiz, Finanzbehörden, Zoll, Nachrichtendienste) → 516→643 L4 ✓ (PR #39)
- [x] **S-07** `wirtschaft` — Breitenausbau: +3 L2 (Versicherungswirtschaft, Unternehmensdienstleistungen, Pharmaindustrie) → 13→16 L2, 208→253 L4 ✓ (PR #40)
- [x] **S-08** `zivilgesellschaft` — Audit: ziviz-16 vollständig + Breit: +2 L2 (Wohlfahrtsverbände, Stiftungen) → 16→18 L2, 240→270 L4 ✓ (PR #42)

**Phase 3 — Qualitätspass**

- [x] **S-09** Alle Sektoren — Cross-Sektor-Konsistenz: 636 Farbfehler, 4 interne Duplikate, 9 cross-sektorale ID-Duplikate behoben ✓
- [x] **S-10** Alle Sektoren — Openness-Review: 3 OP_03+Freilizenz-Widersprüche behoben; OB_01+OP_01 (364 aggregierte Statistiken) geprüft und korrekt ✓
- [x] **S-11** `religion` — Breitenausbau: +3 L2 (Orthodoxe Kirchen, Alevitische Gemeinde, Kirchliche Hilfswerke) → 5→8 L2, 75→120 L4 ✓ (PR #41)

**Phase 4 — Feature & Qualitäts-Sprints**

Sprint-Format (Features):
```
1. DESIGN  — UI-Skizze / Datenfluss beschreiben
2. BUILD   — Implementierung in src/
3. TEST    — Dev-Server, golden path + edge cases
4. COMMIT  — git add / commit / push
5. PR      — mcp__github__create_pull_request
```

- [x] **F-01** Statistik-Dashboard — Öffnungsklassen-Verteilung als Balkendiagramm pro Sektor (Canvas/SVG, Vanilla JS, Button neben Suche/Filter) ✓
- [x] **F-02** Export-Funktion — CSV/JSON-Download der sichtbaren L4 (Browser Blob API, kein Backend) ✓
- [x] **F-03** Cross-Sektor "Ähnliche Datensätze" — In L4-Detail-Sidebar: bis zu 5 L4 aus anderen Sektoren mit gleichem theme/object-Code ✓
- [x] **F-04** Wizard-Optimierung — Kontext-Einstieg aus L4-Detail, sektorspezifische Lizenzempfehlungen, Ergebnis-Checkliste ✓
- [x] **F-05** Kommunen Tiefenausbau — +6 L2 in sector_staat.json (Stadtverwaltung, Bürgeramt, Schulamt, Kämmerei, Jugendamt, Sozialamt) je 15 L4 → 36→42 L2, 690→780 L4 ✓
- [x] **F-06** Cross-Sektor-Fusion-Generator — 12 Szenarien, Neo-Brutalism Button + Modal, Slot-Machine-Animation, Navigation zu L4-Datentypen ✓
- [x] **F-07** Bildung-Sektor aktiviert — 8 L2 × 3 L3 × 6 L4 = 144 L4; Qualitäts- und Accessibility-Pass (trapFocus, WCAG, SEO, Security Headers) ✓
- [x] **S-A** Tiefenausbau staat — alle 42 L2 auf ≥24 L4 (Ø 18,6→25,5), +290 L4 (780→1070) ✓
- [x] **S-B** Tiefenausbau wirtschaft + wissenschaft — alle 30 L2 auf ≥24 L4, +167 L4 (wirtschaft 292→384, wissenschaft 270→345) ✓
- [x] **S-C** Tiefenausbau medien + zivilgesellschaft + religion + bildung — alle 44 L2 auf ≥24 L4, +212 L4 (medien 199→264, zivil 357→408, religion 144→192, bildung 144→192) ✓
- [x] **S-D** Breitenausbau wirtschaft + wissenschaft + medien + bildung — +11 L2 je 3 L3 × 8 L4 = +264 L4 (wirtschaft 16→20 L2, wissenschaft 14→16 L2, medien 11→14 L2, bildung 8→10 L2) ✓
- [x] **S-E** Tiefenausbau II — alle 127 L2 auf ≥30 L4 (+723 L4), 3.119→3.842 L4 gesamt ✓ (PR #76)
- [x] **S-F** Tiefenausbau III — alle 127 L2 auf ≥36 L4 (+746 L4), 3.842→4.588 L4 gesamt ✓
- [x] **S-G** Breitenausbau — +20 L2 (staat+4, wirtschaft+3, wissenschaft+3, zivilgesellschaft+3, medien+3, religion+2, bildung+2), +720 L4, 4.588→5.308 ✓
- [x] **S-H** Tiefenausbau IV — alle 147 L2 auf ≥42 L4, +871 L4, 5.308→6.179 ✓
- [x] **S-I** Qualitätspass Processes — alle 1.765 L4-Nodes mit <2 Prozesseinträgen auf ≥2 gebracht ✓
- [x] **S-J** Tiefenausbau V — alle 147 L2 auf ≥48 L4, +879 L4, 6.179→7.058 ✓
- [x] **S-K** Qualitätspass Processes II — alle 7.048 L4-Nodes auf ≥3 Prozesseinträge gebracht ✓
- [x] **S-L** Tiefenausbau VI — alle 147 L2 auf ≥54 L4, +882 L4, 7.058→7.940 ✓
- [x] **S-M** Qualitätspass Processes IV — alle 7.940 L4-Nodes auf ≥4 Prozesseinträge gebracht ✓
- [x] **S-N** Tiefenausbau VII — alle 147 L2 auf ≥60 L4, +921 L4, 7.940→8.861 ✓
- [x] **S-O** Qualitätspass Processes V — alle 8.861 L4-Nodes auf ≥5 Prozesseinträge gebracht ✓
- [x] **S-P** Tiefenausbau VIII — alle 147 L2 auf ≥69 L4. religion (PR #94), bildung (PR #96), medien (PR #97), wissenschaft (PR #98), zivilgesellschaft (PR #99), wirtschaft (PR #100), staat (2766→3174, +408). Gesamt 8.861→10.149 L4 ✓

### Startbefehl

Wenn der Nutzer **"Nächster Sprint"** schreibt:
1. Nächsten offenen Sprint im Backlog identifizieren
2. Audit-Script ausführen und Ergebnis zeigen
3. Plan vorlegen (welche L2 werden wie erweitert)
4. Nach Bestätigung: bauen, validieren, committen, PR erstellen
5. Sprint abhaken + Statistiktabelle aktualisieren
