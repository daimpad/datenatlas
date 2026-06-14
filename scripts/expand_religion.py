#!/usr/bin/env python3
import json, copy

PATH = '/home/user/datenatlas/public/data/sector_religion.json'
C = "#0d5c57"

def d4(id, name, desc, op_cls, op_lbl, op_expl, th, ob, gr, fmts, li, rel, procs):
    return {
        "id": id, "level": 4, "name": name, "color": C,
        "details": {
            "description": desc,
            "openness": {"class": op_cls, "label": op_lbl, "explanation": op_expl},
            "theme": {"code": th}, "object": {"code": ob}, "granularity": {"code": gr},
            "format": [{"code": f[0], "label": f[1]} for f in fmts],
            "license": {"code": li}, "relevance": rel,
            "processes": [{"method": p[0], "description": p[1]} for p in procs],
        }
    }

ADDITIONS = {
    # evangelische-kirche: +3 ev-mitgliedschaft, +3 ev-finanzen, +3 ev-bildung-medien
    "ev-mitgliedschaft": [
        d4("ev-taufen-konfirmationen","Taufen und Konfirmationen","Jährliche Statistik zu Taufen, Konfirmationen und Trauungen in evangelischen Gemeinden nach Landeskirche.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Zahlen ohne Personenbezug veröffentlichbar.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Datenaggregation","Zusammenführung aus Kirchenbüchern der Gemeinden"),("Qualitätsprüfung","Plausibilitätsprüfung gegen Vorjahreswerte"),("Jahresveröffentlichung","Publikation im Statistischen Jahrbuch der EKD"),("Trendanalyse","Langzeitauswertung seit 1950"),("Regionalvergleich","Vergleich nach Landeskirchen und Propsteibezirken")]),
        d4("ev-altersstruktur-mitglieder","Altersstruktur evangelischer Mitglieder","Mitgliederverteilung nach Alter und Geschlecht differenziert nach Landeskirche und Gemeindegröße.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Altersgruppen ohne Einzelpersonenbezug.","TH_03","OB_01","GR_02",[("FT_01","CSV"),("FT_02","JSON")],"LI_02",3,
           [("Altersgruppenbildung","Zusammenfassung in 10-Jahres-Kohorten"),("Hochrechnung","Fortschreibung auf Basis von Sterbestatistiken"),("Visualisierung","Bevölkerungspyramide je Landeskirche"),("Prognose","Mitgliederentwicklung bis 2040"),("Vergleichsanalyse","Vergleich mit Gesamtbevölkerung")]),
        d4("ev-kirchenaustritte-eintritte","Kirchenaus- und -eintritte","Monatliche Zu- und Abgangszahlen aus den Kirchenregistern der Landeskirchen.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Monatswerte ohne Personendaten.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Kirchenregisterauswertung","Automatisierte Abfrage aus lokalen Meldesystemen"),("Monatliche Aggregation","Zusammenfassung auf Gemeindeebene"),("Jahresreport","Konsolidierung für EKD-Statistik"),("Medienmitteilung","Kommunikation der Jahreszahlen"),("Wissenschaftskooperation","Weitergabe an Religionssoziologie")]),
    ],
    "ev-finanzen": [
        d4("ev-kirchensteuereinnahmen-regional","Kirchensteuereinnahmen regional","Kirchensteueraufkommen nach Bundesland und Landeskirche, Zeitreihe 2000–2023.",
           "OP_01","Sofort publizierbar","Aggregierte Finanzstatistik ohne Personenbezug.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Finanzbuchhaltung","Erfassung aus Landeskirchen-Buchungssystemen"),("Jahresabschluss","Konsolidierung nach HGB-Kirchenrecht"),("Benchmarking","Vergleich pro Mitglied je Landeskirche"),("Trendanalyse","10-Jahres-Entwicklung"),("Veröffentlichung","Publikation im EKD-Finanzbericht")]),
        d4("ev-diakonie-ausgaben","Diakonieausgaben nach Handlungsfeld","Mittelverwendung evangelischer Wohlfahrtseinrichtungen nach Aufgabenfeld (Pflege, Jugend, Sucht).",
           "OP_01","Sofort publizierbar","Aggregierte Ausgabenstatistik.","TH_03","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Projektabrechnung","Erfassung der Einzelprojektkosten"),("Konsolidierung","Zusammenführung auf Landesverbandsebene"),("Bundesstatistik","Aggregation zum Diakonischen Werk EKD"),("Verwendungsnachweis","Prüfung gegenüber öffentlichen Zuschüssen"),("Jahresbericht","Publikation des Diakonieberichts")]),
        d4("ev-immobilienwert-kirchenbesitz","Immobilienwert Kirchenbesitz","Schätzung und Buchwert kirchlicher Liegenschaften nach Landeskirche und Nutzungsart.",
           "OP_03","Nur Metadaten publizierbar","Detaillierte Lagedaten kirchlicher Immobilien sind schützenswert.","TH_07","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_04",3,
           [("Liegenschaftsverwaltung","Erfassung in Immobilienmanagementsystemen"),("Wertermittlung","Gutachterliche Bewertung nach WertV"),("Nutzungsanalyse","Klassifikation nach Nutzungsart"),("Strategieplanung","Entscheidungsgrundlage für Gebäudekonzepte"),("Datenschutzprüfung","Abwägung Transparenz vs. Sicherheit")]),
    ],
    "ev-bildung-medien": [
        d4("ev-konfirmandenunterricht-teilnahme","Konfirmandenunterricht Teilnahmequote","Teilnahmequoten am Konfirmandenunterricht nach Landeskirche und Alterskohorte.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Quoten ohne Personenbezug.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindebefragung","Erhebung bei allen Kirchengemeinden"),("Quoten-Berechnung","Anteil an der Altersgruppe der 14-Jährigen"),("Trendanalyse","Entwicklung 2000–2023"),("Vergleich","Ost-West-Unterschiede"),("Jahresbericht","Veröffentlichung in EKD-Statistik")]),
        d4("ev-rundfunkbeauftragte-programme","Rundfunkbeauftragte: Sendungsstatistik","Umfang und Reichweite evangelischer Verkündungssendungen in ARD und ZDF.",
           "OP_01","Sofort publizierbar","Sendungsstatistiken sind ohne Personenbezug.","TH_06","OB_06","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Programmerfassung","Logging aller evangelischen Sendeplätze"),("Reichweitenmessung","GfK-Zuschauerzahlen je Sendung"),("Jahresauswertung","Aggregation durch Rundfunkbeauftragten"),("Vergleich","Gegenüberstellung mit kath. Rundfunkarbeit"),("Jahresbericht","Publikation beim Gemeinschaftswerk EKD")]),
        d4("ev-jugendarbeit-teilnehmer","Evangelische Jugendarbeit Teilnehmerzahlen","Teilnehmende an evangelischer Kinder- und Jugendarbeit nach Landeskirche und Angebotskategorie.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Freizeiterfassung","Anmeldedaten aus Freizeitdatenbanken"),("Jahreserhebung","Befragung der Landesjugendwerke"),("Konsolidierung","Zusammenführung zur EKD-Jugendstatistik"),("Trendbericht","Vergleich mit Vorjahren"),("Öffentlichkeitsarbeit","Kommunikation der Reichweite")]),
    ],

    # katholische-kirche: +3 kath-mitgliedschaft, +3 kath-finanzen, +3 kath-bildung-soziales
    "kath-mitgliedschaft": [
        d4("kath-erstkommunion-firmung","Erstkommunion und Firmung","Jährliche Zahlen zu Erstkommunionen und Firmungen nach Bistum.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Zahlen.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Pfarrgemeindeerhebung","Meldung durch Pfarrämter"),("Bistumsbericht","Konsolidierung je Bistum"),("DBK-Statistik","Zusammenführung durch Deutsche Bischofskonferenz"),("Langzeittrend","Vergleich 1970–2023"),("Pressemitteilung","Kommunikation der Jahresergebnisse")]),
        d4("kath-kirchenaustritte-regionen","Kirchenaustritte nach Region","Monatliche Austrittszahlen nach Bistum und Dekanat.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte regionale Zahlen.","TH_03","OB_01","GR_03",[("FT_01","CSV")],"LI_02",5,
           [("Registererfassung","Meldungen aus staatlichen Austrittsregistern"),("Bistumszuordnung","Zuordnung nach Wohnsitz"),("Monatsaggregation","Monatliche Konsolidierung"),("Trendanalyse","Vergleich mit Vorjahren und Ereignissen"),("Wissenschaftskooperation","Weitergabe an Religionsforschung")]),
        d4("kath-seelsorgebezirke-geodaten","Seelsorgebezirke Geodaten","Geometrien der Pfarreigrenzen und Seelsorgebezirke nach Bistum.",
           "OP_01","Sofort publizierbar","Geodaten ohne Personenbezug.","TH_05","OB_05","GR_03",[("FT_05","GeoJSON"),("FT_06","Shapefile")],"LI_02",3,
           [("Digitalisierung","Erfassung aus historischen Grenzkarten"),("Georeferenzierung","Einpassung in ETRS89-Koordinatensystem"),("Validierung","Plausibilitätsprüfung durch Bistümer"),("Webpublikation","Bereitstellung als WMS/WFS"),("Aktualisierung","Nachführung bei Pfarreireformen")]),
    ],
    "kath-finanzen": [
        d4("kath-kirchensteuer-bistum","Kirchensteuereinnahmen nach Bistum","Kirchensteueraufkommen der 27 deutschen Bistümer, Zeitreihe 2000–2023.",
           "OP_01","Sofort publizierbar","Aggregierte Finanzdaten ohne Personenbezug.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Finanzbuchhaltung","Erfassung aus Bistumsbuchführung"),("Jahresabschluss","Testat durch Wirtschaftsprüfer"),("DBK-Konsolidierung","Zusammenführung durch Bischofskonferenz"),("Veröffentlichung","Jahrespressemitteilung"),("Benchmarking","Pro-Kopf-Vergleich nach Bistum")]),
        d4("kath-caritas-mitteleinsatz","Caritas Mitteleinsatz nach Handlungsfeld","Verwendung der Caritasmittel nach sozialen Handlungsfeldern bundesweit.",
           "OP_01","Sofort publizierbar","Aggregierte Ausgabenstatistik.","TH_03","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Projektabrechnung","Erfassung nach KHSG und Zuwendungsrecht"),("Jahresabschluss","Testat durch Wirtschaftsprüfer"),("Verbandsbericht","Konsolidierung durch DCV"),("Verwendungsnachweis","Prüfung öffentlicher Zuschüsse"),("Jahresbericht","Publikation Caritasbericht")]),
        d4("kath-vermoegen-offenlegung","Vermögensbericht Bistümer","Jahresabschlüsse und Vermögensübersichten der deutschen Bistümer nach Transparenzinitiative.",
           "OP_01","Sofort publizierbar","Freiwillige Offenlegung der Bistümer.","TH_07","OB_03","GR_02",[("FT_04","XML"),("FT_02","JSON")],"LI_02",5,
           [("Rechnungslegung","HGB-konforme Buchführung"),("Wirtschaftsprüfung","Externe Abschlussprüfung"),("Publikation","Veröffentlichung auf Bistumswebsite"),("DBK-Bericht","Zusammenführung durch Bischofskonferenz"),("Wissenschaftsnutzung","Weitergabe an Religionsökonomie")]),
    ],
    "kath-bildung-soziales": [
        d4("kath-schulen-schuelerzahlen","Katholische Schulen Schülerzahlen","Schüler- und Klassenzahlen an katholischen Schulen in freier Trägerschaft nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Schulstatistik ohne Einzelpersonenbezug.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Schulstatistik","Erhebung durch KMK-Meldewesen"),("Bistumsbericht","Zusammenführung durch Schulreferate"),("Bundesstatistik","Aggregation durch DBK"),("Vergleichsanalyse","Anteil an Gesamtschülerschaft"),("Jahresbericht","Publikation Bildungsbericht")]),
        d4("kath-kitas-betreuungsquote","Katholische Kitas Betreuungsquote","Platzzahlen und Betreuungsquoten in katholischen Kindertageseinrichtungen nach Bistum.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Einrichtungsdaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Einrichtungserhebung","Jährliche Meldung durch Träger"),("Kapazitätserfassung","Genehmigte Plätze vs. Belegung"),("Bistumszusammenführung","Aggregation je Bistum"),("Bundesvergleich","Vergleich mit Gesamtbetreuungsquote"),("Bericht","Jahrespublikation")]),
        d4("kath-familienberatung-fallzahlen","Ehe- und Familienberatung Fallzahlen","Beratungsfälle der kirchlichen Ehe-, Familien- und Lebensberatungsstellen.",
           "OP_03","Nur Metadaten publizierbar","Einzelfallbezogene Beratungsstatistik ist schützenswert.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_04",4,
           [("Falldokumentation","Pseudonymisierte Erfassung in Beratungssoftware"),("Jahresstatistik","Aggregation auf Stellenebene"),("Bundesauswertung","Konsolidierung durch DBJR/KDB"),("Anonymisierung","Löschung aller Identifikatoren"),("Jahresbericht","Aggregierte Veröffentlichung")]),
    ],

    # juedische-gemeinden: +3 juedisch-mitgliedschaft, +3 juedisch-erinnerungskultur, +3 juedisch-finanzen
    "juedisch-mitgliedschaft": [
        d4("juedisch-zuwanderung-kontingent","Jüdische Kontingentflüchtlinge","Zuzugszahlen jüdischer Zuwanderer im Rahmen des Kontingentflüchtlingsprogramms nach Jahr und Herkunftsland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Zahlen ohne Personenbezug.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Behördenmeldung","Erfassung durch BAMF und Einwandererbehörden"),("Gemeindeerhebung","Meldung durch Zentralrat"),("Trendanalyse","Entwicklung seit 1990"),("Integrationsmonitoring","Verbleib in Gemeinden"),("Jahresbericht","Zentralratspublikation")]),
        d4("juedisch-gemeindewachstum-regionen","Gemeindewachstum nach Regionen","Mitgliederentwicklung jüdischer Gemeinden nach Bundesland, Zeitreihe 1990–2023.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Gemeindestatistik.","TH_03","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Jahreserhebung","Abfrage bei Landesverbänden"),("Plausibilitätsprüfung","Abgleich mit Vorjahreswerten"),("Zentralratsstatistik","Konsolidierung durch ZdJ"),("Wissenschaftsnutzung","Weitergabe an Religionssoziologie"),("Jahresbericht","Publikation Zentralrat")]),
        d4("juedisch-rabbiner-religionspersonal","Rabbiner und Religionspersonal","Anzahl und Qualifikation rabbinischen und religiösen Personals in deutschen Gemeinden.",
           "OP_03","Nur Metadaten publizierbar","Personenbezogene Daten von Amtsträgern.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Gemeindemeldung","Erfassung durch Landesverbände"),("Qualifikationscheck","Prüfung der Ordination/Ausbildung"),("Zentralratsregister","Zusammenführung beim ZdJ"),("Anonymisierung","Für externe Weitergabe"),("Jahresbericht","Aggregierter Bericht")]),
    ],
    "juedisch-erinnerungskultur": [
        d4("juedisch-gedenkstaetten-besuche","Gedenkstättenbesuche","Besucherzahlen jüdischer Gedenkstätten und Museen in Deutschland nach Jahr und Einrichtungstyp.",
           "OP_01","Sofort publizierbar","Besucherstatistik ohne Personenbezug.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Kassenerfassung","Ticketverkaufsstatistik"),("Schulgruppenerfassung","Anmeldedaten Schulgruppen"),("Jahresauswertung","Aggregation je Einrichtung"),("Bundesvergleich","Vergleich über Gedenkstätten"),("Jahresbericht","Publikation der Bundeskonferenz")]),
        d4("juedisch-antisemitismus-meldungen","Antisemitismusmeldungen","Erfasste antisemitische Vorfälle nach Kategorie und Bundesland (RIAS-Daten).",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vorfallsstatistik.","TH_08","OB_02","GR_03",[("FT_01","CSV")],"LI_02",5,
           [("Meldestelle","Erfassung durch RIAS-Meldestellen"),("Kategorisierung","Einordnung nach IHRA-Definition"),("Bundesauswertung","Jahresreport RIAS"),("Behördenkooperation","Weitergabe an Ermittlungsbehörden"),("Politikberatung","Grundlage für Handlungsempfehlungen")]),
        d4("juedisch-synagogenstandorte","Synagogen und Gemeindezentren Geodaten","Standorte aktiver Synagogen und jüdischer Gemeindezentren in Deutschland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standortinformationen.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Verzeichniserfassung","Erfassung durch ZdJ"),("Georeferenzierung","Koordinatenerfassung"),("Verifikation","Prüfung durch Landesverbände"),("Webpublikation","Bereitstellung auf ZdJ-Website"),("Aktualisierung","Jährliche Nachführung")]),
    ],
    "juedisch-finanzen": [
        d4("juedisch-gemeindehaushalt","Jüdische Gemeindehaushalte","Einnahmen und Ausgaben jüdischer Gemeinden nach Einnahmequellen (Staatsleistungen, Beiträge, Zuschüsse).",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Finanzdaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Haushaltsbuchhaltung","Jahresabschluss je Gemeinde"),("Landesverbandskonsolidierung","Aggregation auf Landesebene"),("Zentralratsstatistik","Bundesweite Zusammenführung"),("Wirtschaftsprüfung","Externe Prüfung"),("Jahresbericht","Finanzbericht ZdJ")]),
        d4("juedisch-staatsleistungen-laender","Staatsleistungen nach Bundesland","Staatliche Zuwendungen an jüdische Gemeinden nach Bundesland und Rechtsgrundlage.",
           "OP_01","Sofort publizierbar","Öffentliche Haushaltsmittel sind transparenzpflichtig.","TH_07","OB_03","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Haushaltsauswertung","Erfassung aus Landeshaushalten"),("Rechtsgrundlagenanalyse","Vertragsgrundlage je Bundesland"),("Bundesvergleich","Pro-Kopf-Vergleich"),("Transparenzbericht","Publikation auf Anfrage"),("Wissenschaftsnutzung","Rechtswissenschaftliche Analyse")]),
        d4("juedisch-soziale-einrichtungen-budget","Jüdische Sozialeinrichtungen Budget","Budgets und Kapazitäten jüdischer Altenheime, Kindergärten und Sozialzentren.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Einrichtungsdaten.","TH_03","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Einrichtungserhebung","Jährliche Meldung durch Träger"),("Aggregation","Zusammenführung durch Zentralwohlfahrtsstelle"),("Bundesbericht","Jahresbericht ZWST"),("Benchmarking","Vergleich mit konfessionellen Trägern"),("Fördernachweis","Verwendung für Zuschussanträge")]),
    ],

    # muslimische-gemeinschaften: +3 muslimisch-gemeinden, +3 muslimisch-integration, +3 muslimisch-finanzen (actually only +9 total, distribute as 3+3+3)
    "muslimisch-gemeinden": [
        d4("muslimisch-moscheegemeinden-anzahl","Moscheegemeinden Bestandserhebung","Anzahl und Verbreitung islamischer Moscheegemeinden in Deutschland nach Bundesland und Verband.",
           "OP_01","Sofort publizierbar","Aggregierte Gemeindestatistik ohne Personenbezug.","TH_03","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Verbandserhebung","Meldung durch DITIB, ZMD, VIKZ u.a."),("Plausibilitätsprüfung","Abgleich mit kommunalen Daten"),("Bundesauswertung","Konsolidierung durch Islamkonferenz"),("Wissenschaftsnutzung","Weitergabe an Religionssoziologie"),("Jahresbericht","Publikation DIK")]),
        d4("muslimisch-imame-ausbildung","Imamausbildung in Deutschland","Teilnehmerzahlen und Institutionen der Imamausbildung in Deutschland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Ausbildungsdaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Institutionserhebung","Erfassung durch Bildungsträger"),("Akkreditierungscheck","Prüfung durch Kultusministerien"),("Bundesauswertung","Zusammenführung DIK"),("Qualitätsbericht","Evaluation der Programme"),("Jahresbericht","Publikation")]),
        d4("muslimisch-gebetsraeume-geodaten","Gebetsräume Geodaten","Standorte islamischer Gebetsräume und Moscheen in Deutschland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Felderhebung","Erhebung durch Stadtplanungsämter"),("Verbandserfassung","Ergänzung durch islamische Verbände"),("Georeferenzierung","GPS-Koordinatenerfassung"),("Webpublikation","Bereitstellung als offene Karte"),("Aktualisierung","Jährliche Nachführung")]),
    ],
    "muslimisch-integration": [
        d4("muslimisch-sprachkurse-teilnahme","Islamische Träger: Sprachkurs-Teilnahme","Teilnehmerzahlen an Integrationskursen in Trägerschaft islamischer Verbände.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("BAMF-Abrechnung","Abrechnungsdaten aus Integrationskurssystem"),("Trägerbericht","Statistik je Trägerorganisation"),("Bundesauswertung","BAMF-Jahresstatistik"),("Qualitätsprüfung","Kursabschlusstests"),("Erfolgsmonitoring","Sprachniveauerhebung")]),
        d4("muslimisch-beratungsstellen-nachfrage","Muslimische Beratungsstellen Nachfrage","Anfragen und Beratungsfälle bei islamischen Beratungsstellen (Familie, Soziales, Recht).",
           "OP_03","Nur Metadaten publizierbar","Beratungsinhalte unterliegen dem Datenschutz.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_04",4,
           [("Falldokumentation","Pseudonymisierte Fallerfassung"),("Jahresstatistik","Aggregation je Beratungsstelle"),("Bundesauswertung","Konsolidierung durch Verbände"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresbericht","Aggregierter Bericht")]),
        d4("muslimisch-diskriminierungsmeldungen","Diskriminierungsmeldungen","Erfasste Diskriminierungsvorfälle gegen Muslime nach Kategorie und Region.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vorfallsstatistik.","TH_08","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Meldestelle","Erfassung durch CLAIM-Meldestellen"),("Kategorisierung","Einordnung nach AGG-Kategorien"),("Regionalauswertung","Analyse nach Bundesland"),("Behördenkooperation","Weitergabe relevanter Fälle"),("Jahresbericht","Publikation CLAIM-Report")]),
    ],
    "muslimisch-finanzen": [
        d4("muslimisch-moscheehaushalt","Moscheeverbände Haushalte","Einnahmen und Ausgaben muslimischer Moschee-Verbände nach Einnahmequellen.",
           "OP_03","Nur Metadaten publizierbar","Finanzdetails religiöser Vereinigungen sind schützenswert.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Vereinsbuchhaltung","Jahresabschluss je Verein"),("Prüfung","Interne Rechnungsprüfung"),("Aggregation","Zusammenführung durch Verbände"),("Transparenzinitiative","Freiwillige Offenlegung"),("Jahresbericht","Verbandsgeschäftsbericht")]),
        d4("muslimisch-auslandsfinanzierung","Auslandsfinanzierung islamischer Organisationen","Erfasste Finanzflüsse aus dem Ausland an islamische Organisationen in Deutschland.",
           "OP_03","Nur Metadaten publizierbar","Sicherheitsrelevante Finanzierungsdaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_04",5,
           [("Behördenerfassung","Erfassung durch BfV und Finanzämter"),("Verdachtsmeldeanalyse","Auswertung nach GwG"),("Risikoklassifizierung","Einstufung nach Risikomodell"),("Behördenkooperation","Weitergabe an Strafverfolgung"),("Jahresbericht","Verfassungsschutzbericht")]),
        d4("muslimisch-soziale-projekte-foerderung","Muslimische Sozialprojekte Förderung","Staatliche Fördergelder für Sozialprojekte islamischer Verbände nach Förderprogramm.",
           "OP_01","Sofort publizierbar","Öffentliche Förderdaten sind transparenzpflichtig.","TH_03","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Förderantragsdaten","Erfassung aus Förderverwaltungssystemen"),("Bewilligungsstatistik","Aggregation genehmigter Mittel"),("Bundesauswertung","Jahresstatistik Förderbereich"),("Verwendungsnachweis","Prüfung der Mittelverwendung"),("Transparenzbericht","Publikation Förderdatenbank")]),
    ],

    # freikirchen-sonstige: +3 freikirchen-strukturen, +3 freikirchen-sozial-bildung, +3 interreligioeser-dialog
    "freikirchen-strukturen": [
        d4("freikirchen-mitgliederzahlen","Freikirchen Mitgliederzahlen","Mitgliederstatistik der größten Freikirchen (Baptisten, Methodisten, Pfingstgemeinden) in Deutschland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Gemeindestatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindeerhebung","Jährliche Meldung durch Gemeindeleitung"),("Verbandszusammenführung","Aggregation durch Dachverband"),("Bundesbericht","Veeka-Mitgliederstatistik"),("Trendanalyse","Entwicklung seit 1990"),("Wissenschaftsnutzung","Weitergabe an Religionssoziologie")]),
        d4("freikirchen-gemeindestandorte","Freikirchen Standorte Geodaten","Standorte freikirchlicher Gemeindezentren und Versammlungsräume in Deutschland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Verbandskartierung","Erfassung durch Freikirchen-Verbände"),("Georeferenzierung","Adressgeokodierung"),("Verifikation","Prüfung durch Ortsbeauftragte"),("Webpublikation","Gemeinde-Finder auf Websites"),("Aktualisierung","Quartalsweise Nachführung")]),
        d4("freikirchen-finanzen-ueberblick","Freikirchen Finanzen Überblick","Haushaltsdaten der evangelischen Freikirchen nach Verband und Einnahmequellen.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Verbandsfinanzen.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Vereinsbuchhaltung","Jahresabschluss je Verband"),("Wirtschaftsprüfung","Externe Prüfung"),("Beeka-Statistik","Zusammenführung durch Beeka"),("Jahresbericht","Publikation Beeka"),("Transparenzinitiative","Freiwillige Offenlegung")]),
    ],
    "freikirchen-sozial-bildung": [
        d4("freikirchen-diakonische-einrichtungen","Freikirchliche Diakonische Einrichtungen","Bestandserhebung diakonischer Einrichtungen freikirchlicher Träger (Suchthilfe, Obdachlosenarbeit).",
           "OP_01","Sofort publizierbar","Aggregierte Einrichtungsstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Einrichtungserhebung","Meldung durch Trägerverbände"),("Kapazitätserfassung","Plätze nach Einrichtungstyp"),("Bundesauswertung","Koordination durch BAG"),("Jahresbericht","Sozialbericht"),("Wissenschaftsnutzung","Weitergabe an Wohlfahrtsforschung")]),
        d4("freikirchen-schule-bildung","Freikirchliche Schulen Schülerstatistik","Schülerzahlen an Schulen in Trägerschaft freikirchlicher Gemeinschaften.",
           "OP_02","Nach Aufbereitung publizierbar","Schulstatistik ohne Einzelpersonenbezug.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("KMK-Statistik","Schulstatistik durch Kultusministerien"),("Trägererfassung","Meldung durch Schulträger"),("Bundesauswertung","KMK-Schulverzeichnis"),("Jahresbericht","Bildungsstatistik"),("Vergleichsanalyse","Anteil an Privatschülerschaft")]),
        d4("freikirchen-jugendarbeit","Freikirchliche Jugendarbeit","Teilnehmende und Angebote in freikirchlicher Jugend- und Kinderarbeit.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindeerhebung","Befragung der Jugendbeauftragten"),("Verbandsbericht","Zusammenführung je Verband"),("Jahresstatistik","Publikation Jugendverbände"),("Qualitätsevaluation","Selbstevaluation der Programme"),("Trendanalyse","Entwicklung 2010–2023")]),
    ],
    "interreligioeser-dialog": [
        d4("interreligioes-veranstaltungen","Interreligiöse Veranstaltungen Statistik","Anzahl und Art interreligiöser Veranstaltungen und Begegnungen in Deutschland nach Träger.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Trägermeldung","Erfassung durch teilnehmende Verbände"),("Klassifikation","Einordnung nach Dialogformat"),("Jahresauswertung","Aggregation Koordinierungsrat"),("Veröffentlichung","Jahresbericht Dialog"),("Wissenschaftsnutzung","Forschung zu Dialogeffekten")]),
        d4("interreligioes-bildungsprojekte","Interreligiöse Bildungsprojekte","Laufende und abgeschlossene interreligiöse Bildungsprojekte nach Förderbereich und Bundesland.",
           "OP_01","Sofort publizierbar","Projektdaten ohne Personenbezug.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Projekterfassung","Meldung durch Träger"),("Förderabrechnung","Zuschussabrechnungen"),("Bundesauswertung","Koordinierungsrat Interreligiöser Dialog"),("Evaluation","Wirkungsmessung"),("Jahresbericht","Publikation")]),
        d4("interreligioes-konfliktmonitoring","Interreligiöses Konfliktmonitoring","Erfasste interreligiöse Spannungen und Vorfälle nach Kategorie und Region.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vorfallsstatistik.","TH_08","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Meldestelle","Erfassung durch Beobachtungsstellen"),("Kategorisierung","Klassifikation nach Konflikttyp"),("Regionalauswertung","Analyse nach Bundesland"),("Behördenkooperation","Information der Behörden"),("Jahresbericht","Sicherheitsbericht")]),
    ],

    # orthodoxe-kirchen: +3 each
    "orthodox-gemeinden": [
        d4("orthodox-mitglieder-herkunft","Orthodoxe Mitglieder nach Herkunft","Mitgliederstruktur orthodoxer Gemeinden nach Nationalität und Kirchenpatriarchat.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Mitgliederstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindeerhebung","Meldung durch Gemeindepriester"),("Patriarchatsebene","Aggregation je Kirchengemeinschaft"),("Jahresbericht","Metropolitanstatistik"),("Wissenschaftsnutzung","Migrationsforschung"),("Trendanalyse","Entwicklung seit 1990")]),
        d4("orthodox-kirchengebaeude-geodaten","Orthodoxe Kirchengebäude Geodaten","Standorte orthodoxer Kirchen und Kapellen in Deutschland nach Patriarchat.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Gemeindeerfassung","Meldung durch Gemeinden"),("Georeferenzierung","Adressgeokodierung"),("Verifikation","Prüfung durch Metropoliten"),("Webpublikation","Kirchenfinder-Karte"),("Aktualisierung","Jährliche Nachführung")]),
        d4("orthodox-gottesdiensttermine","Orthodoxe Gottesdienststatistik","Gottesdienstangebote und Besucherzahlen in orthodoxen Gemeinden nach Liturgietradition.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Besucherstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindemeldung","Erfassung durch Gemeindepriester"),("Aggregation","Zusammenführung auf Metropolitenebene"),("Jahresstatistik","Jahresbericht"),("Vergleich","Vergleich nach Patriarchat"),("Wissenschaftsnutzung","Liturgieforschung")]),
    ],
    "orthodox-finanzen": [
        d4("orthodox-gemeindehaushalte","Orthodoxe Gemeindehaushalte","Einnahmen und Ausgaben orthodoxer Gemeinden nach Einnahmequellen.",
           "OP_03","Nur Metadaten publizierbar","Finanzdetails religiöser Gemeinden.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Vereinsbuchhaltung","Jahresabschluss je Gemeinde"),("Prüfung","Interne Rechnungsprüfung"),("Metropolitenebene","Aggregation auf Diözesanebene"),("Jahresbericht","Geschäftsbericht Metropolie"),("Transparenz","Freiwillige Offenlegung")]),
        d4("orthodox-staatsleistungen","Staatsleistungen an orthodoxe Gemeinden","Staatliche Zuwendungen an orthodoxe Kirchengemeinschaften nach Bundesland.",
           "OP_01","Sofort publizierbar","Öffentliche Haushaltsmittel.","TH_07","OB_03","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Haushaltsauswertung","Erfassung aus Landeshaushalten"),("Rechtsgrundlagenanalyse","Vertragsgrundlage je Bundesland"),("Bundesvergleich","Vergleich nach Kirchengemeinschaft"),("Transparenz","Parlamentarische Anfragen"),("Wissenschaftsnutzung","Kirchenrechtliche Analyse")]),
        d4("orthodox-kirchenbeitraege","Kirchenbeiträge orthodoxer Gemeinden","Freiwillige Beiträge und Spendenaufkommen orthodoxer Gemeindemitglieder.",
           "OP_03","Nur Metadaten publizierbar","Personenbezogene Finanzdaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Gemeindekasse","Erfassung im Gemeindekassenbuch"),("Aggregation","Jahresabschluss je Gemeinde"),("Metropolitenebene","Zusammenführung zur Jahresstatistik"),("Datenschutz","Schutz der Spenderdaten"),("Jahresbericht","Finanzbericht")]),
    ],
    "orthodox-bildung-kultur": [
        d4("orthodox-religionsunterricht","Orthodoxer Religionsunterricht","Schülerzahlen im orthodoxen Religionsunterricht nach Bundesland und Klassenstufe.",
           "OP_02","Nach Aufbereitung publizierbar","Schulstatistik ohne Einzelpersonenbezug.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("KMK-Schulstatistik","Erfassung durch Kultusministerien"),("Kirchenmeldung","Ergänzung durch Metropoliten"),("Bundesauswertung","Zusammenführung KMK"),("Jahresbericht","Bildungsstatistik"),("Vergleich","Vergleich mit anderen Konfessionen")]),
        d4("orthodox-kulturgut-register","Orthodoxes Kulturgut Register","Erfassung liturgischer Kunstgegenstände und Kulturgüter orthodoxer Gemeinden.",
           "OP_03","Nur Metadaten publizierbar","Sicherheitsrelevante Standortdaten.","TH_03","OB_02","GR_02",[("FT_04","XML")],"LI_04",3,
           [("Inventarisierung","Erfassung durch Gemeinden"),("Kunsthistorische Prüfung","Bewertung durch Experten"),("Digitalisierung","Fotodokumentation"),("Datenschutz","Keine Standortveröffentlichung"),("Versicherung","Für Versicherungszwecke")]),
        d4("orthodox-kulturfeste-besuche","Orthodoxe Kulturfeste Besucherzahlen","Besucherzahlen orthodoxer Kulturfeste und kirchlicher Veranstaltungen in Deutschland.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_03","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Veranstaltungserfassung","Erfassung durch Gemeinden"),("Bundesauswertung","Metropolitenstatistik"),("Jahresbericht","Kulturprogrammbericht"),("Pressearbeit","Kommunikation der Reichweite"),("Wissenschaftsnutzung","Diasporaforschung")]),
    ],

    # alevitische-gemeinde: +3 each
    "alevitisch-gemeinden-mitglieder": [
        d4("alevitisch-cemhaeuser-standorte","Cemhäuser Standorte","Standorte alevitischer Cemhäuser (Kulturzentren) in Deutschland nach Bundesland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("AABF-Erfassung","Meldung durch Mitgliedsvereine"),("Georeferenzierung","Adressgeokodierung"),("Webpublikation","Cemfinder-Karte"),("Aktualisierung","Jährliche Nachführung"),("Verifikation","Prüfung durch Ortsvereine")]),
        d4("alevitisch-mitglieder-alter","Alevitische Mitglieder Altersstruktur","Altersstruktur alevitischer Gemeindemitglieder nach Bundesverband.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Altersstatistik.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindeerhebung","Meldung durch Ortsvereine"),("Aggregation","Zusammenführung durch AABF"),("Jahresstatistik","Jahresbericht AABF"),("Trendanalyse","Entwicklung der Altersstruktur"),("Wissenschaftsnutzung","Migrationsforschung")]),
        d4("alevitisch-vereinsgruendungen","Alevitische Vereine Gründungsstatistik","Neugründungen und Auflösungen alevitischer Vereine nach Jahr und Bundesland.",
           "OP_01","Sofort publizierbar","Öffentliche Vereinsregisterinformation.","TH_03","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Vereinsregisterauswertung","Abfrage aus Vereinsregistern"),("AABF-Abgleich","Vergleich mit Verbandsmeldungen"),("Jahresauswertung","Statistik je Bundesland"),("Trendanalyse","Gründungsdynamik"),("Jahresbericht","AABF-Bericht")]),
    ],
    "alevitisch-bildung": [
        d4("alevitisch-religionsunterricht-schule","Alevitischer Religionsunterricht","Schülerzahlen im alevitischen Religionsunterricht nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Schulstatistik ohne Einzelpersonenbezug.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("KMK-Erfassung","Schulstatistik durch Kultusministerien"),("AABF-Abgleich","Ergänzung durch Bundesverband"),("Bundesauswertung","Jahresstatistik KMK"),("Jahresbericht","Bildungsbericht AABF"),("Vergleich","Vergleich mit anderen Religionen")]),
        d4("alevitisch-musahip-dedeleri-ausbildung","Dedeleri-Ausbildung","Programme zur Ausbildung alevitischer Geistlicher (Dedeler) in Deutschland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Ausbildungsdaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Programmerfassung","Erfassung durch AABF-Bildungsreferat"),("Teilnahmestatistik","Anmeldedaten und Abschlüsse"),("Qualitätsevaluation","Evaluation durch Prüfungsausschuss"),("Jahresbericht","Bildungsbericht"),("Wissenschaftsnutzung","Religionspädagogische Forschung")]),
        d4("alevitisch-jugendlager-aktivitaeten","Alevitische Jugendarbeit","Teilnehmerzahlen an Jugendlagern und Aktivitäten der alevitischen Jugendbewegung.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Anmeldedaten","Erfassung bei Veranstaltungsanmeldung"),("Jahresauswertung","Aggregation durch AABF-Jugend"),("Jahresbericht","Jugendbericht AABF"),("Trendanalyse","Entwicklung seit 2000"),("Qualitätsevaluation","Evaluierung der Programme")]),
    ],
    "alevitisch-kultur-identitaet": [
        d4("alevitisch-ashik-saz-register","Aşık- und Saz-Künstler Register","Erfassung und Förderung alevitischer Musiktraditionen und Künstler in Deutschland.",
           "OP_01","Sofort publizierbar","Kulturregister ohne schützenswerte Daten.","TH_03","OB_02","GR_02",[("FT_02","JSON")],"LI_02",3,
           [("Kulturregister","Erfassung durch AABF-Kulturreferat"),("Dokumentation","Aufnahme von Darbietungen"),("Digitalisierung","Archivierung digitaler Mitschnitte"),("Webpublikation","Online-Datenbank"),("Kulturförderung","Grundlage für Förderanträge")]),
        d4("alevitisch-muharrem-gedenkfeiern","Muharrem-Gedenkfeiern","Statistische Erfassung der Muharrem-Fastenzeit und Gedenkfeiern (Aşure) nach Region.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_03","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Gemeindebefragung","Meldung durch Cemhäuser"),("AABF-Aggregation","Zusammenführung auf Bundesebene"),("Jahresbericht","AABF-Kulturbericht"),("Pressearbeit","Öffentlichkeitsarbeit"),("Wissenschaftsnutzung","Religionswissenschaft")]),
        d4("alevitisch-diskriminierungserfahrungen","Diskriminierungserfahrungen Aleviten","Erfasste Diskriminierungsvorfälle gegen Aleviten nach Kategorie und Region.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vorfallsstatistik.","TH_08","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Meldestelle","Erfassung durch AABF-Beratungsstelle"),("Kategorisierung","Klassifikation nach AGG"),("Jahresauswertung","Aggregation je Bundesland"),("Behördenkooperation","Weitergabe relevanter Fälle"),("Jahresbericht","Diskriminierungsbericht AABF")]),
    ],

    # kirchliche-hilfswerke: +3 each
    "hilfswerke-projekte": [
        d4("hilfswerke-projekt-laender","Hilfswerke Projektländer","Anzahl und Volumen laufender Entwicklungsprojekte kirchlicher Hilfswerke nach Zielland.",
           "OP_01","Sofort publizierbar","Aggregierte Projektdaten ohne Personenbezug.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Projektdatenbank","Erfassung im Projektmanagementsystem"),("Jahresauswertung","Aggregation nach Zielregion"),("Jahresbericht","Projektübersicht im Jahresbericht"),("BMZ-Reporting","Rechenschaftsbericht an BMZ"),("Wirkungsevaluation","Externe Projektevaluation")]),
        d4("hilfswerke-nothilfe-einsaetze","Nothilfe-Einsätze","Einsätze und Mittelvolumen kirchlicher Hilfswerke bei humanitären Krisen nach Ereignis und Region.",
           "OP_01","Sofort publizierbar","Aggregierte Einsatzstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",5,
           [("Krisenerfassung","Registrierung humanitärer Ereignisse"),("Einsatzplanung","Deployment-Dokumentation"),("Mittelerfassung","Spenden- und Finanzerfassung"),("Abschlussbericht","Auswertung je Kriseneinsatz"),("Jahresbericht","Publikation Nothilfebericht")]),
        d4("hilfswerke-partners-sueden","Partnerorganisationen im Globalen Süden","Netzwerk und Qualifikation von Partnerorganisationen kirchlicher Hilfswerke nach Region.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Partnerdaten ohne sensible Details.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Partnerregister","Erfassung im CRM-System"),("Kapazitätsprüfung","Due-Diligence-Prüfung"),("Jahresauswertung","Aggregation je Region"),("Qualitätsbericht","Partnerschaftsevaluation"),("Jahresbericht","Partnernetzwerk-Übersicht")]),
    ],
    "hilfswerke-finanzen": [
        d4("hilfswerke-spendeneinnahmen","Spendeneinnahmen kirchlicher Hilfswerke","Spendenaufkommen nach Hilfswerk, Kampagne und Verwendungszweck.",
           "OP_01","Sofort publizierbar","Aggregierte Spendenstatistik.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",5,
           [("Spendenerfassung","Buchung im CRM-System"),("Jahresabschluss","Konsolidierung im Jahresabschluss"),("DZI-Siegel","Prüfung durch Spenderverband"),("Jahresbericht","Publikation im Jahresbericht"),("Benchmarking","Vergleich im Spendenmarkt")]),
        d4("hilfswerke-bmz-zuschüsse","BMZ-Zuschüsse kirchliche Hilfswerke","Staatliche Ko-Finanzierung kirchlicher Entwicklungsprojekte durch das BMZ nach Programm.",
           "OP_01","Sofort publizierbar","Öffentliche Förderdaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Förderantragsdaten","Erfassung im BMZ-Fördersystem"),("Bewilligungsstatistik","Aggregation genehmigter Mittel"),("Verwendungsnachweis","Prüfung der Mittelverwendung"),("Transparenzbericht","Publikation Förderdatenbank"),("Parlamentarische Kontrolle","Berichterstattung an Bundestag")]),
        d4("hilfswerke-verwaltungskosten","Verwaltungskostenquote Hilfswerke","Anteil der Verwaltungskosten am Gesamthaushalt kirchlicher Hilfswerke nach Organisation.",
           "OP_01","Sofort publizierbar","Aggregierte Effizienzkenngröße.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Kostenrechnung","Buchung nach Kostenarten"),("Jahresabschluss","Wirtschaftsprüfung"),("DZI-Bewertung","Prüfung durch DZI"),("Jahresbericht","Transparenzbericht"),("Benchmarking","Vergleich mit anderen Hilfswerken")]),
    ],
    "hilfswerke-wirkung": [
        d4("hilfswerke-beguenstigte","Begünstigte kirchlicher Hilfswerke","Anzahl direkt Begünstigter kirchlicher Entwicklungsprojekte nach Projekttyp und Region.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Reichweitendaten.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",5,
           [("Projektmonitoring","Erhebung durch Projektpartner"),("Datenaggregation","Konsolidierung auf Hilfswerksebene"),("Jahresbericht","Reichweitenstatistik"),("BMZ-Reporting","Rechenschaftsbericht"),("Wirkungsevaluation","Unabhängige Evaluation")]),
        d4("hilfswerke-sdg-beitrag","SDG-Beitrag kirchlicher Hilfswerke","Einordnung der Projektportfolios nach UN-Nachhaltigkeitszielen.",
           "OP_01","Sofort publizierbar","Aggregiertes Klassifikationssystem.","TH_10","OB_02","GR_02",[("FT_02","JSON")],"LI_02",4,
           [("SDG-Mapping","Zuordnung der Projekte zu SDG-Zielen"),("Jahresauswertung","Aggregation des Portfolios"),("BMZ-Reporting","SDG-Konformitätsprüfung"),("Jahresbericht","SDG-Bericht"),("Wissenschaftsnutzung","Entwicklungsforschung")]),
        d4("hilfswerke-evaluation-berichte","Evaluationsberichte","Externe Evaluationsberichte kirchlicher Entwicklungsprojekte nach Qualitätskriterien.",
           "OP_02","Nach Aufbereitung publizierbar","Evaluationsberichte mit anonymisierten Personendaten.","TH_10","OB_02","GR_02",[("FT_04","XML")],"LI_02",4,
           [("Evaluationsplanung","Auftragserteilung an externe Evaluatoren"),("Felderhebung","Datenerhebung im Projektgebiet"),("Berichtserstellung","Ergebnisbericht"),("Qualitätssicherung","Peer Review durch Fachabteilung"),("Veröffentlichung","Publikation nach Anonymisierung")]),
    ],

    # buddhistische-gemeinschaften: +3 each
    "buddhismus-gemeinschaft-mitglieder": [
        d4("buddhismus-zentren-standorte","Buddhistische Zentren Geodaten","Standorte buddhistischer Meditationszentren und Gemeinschaften in Deutschland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Verbandserfassung","Meldung durch DBU und andere Dachverbände"),("Georeferenzierung","Adressgeokodierung"),("Webpublikation","Gemeindefinder-Karte"),("Aktualisierung","Jährliche Nachführung"),("Verifikation","Bestätigung durch Zentren")]),
        d4("buddhismus-tradition-verteilung","Buddhistische Traditionen Verteilung","Anteil der verschiedenen buddhistischen Traditionen (Zen, Theravada, Vajrayana) an deutschen Gemeinschaften.",
           "OP_01","Sofort publizierbar","Aggregierte Traditionsstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Verbandserhebung","Befragung der Mitgliedsorganisationen"),("Klassifikation","Einordnung nach Tradition"),("Bundesauswertung","DBU-Jahresstatistik"),("Trendanalyse","Entwicklung 2000–2023"),("Wissenschaftsnutzung","Religionssoziologie")]),
        d4("buddhismus-ordinationen","Buddhistische Ordinationen","Anzahl und Art der Ordinationen buddhistischer Mönche und Nonnen in Deutschland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Daten ohne Personenbezug.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Zentrumsmeldung","Erfassung durch Ordinationszentren"),("Traditionsebene","Aggregation nach Tradition"),("Jahresstatistik","DBU-Bericht"),("Wissenschaftsnutzung","Buddhismuskunde"),("Trendanalyse","Entwicklung seit 1990")]),
    ],
    "buddhismus-bildung-praxis": [
        d4("buddhismus-retreats-teilnahme","Buddhistische Retreats Teilnehmerzahlen","Teilnehmende an buddhistischen Meditationsretreats in Deutschland nach Veranstaltungsart.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_03","OB_01","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Anmeldedaten","Erfassung bei Retreat-Anmeldung"),("Jahresauswertung","Aggregation durch Veranstaltungsträger"),("DBU-Statistik","Zusammenführung auf Bundesebene"),("Trendanalyse","Wachstum des Angebots"),("Wissenschaftsnutzung","Meditationsforschung")]),
        d4("buddhismus-lehrende-qualifikation","Buddhistische Lehrende","Qualifikation und Anzahl zertifizierter buddhistischer Lehrer in Deutschland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Qualifikationsdaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Zertifizierungsregister","Erfassung durch Ausbildungsverbände"),("Traditionsprüfung","Anerkennung durch buddhistische Autoritäten"),("DBU-Register","Zusammenführung auf Bundesebene"),("Jahresbericht","DBU-Bericht"),("Qualitätssicherung","Evaluierung der Ausbildungsgänge")]),
        d4("buddhismus-ethik-tierschutz","Buddhistische Tierschutzprojekte","Umwelt- und Tierschutzprojekte buddhistischer Gemeinschaften in Deutschland.",
           "OP_01","Sofort publizierbar","Aggregierte Projektdaten.","TH_06","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Projekterfassung","Meldung durch Gemeinschaften"),("Jahresauswertung","DBU-Aggregation"),("Jahresbericht","Projektbericht DBU"),("Vergleich","Vergleich mit anderen Trägern"),("Pressearbeit","Öffentlichkeitsarbeit")]),
    ],
    "buddhismus-sozial-kulturell": [
        d4("buddhismus-soziale-projekte","Buddhistische Soziale Projekte","Soziale Projekte und Hilfsprogramme buddhistischer Gemeinschaften in Deutschland.",
           "OP_01","Sofort publizierbar","Aggregierte Projektdaten.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Projekterfassung","Meldung durch Träger"),("Jahresauswertung","DBU-Aggregation"),("Jahresbericht","Sozialbericht"),("Fördernachweis","Grundlage für Zuschüsse"),("Qualitätsevaluation","Wirkungsmessung")]),
        d4("buddhismus-kunst-kultur","Buddhistische Kunst und Kultur","Ausstellungen, Vorträge und Kulturprogramme buddhistischer Einrichtungen nach Bundesland.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_03","OB_06","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Veranstaltungserfassung","Meldung durch Zentren"),("Jahresauswertung","Aggregation durch DBU"),("Jahresbericht","Kulturbericht"),("Pressearbeit","Öffentlichkeitsarbeit"),("Wissenschaftsnutzung","Kulturforschung")]),
        d4("buddhismus-meditation-gesundheit","Buddhistische Meditation & Gesundheit","Kooperationsprojekte buddhistischer Zentren mit Gesundheitseinrichtungen (MBSR, Achtsamkeit).",
           "OP_01","Sofort publizierbar","Aggregierte Kooperationsdaten.","TH_01","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("Kooperationserfassung","Meldung durch Zentren"),("Teilnahmestatistik","Aggregation je Programm"),("Jahresauswertung","DBU-Bericht"),("Gesundheitsforschung","Kooperation mit Forschungsinstituten"),("Jahresbericht","Meditationsforschungsbericht")]),
    ],

    # humanistische-verbaende: +3 each
    "humanismus-mitglieder-organisation": [
        d4("humanismus-mitgliederentwicklung","Humanistische Verbände Mitgliederentwicklung","Mitgliederzahlen des Humanistischen Verbands und anderer humanistischer Organisationen, Zeitreihe.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Mitgliederstatistik.","TH_03","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Verbandserhebung","Jahresabfrage bei Landesverbänden"),("Aggregation","Zusammenführung auf Bundesebene"),("Jahresbericht","HVD-Statistik"),("Trendanalyse","Entwicklung seit 1990"),("Wissenschaftsnutzung","Säkularisierungsforschung")]),
        d4("humanismus-ortsgruppen-geodaten","Humanistische Ortsgruppen Geodaten","Standorte humanistischer Ortsgruppen und Beratungsstellen nach Bundesland.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standorte.","TH_03","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",3,
           [("Verbandserfassung","Meldung durch Landesverbände"),("Georeferenzierung","Adressgeokodierung"),("Webpublikation","Standortfinder-Karte"),("Aktualisierung","Jährliche Nachführung"),("Verifikation","Bestätigung durch Landesverbände")]),
        d4("humanismus-kirchenaustritt-foerderung","Kirchenaustrittsberatung Nachfrage","Beratungsanfragen beim HVD zur Kirchenaustrittshilfe nach Bundesland und Monat.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Beratungsstatistik.","TH_03","OB_01","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Beratungserfassung","Anonymisierte Falldokumentation"),("Monatsstatistik","Aggregation je Bundesland"),("Jahresauswertung","HVD-Bericht"),("Trendanalyse","Korrelation mit Kirchenaustrittsstatistik"),("Pressearbeit","Jahrespressemitteilung")]),
    ],
    "humanismus-bildung-beratung": [
        d4("humanismus-hpe-jugendweihe","Jugendweihe Teilnehmerzahlen","Teilnehmerzahlen an humanistischen Jugendfeier-Programmen (Jugendweihe) nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Anmeldedaten","Erfassung bei Programmregistrierung"),("Jahresauswertung","HVD-Landesverbandsstatistik"),("Bundesbericht","HVD-Bundesstatistik"),("Trendanalyse","Entwicklung seit 1990"),("Pressearbeit","Jahrespressemitteilung")]),
        d4("humanismus-ethikunterricht","Humanistischer Ethikunterricht","Schülerzahlen im Werteunterricht und Ethikunterricht humanistischer Träger nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Schulstatistik ohne Einzelpersonenbezug.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("KMK-Schulstatistik","Erfassung durch Kultusministerien"),("HVD-Abgleich","Ergänzung durch Verband"),("Bundesauswertung","Jahresstatistik"),("Jahresbericht","Bildungsbericht HVD"),("Vergleich","Vergleich mit konfessionellem Religionsunterricht")]),
        d4("humanismus-hospizbegleitung","Humanistische Hospizbegleitung","Begleitete Personen in humanistischer Hospiz- und Sterbebegleitung nach Region.",
           "OP_03","Nur Metadaten publizierbar","Sensible personenbezogene Betreuungsdaten.","TH_01","OB_01","GR_03",[("FT_01","CSV")],"LI_04",4,
           [("Falldokumentation","Pseudonymisierte Fallerfassung"),("Jahresstatistik","Aggregation auf Verbandsebene"),("Bundesauswertung","HVD-Sozialbericht"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresbericht","Aggregierter Bericht")]),
    ],
    "humanismus-gesellschaft-weltanschauung": [
        d4("humanismus-weltanschauungsfreiheit","Weltanschauungsfreiheit Monitoring","Erfasste Verstöße gegen Weltanschauungsfreiheit in Deutschland nach Kategorie.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vorfallsstatistik.","TH_08","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Meldestelle","Erfassung durch HVD-Meldestelle"),("Kategorisierung","Klassifikation nach ECHR-Standards"),("Jahresauswertung","Aggregation je Bundesland"),("Behördenkooperation","Weitergabe relevanter Fälle"),("Jahresbericht","Bericht zur Weltanschauungsfreiheit")]),
        d4("humanismus-sterbehilfe-debatte","Sterbehilfe Mediendebatte","Medienberichterstattungsindex zu Sterbehilfe-Gesetzgebung und gesellschaftlicher Debatte.",
           "OP_01","Sofort publizierbar","Medienstatistik ohne Personenbezug.","TH_08","OB_02","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Medienmonitoring","Automatisiertes Monitoring von Onlinemedien"),("Themenklassifikation","NLP-basierte Themenanalyse"),("Sentimentanalyse","Bewertung des Diskursstands"),("Jahresbericht","Diskursbericht HVD"),("Wissenschaftsnutzung","Bioethikforschung")]),
        d4("humanismus-seelsorge-gefaengnis","Humanistische Gefängnisseelsorge","Begleitungsangebote und Fallzahlen humanistischer Seelsorge in Justizvollzugsanstalten.",
           "OP_03","Nur Metadaten publizierbar","Sensible Daten aus dem Strafvollzug.","TH_08","OB_01","GR_02",[("FT_01","CSV")],"LI_04",4,
           [("Falldokumentation","Pseudonymisierte Erfassung je Anstalt"),("Jahresstatistik","Aggregation auf Verbandsebene"),("Justizbehördenkooperation","Abstimmung mit JVA-Leitungen"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresbericht","Aggregierter Sozialbericht")]),
    ],
}

def main():
    with open(PATH, encoding='utf-8') as f:
        data = json.load(f)

    for l2 in data['children']:
        for l3 in l2.get('children', []):
            to_add = ADDITIONS.get(l3['id'], [])
            if to_add:
                l3['children'].extend(to_add)
                print(f"  +{len(to_add)} → {l3['id']}")

    # Verify counts
    for l2 in data['children']:
        total = sum(len(l3.get('children',[])) for l3 in l2.get('children',[]))
        status = "✓" if total >= 69 else "✗"
        print(f"{status} {l2['id']}: {total} L4")

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Geschrieben:", PATH)

main()
