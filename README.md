# ◈ Datenatlas

> **Eine isometrische Karte der deutschen Datenschutzlandschaft**

Datenatlas ist ein interaktiver Browser-Explorer, der die DSGVO-Risikolandschaft Deutschlands in einer isometrischen 3D-Kartendarstellung visualisiert. Nutzer navigieren über vier Hierarchieebenen — von gesellschaftlichen Sektoren bis zu einzelnen Datentypen — und erhalten zu jedem Datensatz eine strukturierte Analyse: DSGVO-Risikoeinstufung, Open-Data-Potenzial und konkrete Anonymisierungsstrategien.

```
◈ Datenatlas
  └── NGO                  (Sektor)
        └── Umweltverein         (Organisation)
              └── Mitglieder akquirieren  (Aktivität)
                    └── Mitgliederliste        (Datentyp · Risiko: SEHR HOCH)
```

---

## Features

| Feature | Beschreibung |
|---|---|
| **Isometrische Karte** | Canvas-basierter Renderer mit Painter's-Algorithm, Viewport-Culling und Hover-Highlighting |
| **4-Ebenen-Navigation** | Sektor → Organisation → Aktivität → Datentyp — mit Breadcrumb und Breadcrumb-Klick |
| **DSGVO-Risikoampel** | Level-4-Kacheln leuchten in ihrer Risikofarbe (grün / amber / orange / rot) |
| **Volltext-Suche** | Alle Sektoren werden im Hintergrund vorgeladen; Suche nach Name, Beschreibung oder Pfad |
| **Filtermodus** | Kacheln nach Risikoklasse oder Open-Data-Potenzial filtern; Treffer hervorgehoben, Rest als Ghost |
| **Detail-Sidebar** | Pro Datentyp: Beschreibung, Rechtsgrundlagen, Open-Data-Potenzial, Anonymisierungsstrategien |
| **Zoom-Animation** | Drill-Down zoomt via CSS-Transform in Richtung der geklickten Kachel |
| **Klick-Feedback** | Pulse-Animation + ▼-Indikator für navigierbare Kacheln |
| **Onboarding** | Erster-Besuch-Overlay mit drei Kurz-Hints, localStorage-persistent |
| **Viewport-Culling** | Off-Screen-Kacheln werden übersprungen — konstante Framerate auch bei vielen Kacheln |
| **DPI-Resize** | `ctx.setTransform()` statt `ctx.scale()` — kein Transform-Akkumulationsfehler |
| **Fehlerbehandlung** | Overlay mit Retry-Button bei fehlgeschlagenem Datenladen |

---

## Sektoren & Datentiefe

Aktuell sind **6 Sektoren** mit insgesamt **35+ Datentypen** enthalten:

| Sektor | Farbe | Beispiel-Datentypen |
|---|---|---|
| 🟢 **NGO** | `#2ecc71` | Mitgliederliste, Spenderdaten, Förderantrag |
| 🔵 **Behörde** | `#3498db` | Einwohnermelderegister, Bußgeldbescheid, Steuerbescheid |
| 🟠 **Wirtschaft** | `#e67e22` | Kundendatenbank, Bonitätsauskunft, Arbeitsvertrag |
| 🟣 **Forschung** | `#9b59b6` | Studienteilnehmerdaten, Genomdaten, Forschungsrohdaten |
| 🔴 **Gesundheit** | `#e74c3c` | Patientenakte, CT/MRT-Bilddaten, Rezeptdaten |
| 🩵 **Infrastruktur** | `#1abc9c` | Smart-Meter-Daten, Ticketing, Ladesession-Daten |

### DSGVO-Risikoampel

Jeder Datentyp (Level 4) trägt eine von vier Risikoeinstufungen:

| Risikoklasse | Kachelfarbe | Bedeutung |
|---|---|---|
| `risk-low` | `#27ae60` grün | Geringe DSGVO-Risiken, ggf. direkt Open-Data-fähig |
| `risk-medium` | `#d4a017` amber | Personenbezug vorhanden, aber Anonymisierung gut möglich |
| `risk-high` | `#e67e22` orange | Sensible Daten, strenge Zweckbindung erforderlich |
| `risk-veryhigh` | `#c0392b` rot | Art. 9 DSGVO / besondere Kategorien; höchste Schutzpflicht |

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
├── index.html                  # App-Shell, Onboarding, Filter-Bar
├── src/
│   ├── main.js                 # Orchestrierung: Navigation, Animation, Filter, Suche
│   ├── renderer.js             # Canvas-Renderer (isometrisch, Culling, Dimming)
│   ├── controls.js             # Maus- und Touch-Events (Pan, Click, Hover)
│   ├── modal.js                # Detail-Sidebar (Öffnen/Schließen/Befüllen)
│   ├── dataLoader.js           # JSON-Fetch für main.json und Sektordateien
│   ├── search.js               # Suchindex-Aufbau + Such-UI
│   ├── utils.js                # applyRiskColors(), RISK_COLORS
│   ├── state.js                # Minimales Event-Bus + Shared State
│   └── style.css               # Design Tokens, Komponenten-CSS (Dark Mode)
└── public/data/
    ├── main.json               # Sektorübersicht (Level 1)
    ├── sector_ngo.json         # NGO-Datenbaum (Level 2–4)
    ├── sector_behoerde.json
    ├── sector_wirtschaft.json
    ├── sector_forschung.json
    ├── sector_gesundheit.json
    └── sector_infrastruktur.json
```

### Rendering-Pipeline

```
state.currentTiles
  → applyRiskColors()      # Level-4-Farbe aus riskClass
  → renderer.setTiles()    # Gitter-Layout (sqrt-basiert, col/row)
  → _draw() pro Frame      # Painter's Algorithm (col+row aufsteigend)
      → _isVisible()       # Viewport-Culling (Bounding-Box vs. Canvas)
      → _drawTile()        # 3 Flächen + Label + Hover/Pulse/Dimming
```

---

## Datenmodell

Alle Daten liegen als statische JSON-Dateien unter `public/data/`. Das Modell hat vier Ebenen:

### Level 1 — Sektor (`main.json`)

```jsonc
{
  "id": "ngo",
  "level": 1,
  "name": "NGO",
  "color": "#2ecc71",
  "subFile": "sector_ngo.json",       // lazy-loaded bei Navigation
  "description": "..."
}
```

### Level 2 — Organisation

```jsonc
{
  "id": "umweltverein",
  "level": 2,
  "name": "Umweltverein",
  "color": "#27ae60",
  "description": "...",
  "children": [ /* Level-3-Aktivitäten */ ]
}
```

### Level 3 — Aktivität

```jsonc
{
  "id": "mitglieder_akquise",
  "level": 3,
  "name": "Mitglieder akquirieren",
  "color": "#1abc9c",
  "description": "...",
  "children": [ /* Level-4-Datentypen */ ]
}
```

### Level 4 — Datentyp (vollständiges Beispiel)

```jsonc
{
  "id": "mitgliederliste",
  "level": 4,
  "name": "Mitgliederliste",
  "color": "#c0392b",   // wird durch applyRiskColors() aus riskClass gesetzt
  "details": {
    "description": "Stammdaten aller registrierten Vereinsmitglieder …",

    "openDataPotential": {
      "score": "Niedrig",
      "scoreValue": 1,              // 0 = sehr niedrig, 1, 2, 3 = hoch
      "explanation": "…"
    },

    "dsgvoRisk": {
      "level": "Sehr hoch",
      "riskClass": "risk-veryhigh", // risk-low | risk-medium | risk-high | risk-veryhigh
      "explanation": "…",
      "articles": ["Art. 9 DSGVO", "Art. 32 DSGVO"]
    },

    "anonymization": [
      {
        "method": "Aggregation",
        "description": "Zusammenfassung auf PLZ-Ebene …"
      }
      // weitere Methoden …
    ]
  }
}
```

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

2. **`public/data/sector_bildung.json`** anlegen — dem Schema der anderen Sektordateien folgen:
   - `sectorId` entspricht der `id` aus `main.json`
   - `children` enthält Level-2-Organisationen mit verschachtelten Level-3- und Level-4-Einträgen
   - Level-4-Einträge benötigen ein vollständiges `details`-Objekt (s. Schema oben)

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

---

## Lizenz

[MIT](LICENSE)
