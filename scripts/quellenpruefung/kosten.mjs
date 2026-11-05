#!/usr/bin/env node
// Misst Kosten und Startkontext von Agentenläufen aus ihren Protokollen
// (JSONL, eine Zeile je Block; liegen unter ~/.claude/projects/…/subagents/).
//
//   node scripts/quellenpruefung/kosten.mjs [--json out.json] name=protokoll.jsonl […]
//
// Je Lauf: Anfragen, Tokens nach Art, Kosten, Startkontext (alles, was die erste
// Anfrage an Eingabe trug, bevor irgendeine Seite abgerufen war), Werkzeugaufrufe.
//
// Eine Anfrage steht im Protokoll in mehreren Zeilen (je Inhaltsblock eine), alle
// mit derselben message.id und denselben Verbrauchszahlen — gezählt wird je id einmal.
//
// Preise in $ je Million Tokens (Stand der Preistabelle: 2026-10-06, claude-api-Skill).
// Cache schreiben: 1,25 × Eingabepreis (5 min) bzw. 2 × (1 h) — die üblichen Faktoren
// der API, in dieser Tabelle nicht einzeln ausgewiesen; die Kosten sind deshalb eine
// Rechnung aus Tokens, keine Abrechnung. Die Tokens selbst sind gemessen.
import { readFileSync, writeFileSync } from 'node:fs';

const PREISE = {
  'claude-sonnet-5-5': { ein: 2, aus: 10, lesen: 0.2 },
  'claude-opus-5-5': { ein: 4, aus: 20, lesen: 0.2 },
};
const kosten = (m, u) => {
  const p = PREISE[m]; if (!p) return null;
  const c = u.cache_creation ?? {};
  const w5 = c.ephemeral_5m_input_tokens ?? u.cache_creation_input_tokens ?? 0, w1 = c.ephemeral_1h_input_tokens ?? 0;
  return (u.input_tokens * p.ein + u.output_tokens * p.aus + u.cache_read_input_tokens * p.lesen + w5 * p.ein * 1.25 + w1 * p.ein * 2) / 1e6;
};

function messen(datei) {
  const nachId = new Map(), werkzeuge = {};
  let von = null, bis = null;
  for (const zeile of readFileSync(datei, 'utf8').split('\n')) {
    if (!zeile.trim()) continue;
    let j; try { j = JSON.parse(zeile); } catch { continue; }
    if (j.timestamp) { von ??= j.timestamp; bis = j.timestamp; }
    const m = j.message;
    if (j.type !== 'assistant' || !m?.usage) continue;
    const alt = nachId.get(m.id);
    if (!alt) nachId.set(m.id, { modell: m.model, u: m.usage, reihe: nachId.size });
    for (const b of Array.isArray(m.content) ? m.content : []) if (b.type === 'tool_use') werkzeuge[b.name] = (werkzeuge[b.name] ?? 0) + 1;
  }
  const anfragen = [...nachId.values()].sort((a, b) => a.reihe - b.reihe);
  const s = { ein: 0, schreiben: 0, lesen: 0, aus: 0, dollar: 0 };
  for (const { modell, u } of anfragen) {
    s.ein += u.input_tokens; s.lesen += u.cache_read_input_tokens; s.aus += u.output_tokens;
    s.schreiben += u.cache_creation_input_tokens ?? 0; s.dollar += kosten(modell, u) ?? 0;
  }
  const e = anfragen[0]?.u;
  return {
    modell: anfragen[0]?.modell, anfragen: anfragen.length,
    startkontext: e ? e.input_tokens + e.cache_creation_input_tokens + e.cache_read_input_tokens : null,
    ...s, dollar: Math.round(s.dollar * 1000) / 1000,
    cacheLesenAnteil: s.dollar ? Math.round(100 * (s.lesen * PREISE[anfragen[0].modell].lesen / 1e6) / s.dollar) : null,
    sekunden: von && bis ? Math.round((new Date(bis) - new Date(von)) / 1000) : null,
    werkzeuge,
  };
}

const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const laeufe = args.filter((a, i) => a.includes('=') && args[i - 1] !== '--json').map(a => a.split(/=(.*)/s, 2));
const erg = Object.fromEntries(laeufe.map(([n, f]) => [n, messen(f)]));

console.log('Lauf        Modell              Anfr.  Start     Eingabe  Cache-schr.  Cache-lesen   Ausgabe      $   Lesen%   Sek.');
for (const [n, r] of Object.entries(erg))
  console.log(`${n.padEnd(11)} ${String(r.modell).padEnd(18)} ${String(r.anfragen).padStart(5)} ${String(r.startkontext).padStart(7)} ${String(r.ein).padStart(9)} ${String(r.schreiben).padStart(12)} ${String(r.lesen).padStart(12)} ${String(r.aus).padStart(9)} ${r.dollar.toFixed(2).padStart(6)} ${String(r.cacheLesenAnteil).padStart(7)} ${String(r.sekunden).padStart(6)}`);
const sum = Object.values(erg).reduce((a, r) => ({ anfragen: a.anfragen + r.anfragen, dollar: a.dollar + r.dollar }), { anfragen: 0, dollar: 0 });
console.log(`\nSumme: ${sum.anfragen} Anfragen, ${sum.dollar.toFixed(2)} $`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(erg, null, 2) + '\n');
