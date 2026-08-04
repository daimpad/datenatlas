# ◈ Datenatlas

**Welche Daten besitzt unsere Gesellschaft, und wie offen könnten sie sein?**

Der Datenatlas macht sichtbar, welche Daten Behörden, Unternehmen, Forschungseinrichtungen, Zivilgesellschaft, Medien, Kultur, Religionsgemeinschaften und Bildungseinrichtungen in Deutschland täglich erzeugen. Auf einer interaktiven isometrischen Karte lassen sich **10.149 Datentypen** quer durch **8 gesellschaftliche Sektoren** erkunden und bewerten.

**→ [datenatlas.de](https://datenatlas.de)**  ·  **Ausführlich: [Über den Datenatlas](https://datenatlas.de/ueber.html)** ([auch als Dokument](docs/ueber-den-datenatlas.md))

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
| **1 Sektor** | Die 8 gesellschaftlichen Bereiche als Kachelgruppe | Kachel anklicken |
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
| 🔵 **Staat und Verwaltung** | Bundesbehörden, Ministerien, Ämter, Kommunen auf allen Verwaltungsebenen | 46 | 3.174 |
| ⚫ **Wirtschaft** | Private Unternehmen aller Branchen von Banken bis Pharmaindustrie | 23 | 1.587 |
| 🟣 **Wissenschaft und Forschung** | Universitäten, Forschungsinstitute, Akademien, Transfereinrichtungen | 19 | 1.311 |
| 🟪 **Zivilgesellschaft** | Vereine, NGOs, Wohlfahrtsverbände, Stiftungen — gegliedert nach ziviz-Monitor | 20 | 1.386 |
| 🩷 **Medien** | Öffentlich-rechtlicher und privater Rundfunk, Nachrichtenagenturen, Streaming, Gaming, Werbung | 12 | 828 |
| 🎭 **Kultur** | Museen, Theater, bildende Kunst sowie Musik-, Film- und Buchwirtschaft | 5 | 345 |
| 🌿 **Religionsgemeinschaften** | Kirchen, jüdische Gemeinden, muslimische Verbände, Hilfswerke | 10 | 690 |
| 🟤 **Bildung** | Kitas, Schulen, Berufsschulen, Hochschulen, Volkshochschulen | 12 | 828 |
| | **Gesamt** | **147** | **10.149** |

---

## Features

### Erkunden

- **Isometrische Karte** — alle Kacheln eines Levels auf einem Blick, frei verschiebbar und zoombar
- **Pan & Zoom** — Karte mit der Maus ziehen, Scroll-Wheel oder Pinch-to-Zoom auf Touch-Geräten
- **Drill-Down-Animation** — beim Klicken zoomt die Ansicht in Richtung der gewählten Kachel
- **Zurück-Navigation** — Pfeil-Button oder Breadcrumb-Leiste oben navigiert stufenweise zurück

### Suchen und Filtern

- **Suche** (Lupe oben rechts) — durchsucht Namen und Sektor-/Organisations-/Aktivitätspfade über alle Sektoren hinweg. Grundlage ist ein schlanker Index, der beim Start im Hintergrund geladen wird; die vollständigen Sektordateien werden erst bei Bedarf nachgeladen.
- **Tiefensuche** — ein Schalter im Ergebnis-Dropdown bezieht zusätzlich die **Beschreibungen** ein. Dafür werden die Volldaten einmalig nachgeladen; danach ist das Umschalten verzögerungsfrei. Beispiel: „pseudonymisiert" findet ohne Tiefensuche 0, mit Tiefensuche 5 Datentypen.
- **Öffnungsklasse-Filter** (Trichter oben rechts) — auf Ebene 4 aktiv; nicht passende Kacheln werden als Ghost-Tiles ausgeblendet

### Details und Verknüpfungen

- **Detail-Sidebar** — pro Datentyp: Öffnungsklassenbewertung mit Begründung, Thema, Objekt, Granularität, Format, Lizenz und Prozessverknüpfungen
- **Ähnliche Datensätze** — bis zu 5 thematisch verwandte Datentypen aus anderen Sektoren direkt in der Sidebar
- **Prozess-Navigation** — von einem Datentyp aus lassen sich verknüpfte Prozesse öffnen; von dort erscheinen alle Datentypen, die diesen Prozess nutzen, auch sektorübergreifend

### Analyse

- **Statistik-Dashboard** — Öffnungsklassen-Verteilung als Balkendiagramm pro Sektor; zeigt auf einen Blick, welcher Sektor am offensten ist
- **Zeitliche Datenverfügbarkeit** — kumulative Verfügbarkeitskurve (Achse 1980–2024, Daten 1988–2020) und Aktualisierungshäufigkeiten (Echtzeit bis unregelmäßig) je Sektor; alle 10.149 Datentypen tragen Zeitangaben
- **Datenkombinator** — 32 Cross-Sektor-Fusionsszenarien mit Slot-Machine-Animation zeigen, welche Datentypen sektorübergreifend kombinierbar sind und welches Erkenntnispotenzial ihre Verknüpfung hat

### Teilen und Exportieren

- **Teilen-Button** (Ketten-Symbol) — kopiert den Link zur aktuellen Navigationstiefe; jede Ebene hat eine eigene URL
- **Export** (Download-Symbol) — lädt die sichtbaren L4-Datentypen als CSV herunter; vollständig im Browser, kein Backend
- **Direkte Suchlinks** — `datenatlas.de/?q=Suchbegriff` öffnet die Suche direkt mit dem Begriff

### Daten öffnen

- **Wizard "Daten öffnen"** — ein 5-stufiger interaktiver Leitfaden für Organisationen, die ihre Daten als Open Data veröffentlichen möchten. Lizenz- und Publikationsempfehlungen passen sich an Sektor, Datenart und Rechtslage an.
- **Weiterführende Werkzeuge** — am Ende des Leitfadens sowie im Footer, im "Mehr erfahren"-Modal und im Menü verlinkt:
  - **[Datengraf](https://datengraf.nozilla.net)** — Datenflüsse kartieren und das Datenökosystem als zusammenhängenden Graf sichtbar machen
  - **[Datenlotse](https://datenlotse.nozilla.net)** — geführtes Management für offene Daten, mit Schritt-für-Schritt-Führung durch die Prozesse

### Datenerweiterung

- **`/expand.html`** — internes Werkzeug zum Ergänzen neuer Datentypen: erzeugt passende LLM-Prompts je Sektor und Organisation, validiert die eingefügte Ausgabe gegen das Schema (inklusive sektorübergreifender ID-Eindeutigkeit) und führt sie in die Sektordaten zusammen.

---

## Datenstruktur

Alle Daten liegen als statische JSON-Dateien unter `public/data/`. Es gibt keine Datenbank und kein Backend — der Atlas läuft vollständig im Browser.

### Aufbau

Jeder Sektor hat eine eigene Datei (`sector_*.json`), die die komplette Hierarchie von Ebene 2 bis 4 enthält. Die Startseite (`main.json`) listet die 8 aktiven Sektoren.

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
  dataLoader.js   — Lazy-Loading der Sektordateien und des Suchindex
  search.js       — Suche (schlanker Index) inkl. optionaler Tiefensuche
  modal.js        — Detail-Sidebar und generisches Modal-System (Trap-Focus)
  expand.js       — Datenerweiterung (Logik hinter expand.html)
  related.js      — "Ähnliche Datensätze" (Cross-Sektor-Ähnlichkeit)
  export.js       — CSV-Export der sichtbaren L4-Datentypen
  wizard.js       — "Daten öffnen"-Wizard (5-Schritt-Modal)
  stats.js        — Statistik-Dashboard (Öffnungsklassen-Balkendiagramm)
  timeline.js     — Timeline-View (kumulative Verfügbarkeit + Aktualisierungshäufigkeit)
  generator.js    — Datenkombinator (32 Cross-Sektor-Fusionsszenarien)
  utils.js        — esc(), trapFocus() und weitere Hilfsfunktionen
  style.css       — CSS-Variablen, Layout, Modal-Styles
public/
  data/           — Taxonomie-JSON-Dateien (eine pro Sektor + main.json + vocabulary.json)
  fonts/          — Lokale Font-Assets
  logo.svg, favicon.svg, og-image.png, site.webmanifest, robots.txt, .htaccess
index.html        — Single-Page-Shell (die Karte)
ueber.html        — statische Projektbeschreibung, im Footer verlinkt
expand.html       — Datenerweiterung (eigener Einstiegspunkt)
vite.config.js    — Build-Plugins: search-index, minify-data-json, seo, precompress
docs/
  ueber-den-datenatlas.md — Projektbeschreibung als Dokument
scripts/
  validate-data.js      — Daten-Validator (Schema, Vokabular, ID-Eindeutigkeit, Farben)
  build-search-index.js — erzeugt den schlanken Suchindex (Build-Artefakt)
  build-og-image.js     — erzeugt das 1200×630-Social-Bild
  datafix-*.mjs         — einmalige Datenkorrekturen (dokumentieren vergangene Läufe)
```

Alle drei HTML-Dateien sind eigene Build-Eingänge (`vite.config.js`). Die Karte
und die Projektbeschreibung sind indexierbar, die Datenerweiterung ist als
internes Werkzeug auf `noindex` gesetzt.

**Tile-Dimensionen (×1,5-Skalierung):** W=240, H=120, D=42

### Suchindex

Der Suchindex unter `data/search-index.json` ist ein **Build-Artefakt** — er wird aus den Sektordateien erzeugt, nie von Hand bearbeitet und nicht eingecheckt. Neue Datentypen ergänzen heißt deshalb unverändert: Sektor-JSON bearbeiten, validieren, committen.

Format v2 hält den Index klein: Einträge sind positionsbasierte Arrays und verweisen über einen Index auf eine gemeinsame Pfadtabelle, statt Sektor, Organisation und Aktivität auf jedem Eintrag als ID *und* Name zu wiederholen (1,16 MB statt 3,00 MB). `adaptIndex()` in `main.js` stellt daraus wieder die Eintragsform her, die Suche, Statistik, Timeline, Related und Generator erwarten.

### Auslieferung

Das `precompress`-Plugin legt zu großen Textdateien `.br`- und `.gz`-Geschwister an. Auf Apache/Netcup liefert `public/.htaccess` sie passend zum `Accept-Encoding` aus; GitHub Pages ignoriert sie und komprimiert selbst.

### SEO

Das `seo`-Plugin erzeugt beim Build aus `main.json`:
- **JSON-LD** — `WebSite` (inkl. `SearchAction` für die `?q=`-Suche), `Organization` und ein `DataCatalog` mit den 8 Sektoren als `Dataset`
- **Sektor-Übersicht im HTML** — für Screenreader und Suchmaschinen, da der Canvas keinen auslesbaren Inhalt hat
- **`sitemap.xml`** — Startseite und `ueber.html`

JSON-LD und Sektor-Übersicht werden ausschließlich in `index.html` injiziert, damit
`ueber.html` den Sektorkatalog nicht ein zweites Mal deklariert. Da die Startseite
im Kern ein Canvas ist, trägt `ueber.html` den einzigen längeren Fließtext des
Auftritts — für die Auffindbarkeit ist sie damit die inhaltlich stärkste Seite.

## Sektordateien

Maßgeblich sind die Werte in `public/data/main.json`:

| Datei | Sektor | L1-Farbe | Verlauf bis |
|---|---|---|---|
| `sector_staat.json` | Staat & Verwaltung | `#1a3461` | `#2e6db4` |
| `sector_wirtschaft.json` | Wirtschaft | `#1c2f3e` | `#2d7a9c` |
| `sector_wissenschaft.json` | Wissenschaft & Forschung | `#2d1a6e` | `#5e35b1` |
| `sector_zivilgesellschaft.json` | Zivilgesellschaft | `#4a1a8c` | `#7c3aed` |
| `sector_medien.json` | Medien | `#8b1248` | `#db2777` |
| `sector_kultur.json` | Kultur | `#701a75` | `#a21caf` |
| `sector_religion.json` | Religionsgemeinschaften | `#0a3d38` | `#0d9488` |
| `sector_bildung.json` | Bildung | `#b45309` | `#d97706` |

> **Wichtig:** Die Farben `#27ae60`, `#d4a017` und `#c0392b` sind für Öffnungsklassen reserviert und dürfen nicht als Kachel- oder Sektorfarben verwendet werden. Der Validator prüft das.

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

Geprüft werden Pflichtfelder und Struktur der L4-Einträge, gültige Vokabular-Codes, sektorübergreifend eindeutige IDs sowie reservierte Öffnungsfarben. Der Validator läuft zusätzlich bei jedem Pull Request (`.github/workflows/validate-data.yml`) und bricht mit Exit-Code 1 ab.

## Deployment

Beides läuft automatisch bei jedem Push auf `main` — kein manueller Schritt nötig:

| Workflow | Ziel |
|---|---|
| `deploy.yml` | GitHub Pages |
| `deploy-netcup.yml` | Netcup per FTP (`/httpdocs/`) |
| `validate-data.yml` | Validator + Build (bei PR und Push) |
| `codeql.yml` | Sicherheitsanalyse |

</details>

---

## Lizenz

[MPL-2.0](LICENSE) · [datenatlas.de](https://datenatlas.de) · von [nozilla](https://nozilla.de)
