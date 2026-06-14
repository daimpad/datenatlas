# ◈ Datenatlas

**Welche Daten besitzt unsere Gesellschaft, und wie offen könnten sie sein?**

Der Datenatlas macht sichtbar, welche Daten Behörden, Unternehmen, Forschungseinrichtungen, Zivilgesellschaft, Medien, Religionsgemeinschaften und Bildungseinrichtungen in Deutschland täglich erzeugen. Auf einer interaktiven isometrischen Karte lassen sich **8.861 Datentypen** quer durch **7 gesellschaftliche Sektoren** erkunden und bewerten.

**→ [datenatlas.de](https://datenatlas.de)**

---

## Was ist der Datenatlas?

Viele wertvolle Datensätze existieren bereits, sind aber nicht öffentlich zugänglich, kaum bekannt oder gelten fälschlicherweise als zu sensibel für eine Veröffentlichung. Der Datenatlas kartiert dieses Potenzial:

- Er zeigt, **was** für Daten wo entstehen
- Er bewertet, **wie offen** diese Daten potenziell sind
- Er erklärt, **welche Prozesse** diese Daten nutzen, und welche anderen Organisationen ähnliche Daten haben
- Er bietet einen **Schritt-für-Schritt-Leitfaden**, wie Organisationen ihre Daten als Open Data veröffentlichen können

---

## Navigation

Der Atlas ist in vier Tiefenebenen gegliedert:

```
Staat und Verwaltung          ← Ebene 1: Sektor
  └── Statistisches Amt       ← Ebene 2: Organisation
        └── Statistikproduktion    ← Ebene 3: Aktivität
              └── Bevölkerungsstatistik   ← Ebene 4: Datentyp  🟢
```

| Ebene | Was Sie sehen | Wie weiter |
|---|---|---|
| **1 Sektor** | Die 7 gesellschaftlichen Bereiche als Kachelgruppe | Kachel anklicken |
| **2 Organisation** | Organisationstypen innerhalb des Sektors | Kachel anklicken |
| **3 Aktivität** | Was diese Organisation tut | Kachel anklicken |
| **4 Datentyp** | Konkrete Datensätze mit Bewertung und Metadaten | Kachel anklicken für Details |

Auf **Ebene 4** zeigt ein Klick auf eine Kachel die vollständige Detailansicht: Beschreibung, Öffnungsklasse, Themenfeld, Format, Lizenz und verknüpfte Prozesse.

---

## Öffnungsklassen

Jeder Datentyp trägt eine Farbbewertung, die anzeigt, wie leicht er als Open Data veröffentlicht werden könnte:

| Farbe | Bedeutung |
|---|---|
| 🟢 **Grün** | Sofort publizierbar — kein oder minimaler Aufbereitungsbedarf |
| 🟡 **Gelb** | Nach Aufbereitung publizierbar — Anonymisierung oder Aggregation nötig |
| 🔴 **Rot** | Nur Metadaten veröffentlichbar — Inhalt ist zu sensibel |

Der **Öffnungsklasse-Filter** (Trichter-Symbol oben rechts) blendet auf Ebene 4 alle Kacheln einer bestimmten Klasse hervor. So lässt sich z. B. schnell sehen, welche Daten eines Sektors sofort veröffentlicht werden könnten.

---

## Sektoren

| Sektor | Trägertyp | L2 | L4 |
|---|---|---|---|
| 🔵 **Staat und Verwaltung** | Bundesbehörden, Ministerien, Ämter, Kommunen auf allen Verwaltungsebenen | 46 | 2.766 |
| ⚫ **Wirtschaft** | Private Unternehmen aller Branchen von Banken bis Pharmaindustrie | 23 | 1.381 |
| 🟣 **Wissenschaft und Forschung** | Universitäten, Forschungsinstitute, Akademien, Transfereinrichtungen | 19 | 1.142 |
| 🟪 **Zivilgesellschaft** | Vereine, NGOs, Wohlfahrtsverbände, Stiftungen — gegliedert nach ziviz-Monitor | 20 | 1.230 |
| 🩷 **Medien und Kultur** | Öffentlich-rechtliche und private Medien, Verlage, Plattformen, Kultureinrichtungen | 17 | 1.022 |
| 🌿 **Religionsgemeinschaften** | Kirchen, jüdische Gemeinden, muslimische Verbände, Hilfswerke | 10 | 600 |
| 🟤 **Bildung** | Kitas, Schulen, Berufsschulen, Hochschulen, Volkshochschulen | 12 | 720 |
| | **Gesamt** | **147** | **8.861** |

---

## Features

### Erkunden

- **Isometrische Karte** — alle Kacheln eines Levels auf einem Blick, frei verschiebbar und zoombar
- **Pan & Zoom** — Karte mit der Maus ziehen, Scroll-Wheel oder Pinch-to-Zoom auf Touch-Geräten
- **Drill-Down-Animation** — beim Klicken zoomt die Ansicht in Richtung der gewählten Kachel
- **Zurück-Navigation** — Pfeil-Button oder Breadcrumb-Leiste oben navigiert stufenweise zurück

### Suchen und Filtern

- **Volltext-Suche** (Lupe oben rechts) — durchsucht Namen, Beschreibungen und Pfade über alle Sektoren hinweg; alle Sektordateien werden beim ersten Start im Hintergrund geladen
- **Öffnungsklasse-Filter** (Trichter oben rechts) — auf Ebene 4 aktiv; nicht passende Kacheln werden als Ghost-Tiles ausgeblendet

### Details und Verknüpfungen

- **Detail-Sidebar** — pro Datentyp: Öffnungsklassenbewertung mit Begründung, Thema, Objekt, Granularität, Format, Lizenz und Prozessverknüpfungen
- **Ähnliche Datensätze** — bis zu 5 thematisch verwandte Datentypen aus anderen Sektoren direkt in der Sidebar
- **Prozess-Navigation** — von einem Datentyp aus lassen sich verknüpfte Prozesse öffnen; von dort erscheinen alle Datentypen, die diesen Prozess nutzen, auch sektorübergreifend

### Analyse

- **Statistik-Dashboard** — Öffnungsklassen-Verteilung als Balkendiagramm pro Sektor; zeigt auf einen Blick, welcher Sektor am offensten ist
- **Zeitliche Datenverfügbarkeit** — kumulative Verfügbarkeitskurve 1980–2024 und Aktualisierungshäufigkeiten (Echtzeit bis unregelmäßig) je Sektor
- **Datenkombinator** — 32 Cross-Sektor-Fusionsszenarien mit Slot-Machine-Animation zeigen, welche Datentypen sektorübergreifend kombinierbar sind und welches Erkenntnispotenzial ihre Verknüpfung hat

### Teilen und Exportieren

- **Teilen-Button** (Ketten-Symbol) — kopiert den Link zur aktuellen Navigationstiefe; jede Ebene hat eine eigene URL
- **Export** (Download-Symbol) — lädt alle sichtbaren L4-Datentypen als CSV oder JSON herunter; vollständig im Browser, kein Backend

### Daten öffnen

- **Wizard "Daten öffnen"** — ein 5-stufiger interaktiver Leitfaden für Organisationen, die ihre Daten als Open Data veröffentlichen möchten. Lizenz- und Publikationsempfehlungen passen sich an Sektor, Datenart und Rechtslage an.

---

## Datenstruktur

Alle Daten liegen als statische JSON-Dateien unter `public/data/`. Es gibt keine Datenbank und kein Backend — der Atlas läuft vollständig im Browser.

### Aufbau

Jeder Sektor hat eine eigene Datei (`sector_*.json`), die die komplette Hierarchie von Ebene 2 bis 4 enthält. Die Startseite (`main.json`) listet die 7 aktiven Sektoren.

### Datentyp-Eintrag (Ebene 4)

Jeder Datentyp enthält neben Name und Beschreibung strukturierte Metadaten:

| Feld | Bedeutung | Beispiel |
|---|---|---|
| `openness.class` | Öffnungsklasse | `OP_01` (grün), `OP_02` (gelb), `OP_03` (rot) |
| `theme` | Themenfeld | Gesundheit, Bildung, Finanzen, Umwelt … |
| `object` | Art der Daten | Personenbezogene Daten, Geodaten, Messwerte … |
| `granularity` | Detailtiefe | Einzelereignis, aggregiert, kleinräumig … |
| `format` | Dateiformat | CSV, JSON, GeoJSON, XML … |
| `license` | Lizenz | CC0, CC BY 4.0, Datenlizenz Deutschland … |
| `relevance` | Gesellschaftliche Relevanz | Skala 1–5 |
| `processes` | Verknüpfte Prozesse (≥ 5) | Methodenname + Beschreibung |
| `temporal.available_from` | Verfügbar ab (Jahr) | `2003` |
| `temporal.update_frequency` | Aktualisierungshäufigkeit | `FQ_01` (Echtzeit) … `FQ_05` (unregelmäßig) |

---

<details>
<summary><strong>Technische Dokumentation (für Entwickler)</strong></summary>

<br>

## Voraussetzungen

- Node.js ≥ 18
- npm ≥ 9

## Lokale Entwicklung

```bash
git clone https://github.com/daimpad/datenatlas.git
cd datenatlas
npm install
npm run dev        # Dev-Server unter http://localhost:5173
npm run build      # Produktionsbuild → dist/
npm run preview    # Lokale Vorschau des Builds
```

## Architektur

```
src/
  main.js         — App-Bootstrap, Navigation, Breadcrumb, Onboarding-Modal
  renderer.js     — Isometrischer Kachel-Renderer (Canvas-basiert)
  state.js        — Zentraler Navigationszustand & History
  controls.js     — Pan/Zoom, Touch-Gesten, Keyboard-Navigation
  dataLoader.js   — Lazy-Loading der Sektordateien, Index-Aufbau
  search.js       — Volltext-Suche über alle Sektoren
  modal.js        — Generisches Modal-System (Öffnen/Schließen/Trap-Focus)
  expand.js       — Expand-Ansicht (einzelner Sektor als eigene Seite)
  related.js      — "Ähnliche Datensätze" (Cross-Sektor-Ähnlichkeit)
  export.js       — CSV/JSON-Export der sichtbaren L4-Datentypen
  wizard.js       — "Daten öffnen"-Wizard (5-Schritt-Modal)
  stats.js        — Statistik-Dashboard (Öffnungsklassen-Balkendiagramm)
  timeline.js     — Timeline-View (kumulative Verfügbarkeit + Aktualisierungshäufigkeit)
  generator.js    — Datenkombinator (32 Cross-Sektor-Fusionsszenarien)
  utils.js        — esc(), trapFocus() und weitere Hilfsfunktionen
  style.css       — CSS-Variablen, Layout, Modal-Styles
public/
  data/           — Taxonomie-JSON-Dateien (eine pro Sektor + main.json + vocabulary.json)
  fonts/          — Lokale Font-Assets
index.html        — Single-Page-Shell
scripts/
  validate-data.js — Daten-Validator
```

**Tile-Dimensionen (×1,5-Skalierung):** W=240, H=120, D=42

## Sektordateien

| Datei | Sektor | L1-Farbe |
|---|---|---|
| `sector_staat.json` | Staat & Verwaltung | `#1e5799` |
| `sector_wirtschaft.json` | Wirtschaft | `#2c3e50` |
| `sector_wissenschaft.json` | Wissenschaft & Forschung | `#4527a0` |
| `sector_zivilgesellschaft.json` | Zivilgesellschaft | `#6d28d9` |
| `sector_medien.json` | Medien und Kultur | `#be185d` |
| `sector_religion.json` | Religionsgemeinschaften | `#134e4a` |
| `sector_bildung.json` | Bildung | `#b45309` |

> **Wichtig:** Die Farben `#27ae60`, `#d4a017` und `#c0392b` sind für Öffnungsklassen reserviert und dürfen nicht als Sektorfarben verwendet werden.

## L4-Node-Format

```json
{
  "id": "unique-kebab-case-id",
  "level": 4,
  "name": "Anzeigename des Datentyps",
  "color": "#4527a0",
  "details": {
    "description": "Beschreibung des Datensatzes",
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
      { "method": "Methode", "description": "Beschreibung" }
    ],
    "temporal": {
      "available_from": 2003,
      "update_frequency": "FQ_02"
    }
  }
}
```

**Häufige Fehler:**
- `"openness": { "code": "OP_01" }` ist falsch — muss `"class"` heißen, nicht `"code"`
- `"formats": [...]` ist falsch — muss `"format"` (Singular) heißen
- Kein `"details"`-Wrapper vergessen
- Jeder L4-Datentyp benötigt mindestens **5 Prozesseinträge**

## Vokabular-Codes

### Öffnungsklasse (`details.openness.class`)
| Code | Farbe | Bedeutung |
|---|---|---|
| `OP_01` | `#27ae60` | Sofort publizierbar |
| `OP_02` | `#d4a017` | Nach Aufbereitung publizierbar |
| `OP_03` | `#c0392b` | Nur Metadaten publizierbar |

### Aktualisierungshäufigkeit (`details.temporal.update_frequency`)
| Code | Bedeutung |
|---|---|
| `FQ_01` | Echtzeit / Kontinuierlich |
| `FQ_02` | Täglich |
| `FQ_03` | Monatlich |
| `FQ_04` | Jährlich |
| `FQ_05` | Unregelmäßig |

### Thema (`details.theme.code`)
| Code | Thema |
|---|---|
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

### Objekttyp (`details.object.code`)
| Code | Typ |
|---|---|
| `OB_01` | Personenbezogene Daten |
| `OB_02` | Textdokumente |
| `OB_03` | Finanzdaten |
| `OB_04` | Messungen / Sensordaten |
| `OB_05` | Geodaten |
| `OB_06` | Mediendaten |
| `OB_07` | Transaktionsdaten |
| `OB_08` | Metadaten |

### Granularität (`details.granularity.code`)
| Code | Granularität |
|---|---|
| `GR_01` | Einzelereignis / Rohdaten |
| `GR_02` | Aggregiert (zeitlich oder räumlich) |
| `GR_03` | Kleinräumig (Stadtteil / Gemeinde) |
| `GR_04` | Individuell / Mikrodaten |

### Format (`details.format[].code`)
| Code | Format |
|---|---|
| `FT_01` | CSV |
| `FT_02` | JSON |
| `FT_03` | NetCDF / HDF5 |
| `FT_04` | XML |
| `FT_05` | GeoJSON |
| `FT_06` | Shapefile |

### Lizenz (`details.license.code`)
| Code | Lizenz |
|---|---|
| `LI_01` | CC0 / Public Domain |
| `LI_02` | CC BY 4.0 |
| `LI_03` | Datenlizenz Deutschland |
| `LI_04` | Proprietär / Restriktiv |

## Validierung

Vor jedem Commit validieren:

```bash
node scripts/validate-data.js
```

Ziel: **0 Warnings, 0 Errors**

## Deployment (GitHub Pages)

```bash
npm run build

git checkout gh-pages
cp dist/index.html .
cp dist/assets/* assets/
git add index.html assets/
git commit -m "Deploy: ..."
git push origin gh-pages
git checkout claude/datenatlas-isometric-explorer-gmnfV
```

</details>

---

## Lizenz

[MIT](LICENSE) · [datenatlas.de](https://datenatlas.de) · von [nozilla](https://nozilla.de)
