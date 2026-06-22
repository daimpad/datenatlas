// ── "Daten öffnen" Step-by-Step Wizard ───────────────────────────────────────
import { trapFocus } from './utils.js';

// Atlas sector ID → wizard sector
const SECTOR_MAP = {
  staat: 'public', wirtschaft: 'private', wissenschaft: 'research',
  zivilgesellschaft: 'civil', medien: 'private', religion: 'civil',
  bildung: 'public',
};

// Recommended license per sector × data type
const LICENSE_REC = {
  public:   { factual: 'CC0',    creative: 'DLD'   },
  research: { factual: 'CC0',    creative: 'CC_BY'  },
  civil:    { factual: 'CC0',    creative: 'CC_BY'  },
  private:  { factual: 'CC0',    creative: 'CC_BY'  },
};

let _openWizardWithContext = null;

export function openWizardWithContext(ctx) {
  _openWizardWithContext?.(ctx);
}

export function initWizard() {
  const modal    = document.getElementById('wizard-modal');
  const bodyEl   = document.getElementById('wz-body');
  const closeBtn = document.getElementById('wz-close');
  const openBtn  = document.getElementById('open-data-btn');

  if (!modal) return;

  // ── State ──────────────────────────────────────────────────────────────────
  const st = {
    step:          1,
    sector:        null,   // 'public' | 'civil' | 'research' | 'private'
    firstTime:     null,   // true | false
    dataType:      null,   // 'factual' | 'creative'
    stage2checks:  new Set(),
    license:       null,   // 'CC0' | 'CC_BY' | 'CC_BY_SA' | 'DLD'
    hasRights:     null,   // 'yes' | 'unclear' | 'no'
    publishMethod: null,   // 'catalog' | 'repo' | 'platform' | 'api' | 'own'
    context:       null,   // { tileName, displayPath } when opened from sidebar
  };

  function resetState(ctx = null) {
    st.step = 1; st.firstTime = null;
    st.dataType = null; st.stage2checks = new Set();
    st.license = null; st.hasRights = null; st.publishMethod = null;
    st.context = ctx ?? null;
    st.sector = ctx ? (SECTOR_MAP[ctx.sectorId] ?? null) : null;
  }

  // ── Open / Close ──────────────────────────────────────────────────────────
  let _trapCleanup = null;
  let _wizardOpener = null;

  function openWizard(ctx = null) {
    _wizardOpener = document.activeElement;
    resetState(ctx);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    renderStep();
    _trapCleanup = trapFocus(modal);
  }

  function closeWizard() {
    _trapCleanup?.(); _trapCleanup = null;
    modal.hidden = true;
    document.body.style.overflow = '';
    (_wizardOpener ?? openBtn)?.focus();
    _wizardOpener = null;
  }

  _openWizardWithContext = (ctx) => openWizard(ctx);

  openBtn?.addEventListener('click', () => openWizard(null));
  closeBtn.addEventListener('click', closeWizard);
  modal.addEventListener('click', e => { if (e.target === modal) closeWizard(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeWizard();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────
  modal.addEventListener('click', e => {
    if (e.target.id === 'wz-back' || e.target.closest('#wz-back')) {
      if (st.step > 1) { st.step--; renderStep(); }
      return;
    }
    if (e.target.id === 'wz-next' || e.target.closest('#wz-next')) {
      if (!canProceed()) return;
      if (st.step < 5) { st.step++; renderStep(); }
      else closeWizard();
      return;
    }
    handleOptionClick(e);
  });

  function canProceed() {
    switch (st.step) {
      case 1: return st.sector !== null && (st.firstTime !== null || st.context !== null);
      case 2: return true;
      case 3: return st.dataType !== null && st.hasRights !== null;
      case 4: return st.publishMethod !== null;
      case 5: return true;
      default: return false;
    }
  }

  // ── Option click delegation ────────────────────────────────────────────────
  function handleOptionClick(e) {
    const opt = e.target.closest('.wz-opt');
    if (!opt) return;

    if (opt.dataset.sector !== undefined) {
      st.sector = opt.dataset.sector;
      selectIn(opt, '[data-sector]');
    } else if (opt.dataset.first !== undefined) {
      st.firstTime = opt.dataset.first === 'true';
      selectIn(opt, '[data-first]');
    } else if (opt.dataset.dtype !== undefined) {
      st.dataType = opt.dataset.dtype;
      selectIn(opt, '[data-dtype]');
      renderS3Branch();
    } else if (opt.dataset.license !== undefined) {
      st.license = opt.dataset.license;
      selectIn(opt, '[data-license]');
    } else if (opt.dataset.rights !== undefined) {
      st.hasRights = opt.dataset.rights;
      selectIn(opt, '[data-rights]');
    } else if (opt.dataset.publish !== undefined) {
      st.publishMethod = opt.dataset.publish;
      selectIn(opt, '[data-publish]');
    }

    updateNav();
  }

  function selectIn(active, selector) {
    bodyEl.querySelectorAll(`.wz-opt${selector}`)
      .forEach(o => o.classList.toggle('selected', o === active));
  }

  // ── Stage 2 checkbox toggle ────────────────────────────────────────────────
  modal.addEventListener('change', e => {
    if (e.target.classList.contains('wz-check')) {
      const idx = +e.target.dataset.idx;
      if (e.target.checked) st.stage2checks.add(idx);
      else st.stage2checks.delete(idx);
    }
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  function renderStep() {
    const renderers = [null, renderS1, renderS2, renderS3, renderS4, renderS5];
    bodyEl.innerHTML = '';
    if (st.context) bodyEl.appendChild(renderContextBanner());
    bodyEl.appendChild(renderers[st.step]());
    updateProgress();
    updateNav();
    bodyEl.scrollTop = 0;
  }

  function renderContextBanner() {
    const el = document.createElement('div');
    el.className = 'wz-context-banner';
    el.innerHTML = `
      <span class="wz-context-icon">◈</span>
      <span>Kontext: <strong>${st.context.tileName}</strong>
        ${st.context.displayPath ? `<span class="wz-context-path">· ${st.context.displayPath}</span>` : ''}
      </span>`;
    return el;
  }

  function updateProgress() {
    document.getElementById('wz-progress-fill').style.width = `${(st.step / 5) * 100}%`;
    document.getElementById('wz-step-label').textContent = `Schritt ${st.step} von 5`;
  }

  function updateNav() {
    const back = document.getElementById('wz-back');
    const next = document.getElementById('wz-next');
    back.hidden = st.step === 1;
    next.textContent = st.step === 5 ? 'Schließen' : 'Weiter →';
    next.disabled    = !canProceed();
    next.classList.toggle('wz-btn--ready', canProceed());
  }

  // ── Step 1 — Organisatorischer Kontext ────────────────────────────────────
  function renderS1() {
    const el = div('wz-step');
    el.innerHTML = `
      <h2 class="wz-h">Öffnungspotenzial eigener Daten ermitteln</h2>
      <p class="wz-p">Damit dieser Leitfaden die richtigen Empfehlungen gibt, brauchen wir einen kurzen Kontext. Die Antworten steuern, welche Lizenz- und Publikationswege in den nächsten Schritten erscheinen.</p>

      <h3 class="wz-subh">1. In welchem Bereich sind Sie tätig?</h3>
      <div class="wz-opts wz-opts--2">
        ${opt('sector','public',   '<i class="fa-solid fa-landmark"></i>',   'Öffentliche Verwaltung',      'Behörden, Ämter, staatliche Einrichtungen auf Bundes-, Landes- oder kommunaler Ebene.',            st.sector === 'public')}
        ${opt('sector','civil',    '<i class="fa-solid fa-handshake"></i>',  'Zivilgesellschaft & NGOs',     'Vereine, Verbände, gemeinnützige Organisationen, soziale Träger.',                                  st.sector === 'civil')}
        ${opt('sector','research', '<i class="fa-solid fa-microscope"></i>', 'Forschung & Wissenschaft',     'Universitäten, Forschungsinstitute, Akademien und Förderorganisationen.',                           st.sector === 'research')}
        ${opt('sector','private',  '<i class="fa-solid fa-building"></i>',   'Privatwirtschaft',             'Unternehmen, die aus eigener Initiative oder gesetzlicher Anforderung Daten öffnen.',              st.sector === 'private')}
      </div>

      <h3 class="wz-subh">2. Welcher Schritt ist das für Sie?</h3>
      <div class="wz-opts wz-opts--2">
        ${opt('first','true',  '<i class="fa-solid fa-seedling"></i>',    'Erstmalige Datenöffnung',     'Wir haben bislang keine Open Data veröffentlicht und möchten damit beginnen.',  st.firstTime === true)}
        ${opt('first','false', '<i class="fa-solid fa-chart-line"></i>', 'Bestehendes Angebot erweitern', 'Wir veröffentlichen bereits Daten und möchten Umfang oder Qualität ausbauen.', st.firstTime === false)}
      </div>
    `;
    return el;
  }

  // ── Step 2 — Datensatz-Auswahl ────────────────────────────────────────────
  function renderS2() {
    const prompts = [
      { label: 'Nachfrage erkennbar',        text: 'Es gibt Hinweise, dass Externe (Journalisten, Entwickler, Forschende) diese Daten bereits nachgefragt haben oder nutzen würden.' },
      { label: 'Öffentliche Finanzierung',   text: 'Die Erhebung dieser Daten wurde mit öffentlichen Mitteln oder im Rahmen eines öffentlichen Auftrags finanziert.' },
      { label: 'Mehrwert für Dritte',        text: 'Dritte könnten auf Basis dieser Daten eigene Produkte, Dienste oder Analysen entwickeln, die über unsere Möglichkeiten hinausgehen.' },
      { label: 'Geringe Aufbereitungskosten', text: 'Die Daten können ohne aufwändige Bearbeitung (Anonymisierung, Formatkonvertierung, Rechtsklärung) bereitgestellt werden.' },
      { label: 'Vergleichbare Praxis',       text: 'Andere Organisationen ähnlichen Typs haben vergleichbare Daten bereits veröffentlicht, ohne negative Konsequenzen zu berichten.' },
    ];

    const checks = prompts.map((p, i) => `
      <label class="wz-check-row">
        <input type="checkbox" class="wz-check" data-idx="${i}" ${st.stage2checks.has(i) ? 'checked' : ''}>
        <span class="wz-check-body">
          <strong class="wz-check-label">${i + 1}. ${p.label}</strong>
          <span class="wz-check-text">${p.text}</span>
        </span>
      </label>
    `).join('');

    const el = div('wz-step');
    el.innerHTML = `
      <h2 class="wz-h">Welche Daten öffnen?</h2>
      <p class="wz-p">Der häufigste Fehler bei der Datenpublikation ist nicht zu viel Offenheit, sondern das Veröffentlichen von Daten, die niemanden interessieren. Ein guter Start ist klein und gezielt: ein einziger Datensatz, der echten Bedarf deckt, ist wertvoller als zwanzig Datensätze, die ungelesen bleiben.</p>
      <p class="wz-p">Gehen Sie die folgenden Punkte durch und haken Sie ab, was auf Ihren geplanten Datensatz zutrifft. Es gibt kein Minimum; die Liste hilft Ihnen, die Entscheidung zu strukturieren.</p>

      <h3 class="wz-subh">Selbsteinschätzung</h3>
      <div class="wz-checks">${checks}</div>

      <div class="wz-hint">
        <span class="wz-hint-icon"><i class="fa-solid fa-lightbulb"></i></span>
        <span><strong>Lieber zu früh als zu spät.</strong> Daten müssen nicht perfekt sein, um nützlich zu sein. Veröffentlichen Sie früh, sammeln Sie Feedback und verbessern Sie iterativ, nicht umgekehrt.</span>
      </div>
    `;
    return el;
  }

  // ── Step 3 — Rechtliche Offenheit ─────────────────────────────────────────
  function renderS3() {
    const el = div('wz-step');
    el.innerHTML = `
      <h2 class="wz-h">Wie offen sind Ihre Daten rechtlich?</h2>
      <p class="wz-p">Bevor technische Fragen geklärt werden, muss die Rechtslage stimmen. Welche Lizenz passt, hängt wesentlich davon ab, <em>was</em> Sie veröffentlichen.</p>

      <h3 class="wz-subh">1. Worum handelt es sich bei Ihren Daten hauptsächlich?</h3>
      <div class="wz-opts wz-opts--2">
        ${opt('dtype','factual',   '<i class="fa-solid fa-chart-column"></i>', 'Fakten &amp; Informationen',       'Geodaten, statistische Messwerte, Rohdaten, Sensormessungen. Inhalte, die die Realität abbilden, ohne redaktionelle Formung.',           st.dataType === 'factual')}
        ${opt('dtype','creative',  '<i class="fa-solid fa-file-lines"></i>',   'Gestaltete oder kuratierte Inhalte', 'Berichte, redaktionell ausgewählte Datenbankeinträge, Publikationen, kommentierte Datensätze mit erkennbarer eigener Schöpfung.',        st.dataType === 'creative')}
      </div>

      <div id="wz-s3-branch"></div>

      <h3 class="wz-subh" id="wz-rights-h" style="display:none">2. Besitzen Sie die notwendigen Rechte?</h3>
      <div class="wz-opts wz-opts--3" id="wz-rights-opts" style="display:none">
        ${opt('rights','yes',     '<i class="fa-solid fa-circle-check"></i>',    'Ja',               'Die Daten wurden von unserer Organisation selbst erhoben oder wir halten alle relevanten Nutzungsrechte.',       st.hasRights === 'yes')}
        ${opt('rights','unclear', '<i class="fa-solid fa-circle-question"></i>', 'Nicht sicher',     'Teile der Daten stammen aus Drittquellen oder die Rechtslage ist intern noch nicht vollständig geprüft.',        st.hasRights === 'unclear')}
        ${opt('rights','no',      '<i class="fa-solid fa-ban"></i>',             'Nein',             'Ein Dritter hält Rechte an diesen Daten und hat einer Weiterveröffentlichung nicht zugestimmt.',                st.hasRights === 'no')}
      </div>
      <div id="wz-rights-note" style="display:none"></div>
    `;

    if (st.dataType) renderS3Branch();
    return el;
  }

  function renderS3Branch() {
    const branch = bodyEl.querySelector('#wz-s3-branch');
    const rightsH = bodyEl.querySelector('#wz-rights-h');
    const rightsOpts = bodyEl.querySelector('#wz-rights-opts');
    const rightsNote = bodyEl.querySelector('#wz-rights-note');
    if (!branch) return;

    // Auto-recommend license based on sector when opened from context
    if (st.dataType && st.sector && !st.license) {
      st.license = LICENSE_REC[st.sector]?.[st.dataType] ?? null;
    }

    if (st.dataType === 'factual') {
      branch.innerHTML = `
        <div class="wz-info-box">
          <h4 class="wz-info-title">Fakten sind urheberrechtsfrei, bieten aber weniger Schutz.</h4>
          <p class="wz-p">Reine Fakten (Messwerte, Koordinaten, statistische Zählungen) sind in Deutschland und der EU urheberrechtlich nicht schutzfähig. Das klingt gut, bedeutet aber auch: Wer diese Daten nutzt, braucht <em>keine</em> Erlaubnis. Eine restrictive Lizenz wäre rechtlich unwirksam und würde Nutzer nur verwirren.</p>
          <p class="wz-p">Die richtige Strategie: Verwenden Sie <strong>CC0 (Public Domain Dedication)</strong> oder den <strong>Public Domain Mark</strong>. Damit signalisieren Sie explizit, dass Sie auf alle Rechtsansprüche verzichten, auch auf Datenbankrechte, die in der EU separat bestehen können.</p>
          <div class="wz-license-card wz-license-card--highlight">
            <strong>Empfehlung: CC0</strong>
            <span>Kein Vorbehalt, keine Namensnennungspflicht, maximale Wiederverwendbarkeit. Ermöglicht kommerzielle Nutzung, Integration in andere Systeme und automatische Verarbeitung ohne rechtliche Hürden.</span>
          </div>
          <p class="wz-p wz-note"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Datenbankrecht (EU):</strong> Wenn Sie erhebliche Investitionen in die Zusammenstellung oder Pflege der Datenbank gesteckt haben, können <em>sui generis</em>-Datenbankrechte entstehen, auch wenn die Inhalte selbst gemeinfrei sind. CC0 deckt auch diese ab.</p>
        </div>
      `;
    } else if (st.dataType === 'creative') {
      const isPublic = st.sector === 'public';
      branch.innerHTML = `
        <div class="wz-info-box">
          <h4 class="wz-info-title">Gestaltete Inhalte brauchen eine explizite offene Lizenz.</h4>
          <p class="wz-p">Berichte, kuratierte Datenbankeinträge oder kommentierte Datensätze genießen urheberrechtlichen Schutz. Ohne eine explizite Lizenz gilt: Alle Rechte vorbehalten. Für Open Data müssen Sie Nutzern aktiv Rechte einräumen.</p>

          <h4 class="wz-subh" style="margin-top:16px">Welche Lizenz passt?</h4>
          <div class="wz-license-grid">
            ${licenseOpt('CC0',     'CC0 / Public Domain',       'Kein Vorbehalt. Vollständiger Rechtsklang für alle Zwecke, kommerziell und nicht-kommerziell.',       'Keine Namensnennungspflicht. Maximale Kompatibilität mit anderen Daten.',    st.license === 'CC0')}
            ${licenseOpt('CC_BY',   'CC BY 4.0',                 'Nutzung für alle Zwecke erlaubt, solange die Quelle genannt wird.',                                    'Einfach und weitverbreitet. Gute Wahl für Forschungsdaten und Berichte.',    st.license === 'CC_BY')}
            ${licenseOpt('CC_BY_SA','CC BY-SA 4.0',              'Nutzung erlaubt bei Namensnennung <em>und</em> Weitergabe unter gleicher Lizenz (Share-alike).',       'Stellt sicher, dass Ableitungen offen bleiben, erzeugt aber Kompatibilitätsprobleme.',  st.license === 'CC_BY_SA')}
            ${isPublic ? licenseOpt('DLD', 'Datenlizenz Deutschland', 'Behördenspezifische Lizenz nach DL-DE-BY 2.0 oder DL-DE-Zero 2.0.',                              'Für deutsche Behörden etabliert. Nachteil: geringere internationale Sichtbarkeit als CC-Lizenzen.',  st.license === 'DLD') : ''}
          </div>
          ${isPublic ? `<p class="wz-p wz-note">💡 <strong>Für Behörden:</strong> Die Datenlizenz Deutschland ist im deutschen Kontext anerkannt, schränkt aber internationale Anschlussfähigkeit ein. Für überregionale Nachnutzung sind CC-Lizenzen die bessere Wahl.</p>` : ''}
          <p class="wz-p wz-note">Weitere geprüfte offene Lizenzen: <strong>opendefinition.org/licenses</strong> · Open Data Commons: <strong>opendatacommons.org/guide</strong></p>
        </div>
      `;
    } else {
      branch.innerHTML = '';
    }

    const show = st.dataType !== null;
    rightsH.style.display = show ? '' : 'none';
    rightsOpts.style.display = show ? '' : 'none';

    if (st.hasRights === 'unclear') {
      rightsNote.innerHTML = `<div class="wz-warn">Empfehlung: Klären Sie die Rechtslage vor der Veröffentlichung intern oder durch eine Rechtsberatung. Im Zweifel lieber abwarten als zu publizieren; eine fehlerhafte Veröffentlichung ist schwerer zu korrigieren als eine verzögerte.</div>`;
      rightsNote.style.display = '';
    } else if (st.hasRights === 'no') {
      rightsNote.innerHTML = `<div class="wz-warn wz-warn--error">Sie können diese Daten in der vorliegenden Form nicht öffnen. Klären Sie zunächst mit dem Rechteinhaber, ob eine Sublizenz oder Übertragung möglich ist.</div>`;
      rightsNote.style.display = '';
    } else {
      rightsNote.innerHTML = '';
      rightsNote.style.display = 'none';
    }
  }

  // ── Step 4 — Technische Offenheit ─────────────────────────────────────────
  function renderS4() {
    const sectorRec = {
      public:   { icon: '<i class="fa-solid fa-box-archive"></i>', title: 'Datenkatalog + Bulk-Download', text: 'Öffentliche Verwaltungen sollten Daten primär über offizielle Datenkataloge (z. B. GovData.de) bereitstellen. Ein maschinenlesbarer Bulk-Download ist die Grundlage; APIs können ergänzend folgen, ersetzen aber nicht die rohen Dateien.', methods: ['catalog', 'own'] },
      civil:    { icon: '<i class="fa-solid fa-globe"></i>', title: 'Community-Plattform + Bulk-Download', text: 'NGOs profitieren davon, Daten über bereits etablierte Community-Plattformen zu teilen, dort ist die relevante Nutzergruppe bereits aktiv. Stellen Sie immer auch einen direkten Dateidownload bereit.', methods: ['platform', 'own'] },
      research: { icon: '<i class="fa-solid fa-folder-open"></i>', title: 'Fachrepositorium + Bulk-Download', text: 'Forschungsdaten gehören in disziplinspezifische Repositorien wie Zenodo, PANGAEA oder GESIS. Diese garantieren dauerhafte Erreichbarkeit, DOI-Vergabe und fachkundige Auffindbarkeit.', methods: ['repo', 'own'] },
      private:  { icon: '<i class="fa-solid fa-gear"></i>', title: 'API + Bulk-Download', text: 'Unternehmen stellen Daten häufig per API bereit. Wichtig: Eine API ersetzt keinen Bulk-Download. Bieten Sie immer auch die Rohdaten als downloadbare Datei an, nicht alle Nutzer haben die technischen Mittel für API-Integration.', methods: ['api', 'own'] },
    };
    const rec = sectorRec[st.sector] || sectorRec.public;

    const el = div('wz-step');
    el.innerHTML = `
      <h2 class="wz-h">Wie machen Sie die Daten zugänglich?</h2>
      <p class="wz-p">Offene Daten müssen <em>technisch</em> offen sein: maschinenlesbar, direkt downloadbar und ohne Registrierungspflicht. Eine PDF-Datei gilt nicht als offenes Datenformat — auch wenn sie öffentlich verlinkt ist.</p>

      <div class="wz-info-box wz-info-box--accent">
        <span style="font-size:22px">${rec.icon}</span>
        <div>
          <strong>${rec.title}</strong>
          <p class="wz-p" style="margin-top:4px">${rec.text}</p>
        </div>
      </div>

      <h3 class="wz-subh">1. Welches Format verwenden Sie?</h3>
      <div class="wz-format-grid">
        <div class="wz-format-card wz-format-card--good">
          <strong><i class="fa-solid fa-circle-check"></i> Empfohlen</strong>
          <span>CSV, JSON, XML, TSV, GeoJSON: maschinenlesbar, offen, weitverbreitet</span>
        </div>
        <div class="wz-format-card wz-format-card--bad">
          <strong><i class="fa-solid fa-ban"></i> Ungeeignet</strong>
          <span>PDF, DOCX, XLS (ohne CSV-Export): nicht maschinenlesbar oder proprietär</span>
        </div>
      </div>

      <h3 class="wz-subh">2. Wie stellen Sie die Daten bereit?</h3>
      <div class="wz-opts wz-opts--2">
        ${opt('publish','catalog',  '<i class="fa-solid fa-box-archive"></i>', 'Datenkatalog',          'Eintrag in einen zentralen oder sektorspezifischen Open-Data-Katalog (GovData, CKAN-Instanz).',  st.publishMethod === 'catalog')}
        ${opt('publish','repo',     '<i class="fa-solid fa-folder-open"></i>', 'Fachrepositorium',      'Plattform wie Zenodo, PANGAEA, GESIS oder ein disziplinspezifisches Archiv.',                   st.publishMethod === 'repo')}
        ${opt('publish','platform', '<i class="fa-solid fa-globe"></i>',       'Community-Plattform',   'GitHub, Figshare, Kaggle, Hugging Face oder ähnliche öffentlich zugängliche Plattformen.',      st.publishMethod === 'platform')}
        ${opt('publish','api',      '<i class="fa-solid fa-gear"></i>',         'API (ergänzend)',        'REST- oder OData-API zusätzlich zum Bulk-Download. Nicht als alleinige Publikationsform.',       st.publishMethod === 'api')}
        ${opt('publish','own',      '<i class="fa-solid fa-display"></i>',      'Eigene Website',         'Download direkt von der eigenen Website, einfach zu starten, aber schwieriger auffindbar.',    st.publishMethod === 'own')}
      </div>

      <div class="wz-hint">
        <span class="wz-hint-icon"><i class="fa-solid fa-clock"></i></span>
        <span><strong>Lieber heute roh als in sechs Monaten perfekt.</strong> Wartende Nutzer und politisches Momentum gehen verloren. Ein einfacher CSV-Download auf Ihrer Website ist ein legitimer Start.</span>
      </div>
    `;
    return el;
  }

  // ── Step 5 — Auffindbarkeit & Nächste Schritte ────────────────────────────
  function renderS5() {
    const catalogRec = {
      public:   ['govdata.de: nationales Open-Data-Portal für Behörden', 'Landesportale (Berlin: daten.berlin.de, NRW: open.nrw.de, etc.)'],
      civil:    ['<a href="https://datenatlas-zivilgesellschaft.de/de/start/" target="_blank" rel="noopener">datenatlas-zivilgesellschaft.de</a>: Open-Data-Portal für Zivilgesellschaft', 'OpenDataNetwork.org: Community-Verzeichnis'],
      research: ['Zenodo (zenodo.org): generalistisches Forschungsrepositorium', 'PANGAEA (pangaea.de): Geo- und Umweltwissenschaften', 'GESIS (gesis.org): Sozialwissenschaften'],
      private:  ['datahub.io: kommerzielle und nicht-kommerzielle Datensätze', 'Kaggle Datasets: Machine-Learning-Community'],
    };
    const catalogs = catalogRec[st.sector] || catalogRec.public;

    const sectorLabel = { public: 'Öffentliche Verwaltung', civil: 'Zivilgesellschaft & NGOs', research: 'Forschung & Wissenschaft', private: 'Privatwirtschaft' };
    const dtLabel     = { factual: 'Fakten & Informationen', creative: 'Gestaltete / kuratierte Inhalte' };
    const licLabel    = { CC0: 'CC0 / Public Domain', CC_BY: 'CC BY 4.0', CC_BY_SA: 'CC BY-SA 4.0', DLD: 'Datenlizenz Deutschland' };
    const pubLabel    = { catalog: 'Datenkatalog', repo: 'Fachrepositorium', platform: 'Community-Plattform', api: 'API', own: 'Eigene Website' };
    const rightsLabel = { yes: 'Rechte vorhanden', unclear: 'Zu klären', no: 'Rechte fehlen' };

    const el = div('wz-step');
    el.innerHTML = `
      <h2 class="wz-h">Auffindbarkeit &amp; nächste Schritte</h2>
      <p class="wz-p">Die größte Herausforderung nach der Veröffentlichung ist nicht die Technik, es ist die Entdeckbarkeit. Open Data, das niemand findet, erzeugt keinen Mehrwert. Auffindbarkeit ist ein strukturelles Problem: Sie entsteht durch Vernetzung, Metadaten und aktive Kommunikation.</p>

      <h3 class="wz-subh">1. Empfohlene Kataloge für Ihren Bereich</h3>
      <ul class="wz-catalog-list">
        ${catalogs.map(c => `<li>${c}</li>`).join('')}
      </ul>

      <h3 class="wz-subh">2. Jetzt sofort tun</h3>
      <ul class="wz-todo">
        <li><label><input type="checkbox"> Metadaten vollständig ausfüllen: Titel, Beschreibung, Aktualisierungsrhythmus, Kontakt, Lizenz</label></li>
        <li><label><input type="checkbox"> Datensatz in mindestens einem der oben genannten Kataloge registrieren</label></li>
        <li><label><input type="checkbox"> Zwei bis drei mögliche Nutzer persönlich ansprechen: Journalisten, Entwickler, Forschende im Themenbereich</label></li>
        <li><label><input type="checkbox"> Aktualisierungsplan intern festlegen: wer pflegt die Daten, wie oft?</label></li>
        <li><label><input type="checkbox"> Eine einfache Landingpage oder README mit Nutzungshinweisen erstellen</label></li>
      </ul>

      <div class="wz-hint">
        <span class="wz-hint-icon"><i class="fa-solid fa-users"></i></span>
        <span><strong>Nutzer früh einbeziehen.</strong> Infomediäre (Menschen, die Rohdaten in nutzbare Produkte verwandeln) sind wertvoller als Marketing. Suchen Sie früh den Kontakt zu Journalisten, zivilgesellschaftlichen Datenteams und Entwicklern, die Ihren Datensatz kennen.</span>
      </div>

      <h3 class="wz-subh" style="margin-top:24px">Ihre Zusammenfassung</h3>
      <div class="wz-summary" id="wz-summary">
        ${summaryRow('Sektor',          sectorLabel[st.sector])}
        ${summaryRow('Erfahrung',       st.firstTime ? 'Erstmalige Datenöffnung' : 'Erweiterung bestehender Open Data')}
        ${summaryRow('Datenart',        dtLabel[st.dataType])}
        ${summaryRow('Rechtslage',      rightsLabel[st.hasRights])}
        ${(st.license ? summaryRow('Lizenz', licLabel[st.license]) : '')}
        ${summaryRow('Publikationsweg', pubLabel[st.publishMethod])}
        ${summaryRow('Selbstcheck',     `${st.stage2checks.size} von 5 Kriterien bestätigt`)}
      </div>
    `;
    return el;
  }

  // ── HTML helpers ──────────────────────────────────────────────────────────
  function opt(key, val, icon, label, desc, selected) {
    return `
      <div class="wz-opt${selected ? ' selected' : ''}" data-${key}="${val}" role="button" tabindex="0">
        <span class="wz-opt-icon">${icon}</span>
        <div>
          <strong class="wz-opt-label">${label}</strong>
          <span class="wz-opt-desc">${desc}</span>
        </div>
      </div>`;
  }

  function licenseOpt(val, label, desc, tradeoff, selected) {
    return `
      <div class="wz-opt wz-opt--license${selected ? ' selected' : ''}" data-license="${val}" role="button" tabindex="0">
        <strong class="wz-opt-label">${label}</strong>
        <span class="wz-opt-desc">${desc}</span>
        <span class="wz-opt-tradeoff">${tradeoff}</span>
      </div>`;
  }

  function summaryRow(label, value) {
    if (!value) return '';
    return `<div class="wz-sum-row"><span class="wz-sum-key">${label}</span><span class="wz-sum-val">${value}</span></div>`;
  }

  function div(cls) {
    const el = document.createElement('div');
    el.className = cls;
    return el;
  }
}
