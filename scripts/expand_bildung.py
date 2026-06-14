#!/usr/bin/env python3
import json

PATH = '/home/user/datenatlas/public/data/sector_bildung.json'
C = "#92400e"

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
    # allgemeinbildende-schule: +3 each L3
    "unterricht-verwaltung": [
        d4("abs-stundenplan-auslastung","Stundenplan-Auslastung","Belegungsgrade von Unterrichtsräumen und Fachraumnutzung nach Schultyp und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Raumnutzungsdaten ohne Personenbezug.","TH_05","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Stundenplanung","Extraktion aus Schulverwaltungssoftware"),("Aggregation","Zusammenführung auf Schulebene"),("Landesstatistik","Konsolidierung durch Schulaufsicht"),("Raumoptimierung","Analyse für Raumbelegungsplanung"),("Jahresbericht","Schulbericht")]),
        d4("abs-lehrerstunden-fach","Lehrerstunden nach Fach","Unterrichtsstunden differenziert nach Schulfach, Lehrerstatus und Schultyp.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Stundenzahlen ohne Lehrerpersonenbezug.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Stundenerfassung","Extraktion aus Schulverwaltungssoftware"),("Fächerzuordnung","Klassifikation nach KMK-Fächerkanon"),("Landesaggregation","Zusammenführung je Bundesland"),("Fachlehrermangel-Analyse","Identifikation von Engpassfächern"),("Jahresbericht","KMK-Bildungsbericht")]),
        d4("abs-fehlzeiten-krankheit","Schülerfehlzeiten nach Ursache","Krankheits- und unentschuldigte Fehlzeiten nach Schultyp und Region.",
           "OP_03","Nur Metadaten publizierbar","Gesundheitsdaten von Minderjährigen.","TH_01","OB_01","GR_03",[("FT_01","CSV")],"LI_04",4,
           [("Schulmeldesystem","Tägliche Erfassung in Schulsoftware"),("Anonymisierung","Aggregation auf Schulebene"),("Landesstatistik","Schulbehördenauswertung"),("Gesundheitsmonitoring","Weitergabe an Gesundheitsamt"),("Jahresbericht","Schul-Gesundheitsbericht")]),
    ],
    "schulberichterstattung": [
        d4("abs-bildungsbeteiligung-migration","Bildungsbeteiligung nach Migrationshintergrund","Schulübergangsquoten und Abschlussraten differenziert nach Migrationshintergrund.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Bildungsstatistik ohne Einzelpersonenbezug.","TH_02","OB_01","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Schulstatistik","Erfassung durch KMK-Meldewesen"),("Merkmalszuordnung","Kategorisierung nach Migrationshintergrund"),("Landesvergleich","Bildungsmonitor-Auswertung"),("Chancenungleichheitsanalyse","Bildungsbenachteiligung"),("Jahresbericht","Nationaler Bildungsbericht")]),
        d4("abs-klassenwiederholungen","Klassenwiederholungsquoten","Quoten der Klassenwiederholung nach Schultyp, Jahrgangsstufe und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Schulstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("KMK-Statistik","Schulstatistik durch Kultusministerien"),("Jahresaggregation","Zusammenführung auf Landesebene"),("Bundesauswertung","KMK-Jahresbericht"),("Trendanalyse","Entwicklung Sitzenbleiberquote"),("Europäischer Vergleich","OECD-Benchmarking")]),
        d4("abs-ganztagsangebote-nutzung","Ganztagsangebote Nutzungsquoten","Teilnahmequoten an Ganztagsschulangeboten nach Schultyp und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Teilnahmequoten.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Schulerhebung","Meldung durch Schulleitungen"),("Landesaggregation","Zusammenführung je Bundesland"),("KMK-Statistik","Bundesauswertung"),("Ausbaumonitoring","Monitoring Rechtsanspruch 2026"),("Jahresbericht","KMK-Ganztagsbericht")]),
    ],
    "schulinfrastruktur": [
        d4("abs-schulgebaeude-sanierungsbedarf","Schulgebäude Sanierungsbedarf","Baulicher Zustand und Sanierungsbedarf öffentlicher Schulgebäude nach Kreis.",
           "OP_01","Sofort publizierbar","Aggregierte Zustandsdaten ohne Personenbezug.","TH_05","OB_05","GR_03",[("FT_05","GeoJSON"),("FT_01","CSV")],"LI_03",5,
           [("Gebäudeinspektion","Visuelle Inspektion durch Baufachleute"),("Zustandskategorisierung","Bewertung nach KfW-Skala"),("Kommunale Erfassung","Zusammenführung im Gebäudemanagement"),("Kostenschätzung","Sanierungskostenkalkulation"),("Fördermittelplanung","Grundlage für Investitionsplanung")]),
        d4("abs-inklusive-ausstattung","Inklusive Schulausstattung","Ausstattungsgrad mit barrierefreien Einrichtungen und Inklusionsmitteln nach Schulstandort.",
           "OP_01","Sofort publizierbar","Aggregierte Ausstattungsdaten.","TH_02","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_03",4,
           [("Schulerhebung","Inventarerfassung durch Schulleitung"),("Bedarfsanalyse","Vergleich mit Schülerbedarfen"),("Landeserfassung","Auswertung durch Schulaufsicht"),("Barrierefreiheitsprüfung","Bewertung nach DIN 18040"),("Investitionsplanung","Grundlage für Förderanträge")]),
        d4("abs-digitale-ausstattung-schule","Digitale Ausstattung Schulen","Geräteausstattung (Tablets, Laptops, Smartboards) nach Schule und Schultyp.",
           "OP_01","Sofort publizierbar","Aggregierte Ausstattungsstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("Schulinventar","Bestandserfassung digitaler Geräte"),("Digitalpakt-Monitoring","Abgleich mit Förderauflagen"),("Landesauswertung","Zusammenführung durch Schulaufsicht"),("Bundesmonitoring","Nationaler Digitalpakt-Bericht"),("Benchmarking","Vergleich Geräte pro Schüler")]),
    ],

    # berufsschule: +3 each
    "ausbildungsverhaeltnisse": [
        d4("bbs-neue-ausbildungsvertraege","Neue Ausbildungsverträge nach Beruf","Neu abgeschlossene Ausbildungsverträge nach Ausbildungsberuf und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Berufsausbildungsstatistik.","TH_04","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("BA-Berufsberatungsstatistik","Erfassung durch Bundesagentur für Arbeit"),("BIBB-Statistik","Zusammenführung durch BIBB"),("Jahresauswertung","Jährliche Publikation"),("Trendanalyse","Entwicklung nach Berufsfeldern"),("Regionalvergleich","Ländervergleich")]),
        d4("bbs-ausbildungsabbrecher","Ausbildungsabbrecher-Quoten","Lösungsquoten von Ausbildungsverträgen nach Ausbildungsberuf und Betriebsgröße.",
           "OP_01","Sofort publizierbar","Aggregierte Lösungsstatistik.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("BIBB-Datenerhebung","Erfassung bei Kammern und Verbänden"),("Jahresauswertung","BIBB-Berufsbildungsbericht"),("Berufsvergleich","Abbruchquote nach Beruf"),("Ursachenforschung","Kooperation mit Forschungsinstituten"),("Maßnahmenplanung","Grundlage für Berufsberatung")]),
        d4("bbs-ausbildungsplatzspiegel","Ausbildungsplatzspiegel nach Region","Verhältnis von Ausbildungsangebot und -nachfrage nach Kreis und Berufsfeld.",
           "OP_01","Sofort publizierbar","Aggregierte Marktstatistik.","TH_04","OB_02","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("BA-Statistik","Erfassung durch Arbeitsagenturen"),("BIBB-Konsolidierung","Zusammenführung zum Ausbildungsplatzspiegel"),("Trendanalyse","Angebots-Nachfrage-Relation"),("Regionalauswertung","Kreisebene"),("Jahresbericht","BIBB-Datenreport")]),
    ],
    "pruefungswesen_bbs": [
        d4("bbs-abschlusspruefungsquoten","Abschlussprüfungsquoten","Bestehenquoten bei Berufsabschlussprüfungen nach Ausbildungsberuf und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Prüfungsstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Kammerstatistik","Erfassung durch Handwerks- und IHK-Kammern"),("BIBB-Auswertung","Zusammenführung durch BIBB"),("Jahresauswertung","Jährliche Publikation"),("Qualitätsanalyse","Analyse Bestehensquoten"),("Berufsvergleich","Benchmark nach Berufsfeld")]),
        d4("bbs-zwischenpruefung-ergebnisse","Zwischenprüfungsergebnisse","Ergebnisse von Zwischenprüfungen zur Ausbildungsqualität nach Berufsfeld.",
           "OP_03","Nur Metadaten publizierbar","Prüfungsergebnisse einzelner Auszubildender.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Kammererfassung","Erfassung durch Prüfungsausschüsse"),("Aggregation","Zusammenführung auf Berufsebene"),("Qualitätssicherung","Auswertung durch Ausbildungsberatung"),("Anonymisierung","Entfernung aller Personendaten"),("Jahresbericht","Aggregierter Qualitätsbericht")]),
        d4("bbs-kammerregister-ausbilder","Kammerregister der Ausbilder","Anzahl eingetragener Ausbilder und ausbildungsberechtigter Betriebe nach Kammer und Berufsfeld.",
           "OP_01","Sofort publizierbar","Aggregierte Registerstatistik.","TH_04","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Kammerregister","Erfassung durch Handwerks- und IHK-Kammern"),("Jahresauswertung","Statistik je Kammer"),("BIBB-Konsolidierung","Bundesauswertung"),("Kapazitätsanalyse","Ausbildungskapazitäten"),("Jahresbericht","BIBB-Berufsbildungsbericht")]),
    ],
    "berufsorientierung": [
        d4("bbs-praktikumsstatistik","Schulpraktika Statistik","Anzahl und Dauer von Schulpraktika nach Schultyp und Branche.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Praktikumsstatistik.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Schulerhebung","Meldung durch Schulleitungen"),("Landesauswertung","Zusammenführung durch Schulbehörde"),("Branchenzuordnung","Klassifikation nach WZ 2008"),("Trendanalyse","Entwicklung der Praktikumsangebote"),("Jahresbericht","Bildungsbericht")]),
        d4("bbs-berufsberatung-inanspruchnahme","Berufsberatung Inanspruchnahme","Beratungsfälle der Berufsberatung nach Schulform, Alter und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Beratungsstatistik.","TH_04","OB_01","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("BA-Beratungsstatistik","Erfassung aus Beratungsdokumentation"),("Anonymisierung","Aggregation ohne Personenbezug"),("Schulformzuordnung","Kategorisierung nach Schultyp"),("Jahresauswertung","BA-Jahresbericht"),("Bedarfsanalyse","Identifikation von Beratungsschwerpunkten")]),
        d4("bbs-ausbildungsmessen","Ausbildungsmessen Besucherzahlen","Besucherzahlen und Ausstellerstatistik von Ausbildungsmessen nach Region.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_04","OB_02","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Messeveranstalter","Erfassung durch Messeorganisatoren"),("BA-Kooperation","Zusammenführung mit BA-Daten"),("Jahresauswertung","Regionaler Messekalender"),("Effektivitätsmessung","Vermittlungsquote"),("Jahresbericht","Ausbildungsreport")]),
    ],

    # volkshochschule: +3 each
    "kursangebot": [
        d4("vhs-kursbelegung-alter","VHS-Kursbelegung nach Altersgruppen","Teilnehmende an VHS-Kursen differenziert nach Altersgruppe und Themenbereich.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmedaten.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Anmeldedaten","Erfassung bei Kursanmeldung"),("Altersgruppenzuordnung","Anonymisierte Kategorisierung"),("DVV-Statistik","Bundesstatistik des DVV"),("Trendanalyse","Altersstruktur der Bildungsinteressen"),("Jahresbericht","DVV-Jahresstatistik")]),
        d4("vhs-onlinekurse-nutzung","VHS Online-Kurse Nutzung","Nutzungsdaten von VHS-Online-Kursangeboten nach Plattform und Themenkategorie.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Nutzungsstatistik.","TH_02","OB_08","GR_02",[("FT_02","JSON")],"LI_03",4,
           [("Plattformanalyse","Log-Daten der Lernplattform"),("Anonymisierung","Aggregation ohne Nutzerbezug"),("DVV-Konsolidierung","Bundesweite Zusammenführung"),("Nutzungstrendanalyse","Corona-Effekte und Nachwirkungen"),("Jahresbericht","Digitalisierungsbericht")]),
        d4("vhs-integrationskurse","VHS-Integrationskurse Teilnahme","Teilnehmende an BAMF-Integrationskursen in VHS-Trägerschaft nach Sprachniveau und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Kursdaten ohne Personenbezug.","TH_03","OB_01","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("BAMF-Abrechnung","Kursabrechnung im BAMF-System"),("Teilnehmerstatistik","Aggregation ohne Personenbezug"),("Sprachniveauauswertung","Ergebnis der Sprachtests"),("Jahresauswertung","BAMF-Integrationsbericht"),("DVV-Bericht","Trägerperspektive")]),
    ],
    "weiterbildungsberichterstattung": [
        d4("vhs-abschluesse-zertifikate","VHS-Abschlüsse und Zertifikate","Ausgestellte Zertifikate und Abschlüsse nach Kursart und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Zertifikatsstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Kursabschlusserfassung","Dokumentation je VHS"),("DVV-Aggregation","Bundesstatistik"),("Zertifikatsregister","Zuordnung nach Zertifikatstyp"),("Trendanalyse","Entwicklung der Abschlussarten"),("Jahresbericht","DVV-Jahresbericht")]),
        d4("vhs-trainerhonorar","VHS-Dozenten Honorarstruktur","Durchschnittliche Honorare für VHS-Dozenten nach Fachbereich und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Vergütungsstatistik ohne Personenbezug.","TH_04","OB_03","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Honorarerhebung","Befragung der VHS-Leitungen"),("DVV-Aggregation","Bundesweite Zusammenführung"),("Fachbereichsvergleich","Honorarstruktur nach Themen"),("Trendanalyse","Entwicklung seit 2010"),("Tarifvergleich","Vergleich mit Tarifgehältern")]),
        d4("vhs-finanzierung-kommunal","VHS-Finanzierung durch Kommunen","Kommunale Zuschüsse an Volkshochschulen nach Träger und Bundesland.",
           "OP_01","Sofort publizierbar","Öffentliche Haushaltsdaten.","TH_07","OB_03","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Kommunalhaushalt","Erfassung aus kommunalen Haushaltsplänen"),("DVV-Erhebung","Abfrage bei Mitglieds-VHS"),("Bundesauswertung","DVV-Finanzstatistik"),("Pro-Kopf-Vergleich","Zuschuss je Einwohner"),("Jahresbericht","DVV-Finanzbericht")]),
    ],
    "vhs-digitale-weiterbildung": [
        d4("vhs-digitalkompetenz-kurse","VHS Digitalkompetenz-Kurse","Teilnehmende an Kursen zur digitalen Grundbildung und Medienkompetenz nach Altersgruppe.",
           "OP_01","Sofort publizierbar","Aggregierte Teilnahmedaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Kurserfassung","Meldung durch VHS"),("DVV-Aggregation","Bundesauswertung"),("Altersgruppenzuordnung","Kategorisierung"),("Jahresauswertung","DVV-Digitalbericht"),("Europäischer Vergleich","DIGCOMP-Benchmark")]),
        d4("vhs-lernmanagementsysteme","VHS Lernmanagementsysteme","Nutzungsstatistik eingesetzter Lernmanagementsysteme (Moodle, etc.) bei VHS.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Systemnutzungsdaten.","TH_02","OB_08","GR_02",[("FT_02","JSON")],"LI_03",3,
           [("LMS-Datenexport","Anonymisierte Nutzungsauswertung"),("DVV-Konsolidierung","Bundesweite Zusammenführung"),("Systemvergleich","Marktanteile der LMS"),("Nutzungsanalyse","Engagement-Metriken"),("Jahresbericht","Digitalisierungsbericht")]),
        d4("vhs-ki-weiterbildung","VHS KI-Weiterbildungsangebote","Kursangebote zu Künstlicher Intelligenz und Daten-Kompetenzen an Volkshochschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Kursstatistik.","TH_10","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Kurserfassung","Meldung durch VHS-Leitungen"),("Themenzuordnung","Klassifikation nach KI-Themen"),("DVV-Aggregation","Bundesauswertung"),("Trendanalyse","Wachstum KI-Bildungsangebote"),("Jahresbericht","DVV-Trendreport")]),
    ],

    # kita-fruehbildung: +3 each
    "betreuungsplaetze": [
        d4("kita-wartelisten","Kita-Wartelisten Länge","Wartelistenzahlen und Wartezeiten für Kita-Plätze nach Kreis und Altersjahr.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Wartelistendaten.","TH_02","OB_01","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("Kommunale Erfassung","Erfassung durch Jugendämter"),("Anonymisierung","Aggregation ohne Personenbezug"),("Kreisauswertung","Zusammenführung auf Kreisebene"),("Bedarfsplanung","Grundlage für Kita-Ausbau"),("Jahresbericht","Kita-Bedarfsbericht")]),
        d4("kita-betreuungsumfang","Betreuungsumfang Kita","Verteilung der Betreuungszeiten (Halbtags/Ganztagsbetreuung) nach Kreis und Altersgruppe.",
           "OP_01","Sofort publizierbar","Aggregierte Betreuungsdaten.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Kita-Statistik","KJH-Statistik des Destatis"),("Altersgruppendifferenzierung","Unter-3 vs. 3–6 Jahre"),("Kreisauswertung","Kleinräumige Aufschlüsselung"),("Trendanalyse","Ausbau der Ganztagsbetreuung"),("Jahresbericht","BMFSFJ-Bericht")]),
        d4("kita-traeger-verteilung","Kita-Trägerverteilung","Verteilung von Kita-Plätzen nach Trägertyp (öffentlich, frei, privat) auf Kreisebene.",
           "OP_01","Sofort publizierbar","Aggregierte Trägerstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("KJH-Statistik","Bundesstatistik Destatis"),("Trägerklassifikation","Zuordnung nach Trägertyp"),("Kreisauswertung","Kleinräumige Analyse"),("Marktstrukturanalyse","Entwicklung privater Anbieter"),("Jahresbericht","BMFSFJ-Jahresbericht")]),
    ],
    "kitaqualitaet": [
        d4("kita-fachkraftquote","Kita Fachkraftquote","Anteil pädagogisch qualifizierter Fachkräfte am gesamten Kita-Personal nach Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Personalstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("KJH-Personalstatistik","Bundesstatistik Destatis"),("Qualifikationszuordnung","Klassifikation nach Berufsabschluss"),("Landesvergleich","Bundeslandvergleich"),("Trendanalyse","Entwicklung des Fachkräftemangels"),("Jahresbericht","Fachkräftebarometer Frühe Bildung")]),
        d4("kita-raumgroesse-ausstattung","Kita-Räume und Ausstattung","Raumgröße und Ausstattungsqualität in Kindertageseinrichtungen nach Träger.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Ausstattungsdaten.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Betriebserlaubniserfassung","Erfassung durch Jugendamt"),("Raumkategorisierung","Klassifikation nach Funktion"),("Landesauswertung","Zusammenführung durch Landesbehörde"),("Qualitätsmonitoring","Vergleich mit Mindeststandards"),("Jahresbericht","Kita-Qualitätsbericht")]),
        d4("kita-sprachstanderhebung","Sprachstanderhebung Kita","Ergebnisse der Sprachstanderhebungen bei Kindergartenkindern nach Bundesland.",
           "OP_03","Nur Metadaten publizierbar","Personenbezogene Entwicklungsdaten von Kindern.","TH_02","OB_01","GR_03",[("FT_01","CSV")],"LI_04",5,
           [("Sprachstandtest","Standardisierte Testverfahren"),("Ergebniserfassung","Dokumentation in Kita-Software"),("Anonymisierung","Vollständige Entpersonalisierung"),("Landesauswertung","Aggregation durch Schulbehörde"),("Jahresbericht","Aggregierter Sprachförderbericht")]),
    ],
    "kita-elternarbeit": [
        d4("kita-elternbeitraege-einkommensabhaengig","Kita-Elternbeiträge einkommensabhängig","Staffelung der Kita-Elternbeiträge nach Einkommen und Trägertyp in deutschen Kommunen.",
           "OP_01","Sofort publizierbar","Aggregierte Beitragsstruktur ohne Personenbezug.","TH_07","OB_03","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Kommunale Satzungserhebung","Erfassung der Beitragssatzungen"),("Trägervergleich","Analyse nach Trägertyp"),("Bundesvergleich","Ländervergleich DJI"),("Gerechtigkeitsanalyse","Beitragsbelastung nach Einkommensgruppe"),("Jahresbericht","DJI-Kita-Bericht")]),
        d4("kita-elternzufriedenheit","Elternzufriedenheit Kita","Ergebnisse von Elternbefragungen zur Kita-Qualität und Zufriedenheit.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Umfragedaten.","TH_02","OB_01","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Elternbefragung","Online-Befragung durch Jugendamt"),("Anonymisierung","Entfernung aller Identifikatoren"),("Auswertung","Statistische Analyse der Ergebnisse"),("Einrichtungsvergleich","Benchmarking"),("Jahresbericht","Qualitätsbericht")]),
        d4("kita-elterninitiativen","Elterninitiativen Kitas","Anzahl und Kapazität von Elterninitiativ-Kitas nach Bundesland und Träger.",
           "OP_01","Sofort publizierbar","Aggregierte Einrichtungsstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("KJH-Statistik","Bundesstatistik Destatis"),("Trägerklassifikation","Abgrenzung Elterninitiative"),("Bundesauswertung","Jahresstatistik"),("Trendanalyse","Entwicklung der Elterninitiativen"),("Jahresbericht","Kita-Bericht")]),
    ],

    # foerderschule: +3 each
    "foer-sonderpaed-diagnostik": [
        d4("foer-foerderschwerpunkte-verteilung","Förderschwerpunkte Verteilung","Verteilung von Schülerinnen nach sonderpädagogischem Förderschwerpunkt und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Schulstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("KMK-Statistik","Schulstatistik durch Kultusministerien"),("Bundesauswertung","KMK-Jahresbericht"),("Trendanalyse","Entwicklung nach Förderschwerpunkt"),("Europavergleich","EU-SILC-Benchmark"),("Jahresbericht","Bildungsbericht")]),
        d4("foer-diagnoseerstellt-region","Sonderpädagogische Diagnosen nach Region","Anzahl neu erstellter sonderpädagogischer Diagnosen nach Kreis und Förderschwerpunkt.",
           "OP_03","Nur Metadaten publizierbar","Gesundheits-/Förderdaten von Minderjährigen.","TH_02","OB_01","GR_03",[("FT_01","CSV")],"LI_04",4,
           [("Schulbehördenerfassung","Meldung durch Schulämter"),("Anonymisierung","Vollständige Entpersonalisierung"),("Kreisaggregation","Zusammenführung auf Kreisebene"),("Landesauswertung","Schulbehörde"),("Jahresbericht","Aggregierter Förderbericht")]),
        d4("foer-gutachterliche-stellungnahmen","Gutachtliche Stellungnahmen Sonderpädagogik","Anzahl und Verfahrensdauer gutachterlicher Verfahren zur Feststellung sonderpädagogischen Bedarfs.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Verfahrensstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Schulbehördenerfassung","Verfahrensregistrierung"),("Dauermessung","Zeitspanne Antrag bis Abschluss"),("Landesauswertung","Schulaufsicht"),("Qualitätssicherung","Identifikation von Engpässen"),("Jahresbericht","Schulbehördenbericht")]),
    ],
    "foer-inklusionsbegleitung": [
        d4("foer-inklusive-beschulung-anteil","Inklusive Beschulung Anteil","Anteil inklusiv beschulter Schülerinnen mit Förderbedarf nach Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Schulstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("KMK-Statistik","Schulstatistik"),("Bundesauswertung","KMK-Jahresbericht"),("UN-BRK-Monitoring","Berichterstattung an UN-Ausschuss"),("Trendanalyse","Inklusionsfortschritt"),("Europavergleich","European Agency Benchmark")]),
        d4("foer-schulbegleiter-einsatz","Schulbegleiter Einsatz","Anzahl eingesetzter Schulbegleiter nach Träger und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Einsatzdaten ohne Personenbezug.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Jugendamtsdaten","Erfassung aus Eingliederungshilfe-Akten"),("Kostenträgerabfrage","Aggregation durch SGB VIII/IX"),("Landesauswertung","Zusammenführung durch Landesbehörde"),("Kostenanalyse","Ausgaben für Schulbegleitung"),("Jahresbericht","Eingliederungshilfebericht")]),
        d4("foer-nachteilsausgleich","Nachteilsausgleich Prüfungen","Anzahl gewährter Nachteilsausgleiche bei Prüfungen nach Förderschwerpunkt.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Prüfungsdaten.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Prüfungserfassung","Meldung durch Schule"),("Landesauswertung","Schulbehörde"),("Bundesauswertung","KMK-Statistik"),("Trendanalyse","Häufigkeit der Inanspruchnahme"),("Qualitätsbericht","Inklusionsbericht")]),
    ],
    "foer-foerderplanung": [
        d4("foer-foerderplaene-aktualisierung","Förderpläne Aktualisierungsquote","Anteil fristgerecht aktualisierter Förderpläne nach Schule und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Qualitätsstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Schulerfassung","Meldung durch Schulleitung"),("Landesauswertung","Schulaufsicht"),("Qualitätssicherung","Identifikation von Problemschulen"),("Fortbildung","Grundlage für Lehrerfortbildung"),("Jahresbericht","Qualitätsbericht")]),
        d4("foer-uebergaenge-berufsschule","Übergänge Förderschule-Berufsschule","Übergangsquoten und -wege von Förderschülern in Berufsausbildung und Arbeit.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Übergangsdaten.","TH_04","OB_01","GR_03",[("FT_01","CSV")],"LI_03",5,
           [("Schulabgangserhebung","Befragung ehemaliger Schüler"),("BA-Statistik","Abgleich mit Beschäftigungsdaten"),("Anonymisierung","Entpersonalisierung"),("Landesauswertung","Schulbehörde"),("Jahresbericht","Inklusions-Erfolgsbericht")]),
        d4("foer-kooperation-jugendhilfe","Kooperation Schule-Jugendhilfe","Anzahl und Art der Kooperationsvereinbarungen zwischen Förderschulen und Jugendhilfe.",
           "OP_01","Sofort publizierbar","Aggregierte Kooperationsstatistik.","TH_03","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Schulbehördenerhebung","Befragung der Schulen"),("Jugendamtsabgleich","Abstimmung mit Jugendämtern"),("Bundesauswertung","AFET-Statistik"),("Trendanalyse","Kooperationsentwicklung"),("Jahresbericht","Kooperationsbericht")]),
    ],

    # berufsakademie: +3 each
    "ba-duales-studium-verwaltung": [
        d4("ba-studierendenzahlen-branche","BA Studierende nach Branche","Studierende an Berufsakademien differenziert nach Studienfach und Unternehmensbranche.",
           "OP_01","Sofort publizierbar","Aggregierte Studierendenstatistik.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Immatrikulationsstatistik","Erfassung bei Einschreibung"),("Branchenzuordnung","Klassifikation nach WZ 2008"),("Bundesauswertung","AkademieStudis e.V. Statistik"),("Jahresauswertung","Jährliche Publikation"),("Trendanalyse","Wachstum duales Studium")]),
        d4("ba-unternehmensnetzwerk","Berufsakademie Unternehmenspartner","Anzahl und Branchenverteilung der Kooperationsunternehmen bei dualen Hochschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Partnerschaftsstatistik.","TH_04","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Partnererfassung","Registrierung durch BA/DHBW"),("Branchenklassifikation","Zuordnung nach WZ 2008"),("Jahresauswertung","Statistik je BA"),("Bundeszusammenführung","Bundesauswertung"),("Jahresbericht","BA-Jahresbericht")]),
        d4("ba-abbruchquoten-dual","Abbruchquoten Dualstudium","Studienabbruchquoten im dualen Studium differenziert nach Studienfach und Unternehmenstyp.",
           "OP_01","Sofort publizierbar","Aggregierte Abbruchstatistik.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Exmatrikulationsstatistik","Erfassung bei Exmatrikulation"),("Grunddatenerhebung","DZHW-Studienabbruchstudie"),("Fachzuordnung","Klassifikation nach Studienbereich"),("Trendanalyse","Abbruchentwicklung"),("Jahresbericht","DZHW-Bericht")]),
    ],
    "ba-lernortkooperation": [
        d4("ba-praxisbetreuung-qualitaet","Praxisbetreuung Qualität","Bewertung der betrieblichen Praxisbetreuung im dualen Studium durch Studierende.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Befragungsdaten.","TH_04","OB_01","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Studierendenbefragung","Online-Umfrage"),("Anonymisierung","Entfernung aller Identifikatoren"),("BA-Auswertung","Interne Qualitätsanalyse"),("Unternehmenskommunikation","Feedback an Partner"),("Jahresbericht","Qualitätsbericht")]),
        d4("ba-theorie-praxis-transfer","Theorie-Praxis-Transfer","Bewertung der Verzahnung von Theorie- und Praxisphasen im dualen Studium.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Evaluationsdaten.","TH_04","OB_01","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Absolventenbefragung","Online-Befragung 6 Monate nach Abschluss"),("Anonymisierung","Vollständige Entpersonalisierung"),("BA-Auswertung","Interne Qualitätssicherung"),("Benchmarking","Vergleich nach Studienfach"),("Jahresbericht","Qualitätsbericht")]),
        d4("ba-ausbilder-weiterbildung","Ausbilderweiterbildung im Dualstudium","Teilnahme an Weiterbildungsangeboten für betriebliche Ausbilder im dualen Studium.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Teilnahmezahlen.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Teilnahmeerfassung","Registrierung durch Weiterbildungsträger"),("BA-Aggregation","Jahresstatistik der BA"),("Bundesauswertung","Gesamtstatistik"),("Bedarfsanalyse","Identifikation von Kompetenzlücken"),("Jahresbericht","Qualifizierungsbericht")]),
    ],
    "ba-absolventenverbleib": [
        d4("ba-beschaeftigung-6monate","Beschäftigung 6 Monate nach Abschluss","Beschäftigungsquote dualer Studienabsolventen 6 Monate nach Studienabschluss.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Verbleibsdaten.","TH_04","OB_01","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Absolventenbefragung","Online-Befragung 6 Monate nach Abschluss"),("Anonymisierung","Vollständige Entpersonalisierung"),("BA-Aggregation","Auswertung je Studiengang"),("Bundesauswertung","Bundesvergleich"),("Jahresbericht","Absolventenbericht")]),
        d4("ba-einstiegsgehalt-branche","Einstiegsgehalt nach Branche","Mediane Einstiegsgehälter dualer Studienabsolventen nach Branche und Region.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Vergütungsstatistik.","TH_04","OB_03","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Absolventenbefragung","Online-Umfrage zum Einstiegsgehalt"),("Anonymisierung","Aggregation nach Gehaltsquartilen"),("Branchenvergleich","Auswertung nach WZ 2008"),("Regionalauswertung","Gehaltsunterschiede West/Ost"),("Jahresbericht","Absolventenbericht")]),
        d4("ba-uebernahme-partnerunternehmen","Übernahmequote Partnerunternehmen","Anteil der Absolventen, die vom Kooperationsunternehmen übernommen werden.",
           "OP_01","Sofort publizierbar","Aggregierte Übernahmequote.","TH_04","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Unternehmenserhebung","Befragung der Partnerunternehmen"),("BA-Aggregation","Auswertung je BA"),("Bundesauswertung","Gesamtquote"),("Trendanalyse","Entwicklung der Übernahmequote"),("Jahresbericht","BA-Jahresbericht")]),
    ],

    # musikschule: +3 each
    "mus-kursangebot": [
        d4("mus-instrumentalschueler-instrument","Instrumentalschüler nach Instrument","Schülerzahlen nach Instrument (Klavier, Gitarre, Geige etc.) an öffentlichen Musikschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Schülerstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Statistik","Erhebung durch Verband deutscher Musikschulen"),("Jahresauswertung","VdM-Jahresbericht"),("Instrumentenvergleich","Nachfragestruktur"),("Trendanalyse","Entwicklung seit 2000"),("Europavergleich","EMU-Benchmark")]),
        d4("mus-fruehfoerderung-kinder","Frühförderung Kinder Musikschule","Teilnehmende an musikalischer Früherziehung (Kinder unter 6 Jahren) nach Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Teilnahmezahlen.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Statistik","Bundeserhebung"),("Altersgruppe","Erfassung der 0–6-Jährigen"),("Bundesauswertung","VdM-Jahresbericht"),("Trendanalyse","Wachstum Frühförderung"),("Forschungsnutzung","Musikentwicklungsforschung")]),
        d4("mus-erwachsenenbildung","Erwachsenenbildung an Musikschulen","Kursangebote und Teilnehmende für Erwachsene an kommunalen Musikschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Kurs- und Teilnahmedaten.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Erhebung","Jahresbefragung Mitgliedsschulen"),("Altersgruppenzuordnung","Klassifikation 18+"),("Bundesauswertung","VdM-Jahresbericht"),("Trendanalyse","Wachstumssegment"),("Programmentwicklung","Basis für Angebotsentwicklung")]),
    ],
    "mus-instrumentalunterricht": [
        d4("mus-lehrerstunden","Lehrerstunden Musikschule","Unterrichtsstunden nach Fach und Lehrerstatus an öffentlichen Musikschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Stundenzahlen.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Personalstatistik","Bundeserhebung"),("Fächerzuordnung","Klassifikation nach Fach"),("Jahresauswertung","VdM-Bericht"),("Kapazitätsanalyse","Auslastungsgrad"),("Trendanalyse","Lehrerkapazitäten")]),
        d4("mus-unterrichtsformate","Unterrichtsformate Einzeln/Gruppe","Verteilung von Einzel- und Gruppenunterricht nach Fach und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Formatstatistik.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Erhebung","Jahresbefragung"),("Formatklassifikation","Einzel vs. Gruppe"),("Bundesauswertung","VdM-Jahresbericht"),("Effizienzanalyse","Schüler-Lehrer-Verhältnis"),("Trendanalyse","Verschiebung zu Gruppenunterricht")]),
        d4("mus-honorar-lehrende","Honorarstrukturen Musiklehrende","Vergütungsstruktur von Musikschullehrkräften (Fest- vs. Honorarkräfte) nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Vergütungsstatistik.","TH_04","OB_03","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Personalerhebung","Jahresbefragung Mitgliedsschulen"),("Anonymisierung","Aggregation ohne Personenbezug"),("Bundesauswertung","VdM-Personalbericht"),("Gewerkschaftsauswertung","Ver.di-Tarifanalyse"),("Jahresbericht","VdM-Arbeitgeberbericht")]),
    ],
    "mus-kulturelle-bildung": [
        d4("mus-kooperationen-schulen","Musikschule-Schule Kooperationen","Anzahl und Art der Kooperationen zwischen Musikschulen und allgemeinbildenden Schulen.",
           "OP_01","Sofort publizierbar","Aggregierte Kooperationsstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("VdM-Kooperationserhebung","Jahresbefragung"),("Schulzuordnung","Abgleich mit Schulverzeichnis"),("Bundesauswertung","VdM-Jahresbericht"),("Wirkungsanalyse","Kooperationseffekte"),("Jahresbericht","Kultusministerienabstimmung")]),
        d4("mus-auftritte-konzerte","Öffentliche Auftritte und Konzerte","Anzahl öffentlicher Auftritte und Konzerte von Musikschulensembles nach Bundesland.",
           "OP_01","Sofort publizierbar","Veranstaltungsstatistik ohne Personenbezug.","TH_03","OB_06","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Schulmeldung","Erfassung durch Schulleitung"),("VdM-Aggregation","Bundesauswertung"),("Jahresbericht","Kulturprogrammbericht"),("Pressearbeit","Öffentlichkeitsarbeit"),("Wissenschaftsnutzung","Kulturbildungsforschung")]),
        d4("mus-wettbewerbe-jugend-musiziert","Jugend musiziert Teilnahme","Teilnehmende und Preisträgerzahlen bei Jugend musiziert nach Bundesland und Instrument.",
           "OP_01","Sofort publizierbar","Aggregierte Wettbewerbsstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_02",4,
           [("Wettbewerbsdatenbank","Erfassung im Jugend-musiziert-System"),("Bundesauswertung","Statistik des Deutschen Musikrats"),("Jahresauswertung","Wettbewerbsbericht"),("Trendanalyse","Instrumenten-Entwicklung"),("Pressearbeit","Medienberichterstattung")]),
    ],

    # schulpsychologischer-dienst: +3 each
    "spd-beratungsdokumentation": [
        d4("spd-beratungsfaelle-anlass","Beratungsfälle nach Anlass","Beratungsanlässe im schulpsychologischen Dienst nach Kategorie (Lernstörung, Verhalten, Krise).",
           "OP_03","Nur Metadaten publizierbar","Sensible schulpsychologische Falldaten.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_04",5,
           [("Falldokumentation","Pseudonymisierte Erfassung in Beratungssoftware"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresaggregation","Zusammenführung je Schulpsychologischer Dienst"),("Landesauswertung","Schulbehörde"),("Jahresbericht","Aggregierter Beratungsbericht")]),
        d4("spd-beratungsdauer","Beratungsdauer und Abschluss","Durchschnittliche Beratungsdauer und Abschlussarten im schulpsychologischen Dienst.",
           "OP_03","Nur Metadaten publizierbar","Prozessdaten mit Personenbezug.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_04",3,
           [("Falldokumentation","Zeiterfassung je Beratungsfall"),("Anonymisierung","Aggregation ohne Identifikatoren"),("Jahresauswertung","Dienstauswertung"),("Qualitätssicherung","Benchmark mit anderen Diensten"),("Jahresbericht","Jahresberichte Schulpsychologie")]),
        d4("spd-nachfrage-regional","Schulpsychologische Nachfrage regional","Nachfrage nach schulpsychologischer Beratung nach Kreis und Schultyp (Wartezeiten).",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Nachfragedaten ohne Personenbezug.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Wartelistenerfassung","Aggregation durch Dienste"),("Kreisauswertung","Kleinräumige Analyse"),("Landesauswertung","Schulbehörde"),("Bedarfsplanung","Grundlage für Personalplanung"),("Jahresbericht","Versorgungsbericht")]),
    ],
    "spd-krisenintervention": [
        d4("spd-kriseninterventionen-anzahl","Kriseninterventionen Schulpsychologie","Anzahl akuter Kriseninterventionen durch schulpsychologischen Dienst nach Art.",
           "OP_03","Nur Metadaten publizierbar","Sensible Krisendaten.","TH_02","OB_01","GR_02",[("FT_01","CSV")],"LI_04",4,
           [("Krisenprotokoll","Sofortdokumentation nach Einsatz"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresauswertung","Aggregation nach Krisentyp"),("Landesauswertung","Schulbehörde"),("Jahresbericht","Kriseninterventionsbericht")]),
        d4("spd-kooperation-jugendhilfe-spd","Kooperation mit Jugendhilfe","Anzahl und Art der Kooperationsfälle zwischen schulpsychologischem Dienst und Jugendhilfe.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Kooperationsstatistik.","TH_03","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Falldokumentation","Erfassung kooperativer Beratungsfälle"),("Anonymisierung","Aggregation ohne Identifikatoren"),("Jahresauswertung","Dienstauswertung"),("Kooperationsanalyse","Schnittstellen Schule-Jugendhilfe"),("Jahresbericht","Kooperationsbericht")]),
        d4("spd-traumafolgestoerungen","Traumafolgestörungen im Schulkontext","Erfasste Fälle von Traumafolgestörungen in schulpsychologischer Beratung nach Kategorie.",
           "OP_03","Nur Metadaten publizierbar","Hochsensible Gesundheitsdaten.","TH_01","OB_01","GR_02",[("FT_01","CSV")],"LI_04",4,
           [("Falldokumentation","Pseudonymisierte Erfassung"),("Diagnosekodierung","ICD-10-Klassifikation"),("Anonymisierung","Vollständige Entpersonalisierung"),("Jahresauswertung","Aggregation"),("Jahresbericht","Psych. Beratungsbericht")]),
    ],
    "spd-praevention": [
        d4("spd-praeventionsprogramme-teilnahme","Präventionsprogramme Schulpsychologie","Teilnehmende Schulen und Schüler an schulpsychologischen Präventionsprogrammen.",
           "OP_01","Sofort publizierbar","Aggregierte Programmstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Programmerfassung","Meldung durch Dienste"),("Schülerzuordnung","Aggregation nach Schule"),("Landesauswertung","Schulbehörde"),("Wirkungsevaluation","Evaluierung der Programme"),("Jahresbericht","Präventionsbericht")]),
        d4("spd-fortbildung-lehrkraefte","Fortbildung Lehrkräfte durch Schulpsychologie","Fortbildungsveranstaltungen und Teilnehmende (Lehrkräfte) durch schulpsychologischen Dienst.",
           "OP_01","Sofort publizierbar","Aggregierte Fortbildungsstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Fortbildungserfassung","Meldung durch Dienste"),("Teilnehmererfassung","Anonymisierte Anmeldedaten"),("Landesauswertung","Schulbehörde"),("Wirkungsevaluation","Follow-up-Befragung"),("Jahresbericht","Fortbildungsbericht")]),
        d4("spd-mobbing-praevention","Mobbing-Prävention in Schulen","Schulen mit implementierten Mobbing-Präventionsprogrammen in Kooperation mit Schulpsychologie.",
           "OP_01","Sofort publizierbar","Aggregierte Programmstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Schulerhebung","Meldung durch Schulleitung"),("Programmkartierung","Erfassung durch Dienste"),("Bundesauswertung","Bundeskonferenz Schulpsychologie"),("Wirkungsforschung","Kooperation mit Universität"),("Jahresbericht","Mobbing-Präventionsbericht")]),
    ],

    # digitale-bildungsplattformen: +3 each
    "mooc-nutzung-plattformen": [
        d4("mooc-abschlussquoten","MOOC-Abschlussquoten","Kursabschlussquoten auf deutschen und europäischen MOOC-Plattformen nach Fachbereich.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Nutzungsdaten.","TH_02","OB_08","GR_02",[("FT_02","JSON")],"LI_02",4,
           [("Plattformdatenexport","Anonymisierter Datenexport"),("Aggregation","Zusammenführung nach Fachbereich"),("Bundesauswertung","HFD-Bericht"),("Europavergleich","European MOOC Consortium"),("Jahresbericht","MOOC-Marktbericht")]),
        d4("mooc-nutzerdemografie","MOOC-Nutzerdemografie","Altersstruktur und Bildungsgrad der MOOC-Nutzenden auf deutschen Plattformen.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Demografiedaten.","TH_02","OB_01","GR_02",[("FT_02","JSON")],"LI_02",3,
           [("Registrierungsdaten","Anonymisierte Profilextraktion"),("Aggregation","Gruppenbildung nach Alter/Bildung"),("Plattformauswertung","Interne Analyseeinheit"),("Bundesauswertung","Hochschulforum Digitalisierung"),("Jahresbericht","Lernkulturbericht")]),
        d4("mooc-zertifikatsnutzung","MOOC-Zertifikate Arbeitsmarkt","Nutzung von MOOC-Zertifikaten im Bewerbungsprozess nach Branche.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Umfragedaten.","TH_04","OB_01","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Absolventenbefragung","Online-Survey"),("Anonymisierung","Vollständige Entpersonalisierung"),("Branchenauswertung","Klassifikation nach WZ 2008"),("Arbeitgeberumfrage","Akzeptanz durch HR-Abteilungen"),("Jahresbericht","Hochschulforum Digitalisierung")]),
    ],
    "schuldigitalisierung-lms": [
        d4("lms-marktanteile-schule","LMS Marktanteile Schulen","Verbreitung von Lernmanagementsystemen (Moodle, IServ, itslearning) an deutschen Schulen.",
           "OP_01","Sofort publizierbar","Aggregierte Marktdaten ohne Personenbezug.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Schulerhebung","Befragung durch Schulbehörden"),("Anbieterdaten","Ergänzung durch Plattformanbieter"),("Bundesauswertung","BMBF-Digitalpaktbericht"),("Trendanalyse","Wachstum einzelner Systeme"),("Jahresbericht","Schuldigitalisierungsbericht")]),
        d4("lms-nutzungsintensitaet","LMS Nutzungsintensität","Aktive Nutzung von Schulplattformen nach Schultyp und Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Nutzungsstatistik.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Plattformdatenexport","Anonymisierter Log-Datenexport"),("Schulaggregation","Zusammenführung auf Schulebene"),("Landesauswertung","Schulbehörde"),("Nutzungsanalyse","DAU/MAU-Metriken"),("Jahresbericht","Digitalpaktbericht")]),
        d4("lms-datenschutzkonformitaet","LMS Datenschutzkonformität","Bewertung der DSGVO-Konformität eingesetzter Schulplattformen nach Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Datenschutzbewertung.","TH_08","OB_08","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Datenschutzbehörden","Prüfung durch Landesdatenschutzbeauftragte"),("Schulbehördenerhebung","Freigabelisten je Bundesland"),("Bundesvergleich","Vergleich der Freigabelisten"),("Updatemonitoring","Laufende Aktualisierung"),("Jahresbericht","Datenschutzbericht")]),
    ],
    "edtech-markt-investitionen": [
        d4("edtech-startup-finanzierung","EdTech Startup-Finanzierungen","Investitionsvolumen in deutsche EdTech-Startups nach Finanzierungsrunde und Segment.",
           "OP_01","Sofort publizierbar","Aggregierte Investitionsstatistik.","TH_04","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Datenbankrecherche","Crunchbase/PitchBook-Auswertung"),("Segmentklassifikation","Einordnung nach EdTech-Kategorie"),("Jahresauswertung","Branchenstatistik"),("Europavergleich","HolonIQ-Benchmark"),("Jahresbericht","EdTech-Marktbericht")]),
        d4("edtech-nutzer-schulen","EdTech-Produkte in Schulen","Nutzung kommerzieller EdTech-Produkte an deutschen Schulen nach Produktkategorie.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Produktnutzungsdaten.","TH_02","OB_08","GR_03",[("FT_01","CSV")],"LI_02",3,
           [("Schulerhebung","Befragung durch Forschungsinstitute"),("Produktkategorisierung","Klassifikation nach EdTech-Typ"),("Bundesauswertung","Hochschulforum Digitalisierung"),("Marktanalyse","Marktanteil je Kategorie"),("Jahresbericht","Marktreport")]),
        d4("edtech-evidenz-wirksamkeit","EdTech-Evidenz Wirksamkeitsstudien","Verfügbare Wirksamkeitsstudien zu EdTech-Produkten nach Studienqualität und Lernziel.",
           "OP_01","Sofort publizierbar","Aggregierte Literaturauswertung.","TH_10","OB_02","GR_02",[("FT_02","JSON")],"LI_02",4,
           [("Literaturrecherche","Systematische Datenbanksuche"),("Qualitätsbewertung","GRADE-Beurteilung der Studien"),("Metaanalyse","Statistische Zusammenführung"),("Bundesauswertung","DIPF-Evidenzreview"),("Jahresbericht","Bildungsforschungsbericht")]),
    ],

    # hochschule: +3 each
    "studienfinanzierung-foerderung": [
        d4("bafög-bewilligungsquote","BAföG-Bewilligungsquote","Anteil der BAföG-Empfänger an Studierenden nach Hochschultyp und Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Förderstatistik.","TH_07","OB_03","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("BMBF-BAföG-Statistik","Jahresauswertung der Destatis"),("Bundeslandauswertung","Ländervergleich"),("Zeitreihe","Entwicklung seit BAföG-Reformen"),("Vergleich","Anteil an Studierenden"),("Jahresbericht","BAföG-Bericht des BMBF")]),
        d4("stipendien-deutschlandstipendium","Deutschlandstipendium Vergabe","Stipendiaten und Förderhöhen des Deutschlandstipendiums nach Hochschule.",
           "OP_01","Sofort publizierbar","Aggregierte Stipendiendaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("BMBF-Stipendiendatenbank","Erfassung durch Hochschulen"),("Jahresauswertung","Bundesstatistik"),("Hochschulvergleich","Vergabequote je Hochschule"),("Trendanalyse","Entwicklung seit 2011"),("Jahresbericht","BMBF-Stipendienbericht")]),
        d4("studienkredit-inanspruchnahme","Studienkredit-Inanspruchnahme","Volumen und Nutzerzahlen von Studienkrediten (KfW, Banken) nach Hochschultyp.",
           "OP_01","Sofort publizierbar","Aggregierte Kreditstatistik.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("KfW-Statistik","KfW-Jahresbericht"),("Bankstatistik","Bundesbankerhebung"),("Bundesauswertung","Destatis-Hochschulstatistik"),("Trendanalyse","Entwicklung Studienfinanzierung"),("Jahresbericht","BMBF-Sozialbericht")]),
    ],
    "studienverlauf-abschluesse": [
        d4("studium-regelstudienzeit","Studiendauer vs. Regelstudienzeit","Anteil der Absolventen, die die Regelstudienzeit über- oder unterschreiten, nach Fach.",
           "OP_01","Sofort publizierbar","Aggregierte Studienstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Prüfungsstatistik","Erfassung durch Prüfungsämter"),("HIS-Auswertung","DZHW-Absolventenpanel"),("Bundesauswertung","Destatis-Hochschulstatistik"),("Fachvergleich","Regelstudienzeit nach Fach"),("Jahresbericht","HRK-Hochschulstatistik")]),
        d4("studium-exmatrikulation-ohne-abschluss","Exmatrikulation ohne Abschluss","Anteil der Studienabbrecher nach Fachbereich und Hochschultyp (ohne Hochschulwechsler).",
           "OP_01","Sofort publizierbar","Aggregierte Abbruchstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("DZHW-Studienabbruchstudie","Repräsentative Befragung"),("Exmatrikulationsstatistik","Hochschulstatistik"),("Bundesauswertung","Destatis"),("Trendanalyse","Entwicklung Abbruchquoten"),("Jahresbericht","BMBF-Hochschulbericht")]),
        d4("studium-masterquote","Master-Übergangsquote","Anteil der Bachelor-Absolventen, die ein Masterstudium aufnehmen, nach Fach.",
           "OP_01","Sofort publizierbar","Aggregierte Übergangsstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("DZHW-Panel","Absolventenpanel"),("Hochschulstatistik","Immatrikulationsdaten"),("Bundesauswertung","Destatis"),("Fachvergleich","Masterquote nach Fach"),("Jahresbericht","HRK-Statistik")]),
    ],
    "internationalisierung-auslandsstudium": [
        d4("erasmus-outgoing-incoming","Erasmus+ Outgoing/Incoming","Anzahl und Fächerverteilung der Erasmus-Studierenden (Out- und Incomings) nach Hochschule.",
           "OP_01","Sofort publizierbar","Aggregierte Mobilitätsstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("DAAD-Statistik","Jahresbericht DAAD"),("Europäische Kommission","EU-Mobilitätsdaten"),("Hochschulauswertung","Mobilitätsquote je Hochschule"),("Trendanalyse","Entwicklung seit 1987"),("Jahresbericht","Erasmus-Jahresbericht")]),
        d4("internationale-studierende-herkunft","Internationale Studierende Herkunft","Studierende aus dem Ausland nach Herkunftsland und Fachbereich an deutschen Hochschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Herkunftsstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Immatrikulationsstatistik","Hochschulstatistik Destatis"),("Herkunftslandauswertung","Klassifikation nach ISO-3166"),("DAAD-Auswertung","Jahresbericht DAAD"),("Trendanalyse","Entwicklung Internationalität"),("Jahresbericht","DAAD/HRK-Statistik")]),
        d4("auslandssemester-studierende","Auslandssemester deutsche Studierende","Deutsche Studierende mit mindestens einem Auslandssemester nach Hochschultyp und Fach.",
           "OP_01","Sofort publizierbar","Aggregierte Mobilitätsstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("DZHW-Absolventenpanel","Repräsentative Befragung"),("DAAD-Statistik","Jahresbericht"),("Hochschulauswertung","Mobilitätsquote"),("Fachvergleich","Auslandsquote nach Fach"),("Jahresbericht","DAAD-Statistikbericht")]),
    ],

    # fachschulen-fachakademien: +3 each
    "fachschule-ausbildung-abschluesse": [
        d4("fachschule-erzieher-absolventenzahlen","Erzieher-Ausbildung Absolventenzahlen","Absolventinnen der Erzieherinnen-Ausbildung an Fachschulen nach Bundesland.",
           "OP_01","Sofort publizierbar","Aggregierte Absolventenstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("KMK-Statistik","Schulstatistik Kultusministerien"),("Bundesauswertung","KMK-Jahresbericht"),("Bedarfsanalyse","Relation zu offenen Kita-Stellen"),("Trendanalyse","Absolventenentwicklung"),("Jahresbericht","Fachkräftebarometer Frühe Bildung")]),
        d4("fachschule-techniker-staatspruefung","Techniker Staatsprüfung","Ergebnisse und Bestehensquoten der Staatlichen Techniker-Prüfung nach Fachrichtung.",
           "OP_01","Sofort publizierbar","Aggregierte Prüfungsstatistik.","TH_04","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Prüfungsstatistik","Schulbehörde"),("Bundesauswertung","KMK-Statistik"),("Fachrichtungsvergleich","Bestehensquote nach Fach"),("Trendanalyse","Entwicklung Technikermangel"),("Jahresbericht","Berufsbildungsbericht")]),
        d4("fachschule-sozialpaedagogik-nachfrage","Sozialpädagogik Fachschule Nachfrage","Bewerberzahlen und Wartelisten für sozialpädagogische Fachschulausbildungen.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Bewerberdaten.","TH_03","OB_08","GR_03",[("FT_01","CSV")],"LI_03",4,
           [("Schulerhebung","Bewerbungsstatistik je Schule"),("Landesaggregation","Zusammenführung durch Schulbehörde"),("Engpassanalyse","Angebot-Nachfrage-Verhältnis"),("Kapazitätsplanung","Grundlage für Schulausbau"),("Jahresbericht","Fachkräftemangelbericht")]),
    ],
    "fachschule-personal-ausstattung": [
        d4("fachschule-lehrkraefte-qualifikation","Fachschule Lehrkräfte Qualifikation","Qualifikationsstruktur des Lehrpersonals an Fachschulen nach Bundesland.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Personalstatistik.","TH_02","OB_02","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("KMK-Personalstatistik","Schulstatistik Kultusministerien"),("Bundesauswertung","KMK-Jahresbericht"),("Qualifikationsanalyse","Anteil Mastertitel oder höher"),("Trendanalyse","Fachkräftesituation Fachschulen"),("Jahresbericht","KMK-Bildungsbericht")]),
        d4("fachschule-ausstattung-werkstatt","Fachschule Werkstattausstattung","Ausstattungsqualität der Werkstätten und Labore an technischen Fachschulen.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Ausstattungsdaten.","TH_04","OB_08","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Schulerhebung","Inventarerfassung durch Schulleitung"),("Bedarfsanalyse","Vergleich mit Branchenstandards"),("Landesauswertung","Schulbehörde"),("Investitionsplanung","Grundlage für Mittelbeantragung"),("Jahresbericht","Schulausstattungsbericht")]),
        d4("fachschule-praxispartner","Fachschule Praxispartner Netzwerk","Kooperationsbetriebe und Praktikumsplätze im Netzwerk von Fachschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Partnerschaftsstatistik.","TH_04","OB_08","GR_03",[("FT_01","CSV")],"LI_03",3,
           [("Schulerhebung","Meldung durch Schulleitung"),("Branchenklassifikation","WZ-2008-Zuordnung"),("Landesauswertung","Schulbehörde"),("Kapazitätsanalyse","Praktikumsplatzangebot"),("Jahresbericht","Praxisbericht")]),
    ],
    "fachschule-beruf-arbeitsmarkt": [
        d4("fachschule-beschaeftigung-absolventen","Beschäftigung Fachschulabsolventen","Beschäftigungsquote und -felder von Fachschulabsolventen 12 Monate nach Abschluss.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Verbleibsdaten.","TH_04","OB_01","GR_02",[("FT_01","CSV")],"LI_03",4,
           [("Absolventenbefragung","Online-Befragung 12 Monate nach Abschluss"),("Anonymisierung","Vollständige Entpersonalisierung"),("BA-Abgleich","Ergänzung mit Beschäftigungsstatistik"),("Bundesauswertung","Berufsbildungsbericht"),("Jahresbericht","BIBB-Absolventenbericht")]),
        d4("fachschule-gehalt-staatlich-geprueft","Gehaltsniveau Staatlich Geprüfte","Einkommensstruktur staatlich geprüfter Techniker und Betriebswirte nach Branche.",
           "OP_02","Nach Aufbereitung publizierbar","Anonymisierte Gehaltsdaten.","TH_04","OB_03","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Absolventenbefragung","Einkommenserhebung"),("Anonymisierung","Quartilsaggregation"),("BA-Entgeltatlas","Ergänzung mit BA-Daten"),("Vergleich","Vergleich Bachelor vs. Techniker"),("Jahresbericht","BIBB-Bericht")]),
        d4("fachschule-weiterbildung-anschluss","Weiterbildung nach Fachschule","Anschlussstudien und Weiterbildungen nach Fachschulabschluss (Bachelor-Anrechnung).",
           "OP_01","Sofort publizierbar","Aggregierte Übergangsstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("Absolventenbefragung","Online-Umfrage"),("Hochschulstatistik","Immatrikulationsdaten"),("BIBB-Auswertung","Durchlässigkeitsmonitoring"),("Anrechnungsmonitoring","Hochschule Anrechnungsstatistik"),("Jahresbericht","BIBB-Durchlässigkeitsbericht")]),
    ],

    # deutsche-auslandsschulen: +3 each
    "auslandsschule-netzwerk-standorte": [
        d4("auslandsschule-geodaten","Deutsche Auslandsschulen Geodaten","Standorte der deutschen Auslandsschulen weltweit nach Schultyp und Region.",
           "OP_01","Sofort publizierbar","Öffentlich zugängliche Standortinformationen.","TH_02","OB_05","GR_03",[("FT_05","GeoJSON")],"LI_02",4,
           [("ZfA-Schulverzeichnis","Erfassung durch Zentralstelle für Auslandsschulwesen"),("Georeferenzierung","GPS-Koordinatenerfassung"),("Webpublikation","Schulsuche auf ZfA-Website"),("Jahresaktualisierung","Jährliche Nachführung"),("Bildungsberichterstattung","Grundlage für ZfA-Jahresbericht")]),
        d4("auslandsschule-schuelerzahlen","Auslandsschulen Schülerzahlen","Schülerzahlen an deutschen Auslandsschulen nach Weltregion und Schultyp.",
           "OP_01","Sofort publizierbar","Aggregierte Schulstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("ZfA-Jahresstatistik","Erhebung durch Schulen"),("Regionenaggregation","Zusammenführung nach Weltregion"),("Trendanalyse","Entwicklung Auslandsschulnetz"),("Bundesauswertung","ZfA-Jahresbericht"),("Europavergleich","BMBF-Internationaler Bericht")]),
        d4("auslandsschule-lehrkraefte-entsendung","Lehrkräfte-Entsendung Auslandsschulen","Entsendungen und Vertragstypen von Lehrkräften an deutschen Auslandsschulen.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Personalstatistik.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("ZfA-Personalstatistik","Erfassung durch ZfA"),("Vertragsklassifikation","Bund-Entsendung vs. lokale Verträge"),("Jahresauswertung","ZfA-Personalbericht"),("Trendanalyse","Entwicklung Entsendeprogramme"),("Jahresbericht","ZfA-Jahresbericht")]),
    ],
    "auslandsschule-curriculum-abschluesse": [
        d4("auslandsschule-dfp-abiturienten","DFP-Abiturienten Auslandsschulen","Anzahl der Absolventen des Deutschen Internationalen Abiturs (DFP) an Auslandsschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Abschlussstatistik.","TH_02","OB_02","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("ZfA-Prüfungsstatistik","Erfassung durch ZfA"),("Prüfungsauswertung","Bestehensquoten"),("Regionenvergleich","Auswertung nach Weltregion"),("Jahresbericht","ZfA-Jahresbericht"),("Trendanalyse","Internationalisierung des Abiturs")]),
        d4("auslandsschule-bilingualer-unterricht","Bilingualer Unterricht Auslandsschulen","Umfang und Fächer des bilingualen Unterrichts an deutschen Auslandsschulen.",
           "OP_01","Sofort publizierbar","Aggregierte Curriculumdaten.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("ZfA-Curriculumerhebung","Befragung der Schulleitungen"),("Fächerklassifikation","Einordnung nach Sprachkombination"),("Jahresauswertung","ZfA-Bericht"),("Trendanalyse","Ausbau bilingualer Angebote"),("Jahresbericht","BMBF-Internationalitätsbericht")]),
        d4("auslandsschule-gastlanddiplom","Gastlanddiplome Auslandsschulen","Auslandsschulen mit Berechtigung, Gastlanddiplome neben dem Deutschen Bildungszeugnis zu verleihen.",
           "OP_01","Sofort publizierbar","Aggregierte Anerkennungsstatistik.","TH_02","OB_08","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("ZfA-Anerkennungsregister","Erfassung durch ZfA"),("Gastlandzuordnung","Klassifikation nach Gaststaat"),("Jahresauswertung","ZfA-Bericht"),("Trendanalyse","Entwicklung Bildungsabkommen"),("Jahresbericht","BMBF-Internationaler Bericht")]),
    ],
    "auslandsschule-foerderung-finanzierung": [
        d4("auslandsschule-bundesfoerderung","Bundesförderung Auslandsschulen","Fördervolumen des Bundes für deutsche Auslandsschulen nach Schultyp und Region.",
           "OP_01","Sofort publizierbar","Öffentliche Förderdaten.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",4,
           [("ZfA-Förderdaten","Erfassung der Zuwendungen"),("Haushaltsauswertung","Bundeshaushaltsplan"),("Jahresauswertung","ZfA-Finanzbericht"),("Parlamentarische Kontrolle","Bundestagsberichterstattung"),("Jahresbericht","ZfA-Jahresbericht")]),
        d4("auslandsschule-schulgeld","Schulgeld Auslandsschulen","Schulgeldstruktur und Sozialstaffelung an deutschen Auslandsschulen nach Region.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Gebührendaten ohne Schulkonkretisierung.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_02",3,
           [("Schulbefragung","Erhebung durch ZfA"),("Regionsaggregation","Zusammenführung nach Weltregion"),("Affordabilitätsanalyse","Soziale Zugänglichkeit"),("Jahresauswertung","ZfA-Finanzbericht"),("Jahresbericht","ZfA-Jahresbericht")]),
        d4("auslandsschule-elternbeitragserstattung","Elternbeitragserstattung BMBF","Erstattungsleistungen des BMBF für Schulgeldaufwendungen entsandter Beamtenkinder.",
           "OP_02","Nach Aufbereitung publizierbar","Aggregierte Förderstatistik.","TH_07","OB_03","GR_02",[("FT_01","CSV")],"LI_03",3,
           [("BMBF-Fördererfassung","Erfassung der Erstattungsanträge"),("Jahresauswertung","Aggregation nach Zielland"),("Bundesauswertung","BMBF-Jahresbericht"),("Trendanalyse","Entwicklung der Erstattungsleistungen"),("Jahresbericht","BMBF-Bericht")]),
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

    for l2 in data['children']:
        total = sum(len(l3.get('children', [])) for l3 in l2.get('children', []))
        status = "✓" if total >= 69 else "✗"
        print(f"{status} {l2['id']}: {total} L4")

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Geschrieben:", PATH)

main()
