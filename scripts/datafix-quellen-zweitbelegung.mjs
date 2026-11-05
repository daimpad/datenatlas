// Zweite Quellenprüfung (details.sources) — 15 Datentypen, 2026-11-04.
//
// Ausgewählt wurden Einträge, deren Beschreibung eine konkrete, benannte
// Statistik meint; allgemeine Typen („kommunales Zuwendungsregister“) lassen
// sich mit einer Quelle nicht belegen. Jede Aussage wurde gegen die Seite oder
// das PDF des Herausgebers geprüft, jedes Belegzitat danach automatisch per
// Textsuche auf der Quellseite wiedergefunden (127 von 127).
//
// Ergebnis: keiner der 15 Einträge stimmte vollständig. 14 sind auf das
// Belegte korrigiert und tragen jetzt Quellen. Einer bleibt Einschätzung, weil
// sein Kern nicht belegbar ist (Vereinsdichte nach Kreisen) — die falsche
// Zuschreibung an ZiviZ ist dort entfernt.
//
// Was korrigiert wurde, steht je Eintrag unten. Wiederkehrende Fehler:
//   – Rhythmus: 7 von 15 falsch (u. a. SurvStat „unregelmäßig“ statt
//     wöchentlich, Bundesbank jährlich statt halbjährlich, Börsenverein
//     „monatlich“ statt jährlich). Dafür sind FQ_06–FQ_08 nachgetragen.
//   – Startjahr: 6 falsch, wo ein belegtes vorlag.
//   – Herausgeber oder Gesetz falsch zugeschrieben: Derivatestatistik der
//     BaFin (ist Eurex), Gender Pay Gap „nach EntgTranspG“ (ist die
//     Verdiensterhebung), § 60 MStV als Pflicht zu „Transparenzberichten“
//     (regelt den KEK-Bericht), „Engagement-Atlas“ als ZiviZ-Produkt (gibt es
//     nicht; ZiviZ weist Vereinsdichte nur je Bundesland aus).
//   – Rechte: Für AGF-Streamingdaten und die Media-Control-Anteile im
//     Börsenverein-Bericht war „sofort publizierbar“ mit freier Lizenz
//     angegeben; die Rechteinhaber untersagen bzw. kennzeichnen das. Klasse
//     dort auf „nach Aufbereitung“, Lizenz proprietär — das Hindernis ist das
//     Nutzungsrecht, nicht der Personenbezug.
//
// Begründungen sind nur neu geschrieben, wo sie den belegten Fakten
// widersprachen oder eine Aussage über fremde Veröffentlichungspraxis
// enthielten (Regel 3). Sie bleiben Einschätzung.
//
// Aufruf aus dem Repo-Wurzelverzeichnis: node scripts/datafix-quellen-zweitbelegung.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const CHECKED = '2026-11-04';
const src = (title, publisher, url, supports) => ({ title, publisher, url, checked: CHECKED, supports });
const FMT = { FT_01: 'CSV', FT_07: 'PDF', FT_08: 'Excel (XLSX)' };
const fmt = (...codes) => codes.map(code => ({ code, label: FMT[code] }));

const SURVSTAT = 'https://survstat.rki.de/Docs/SurvStat2Anleitung.pdf';
const BA_AKG   = 'https://statistik.arbeitsagentur.de/DE/Navigation/Service/akg/akg-Nav.html';
const DESTATIS_GPG = 'https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-GenderPayGap/_inhalt.html';

const PATCHES = {
  // ── staat ────────────────────────────────────────────────────────────────
  infektionsstatistik: {
    description: 'Aggregierte Fallzahlen meldepflichtiger Infektionskrankheiten nach dem Infektionsschutzgesetz, gegliedert nach Meldewoche, Kreis (zuständiges Gesundheitsamt), Krankheit bzw. Erreger, Altersgruppe und Geschlecht, wahlweise als Inzidenz pro 100.000 Einwohner und nach Saisonwochen. Grundlage ist ein vereinfachter Datenbestand der Fälle, die die Gesundheitsämter über die Landesstellen an das RKI übermitteln; voreingestellt ist die Referenzdefinition der RKI-Publikationen. Die Ergebnistabellen lassen sich als CSV herunterladen.',
    explanation: 'Ausgewiesen werden gemeldete Fälle je Kreis, Meldewoche, Erreger, Altersgruppe und Geschlecht, also Fallzählungen ohne Personenmerkmale. Der Datenbestand ist für diese Auswertung vereinfacht; die Referenzdefinition macht Zahlen verschiedener Abfragen vergleichbar.',
    temporal: { available_from: 2001, update_frequency: 'FQ_06' },  // war 1994, unregelmäßig
    granularity: 'GR_03',                                           // Kreis, nicht aggregiert
    format: fmt('FT_01'),                                           // JSON wird nicht angeboten
    sources: [
      src('SurvStat@RKI 2.0 – Anleitung', 'Robert Koch-Institut', SURVSTAT,
        'Meldeweg Gesundheitsamt – Landesstelle – RKI; Gliederung nach Meldewoche, Kreis, Erreger, Alter, Geschlecht und Saison; Inzidenz pro 100.000; Daten ab 2001; wöchentlich; CSV'),
      src('SurvStat@RKI 2.0 – Variablenübersicht', 'Robert Koch-Institut', 'https://survstat.rki.de/Docs/Variablen%C3%BCbersicht.pdf',
        'Kreis = für den Fall zuständiges Gesundheitsamt'),
      src('Forschungsdaten nutzen – SurvStat@RKI', 'Robert Koch-Institut', 'https://www.rki.de/DE/Aktuelles/Publikationen/Forschungsdaten/survstat_inhalt.html',
        'vereinfachter Datenbestand der meldepflichtigen Fälle'),
    ],
  },
  'wirtschaftsstandort-beschaeftigungsstruktur-branche': {
    // Beschrieben war eine Beschäftigtenstatistik nach Branche und Stadtbezirk,
    // „öffentlich verfügbar“. Es gibt sie so nicht: Kleinräumige BA-Daten sind
    // nach Wohnadresse zugeordnet, ohne Wirtschaftszweig, und nur per Vertrag.
    name: 'Beschäftigte nach Stadtbezirk (kleinräumige BA-Daten)',
    description: 'Sozialversicherungspflichtig Beschäftigte und weitere Arbeitsmarktdaten der Bundesagentur für Arbeit für kleinräumige Teilgebiete wie Stadtbezirke und Ortsteile, zugeordnet nach der Wohnadresse und ausgewiesen für die Stichtage im März, Juni, September und Dezember. Kommunen beziehen sie über gesonderte, kostenpflichtige Vereinbarungen; im Internet berichtet die BA bis zur Gemeinde.',
    explanation: 'Kleinräumige Beschäftigtenzahlen unterliegen der statistischen Geheimhaltung; in dünn besetzten Teilgebieten verweist eine kleine Zelle auf Einzelne. Die Weitergabe regelt der Bezugsvertrag mit der BA, Bezirkswerte sind erst ab einer Mindestbesetzung auszuweisen.',
    openness: 'OP_02', license: 'LI_04',                            // war OP_01, Datenlizenz Deutschland
    temporal: { update_frequency: 'FQ_08' },                         // war jährlich
    sources: [
      src('Arbeitsmarktdaten für kleinräumige Gebiete', 'Bundesagentur für Arbeit, Statistik', BA_AKG,
        'kleinräumige Teilgebiete (Ortsteile, Stadtbezirke); gesonderte vertragliche Vereinbarung, kostenpflichtig; Stichtage März, Juni, September, Dezember'),
      src('Kleinräumige Gebiete – Fragen und Antworten', 'Bundesagentur für Arbeit, Statistik',
        'https://statistik.arbeitsagentur.de/DE/Statischer-Content/Service/akg/Generische-Publikationen/Fragen-und-Antworten.pdf?__blob=publicationFile&v=1',
        'Zuordnung der Personen nach Wohnadresse'),
      src('Kleinräumige Gebiete – Informationsbroschüre', 'Bundesagentur für Arbeit, Statistik',
        'https://statistik.arbeitsagentur.de/DE/Statischer-Content/Service/akg/Generische-Publikationen/Informationsbroschuere.pdf?__blob=publicationFile&v=1',
        'kleinste Ebene der Internet-Berichterstattung ist die Gemeinde'),
    ],
  },

  // ── wirtschaft ───────────────────────────────────────────────────────────
  'fdi-konten-zahlungsverkehr-volumen': {
    description: 'Anzahl und Wert der Zahlungstransaktionen nach Zahlungsinstrument (u. a. Überweisungen, SEPA-Echtzeitüberweisungen, Lastschriften, Kartenzahlungen), erfasst für Kunden inländischer Zahlungsdienstleister und aufgeteilt nach Inland und Ausland. Die Deutsche Bundesbank erhebt die Zahlungsverkehrsstatistik als Vollerhebung; seit dem Berichtsjahr 2022 werden die meisten Positionen halbjährlich gemeldet und in einer halbjährlichen Statistischen Fachreihe veröffentlicht.',
    temporal: { available_from: 2002, update_frequency: 'FQ_07' },  // war 2006, jährlich
    sources: [
      src('Zahlungsverkehrs- und Wertpapierabwicklungsstatistiken (Statistische Fachreihe)', 'Deutsche Bundesbank',
        'https://www.bundesbank.de/resource/blob/804046/804f3e2eac4977f67b4b5f7c8b177362/472B63F073F071307366337C94F8C870/0-zahlungsverkehrs-und-wertpapierabwicklungsstatistiken-data.pdf',
        'Anzahl und Wert der Transaktionen nach Zahlungsinstrument; Vollerhebung; erscheint halbjährlich'),
      src('Zahlungsverkehrsstatistik (Meldewesen)', 'Deutsche Bundesbank',
        'https://www.bundesbank.de/de/service/meldewesen/bankenstatistik/zahlungsverkehrsstatistik-613524',
        'überwiegend halbjährliche Meldung ab 2022'),
      src('Statistiken über den Zahlungsverkehr in Deutschland 2002–2006', 'Deutsche Bundesbank',
        'https://www.bundesbank.de/resource/blob/615864/ea59c03f9e9bb8553a23fecc973020f2/472B63F073F071307366337C94F8C870/statistiken-ueber-den-zahlungsverkehr-in-deutschland-2002-2006-data.pdf',
        'Zahlungsverkehrsdaten ab 2002'),
    ],
  },
  'derivatives-marktstatistik': {
    // Herausgeber ist die Eurex, nicht die BaFin; Swaps sind keine gehandelten Kontrakte.
    description: 'Anzahl der gehandelten börsennotierten Derivatekontrakte (Futures und Optionen) an der Eurex, gegliedert nach Produktgruppen wie Zins-, Index- und Aktienderivaten, veröffentlicht als monatliche Statistik der Börse. Swaps erscheinen dort nicht als gehandelte Kontrakte, sondern im OTC-Clearing als Nominalvolumen.',
    temporal: { update_frequency: 'FQ_03' },
    sources: [
      src('Eurex Monthly Statistics September 2026', 'Eurex',
        'https://www.eurex.com/resource/blob/5619300/123b20220f20deb12dc1bbf726359039/data/monthlystat_202609.pdf',
        'monatliche Zahl gehandelter Futures und Optionen nach Produktgruppe; Swaps nur als OTC-Clearing-Nominalvolumen'),
    ],
  },
  'pw-am-entgeltgleichheit-reporting': {
    // Der Eintrag steht unter Personalwesen (Trägertyp: Unternehmen) und
    // bleibt deshalb die betriebliche Auswertung. Die Grundlage „Entgelt-
    // gleichheitsanalyse nach EntgTranspG und VSE“ war eine Vermengung: Das
    // Gesetz fordert Prüfverfahren nur auf, sein Bericht nennt keine Lücke,
    // und der Gender Pay Gap des Bundesamts kommt aus der Verdiensterhebung.
    description: 'Betriebliche Auswertung der Entgelte von Frauen und Männern, etwa im Rahmen eines Prüfverfahrens, zu dem das Entgelttransparenzgesetz private Arbeitgeber mit in der Regel mehr als 500 Beschäftigten auffordert. Der gesetzliche Bericht zur Gleichstellung und Entgeltgleichheit nennt nach Geschlecht nur Beschäftigtenzahlen, keine Entgeltlücke. Vergleichswerte nach Wirtschaftszweig und Unternehmensgröße liefert der unbereinigte Gender Pay Gap des Statistischen Bundesamts.',
    explanation: 'Einzelne Entgelte sind Personaldaten, und in kleinen Entgeltgruppen lässt schon ein Mittelwert auf einzelne Beschäftigte schließen. Auszuweisen sind Lücken je Entgeltgruppe deshalb erst ab einer Mindestbesetzung je Geschlecht.',
    temporal: { available_from: 2017 },                              // Gesetz vom 30.06.2017
    sources: [
      src('Entgelttransparenzgesetz', 'Bundesministerium der Justiz (gesetze-im-internet.de)',
        'https://www.gesetze-im-internet.de/entgtranspg/BJNR215210017.html', 'Gesetz vom 30. Juni 2017'),
      src('EntgTranspG § 17 Betriebliche Prüfverfahren', 'Bundesministerium der Justiz (gesetze-im-internet.de)',
        'https://www.gesetze-im-internet.de/entgtranspg/__17.html', 'Aufforderung an private Arbeitgeber mit in der Regel mehr als 500 Beschäftigten'),
      src('EntgTranspG § 21 Bericht zur Gleichstellung und Entgeltgleichheit', 'Bundesministerium der Justiz (gesetze-im-internet.de)',
        'https://www.gesetze-im-internet.de/entgtranspg/__21.html', 'Bericht nennt nach Geschlecht Beschäftigtenzahlen, keine Entgeltlücke'),
      src('Unbereinigter Verdienstunterschied nach unternehmensbezogenen Merkmalen', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-GenderPayGap/Tabellen/gpg-unternehmen.html',
        'unbereinigter Gender Pay Gap nach Wirtschaftszweig und Unternehmensgröße'),
    ],
  },

  // ── wissenschaft ─────────────────────────────────────────────────────────
  foerderprojektdatenbank: {
    description: 'Verzeichnisse bewilligter Forschungsvorhaben, etwa der Förderkatalog des Bundes mit Laufzeit, Bewilligungssumme, Förderempfänger und Leistungsplansystematik; er gibt nach eigener Angabe keinen vollständigen Überblick über alle Vorhaben des Bundes. GEPRIS der DFG informiert über Projekte aus fast allen DFG-Förderprogrammen mit beteiligten Personen, Einrichtungen und Fachklassifikation. CORDIS stellt EU-geförderte Projekte mit Laufzeit, Gesamtkosten und EU-Beitrag als monatlich erzeugte Datensätze bereit.',
    explanation: 'Bewilligte Vorhaben dokumentieren die Verwendung öffentlicher Mittel. Titel, Laufzeit, Fördersumme und Empfängereinrichtung betreffen Institutionen; die Namen der Projektleitungen sind Teil der Bewilligung, private Kontaktdaten gehören nicht in den Datensatz.',
    sources: [
      src('Förderkatalog', 'Bundesregierung (foerderportal.bund.de)', 'https://foerderportal.bund.de/foekat/jsp/StartAction.do',
        'Verzeichnis geförderter Bundesvorhaben, nach eigener Angabe nicht vollständig'),
      src('Förderkatalog – Detailsuche', 'Bundesregierung (foerderportal.bund.de)', 'https://foerderportal.bund.de/foekat/jsp/SucheAction.do?actionMode=searchmask',
        'Merkmale Laufzeit, Bewilligungssumme, Förderempfänger, Leistungsplansystematik'),
      src('GEPRIS Project Information System Relaunched', 'Deutsche Forschungsgemeinschaft', 'https://www.dfg.de/en/news/news-topics/announcements-proposals/2026/ifr-26-43',
        'Projekte fast aller DFG-Programme mit Personen, Einrichtungen, Fachklassifikation'),
      src('CORDIS – EU research projects under Horizon Europe (2021–2027)', 'Amt für Veröffentlichungen der EU (data.europa.eu)',
        'https://data.europa.eu/api/hub/search/datasets/cordis-eu-research-projects-under-horizon-europe-2021-2027',
        'monatlich erzeugte Projektdatensätze mit Laufzeit, Gesamtkosten, EU-Beitrag'),
    ],
  },

  // ── zivilgesellschaft ────────────────────────────────────────────────────
  'engagement-atlas-regional-dichte': {
    // Nicht belegbar, aber falsch zugeschrieben: Einen „Engagement-Atlas“ von
    // ZiviZ gibt es nicht, ZiviZ weist Vereinsdichte je Bundesland und je
    // 1.000 Einwohner aus, nicht je Kreis und je 10.000. Die Zuschreibung ist
    // entfernt; der Eintrag bleibt ein modellierter Datentyp ohne Quelle.
    name: 'Vereinsdichte nach Kreisen',
    description: 'Zahl eingetragener Vereine je 1.000 Einwohner nach Kreisen und kreisfreien Städten, berechnet aus den Vereinsregistern. Zeigt regionale Unterschiede der organisierten Zivilgesellschaft unterhalb der Länderebene.',
  },

  // ── medien ───────────────────────────────────────────────────────────────
  'mediatheken-reichweitendaten-ard-zdf': {
    description: 'Streaming-Reichweitendaten der AGF Videoforschung, die auch die Streaming-Angebote von ARD und ZDF erfassen: Views, Nettoreichweiten und verweildauerbasierte Werte, ausgewiesen auf Ebene von Einzelvideos, Publishern und Ausspielplattformen. Die AGF weist seit 2017 monatlich und seit 2019 täglich Streamingdaten aus; öffentlich erscheint monatlich eine Top-25-Hitliste. Die Rechte an den Daten liegen bei der AGF Videoforschung.',
    explanation: 'Die Datenbankrechte an der Streamingmessung liegen bei der AGF Videoforschung; eine Weitergabe in recherchierbarer Form braucht ihre Zustimmung. Personenbezug ist nicht das Hindernis, gezählt werden Abrufe und Verweildauern je Video, nicht Nutzende.',
    openness: 'OP_02', license: 'LI_04',                            // war OP_01, CC BY 4.0
    temporal: { available_from: 2017, update_frequency: 'FQ_02' },  // war 2007, quartalsweise/unregelmäßig
    sources: [
      src('Videostreaming-Daten', 'AGF Videoforschung', 'https://www.agf.de/daten/videostreaming-daten',
        'Ausweis seit 2017 monatlich, seit 2019 täglich; Einzelvideo, Publisher, Plattform; monatliche Top-25-Liste'),
      src('Messung Videostreaming', 'AGF Videoforschung', 'https://www.agf.de/bewegtbildforschung/messung/videostreaming',
        'Views, Verweildauern, Nettoreichweiten'),
      src('TV- und Video-Bilanz 2025 (Pressemitteilung)', 'AGF Videoforschung',
        'https://www.agf.de/fileadmin/agf/service/Pressemitteilungen/2026/260108_PM_Jahresbilanz/260108_AGF_PM_Video_Jahresbilanz_2025_final.pdf',
        'ARD und ZDF in der Streamingmessung'),
      src('Umgang mit AGF-Daten / Urheberrechte', 'AGF Videoforschung', 'https://www.agf.de/daten/umgang-mit-agf-daten-/-urheberrechte-an-agf-daten',
        'Rechte bei der AGF; keine Weitergabe in recherchierbarer Form'),
    ],
  },
  'e-paper-auflagen': {
    description: 'Von der IVW geprüfte, quartalsweise gemeldete Auflagen von Tages- und Wochenzeitungen, Publikums- und Fachzeitschriften einschließlich der ePaper-Verkäufe sowie Stand-alone-ePaper. Ergänzend veröffentlicht die IVW monatlich die tagesdurchschnittlich verkauften Nutzungsrechte von Paid-Content-Angeboten nach Preiskorridoren.',
    explanation: 'Gezählt werden verkaufte Exemplare und Zugänge je Titel und Quartal, keine Abonnentinnen und Abonnenten. Die Zahlen sind Marktdaten der Verlage; Kundendaten bleiben im Vertrieb.',
    temporal: { update_frequency: 'FQ_08' },                         // war monatlich
    sources: [
      src('Print und ePublishing', 'IVW', 'https://ivw.de/print-epublishing/', 'quartalsweise geprüfte Auflagen gedruckter und digitaler Ausgaben'),
      src('Paid Content', 'IVW', 'https://ivw.de/paid-content/', 'monatliche Paid-Content-Zugänge nach Preiskorridoren'),
      src('Pressemitteilung IVW-Auflagenstatistik Q3/2026', 'IVW', 'https://ivw.de/pressemitteilung-ivw-auflagenstatistik-q32026/',
        'erfasste Gattungen einschließlich ePaper'),
    ],
  },
  'eigentuemer-verlage-strukturdaten': {
    // § 60 MStV regelt die Meinungsvielfalt im Fernsehen und den KEK-Bericht,
    // keine „Transparenzberichte der Medienunternehmen“. Die Mediendatenbank
    // von Hans-Bredow-Institut und bpb ließ sich nicht belegen.
    description: 'Inhaber- und Beteiligungsverhältnisse von Medienunternehmen in Presse, Hörfunk, Fernsehen und Onlinebereich, wie sie die Mediendatenbank der KEK (Kommission zur Ermittlung der Konzentration im Medienbereich) ausweist. Die KEK beschreibt außerdem Verflechtungen zwischen bundesweiten Fernsehveranstaltern und Tageszeitungsverlagen; ihr Konzentrationsbericht erscheint nach § 60 MStV alle drei Jahre oder auf Anforderung der Länder.',
    explanation: 'Aufzubereiten sind verschachtelte Beteiligungsketten über mehrere Gesellschaften, damit mittelbare Anteile und Zurechnungen nachvollziehbar werden. Gesellschafter sind überwiegend Unternehmen; wo Privatpersonen beteiligt sind, genügt die Angabe des Anteils.',
    sources: [
      src('Mediendatenbank', 'KEK', 'https://www.kek-online.de/mediendatenbank/', 'Inhaber- und Beteiligungsverhältnisse, auch der Presse'),
      src('Tageszeitungen – Verflechtungen', 'KEK', 'https://www.kek-online.de/medienkonzentration/medienrelevante-verwandte-maerkte/tageszeitungen/',
        'Verflechtungen von Fernsehveranstaltern und Tageszeitungsverlagen'),
      src('MStV § 60 Sicherung der Meinungsvielfalt im Fernsehen', 'Freistaat Bayern (gesetze-bayern.de)', 'https://www.gesetze-bayern.de/Content/Document/MStV-60',
        'KEK-Bericht alle drei Jahre oder auf Anforderung der Länder'),
    ],
  },

  // ── kultur ───────────────────────────────────────────────────────────────
  'boersenverein-buchmarkt-umsatzbericht': {
    description: 'Jährliche Wirtschaftszahlen des Börsenvereins des Deutschen Buchhandels zum Buchmarkt des Vorjahres, vorgestellt jeweils Anfang Juli. Das frei abrufbare Tabellenkompendium enthält geschätzte Umsätze buchhändlerischer Betriebe zu Endverbraucherpreisen nach Vertriebswegen sowie die prozentualen Umsatzanteile der Warengruppen auf Grundlage von Media Control. Ausführlicher erscheint jährlich das kostenpflichtige Kompendium „Buch und Buchhandel in Zahlen“.',
    explanation: 'Die Branchenzahlen sind Aggregate ohne Personenbezug. Die Warengruppenanteile stammen aus einem Panel von Media Control und tragen deren Urheberhinweis; eine freie Weitergabe setzt voraus, dass diese Rechte geklärt sind.',
    openness: 'OP_02', license: 'LI_04',                            // war OP_01, CC BY 4.0
    format: fmt('FT_07'),                                           // war CSV
    temporal: { update_frequency: 'FQ_04' },                         // war monatlich
    sources: [
      src('Wirtschaftszahlen', 'Börsenverein des Deutschen Buchhandels', 'https://www.boersenverein.de/markt-daten/marktforschung/wirtschaftszahlen/',
        'jährliche Buchmarktzahlen des Vorjahres, Anfang Juli'),
      src('Tabellenkompendium zu „Buchmarkt kompakt 2025/2026“', 'Börsenverein des Deutschen Buchhandels',
        'https://www.boersenverein.de/fileadmin/bundesverband/dokumente/presse/digitale_pressemappen/WIPK/Tabellenkompendium_2026.pdf',
        'Umsätze nach Vertriebswegen; Warengruppen als Anteile, Quelle Media Control'),
      src('Buch und Buchhandel in Zahlen', 'Börsenverein des Deutschen Buchhandels', 'https://www.boersenverein.de/markt-daten/buch-und-buchhandel-in-zahlen/',
        'jährliches, kostenpflichtiges Kompendium'),
    ],
  },

  // ── religion ─────────────────────────────────────────────────────────────
  'ev-mitglieder-statistik': {
    description: 'Jährliche Kirchenmitgliederstatistik der EKD zum Stichtag 31. Dezember, erstellt vom Kirchenamt der EKD aus dem kirchlichen Meldewesen. Ausgewiesen werden die evangelischen Kirchenmitglieder nach den 20 Gliedkirchen und nach Bundesländern, jeweils insgesamt und darunter Frauen, sowie im Verhältnis zur Bevölkerung.',
    explanation: 'Gezählt werden Kirchenmitglieder je Gliedkirche und Bundesland zum Jahresende, nicht einzelne Personen. Die Zahlen stammen aus dem kirchlichen Meldewesen; Einzeldaten bleiben in den Verzeichnissen der Gemeinden.',
    temporal: { available_from: 2001 },                              // war 2000
    format: fmt('FT_07', 'FT_08'),                                  // war CSV
    sources: [
      src('Kirchenmitgliederzahlen am 31.12.2025', 'EKD', 'https://www.ekd.de/ekd_de/ds_doc/Bericht_Kirchenmitglieder_2025.pdf',
        'Mitglieder nach Gliedkirchen und Bundesländern, insgesamt und Frauen; aus dem kirchlichen Meldewesen'),
      src('Kirchenmitgliederzahlen (Downloads)', 'EKD', 'https://www.ekd.de/kirchenmitgliederzahlen-downloads-44413.htm',
        'jährliche Berichte seit Stichtag 31.12.2001; PDF, ab 2023 auch XLSX'),
    ],
  },
  'antisemitismusmeldestellen-vorfaelle-bundesland': {
    // „Meldestellen der Bundesländer“ sind zivilgesellschaftliche Projekte;
    // die Kategorien waren nicht die RIAS-Typen; RIAS und BKA zählen getrennt.
    description: 'Jährlicher Bericht „Antisemitische Vorfälle in Deutschland“ des Bundesverbands RIAS e. V. mit den Vorfällen, die regionale RIAS-Meldestellen dokumentieren. Er weist die Vorfälle je Bundesland als Gesamtzahl aus und bundesweit nach sechs Vorfalltypen: extreme Gewalt, Angriffe, gezielte Sachbeschädigungen, Bedrohungen, verletzendes Verhalten und Massenzuschriften. Getrennt davon nennt das Bundeskriminalamt jährlich die Zahl polizeilich registrierter antisemitischer Straftaten; beide Zählungen werden nicht systematisch abgeglichen.',
    explanation: 'Ausgewiesen werden Vorfallzahlen je Bundesland und bundesweit je Vorfalltyp, keine Fallschilderungen mit Ort und Datum. Meldende und Betroffene sind besonders schutzbedürftig; Einzelfallangaben, die auf sie verweisen könnten, bleiben bei den Meldestellen.',
    granularity: 'GR_02',                                           // Länderebene, war kleinräumig
    format: fmt('FT_07'),                                           // war CSV, JSON
    sources: [
      src('Antisemitische Vorfälle in Deutschland. Jahresbericht 2025', 'Bundesverband RIAS',
        'https://www.report-antisemitism.de/documents/17-06-26_RIAS_Bund_Jahresbericht_2025.pdf',
        'Vorfälle je Bundesland (Gesamtzahl) und bundesweit nach Vorfalltyp; kein systematischer Abgleich mit Polizeidaten'),
      src('Arbeitsweisen', 'Bundesverband RIAS', 'https://www.report-antisemitism.de/arbeitsweisen/', 'sechs Vorfalltypen'),
      src('Fallzahlen zur Politisch motivierten Kriminalität 2025', 'Bundeskriminalamt',
        'https://www.bka.de/DE/UnsereAufgaben/Deliktsbereiche/PMK/PMKZahlen/PMKZahlen_node.html', 'jährliche Zahl antisemitischer Straftaten'),
    ],
  },
  'hilfswerke-spendeneinnahmen-zeitreihe': {
    description: 'Jährliche Spendeneinnahmen der kirchlichen Hilfswerke Brot für die Welt, Misereor, Caritas international und Diakonie Katastrophenhilfe aus ihren Jahresberichten; die Diakonie Katastrophenhilfe nennt dabei auch Spendenbeträge für einzelne Krisen. Mehrjährige Übersichten bieten Brot für die Welt (2021–2025) und Misereor (2016–2025). Der DZI Spenden-Almanach enthält einen statistischen Anhang zu den Einnahmen der Spenden-Siegel-Organisationen.',
    explanation: 'Spendeneinnahmen sind Gesamtsummen je Hilfswerk und Jahr, keine Angaben zu Spendenden. Einzelspenden und Spenderdaten bleiben in der Buchhaltung; ausgewiesen werden Summen je Jahr und gegebenenfalls je Krise.',
    temporal: { update_frequency: 'FQ_04' },                         // war monatlich
    sources: [
      src('Jahresbericht und Zahlen', 'Brot für die Welt', 'https://www.brot-fuer-die-welt.de/ueber-uns/transparenz/jahresbericht-uebersicht/', 'Spenden und Kollekten 2021–2025'),
      src('Jahresbericht', 'Misereor', 'https://www.misereor.de/ueber-misereor/transparenz/jahresbericht', 'Einnahmen 2016–2025'),
      src('Pressemitteilung zum Jahresbericht 2025', 'Caritas international',
        'https://www.caritas-international.de/cms/contents/caritas-internationa/medien/dokumente/sonstiges/jahresberichte/pressemitteilung--ja/jpk_2026_pressemitteilung.docx',
        'private Spenden 2025 und Vorjahr'),
      src('Jahresbericht 2025', 'Diakonie Katastrophenhilfe',
        'https://www.diakonie-katastrophenhilfe.de/fileadmin/Mediapool/40_ueber-uns/Jahresberichte/2026/DKH_Jahresbericht_2025.pdf',
        'Spendeneinnahmen 2025 und Spenden je Krise'),
      src('Spenden-Almanach', 'DZI', 'https://www.dzi.de/spendenberatung/spendenauskunfte-und-information/spenden-almanach/',
        'statistischer Anhang zu Einnahmen der Spenden-Siegel-Organisationen'),
    ],
  },

  // ── bildung ──────────────────────────────────────────────────────────────
  schulstatistik: {
    description: 'Amtliche Statistik der allgemeinbildenden Schulen: eine jährliche Totalerhebung der Länder zu Schulen, Klassen, Schülerinnen und Schülern nach Klassenstufen und Schularten, Absolvierenden und Abgehenden nach Abschlussarten sowie Lehrkräften, jeweils für das Schuljahr. Sie ist eine koordinierte Länderstatistik auf Grundlage von Vereinbarungen mit der Kultusministerkonferenz und reicht in den Ländern bis zur Gemeindeebene bzw. bis zu den Schulen.',
    explanation: 'Schülerzahlen, Klassen, Lehrkräfte und Absolvierende liegen bis zur Gemeinde- und Schulebene vor. Personenbezogen werden sie erst in sehr kleinen Einheiten: Wo eine Abschlussart an einer Schule nur wenige Fälle zählt, ist zusammenzufassen.',
    sources: [
      src('Qualitätsbericht Statistik der allgemeinbildenden Schulen', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Bildung/allgembildende-schulen.pdf?__blob=publicationFile&v=8',
        'jährliche Totalerhebung; Erhebungsinhalte; koordinierte Länderstatistik (KMK); räumliche Tiefe bis Gemeinde und Schule'),
    ],
  },
};

const seen = new Set();
for (const f of readdirSync('public/data').filter(f => f.startsWith('sector_'))) {
  const path = `public/data/${f}`;
  const data = JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  (function walk(n) {
    const p = PATCHES[n.id];
    if (p && n.level === 4) {
      const d = n.details;
      if (p.name)        n.name = p.name;
      if (p.description) d.description = p.description;
      if (p.explanation) d.openness.explanation = p.explanation;
      if (p.openness)    d.openness = { ...d.openness, class: p.openness, label: LABELS[p.openness] };
      if (p.license)     d.license = { code: p.license };
      if (p.granularity) d.granularity = { code: p.granularity };
      if (p.format)      d.format = p.format;
      if (p.temporal)    d.temporal = { ...d.temporal, ...p.temporal };
      if (p.sources)     d.sources = p.sources;
      seen.add(n.id); changed = true;
    }
    (n.children ?? []).forEach(walk);
  })(data);
  if (changed) writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

const missing = Object.keys(PATCHES).filter(id => !seen.has(id));
if (missing.length) { console.error('nicht gefunden:', missing.join(', ')); process.exit(1); }
const sourced = Object.values(PATCHES).filter(p => p.sources).length;
console.log(`geändert: ${seen.size} Datentypen, davon ${sourced} mit Quelle`);
