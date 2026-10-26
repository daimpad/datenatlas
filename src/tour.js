// Geführte Tour — Schritt für Schritt durch Karte, Detailansicht und Werkzeuge.
//
// Die Tour zeigt nicht auf Attrappen, sondern steuert die echte Karte: Sie
// öffnet einen Sektor, springt zu einem konkreten Datentyp und schließt die
// Seitenleiste wieder. Die Navigation selbst bleibt in main.js; hierher kommen
// nur die Aktionen, die die Tour braucht (`actions`), damit es keinen zweiten
// Navigationsweg gibt, der von der echten Bedienung abweichen könnte.
//
// Während die Tour läuft, fängt eine durchsichtige Fläche alle Klicks ab.
// Ein Klick auf den hervorgehobenen Statistik-Button würde sonst ein Modal
// unter oder über der Tour öffnen, und beide stritten um Fokus und Escape.
//
// Schmale Bildschirme: Viele Werkzeuge liegen dort im Menü ⋮ (siehe die
// Media-Queries am Ende von style.css). Jeder Schritt nennt deshalb eine Liste
// von Zielen; das erste sichtbare gewinnt. Landet ein Schritt auf #more-btn,
// hängt die Tour den Hinweis aufs Menü an.

import { trapFocus } from './utils.js';

// Der Beispiel-Datentyp für den Detailschritt. Bewusst einer, dessen Metadaten
// bei der Vokabular-Korrektur (S-R) einzeln geprüft wurden.
const EXAMPLE = { sector: 'kultur', org: 'museen-sammlungen', act: 'museen', leaf: 'museumsbesucher' };

const MENU = '#more-btn';
const MENU_NOTE = 'Auf schmalen Bildschirmen finden Sie das im Menü <span class="tour-kbd">⋮</span> oben rechts.';

// target: Liste von Zielen; ein Ziel ist ein Selektor oder eine Liste von
// Selektoren, deren Rechtecke zu einem gemeinsamen Spotlight vereinigt werden.
// null oder kein sichtbares Ziel → Karte mittig, ganze Seite abgedunkelt.
// withTarget: Satz, der nur erscheint, wenn das Ziel sichtbar ist — sonst
// zeigte er auf schmalen Bildschirmen auf etwas, das dort ausgeblendet ist.
const STEPS = [
  {
    title: 'Willkommen im Datenatlas',
    text: `Diese Tour zeigt Ihnen in gut einer Minute, wie die Karte aufgebaut ist,
      was ein Datentyp verrät und welche Werkzeuge es gibt.
      <br><br>Blättern Sie mit <span class="tour-kbd">→</span> und
      <span class="tour-kbd">←</span>, beenden Sie jederzeit mit
      <span class="tour-kbd">Esc</span>.`,
    target: null,
    before: a => a.home(),
  },
  {
    title: 'Die Karte',
    text: `Jede Kachel ist ein gesellschaftlicher Sektor — Staat, Wirtschaft,
      Wissenschaft, Zivilgesellschaft, Medien, Kultur, Religion und Bildung.
      Zusammen enthalten sie über zehntausend Datentypen.
      <br><br><strong>Klicken</strong> öffnet eine Kachel, <strong>Ziehen</strong>
      verschiebt die Karte, das <strong>Mausrad</strong> zoomt.`,
    textTouch: `Jede Kachel ist ein gesellschaftlicher Sektor — Staat, Wirtschaft,
      Wissenschaft, Zivilgesellschaft, Medien, Kultur, Religion und Bildung.
      Zusammen enthalten sie über zehntausend Datentypen.
      <br><br><strong>Tippen</strong> öffnet eine Kachel, <strong>Wischen</strong>
      verschiebt die Karte, mit <strong>zwei Fingern</strong> zoomen Sie.`,
    target: ['#map-canvas'],
    placement: 'center',
  },
  {
    title: 'Wie offen könnten diese Daten sein?',
    text: `Das ist die Kernfrage des Atlas. Jeder Datentyp trägt eine Öffnungsklasse:
      <br><span class="tour-dot" style="background:#27ae60"></span><strong>Grün</strong> — sofort als Open Data publizierbar
      <br><span class="tour-dot" style="background:#d4a017"></span><strong>Gelb</strong> — nach Anonymisierung oder Aggregation
      <br><span class="tour-dot" style="background:#c0392b"></span><strong>Rot</strong> — nur die Beschreibung, nicht der Inhalt`,
    target: ['#openness-legend'],
    placement: 'top',
  },
  {
    title: 'Einen Sektor öffnen',
    text: `Die Tour hat für Sie den Sektor <strong>Kultur</strong> geöffnet. Die
      Kacheln sind jetzt die Organisationstypen darin — Museen, Theater,
      Archive, Bibliotheken.
      <br><br>Die Pfadleiste oben zeigt, wo Sie gerade sind. Jeder Eintrag darin
      ist anklickbar und bringt Sie dorthin zurück.`,
    target: ['#breadcrumb'],
    placement: 'bottom',
    before: a => a.openSector(EXAMPLE.sector),
  },
  {
    title: 'Vier Ebenen tief',
    text: `Der Atlas ist in vier Ebenen gegliedert:
      <ol class="tour-list">
        <li><strong>Sektor</strong> — wer die Daten produziert</li>
        <li><strong>Organisation</strong> — etwa Museum oder Gesundheitsamt</li>
        <li><strong>Aktivität</strong> — was diese Organisation tut</li>
        <li><strong>Datentyp</strong> — welche Daten dabei entstehen</li>
      </ol>`,
    withTarget: 'Die Anzeige oben links sagt Ihnen, auf welcher Ebene Sie sind.',
    target: ['#level-overlay'],
    placement: 'right',
  },
  {
    title: 'Ein Datentyp im Detail',
    text: `Ein Klick auf einen Datentyp öffnet diese Detailansicht — hier die
      <strong>Museumsbesucher-Statistik</strong>. Sie zeigt:
      <ul class="tour-list">
        <li>die <strong>Öffnungsklasse mit Begründung</strong>, was gezählt wird und was nicht</li>
        <li><strong>Metadaten</strong> — Thema, Format, Lizenz, Granularität</li>
        <li><strong>Ähnliche Datensätze</strong> aus anderen Sektoren</li>
        <li>die <strong>Prozesse</strong>, in denen die Daten genutzt werden</li>
      </ul>`,
    target: ['#sidebar'],
    placement: 'left',
    before: a => a.openExample(EXAMPLE),
  },
  {
    title: 'Zurück und zur Übersicht',
    text: `Mit dem Pfeil gehen Sie eine Ebene zurück, das Haus bringt Sie zur
      Übersicht aller Sektoren. Ein Klick aufs Logo tut dasselbe.`,
    target: ['#controls-bar'],
    placement: 'right',
    before: a => a.closeSidebar(),
  },
  {
    title: 'Suchen statt klicken',
    text: `Die Suche findet Datentypen über alle Sektoren hinweg — nach Namen und
      nach dem Pfad aus Sektor, Organisation und Aktivität.
      <br><br>Im Ergebnis lässt sich die <strong>Tiefensuche</strong> zuschalten,
      die auch die Beschreibungen durchsucht. Sobald ein Suchbegriff eingegeben
      ist, erscheint daneben ein <strong>Filter</strong>, der die Ergebnisse auf
      eine Öffnungsklasse eingrenzt.`,
    target: ['#search-toggle'],
    placement: 'bottom',
  },
  {
    title: 'Teilen und exportieren',
    text: `<strong>Teilen</strong> kopiert einen Link genau zu der Ansicht, die Sie
      gerade sehen — jede Ebene hat ihre eigene Adresse.
      <br><br><strong>Export</strong> lädt die sichtbaren Datentypen als CSV-Datei
      herunter, direkt im Browser.`,
    target: [['#share-btn', '#export-btn'], MENU],
    placement: 'bottom',
  },
  {
    title: 'Statistik und Zeitachse',
    text: `Die <strong>Statistik</strong> zeigt, wie sich Grün, Gelb und Rot auf die
      Sektoren verteilen — welcher Bereich am offensten ist.
      <br><br>Die <strong>Zeitachse</strong> zeigt, seit wann Daten verfügbar sind
      und wie oft sie aktualisiert werden.`,
    target: [['#stats-btn', '#timeline-btn'], MENU],
    placement: 'bottom',
  },
  {
    title: 'Daten kombinieren',
    text: `Der Datenkombinator stellt Datentypen aus verschiedenen Sektoren
      nebeneinander und zeigt, welche Erkenntnis erst aus ihrer Verknüpfung
      entsteht. Jeder Wurf ist ein anderes Szenario.`,
    target: ['#gen-btn', MENU],
    placement: 'bottom',
  },
  {
    title: 'Eigene Daten öffnen',
    text: `Sie wollen selbst Daten veröffentlichen? Der Leitfaden führt in fünf
      Schritten zu einer Empfehlung für Öffnungsklasse, Lizenz und
      Veröffentlichungsweg.
      <br><br>Aus jeder Detailansicht lässt er sich auch direkt für den
      jeweiligen Datentyp starten.`,
    target: ['#open-data-btn', MENU],
    placement: 'bottom',
  },
  {
    title: 'Mehr erfahren',
    text: `Hier steht alles noch einmal ausführlich — Sektoren, Ebenen,
      Öffnungsklassen und Werkzeuge. Von dort können Sie diese Tour auch jederzeit
      neu starten.`,
    target: ['#info-btn', MENU],
    placement: 'bottom',
  },
  {
    title: 'Jetzt sind Sie dran',
    text: `Das war der Rundgang. Die Karte steht wieder auf der Übersicht —
      wählen Sie einen Sektor, der Sie interessiert, und erkunden Sie, welche
      Daten dort entstehen.`,
    target: null,
    before: a => a.home(),
  },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function isVisible(el) {
  if (!el || el.hidden) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
}

// Erstes sichtbares Ziel → { rect, viaMenu } oder null.
function resolveTarget(target) {
  for (const t of target ?? []) {
    const sels = Array.isArray(t) ? t : [t];
    const els  = sels.map(s => document.querySelector(s)).filter(isVisible);
    if (!els.length) continue;
    const rs = els.map(e => e.getBoundingClientRect());
    const rect = {
      left:   Math.min(...rs.map(r => r.left)),
      top:    Math.min(...rs.map(r => r.top)),
      right:  Math.max(...rs.map(r => r.right)),
      bottom: Math.max(...rs.map(r => r.bottom)),
    };
    return { rect, viaMenu: sels.includes(MENU) };
  }
  return null;
}

export function initTour({ actions }) {
  const root = document.createElement('div');
  root.id = 'tour';
  root.hidden = true;
  root.innerHTML = `
    <div class="tour-shield"></div>
    <div class="tour-spot" aria-hidden="true"></div>
    <div class="tour-pop" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-text">
      <div class="tour-head">
        <span class="tour-count" id="tour-count"></span>
        <button type="button" class="tour-skip" data-tour="end">Tour beenden</button>
      </div>
      <div class="tour-progress" aria-hidden="true"><span class="tour-progress-fill"></span></div>
      <h2 class="tour-title" id="tour-title"></h2>
      <div class="tour-text" id="tour-text"></div>
      <div class="tour-nav">
        <button type="button" class="tour-btn tour-btn--ghost" data-tour="prev">← Zurück</button>
        <button type="button" class="tour-btn tour-btn--primary" data-tour="next">Weiter →</button>
      </div>
    </div>`;
  document.getElementById('app').appendChild(root);

  const spot  = root.querySelector('.tour-spot');
  const pop   = root.querySelector('.tour-pop');
  const count = root.querySelector('#tour-count');
  const fill  = root.querySelector('.tour-progress-fill');
  const title = root.querySelector('#tour-title');
  const text  = root.querySelector('#tour-text');
  const prevB = root.querySelector('[data-tour="prev"]');
  const nextB = root.querySelector('[data-tour="next"]');

  const touch = matchMedia('(hover: none)').matches;

  let index = -1;
  let token = 0;          // jeder Schrittwechsel bekommt eine Marke; ältere brechen ab
  let target = null;      // aktueller Schritt-Target (für Resize und Mitlaufen)
  let followUntil = 0;
  let trapCleanup = null;
  let returnFocus = null;

  root.addEventListener('click', e => {
    const act = e.target.closest('[data-tour]')?.dataset.tour;
    if (act === 'next') go(index + 1);
    if (act === 'prev') go(index - 1);
    if (act === 'end')  end();
  });

  // Capture-Phase: Die Tour kommt vor der Kartensteuerung (Pfeiltasten) und
  // vor den Escape-Handlern der Modals an die Tasten.
  document.addEventListener('keydown', e => {
    if (root.hidden) return;
    if (e.key === 'Escape')     { e.preventDefault(); e.stopPropagation(); end(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); e.stopPropagation(); if (index > 0) go(index - 1); }
  }, true);

  addEventListener('resize', () => { if (!root.hidden) position(); });

  async function start() {
    if (!root.hidden) return;
    returnFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add('tour-active');
    trapCleanup = trapFocus(pop, { initialFocus: false });
    await actions.ready();
    go(0);
  }

  function end() {
    token++;
    trapCleanup?.(); trapCleanup = null;
    root.hidden = true;
    document.body.classList.remove('tour-active');
    index = -1;
    // Gestartet aus Onboarding oder Menü — beide sind inzwischen zu.
    const back = isVisible(returnFocus) ? returnFocus : document.getElementById('map-canvas');
    back?.focus?.();
  }

  async function go(i) {
    if (i >= STEPS.length) return end();
    if (i < 0) return;
    const my = ++token;
    const step = STEPS[i];
    index = i;

    pop.dataset.busy = 'true';
    prevB.disabled = nextB.disabled = true;
    try {
      if (step.before) { await step.before(actions); await sleep(60); }
    } catch (err) {
      console.error('Tour-Schritt fehlgeschlagen:', err);
    }
    if (my !== token) return;

    target = step.target;
    const hit = resolveTarget(target);
    const body = (touch && step.textTouch) || step.text;

    count.textContent = `Schritt ${i + 1} von ${STEPS.length}`;
    fill.style.width  = `${((i + 1) / STEPS.length) * 100}%`;
    title.textContent = step.title;
    text.innerHTML    = body
      + (hit && step.withTarget ? `<p class="tour-after">${step.withTarget}</p>` : '')
      + (hit?.viaMenu ? `<p class="tour-note">${MENU_NOTE}</p>` : '');
    prevB.hidden      = i === 0;
    nextB.textContent = i === STEPS.length - 1 ? 'Los geht’s' : (i === 0 ? 'Tour starten →' : 'Weiter →');

    pop.dataset.place = step.placement ?? 'bottom';
    delete pop.dataset.busy;
    prevB.disabled = nextB.disabled = false;
    nextB.focus();

    // Seitenleiste und Kachel-Animation bewegen das Ziel noch eine Weile;
    // so lange läuft der Spotlight mit, statt an der Startposition zu kleben.
    followUntil = performance.now() + 650;
    follow(my);
  }

  function follow(my) {
    if (my !== token || root.hidden) return;
    position();
    if (performance.now() < followUntil) requestAnimationFrame(() => follow(my));
  }

  function position() {
    const hit = resolveTarget(target);
    const vw = innerWidth, vh = innerHeight;
    const PAD = 6;

    if (!hit) {
      Object.assign(spot.style, { left: `${vw / 2}px`, top: `${vh / 2}px`, width: '0px', height: '0px' });
      spot.dataset.empty = 'true';
      placePop(null, vw, vh);
      return;
    }
    delete spot.dataset.empty;
    const r = hit.rect;
    const box = {
      left:   Math.max(4, r.left - PAD),
      top:    Math.max(4, r.top - PAD),
      right:  Math.min(vw - 4, r.right + PAD),
      bottom: Math.min(vh - 4, r.bottom + PAD),
    };
    Object.assign(spot.style, {
      left: `${box.left}px`, top: `${box.top}px`,
      width: `${box.right - box.left}px`, height: `${box.bottom - box.top}px`,
    });
    placePop(box, vw, vh);
  }

  // Bevorzugte Seite zuerst, dann die übrigen; passt keine, an den Rand, der
  // vom Ziel am weitesten weg ist. „center" heißt: mittig über dem Ziel — für
  // die Karte selbst, die fast den ganzen Bildschirm einnimmt.
  function placePop(box, vw, vh) {
    const M = 12, G = 14;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const clampX = x => Math.min(Math.max(M, x), vw - pw - M);
    const clampY = y => Math.min(Math.max(M, y), vh - ph - M);

    if (!box || pop.dataset.place === 'center') {
      pop.style.left = `${clampX((vw - pw) / 2)}px`;
      pop.style.top  = `${clampY((vh - ph) / 2)}px`;
      return;
    }

    const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
    const cand = {
      bottom: { x: cx - pw / 2,          y: box.bottom + G,        ok: box.bottom + G + ph <= vh - M },
      top:    { x: cx - pw / 2,          y: box.top - G - ph,      ok: box.top - G - ph >= M },
      right:  { x: box.right + G,        y: cy - ph / 2,           ok: box.right + G + pw <= vw - M },
      left:   { x: box.left - G - pw,    y: cy - ph / 2,           ok: box.left - G - pw >= M },
    };
    const order = [pop.dataset.place, 'bottom', 'top', 'right', 'left'];
    const pick = order.map(k => cand[k]).find(c => c?.ok);
    if (pick) {
      pop.style.left = `${clampX(pick.x)}px`;
      pop.style.top  = `${clampY(pick.y)}px`;
      return;
    }
    // Kein Platz daneben: Die Karte muss das Ziel überdecken. Bei großen
    // Zielen — der Detailansicht als Bottom-Sheet auf dem Smartphone — steht
    // das Wichtige oben (Titel, Öffnungsklasse), also unten andocken. Bei
    // kleinen Zielen an den Rand, der am weitesten weg ist.
    const big = box.bottom - box.top > vh / 2;
    pop.style.left = `${clampX((vw - pw) / 2)}px`;
    pop.style.top  = `${big || cy <= vh / 2 ? vh - ph - M : M}px`;
  }

  return { start, end, get active() { return !root.hidden; } };
}
