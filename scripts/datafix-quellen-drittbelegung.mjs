// Dritte Quellenprüfung (details.sources) — 16 Datentypen, 2026-11-05.
//
// Ausgewählt nach Herausgebern, die in den ersten beiden Runden nicht dran
// waren (Bundesnetzagentur, DWD, KBA, UBA, GKV-Spitzenverband, BfJ, Destatis-
// Fachstatistiken u. a.), verteilt über alle acht Sektoren. Jedes Belegzitat
// ist danach maschinell auf der Quellseite wiedergefunden worden (160 von 160;
// eines davon in einer XLSX-Datei).
//
// Ergebnis: keiner der 16 Einträge stimmte vollständig. Alle 16 sind auf das
// Belegte korrigiert; 16 tragen Quellen. Wo der beschriebene Datensatz so
// nicht existiert, sagt die Beschreibung das jetzt selbst:
//   – Stiftungsregister: „seit 2026 verpflichtend“ ist falsch, das Register
//     startet nach Verschiebung am 1.1.2028 — eine Neueintragungsstatistik
//     gibt es noch nicht. available_from 2028; die Zeitleiste lässt
//     angekündigte Jahre aus der Verfügbarkeitskurve heraus.
//   – Arzneimittel-Erstattungspreise: Die Begründung behauptete eine
//     gesetzliche Veröffentlichungspflicht. Der GKV-Spitzenverband listet nur,
//     für welche Mittel ein Betrag vereinbart ist; seit 2025 kann der
//     Hersteller den Betrag vertraulich halten. OP_01 → OP_02, Lizenz LI_04.
//   – Katholische Krankenhäuser: „rund 370“ ist falsch (kkvd: 261), und die
//     amtliche Statistik weist konfessionelle Träger nicht aus.
//
// Wiederkehrend: Startjahr (12×), Format (9×), Rhythmus (7×), Lizenz (7×).
// Vier Herausgeber nutzen eigene Nutzungsbedingungen „frei mit Quellenangabe“
// (Breitbandatlas, BA-Statistik, thru.de, Destatis-Publikationen) — dafür ist
// LI_05 nachgetragen; FQ_09 für den zweijährlichen Kulturfinanzbericht.
//
// Elf der 16 alten Begründungen enthielten Praxisaussagen („bereits als Open
// Data verfügbar“, „KBA veröffentlicht …“), die claimsThirdPartyPractice()
// nicht erkennt. Sie sind einzeln neu geschrieben.
//
// Aufruf aus dem Repo-Wurzelverzeichnis: node scripts/datafix-quellen-drittbelegung.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const CHECKED = '2026-11-05';
const src = (title, publisher, url, supports) => ({ title, publisher, url, checked: CHECKED, supports });
const fmt = (...codes) => codes.map(code => ({ code, label: LABELS[code] }));

const GIGA = 'https://gigabitgrundbuch.bund.de/GIGA/DE';
const DWD_LEGAL = src('Rechtliche Hinweise', 'Deutscher Wetterdienst',
  'https://www.dwd.de/DE/service/rechtliche_hinweise/rechtliche_hinweise_node.html', 'Lizenz CC BY 4.0 für frei zugängliche Geodaten');
const DESTATIS_IMPRESSUM = 'https://www.destatis.de/DE/Service/Impressum/_inhalt.html';
const GKV_AMNOG = 'https://www.gkv-spitzenverband.de/krankenversicherung/arzneimittel/verhandlungen_nach_amnog';

const PATCHES = {
  // ── staat ────────────────────────────────────────────────────────────────
  'breitbandversorgung-geodaten': {
    description: 'Der Breitbandatlas der Bundesnetzagentur (Zentrale Informationsstelle des Bundes) zeigt die Verfügbarkeit von Festnetz- und Mobilfunk-Breitband nach Technologie und Bandbreitenklasse von 10 bis 1000 Mbit/s. Ausgewiesen wird auf Rasterzellen von 100 m × 100 m sowie für Bund, Länder, Landkreise und Gemeinden; erhoben wird adressgenau. Grundlage sind die halbjährlichen Versorgungsmeldungen der verpflichteten Telekommunikationsunternehmen.',
    explanation: 'Ausgewiesen wird Versorgung je Rasterzelle und Gemeinde, nicht je Anschluss. Die adressgenauen Meldungen der Netzbetreiber bleiben in der Erhebung; die Weiterverwendung ist frei, verlangt aber Quellenangabe und die Kennzeichnung eigener Änderungen.',
    license: 'LI_05',                                                 // war Datenlizenz Deutschland
    format: fmt('FT_08', 'FT_01'),                                    // war GeoJSON, Shapefile
    temporal: { available_from: 2018, update_frequency: 'FQ_07' },  // war 2000, jährlich
    sources: [
      src('Breitbandatlas', 'Bundesnetzagentur (Gigabit-Grundbuch)', `${GIGA}/Breitbandatlas/start.html`,
        'Betreiber Bundesnetzagentur/ZIS; Festnetz und Mobilfunk; adressgenaue Erhebung; Datenstände ab Ende 2018'),
      src('Methodenbericht zum Breitbandatlas', 'Bundesnetzagentur (Gigabit-Grundbuch)', `${GIGA}/Breitbandatlas/Dokumente/Methodenbericht_BBA.html`,
        'Bandbreitenklassen; Rasterzellen 100 m und Verwaltungsebenen bis Gemeinde; halbjährliche Datenlieferung'),
      src('Downloads', 'Bundesnetzagentur (Gigabit-Grundbuch)', `${GIGA}/Downloads_Suche/start.html`, 'Formate xlsx, csv, gpkg'),
    ],
  },
  'bfa-wetterradar-daten': {
    description: 'Der Deutsche Wetterdienst (DWD) betreibt einen Verbund von 17 Wetterradaren und leitet daraus mit dem Verfahren RADOLAN flächendeckende Niederschlagsanalysen mit 1 km² räumlicher Auflösung im Echtzeitbetrieb ab; RADOLAN läuft seit Juni 2005 im Routinebetrieb. Auf dem Open-Data-Server liegen Radarkomposite, Einzelstandortdaten im HDF5-Format und reprozessierte Radarniederschlagsdaten ab 2001 im NetCDF-Format.',
    explanation: 'Radarreflektivität und daraus berechnete Niederschlagsmengen sind Messwerte über Flächen von einem Quadratkilometer, ohne jeden Bezug zu Personen. Für die Weiterverwendung genügt ein Quellenvermerk.',
    license: 'LI_02',                                                 // war CC0
    format: fmt('FT_03'),                                             // GeoJSON wird nicht angeboten
    temporal: { available_from: 2001 },                               // war 1992
    sources: [
      src('RADOLAN (Radar-Online-Aneichung)', 'Deutscher Wetterdienst', 'https://www.dwd.de/DE/leistungen/radolan/radolan.html',
        '17 Wetterradare; 1 km² Auflösung; Echtzeitbetrieb; Routinebetrieb seit Juni 2005'),
      src('Reprozessierte RADOLAN-Daten (NetCDF)', 'Deutscher Wetterdienst (Open-Data-Server)',
        'https://opendata.dwd.de/climate_environment/CDC/grids_germany/hourly/radolan/reproc/2017_002/netCDF/', 'NetCDF-Zeitreihe ab 2001'),
      DWD_LEGAL,
    ],
  },
  'finanzen-steuer-gewerbesteuer-kommunal': {
    // Fachserie 14 Reihe 10.1 ist eingestellt und gliederte nur nach Ländern
    // und Gemeindegrößenklassen; Gemeindewerte stehen in der Regionaldatenbank.
    description: 'Das Statistische Bundesamt (Destatis) weist im jährlichen Realsteuervergleich das Istaufkommen der Gewerbesteuer und die Hebesätze der Realsteuern aus. Erhoben wird bei den Gemeinden; die Ergebnisse werden für die Gemeinden und aggregiert für höhere regionale Ebenen dargestellt. Die frühere Fachserie 14 Reihe 10.1 ist eingestellt und durch einen Statistischen Bericht ersetzt.',
    explanation: 'Ausgewiesen werden Istaufkommen und Hebesätze je Gemeinde. Das Aufkommen ist eine Haushaltsgröße der Gemeinde, kein einzelner Steuerfall; die Hebesätze legt jede Gemeinde ohnehin per Satzung fest.',
    format: fmt('FT_08'),                                             // war CSV, XML
    sources: [
      src('Qualitätsbericht Realsteuervergleich', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Steuern/realsteuervergleich.pdf?__blob=publicationFile&v=11',
        'Gewerbesteuer-Istaufkommen und Hebesätze je Gemeinde; jährlich'),
      src('Realsteuervergleich – Fachserie 14 Reihe 10.1', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Themen/Staat/Steuern/Steuereinnahmen/Publikationen/Downloads-Realsteuern/realsteuervergleich-2141010217004.pdf',
        'Fachserie eingestellt'),
      src('Steuereinnahmen', 'Statistisches Bundesamt (Destatis)', 'https://www.destatis.de/DE/Themen/Staat/Steuern/Steuereinnahmen/_inhalt.html',
        'Statistischer Bericht Realsteuervergleich als xlsx'),
    ],
  },
  'staat-gesundheit-soziales-grundsicherung-statistik': {
    description: 'Die Statistik der Bundesagentur für Arbeit weist monatlich die Bedarfsgemeinschaften und ihre Mitglieder nach dem SGB II für Deutschland, Länder und Kreise aus, mit Zeitreihen ab 2005 und Angaben zum Typ der Bedarfsgemeinschaft. Die Empfänger von Grundsicherung im Alter und bei Erwerbsminderung nach dem SGB XII erhebt das Statistische Bundesamt seit 2015 quartalsweise; Standardveröffentlichungen liegen vor allem für Bund und Länder vor.',
    license: 'LI_05',                                                 // BA-Nutzungsbedingungen, nicht DL-DE
    temporal: { available_from: 2005, update_frequency: 'FQ_03' },  // war 2013, jährlich
    sources: [
      src('Grundsicherung für Arbeitsuchende – Personengruppen und Bedarfsgemeinschaften', 'Bundesagentur für Arbeit, Statistik',
        'https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Fachstatistiken/Grundsicherung-fuer-Arbeitsuchende-SGBII/Personengruppen-Bedarfsgemeinschaften/Personengruppen-Bedarfsgemeinschaften-Nav.html',
        'monatlich; Länder und Kreise; Typ der Bedarfsgemeinschaft'),
      src('Grundsicherung für Arbeitsuchende – Überblick', 'Bundesagentur für Arbeit, Statistik',
        'https://statistik.arbeitsagentur.de/DE/Navigation/Statistiken/Fachstatistiken/Grundsicherung-fuer-Arbeitsuchende-SGBII/Ueberblick/Ueberblick-Nav.html',
        'Zeitreihe ab 2005; Kreisebene'),
      src('Qualitätsbericht Grundsicherung im Alter und bei Erwerbsminderung', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Soziales/grundsicherung-alter-erwerbsminderung.pdf?__blob=publicationFile&v=11',
        'SGB XII quartalsweise seit 2015; Standardveröffentlichung Bund und Länder'),
    ],
  },

  // ── wirtschaft ───────────────────────────────────────────────────────────
  'auto-neuzulassungen-kba-monatsbericht': {
    description: 'Das Kraftfahrt-Bundesamt (KBA) veröffentlicht monatlich die Neuzulassungen von Personenkraftwagen nach Marken und Modellreihen (FZ 10). Die Monatsergebnisse (FZ 8) gliedern die Neuzulassungen unter anderem nach Bundesländern, Herstellern, Kraftstoffarten sowie nach privaten und gewerblichen Haltern.',
    explanation: 'Gezählt werden neu zugelassene Fahrzeuge je Marke, Modellreihe, Kraftstoffart und Haltergruppe, nicht Halterinnen und Halter. Die Gliederung reicht bis zum Bundesland; Namen und Anschriften bleiben im Zentralen Fahrzeugregister.',
    format: fmt('FT_08'),                                             // seit 2023 nur Excel
    temporal: { available_from: 2004 },                               // war 2003
    sources: [
      src('Neuzulassungen von Pkw nach Marken und Modellreihen (FZ 10)', 'Kraftfahrt-Bundesamt',
        'https://www.kba.de/DE/Statistik/Produktkatalog/produkte/Fahrzeuge/fz10/fz10_gentab.html', 'monatlich nach Marke und Modellreihe; Archiv ab 2004'),
      src('Produkte der Statistik 2026', 'Kraftfahrt-Bundesamt',
        'https://www.kba.de/DE/Statistik/produkte_der_statistik.pdf?__blob=publicationFile&v=16',
        'FZ 8 nach Bundesländern, Kraftstoffarten, privaten und gewerblichen Haltern'),
      src('Downloadbereich Fahrzeuge', 'Kraftfahrt-Bundesamt',
        'https://www.kba.de/DE/Statistik/Fahrzeuge/Downloadbereich/Downloadbereich_Fahrzeuge_node.html', 'seit 2023 nur Excel'),
      src('Fragen und Antworten zur Statistik', 'Kraftfahrt-Bundesamt', 'https://www.kba.de/DE/Statistik/FaQ_Statistik/faq_node.html',
        'Datenlizenz Deutschland – Namensnennung 2.0'),
    ],
  },
  'kaufpreisindizes-wohnimmobilien': {
    // Die Bundesbank-Indizes beruhen auf bulwiengesa-Daten, nicht auf
    // Gutachterausschüssen; Portaldaten fließen in den Häuserpreisindex nicht ein.
    description: 'Häuserpreisindex des Statistischen Bundesamtes: Preisindizes für Eigentumswohnungen sowie Ein- und Zweifamilienhäuser, berechnet aus den Transaktionspreisen, die die Gutachterausschüsse für Grundstückswerte melden, mit hedonischer Qualitätsbereinigung. Die Ergebnisse erscheinen vierteljährlich, zusätzlich getrennt nach Regionstypen; Zeitreihen auf Bundesebene reichen bis 2000 zurück.',
    explanation: 'Der Index verdichtet die Preise vieler Kaufverträge zu Indexwerten je Objektart und Regionstyp. Einzelne Kaufpreise und Grundstücke sind darin nicht erkennbar; sie bleiben in den Kaufpreissammlungen der Gutachterausschüsse.',
    temporal: { available_from: 2000, update_frequency: 'FQ_08' },  // war 1996, monatlich
    sources: [
      src('Qualitätsbericht Häuserpreisindex', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Preise/haeuserpreisindex.pdf?__blob=publicationFile&v=3',
        'Gutachterausschüsse als Datenquelle; hedonische Qualitätsbereinigung; vierteljährlich'),
      src('Preise für Wohnimmobilien im 2. Quartal 2026 (Pressemitteilung)', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/09/PD26_336_61262.html', 'Zeitreihen ab 2000; Regionstypen'),
      src('Impressum (Copyright GENESIS-Online)', 'Statistisches Bundesamt (Destatis)', DESTATIS_IMPRESSUM, 'Datenlizenz Deutschland 2.0'),
    ],
  },
  'hafen-umschlagsstatistik': {
    // Die Begründung erklärte die Offenheit damit, dass Einzelangaben in den
    // Monatswerten aufgehen. Tatsächlich erlaubt § 29 Abs. 3 VerkStatG die
    // Veröffentlichung nach Häfen ausdrücklich auch mit Einzelangaben.
    description: 'Seeverkehrsstatistik des Statistischen Bundesamtes: monatlich erhobener Güterumschlag der deutschen Seehäfen nach Güterart, Ladungsart, Lade- und Löschhafen sowie Schiffsart und Flagge, ausgewiesen für Bund, Länder und Häfen. Als Open-Data-Datensatz stehen Monatsdaten ab 2011 im CSV-Format bereit, die jährlich gebündelt bereitgestellt werden. Nach § 29 Abs. 3 VerkStatG dürfen die Ergebnisse nach Häfen auch dann veröffentlicht werden, wenn sie Einzelangaben enthalten.',
    explanation: 'Ausgewiesen wird Güterumschlag je Hafen, Güterart und Flagge. Das Gesetz erlaubt die Veröffentlichung nach Häfen auch dann, wenn ein Wert auf wenige Umschläge zurückgeht; die Namen der meldenden Unternehmen bleiben geschützt.',
    sources: [
      src('Open Data Schiffsverkehr', 'Statistische Ämter des Bundes und der Länder', 'https://www.statistikportal.de/de/veroeffentlichungen/open-data-schiffsverkehr',
        'CSV-Monatsdaten ab 2011; jährliche Bereitstellung; Gliederungsmerkmale'),
      src('Qualitätsbericht Seeverkehrsstatistik', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Transport-Verkehr/seeverkehr.pdf?__blob=publicationFile&v=14',
        'monatliche Erhebung; Merkmale; Ebene Häfen; Veröffentlichung nach § 29 Abs. 3 VerkStatG'),
      src('Open Data', 'Statistische Ämter des Bundes und der Länder', 'https://www.statistikportal.de/de/open-data', 'Datenlizenz Deutschland 2.0; CSV und XML'),
    ],
  },
  'pharma-erstattungspreise': {
    description: 'Erstattungsbeträge für neue Arzneimittel nach der frühen Nutzenbewertung, vereinbart zwischen GKV-Spitzenverband und Herstellern (§ 130b Abs. 1 SGB V) oder festgesetzt (§ 130b Abs. 4 SGB V); betroffen sind Mittel, die ab dem 1. Januar 2011 in Verkehr gebracht wurden. Der GKV-Spitzenverband listet, für welche Arzneimittel ein Betrag vereinbart ist; den Betrag selbst meldet der Hersteller an das Preis- und Produktverzeichnis. Seit 2025 kann er nach § 130b Abs. 1c SGB V bestimmen, dass der Betrag dort nicht gemeldet wird.',
    explanation: 'Erstattungsbeträge sind Preise, die die gesetzliche Krankenversicherung zahlt, und betreffen keine Personen. Seit der Hersteller Vertraulichkeit wählen kann, ist für diese Fälle nur noch die Tatsache der Vereinbarung veröffentlichbar, nicht der Betrag.',
    openness: 'OP_02', license: 'LI_04',                            // war OP_01, Datenlizenz Deutschland
    temporal: { available_from: 2011 },                               // war 2000
    sources: [
      src('Erstattungsbetragsvereinbarungen nach § 130b SGB V', 'GKV-Spitzenverband', `${GKV_AMNOG}/ebv_130b/ebv_nach_130b.jsp`,
        'Liste der Arzneimittel mit vereinbartem oder festgesetztem Erstattungsbetrag'),
      src('Erstattungsbetrag – Meldung an das Preis- und Produktverzeichnis', 'GKV-Spitzenverband', `${GKV_AMNOG}/ebv_130b/wirkstoff_192514.jsp`,
        'Meldepflicht des Herstellers an das Preis- und Produktverzeichnis'),
      src('Verhandlungen nach AMNOG', 'GKV-Spitzenverband', `${GKV_AMNOG}/rabatt_verhandlungen_nach_amnog.jsp`,
        'Arzneimittel ab 1.1.2011; seit 2025 vertraulicher Erstattungsbetrag nach § 130b Abs. 1c SGB V möglich'),
      src('Bestimmungsrecht für vertrauliche Erstattungsbeträge', 'GKV-Spitzenverband', `${GKV_AMNOG}/vertrauliche_eb_bestimmungsrecht/veb_bestimmungsrecht.jsp`,
        'vertraulicher Betrag wird nicht im öffentlichen Verzeichnis gelistet'),
      src('Impressum', 'GKV-Spitzenverband', 'https://www.gkv-spitzenverband.de/impressum/impressum.jsp',
        'Zitieren nur unverändert und im Sachzusammenhang'),
    ],
  },
  'uba-emissionsregister-chemie': {
    description: 'Schadstofffreisetzungs- und -verbringungsregister (PRTR) des Umweltbundesamts auf thru.de: jährliche Angaben berichtspflichtiger Industriebetriebe, darunter der chemischen Industrie, zu Freisetzungen von 91 Schadstoffen und Schadstoffgruppen in Luft, Wasser und Boden. Berichten müssen Betriebe oberhalb von Kapazitäts- und Emissionsschwellen; das Register ist nach § 2 Abs. 1 SchadRegProtAG frei und unentgeltlich zugänglich, der Gesamtdatenbestand reicht bis zum ersten Berichtsjahr 2007 zurück.',
    explanation: 'Das Register weist Freisetzungen und Verbringungen je Betrieb aus; Betriebe sind Unternehmen, keine Privatpersonen. Die Weiterverwendung ist mit Quellenhinweis frei, die Inhalte dürfen dabei aber nicht verändert werden.',
    license: 'LI_05',                                                 // thru.de-Bedingungen, nicht DL-DE
    format: fmt('FT_01', 'FT_08'),                                    // war CSV, GeoJSON
    temporal: { available_from: 2007, update_frequency: 'FQ_04' },  // war 2001, Echtzeit
    sources: [
      src('FAQ', 'Umweltbundesamt (thru.de)', 'https://thru.de/faq/',
        '91 Schadstoffe; chemische Industrie; Schwellenwerte; jährlich; erstes Berichtsjahr 2007'),
      src('Downloads – PRTR-Gesamtdatenbestand', 'Umweltbundesamt (thru.de)', 'https://thru.de/downloads/', 'Formate XLSX, ODS, CSV, SQLite'),
      src('Gesetz zur Ausführung des PRTR-Protokolls (SchadRegProtAG)', 'Bundesministerium der Justiz (gesetze-im-internet.de)',
        'https://www.gesetze-im-internet.de/schadregprotag/BJNR100210007.html', 'Register frei und unentgeltlich zugänglich (§ 2 Abs. 1); jährlich'),
      src('Nutzungsbedingungen', 'Umweltbundesamt (thru.de)', 'https://thru.de/nutzungsbedingungen/', 'Quellenhinweis; keine Veränderung'),
    ],
  },

  // ── wissenschaft ─────────────────────────────────────────────────────────
  'klimafolgen-vegetationsperiode-phänologie': {
    description: 'Phänologische Beobachtungen des Deutschen Wetterdienstes: Ehrenamtliche Beobachter melden Eintrittsdaten von Entwicklungsphasen wildwachsender Pflanzen und Waldbäume (vom Austrieb und Blühbeginn bis zum Blattfall) und landwirtschaftlicher Kulturpflanzen (von der Bestellung bis zur Ernte). Die Zeitreihen der Jahresmelder reichen mindestens bis 1951 zurück und stehen als CSV-Textdateien kostenfrei im CDC-Portal bereit.',
    license: 'LI_02',                                                 // war Datenlizenz Deutschland
    format: fmt('FT_01'),                                             // NetCDF wird nicht angeboten
    temporal: { available_from: 1951 },                               // war 2016
    sources: [
      src('Datensatzbeschreibung: Eintrittsdaten landwirtschaftlicher Kulturpflanzen (Jahresmelder)', 'Deutscher Wetterdienst',
        'https://opendata.dwd.de/climate_environment/CDC/observations_germany/phenology/annual_reporters/crops/historical/BESCHREIBUNG_obsgermany-phenology-annual_reporters-crops-historical_de.pdf',
        'Beobachternetz; Phasen bis zur Ernte; ab 1951; CSV; CC BY 4.0'),
      src('Datensatzbeschreibung: Eintrittsdaten wildwachsender Pflanzen (Jahresmelder)', 'Deutscher Wetterdienst',
        'https://opendata.dwd.de/climate_environment/CDC/observations_germany/phenology/annual_reporters/wild/historical/BESCHREIBUNG_obsgermany-phenology-annual_reporters-wild-historical_de.pdf',
        'Phasen Austrieb, Blühbeginn, Blattfall'),
      src('Phänologie – Daten Deutschland', 'Deutscher Wetterdienst',
        'https://www.dwd.de/DE/klimaumwelt/klimaueberwachung/phaenologie/daten_deutschland/daten_deutschland_node.html', 'kostenfrei im CDC-Portal'),
    ],
  },

  // ── medien ───────────────────────────────────────────────────────────────
  'netzdg-berichte-beschwerdestatistik': {
    description: 'Halbjährliche Transparenzberichte, die Anbieter sozialer Netzwerke mit mehr als zwei Millionen registrierten Nutzern und mehr als 100 Beschwerden im Kalenderjahr nach § 2 NetzDG im Bundesanzeiger und auf der eigenen Webseite veröffentlichen mussten. Sie enthalten das Beschwerdeaufkommen nach Beschwerdegrund und Beschwerdestelle sowie die Bearbeitungszeit. Erster Berichtszeitraum war das erste Halbjahr 2018; mit der Anpassung an den Digital Services Act im Mai 2024 ist § 2 NetzDG weggefallen.',
    explanation: 'Die Berichte nennen Beschwerdezahlen nach Beschwerdegrund und Bearbeitungszeit, nicht die beanstandeten Inhalte oder ihre Urheber. Als abgeschlossene Reihe von 2018 bis 2024 dokumentieren sie den Umgang der Netzwerke mit Beschwerden vor dem Digital Services Act.',
    temporal: { available_from: 2018, update_frequency: 'FQ_07' },  // war 2007, jährlich
    sources: [
      src('Bericht der Bundesregierung zur Evaluierung des NetzDG (BT-Drs. 19/22610)', 'Deutscher Bundestag', 'https://dserver.bundestag.de/btd/19/226/1922610.pdf',
        'halbjährliche Berichte im Bundesanzeiger und auf der Webseite; Inhalte'),
      src('Beschlussempfehlung und Bericht des Rechtsausschusses (BT-Drs. 18/13013)', 'Deutscher Bundestag', 'https://dserver.bundestag.de/btd/18/130/1813013.pdf',
        'Sechsmonatsrhythmus; Schwellen 2 Mio. Nutzer und 100 Beschwerden'),
      src('Netzwerkdurchsetzungsgesetz', 'Bundesministerium der Justiz (gesetze-im-internet.de)', 'https://www.gesetze-im-internet.de/netzdg/BJNR335210017.html',
        '§ 2 weggefallen'),
      src('Enforcement of the Law in Social Networks', 'Bundesamt für Justiz',
        'https://bundesjustizamt.de/EN/Topics/EnforcementoftheLawinSocialNetworks/EnforcementoftheLawinSocialNetworks_node.html', 'große Teile des NetzDG im Mai 2024 aufgehoben'),
    ],
  },
  'transparenzberichte-plattformen-dsa': {
    // Rechtsgrundlage ist Art. 42 Abs. 1, nicht Art. 15; erste Benennungen am
    // 25.04.2023, nicht „seit Februar 2023“. transparency.dsa.ec.europa.eu ist
    // die Datenbank der Einzelbegründungen, nicht der Transparenzberichte.
    description: 'Transparenzberichte über die Moderation von Inhalten, die sehr große Online-Plattformen (VLOPs) und sehr große Online-Suchmaschinen (VLOSEs) nach Art. 42 Abs. 1 DSA mindestens alle sechs Monate selbst veröffentlichen müssen; die ersten Benennungen erfolgten am 25. April 2023. Nach der Durchführungsverordnung der Kommission sind dafür einheitliche Vorlagen im CSV- oder XLSX-Format zu verwenden. In Deutschland ist die Koordinierungsstelle für digitale Dienste in der Bundesnetzagentur eingerichtet.',
    explanation: 'Die Berichte enthalten aggregierte Zahlen zur Moderation von Inhalten je Dienst, keine einzelnen Entscheidungen oder Nutzerkonten. Ihre Offenlegung schreibt der Digital Services Act den Anbietern selbst vor.',
    format: fmt('FT_01', 'FT_08'),                                    // war JSON, XML
    temporal: { available_from: 2023, update_frequency: 'FQ_07' },  // war 1999, jährlich
    sources: [
      src('How the Digital Services Act enhances transparency online', 'Europäische Kommission', 'https://digital-strategy.ec.europa.eu/en/policies/dsa-brings-transparency',
        'Veröffentlichung durch VLOPs/VLOSEs alle sechs Monate'),
      src('Implementing Regulation laying down templates for transparency reports', 'Europäische Kommission', 'https://ec.europa.eu/newsroom/dae/redirection/document/109692',
        'Art. 42 Abs. 1 DSA; Vorlagen im CSV- oder XLSX-Format'),
      src('Supervision of the designated very large online platforms and search engines', 'Europäische Kommission',
        'https://digital-strategy.ec.europa.eu/en/policies/list-designated-vlops-and-vloses', 'erste Benennungen am 25.04.2023'),
      src('Digitale-Dienste-Gesetz § 14', 'Bundesministerium der Justiz (gesetze-im-internet.de)', 'https://www.gesetze-im-internet.de/ddg/__14.html',
        'Koordinierungsstelle für digitale Dienste in der Bundesnetzagentur'),
    ],
  },

  // ── zivilgesellschaft ────────────────────────────────────────────────────
  'stiftungsregister-bund-neueintragungen': {
    // „Seit 2026 verpflichtend“ war falsch: Art. 33 des Gesetzes vom 8.12.2025
    // verschiebt den Start auf den 1.1.2028. Der Eintrag bleibt als modellierter
    // künftiger Datentyp stehen und sagt das jetzt selbst.
    name: 'Neueintragungen Stiftungsregister Bund (ab 2028)',
    description: 'Das Zentrale Stiftungsregister des Bundes wird beim Bundesamt für Justiz geführt und nimmt nach Verschiebung erst am 1. Januar 2028 den Betrieb auf; vorgesehen war ursprünglich der 1. Januar 2026. Eine Statistik der Neueintragungen gibt es deshalb noch nicht. Modelliert ist hier ihre Auswertung nach Stiftungsform, Satzungszweck und Sitzland, sobald das Register geführt wird.',
    explanation: 'Eingetragen werden Stiftungen als Rechtspersonen, keine Privatpersonen; ausgewiesen würden Zählungen je Stiftungsform, Zweck und Land. Vorstandsmitglieder als natürliche Personen gehören nicht in die Statistik.',
    temporal: { available_from: 2028 },                               // war 2016
    sources: [
      src('Stiftungsregistergesetz (StiftRG)', 'Bundesministerium der Justiz (gesetze-im-internet.de)', 'https://www.gesetze-im-internet.de/stiftrg/BJNR295300021.html',
        'Inkrafttreten am 1.1.2028 (Art. 33 G v. 8.12.2025)'),
      src('Gesetzentwurf, BT-Drs. 21/1852', 'Deutscher Bundestag', 'https://dserver.bundestag.de/btd/21/018/2101852.pdf',
        'Register beim Bundesamt für Justiz; Start statt 1.1.2026 erst am 1.1.2028'),
    ],
  },

  // ── bildung ──────────────────────────────────────────────────────────────
  'schulabschlussquoten-schulform-bundesland': {
    // Ausgewiesen werden Anzahlen, keine Quoten — der Name sagte das Gegenteil.
    name: 'Absolventen und Abgänger nach Abschluss, Schulart und Bundesland',
    description: 'Absolventen und Abgänger allgemeinbildender Schulen nach Bundesland, Schulart, Schulabschluss und Geschlecht aus der jährlichen Schulstatistik des Statistischen Bundesamts (GENESIS-Online). Ausgewiesen werden Anzahlen, keine Abschlussquoten; die Ergebnisse erscheinen außerdem im Statistischen Bericht „Allgemeinbildende Schulen“, der die frühere Fachserie 11 Reihe 1 abgelöst hat.',
    explanation: 'Gezählt werden Absolventen und Abgänger je Land, Schulart, Abschluss und Geschlecht, nicht einzelne Schülerinnen und Schüler. Auf Landesebene sind die Zellen so groß, dass kein Wert auf Einzelne verweist.',
    format: fmt('FT_08'),                                             // war CSV, XML
    sources: [
      src('Schulen', 'Statistisches Bundesamt (Destatis)', 'https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bildung-Forschung-Kultur/Schulen/_inhalt.html',
        'Absolventen und Abgänger nach Bundesland, Schulart und Schulabschluss'),
      src('Publikationen Allgemeinbildende Schulen', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bildung-Forschung-Kultur/Schulen/Publikationen/_publikationen-innen-schulen-allgemeinbildende.html',
        'Statistischer Bericht als XLSX statt Fachserie'),
      src('Impressum (Copyright GENESIS-Online)', 'Statistisches Bundesamt (Destatis)', DESTATIS_IMPRESSUM, 'Datenlizenz Deutschland 2.0'),
    ],
  },

  // ── religion ─────────────────────────────────────────────────────────────
  'kath-bs-krankenhaus-statistik': {
    // „rund 370“ war falsch, und die amtliche Statistik kennt keine
    // konfessionellen Träger. Die Beschreibung nennt nur noch Belegtes.
    name: 'Katholische Krankenhäuser – Zahl und Trägerstruktur',
    description: 'Zahl und Trägerstruktur katholischer Krankenhäuser in Deutschland. Der Katholische Krankenhausverband Deutschlands (kkvd) vertritt nach eigener Angabe 261 katholische Krankenhäuser. Die amtliche Krankenhausstatistik unterscheidet öffentliche, freigemeinnützige und private Träger und weist konfessionelle Häuser nicht gesondert aus.',
    explanation: 'Zahl, Trägerschaft und Größe katholischer Krankenhäuser sind Einrichtungsdaten ohne Personenbezug; sie beschreiben die Versorgungsstruktur der Kirche als Trägerin, nicht Patientinnen und Patienten.',
    sources: [
      src('Verband mit neuer Führungsspitze (Pressemitteilung)', 'Katholischer Krankenhausverband Deutschlands',
        'https://die-katholischen-krankenhaeuser.de/pm/verband-mit-neuer-fuehrungsspitze/', '261 katholische Krankenhäuser'),
      src('Grunddaten der Krankenhäuser', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/GPStatistik/servlets/MCRFileNodeServlet/DEHeft_derivate_00017429/2120611147004_ergaenzt03112015.pdf',
        'Trägerarten öffentlich, freigemeinnützig, privat'),
    ],
  },

  // ── kultur ───────────────────────────────────────────────────────────────
  'bund-kulturfoerderung': {
    description: 'Öffentliche Ausgaben von Bund, Ländern und Gemeinden für Kultur, gegliedert nach Ländern, Körperschaftsgruppen und acht Kulturbereichen, darunter Theater und Musik, Bibliotheken und Archive, Museen, Sammlungen und Ausstellungen sowie Sonstige Kulturpflege. Grundlage sind die Finanzstatistiken von Bund, Ländern und Gemeinden. Veröffentlicht im zweijährlich erscheinenden Kulturfinanzbericht der Statistischen Ämter des Bundes und der Länder mit Tabellenband.',
    explanation: 'Kulturausgaben sind Haushaltsdaten der öffentlichen Hand, gegliedert nach Körperschaft und Kulturbereich. Sie betreffen Einrichtungen und Förderprogramme, keine Personen; einzelne Zuwendungsempfänger erscheinen darin nicht.',
    license: 'LI_05',                                                 // „mit Quellenangabe gestattet“
    format: fmt('FT_07', 'FT_08'),                                    // war CSV, XLSX, PDF
    temporal: { available_from: 2001, update_frequency: 'FQ_09' },  // war 2005, jährlich
    sources: [
      src('Kulturfinanzbericht 2024', 'Statistische Ämter des Bundes und der Länder',
        'https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bildung-Forschung-Kultur/Kultur/Publikationen/Downloads-Kultur/kulturfinanzbericht-1023002249004.pdf?__blob=publicationFile&v=2',
        'Kulturausgaben nach Körperschaft und acht Kulturbereichen; Finanzstatistiken als Grundlage; zweijährlich'),
      src('Kulturfinanzbericht (Publikationsseite)', 'Statistisches Bundesamt (Destatis)',
        'https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bildung-Forschung-Kultur/Kultur/Publikationen/_publikationen-innen-kulturfinanzbericht.html',
        'PDF und XLSX-Tabellenband'),
      src('Kulturfinanzbericht 2000', 'Statistische Bibliothek', 'https://www.statistischebibliothek.de/mir/receive/DEHeft_mods_00010345', 'erste Ausgabe 2001'),
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
