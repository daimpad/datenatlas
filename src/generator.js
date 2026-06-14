// ── Cross-Sector-Fusion-Generator ─────────────────────────────────────────────
import { esc, trapFocus } from './utils.js';

export const SECTOR_META = {
  staat:             { name: 'Staat & Verwaltung',       color: '#1e5799' },
  wirtschaft:        { name: 'Wirtschaft',               color: '#2c3e50' },
  wissenschaft:      { name: 'Wissenschaft & Forschung', color: '#4527a0' },
  zivilgesellschaft: { name: 'Zivilgesellschaft',        color: '#6d28d9' },
  medien:            { name: 'Medien & Kultur',          color: '#be185d' },
  religion:          { name: 'Religionsgemeinschaften',  color: '#134e4a' },
  bildung:           { name: 'Bildung',                  color: '#b45309' },
};

export const SCENARIOS = [
  {
    id:    'klimarisiko',
    title: 'Klimarisiko-Karte',
    icon:  'fa-temperature-half',
    story: 'Welche Wirtschaftsregionen sind klimatisch besonders verwundbar – und ist diese Verwundbarkeit mit Klimadaten oder Finanzdaten allein überhaupt messbar?\n\nUmweltbehörden wie der Deutsche Wetterdienst wissen, wo Extremwetter häufiger und Überflutungsrisiken höher werden – aber nicht, welche wirtschaftlichen Strukturen dort verwurzelt sind. Unternehmensdaten kennen Standorte, Branchen und Kapitalexposition – aber nicht, welche Klimabedingungen dort in Zukunft herrschen werden.\n\nEinzig die Überlagerung beider Datensätze erzeugt ein kleinräumiges Bild wirtschaftlicher Klimaexposition: Wo treffen steigende Hitzebelastung auf exportabhängige Branchen? Wo überlagern sich Überflutungsrisiken mit konzentrierter Unternehmensinfrastruktur? Diese Schnittmenge – Klimagefährdung trifft wirtschaftliche Verwundbarkeit – ist die Grundlage für ein Klimarisiko-Profil, das weder Klimaforschung noch Wirtschaftsstatistik allein liefern kann.',
    a: { sector: 'staat',      theme: 'TH_06', label: 'DWD Überflutungsrisikokarte',          detail: 'Rasterdaten 1 km², Extremniederschlags-Jährlichkeit Bayern 1990–2024' },
    b: { sector: 'wirtschaft', theme: 'TH_07', label: 'Industriestandorte & Jahresumsatz',    detail: 'IHK-Register exportabhängiger Betriebe, Raum Passau/Deggendorf 2023' },
  },
  {
    id:    'bildungsrendite',
    title: 'Bildungsrendite-Rechner',
    icon:  'fa-chart-line',
    story: 'Führt eine bestimmte Bildungsinvestition tatsächlich zu Beschäftigung und wirtschaftlicher Wertschöpfung – und lässt sich das empirisch zeigen?\n\nBildungspanels wie das NEPS kennen den Qualifikationsweg: welchen Abschluss jemand wann erworben hat. Sie sehen nicht, was danach auf dem Arbeitsmarkt passiert. Wirtschaftsdaten aus Unternehmensregistern und Branchenstatistiken sehen Gehaltsniveaus und Nachfragestrukturen – aber nicht, welche Bildungsbiografien dorthin geführt haben.\n\nEinzig die Verbindung beider Quellen schließt diese Lücke: Welche Qualifikationen führen in welchen Regionen tatsächlich zu welchen Beschäftigungsbiografien? Wo entstehen Mismatches zwischen Bildungsoutput und Arbeitsmarktbedarf? Diese Antwort ist nur aus dem Zusammenspiel beider Datensätze zu gewinnen – und wäre eine empirische Grundlage für informierte Bildungsplanung.',
    a: { sector: 'wissenschaft', theme: 'TH_02', label: 'NEPS Erwerbsbiografien',             detail: 'Startkohorte 6: Berufsausbildung 1990–2020, Scientific Use File' },
    b: { sector: 'wirtschaft',   theme: 'TH_04', label: 'Bruttomonatsverdienste',             detail: 'Verdienststrukturerhebung Destatis nach Berufsfeld & Bundesland 2022' },
  },
  {
    id:    'soziale-vulnerabilitaet',
    title: 'Atlas sozialer Vulnerabilität',
    icon:  'fa-map',
    story: 'Messen amtliche Sozialdaten und zivilgesellschaftliche Beratungsstatistiken dieselbe Realität – oder beschreiben sie unterschiedliche Ausschnitte derselben Notlage?\n\nAmtliche Statistiken zeigen, wer das Sozialsystem erreicht: Grundsicherungsquoten, Arbeitslosenmeldungen, Wohnhilfen. Zivilgesellschaftliche Beratungsstellen sehen, wer sich meldet, bevor staatliche Leistungen greifen – und wer sie aus Unkenntnis oder Misstrauen gar nicht beansprucht. Beide Quellen messen soziale Not, aber aus entgegengesetzten Perspektiven: eine aus dem System heraus, die andere aus dem Alltag der Betroffenen.\n\nEinzig der Abgleich beider Quellen macht den Raum zwischen staatlicher Registrierung und tatsächlicher Bedarfslage sichtbar: Regionen, in denen Beratungsnachfrage steigt, während Statistiken stabil bleiben, signalisieren strukturelle Untererfassung – einen blinden Fleck, der mit keiner der beiden Quellen allein erkennbar wäre.',
    a: { sector: 'staat',             theme: 'TH_03', label: 'Grundsicherungsquoten nach Kreisen', detail: 'Bundesagentur für Arbeit, Quartalsdaten 2023' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_03', label: 'AWO-Schuldnerberatung: Fallzahlen',  detail: 'PLZ-Ebene, Erstkontakt vs. Wiederholer 2023' },
  },
  {
    id:    'unsichtbare-infrastruktur',
    title: 'Unsichtbare Infrastruktur',
    icon:  'fa-church',
    story: 'Wie sieht eine Karte der sozialen Versorgung in Deutschland aus, wenn erstmals kommunale und konfessionelle Infrastruktur gemeinsam eingezeichnet sind?\n\nKommunale Geodaten zeigen, wo staatliche Einrichtungen liegen – Kitas, Pflegeheime, Beratungsstellen in öffentlicher Trägerschaft. Religiöse Träger wie Caritas, Diakonie oder jüdische Wohlfahrtsverbände betreiben parallele Netze derselben Einrichtungstypen, deren Standorte selten in kommunalen Planungssystemen erfasst sind. Beide Geodatensätze beschreiben dasselbe Versorgungssystem – aber jeder nur seinen Teil.\n\nEine gemeinsame Karte beider Datensätze könnte erstmals zeigen, wo konfessionliche Träger staatliche Infrastruktur dicht ergänzen, wo sie die einzige Anlaufstelle sind – und wo Lücken entstehen, die erst durch die Kombination beider Perspektiven sichtbar werden.',
    a: { sector: 'religion', object: 'OB_05', label: 'Caritas-Einrichtungsstandorte NRW',    detail: 'Kitas, Pflegeheime, Beratungsstellen (georef.), Diözesanverbände 2024' },
    b: { sector: 'staat',    object: 'OB_05', label: 'Kommunales Einrichtungsregister NRW',  detail: 'Öffentliche Sozialeinrichtungen mit Trägerkennzeichen, IT.NRW 2024' },
  },
  {
    id:    'biodiversitaet-kapital',
    title: 'Natur vs. Kapital',
    icon:  'fa-leaf',
    story: 'Lässt sich zeigen, ob und wie intensiv wirtschaftliche Nutzung mit dem Rückgang biologischer Vielfalt zusammenhängt – lokal, räumlich präzise und über Branchen hinweg?\n\nArtenerfassungen und Biotopkartierungen wissen, wie es um Insekten, Pflanzen und Ökosysteme in einer Region steht – aber nicht, welche wirtschaftlichen Aktivitäten dort stattfinden. Flächennutzungs- und Standortdaten zeigen, wer eine Fläche wie intensiv bewirtschaftet – aber nicht, was das ökologisch bedeutet. Beide Datensätze beschreiben dieselbe Landschaft, jedoch aus völlig verschiedenen Beobachtungsperspektiven.\n\nEine Überlagerung beider Datensätze könnte für einzelne Regionen zeigen, ob und wie stark Flächennutzungsintensität mit Artenrückgang korreliert. Diese räumliche Verknüpfung ist das eigenständige Erkenntnispotenzial der Kombination – ein empirisches Fundament für Unternehmen, die Natural-Capital-Risiken bewerten wollen, und für Politik, die Naturschutzziele und Wirtschaftsförderung räumlich koordinieren möchte.',
    a: { sector: 'wissenschaft', theme: 'TH_09', label: 'NABU Tagfalterkartierung',           detail: 'Artenanzahl & Individuendichte je Messtransekt, Deutschland 2005–2023' },
    b: { sector: 'wirtschaft',   theme: 'TH_04', label: 'InVeKoS Flächennutzungsmeldungen',  detail: 'Bewirtschaftungsintensität & Betriebsgröße je Gemarkung 2023' },
  },
  {
    id:    'medienspiegel-gesellschaft',
    title: 'Medienspiegel der Gesellschaft',
    icon:  'fa-newspaper',
    story: 'Berichtet die Öffentlichkeit proportional über das, was amtliche Sozialdaten messen – oder gibt es Regionen und Themen, die statistisch bedeutsam, medial aber kaum sichtbar sind?\n\nAmtliche Sozialdaten messen Armutsgefährdung, Obdachlosigkeit und soziale Benachteiligung regional und zeitlich präzise – aber sie wissen nichts davon, ob diese Probleme öffentlich wahrgenommen werden. Medienarchive zeigen, welche sozialen Themen wie intensiv berichtet werden – aber nicht, ob die berichteten Probleme statistisch tatsächlich vorhanden oder wachsend sind.\n\nEinzig der Abgleich beider Quellen erzeugt das eigentlich interessante Bild: Regionen und Problemlagen, für die Statistiken eine Verschlechterung zeigen, während die Medienpräsenz gering bleibt – und umgekehrt. Diese Diskrepanz ist eine eigenständige Erkenntnis, die weder aus Mediendaten noch aus Sozialdaten allein gewonnen werden kann.',
    a: { sector: 'medien', theme: 'TH_03', label: 'dpa-Archiv: Sozialpolitik-Berichterstattung', detail: 'Artikelanzahl pro Themenfeld, überregionale Tageszeitungen 2015–2024' },
    b: { sector: 'staat',  theme: 'TH_03', label: 'Armutsgefährdungsquoten nach Kreisen',        detail: 'Mikrozensus Destatis, Zeitreihe 2015–2023' },
  },
  {
    id:    'gesundheitsatlas',
    title: 'Gesundheitsatlas der Ungleichheit',
    icon:  'fa-hospital',
    story: 'Warum nutzen Menschen in manchen Regionen medizinische Angebote seltener – obwohl die Versorgungsdichte vergleichbar ist? Und lässt sich das aus Daten ermitteln?\n\nStaatliche Versorgungsdaten zeigen, wie viele Ärztinnen und Einrichtungen in einem Planungsbereich vorhanden sind – aber nicht, ob und von wem sie erreicht werden. Zivilgesellschaftliche Beratungsstatistiken zeigen, wo Menschen Unterstützung beim Zugang zu Gesundheitsleistungen benötigen – aber nicht, wie groß das Angebot dort ist. Beide Quellen sehen jeweils nur eine Seite der Versorgungsrealität.\n\nEinzig die Kombination beider Datensätze macht die Differenz messbar: Regionen mit hoher Versorgungsdichte, aber hoher Beratungsnachfrage, signalisieren systemische Zugangshürden – sprachliche, soziale oder strukturelle. Dieses Muster ist das zentrale Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'staat',             theme: 'TH_01', label: 'KBV-Versorgungsatlas 2023',          detail: 'Kassenarztzulassungen & Bettendichte je Planungsbereich' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_01', label: 'MBE-Beratungsstatistik Diakonie',    detail: 'Anfragen zu Gesundheitsversorgung nach PLZ 2023' },
  },
  {
    id:    'transparenz-score',
    title: 'Öffentlicher Transparenz-Score',
    icon:  'fa-scale-balanced',
    story: 'Welcher Sektor legt seine Finanzen offener dar – der öffentliche oder der private – und lässt sich das mit einem gemeinsamen Maßstab messen?\n\nKommunale Jahresabschlüsse und Unternehmensabschlüsse sind beide prinzipiell öffentlich zugänglich. Aber sie wurden nie nach denselben Kriterien analysiert: Vollständigkeit, Aktualität, Maschinenlesbarkeit, Detailtiefe. Jede Seite allein ist nur mit sich selbst vergleichbar – der andere Sektor bleibt außen vor.\n\nEin gemeinsamer Transparenzindex, angewendet auf beide Datensätze, würde erstmals zeigen, wo öffentliche Körperschaften detaillierter und aktueller berichten als Unternehmen – und wo es umgekehrt ist. Dieser sektorübergreifende Vergleich ist ausschließlich aus der Kombination möglich: Ohne die andere Seite gibt es keinen Maßstab und keine Aussage über relative Offenheit.',
    a: { sector: 'staat',      theme: 'TH_07', label: 'Kommunale Jahresabschlüsse (Doppik)',  detail: '400 Kreise & kreisfreie Städte, Vollständigkeit & Aktualität 2022' },
    b: { sector: 'wirtschaft', theme: 'TH_07', label: 'Bundesanzeiger: GmbH/AG-Abschlüsse',  detail: 'Handelsregister-Offenlegungen nach Offenlegungsfrist 2022' },
  },
  {
    id:    'forschung-praxis',
    title: 'Vom Labor in die Praxis',
    icon:  'fa-microscope',
    story: 'Wo treffen wissenschaftliche Erkenntnisse auf gesellschaftlichen Bildungsbedarf – und wo klaffen beide weit auseinander?\n\nForschungsdatenbanken wie das GEPRIS der DFG dokumentieren, auf welchen Feldern intensiv geforscht wird – aber nicht, ob diese Erkenntnisse in der Bildungspraxis ankommen. Bildungsträger wie Volkshochschulen oder Wohlfahrtsverbände dokumentieren in Programmen, welche Themen Bürgerinnen und Bürger tatsächlich nachfragen – aber nicht, was dazu wissenschaftlich bekannt ist. Beide Quellen beschreiben Wissensproduktion und Wissensnachfrage, ohne voneinander zu wissen.\n\nEinzig der Abgleich beider Datensätze erzeugt eine Transferkarte: Wo besteht dichtes Forschungsaufkommen zu einem Thema, während Bildungsträger es kaum aufgreifen? Und welche Themen bewegen die Praxis, ohne dass systematische Forschung dazu vorliegt? Diese Lückenanalyse ist das eigenständige Ergebnis der Kombination.',
    a: { sector: 'wissenschaft',      theme: 'TH_10', label: 'DFG-GEPRIS Förderdatenbank',    detail: 'Bewilligte Verbundprojekte nach Themenfeld & Förderjahr 2010–2024' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_02', label: 'VHS-Kursbuchungen nach Thema',  detail: 'DVV-Statistik: Teilnehmerzahl & Themenkategorie nach Kreisen 2023' },
  },
  {
    id:    'kirchliches-sozialkapital',
    title: 'Kirchliches Sozialkapital',
    icon:  'fa-handshake',
    story: 'Erklärt die Dichte konfessioneller Wohlfahrtsinfrastruktur, warum manche Regionen trotz ähnlicher sozialer Lage geringere staatliche Sozialausgaben aufweisen?\n\nStaatliche Sozialstatistiken zeigen Ausgaben und Leistungsempfänger nach Kreisen – aber nicht, welche nichtstaatlichen Träger dort parallel aktiv sind. Statistiken konfessioneller Wohlfahrtsverbände wie Caritas und Diakonie zeigen, wo kirchliche Träger dichte Versorgungsnetze unterhalten – aber nicht, wie sich das auf öffentliche Haushalte auswirkt.\n\nEinzig die Überlagerung beider Datensätze kann zeigen, ob hohe kirchliche Sozialversorgung mit niedrigeren staatlichen Sozialausgaben in derselben Region korreliert – oder ob beide komplementär wachsen. Das Muster dahinter – Substitution oder Ergänzung – ist empirisch nur aus dem Zusammenspiel beider Quellen zu ermitteln.',
    a: { sector: 'religion', theme: 'TH_03', label: 'Caritas-Einrichtungsstatistik 2023',    detail: 'Einrichtungstyp & Platzkapazität nach Bundesland (Bundesverband)' },
    b: { sector: 'staat',    theme: 'TH_03', label: 'Sozialhilfeausgaben je Einwohner',      detail: 'Destatis SGB XII nach Kreisen 2022' },
  },
  {
    id:    'umwelt-wissenschaft-fusion',
    title: 'Klimawandel im Datenspiegel',
    icon:  'fa-earth-europe',
    story: 'Wie präzise könnten Klimamodelle sein, wenn sie direkt und kontinuierlich mit Rohdaten staatlicher Messstationen gespeist werden?\n\nUmweltbehörden wie der Deutsche Wetterdienst erheben laufend hochauflösende Messwerte – aber diese Daten werden wissenschaftlichen Modellen selten direkt und zeitnah zugänglich gemacht. Klimaforschungsinstitute entwickeln Modelle, die auf genau diesen Beobachtungsdaten aufbauen müssten, in der Praxis aber meist verzögert und gefiltert darauf zugreifen. Beide Seiten arbeiten mit demselben Phänomen – aber ohne systematische Rückkopplung.\n\nEine direkte Verbindung zwischen staatlichen Messdaten und wissenschaftlichen Modellierungsinfrastrukturen würde einen neuen Rückkopplungskreis erzeugen: Modellvorhersagen werden laufend mit aktuellen Messwerten abgeglichen, Abweichungen sofort sichtbar. Diese kontinuierliche Kalibrierung – die weder Behörden noch Forschung allein leisten können – ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'staat',        theme: 'TH_06', label: 'DWD-Messstationen: Stündliche Wetterdaten', detail: '400 Stationen, opendata.dwd.de, NetCDF 2000–2024' },
    b: { sector: 'wissenschaft', theme: 'TH_06', label: 'MPI-M ICON-Klimamodellläufe',               detail: 'RCP 4.5 / 8.5, 12 km Auflösung (CMIP6)' },
  },
  {
    id:    'recht-medien',
    title: 'Rechtslage im Mediencheck',
    icon:  'fa-gavel',
    story: 'Gibt es Gesetze, die das Leben vieler Menschen verändern, ohne je öffentlich diskutiert zu werden – und lässt sich das aus dem Verhältnis von Gesetzgebungsdaten und Medienberichterstattung zeigen?\n\nGesetzgebungsdaten dokumentieren lückenlos, welche Regelungen wann und in welchem Bereich in Kraft treten – aber sie wissen nicht, ob irgendjemand davon Kenntnis nimmt. Medienarchive zeigen, wie intensiv über Gesetzgebung berichtet wird – aber nicht, wie viel tatsächlicher Regelungsoutput dahintersteht. Beide Quellen messen Gesetzgebung aus entgegengesetzten Perspektiven: eine aus dem Parlamentsbetrieb, die andere aus der öffentlichen Aufmerksamkeit.\n\nEinzig das Verhältnis beider Quellen erzeugt den eigentlichen Befund: einen Aufmerksamkeits-Index je Gesetzgebungsbereich. Wo legislative Aktivität und Medienpräsenz stark auseinandergehen, entstehen demokratische Wahrnehmungslücken. Diese Asymmetrie ist weder aus Rechtsdaten noch aus Medienarchiven allein sichtbar.',
    a: { sector: 'staat',  theme: 'TH_08', label: 'Bundesgesetzblatt-Datenbank',           detail: 'Gesetze & Verordnungen nach Rechtsgebiet & Datum 2000–2024' },
    b: { sector: 'medien', theme: 'TH_08', label: 'ARD/ZDF Mediathek-Metadaten',           detail: 'Sendebeiträge nach Rechtsgebiet & Monat, Rundfunkarchiv 2000–2024' },
  },
  {
    id:    'lohnluecke-medien',
    title: 'Lohnlücke im Medienspiegel',
    icon:  'fa-coins',
    story: 'Berichtet die Wirtschaftspresse proportional über Lohnungleichheit – oder gibt es Gruppen und Regionen, deren Einkommensnachteile statistisch erheblich sind, medial aber kaum vorkommen?\n\nWissenschaftliche Verdienststatistiken des IAB und der Bundesagentur für Arbeit dokumentieren Lohnunterschiede nach Berufsgruppe, Geschlecht, Migrationshintergrund und Region mit hoher Präzision. Sie messen nicht, ob diese Befunde die öffentliche Debatte erreichen. Wirtschaftsmedien und Branchenmagazine zeigen, welche Lohnthemen wie intensiv diskutiert werden – aber nicht, ob die berichteten Ungleichheiten die statistisch gravierendsten sind oder ob strukturell besonders betroffene Gruppen systematisch weniger Sichtbarkeit erhalten.\n\nEinzig der Abgleich beider Quellen erzeugt den eigentlichen Befund: eine Aufmerksamkeitskarte der Lohnungleichheit. Welche Gruppen – Minijobber, Saisonarbeiter, atypisch Beschäftigte, ostdeutsche Branchen – werden trotz statistisch erheblicher Lohnlücken strukturell unterberichtet? Und welche Themen genießen mediale Intensität, die ihrer statistischen Evidenz nicht entspricht? Diese Asymmetrie zwischen Messung und öffentlicher Wahrnehmung ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'wissenschaft', theme: 'TH_04', label: 'IAB-Verdienststatistik nach Berufsgruppen',       detail: 'Lohnunterschiede nach Geschlecht, Migrationshintergrund & Region 2020–2023' },
    b: { sector: 'medien',       theme: 'TH_04', label: 'Wirtschaftsmedien: Berichterstattungsindex Lohn', detail: 'Artikelfrequenz nach Lohnthema & Quartal, dpa-Archiv 2020–2023' },
  },
  {
    id:    'einsamkeitsatlas',
    title: 'Einsamkeitsatlas',
    icon:  'fa-person',
    story: 'Lässt sich Einsamkeit – eine der folgenreichsten, aber statistisch unsichtbarsten gesellschaftlichen Herausforderungen – aus dem Zusammenspiel zivilgesellschaftlicher Engagement-Daten und wissenschaftlicher Befragungsstudien räumlich kartieren?\n\nFreiwilligensurveys und Vereinsmitgliedschaftsstatistiken zeigen, wo formale soziale Einbindung stark oder schwach ausgeprägt ist – aber nicht, ob dort Menschen trotz Vereinszugehörigkeit isoliert leben oder umgekehrt ohne formales Engagement gut vernetzt sind. Längsschnittstudien wie SOEP und DEAS messen subjektive Einsamkeit und Isolation direkt – aber nur für Stichproben, ohne flächendeckende kleinräumige Auflösung.\n\nEinzig die Verknüpfung beider Quellen ermöglicht eine Kalibrierung: Wo stimmen niedrige Vereinsdichte und hohe gemessene Einsamkeit überein – und wo driften beide auseinander? Gerade diese Divergenzpunkte – Regionen mit dichtem Vereinsleben, aber hoher subjektiver Isolation – sind Hinweis auf Formen sozialer Einsamkeit, die formale Einbindung nicht auffängt. Dieses Muster ist mit keiner der beiden Quellen allein zu identifizieren.',
    a: { sector: 'zivilgesellschaft', theme: 'TH_03', label: 'Freiwilligensurvey: Vereinsmitgliedschaft',    detail: 'Soziale Einbindungsdichte nach Region & Altersgruppe 2021' },
    b: { sector: 'wissenschaft',      theme: 'TH_03', label: 'SOEP / DEAS: Einsamkeitsindex',               detail: 'Subjektive Isolation & Lebenszufriedenheit, Längsschnitt 2010–2021' },
  },
  {
    id:    'pflegluecke-2030',
    title: 'Pflegelücke 2030',
    icon:  'fa-heart-pulse',
    story: 'Wie groß ist die Versorgungslücke zwischen dem Pflegebedarf der Bevölkerung und den verfügbaren Kapazitäten – und lässt sie sich regional so präzise berechnen, dass Planung vor dem Eintreten der Lücke möglich wird?\n\nDie amtliche Pflegestatistik dokumentiert Pflegebedürftige nach Versorgungsform, Trägertyp und Landkreis. Sie kennt nicht, welche Kapazitäten privater und freigemeinnütziger Pflegeanbieter vor Ort tatsächlich verfügbar, belegt und mittelfristig ausbaubar sind. Private Pflegeeinrichtungen kennen ihre Personalschlüssel, Belegungsquoten und Investitionspläne. Sie sehen nicht, wie groß der regionale Gesamtbedarf ist – und ob er demografisch auf Unterversorgung zusteuert.\n\nEinzig die Überlagerung beider Datensätze erzeugt eine kleinräumige Versorgungsbilanz: Landkreise, in denen Bedarf und Kapazität schon heute divergieren, und Regionen, die demografisch auf Unterversorgung zusteuern. Diese Bilanz – Pflegebedarf minus belegbare Kapazität nach Kreis und Trägertyp – ist das eigenständige Erkenntnispotenzial dieser Datenkombination und die Grundlage für Investitions- und Planungsentscheidungen, die weder Behörden noch Unternehmen allein treffen können.',
    a: { sector: 'staat',      theme: 'TH_01', label: 'Pflegestatistik Destatis: Bedarf nach Kreisen', detail: 'Pflegebedürftige nach Versorgungsform & Trägertyp 2021' },
    b: { sector: 'wirtschaft', theme: 'TH_01', label: 'Belegungsquoten privater Pflegeheime',          detail: 'Kapazität & Personalschlüssel, Bundesverband priv. Anbieter 2022' },
  },
  {
    id:    'obdachlosigkeit-wohnen',
    title: 'Obdachlosigkeit & Mietmarkt',
    icon:  'fa-house-crack',
    story: 'Erklärt der Mietmarkt, warum Wohnungslosigkeit in manchen Städten und Regionen zunimmt – und lässt sich dieser Zusammenhang empirisch belegen?\n\nDie bundesweite Wohnungslosenzählung dokumentiert, wo Menschen ohne Wohnung registriert werden – aber nicht, warum diese Regionen besonders betroffen sind oder ob es sich um strukturelle Entwicklungen handelt. Mietpreis-Zeitreihen und Angebotsmieten zeigen, wo Niedrigpreissegmente verschwinden und Mietbelastungsquoten steigen – aber nicht, welche konkreten sozialen Folgen das bereits produziert hat und für wen.\n\nEinzig die zeitlich-räumliche Überlagerung beider Datensätze bildet den Nexus: Regionen, in denen Angebotsmieten über einen Schwellenwert steigen, zeitgleich mit wachsender Wohnungslosigkeit, liefern eine strukturelle Kausalitätshypothese. Wo dagegen Mieten stark steigen, aber keine erhöhte Wohnungslosigkeit folgt, verweisen die Daten auf lokale Schutzfaktoren – kommunale Wohnungspolitik, soziale Netze, Beratungsinfrastruktur. Dieses Muster ist empirisch nur aus der Kombination beider Quellen zu ermitteln.',
    a: { sector: 'zivilgesellschaft', theme: 'TH_03', label: 'BAG W Wohnungslosenzählung 2022',    detail: 'Wohnungslose nach Kreisen & Unterbringungsform (bundesweit)' },
    b: { sector: 'wirtschaft',        theme: 'TH_04', label: 'ImmoScout24-Angebotsmieten',         detail: 'Medianmiete nach PLZ-Gebiet, Zeitreihe 2018–2023' },
  },
  {
    id:    'startup-atlas',
    title: 'Startup-Atlas',
    icon:  'fa-rocket',
    story: 'Entstehen forschungsintensive Startups tatsächlich dort, wo Patente angemeldet und Forschungsgelder eingeworben werden – oder klafft zwischen wissenschaftlichem Output und wirtschaftlicher Gründungsaktivität eine strukturelle Transferlücke?\n\nGründungsstatistiken zeigen, wo forschungsnahe Unternehmen entstehen – aber nicht, ob diese Gründungen auf lokale Forschungsinfrastruktur zurückgehen oder von ihr unabhängig sind. Patentdaten und Spin-off-Register dokumentieren, welche Hochschulen wissenschaftliches Kapital in Gründungen übersetzen – aber nicht, ob diese Gründungen am Entstehungsort bleiben und dort Beschäftigung aufbauen oder ob der Transfer in andere Regionen abfließt.\n\nEinzig die räumliche Überlagerung beider Datensätze erzeugt eine Transferkarte: Hochschulstandorte mit hohem Forschungsoutput und niedriger lokaler Gründungsaktivität signalisieren Transfer-Verluste – wissenschaftliches Kapital, das am Entstehungsort nicht in Wertschöpfung überführt wird. Standorte, an denen beides überdurchschnittlich zusammenkommt, zeigen, welche Ökosystem-Bedingungen den Transfer begünstigen. Dieses Muster ist weder aus Gründungs- noch aus Patentdaten allein erkennbar.',
    a: { sector: 'wirtschaft',   theme: 'TH_04', label: 'KfW-Gründungsmonitor: Forschungs-Startups', detail: 'Technologiegründungen nach PLZ, Branche & Gründerjahr 2023' },
    b: { sector: 'wissenschaft', theme: 'TH_10', label: 'DPMA Patentanmeldungen nach Hochschule',    detail: 'Patente & Spin-offs je Hochschulstandort 2020–2023' },
  },
  {
    id:    'digitale-bildungsluecke',
    title: 'Digitale Bildungslücke',
    icon:  'fa-wifi',
    story: 'Empfangen Schulen Digitalpakt-Fördermittel unabhängig davon, ob die lokale Breitbandinfrastruktur ihre Nutzung überhaupt ermöglicht – und entstehen so Regionen, die investiert sind, aber nicht verbunden?\n\nFörderdaten des Digitalpakts Schule dokumentieren, wo Mittel abgeflossen sind und welche IT-Ausstattung angeschafft wurde – aber nicht, ob die lokale Netzinfrastruktur die sinnvolle Nutzung dieser Investition erlaubt. Der Breitbandatlas der Bundesnetzagentur zeigt, wo Gigabit-Anschlüsse und Mindestbandbreiten verfügbar sind – aber nicht, welche Schulen dort stehen und ob ihr Investitionsgrad mit der Netzqualität korrespondiert.\n\nEinzig die Überlagerung beider Datensätze macht die Fehlallokation sichtbar: Schulen in Regionen mit hohem Fördermittelabfluss, aber geringer Breitbandverfügbarkeit, haben in Hardware investiert, ohne die Konnektivitätsbasis für deren Nutzung zu haben. Regionen mit guter Netzversorgung und niedrigem Digitalpakt-Abfluss zeigen das umgekehrte Muster. Diese räumliche Inkongruenz ist das eigenständige Erkenntnispotenzial dieser Kombination – und eine Planungsgrundlage, die weder Schulbehörden noch Netzbetreiber allein generieren können.',
    a: { sector: 'bildung', theme: 'TH_02', label: 'Digitalpakt: IT-Ausstattungsstand Schulen', detail: 'Fördermittelabfluss & Geräteausstattung nach Kreisen 2020–2024' },
    b: { sector: 'staat',   theme: 'TH_10', label: 'Breitbandatlas Bundesnetzagentur',          detail: 'Verfügbare Bandbreiten nach Gemeinde & Anschlussart 2023' },
  },
  {
    id:    'medien-demokratie',
    title: 'Lokale Medien & Demokratie',
    icon:  'fa-person-booth',
    story: 'Gibt es einen messbaren Zusammenhang zwischen dem Rückgang lokaler Medienberichterstattung und sinkender Wahlbeteiligung – und lässt sich dieser Zusammenhang kleinräumig zeigen?\n\nReichweitenstatistiken regionaler Tageszeitungen und Lokalmedien dokumentieren, wo lokale Öffentlichkeit schwindet und wo sie noch stark ist – aber nicht, welche Folgen das für politisches Engagement hat. Wahlbeteiligungsdaten zeigen kleinräumig, wer wählt und wer nicht – aber nicht, welche Informationsumgebung diese Entscheidung prägt und welche Rolle der Rückgang lokaler Berichterstattung dabei spielt.\n\nEinzig die räumliche Überlagerung beider Datensätze macht eine testbare Hypothese möglich: Kreise, in denen Lokalmedien-Reichweite zwischen zwei Wahlzyklen stark gesunken ist und Wahlbeteiligung ebenfalls zurückgegangen ist, bilden ein empirisches Muster. Kreise, in denen das Medienangebot stabil blieb und Beteiligung dennoch sank, zeigen, dass andere Faktoren dominieren. Diese Differenzierung – Medienschwund als Demokratieproblem oder Symptom – ist das eigenständige Erkenntnispotenzial dieser Kombination.',
    a: { sector: 'medien', theme: 'TH_03', label: 'IVW-Reichweitendaten Regionalmedien',         detail: 'Auflage & Reichweite lokaler Tageszeitungen nach Kreisen 2013–2023' },
    b: { sector: 'staat',  theme: 'TH_05', label: 'Wahlbeteiligungsstatistik nach Kreisen',      detail: 'Bundestagswahlen 2013, 2017, 2021 (Bundeswahlleiter)' },
  },
  {
    id:    'hitzeinseln-engagement',
    title: 'Hitzeinsel & Bürgerengagement',
    icon:  'fa-sun',
    story: 'Decken sich die thermischen Hotspots in deutschen Städten mit den Einzugsgebieten urbaner Klimaengagement-Initiativen – oder gibt es Hitzeinseln, die bürgerschaftlich nicht erreicht werden?\n\nFernerkundungsdaten von Sentinel-2 und Landsat zeigen kleinräumig, welche Stadtquartiere besonders unter Wärmestress leiden – aber nicht, welche zivilgesellschaftlichen Strukturen dort aktiv sind und ob sie die betroffenen Bevölkerungsgruppen erreichen. Engagement-Statistiken urbaner Klimainitiativen, Gemeinschaftsgärten und kommunaler Kühlraumangebote zeigen, wo Bürgerengagement für klimatische Anpassung präsent ist – aber nicht, ob diese Aktivitäten dort stattfinden, wo der Hitzestress am größten ist.\n\nEinzig die räumliche Überlagerung beider Datensätze erzeugt ein Versorgungsbild: Stadtquartiere mit extremer Wärmebelastung und wenig zivilgesellschaftlicher Klimapräsenz sind Hotspots doppelter Vulnerabilität – heiß und unversorgt. Wo Engagement-Aktivitäten und Hitzeinseln räumlich deckungsgleich sind, funktioniert die selbstorganisierte Anpassung. Diese Karte ist weder aus Satellitenbildern noch aus Engagementdaten allein zu erzeugen.',
    a: { sector: 'staat',             theme: 'TH_06', label: 'Sentinel-2 Urban Heat Island Daten',          detail: 'Oberflächentemperaturen nach Stadtquartier, Sommer 2018–2023' },
    b: { sector: 'zivilgesellschaft', theme: 'TH_06', label: 'Klimaengagement-Register urbaner Initiativen', detail: 'Standorte Gemeinschaftsgärten & Kühlraumangebote nach PLZ 2023' },
  },
  {
    id:    'kirche-wohlbefinden',
    title: 'Kirchenmitgliedschaft & Wohlbefinden',
    icon:  'fa-heart',
    story: 'Schützt konfessionelle Einbindung vor sozialer Isolation und psychischer Belastung – und lässt sich diese Hypothese aus dem Abgleich kirchlicher Mitgliedsdaten mit wissenschaftlichen Wohlbefindensstudien empirisch prüfen?\n\nKirchliche Statistiken dokumentieren Mitgliederzahlen, Aktivierungsgrade und Kirchenaustritte nach Region und Konfession – aber nicht, ob und wie stark konfessionelle Einbindung das individuelle Wohlbefinden der Mitglieder beeinflusst. Längsschnittstudien wie SOEP und DEAS erheben Lebenszufriedenheit, soziale Einbindung und psychische Gesundheit – aber nicht, welche Rolle religiöse Gemeinschaft im Vergleich zu anderen sozialen Faktoren spielt und ob dieser Effekt regional variiert.\n\nEinzig die räumliche Verknüpfung beider Quellen eröffnet einen empirischen Zugang: Regionen mit hohem konfessionellem Aktivierungsgrad und überproportional hohen Wohlbefindenswerten wären ein Hinweis auf protektive Wirkung. Regionen, in denen das nicht zutrifft, verweisen auf andere Faktoren oder auf eine Entkopplung von formaler Mitgliedschaft und sozialer Integration. Diese Differenzierung zwischen Mitgliedschaft und tatsächlicher Wirkung ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'religion',     theme: 'TH_03', label: 'EKD-Kirchenmitgliedschaftserhebung 2022',    detail: 'Mitgliederzahlen, Austritte & Aktivierungsgrad nach Bundesland' },
    b: { sector: 'wissenschaft', theme: 'TH_03', label: 'SOEP: Lebenszufriedenheit & soziale Einbindung', detail: 'Wellbeing-Panel 2010–2021, regionalisierbar bis Kreisebene' },
  },
  {
    id:    'kulturtourismus',
    title: 'Kulturtourismus-Wertschöpfung',
    icon:  'fa-masks-theater',
    story: 'Wie weit reicht die wirtschaftliche Wirkung von Kultureinrichtungen in die regionale Wirtschaft hinein – und lässt sich das aus dem Abgleich von Besucherzahlen und touristischen Ausgabenstatistiken zeigen?\n\nBesucherstatistiken von Museen, Theatern und Konzerthäusern zeigen, wie viele Menschen eine Institution aufsuchen – aber nicht, ob diese Besucher aus der Region kommen oder von weither reisen, wie viel sie außerhalb der Einrichtung ausgeben und welchen wirtschaftlichen Fußabdruck ihr Besuch hinterlässt. Übernachtungs- und Ausgabenstatistiken der Tourismuswirtschaft zeigen regionale Wirtschaftsströme – aber nicht, welcher Anteil davon kulturmotiviert ist und welche Einrichtungen den Ausschlag geben.\n\nEinzig die Verknüpfung beider Datensätze erzeugt eine Wertschöpfungskarte des Kulturtourismus: Einrichtungen, deren Besucherherkunft mit touristischen Übernachtungsmustern korreliert, sind ökonomische Anker ihrer Region – mit einer Reichweite, die weit über den eigenen Eintrittsumsatz hinausgeht. Diese Wirkungskettenanalyse ist das eigenständige Erkenntnispotenzial der Kombination und eine empirische Grundlage für kulturförderpolitische Entscheidungen.',
    a: { sector: 'medien',      theme: 'TH_04', label: 'Besucherstatistiken öffentl. Kultureinrichtungen', detail: 'Museen, Theater, Konzerthäuser nach Einrichtungstyp & PLZ 2023' },
    b: { sector: 'wirtschaft',  theme: 'TH_04', label: 'Tagesausgaben Kulturtouristen nach Landkreis',    detail: 'Tourismusdestinationsstatistik Destatis / DZT 2023' },
  },
  {
    id:    'bildungsrendite-regional',
    title: 'Bildungsrendite nach Region',
    icon:  'fa-chart-line',
    story: 'Bringt Bildung überall gleich viel – oder unterscheidet sich der wirtschaftliche Ertrag eines Schulabschlusses je nach Region und Branchenstruktur erheblich?\n\nSchulabschlussstatistiken der Länder dokumentieren, wie viele Menschen welchen Bildungsstand erreichen – differenziert nach Kreis, Schultyp und Migrationshintergrund. Sie wissen nicht, was dieser Abschluss wirtschaftlich bringt: ob der Weg von der Mittelschule in den Arbeitsmarkt in Bayern dieselben Einkommenschancen eröffnet wie in Brandenburg. Verdienststatistiken zeigen Bruttomonatslöhne nach Qualifikationsniveau und Region – aber nicht, wer dort arbeitet und welchen Bildungsweg diese Menschen genommen haben.\n\nEinzig die Verknüpfung beider Quellen macht die regionale Bildungsrendite sichtbar: Regionen, in denen ein bestimmter Bildungsabschluss überdurchschnittlich hohe Einkommen ermöglicht, zeigen strukturellen Fachkräftebedarf. Regionen, in denen dieselbe Qualifikation wenig einbringt, signalisieren entweder Überversorgung oder strukturelle Nachfrageschwäche. Diese räumliche Differenzierung des Bildungsertrags – nicht das Bundesmittel, sondern die regionale Variation – ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'bildung',    theme: 'TH_02', label: 'Schulabschlussquoten nach Kreis & Migrationshintergrund', detail: 'Destatis Schulstatistik: Abschlüsse nach Schultyp & Kreis 2023' },
    b: { sector: 'wirtschaft', theme: 'TH_04', label: 'Bruttomonatsverdienste nach Qualifikation & Region',       detail: 'Verdienststrukturerhebung Destatis nach Berufsfeld & Bundesland 2022' },
  },
  {
    id:    'forschungsgeld-spinoff',
    title: 'Forschungsgeld trifft Spin-off',
    icon:  'fa-flask',
    story: 'Wirkt staatliche Forschungsförderung als Gründungsmotor – oder fließt Bundesgeld in Projekte, ohne dass am Entstehungsort Unternehmen entstehen?\n\nDie BMBF-Förderdatenbank dokumentiert, welche Hochschulen in welchem Umfang Projektmittel einwerben – aber nicht, ob diese Investitionen in lokale Spin-offs münden oder ob das Wissen den Standort verlässt. Ausgründungsstatistiken der Hochschulrektorenkonferenz zeigen, wie viele Spin-offs je Hochschule entstehen – aber nicht, welche Förderbasis dem vorausging und ob der Transfer von Fördervolumen zu Gründungsaktivität proportional verläuft.\n\nEinzig die räumliche Gegenüberstellung beider Datensätze macht die Transfereffizienz sichtbar: Hochschulstandorte mit hohem Fördervolumen und niedriger Ausgründungsrate signalisieren Transferverluste – wissenschaftliches Kapital, das nicht in wirtschaftliche Wertschöpfung übergeht. Standorte mit hoher Ausgründungsrate trotz bescheidener Förderung zeigen, dass Ökosystem und Kultur wichtiger sind als Geldvolumen. Diese Relation – Förderinput zu Gründungsoutput – ist weder aus Förderdaten noch aus Ausgründungsstatistiken allein ermittelbar.',
    a: { sector: 'staat',        theme: 'TH_10', label: 'BMBF-Förderdatenbank: Projektmittel je Hochschulstandort', detail: 'Verbundprojekte nach Träger & Themenfeld, Förderjahre 2018–2023' },
    b: { sector: 'wissenschaft', theme: 'TH_10', label: 'HRK-Ausgründungsstatistik: Spin-offs nach Uni',            detail: 'Ausgründungen & Lizenztransfers je Hochschule & Gründungsjahr' },
  },
  {
    id:    'kirche-sozialstaat',
    title: 'Kirche & Sozialstaat',
    icon:  'fa-place-of-worship',
    story: 'Senkt eine dichte kirchliche Sozialinfrastruktur den kommunalen Bedarf an staatlichen Sozialleistungen – oder wachsen beide parallel, ohne sich zu ersetzen?\n\nCaritas, Diakonie und andere konfessionelle Wohlfahrtsverbände betreiben flächendeckend Beratungsstellen, Tafeln und Kriseneinrichtungen – aber ihre Kapazitäten sind selten in staatlichen Planungsdaten erfasst. Kommunale Sozialhilfestatistiken dokumentieren Ausgaben nach Kreis und Sozialgesetzbuch – aber nicht, welche Parallelversorgung durch nichtstaatliche Träger dort existiert und ob sie staatliche Leistungen substituiert oder ergänzt.\n\nEinzig die räumliche Überlagerung beider Quellen macht die Struktur sichtbar: Kreise mit hoher konfessioneller Sozialversorgungsdichte und unterdurchschnittlichen staatlichen Sozialausgaben wären ein Hinweis auf Substitutionseffekte. Kreise, in denen beides überdurchschnittlich hoch ist, zeigen Komplementarität – und hohen Gesamtbedarf. Diese Relation zwischen kirchlicher und staatlicher Sozialversorgung ist das eigenständige Erkenntnispotenzial der Kombination und eine empirische Grundlage für kommunale Sozialplanung.',
    a: { sector: 'religion', theme: 'TH_03', label: 'Caritas/Diakonie-Register: Beratungsstellen & Kapazitäten', detail: 'Einrichtungstyp, Platzkapazität & Standort nach PLZ 2023' },
    b: { sector: 'staat',    theme: 'TH_03', label: 'Sozialhilfeausgaben je Einwohner nach Kreis',               detail: 'Destatis SGB II & SGB XII, Kreisebene 2022' },
  },
  {
    id:    'medienpuls-impfquote',
    title: 'Medienpuls & Impfquote',
    icon:  'fa-syringe',
    story: 'Korreliert die Intensität der Medienberichterstattung über Impfkampagnen mit der tatsächlichen Impfbereitschaft der Bevölkerung – und wirkt Berichterstattung je nach Ausrichtung unterschiedlich?\n\nMedienarchive und Sendeprotokolle zeigen, wann und wie intensiv über Impfthemen berichtet wird – und mit welchem Sentiment. Sie wissen nicht, ob diese Berichterstattung die Impfbereitschaft der Bevölkerung erhöht, senkt oder überhaupt beeinflusst. Das Impfquoten-Monitoring des RKI zeigt regional und zeitlich präzise, wie viele Menschen geimpft sind – aber nicht, welche Informationsumgebung diese Entscheidung geprägt hat.\n\nEinzig der zeitlich und räumlich synchronisierte Abgleich beider Quellen eröffnet den empirischen Zugang: Bundesländer, in denen eine Welle intensiver positiver Berichterstattung mit einem messbaren Anstieg der Impfquote zusammenfällt, zeigen einen möglichen Medieneffekt. Regionen, in denen hohe Berichterstattungsintensität und sinkende Bereitschaft gleichzeitig auftreten, deuten auf einen Backfire-Effekt hin. Diese Differenzierung zwischen Berichterstattungsausrichtung und Verhaltensreaktion ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'medien',       theme: 'TH_01', label: 'dpa-Archiv: Artikel zu Impfthemen nach KW & Sentiment', detail: 'Überregionale Tageszeitungen & öffentl.-rechtl. Medien 2020–2023' },
    b: { sector: 'wissenschaft', theme: 'TH_01', label: 'RKI-Impfquoten-Monitoring nach Bundesland',             detail: 'Impfquoten nach Altersgruppe & Impfstoff, Wochenwerte 2020–2023' },
  },
  {
    id:    'ausbildungsmarkt-betriebsgroesse',
    title: 'Ausbildungsmarkt nach Betriebsgröße',
    icon:  'fa-user-graduate',
    story: 'Stellen kleine und mittlere Unternehmen Ausbildungsplätze dort bereit, wo Berufsschulen ausreichend Kapazität in den richtigen Fachrichtungen haben – oder entstehen strukturelle Passungsprobleme?\n\nStatistiken der Bundesagentur für Arbeit zeigen, wie viele Ausbildungsangebote pro Branche und Betriebsgröße verfügbar sind – aber nicht, ob am selben Ort geeignete Berufsschulen mit passender Spezialisierung vorhanden sind. Berufsschulstatistiken der Länder zeigen, wo welche Fachrichtungen unterrichtet werden – aber nicht, wie viele Ausbildungsbetriebe welcher Größe im Einzugsgebiet nach Nachwuchs suchen.\n\nEinzig die räumliche Verknüpfung beider Quellen macht strukturelle Fehlpassungen sichtbar: Regionen mit vielen Ausbildungsplätzen in einem Beruf, aber geringer Berufsschulkapazität in dieser Fachrichtung, haben einen systemischen Engpass. Regionen mit starken Berufsschulen, aber rückläufigen Ausbildungsangeboten, zeigen demografischen Wandel in der Betriebsstruktur. Diese räumliche Passungsanalyse ist das eigenständige Erkenntnispotenzial der Kombination.',
    a: { sector: 'wirtschaft', theme: 'TH_04', label: 'BA: Ausbildungsstellenangebote nach Betriebsgröße & Branche', detail: 'Gemeldete Stellen nach PLZ & Beruf, Ausbildungsjahr 2022/23' },
    b: { sector: 'bildung',    theme: 'TH_02', label: 'Berufsschülerstatistik nach Ausbildungsberuf & Landkreis',   detail: 'Schülerzahlen & Fachrichtungen nach Schulstandort 2022/23' },
  },
  {
    id:    'digitalfoerderung-mittelstand',
    title: 'Digitalförderung & Mittelstand',
    icon:  'fa-laptop-code',
    story: 'Fließen staatliche Digitalfördergelder in die Betriebe, die am stärksten digitalisierungsbedürftig sind – oder werden sie vor allem von bereits fortgeschrittenen Unternehmen abgerufen?\n\nDer KfW-Digitalisierungsmonitor und Mittelstandsbefragungen zeigen regionalisiert, welche Betriebsgrößen und Branchen strukturell rückständig bei Digitalisierung sind – aber nicht, ob diese Unternehmen staatliche Förderangebote tatsächlich nutzen. Förderdaten des Bundeswirtschaftsministeriums zeigen, welche Unternehmen Anträge stellen und bewilligt bekommen – aber nicht, ob das die am stärksten bedürftigen sind oder ob Fördernehmer schon vorher digitaler waren.\n\nEinzig der Abgleich beider Quellen macht das Targeting-Problem sichtbar: Regionen und Betriebstypen, in denen hohe Digitalisierungslücke und niedrige Förderausschöpfung zusammentreffen, zeigen, wo Förderinstrumente nicht durchdringen. Wo Unternehmen mit bereits hohem Digitalisierungsstand überproportional Fördermittel abrufen, dokumentieren die Daten eine strukturelle Fehlsteuerung. Diese Bilanz zwischen Bedarf und Inanspruchnahme ist das eigenständige Erkenntnispotenzial der Kombination.',
    a: { sector: 'wirtschaft', theme: 'TH_04', label: 'KfW-Digitalisierungsmonitor: IT-Reifegrad KMU nach Branche', detail: 'Digitalisierungsindex nach Betriebsgröße & Region, 2023' },
    b: { sector: 'staat',      theme: 'TH_05', label: 'go-digital-Förderdaten: bewilligte Anträge nach PLZ',        detail: 'BMWK-Programm: Fördersumme & Betriebsgröße nach Kreisen 2020–2023' },
  },
  {
    id:    'sport-herzgesundheit',
    title: 'Sport & Herzgesundheit',
    icon:  'fa-heartbeat',
    story: 'Senkt eine dichte Sportvereinsdichte die Herzerkrankungsrate in einem Landkreis – und lässt sich ein solcher Zusammenhang aus öffentlichen Daten belegen?\n\nDOSB-Vereinsstatistiken zeigen kleinräumig, wie dicht Sportangebote in einem Landkreis vorhanden sind – aber nicht, ob diese Aktivität einen messbaren Gesundheitseffekt auf Bevölkerungsebene hat und ob das Angebot von denjenigen genutzt wird, für die es gesundheitlich am wichtigsten wäre. Krankenhausstatistiken auf Basis der Fallpauschalendaten dokumentieren stationäre Behandlungen nach Diagnosegruppe und Wohnort – aber nicht, welche Lebensführung oder soziale Einbettung dem vorausging.\n\nEinzig die räumliche Überlagerung beider Datensätze eröffnet die Hypothesenprüfung: Landkreise mit überdurchschnittlicher Sportvereinsdichte und unterdurchschnittlicher Hospitalisierungsrate wegen Herzerkrankungen bilden ein Muster, das auf protektive Wirkung hindeutet. Kreise, in denen beides hoch ist, verweisen auf kompensierende soziale Risikofaktoren. Diese räumliche Korrelation – Vereinssport als Gesundheitsinfrastruktur – ist das eigenständige Erkenntnispotenzial der Kombination und eine empirische Basis für präventionsorientierte Kommunalpolitik.',
    a: { sector: 'zivilgesellschaft', theme: 'TH_01', label: 'DOSB-Vereinsstatistik: Sportvereinsdichte nach Kreis', detail: 'Mitglieder & Vereine je 1.000 Einwohner, Kreisebene 2022' },
    b: { sector: 'staat',             theme: 'TH_01', label: 'DRG-Statistik: Stationäre Herzaufenthalte nach Kreis', detail: 'Fallzahlen ICD I20–I25 nach Wohnort, Destatis 2022' },
  },
  {
    id:    'konfession-schulerfolg',
    title: 'Konfession & Schulerfolg',
    icon:  'fa-graduation-cap',
    story: 'Macht es für den Bildungsweg eines Kindes einen Unterschied, ob es in einer Region mit starker konfessioneller Prägung oder in einer säkularen Umgebung aufwächst – und lässt sich das aus verfügbaren Daten herausarbeiten?\n\nKonfessionszugehörigkeitsdaten der Kirchen und staatlichen Statistik zeigen regional, welche Bevölkerungsgruppen welchen Gemeinschaften angehören – aber nicht, welche Bildungswege diese Kinder nehmen und mit welchem Erfolg. Schul- und Abschlussstatistiken dokumentieren Bildungserfolge nach Schultyp und Bundesland – aber selten direkt mit dem Merkmal Religionszugehörigkeit, was eine direkte Auswertung verhindert.\n\nEinzig die räumliche Verknüpfung beider Quellen eröffnet eine indirekte Näherung: Kreise mit hohem Anteil einer Konfession können mit Schulerfolgsstatistiken der Region verglichen werden. Wo signifikante Muster entstehen, lässt sich prüfen, ob Bildungseinrichtungen in Trägerschaft dieser Konfession einen messbaren Unterschied machen oder ob soziodemografische Faktoren die treibenden Größen sind. Diese kontextualisierte Analyse ist das eigenständige Erkenntnispotenzial dieser Datenkombination.',
    a: { sector: 'religion', theme: 'TH_02', label: 'EKD/ZdK: Konfessionszugehörigkeit nach PLZ & Altersgruppe', detail: 'Mitgliederdichte & Altersstruktur nach Planungsregion 2022' },
    b: { sector: 'bildung',  theme: 'TH_02', label: 'Schulerfolgsstatistik nach Schultyp & Bundesland',          detail: 'Abschlussquoten & Übergangsraten nach Trägertyp, KMK 2023' },
  },
  {
    id:    'medienvertrauen-extremismus',
    title: 'Medienvertrauen & Extremismus',
    icon:  'fa-shield-halved',
    story: 'Steigt politisch motivierte Gewalt dort, wo das Vertrauen in klassische Medien gesunken ist – und lässt sich dieser Zusammenhang kleinräumig empirisch belegen?\n\nStudien wie der Reuters Digital News Report messen Medienvertrauen regional und zeitlich – aber nicht, ob sinkende Vertrauenswerte mit verändertem politischen Verhalten oder gesteigerter Gewaltbereitschaft korrelieren. Verfassungsschutzberichte und Strafverfolgungsstatistiken des BfV dokumentieren politisch motivierte Straftaten nach Bundesland – aber nicht, welche Informationsumgebung die Täter geprägt hat oder ob mediale Desintegration als Radikalisierungsfaktor wirkt.\n\nEinzig der zeitlich synchronisierte regionale Abgleich beider Quellen eröffnet die Hypothese: Bundesländer, in denen Medienvertrauen zwischen zwei Messpunkten stark gesunken und politisch motivierte Delikte zugleich gestiegen sind, zeigen ein korrelatives Muster. Länder, in denen beides voneinander abweicht, verweisen auf andere dominierende Faktoren. Diese Differenzierung zwischen Medienverdrossenheit und politischer Radikalisierung – ohne Kausalität zu unterstellen – ist das eigenständige Erkenntnispotenzial der Datenkombination.',
    a: { sector: 'medien', theme: 'TH_03', label: 'Reuters Digital News Report DE: Medienvertrauen nach Bundesland', detail: 'Vertrauensindex & Reichweite klassischer Medien 2019–2023' },
    b: { sector: 'staat',  theme: 'TH_08', label: 'BfV: Politisch motivierte Straftaten nach Bundesland',          detail: 'PMK-Statistik nach Phänomenbereich & Delikttyp 2019–2023' },
  },
  {
    id:    'ehrenamt-wahlbezirk',
    title: 'Ehrenamt im Wahlbezirk',
    icon:  'fa-ballot-check',
    story: 'Gibt es Wahlbezirke, in denen der Mangel an Wahlhelfern mit strukturell niedrigerer Wahlbeteiligung zusammenfällt – und zeigt sich darin, wie stark bürgerschaftliches Engagement die demokratische Infrastruktur trägt?\n\nFreiwilligensurveys zeigen, wo politisches und zivilgesellschaftliches Engagement stark oder schwach ausgeprägt ist – aber nicht, ob sich dieser Unterschied konkret in der Organisation von Wahlen niederschlägt oder ob Bezirke mit geringerem Engagementgrad Probleme bei der Besetzung von Wahlhelfer-Stellen haben. Wahlbeteiligungsstatistiken und Daten des Bundeswahlleiters zeigen kleinräumig, ob Wahllokale ausreichend besetzt sind und wie die Beteiligung ausfällt – aber nicht, welche Engagementstruktur dahintersteht.\n\nEinzig die räumliche Verknüpfung beider Quellen macht die Verbindung sichtbar: Wahlbezirke mit chronischem Wahlhelfermangel und gleichzeitig niedrigerer Wahlbeteiligung verweisen auf einen doppelten Engagementmangel. Bezirke, in denen trotz geringer Engagementdichte die Wahlen gut funktionieren, zeigen kompensatorische Strukturen. Diese Differenzierung – bürgerschaftliches Engagement als Fundament demokratischer Infrastruktur – ist das eigenständige Erkenntnispotenzial dieser Kombination.',
    a: { sector: 'zivilgesellschaft', theme: 'TH_05', label: 'Freiwilligensurvey: Politisches Engagement nach Region', detail: 'Engagementquote & Aktivitätsfelder nach Kreisen 2021' },
    b: { sector: 'staat',             theme: 'TH_05', label: 'Bundeswahlleiter: Wahlhelfer & Wahlbeteiligung',        detail: 'Wahlhelfereinsatz & Beteiligung nach Wahlbezirk, BTW 2021' },
  },
];

// ── Filter logic ──────────────────────────────────────────────────────────────

let _index      = [];
let _ready      = false;
let _onNavigate = null;
let _currentResult = null;
let _closeGen   = null;

export function initGenerator({ indexPromise, onNavigate }) {
  _onNavigate = onNavigate;
  indexPromise.then(idx => { _index = idx; _ready = true; });

  const modal      = document.getElementById('gen-modal');
  const closeBtn   = document.getElementById('gen-close');
  const rollBtn    = document.getElementById('gen-roll-btn');
  const triggerBtn = document.getElementById('gen-btn');

  let _trapCleanup = null;

  triggerBtn.addEventListener('click', () => {
    if (!modal.hidden) return;
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
  _closeGen = _close;
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
  tilesEl.innerHTML = buildTile(entryA, 'a', scenario.a) + '<div class="gen-connector"><i class="fa-solid fa-bolt"></i></div>' + buildTile(entryB, 'b', scenario.b);

  tilesEl.querySelectorAll('.gen-tile').forEach(el => {
    const handler = () => {
      const entry = el.dataset.side === 'a' ? entryA : entryB;
      navigateToEntry(entry);
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function buildTile(entry, side, filter = {}) {
  const sectorId = entry.breadcrumb[1]?.id ?? '';
  const meta     = SECTOR_META[sectorId] ?? { name: sectorId, color: '#888' };
  const name     = filter.label  ?? entry.tile.name;
  const sub      = filter.detail ?? entry.breadcrumb
    .filter(c => c.id != null && c.level >= 2 && c.level <= 3)
    .map(c => c.name).join(' · ');

  return `<div class="gen-tile" data-side="${side}" style="background:${meta.color};border-color:rgba(0,0,0,0.10);" tabindex="0" role="button">
    <div class="gen-tile-sector">
      <span class="gen-tile-dot" style="background:rgba(255,255,255,0.35)"></span>
      <span class="gen-tile-sector-name">${esc(meta.name)}</span>
    </div>
    <div class="gen-tile-name">${esc(name)}</div>
    <div class="gen-tile-path">${esc(sub)}</div>
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
  _closeGen?.();
  _onNavigate?.(entry);
}
