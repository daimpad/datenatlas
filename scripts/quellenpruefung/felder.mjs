// Gemeinsame Feldlogik der Quellenprüfung: wie aus einem Feld des Prüfbogens
// ein vergleichbarer Wert wird. Genutzt von kalibrierung/uebereinstimmung.mjs
// (mit Referenz) und feldvergleich.mjs (ohne Referenz) — eine Fassung, damit die
// beiden nicht auseinanderlaufen.

export const CODEFELDER = ['startjahr', 'rhythmus', 'format', 'lizenz', 'raeumliche_ebene'];
export const TEXTFELDER = ['herausgeber', 'inhalt', 'rechtsgrundlage'];

const CODE = {
  rhythmus: /FQ_\d\d/g, format: /FT_\d\d/g, lizenz: /LI_\d\d/g, raeumliche_ebene: /GR_\d\d/g,
};

// Ergebnisdateien kennen zwei Formen: Felder direkt am Eintrag oder unter `felder`.
export const feld = (e, n) => e?.felder?.[n] ?? e?.[n];

export const statusVon = f => String(f?.status ?? '').replace(' ', '_');
export const ohneWert = f => !f || ['nicht_gefunden', 'entfaellt'].includes(statusVon(f));

// Ein Wert zählt nur, wenn mindestens ein Beleg des Feldes auf der Quellseite
// wiedergefunden wurde. Z = Liste aus zitate-pruefen.mjs --json; ohne Z gilt jeder
// Wert als belegt (nur für die Kalibrierung gegen eine Referenz gedacht).
export const belegt = (Z, id, n) => !Z || Z.some(z => z.id === id && z.result === 'gefunden'
  && (z.path.startsWith(`${n}.`) || z.path.startsWith(`felder.${n}.`)));

// Wert eines Codefeldes als sortierte Liste ([2005], ['FQ_04'], ['FT_01','FT_08']) oder null.
export function codeWert(f, n) {
  if (ohneWert(f)) return null;
  const raw = JSON.stringify(f.wert ?? '');
  if (n === 'startjahr') { const m = raw.match(/\b(1[89]\d\d|20\d\d)\b/); return m ? [Number(m[1])] : null; }
  const m = raw.match(CODE[n]);
  return m ? [...new Set(m)].sort() : null;
}

export function wert(e, id, n, Z) {
  const f = feld(e, n);
  return belegt(Z, id, n) ? codeWert(f, n) : null;
}

export const gleich = (x, y) => !!x && !!y && x.length === y.length && x.every((v, i) => v === y[i]);

// Format muss als Menge stimmen, sonst genügt einer der zulässigen Referenzwerte.
export const passt = (n, v, r) => !r ? null : n === 'format' ? gleich(v, [...r].sort()) : v.some(x => r.includes(x));
