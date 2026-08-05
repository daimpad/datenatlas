// Die Vokabular-Codes und ihre Beschriftungen — an einer Stelle.
//
// Sie lagen vorher als Kopie in modal.js, export.js und expand.js. Das ist
// derselbe Fehler wie damals bei PRACTICE_RE: Kopien driften, und die Drift
// fällt niemandem auf, weil jede Kopie für sich plausibel aussieht.
//
// Hier ist sie teuer geworden. 914 Datentypen trugen ein Label, das ihrem
// eigenen Code widersprach — „Kultur & Freizeit" auf TH_09 (Natur/Biodiversität),
// „Statistik & Kennzahlen" auf OB_01 (Personenbezogene Daten), „Excel (XLSX)"
// auf FT_05 (GeoJSON). Sichtbar wurde davon nichts: modal.js zeigte das Label
// aus den Daten, export.js die Beschriftung zum Code, related.js gruppierte
// über den Code allein. Derselbe Knoten, drei Antworten.
//
// Deshalb gilt jetzt: **der Code ist die Wahrheit, das Label folgt ihm.**
// `labelFor()` liest nie mehr aus dem Knoten. Der Validator prüft zusätzlich,
// dass die Labels in den Sektordateien zum Code passen — driftet eins, meldet
// er es, statt dass es sich sechs Jahre lang versteckt.
//
// Maßgeblich bleibt public/data/vocabulary.json; dieses Modul spiegelt es für
// Consumer, die es nicht laden können (Browser vor dem Fetch, Node-Skripte).
// Wer dort einen Code ergänzt, ergänzt ihn hier.

export const VOKABULAR = {
  openness: [
    { code: 'OP_01', label: 'Sofort publizierbar',           color: '#27ae60' },
    { code: 'OP_02', label: 'Nach Aufbereitung publizierbar', color: '#d4a017' },
    { code: 'OP_03', label: 'Nur Metadaten publizierbar',     color: '#c0392b' },
  ],
  theme: [
    { code: 'TH_01', label: 'Gesundheit' },
    { code: 'TH_02', label: 'Bildung' },
    { code: 'TH_03', label: 'Soziales' },
    { code: 'TH_04', label: 'Wirtschaft' },
    { code: 'TH_05', label: 'Verwaltung' },
    { code: 'TH_06', label: 'Umwelt' },
    { code: 'TH_07', label: 'Finanzen' },
    { code: 'TH_08', label: 'Recht' },
    { code: 'TH_09', label: 'Natur/Biodiversität' },
    { code: 'TH_10', label: 'Wissenschaft/Technik' },
    { code: 'TH_11', label: 'Infrastruktur & Mobilität' },
    { code: 'TH_12', label: 'Kultur & Freizeit' },
    { code: 'TH_13', label: 'Medien & Kommunikation' },
  ],
  object: [
    { code: 'OB_01', label: 'Personenbezogene Daten' },
    { code: 'OB_02', label: 'Textdokumente' },
    { code: 'OB_03', label: 'Finanzdaten' },
    { code: 'OB_04', label: 'Messungen / Sensordaten' },
    { code: 'OB_05', label: 'Geodaten' },
    { code: 'OB_06', label: 'Mediendaten' },
    { code: 'OB_07', label: 'Transaktionsdaten' },
    { code: 'OB_08', label: 'Metadaten' },
    { code: 'OB_09', label: 'Statistik / Aggregatdaten' },
  ],
  granularity: [
    { code: 'GR_01', label: 'Einzelereignis / Rohdaten' },
    { code: 'GR_02', label: 'Aggregiert (zeitlich oder räumlich)' },
    { code: 'GR_03', label: 'Kleinräumig (Stadtteil / Gemeinde)' },
    { code: 'GR_04', label: 'Individuell / Mikrodaten' },
  ],
  format: [
    { code: 'FT_01', label: 'CSV' },
    { code: 'FT_02', label: 'JSON' },
    { code: 'FT_03', label: 'NetCDF / HDF5' },
    { code: 'FT_04', label: 'XML' },
    { code: 'FT_05', label: 'GeoJSON' },
    { code: 'FT_06', label: 'Shapefile' },
    { code: 'FT_07', label: 'PDF' },
    { code: 'FT_08', label: 'Excel (XLSX)' },
  ],
  license: [
    { code: 'LI_01', label: 'CC0 / Public Domain' },
    { code: 'LI_02', label: 'CC BY 4.0' },
    { code: 'LI_03', label: 'Datenlizenz Deutschland' },
    { code: 'LI_04', label: 'Proprietär / Restriktiv' },
  ],
  update_frequency: [
    { code: 'FQ_01', label: 'Echtzeit / Kontinuierlich' },
    { code: 'FQ_02', label: 'Täglich' },
    { code: 'FQ_03', label: 'Monatlich' },
    { code: 'FQ_04', label: 'Jährlich' },
    { code: 'FQ_05', label: 'Unregelmäßig' },
  ],
};

/** Code → Beschriftung, über alle Felder hinweg. */
export const LABELS = Object.fromEntries(
  Object.values(VOKABULAR).flat().map(e => [e.code, e.label])
);

/** Gültige Codes je Feld. */
export const CODES = Object.fromEntries(
  Object.entries(VOKABULAR).map(([feld, items]) => [feld, new Set(items.map(i => i.code))])
);

/**
 * Beschriftung zu einem Vokabular-Objekt `{ code, label }`.
 * Der Code entscheidet; ein abweichendes Label im Knoten wird ignoriert —
 * genau dieses Vorrangverhältnis hat die 914 Fehlcodierungen verdeckt.
 */
export function labelFor(obj) {
  if (!obj) return null;
  return LABELS[obj.code] ?? obj.label ?? obj.code ?? null;
}
