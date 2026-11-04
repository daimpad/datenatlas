// Erste geprüfte Quellen (details.sources) — einmaliger Lauf, 2026-11-04.
//
// Belegt wird nur, was auf der Quellseite tatsächlich steht. Wo die Prüfung
// der Beschreibung widersprach, ist die Beschreibung korrigiert, nicht die
// Quelle passend gelesen:
//
//   museumsbesucher — „aller deutschen Museen“ stimmt nicht (2024 antworteten
//     4.592 von über 6.500), „Gedenkstätten“ nennt die Erhebung nicht, und sie
//     läuft jährlich seit 1981, nicht täglich seit 2002.
//   ksk-versicherte-statistik-sparte — die KSK weist Durchschnittseinkommen
//     aus, keine Einkommensklassen; der Verweis auf „§ 34 KSVG im Rahmen ihres
//     Jahresberichts“ ließ sich nicht belegen und ist entfernt.
//   med-kunst-ksk-versicherte — Stichtag ist der 01.01. eines Jahres, also
//     jährlich (FQ_04), nicht monatlich.
//
// Bewusst NICHT belegt, obwohl geprüft: kfo-abgabesaetze-ksk („nach Branche“
// steht nicht auf der KSK-Seite) und bk-ka-kuenstlersozialkasse-berufsfeld
// (Fachrichtung und Bundesland stehen nicht drin). Sie bleiben Einschätzung.
//
// Aufruf aus dem Repo-Wurzelverzeichnis: node scripts/datafix-quellen-erstbelegung.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const CHECKED = '2026-11-04';

const KSK = {
  title: 'KSK in Zahlen',
  publisher: 'Künstlersozialkasse',
  url: 'https://www.kuenstlersozialkasse.de/service/ksk-in-zahlen',
  checked: CHECKED,
};

const PATCHES = {
  museumsbesucher: {
    description: 'Jährliche Besuchszahlen der Museen und, getrennt erfasst, der Ausstellungshäuser in Deutschland aus der Statistischen Gesamterhebung des Instituts für Museumsforschung. Ausgewertet nach Museumsart, Bundesland, Trägerschaft und Größenklasse; außerdem werden die Eintrittspreise erhoben. Angeschrieben werden alle bekannten Museen, 2024 antworteten 4.592 von über 6.500.',
    temporal: { available_from: 1981, update_frequency: 'FQ_04' },
    sources: [
      {
        title: 'Museumsstatistik – Statistische Gesamterhebung',
        publisher: 'Institut für Museumsforschung (SMB)',
        url: 'https://www.smb.museum/museen-einrichtungen/institut-fuer-museumsforschung/aufgaben/museumsstatistik/',
        checked: CHECKED,
        supports: 'jährliche Erhebung seit 1981; Auswertung nach Museumsart, Bundesland, Trägerschaft und Größenklasse',
      },
      {
        title: 'Pressemitteilung: Besuchszahlen der Museen und Ausstellungshäuser 2024',
        publisher: 'SPK / Deutscher Museumsbund',
        url: 'https://www.museumsbund.de/wp-content/uploads/2025/12/251216-besuchszahlen-museen.pdf',
        checked: CHECKED,
        supports: 'Rücklauf 4.592 von über 6.500 Museen; Eintrittspreise werden erhoben; Ausstellungshäuser getrennt erfasst',
      },
    ],
  },
  'kfo-kuenstlersozialkasse': {
    sources: [{ ...KSK, supports: 'Versicherte nach Berufsgruppe, Geschlecht und Alter; Durchschnittseinkommen nach denselben Merkmalen' }],
  },
  'ksk-mitgliederstatistik': {
    sources: [{ ...KSK, supports: 'Versicherte nach Berufsgruppe (Wort, Bildende Kunst, Musik, Darstellende Kunst), Alter und Durchschnittseinkommen' }],
  },
  'ksk-versicherte-statistik-sparte': {
    description: 'Jährliche Statistik der Künstlersozialkasse (KSK) über die Zahl der versicherten Selbstständigen nach Berufsgruppe (Wort, Bildende Kunst, Musik, Darstellende Kunst), Alter und Geschlecht, dazu das Durchschnittseinkommen nach denselben Merkmalen. Stichtag ist jeweils der 1. Januar.',
    explanation: 'Versichertenzahlen nach Sparte, Alter, Geschlecht und Durchschnittseinkommen beschreiben die wirtschaftliche Lage künstlerischer Berufe. Vier Merkmale zugleich verengen die Zellen — bei kleinen Sparten ist zu vergröbern.',
    sources: [{ ...KSK, supports: 'Versicherte und Durchschnittseinkommen nach Berufsgruppe, Geschlecht und Alter, Stichtag 1. Januar' }],
  },
  'med-kunst-ksk-versicherte': {
    temporal: { available_from: 2005, update_frequency: 'FQ_04' },
    sources: [{ ...KSK, supports: 'Versicherte je Berufsgruppe, darunter Bildende Kunst, zum 1. Januar eines Jahres' }],
  },
};

const path = 'public/data/sector_kultur.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
const seen = new Set();

(function walk(n) {
  const p = PATCHES[n.id];
  if (p && n.level === 4) {
    const d = n.details;
    if (p.description) d.description = p.description;
    if (p.explanation) d.openness.explanation = p.explanation;
    if (p.temporal) d.temporal = p.temporal;
    if (p.sources) d.sources = p.sources;
    seen.add(n.id);
  }
  (n.children ?? []).forEach(walk);
})(data);

const missing = Object.keys(PATCHES).filter(id => !seen.has(id));
if (missing.length) {
  console.error('nicht gefunden:', missing.join(', '));
  process.exit(1);
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`belegt: ${seen.size} Datentypen`);
