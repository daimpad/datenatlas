# Datenatlas – CLAUDE.md

## Project Overview

Datenatlas is an isometric canvas-based data taxonomy explorer built with vanilla JS + Vite. It visualizes public data types across sectors of German society using a four-level hierarchy rendered as isometric tiles.

**Live URL**: Deployed to GitHub Pages via the `gh-pages` branch.
**Dev branch**: `claude/datenatlas-isometric-explorer-gmnfV`

---

## Architecture

```
src/
  main.js         — app bootstrap, navigation, breadcrumb, onboarding modal
  renderer.js     — isometric tile engine (canvas-based)
  style.css       — CSS variables, layout, modal styles
public/
  data/           — taxonomy JSON files (one per sector + main.json)
  fonts/          — local font assets
index.html        — single-page shell
scripts/
  validate-data.js — data validator (run before every commit)
```

**Build**: `npm run build` → `dist/`  
**Dev server**: `npm run dev`

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

| File | Sektor | L1-Color | L2-Color | L3-Color | L4-Color |
|------|--------|----------|----------|----------|----------|
| `sector_staat.json` | Staat & Verwaltung | `#1e5799` | `#2980b9` | `#3498db` | `#2471a3` |
| `sector_wirtschaft.json` | Wirtschaft | `#2c3e50` | `#d35400` | `#e67e22` | `#ca6f1e` |
| `sector_wissenschaft.json` | Wissenschaft & Forschung | `#4527a0` | `#4527a0` | `#5e35b1` | `#3d1a87` |
| `sector_zivilgesellschaft.json` | Zivilgesellschaft | `#6d28d9` | `#6d28d9` | `#7c3aed` | `#6d28d9` |
| `sector_medien.json` | Medien und Kultur | `#be185d` | `#be185d` | `#db2777` | `#9d174d` |
| `sector_religion.json` | Religionsgemeinschaften | `#134e4a` | `#1a6b65` | `#0f766e` | `#0d5c57` |
| `sector_bildung.json` | Bildung | `#b45309` | `#b45309` | `#d97706` | `#92400e` |

**Inaktive Dateien** (existieren, sind aber nicht in main.json referenziert):
`sector_behoerde.json`, `sector_forschung.json`,
`sector_gesundheit.json`, `sector_infrastruktur.json`, `sector_kommunen.json`, `sector_ngo.json`

**CRITICAL**: Sector colors must NEVER be `#27ae60`, `#d4a017`, or `#c0392b` — those are reserved for openness indicators.

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
    ]
  }
}
```

**Common mistakes to avoid**:
- Do NOT use `"openness": { "code": "OP_01" }` — must be `"class"` not `"code"`
- Do NOT use `"formats": [...]` — must be `"format"` (singular)
- Do NOT omit the `"details"` wrapper — all metadata goes inside it
- Do NOT use reserved openness colors as tile colors

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
- Valid vocab codes for openness, format
- No structural anomalies in hierarchy

Target: **0 warnings, 0 errors**

---

## Build & Deploy

### Local Development
```bash
npm run dev         # starts Vite dev server
npm run build       # builds to dist/
```

### Deploy to GitHub Pages (gh-pages branch)

```bash
# 1. Build
npm run build

# 2. Copy build output
cp -r dist /tmp/datenatlas-dist
cp -r public/data /tmp/datenatlas-data

# 3. Switch to gh-pages
git checkout gh-pages

# 4. Copy files to root
cp -r /tmp/datenatlas-dist/* .
mkdir -p data && cp /tmp/datenatlas-data/* data/

# 5. Commit and push
git add -A
git commit -m "Deploy: ..."
git push origin gh-pages

# 6. Return to dev branch
git checkout claude/datenatlas-isometric-explorer-gmnfV
```

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
2. Assign unique `id` values in kebab-case
3. Use the correct sector color (e.g. `#4527a0` for Wissenschaft)
4. Run validator after each batch
5. Commit before moving to the next task

**Python d4() helper** (for scripted bulk additions):

```python
C = "#4527a0"  # sector color

def d4(id, name, desc, op_cls, op_lbl, op_expl, th, ob, gr, fmts, li, rel, procs):
    return {
        "id": id, "level": 4, "name": name, "color": C,
        "details": {
            "description": desc,
            "openness": {"class": op_cls, "label": op_lbl, "explanation": op_expl},
            "theme": {"code": th}, "object": {"code": ob}, "granularity": {"code": gr},
            "format": [{"code": f[0], "label": f[1]} for f in fmts],
            "license": {"code": li}, "relevance": rel,
            "processes": [{"method": p[0], "description": p[1]} for p in procs],
        }
    }
```

---

## Current Sector Statistics

*Update this table after every expansion sprint.*

| Sektor | L2 | L3 | L4 | Ø L4/L2 |
|--------|----|----|-----|---------|
| staat | 42 | 113 | 1070 | 25,5 |
| wirtschaft | 20 | 58 | 480 | 24,0 |
| wissenschaft | 16 | 43 | 393 | 24,6 |
| zivilgesellschaft | 17 | 49 | 408 | 24,0 |
| medien & kultur | 14 | 41 | 336 | 24,0 |
| religion | 8 | 24 | 192 | 24,0 |
| bildung | 10 | 30 | 240 | 24,0 |
| **Gesamt** | **127** | **358** | **3.119** | **24,6** |

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

### Startbefehl

Wenn der Nutzer **"Nächster Sprint"** schreibt:
1. Nächsten offenen Sprint im Backlog identifizieren
2. Audit-Script ausführen und Ergebnis zeigen
3. Plan vorlegen (welche L2 werden wie erweitert)
4. Nach Bestätigung: bauen, validieren, committen, PR erstellen
5. Sprint abhaken + Statistiktabelle aktualisieren
