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

### Sector Files

| File | Sector | Color |
|------|--------|-------|
| `sector_staat.json` | Staat & Verwaltung | `#1e5799` |
| `sector_wirtschaft.json` | Wirtschaft | `#2c3e50` |
| `sector_wissenschaft.json` | Wissenschaft & Forschung | `#4527a0` |
| `sector_bildung.json` | Bildung | `#0284c7` |
| `sector_zivilgesellschaft.json` | Zivilgesellschaft | `#6d28d9` |
| `sector_medien.json` | Medien | `#be185d` |
| `sector_infrastruktur.json` | Infrastruktur | `#1a2332` |
| `sector_gesundheit.json` | Gesundheit | `#7e22ce` |

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

## Current Sector Statistics (as of last expansion)

| Sector | L2 | L3 | L4 |
|--------|----|----|-----|
| staat | 13 | 32 | 312 |
| kommunen | 9 | 24 | 266 |
| wissenschaft | 17 | 41 | 209 |
| bildung | 4 | 10 | 58 |
| medien | 6 | 18 | 92 |
| gesundheit | 4 | 8 | 46 |
| infrastruktur | 4 | 9 | 52 |
| zivilgesellschaft | 7 | 17 | 83 |
| ngo | 7 | 17 | 83 |
| wirtschaft | 4 | 7 | 40 |
| forschung | 4 | 8 | 45 |
| bildung | 4 | 10 | 58 |
| **Total** | | | **1332** |
