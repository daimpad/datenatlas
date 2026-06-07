// ── Cross-Sector-Fusion-Generator ─────────────────────────────────────────────
import { esc, trapFocus } from './utils.js';

export const SECTOR_META = {
  staat:             { name: 'Staat & Verwaltung',       color: '#1e5799' },
  wirtschaft:        { name: 'Wirtschaft',               color: '#2c3e50' },
  wissenschaft:      { name: 'Wissenschaft & Forschung', color: '#4527a0' },
  zivilgesellschaft: { name: 'Zivilgesellschaft',        color: '#6d28d9' },
  medien:            { name: 'Medien & Kultur',          color: '#be185d' },
  religion:          { name: 'Religionsgemeinschaften',  color: '#134e4a' },
};

export const SCENARIOS = [
  {
    id:    'klimarisiko',
    title: 'Klimarisiko-Karte',
    icon:  'fa-temperature-half',
    story: 'Welche Wirtschaftsregionen sind klimatisch besonders verwundbar – und ist diese Verwundbarkeit mit Klimadaten oder Finanzdaten allein überhaupt messbar?\n\nUmweltbehörden wie der Deutsche Wetterdienst wissen, wo Extremwetter häufiger und Überflutungsrisiken höher werden – aber nicht, welche wirtschaftlichen Strukturen dort verwurzelt sind. Unternehmensdaten kennen Standorte, Branchen und Kapitalexposition – aber nicht, welche Klimabedingungen dort in Zukunft herrschen werden.\n\nEinzig die Überlagerung beider Datensätze erzeugt ein kleinräumiges Bild wirtschaftlicher Klimaexposition: Wo treffen steigende Hitzebelastung auf exportabhängige Branchen? Wo überlagern sich Überflutungsrisiken mit konzentrierter Unternehmensinfrastruktur? Diese Schnittmenge – Klimagefährdung trifft wirtschaftliche Verwundbarkeit – ist die Grundlage für ein Klimarisiko-Profil, das weder Klimaforschung noch Wirtschaftsstatistik allein liefern kann.',
    a: { sector: 'staat',      theme: 'TH_06' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  'fa-chart-line',
    story: 'Führt eine bestimmte Bildungsinvestition tatsächlich zu Beschäftigung und wirtschaftlicher Wertschöpfung – und lässt sich das empirisch zeigen?\n\nBildungspanels wie das NEPS kennen den Qualifikationsweg: welchen Abschluss jemand wann erworben hat. Sie sehen nicht, was danach auf dem Arbeitsmarkt passiert. Wirtschaftsdaten aus Unternehmensregistern und Branchenstatistiken sehen Gehaltsniveaus und Nachfragestrukturen – aber nicht, welche Bildungsbiografien dorthin geführt haben.\n\nEinzig die Verbindung beider Quellen schließt diese Lücke: Welche Qualifikationen führen in welchen Regionen tatsächlich zu welchen Beschäftigungsbiografien? Wo entstehen Mismatches zwischen Bildungsoutput und Arbeitsmarktbedarf? Diese Antwort ist nur aus dem Zusammenspiel beider Datensätze zu gewinnen – und wäre eine empirische Grundlage für informierte Bildungsplanung.',
    a: { sector: 'wissenschaft', theme: 'TH_02' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  'fa-map',
    story: 'Messen amtliche Sozialdaten und zivilgesellschaftliche Beratungsstatistiken dieselbe Realität – oder beschreiben sie unterschiedliche Ausschnitte derselben Notlage?\n\nAmtliche Statistiken zeigen, wer das Sozialsystem erreicht: Grundsicherungsquoten, Arbeitslosenmeldungen, Wohnhilfen. Zivilgesellschaftliche Beratungsstellen sehen, wer sich meldet, bevor staatliche Leistungen greifen – und wer sie aus Unkenntnis oder Misstrauen gar nicht beansprucht. Beide Quellen messen soziale Not, aber aus entgegengesetzten Perspektiven: eine aus dem System heraus, die andere aus dem Alltag der Betroffenen.\n\nEinzig der Abgleich beider Quellen macht den Raum zwischen staatlicher Registrierung und tatsächlicher Bedarfslage sichtbar: Regionen, in denen Beratungsnachfrage steigt, während Statistiken stabil bleiben, signalisieren strukturelle Untererfassung – einen blinden Fleck, der mit keiner der beiden Quellen allein erkennbar wäre.',
    a: { sector: 'staat',             theme: 'TH_03' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  'fa-church',
    story: 'Wie sieht eine Karte der sozialen Versorgung in Deutschland aus, wenn erstmals kommunale und konfessionelle Infrastruktur gemeinsam eingezeichnet sind?\n\nKommunale Geodaten zeigen, wo staatliche Einrichtungen liegen – Kitas, Pflegeheime, Beratungsstellen in öffentlicher Trägerschaft. Religiöse Träger wie Caritas, Diakonie oder jüdische Wohlfahrtsverbände betreiben parallele Netze derselben Einrichtungstypen, deren Standorte selten in kommunalen Planungssystemen erfasst sind. Beide Geodatensätze beschreiben dasselbe Versorgungssystem – aber jeder nur seinen Teil.\n\nEine gemeinsame Karte beider Datensätze könnte erstmals zeigen, wo konfessionliche Träger staatliche Infrastruktur dicht ergänzen, wo sie die einzige Anlaufstelle sind – und wo Lücken entstehen, die erst durch die Kombination beider Perspektiven sichtbar werden.',
    a: { sector: 'religion', object: 'OB_05' },
    b: { sector: 'staat',    object: 'OB_05' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  'fa-leaf',
    story: 'Lässt sich zeigen, ob und wie intensiv wirtschaftliche Nutzung mit dem Rückgang biologischer Vielfalt zusammenhängt – lokal, räumlich präzise und über Branchen hinweg?\n\nArtenerfassungen und Biotopkartierungen wissen, wie es um Insekten, Pflanzen und Ökosysteme in einer Region steht – aber nicht, welche wirtschaftlichen Aktivitäten dort stattfinden. Flächennutzungs- und Standortdaten zeigen, wer eine Fläche wie intensiv bewirtschaftet – aber nicht, was das ökologisch bedeutet. Beide Datensätze beschreiben dieselbe Landschaft, jedoch aus völlig verschiedenen Beobachtungsperspektiven.\n\nEine Überlagerung beider Datensätze könnte für einzelne Regionen zeigen, ob und wie stark Flächennutzungsintensität mit Artenrückgang korreliert. Diese räumliche Verknüpfung ist das eigenständige Erkenntnispotenzial der Kombination – ein empirisches Fundament für Unternehmen, die Natural-Capital-Risiken bewerten wollen, und für Politik, die Naturschutzziele und Wirtschaftsförderung räumlich koordinieren möchte.',
    a: { sector: 'wissenschaft', theme: 'TH_09' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'medienspiegel-gesellschaft',
    title: 'Medienspiegel der Gesellschaft',
    icon:  'fa-newspaper',
    story: 'Berichtet die Öffentlichkeit proportional über das, was amtliche Sozialdaten messen – oder gibt es Regionen und Themen, die statistisch bedeutsam, medial aber kaum sichtbar sind?\n\nAmtliche Sozialdaten messen Armutsgefährdung, Obdachlosigkeit und soziale Benachteiligung regional und zeitlich präzise – aber sie wissen nichts davon, ob diese Probleme öffentlich wahrgenommen werden. Medienarchive zeigen, welche sozialen Themen wie intensiv berichtet werden – aber nicht, ob die berichteten Probleme statistisch tatsächlich vorhanden oder wachsend sind.\n\nEinzig der Abgleich beider Quellen erzeugt das eigentlich interessante Bild: Regionen und Problemlagen, für die Statistiken eine Verschlechterung zeigen, während die Medienpräsenz gering bleibt – und umgekehrt. Diese Diskrepanz ist eine eigenständige Erkenntnis, die weder aus Mediendaten noch aus Sozialdaten allein gewonnen werden kann.',
    a: { sector: 'medien', theme: 'TH_03' },
    b: { sector: 'staat',  theme: 'TH_03' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  'fa-hospital',
    story: 'Warum nutzen Menschen in manchen Regionen medizinische Angebote seltener – obwohl die Versorgungsdichte vergleichbar ist? Und lässt sich das aus Daten ermitteln?\n\nStaatliche Versorgungsdaten zeigen, wie viele Ärztinnen und Einrichtungen in einem Planungsbereich vorhanden sind – aber nicht, ob und von wem sie erreicht werden. Zivilgesellschaftliche Beratungsstatistiken zeigen, wo Menschen Unterstützung beim Zugang zu Gesundheitsleistungen benötigen – aber nicht, wie groß das Angebot dort ist. Beide Quellen sehen jeweils nur eine Seite der Versorgungsrealität.\n\nEinzig die Kombination beider Datensätze macht die Differenz messbar: Regionen mit hoher Versorgungsdichte, aber hoher Beratungsnachfrage, signalisieren systemische Zugangshürden – sprachliche, soziale oder strukturelle. Dieses Muster ist das zentrale Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'staat',             theme: 'TH_01' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  'fa-scale-balanced',
    story: 'Welcher Sektor legt seine Finanzen offener dar – der öffentliche oder der private – und lässt sich das mit einem gemeinsamen Maßstab messen?\n\nKommunale Jahresabschlüsse und Unternehmensabschlüsse sind beide prinzipiell öffentlich zugänglich. Aber sie wurden nie nach denselben Kriterien analysiert: Vollständigkeit, Aktualität, Maschinenlesbarkeit, Detailtiefe. Jede Seite allein ist nur mit sich selbst vergleichbar – der andere Sektor bleibt außen vor.\n\nEin gemeinsamer Transparenzindex, angewendet auf beide Datensätze, würde erstmals zeigen, wo öffentliche Körperschaften detaillierter und aktueller berichten als Unternehmen – und wo es umgekehrt ist. Dieser sektorübergreifende Vergleich ist ausschließlich aus der Kombination möglich: Ohne die andere Seite gibt es keinen Maßstab und keine Aussage über relative Offenheit.',
    a: { sector: 'staat',      theme: 'TH_07' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  'fa-microscope',
    story: 'Wo treffen wissenschaftliche Erkenntnisse auf gesellschaftlichen Bildungsbedarf – und wo klaffen beide weit auseinander?\n\nForschungsdatenbanken wie das GEPRIS der DFG dokumentieren, auf welchen Feldern intensiv geforscht wird – aber nicht, ob diese Erkenntnisse in der Bildungspraxis ankommen. Bildungsträger wie Volkshochschulen oder Wohlfahrtsverbände dokumentieren in Programmen, welche Themen Bürgerinnen und Bürger tatsächlich nachfragen – aber nicht, was dazu wissenschaftlich bekannt ist. Beide Quellen beschreiben Wissensproduktion und Wissensnachfrage, ohne voneinander zu wissen.\n\nEinzig der Abgleich beider Datensätze erzeugt eine Transferkarte: Wo besteht dichtes Forschungsaufkommen zu einem Thema, während Bildungsträger es kaum aufgreifen? Und welche Themen bewegen die Praxis, ohne dass systematische Forschung dazu vorliegt? Diese Lückenanalyse ist das eigenständige Ergebnis der Kombination.',
    a: { sector: 'wissenschaft',      theme: 'TH_10' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  'fa-handshake',
    story: 'Erklärt die Dichte konfessioneller Wohlfahrtsinfrastruktur, warum manche Regionen trotz ähnlicher sozialer Lage geringere staatliche Sozialausgaben aufweisen?\n\nStaatliche Sozialstatistiken zeigen Ausgaben und Leistungsempfänger nach Kreisen – aber nicht, welche nichtstaatlichen Träger dort parallel aktiv sind. Statistiken konfessioneller Wohlfahrtsverbände wie Caritas und Diakonie zeigen, wo kirchliche Träger dichte Versorgungsnetze unterhalten – aber nicht, wie sich das auf öffentliche Haushalte auswirkt.\n\nEinzig die Überlagerung beider Datensätze kann zeigen, ob hohe kirchliche Sozialversorgung mit niedrigeren staatlichen Sozialausgaben in derselben Region korreliert – oder ob beide komplementär wachsen. Das Muster dahinter – Substitution oder Ergänzung – ist empirisch nur aus dem Zusammenspiel beider Quellen zu ermitteln.',
    a: { sector: 'religion', theme: 'TH_03' },
    b: { sector: 'staat',    theme: 'TH_03' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  'fa-earth-europe',
    story: 'Wie präzise könnten Klimamodelle sein, wenn sie direkt und kontinuierlich mit Rohdaten staatlicher Messstationen gespeist werden?\n\nUmweltbehörden wie der Deutsche Wetterdienst erheben laufend hochauflösende Messwerte – aber diese Daten werden wissenschaftlichen Modellen selten direkt und zeitnah zugänglich gemacht. Klimaforschungsinstitute entwickeln Modelle, die auf genau diesen Beobachtungsdaten aufbauen müssten, in der Praxis aber meist verzögert und gefiltert darauf zugreifen. Beide Seiten arbeiten mit demselben Phänomen – aber ohne systematische Rückkopplung.\n\nEine direkte Verbindung zwischen staatlichen Messdaten und wissenschaftlichen Modellierungsinfrastrukturen würde einen neuen Rückkopplungskreis erzeugen: Modellvorhersagen werden laufend mit aktuellen Messwerten abgeglichen, Abweichungen sofort sichtbar. Diese kontinuierliche Kalibrierung – die weder Behörden noch Forschung allein leisten können – ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'staat',        theme: 'TH_06' },
    b: { sector: 'wissenschaft', theme: 'TH_06' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  'fa-gavel',
    story: 'Gibt es Gesetze, die das Leben vieler Menschen verändern, ohne je öffentlich diskutiert zu werden – und lässt sich das aus dem Verhältnis von Gesetzgebungsdaten und Medienberichterstattung zeigen?\n\nGesetzgebungsdaten dokumentieren lückenlos, welche Regelungen wann und in welchem Bereich in Kraft treten – aber sie wissen nicht, ob irgendjemand davon Kenntnis nimmt. Medienarchive zeigen, wie intensiv über Gesetzgebung berichtet wird – aber nicht, wie viel tatsächlicher Regelungsoutput dahintersteht. Beide Quellen messen Gesetzgebung aus entgegengesetzten Perspektiven: eine aus dem Parlamentsbetrieb, die andere aus der öffentlichen Aufmerksamkeit.\n\nEinzig das Verhältnis beider Quellen erzeugt den eigentlichen Befund: einen Aufmerksamkeits-Index je Gesetzgebungsbereich. Wo legislative Aktivität und Medienpräsenz stark auseinandergehen, entstehen demokratische Wahrnehmungslücken. Diese Asymmetrie ist weder aus Rechtsdaten noch aus Medienarchiven allein sichtbar.',
    a: { sector: 'staat',  theme: 'TH_08' },
    b: { sector: 'medien', theme: 'TH_08' },
  },
];

// ── Filter logic ──────────────────────────────────────────────────────────────

let _index      = [];
let _ready      = false;
let _onNavigate = null;
let _currentResult = null;

export function initGenerator({ indexPromise, onNavigate }) {
  _onNavigate = onNavigate;
  indexPromise.then(idx => { _index = idx; _ready = true; });

  const modal      = document.getElementById('gen-modal');
  const closeBtn   = document.getElementById('gen-close');
  const rollBtn    = document.getElementById('gen-roll-btn');
  const triggerBtn = document.getElementById('gen-btn');

  let _trapCleanup = null;

  triggerBtn.addEventListener('click', () => {
    modal.hidden = false;
    triggerBtn.classList.add('active');
    if (!_currentResult) _doRoll();
    _trapCleanup = trapFocus(modal);
  });

  closeBtn.addEventListener('click', () => _close());
  modal.addEventListener('click', e => { if (e.target === modal) _close(); });
  rollBtn.addEventListener('click', () => _doRoll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) _close(); });

  function _close() {
    _trapCleanup?.(); _trapCleanup = null;
    modal.hidden = true;
    triggerBtn.classList.remove('active');
    triggerBtn.focus();
  }
}

function _doRoll() {
  const result   = document.getElementById('gen-result');
  const rollIcon = document.getElementById('gen-roll-icon');

  rollIcon.classList.remove('spinning');
  void rollIcon.offsetWidth;
  rollIcon.classList.add('spinning');
  rollIcon.addEventListener('animationend', () => rollIcon.classList.remove('spinning'), { once: true });

  if (!_ready) {
    result.innerHTML = '<div class="gen-empty">Daten werden noch geladen…</div>';
    return;
  }

  result.classList.add('rolling');

  setTimeout(() => {
    const r = roll();
    if (r) {
      _currentResult = r;
      _renderResult(r);
    } else {
      result.innerHTML = '<div class="gen-empty">Kein passendes Szenario gefunden.</div>';
    }
    result.classList.remove('rolling');
  }, 190);
}

function _renderResult({ scenario, entryA, entryB }) {
  document.getElementById('gen-scenario-icon').innerHTML    = `<i class="fa-solid ${scenario.icon}"></i>`;
  document.getElementById('gen-scenario-title').textContent = scenario.title;
  document.getElementById('gen-story').innerHTML = scenario.story
    .split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');

  const tilesEl = document.getElementById('gen-tiles');
  tilesEl.innerHTML = buildTile(entryA, 'a') + '<div class="gen-connector"><i class="fa-solid fa-bolt"></i></div>' + buildTile(entryB, 'b');

  tilesEl.querySelectorAll('.gen-tile').forEach(el => {
    const handler = () => {
      const entry = el.dataset.side === 'a' ? entryA : entryB;
      navigateToEntry(entry);
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function buildTile(entry, side) {
  const sectorId  = entry.breadcrumb[1]?.id ?? '';
  const meta      = SECTOR_META[sectorId] ?? { name: sectorId, color: '#888' };
  const pathParts = entry.breadcrumb
    .filter(c => c.id != null && c.level >= 2 && c.level <= 3)
    .map(c => c.name);
  const pathStr   = pathParts.join(' · ');

  return `<div class="gen-tile" data-side="${side}" style="background:${meta.color};border-color:rgba(0,0,0,0.10);" tabindex="0" role="button">
    <div class="gen-tile-sector">
      <span class="gen-tile-dot" style="background:rgba(255,255,255,0.35)"></span>
      <span class="gen-tile-sector-name">${esc(meta.name)}</span>
    </div>
    <div class="gen-tile-name">${esc(entry.tile.name)}</div>
    <div class="gen-tile-path">${esc(pathStr)}</div>
    <div class="gen-tile-arrow"><i class="fa-solid fa-arrow-right"></i></div>
  </div>`;
}

function pickFromIndex({ sector, theme, object }) {
  const pool = _index.filter(e => {
    if (e.tile.level !== 4)                                    return false;
    if (e.breadcrumb[1]?.id !== sector)                        return false;
    if (theme  && e.tile.details?.theme?.code  !== theme)      return false;
    if (object && e.tile.details?.object?.code !== object)     return false;
    return true;
  });
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function roll() {
  if (!_ready || !_index.length) return null;
  const shuffled = fisherYates(SCENARIOS);
  for (const scenario of shuffled) {
    const entryA = pickFromIndex(scenario.a);
    const entryB = pickFromIndex(scenario.b);
    if (entryA && entryB) return { scenario, entryA, entryB };
  }
  return null;
}

export function navigateToEntry(entry) {
  document.getElementById('gen-modal').hidden = true;
  document.getElementById('gen-btn').classList.remove('active');
  _onNavigate?.(entry);
}
