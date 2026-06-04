// ── Cross-Sector-Fusion-Generator ─────────────────────────────────────────────
import { esc } from './utils.js';

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
    story: 'Was wird sichtbar, wenn staatliche Klimamessdaten und wirtschaftliche Finanzdaten auf kommunaler Ebene zusammengeführt werden?\n\nDer Deutsche Wetterdienst und das Umweltbundesamt erfassen kleinräumig Extremwetterereignisse, Hitzebelastung und Überflutungswahrscheinlichkeiten. Unternehmensbilanzen und Branchenstatistiken zeigen, welche wirtschaftlichen Aktivitäten wo stattfinden und wie stark einzelne Branchen von Klimaeinflüssen betroffen sein könnten.\n\nEine Verknüpfung beider Quellen könnte kommunalen Planungsbehörden differenziertere Grundlagen für Klimaanpassungsstrategien bieten. Für Versicherungen und Investoren würde sie eine kleinräumige Risikobeurteilung ermöglichen, die über heutige Aggregatmodelle deutlich hinausgeht.',
    a: { sector: 'staat',      theme: 'TH_06' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  'fa-chart-line',
    story: 'Welche messbaren wirtschaftlichen Effekte haben öffentliche Bildungsinvestitionen – und für welche Qualifikationswege lassen sie sich am klarsten zeigen?\n\nDas Nationale Bildungspanel (NEPS) verfolgt Bildungsbiografien über lange Zeiträume. Wirtschaftsdaten aus Unternehmensregistern und Branchenstatistiken zeigen, welche Qualifikationsprofile in welchen Sektoren nachgefragt werden und wie sich Einkommensentwicklungen über Berufsverläufe gestalten.\n\nEine Verknüpfung beider Quellen könnte zeigen, welche Bildungsinvestitionen besonders wirksam in Beschäftigung und Steuerzahlungen übersetzen. Bestehende OECD-Schätzungen weisen private Bildungsrenditen von fünf bis zwölf Prozent jährlich aus – auf deutschen Mikrodaten basierende Berechnungen könnten diese Zahlen regional und qualifikationsspezifisch präzisieren.',
    a: { sector: 'wissenschaft', theme: 'TH_02' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  'fa-map',
    story: 'Wo decken sich amtliche Sozialdaten mit den Beobachtungen zivilgesellschaftlicher Beratungsstellen – und welche Problemlagen tauchen nur in einer der beiden Quellen auf?\n\nStatistische Ämter und die Bundesagentur für Arbeit erfassen Grundsicherungsquoten, Arbeitslosigkeit und Wohnraumversorgung auf Kreis- und Gemeindeebene. Beratungsstatistiken von Schuldnerberatungsstellen und Wohlfahrtsverbänden dokumentieren konkrete Bedarfslagen aus dem direkten Kontakt mit Betroffenen – oft früher und detaillierter als amtliche Erhebungen.\n\nEine Zusammenführung beider Perspektiven könnte zeigen, welche sozialen Problemlagen amtliche Statistiken unter- oder überrepräsentieren. Das wäre eine Grundlage dafür, präventive Maßnahmen gezielter und früher anzusetzen.',
    a: { sector: 'staat',             theme: 'TH_03' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  'fa-church',
    story: 'Wie vollständig ist das Bild kommunaler Sozialinfrastruktur, wenn die Standorte religiöser Träger in der Planung nicht berücksichtigt werden?\n\nReligiöse Träger – Caritas, Diakonie, jüdische Wohlfahrt und viele kleinere Gemeinden – betreiben Kindertagesstätten, Hospize, Pflegeeinrichtungen und Beratungsstellen. Kommunale Geodaten erfassen staatliche und öffentliche Einrichtungen, nicht aber den vollständigen Standort kirchlicher Sozialinfrastruktur.\n\nEine Überlagerung beider Geodatensätze könnte zeigen, wie dicht religiöse Träger das soziale Versorgungsnetz in bestimmten Regionen ergänzen. Daraus ließen sich Kooperationspotenziale zwischen kommunaler Planung und konfessionellen Trägern ableiten – eine sachliche Grundlage für informierte Daseinsvorsorgeplanung.',
    a: { sector: 'religion', object: 'OB_05' },
    b: { sector: 'staat',    object: 'OB_05' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  'fa-leaf',
    story: 'Lassen sich wirtschaftliche Aktivitäten und Biodiversitätstrends räumlich in Beziehung setzen – und welche Muster würden dabei sichtbar?\n\nWissenschaftliche Artenerfassungen dokumentieren räumlich differenziert, wie es um biologische Vielfalt in verschiedenen Regionen bestellt ist – von Florenkartierungen der Bundesländer bis zu Insektenmonitoring-Programmen. Wirtschaftliche Flächennutzungs- und Standortdaten zeigen, welche Branchen in diesen Regionen tätig sind und wie intensiv Flächen genutzt werden.\n\nEine kombinierte Auswertung könnte Zusammenhänge zwischen wirtschaftlicher Tätigkeit und Biodiversitätstrends aufzeigen. Das wäre eine empirische Grundlage für Unternehmen, die regulatorische Anforderungen wie die EU-Taxonomieverordnung mit belastbaren Regionaldaten unterlegen wollen – und für Natural Capital Accounting im Sinne der SEEA- und TNFD-Rahmenwerke.',
    a: { sector: 'wissenschaft', theme: 'TH_09' },
    b: { sector: 'wirtschaft',   theme: 'TH_04' },
  },
  {
    id:    'medienspiegel-gesellschaft',
    title: 'Medienspiegel der Gesellschaft',
    icon:  'fa-newspaper',
    story: 'Spiegelt die öffentliche Berichterstattung die sozialen Problemlagen wider, die amtliche Statistiken messen – und gibt es systematische Unterschiede zwischen beiden Quellen?\n\nStatistische Ämter und die Bundesagentur für Arbeit erfassen Armutsgefährdung, Obdachlosigkeit und Grundsicherungsbezug auf regionalem Niveau. Medienarchive dokumentieren, wie intensiv und aus welcher Perspektive über soziale Themen berichtet wird. Mit NLP-Methoden lassen sich heute große Textkorpora effizient auswerten.\n\nEin datengestützter Abgleich beider Quellen könnte zeigen, welche sozialen Entwicklungen medial früh aufgegriffen werden und welche weniger Aufmerksamkeit erhalten. Für Journalismus, Sozialforschung und Medienpolitik wären solche Muster gleichermassen interessant.',
    a: { sector: 'medien', theme: 'TH_03' },
    b: { sector: 'staat',  theme: 'TH_03' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  'fa-hospital',
    story: 'Wo reicht gute Versorgungsdichte allein nicht aus – und welche Bevölkerungsgruppen erreichen das Gesundheitssystem trotz vorhandener Angebote seltener?\n\nKassenärztliche Vereinigungen und das Bundesamt für Soziale Sicherung dokumentieren die Versorgungsdichte ambulanter und stationärer Einrichtungen nach Planungsbereichen. Beratungsstatistiken von Sozialverbänden und Migrationsberatungsstellen zeigen, wo Menschen beim Zugang zu Gesundheitsleistungen Unterstützung benötigen – ein Hinweis auf Zugangshürden, die in GKV-Abrechnungsdaten nicht sichtbar sind.\n\nEine Kombination dieser Quellen könnte Regionen und Bevölkerungsgruppen identifizieren, bei denen Zugangshürden besonders wirksam sind. Das könnte Grundlage für Versorgungsmodelle sein, die über reine Kapazitätsplanung hinausgehen.',
    a: { sector: 'staat',             theme: 'TH_01' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  'fa-scale-balanced',
    story: 'Wie unterscheidet sich die Qualität finanzieller Offenlegung zwischen öffentlichem Sektor und Privatwirtschaft – und lässt sich das systematisch vergleichen?\n\nKommunale Jahresabschlüsse sind über Amtsblätter zugänglich, Unternehmensabschlüsse über das Bundesanzeiger-Register. Beide Datensätze sind prinzipiell öffentlich, unterscheiden sich aber in Format, Aktualität und Detailgrad erheblich.\n\nEin systematischer Vergleich nach einheitlichen Kriterien – Vollständigkeit, Aktualität, Maschinenlesbarkeit – könnte zeigen, welche Arten von Institutionen wie transparent berichten. Für Forschung, Journalismus und zivilgesellschaftliche Kontrolle wäre eine solche Vergleichsgrundlage ein nützliches Werkzeug. Europäische Ansätze wie OpenTED und Open Spending zeigen, wie ein solcher Vergleich strukturell gestaltet werden könnte.',
    a: { sector: 'staat',      theme: 'TH_07' },
    b: { sector: 'wirtschaft', theme: 'TH_07' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  'fa-microscope',
    story: 'Welche wissenschaftlichen Erkenntnisse kommen bei zivilgesellschaftlichen Bildungsträgern an – und zu welchen Themen wäre mehr Transfer nützlich?\n\nForschungsdatenbanken wie das GEPRIS der DFG oder das CORDIS-System der EU dokumentieren Projekte und Publikationen nach Themen und Institutionen. Bildungsträger – Volkshochschulen, außerschulische Einrichtungen, Wohlfahrtsverbände – beschreiben in Jahresprogrammen und Konzepten, welche Inhalte sie vermitteln und welche Fragen sie bewegen.\n\nEin systematischer Abgleich beider Quellen könnte zeigen, wo Forschungsthemen und gesellschaftlicher Bildungsbedarf zusammentreffen – und wo Potenzial für engere Verbindungen zwischen Wissenschaft und Praxis besteht. Research-Practice Gaps sind in der Bildungsforschung methodisch gut beschrieben; für den deutschen Kontext wären datengestützte Befunde besonders aufschlussreich.',
    a: { sector: 'wissenschaft',      theme: 'TH_10' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  'fa-handshake',
    story: 'Welchen quantifizierbaren Beitrag leisten konfessionelle Träger zur sozialen Versorgung – und in welchem Verhältnis steht er zu staatlichen Sozialleistungen?\n\nCaritas, Diakonie und weitere konfessionelle Wohlfahrtsverbände betreiben Einrichtungen und erbringen Dienstleistungen, die teils durch staatliche Zuwendungen kofinanziert werden. Statistiken der Bundesarbeitsgemeinschaft der Freien Wohlfahrtspflege (BAGFW) und des Statistischen Bundesamts zu öffentlichen Sozialausgaben erfassen beide Seiten dieses Arrangements.\n\nEine systematische Gegenüberstellung könnte zeigen, in welchen Versorgungsbereichen konfessionelle und staatliche Leistungen komplementär wirken. Das wäre eine sachliche Grundlage für die Diskussion über Finanzierung und Steuerung sozialer Daseinsvorsorge – relevant für Kommunen, Wohlfahrtsverbände und Sozialpolitik gleichermaßen.',
    a: { sector: 'religion', theme: 'TH_03' },
    b: { sector: 'staat',    theme: 'TH_03' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  'fa-earth-europe',
    story: 'Was würde möglich, wenn Rohdaten staatlicher Umweltmessnetze und wissenschaftliche Klimamodelle systematisch verbunden werden?\n\nDer Deutsche Wetterdienst, das Umweltbundesamt und die Messnetze der Landesumweltämter erheben kontinuierlich hochauflösende Umweltdaten. Klimaforschungsinstitute wie das MPI für Meteorologie und das Potsdam-Institut für Klimafolgenforschung entwickeln Modelle, die auf validierten Beobachtungsdaten aufbauen.\n\nEine standardisierte Schnittstelle zwischen beiden Infrastrukturen könnte die Validierungsqualität von Klimamodellen verbessern und die Reaktionsgeschwindigkeit bei Extremereignissen erhöhen. Europäische Standards wie die INSPIRE-Richtlinie und der Copernicus Climate Data Store schaffen dafür bereits wesentliche technische Voraussetzungen.',
    a: { sector: 'staat',        theme: 'TH_06' },
    b: { sector: 'wissenschaft', theme: 'TH_06' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  'fa-gavel',
    story: 'Welche Gesetzgebungsvorhaben erhalten mehr öffentliche Aufmerksamkeit als andere – und lässt sich das datengestützt messen?\n\nBundestag und Bundesregierung veröffentlichen Drucksachen, Plenarprotokolle und Gesetzgebungsdaten als maschinenlesbare Datensätze. Medienarchive dokumentieren die journalistische Berichterstattung über politische und rechtliche Entwicklungen – ein Datenschatz, der sich mit heutigen Textanalyseverfahren systematisch auswerten lässt.\n\nEin Abgleich beider Quellen könnte zeigen, welche Arten von Gesetzen intensiv diskutiert werden und welche ohne breite öffentliche Wahrnehmung in Kraft treten. Für Journalismus, Politikwissenschaft und demokratische Bildungsarbeit wäre das eine interessante Analyseperspektive.',
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

  triggerBtn.addEventListener('click', () => {
    modal.hidden = false;
    triggerBtn.classList.add('active');
    if (!_currentResult) _doRoll();
  });

  closeBtn.addEventListener('click', () => _close());
  modal.addEventListener('click', e => { if (e.target === modal) _close(); });
  rollBtn.addEventListener('click', () => _doRoll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) _close(); });

  function _close() {
    modal.hidden = true;
    triggerBtn.classList.remove('active');
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

export function roll() {
  if (!_ready || !_index.length) return null;
  const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
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
