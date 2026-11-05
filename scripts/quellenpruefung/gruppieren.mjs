#!/usr/bin/env node
// Stufe 0 der Quellenprüfung: die offenen Einträge nach benannter Stelle und
// Aktivität gruppieren, damit je Gruppe nur einmal recherchiert wird.
//
//   node scripts/quellenpruefung/gruppieren.mjs                      Übersicht
//   node scripts/quellenpruefung/gruppieren.mjs --min 6              nur Gruppen ab 6 Einträgen
//   node scripts/quellenpruefung/gruppieren.mjs --gruppe <schlüssel> Einträge einer Gruppe
//   node scripts/quellenpruefung/gruppieren.mjs --json gruppen.json  alles maschinenlesbar
//   node scripts/quellenpruefung/gruppieren.mjs --eingabe id,id,… --out eingabe.json
//                                                                    Eingabedatei für den Prüfauftrag
//
// „Offen“ heißt: der Eintrag trägt noch keine `details.sources`. „Benannte
// Stelle“ heißt: Name oder Beschreibung nennen einen Herausgeber aus der Tabelle
// STELLEN unten. Die Tabelle ist bewusst eine Liste, kein Mustererkenner — ein
// Eintrag ohne Treffer ist ein allgemeiner Datentyp (Rechtsgrundlage statt
// Statistik) und kommt in keine Gruppe.
//
// Die Gruppierung ist eine grobe Näherung. Sie entscheidet nur, was gemeinsam
// recherchiert wird, nicht, was stimmt; Fehlgruppierungen kosten Zeit, keine
// Richtigkeit, weil jeder Eintrag danach einzeln belegt wird.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'public', 'data');

// Kanonischer Name → Muster. Reihenfolge ist egal: gewinnt die Stelle, die im
// Text zuerst genannt wird. Abkürzungen mit \b, damit „BA“ nicht in „BAFA“ steckt.
const STELLEN = {
  'Statistisches Bundesamt (Destatis)': /Statistische[sn]? Bundesamt|Destatis|GENESIS/,
  'Statistische Ämter des Bundes und der Länder': /Statistische[nr]? (?:Landesämter|Ämter|Landesamt|Landesamts)|Länderstatistik/,
  'Robert Koch-Institut (RKI)': /Robert[- ]Koch-Institut|\bRKI\b/,
  'Deutscher Wetterdienst (DWD)': /Deutsche[rn]? Wetterdienst|\bDWD\b/,
  'Kraftfahrt-Bundesamt (KBA)': /Kraftfahrt-Bundesamt|\bKBA\b/,
  'Umweltbundesamt (UBA)': /Umweltbundesamt|\bUBA\b/,
  'Bundesagentur für Arbeit (BA)': /Bundesagentur für Arbeit|\bBA-Statistik\b|\bIAB\b/,
  'Bundesnetzagentur (BNetzA)': /Bundesnetzagentur|\bBNetzA\b/,
  'Bundesamt für Migration und Flüchtlinge (BAMF)': /Bundesamt für Migration|\bBAMF\b/,
  'Bundesinstitut für Berufsbildung (BIBB)': /Bundesinstitut für Berufsbildung|\bBIBB\b/,
  'Kultusministerkonferenz (KMK)': /Kultusministerkonferenz|\bKMK\b/,
  'Deutsche Forschungsgemeinschaft (DFG)': /Deutsche[rn]? Forschungsgemeinschaft|\bDFG\b/,
  'Deutscher Akademischer Austauschdienst (DAAD)': /\bDAAD\b|Akademische[rn]? Austauschdienst/,
  'Deutsche Bundesbank': /Bundesbank/,
  'Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)': /\bBaFin\b|Finanzdienstleistungsaufsicht/,
  'Bundeskartellamt': /Bundeskartellamt/,
  'Bundesamt für Strahlenschutz (BfS)': /Bundesamt für Strahlenschutz|\bBfS\b/,
  'Bundesamt für Seeschifffahrt und Hydrographie (BSH)': /Bundesamt für Seeschifffahrt|\bBSH\b/,
  'Bundesanstalt für Geowissenschaften und Rohstoffe (BGR)': /Bundesanstalt für Geowissenschaften|\bBGR\b/,
  'Bundesanstalt für Gewässerkunde (BfG)': /Bundesanstalt für Gewässerkunde|\bBfG\b/,
  'Bundesamt für Naturschutz (BfN)': /Bundesamt für Naturschutz|\bBfN\b/,
  'Bundesamt für Güterverkehr (BAG)': /Bundesamt für Güterverkehr/,
  'Bundesamt für Verbraucherschutz und Lebensmittelsicherheit (BVL)': /Bundesamt für Verbraucherschutz|\bBVL\b/,
  'Bundesamt für Soziale Sicherung (BAS)': /Bundesamt für Soziale Sicherung/,
  'Bundesamt für Justiz (BfJ)': /Bundesamt für Justiz/,
  'Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA)': /Bundesamt für Wirtschaft und Ausfuhr|\bBAFA\b/,
  'Bundesamt für Sicherheit in der Informationstechnik (BSI)': /Bundesamt für Sicherheit in der Informationstechnik|\bBSI\b/,
  'Luftfahrt-Bundesamt (LBA)': /Luftfahrt-Bundesamt/,
  'GKV-Spitzenverband': /GKV-Spitzenverband/,
  'Informationsgemeinschaft zur Feststellung der Verbreitung von Werbeträgern (IVW)': /\bIVW\b/,
  'Arbeitsgemeinschaft Videoforschung (AGF)': /\bAGF\b/,
  'GEMA': /\bGEMA\b/,
  'Bundesverband Musikindustrie (BVMI)': /\bBVMI\b/,
  'Kommission zur Ermittlung der Konzentration im Medienbereich (KEK)': /\bKEK\b/,
  'Deutscher Gewerkschaftsbund (DGB)': /\bDGB\b/,
  'Zentralverband des Deutschen Handwerks (ZDH)': /\bZDH\b/,
  'Verband der Automobilindustrie (VDA)': /\bVDA\b/,
  'Verband der Chemischen Industrie (VCI)': /\bVCI\b/,
  'Gesamtverband der Deutschen Versicherungswirtschaft (GDV)': /\bGDV\b/,
  'Evangelische Kirche in Deutschland (EKD)': /\bEKD\b/,
  'Deutsche Bischofskonferenz (DBK)': /Deutsche[rn]? Bischofskonferenz|\bDBK\b/,
  'Deutscher Volkshochschul-Verband (DVV)': /\bDVV\b/,
  'ZiviZ im Stifterverband': /\bZiviZ\b/,
  'Bundesverband Deutscher Stiftungen': /Bundesverband Deutscher Stiftungen/,
  'Deutsches Zentrum für Hochschul- und Wissenschaftsforschung (DZHW)': /\bDZHW\b/,
  'Statistisches Amt der Europäischen Union (Eurostat)': /Eurostat/,
};

const alle = [];
(function laden() {
  for (const f of readdirSync(DATA).filter(f => f.startsWith('sector_')).sort()) {
    const j = JSON.parse(readFileSync(join(DATA, f), 'utf8'));
    (function w(n, pfad) {
      if (n.level === 4) { alle.push({ sektor: j.sectorId, pfad, node: n }); return; }
      for (const c of n.children ?? []) w(c, n.level ? [...pfad, n] : pfad);
    })(j, []);
  }
})();

function stelleVon(text) {
  let best = null;
  for (const [name, re] of Object.entries(STELLEN)) {
    const m = re.exec(text);
    if (m && (!best || m.index < best.index)) best = { name, index: m.index };
  }
  return best?.name ?? null;
}

const eintraege = alle.map(({ sektor, pfad, node }) => {
  const [l2, l3] = pfad;
  return {
    id: node.id, sektor, name: node.name,
    l2: l2?.name, l3: l3?.name,
    offen: !node.details?.sources?.length,
    stelle: stelleVon(`${node.name}. ${node.details?.description ?? ''}`),
    node, pfad: pfad.map(p => p.name).join(' / '),
  };
});

const offen = eintraege.filter(e => e.offen);
const benannt = offen.filter(e => e.stelle);
const gruppen = new Map();
for (const e of benannt) {
  const key = `${e.stelle} @ ${e.sektor}/${e.l2}/${e.l3}`;
  if (!gruppen.has(key)) gruppen.set(key, []);
  gruppen.get(key).push(e);
}
const liste = [...gruppen].map(([key, es]) => ({ key, stelle: es[0].stelle, sektor: es[0].sektor, pfad: es[0].pfad, n: es.length, ids: es.map(e => e.id) }))
  .sort((a, b) => b.n - a.n || a.key.localeCompare(b.key, 'de'));

// ── Eingabedatei für den Prüfauftrag ──
function eingabe(ids) {
  const voc = JSON.parse(readFileSync(join(DATA, 'vocabulary.json'), 'utf8'));
  const label = (art, code) => voc[art]?.find(v => v.code === code)?.label ?? code;
  const out = {};
  for (const id of ids) {
    const e = eintraege.find(x => x.id === id);
    if (!e) throw new Error(`unbekannte id: ${id}`);
    const d = e.node.details;
    out[id] = {
      sektor: e.sektor, pfad: e.pfad.split(' / ').slice(0, 2).join(' / '), name: e.name,
      beschreibung: d.description,
      oeffnungsklasse: d.openness?.label, begruendung: d.openness?.explanation,
      granularitaet: label('granularity', d.granularity?.code),
      format: (d.format ?? []).map(f => label('format', f.code)).join(', '),
      lizenz: label('license', d.license?.code),
      verfuegbar_ab: d.temporal?.available_from,
      aktualisierung: label('update_frequency', d.temporal?.update_frequency),
      beispiele: (d.examples ?? []).map(x => x.url ?? x),
    };
  }
  return out;
}

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

if (opt('--eingabe')) {
  const ids = opt('--eingabe').split(',').map(s => s.trim()).filter(Boolean);
  const o = eingabe(ids);
  if (opt('--out')) writeFileSync(opt('--out'), JSON.stringify(o, null, 2) + '\n');
  else console.log(JSON.stringify(o, null, 2));
  console.error(`${ids.length} Einträge`);
} else if (opt('--gruppe')) {
  const g = liste.find(x => x.key === opt('--gruppe')) ?? liste.find(x => x.key.includes(opt('--gruppe')));
  if (!g) { console.error('Gruppe nicht gefunden'); process.exit(1); }
  console.log(`${g.key} — ${g.n} Einträge`);
  for (const id of g.ids) { const e = eintraege.find(x => x.id === id); console.log(`  ${id}\n    ${e.name}: ${e.node.details.description.slice(0, 160)}…`); }
} else {
  const min = Number(opt('--min') ?? 1);
  const g = liste.filter(x => x.n >= min);
  if (opt('--json')) writeFileSync(opt('--json'), JSON.stringify({ offen: offen.length, benannt: benannt.length, gruppen: liste }, null, 2) + '\n');
  console.log(`Einträge ${eintraege.length} · offen (ohne Quelle) ${offen.length} · davon mit benannter Stelle ${benannt.length} · Gruppen ${liste.length} (Ø ${(benannt.length / liste.length).toFixed(1)})`);
  console.log(`Allgemeine Datentypen ohne benannte Stelle: ${offen.length - benannt.length}`);
  const hist = {}; for (const x of liste) hist[x.n >= 6 ? '6+' : x.n] = (hist[x.n >= 6 ? '6+' : x.n] ?? 0) + 1;
  console.log(`Gruppengröße: ${Object.entries(hist).map(([k, v]) => `${k}: ${v}`).join(' · ')}`);
  console.log(`\nGruppen ab ${min} Einträgen (${g.length}):`);
  for (const x of g.slice(0, 40)) console.log(`${String(x.n).padStart(3)}  ${x.key}`);
  if (g.length > 40) console.log(`… und ${g.length - 40} weitere (--json für alle)`);
}
