# ◈ Datenatlas

> **Interaktiver Explorer der Open-Data-Landschaft der Zivilgesellschaft**

Datenatlas visualisiert, welche Daten NGOs und zivilgesellschaftliche Organisationen besitzen — und wie offen diese Daten potenziell sind. Auf einer isometrischen Karte navigiert man von gesellschaftlichen Sektoren bis zu einzelnen Datentypen, erhält Öffnungsklassen-Bewertungen und kann verknüpfte Prozesse cross-sektoral erkunden.

```
◈ Datenatlas
  └── NGO                        (Sektor · Ebene 1)
        └── Soziale Dienste            (Organisation · Ebene 2)
              └── Beratung & Hilfeplanung    (Aktivität · Ebene 3)
                    └── Beratungsstatistik         (Datentyp · Ebene 4 · OP_02 Gelb)
                          └── Beratung & Sozialarbeit    (Prozess · Ebene 5)
                                └── Beratungsstatistik NGO     (Cross-Sektor · Ebene 6)
```

---

## Features

| Feature | Beschreibung |
|---|---|
| **Isometrische Karte** | Canvas-basierter Renderer mit Painter's Algorithm, Viewport-Culling und Hover-Highlighting |
| **4+∞-Ebenen-Navigation** | Sektor → Organisation → Aktivität → Datentyp → Prozess → Cross-Sektor-Datentypen → … |
| **Öffnungsklassen-Farbcode** | Ebene-4-Kacheln leuchten in Grün / Gelb / Rot nach Öffnungsklasse |
| **Persistente Legende** | Farbkodierung immer sichtbar unten rechts auf der Karte |
| **Prozess-Navigation** | L4-Datentypen → L5-Prozesse → L6-Cross-Sektor-Datentypen → zurück zu L5 … (unbegrenzt) |
| **Volltext-Suche** | Alle Sektoren werden im Hintergrund vorgeladen; Suche nach Name, Beschreibung, Pfad |
| **Öffnungsklasse-Filter** | Datentypen nach Grün / Gelb / Rot filtern; nicht passende Kacheln als Ghost |
| **Detail-Sidebar** | Pro Datentyp: Öffnungsklasse-Pill, Metadaten-Chips (Thema, Objekt, Format, Lizenz), Prozessbezüge |
| **Zoom-Animation** | Drill-Down zoomt via CSS-Transform in Richtung der geklickten Kachel |
| **Onboarding** | Erster-Besuch-Overlay mit Farbcode-Erklärung und Bedienungs-Hints, localStorage-persistent |
| **Fehlerbehandlung** | Overlay mit Retry-Button bei fehlgeschlagenem Datenladen |

---

## Sektoren & Datentiefe

Aktuell sind **6 Sektoren** enthalten:

| Sektor | Farbe | Schwerpunkt |
|---|---|---|
| **NGO** | `#2ecc71` | Wohlfahrt, Umwelt, Migration, Gesundheit, Sport — 7 Organisationstypen, 28+ Datentypen |
| **Behörde** | `#3498db` | Meldewesen, Ordnungsamt, Statistik |
| **Wirtschaft** | `#e67e22` | Handel, Finanzen, Personalwesen |
| **Forschung** | `#9b59b6` | Hochschulen, Studien, Umfragen |
| **Gesundheit** | `#e74c3c` | Kliniken, Praxen, Labore |
| **Infrastruktur** | `#1abc9c` | Energie, Wasser, Mobilität |

---

## Öffnungsklassen

Jeder Datentyp (Ebene 4) trägt eine von drei Öffnungsklassen:

| Klasse | Code | Kachelfarbe | Bedeutung |
|---|---|---|---|
| Grün | `OP_01` | `#27ae60` | Sofort publizierbar — kein oder minimaler Aufbereitungsbedarf |
| Gelb | `OP_02` | `#d4a017` | Nach Aufbereitung publizierbar — Anonymisierung / Aggregation nötig |
| Rot | `OP_03` | `#c0392b` | Nur Metadaten — Inhalt zu sensibel für Veröffentlichung |

---

## Schnellstart

### Voraussetzungen

- Node.js ≥ 18
- npm ≥ 9

### Installation & Entwicklung

```bash
git clone https://github.com/daimpad/datenatlas.git
cd datenatlas
npm install
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

### Produktionsbuild

```bash
npm run build     # Ausgabe in dist/
npm run preview   # Lokale Vorschau des Builds
```

---

## Architektur

```
datenatlas/
├── index.html                  # App-Shell, Onboarding, Filter-Bar, Legende
├── src/
│   ├── main.js                 # Orchestrierung: Navigation, Animation, Filter, Suche
│   ├── renderer.js             # Canvas-Renderer (isometrisch, Culling, Dimming)
│   ├── controls.js             # Maus- und Touch-Events (Pan, Click, Hover)
│   ├── modal.js                # Detail-Sidebar (Öffnen/Schließen/Befüllen)
│   ├── dataLoader.js           # JSON-Fetch für main.json und Sektordateien
│   ├── search.js               # Suchindex-Aufbau + Such-UI
│   ├── utils.js                # applyOpennessColors(), OPENNESS_COLORS, esc(), safeColor()
│   ├── state.js                # Shared State + patchState()
│   └── style.css               # Design Tokens, Komponenten-CSS (Dark Mode)
└── public/data/
    ├── main.json               # Sektorübersicht (Ebene 1)
    ├── sector_ngo.json         # NGO-Datenbaum (Ebene 2–4)
    ├── sector_behoerde.json
    ├── sector_wirtschaft.json
    ├── sector_forschung.json
    ├── sector_gesundheit.json
    └── sector_infrastruktur.json
```

### Rendering-Pipeline

```
state.currentTiles
  → applyOpennessColors()   # Ebene-4-Farbe aus openness.class (OP_01/02/03)
  → renderer.setTiles()     # Gitter-Layout (sqrt-basiert, col/row)
  → _draw() pro Frame       # Painter's Algorithm (col+row aufsteigend)
      → _isVisible()        # Viewport-Culling (Bounding-Box vs. Canvas)
      → _drawTile()         # 3 Flächen + Label + Hover/Pulse/Dimming
```

---

## Datenmodell

Alle Daten liegen als statische JSON-Dateien unter `public/data/`.

### Ebene 1 — Sektor (`main.json`)

```jsonc
{
  "id": "ngo",
  "level": 1,
  "name": "NGO",
  "color": "#2ecc71",
  "subFile": "sector_ngo.json",   // lazy-loaded bei Navigation
  "description": "..."
}
```

### Ebene 2 — Organisation

```jsonc
{
  "id": "soziale-dienste",
  "level": 2,
  "name": "Soziale Dienste",
  "color": "#27ae60",
  "description": "...",
  "children": [ /* Ebene-3-Aktivitäten */ ]
}
```

### Ebene 3 — Aktivität

```jsonc
{
  "id": "beratung-hilfeplanung",
  "level": 3,
  "name": "Beratung & Hilfeplanung",
  "color": "#1abc9c",
  "description": "...",
  "children": [ /* Ebene-4-Datentypen */ ]
}
```

### Ebene 4 — Datentyp (vollständiges Beispiel)

```jsonc
{
  "id": "beratungsstatistik",
  "level": 4,
  "name": "Beratungsstatistik",
  "color": "#27ae60",   // wird durch applyOpennessColors() aus openness.class gesetzt
  "details": {

    "description": "Aggregierte Auswertungen aller erbrachten Beratungsleistungen …",

    "openness": {
      "class": "OP_02",                           // OP_01 | OP_02 | OP_03
      "label": "Gelb — nach Aufbereitung publizierbar",
      "explanation": "Begründung, warum diese Klasse vergeben wurde …"
    },

    "theme":       { "code": "TH_01", "label": "Soziales & Wohlfahrt" },
    "object":      { "code": "OB_01", "label": "Statistik / Aggregat" },
    "granularity": { "code": "GR_02", "label": "Lokal (Gemeinde/Kreis)" },
    "format":      { "code": "FT_01", "label": "CSV" },
    "license":     { "code": "LI_02", "label": "CC BY 4.0" },
    "relevance":   2,   // 0–3: gesellschaftliche Relevanz der Öffnung

    "processes": [
      {
        "method": "Beratung & Sozialarbeit",
        "description": "Planungsgrundlage für Kapazitäts- und Bedarfssteuerung …"
      }
      // weitere verknüpfte Prozesse …
    ]
  }
}
```

---

## Vokabular-Codes

### `voc_openness` — Öffnungsklasse

| Code | Bedeutung |
|---|---|
| `OP_01` | Sofort publizierbar |
| `OP_02` | Nach Aufbereitung publizierbar |
| `OP_03` | Nur Metadaten |

### `voc_theme` — Themenfeld

| Code | Bedeutung |
|---|---|
| `TH_01` | Soziales & Wohlfahrt |
| `TH_02` | Umwelt & Klima |
| `TH_03` | Bildung & Forschung |
| `TH_04` | Gesundheit & Pflege |
| `TH_05` | Demokratie & Zivilgesellschaft |
| `TH_06` | Wirtschaft & Arbeit |
| `TH_07` | Infrastruktur & Mobilität |
| `TH_08` | Kultur & Sport |
| `TH_09` | Migration & Integration |
| `TH_10` | Wissenschaft & Technik |

### `voc_object` — Datenobjekt

| Code | Bedeutung |
|---|---|
| `OB_01` | Statistik / Aggregat |
| `OB_02` | Einzelfall / Vorgang |
| `OB_03` | Verzeichnis / Register |
| `OB_04` | Geodaten |
| `OB_05` | Finanzdaten |
| `OB_06` | Zeitreihen |
| `OB_07` | Mediendaten |
| `OB_08` | Metadaten |

### `voc_format` — Dateiformat

| Code | Bedeutung |
|---|---|
| `FT_01` | CSV |
| `FT_02` | JSON / GeoJSON |
| `FT_03` | XML |
| `FT_04` | PDF |
| `FT_05` | Excel |
| `FT_06` | RDF / Linked Data |

### `voc_granularity` — Granularität

| Code | Bedeutung |
|---|---|
| `GR_01` | Einzelfall |
| `GR_02` | Lokal (Gemeinde/Kreis) |
| `GR_03` | Regional (Bundesland) |
| `GR_04` | National |

### `voc_license` — Lizenz

| Code | Bedeutung |
|---|---|
| `LI_01` | CC0 (Public Domain) |
| `LI_02` | CC BY 4.0 |
| `LI_03` | CC BY-SA 4.0 |
| `LI_04` | Geschlossen / proprietär |

---

## Neuen Sektor hinzufügen

1. **`public/data/main.json`** — Eintrag ergänzen:
   ```json
   {
     "id": "bildung",
     "level": 1,
     "name": "Bildung",
     "color": "#f39c12",
     "subFile": "sector_bildung.json",
     "description": "Schulen, Hochschulen und Bildungseinrichtungen"
   }
   ```

2. **`public/data/sector_bildung.json`** anlegen — Struktur analog zu `sector_ngo.json`:
   - `sectorId` entspricht der `id` aus `main.json`
   - `children` enthält Ebene-2-Organisationen mit verschachtelten Ebene-3- und Ebene-4-Einträgen
   - Ebene-4-Einträge benötigen ein vollständiges `details`-Objekt mit `openness`, `theme`, `object`, `format`, `license`, `relevance` und `processes`

3. Kein weiterer Code nötig — der Sektor wird automatisch in der Karte angezeigt und in den Suchindex aufgenommen.

---

## Technologie

| Bereich | Technologie |
|---|---|
| Rendering | HTML5 Canvas 2D API |
| Framework | Kein Framework — Vanilla JavaScript (ES Modules) |
| Build | [Vite](https://vitejs.dev/) |
| Schriften | Inter (UI), JetBrains Mono (Labels, Code) via Google Fonts |
| Datenhaltung | Statische JSON-Dateien (kein Backend, kein Build-Schritt für Daten) |
| Deployment | GitHub Pages (CI/CD via GitHub Actions bei Push auf `main`) |

---

## Lizenz

[MIT](LICENSE)
