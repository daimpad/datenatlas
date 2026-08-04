// Generates crawlable static pages from the taxonomy — the content the canvas
// app hides behind hash fragments. Used by the `static-pages` Vite plugin.
//
//   /sektor/<sektorId>/               overview of one sector, links to its orgs
//   /sektor/<sektorId>/<orgId>.html   one organisation, all its data types
//
// Deliberately stops at the organisation level: an org page carries ~69 data
// types (~5.700 words) of unique text, while a page per data type would hold
// ~82 words — thin content that would hurt rather than help. Every page links
// back into the interactive map via the matching hash deep link.
import fs from 'fs';
import path from 'path';

const SITE = 'https://datenatlas.de';

export function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const OPENNESS = {
  OP_01: { label: 'Sofort publizierbar',            color: '#27ae60', cls: 'op1' },
  OP_02: { label: 'Nach Aufbereitung publizierbar', color: '#d4a017', cls: 'op2' },
  OP_03: { label: 'Nur Metadaten publizierbar',     color: '#c0392b', cls: 'op3' },
};

function vocabMap(vocab, key) {
  const m = new Map();
  for (const item of vocab[key] ?? []) m.set(item.code, item.label);
  return m;
}

function countL4(node) {
  let n = 0;
  (function walk(x) { if (x.level === 4) n++; (x.children ?? []).forEach(walk); })(node);
  return n;
}

function opennessOf(node) {
  const d = { OP_01: 0, OP_02: 0, OP_03: 0 };
  (function walk(x) {
    if (x.level === 4) { const c = x.details?.openness?.class; if (d[c] !== undefined) d[c]++; }
    (x.children ?? []).forEach(walk);
  })(node);
  return d;
}

function opennessBar(dist) {
  const total = dist.OP_01 + dist.OP_02 + dist.OP_03;
  if (!total) return '';
  const seg = (k) => dist[k] ? `<i style="background:${OPENNESS[k].color};width:${(dist[k] / total * 100).toFixed(2)}%"></i>` : '';
  const pct = (k) => (dist[k] / total * 100).toFixed(1).replace('.', ',');
  return `<div class="dist">
      <div class="dist-bar" role="img" aria-label="Öffnungsklassen: ${pct('OP_01')} Prozent sofort publizierbar, ${pct('OP_02')} Prozent nach Aufbereitung, ${pct('OP_03')} Prozent nur Metadaten">${seg('OP_01')}${seg('OP_02')}${seg('OP_03')}</div>
      <ul class="dist-key">
        <li><span class="dot" style="background:#27ae60"></span><b>${pct('OP_01')} %</b> sofort publizierbar</li>
        <li><span class="dot" style="background:#d4a017"></span><b>${pct('OP_02')} %</b> nach Aufbereitung</li>
        <li><span class="dot" style="background:#c0392b"></span><b>${pct('OP_03')} %</b> nur Metadaten</li>
      </ul>
    </div>`;
}

function shell({ title, description, canonical, breadcrumb, body, jsonLd }) {
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  };
  const graph = jsonLd ? [crumbLd, jsonLd] : [crumbLd];
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="theme-color" content="#6200a8" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${canonical}" />
<meta property="og:site_name" content="Datenatlas" />
<meta property="og:locale" content="de_DE" />
<meta property="og:image" content="${SITE}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="../pages.css" />
${graph.map(g => `<script type="application/ld+json">${JSON.stringify(g)}</script>`).join('\n')}
</head>
<body>
<header class="top">
  <div class="wrap">
    <a href="../../" aria-label="Zur Startseite"><img class="logo" src="../../logo.svg" alt="Datenatlas" /></a>
    <a class="back" href="../../">← Zur Karte</a>
  </div>
</header>
<div class="wrap">
  <nav class="crumb" aria-label="Brotkrumen">
    ${breadcrumb.map((c, i) => i < breadcrumb.length - 1
      ? `<a href="${c.href}">${esc(c.name)}</a><span aria-hidden="true">›</span>`
      : `<span aria-current="page">${esc(c.name)}</span>`).join('')}
  </nav>
  ${body}
</div>
<footer class="bottom">
  <div class="wrap">
    <a class="brand" href="https://nozilla.de" target="_blank" rel="noopener">nozilla | bits &amp; bytes mit ❤</a>
    <nav>
      <a href="../../">Zur Karte</a>
      <a href="../../ueber.html">Über den Datenatlas</a>
      <a href="https://nozilla.de/impressum/" target="_blank" rel="noopener">Impressum</a>
      <a href="https://nozilla.de/datenschutz/" target="_blank" rel="noopener">Datenschutz</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;
}

// ── Sector page ─────────────────────────────────────────────────────────────
function sectorPage(sector, orgs, vocab) {
  const l3 = orgs.reduce((a, o) => a + (o.children ?? []).length, 0);
  const l4 = orgs.reduce((a, o) => a + countL4(o), 0);
  const dist = orgs.reduce((acc, o) => {
    const d = opennessOf(o);
    return { OP_01: acc.OP_01 + d.OP_01, OP_02: acc.OP_02 + d.OP_02, OP_03: acc.OP_03 + d.OP_03 };
  }, { OP_01: 0, OP_02: 0, OP_03: 0 });

  const cards = orgs.map(o => {
    const n = countL4(o);
    const acts = (o.children ?? []).length;
    return `<li><a class="card" href="./${esc(o.id)}.html">
        <strong>${esc(o.name)}</strong>
        <span>${acts} ${acts === 1 ? 'Aktivität' : 'Aktivitäten'} · ${n.toLocaleString('de-DE')} Datentypen</span>
      </a></li>`;
  }).join('');

  const body = `
  <article>
    <p class="eyebrow">Sektor</p>
    <h1>${esc(sector.name)}</h1>
    <p class="lede">${esc(sector.description ?? '')}</p>
    <ul class="figs">
      <li><b>${orgs.length}</b><span>Organisationstypen</span></li>
      <li><b>${l3}</b><span>Aktivitäten</span></li>
      <li><b>${l4.toLocaleString('de-DE')}</b><span>Datentypen</span></li>
    </ul>
    <h2>Öffnungspotenzial</h2>
    <p>Wie leicht sich die Daten dieses Sektors als Open Data veröffentlichen ließen:</p>
    ${opennessBar(dist)}
    <h2>Organisationstypen in diesem Sektor</h2>
    <p>Jede Seite listet die Aktivitäten dieser Organisationsform und die dabei entstehenden Datentypen — jeweils mit Öffnungsbewertung und Begründung.</p>
    <ul class="cards">${cards}</ul>
    <p class="cta"><a href="../../#${esc(sector.id)}">Diesen Sektor auf der interaktiven Karte öffnen →</a></p>
  </article>`;

  return shell({
    title: `${sector.name} — Daten und Öffnungspotenzial | Datenatlas`,
    description: `${orgs.length} Organisationstypen und ${l4.toLocaleString('de-DE')} Datentypen im Sektor ${sector.name}, jeweils mit Bewertung des Open-Data-Potenzials.`,
    canonical: `${SITE}/sektor/${sector.id}/`,
    breadcrumb: [
      { name: 'Datenatlas', href: '../../', url: `${SITE}/` },
      { name: sector.name, href: `./`, url: `${SITE}/sektor/${sector.id}/` },
    ],
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: sector.name, description: sector.description ?? '',
      url: `${SITE}/sektor/${sector.id}/`, inLanguage: 'de-DE',
      isPartOf: { '@type': 'WebSite', url: `${SITE}/`, name: 'Datenatlas' },
    },
    body,
  });
}

// ── Organisation page ───────────────────────────────────────────────────────
function orgPage(sector, org, siblings, vocab) {
  const themes = vocabMap(vocab, 'theme');
  const objects = vocabMap(vocab, 'object');
  const gran = vocabMap(vocab, 'granularity');
  const lic = vocabMap(vocab, 'license');
  const acts = org.children ?? [];
  const l4 = countL4(org);
  const dist = opennessOf(org);

  const sections = acts.map(act => {
    const items = (act.children ?? []).filter(t => t.level === 4).map(t => {
      const d = t.details ?? {};
      const op = OPENNESS[d.openness?.class];
      const chips = [
        themes.get(d.theme?.code), objects.get(d.object?.code),
        gran.get(d.granularity?.code), lic.get(d.license?.code),
        ...(d.format ?? []).map(f => f.label || f.code),
      ].filter(Boolean).map(c => `<span class="chip">${esc(c)}</span>`).join('');
      const procs = (d.processes ?? []).map(p =>
        `<li><b>${esc(p.method)}</b> ${esc(p.description)}</li>`).join('');
      return `<article class="dt">
        <h3>${esc(t.name)}</h3>
        ${d.description ? `<p>${esc(d.description)}</p>` : ''}
        ${op ? `<p class="op ${op.cls}"><span class="dot" style="background:${op.color}"></span>
          <b>${esc(op.label)}</b>${d.openness?.explanation ? ` — ${esc(d.openness.explanation)}` : ''}</p>` : ''}
        ${chips ? `<p class="chips">${chips}</p>` : ''}
        ${procs ? `<details><summary>Verwendung in ${(d.processes ?? []).length} Prozessen</summary><ul class="procs">${procs}</ul></details>` : ''}
      </article>`;
    }).join('');
    return `<section class="act">
      <h2>${esc(act.name)}</h2>
      <p class="act-meta">${(act.children ?? []).length} Datentypen</p>
      ${items}
    </section>`;
  }).join('');

  const others = siblings.filter(o => o.id !== org.id).map(o =>
    `<li><a href="./${esc(o.id)}.html">${esc(o.name)}</a></li>`).join('');

  const body = `
  <article>
    <p class="eyebrow">Organisationstyp · ${esc(sector.name)}</p>
    <h1>${esc(org.name)}</h1>
    <p class="lede">Welche Daten bei dieser Organisationsform entstehen — und wie offen sie sein könnten. ${acts.length} ${acts.length === 1 ? 'Aktivität' : 'Aktivitäten'}, ${l4.toLocaleString('de-DE')} Datentypen.</p>
    ${opennessBar(dist)}
    <p class="cta"><a href="../../#${esc(sector.id)}/${esc(org.id)}">Auf der interaktiven Karte öffnen →</a></p>
    ${sections}
    ${others ? `<section class="more">
      <h2>Weitere Organisationstypen im Sektor ${esc(sector.name)}</h2>
      <ul class="links">${others}</ul>
    </section>` : ''}
  </article>`;

  return shell({
    title: `${org.name} — welche Daten entstehen hier? | Datenatlas`,
    description: `${l4.toLocaleString('de-DE')} Datentypen aus ${acts.length} Aktivitäten bei ${org.name} (${sector.name}) — mit Bewertung des Open-Data-Potenzials und Begründung.`,
    canonical: `${SITE}/sektor/${sector.id}/${org.id}.html`,
    breadcrumb: [
      { name: 'Datenatlas', href: '../../', url: `${SITE}/` },
      { name: sector.name, href: './', url: `${SITE}/sektor/${sector.id}/` },
      { name: org.name, href: `./${org.id}.html`, url: `${SITE}/sektor/${sector.id}/${org.id}.html` },
    ],
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: `${org.name} — Datentypen`, url: `${SITE}/sektor/${sector.id}/${org.id}.html`,
      inLanguage: 'de-DE', isPartOf: { '@type': 'WebSite', url: `${SITE}/`, name: 'Datenatlas' },
    },
    body,
  });
}

// ── Entry point ─────────────────────────────────────────────────────────────
export function buildStaticPages(dataDir) {
  const read = f => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  const main = read('main.json');
  let vocab = {};
  try { vocab = read('vocabulary.json'); } catch { /* labels degrade to codes */ }

  const files = [];
  const urls = [];

  for (const sector of main) {
    if (!sector.subFile) continue;
    let sd;
    try { sd = read(sector.subFile); } catch { continue; }
    const orgs = (sd.children ?? []).filter(o => o.level === 2);

    files.push({ fileName: `sektor/${sector.id}/index.html`, source: sectorPage(sector, orgs, vocab) });
    urls.push({ loc: `${SITE}/sektor/${sector.id}/`, priority: '0.8', changefreq: 'monthly' });

    for (const org of orgs) {
      files.push({ fileName: `sektor/${sector.id}/${org.id}.html`, source: orgPage(sector, org, orgs, vocab) });
      urls.push({ loc: `${SITE}/sektor/${sector.id}/${org.id}.html`, priority: '0.6', changefreq: 'monthly' });
    }
  }

  files.push({ fileName: 'sektor/pages.css', source: PAGES_CSS });
  return { files, urls };
}

// Shared stylesheet — emitted once instead of inlined into all 155 pages.
// Same tokens as the app (src/style.css) so the pages read as part of the site.
const PAGES_CSS = `@font-face{font-family:'Cabin';src:url('../fonts/cabin-latin-400-normal.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Cabin';src:url('../fonts/cabin-latin-700-normal.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
:root{--bg:#f7f7f7;--surface:#fff;--surface-2:#f3eeff;--border:rgba(98,0,168,.12);--border-hi:rgba(98,0,168,.26);
--text-1:#1a0f2e;--text-2:#5c4a7a;--text-3:#8f7fa8;--accent:#6200a8;--accent-hi:#8b2be2;
--font:'Cabin',system-ui,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--shadow:0 1px 2px rgba(26,15,46,.05),0 6px 24px rgba(98,0,168,.055)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text-1);font-family:var(--font);font-size:16.5px;line-height:1.68;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-underline-offset:3px}a:hover{color:var(--accent-hi)}
:focus-visible{outline:2px solid var(--accent-hi);outline-offset:3px;border-radius:2px}
.wrap{max-width:900px;margin:0 auto;padding:0 24px}
.top{height:52px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;position:sticky;top:0;z-index:50}
.top .wrap{display:flex;align-items:center;gap:16px;width:100%}
.logo{height:20px;width:auto;display:block}
.back{margin-left:auto;font-size:13px;font-weight:600;text-decoration:none;padding:6px 13px;border-radius:7px;border:1px solid var(--border-hi)}
.back:hover{background:var(--surface-2);border-color:var(--accent)}
.crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:20px 0 0;font-size:12.5px;color:var(--text-3)}
.crumb a{text-decoration:none}.crumb span[aria-current]{color:var(--text-2)}
article{padding:26px 0 72px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
h1{font-size:clamp(1.9rem,4.6vw,2.8rem);line-height:1.08;letter-spacing:-.028em;font-weight:700;text-wrap:balance}
.lede{font-size:1.06rem;line-height:1.58;color:var(--text-2);max-width:38em;margin-top:16px;text-wrap:pretty}
h2{font-size:1.32rem;line-height:1.24;letter-spacing:-.018em;font-weight:700;margin:44px 0 6px;text-wrap:balance}
h3{font-size:1.02rem;line-height:1.34;font-weight:700;margin-bottom:6px}
p{margin-bottom:14px;max-width:66ch;text-wrap:pretty}
.figs{display:flex;flex-wrap:wrap;gap:12px;margin:26px 0 0;list-style:none}
.figs li{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:13px 18px;flex:1 1 130px;box-shadow:var(--shadow)}
.figs b{display:block;font-size:1.5rem;line-height:1.1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.figs span{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--text-3);margin-top:6px}
.dist{margin:18px 0 6px}
.dist-bar{display:flex;height:30px;border-radius:8px;overflow:hidden;border:1px solid var(--border)}
.dist-bar i{display:block}
.dist-key{display:flex;flex-wrap:wrap;gap:6px 24px;margin-top:13px;list-style:none;font-size:13.5px;color:var(--text-2)}
.dist-key li{display:flex;align-items:baseline;gap:8px}
.dist-key b{color:var(--text-1);font-variant-numeric:tabular-nums}
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;transform:translateY(1px)}
.cards{list-style:none;display:grid;gap:12px;margin-top:18px}
@media(min-width:620px){.cards{grid-template-columns:1fr 1fr}}
.card{display:block;background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:15px 17px;text-decoration:none;color:inherit;box-shadow:var(--shadow);transition:border-color .13s,background .13s}
.card:hover{border-color:var(--accent);background:var(--surface-2)}
.card strong{display:block;font-size:.98rem;line-height:1.3}
.card span{display:block;font-family:var(--mono);font-size:11px;color:var(--text-3);margin-top:5px}
.cta{margin:26px 0 0}
.cta a{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:11px 20px;border-radius:8px}
.cta a:hover{background:var(--accent-hi);color:#fff}
.act{margin-top:40px;padding-top:8px}
.act-meta{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:14px}
.dt{background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:16px 18px;margin-bottom:11px;box-shadow:var(--shadow)}
.dt p{font-size:14.4px;line-height:1.6;color:var(--text-2);margin-bottom:9px;max-width:none}
.dt p:last-child{margin-bottom:0}
.op{display:flex;gap:9px;align-items:baseline;font-size:13.6px}
.op b{color:var(--text-1);white-space:nowrap}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.03em;color:var(--text-2);background:var(--surface-2);border:1px solid var(--border);border-radius:5px;padding:2px 8px}
details{margin-top:4px}
summary{cursor:pointer;font-size:12.5px;color:var(--text-3);font-family:var(--mono)}
summary:hover{color:var(--accent)}
.procs{margin:9px 0 0 16px;font-size:13.4px;line-height:1.55;color:var(--text-2)}
.procs li{margin-bottom:5px}
.procs b{color:var(--text-1)}
.more{margin-top:48px;border-top:1px solid var(--border);padding-top:22px}
.links{list-style:none;display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:12px;font-size:14px}
.bottom{background:var(--surface);border-top:1px solid var(--border);padding:16px 0}
.bottom .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:10px 20px}
.bottom a{font-size:12px;text-decoration:none}
.bottom nav{display:flex;flex-wrap:wrap;gap:10px 16px}
.brand{font-family:var(--mono);font-size:11px;color:var(--text-3)!important}
.brand:hover{color:var(--accent)!important}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;
