#!/usr/bin/env python3
"""Sprint S-P (Teil 4): sector_wissenschaft.json — alle 19 L2 auf 69 L4 (+169)."""
import json

PATH = '/home/user/datenatlas/public/data/sector_wissenschaft.json'
C = "#3d1a87"  # wissenschaft L4 color

FT = {"FT_01": "CSV", "FT_02": "JSON", "FT_03": "NetCDF / HDF5",
      "FT_04": "XML", "FT_05": "GeoJSON", "FT_06": "Shapefile"}
OP = {
    "01": ("OP_01", "Sofort publizierbar",
           "Aggregierte bzw. offene Forschungs-/Verwaltungsdaten ohne Personenbezug; regulär publizierbar."),
    "02": ("OP_02", "Nach Aufbereitung publizierbar",
           "Erst nach Anonymisierung/Aggregation publizierbar; Mikro- oder Rohdaten zugangsbeschränkt."),
    "03": ("OP_03", "Nur Metadaten publizierbar",
           "Enthält personenbezogene, sensible oder geschützte Daten; nur Metadaten publizierbar."),
}


def procs(name):
    return [
        {"method": "Datenerhebung",
         "description": f"Erhebung der Primärdaten zu {name} im wissenschaftlichen Erhebungs- bzw. Forschungsprozess."},
        {"method": "Aufbereitung",
         "description": f"Strukturierung, Kodierung und Qualitätsaufbereitung der Daten zu {name}."},
        {"method": "Qualitätssicherung",
         "description": f"Validierung, Peer-Review und Konsistenzprüfung der {name}."},
        {"method": "Archivierung und Bereitstellung",
         "description": f"Langzeitarchivierung und FAIR-konforme Bereitstellung der {name} über Repositorien."},
        {"method": "Analyse und Auswertung",
         "description": f"Wissenschaftliche Auswertung und Sekundäranalyse auf Basis der {name}."},
    ]


def d4(_id, name, desc, op, th, ob, gr, fmts, li, rel):
    oc, ol, oe = OP[op]
    return {
        "id": _id, "level": 4, "name": name, "color": C,
        "details": {
            "description": desc,
            "openness": {"class": oc, "label": ol, "explanation": oe},
            "theme": {"code": th}, "object": {"code": ob}, "granularity": {"code": gr},
            "format": [{"code": f, "label": FT[f]} for f in fmts],
            "license": {"code": li}, "relevance": rel,
            "processes": procs(name),
        },
    }


SPEC = {
    # ── universitaet +9 (6 L3) ──
    "studierenden_verwaltung": [
        ("wsp-uni-studienabbruchquote", "Studienabbruchquoten nach Fach", "Abbruch- und Schwundquoten nach Fächergruppe und Hochschulart aus der amtlichen Hochschulstatistik (Destatis/DZHW).", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-uni-regelstudienzeit", "Studiendauer und Regelstudienzeit", "Verteilung der tatsächlichen Studiendauer im Vergleich zur Regelstudienzeit.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "forschungsprojekte": [
        ("wsp-uni-drittmittel-quellen", "Drittmitteleinnahmen nach Quelle", "Drittmittel der Hochschulen nach Mittelgeber (DFG, Bund, EU, Wirtschaft) laut Hochschulfinanzstatistik.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-uni-verbundprojekte", "Verbund- und Kooperationsprojekte", "Zahl und Struktur hochschulübergreifender Verbundforschungsprojekte.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "wissenstransfer-innovation": [
        ("wsp-uni-patentanmeldungen", "Patentanmeldungen der Hochschulen", "Erfindungsmeldungen und Patentanmeldungen aus Hochschulen laut Transferberichten.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-uni-ausgruendungen", "Ausgründungen aus Hochschulen", "Zahl und Branche akademischer Spin-offs aus dem Gründungsmonitoring.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "open-science-digital": [
        ("wsp-uni-open-access-quote", "Open-Access-Publikationsquote", "Anteil frei zugänglicher Publikationen an den Hochschulpublikationen (Open-Access-Monitor).", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
    ],
    "hochschulverwaltung": [
        ("wsp-uni-betreuungsrelation", "Betreuungsrelation Studierende je Professur", "Verhältnis von Studierenden zu Lehrpersonal nach Fächergruppe.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "graduiertenausbildung": [
        ("wsp-uni-promotionen-fach", "Promotionen nach Fach", "Zahl abgeschlossener Promotionen nach Fächergruppe und Geschlecht (Destatis).", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── forschungsinstitut +9 ──
    "datenerhebung": [
        ("wsp-fi-messreihen-langzeit", "Langzeit-Messreihen", "Kontinuierliche wissenschaftliche Messreihen aus institutseigenen Beobachtungsprogrammen.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 4),
        ("wsp-fi-felddaten-erhebung", "Felddatenerhebungen", "Im Feld erhobene Primärdaten aus Erhebungskampagnen.", "02", "TH_10", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
        ("wsp-fi-laborergebnisse", "Laborergebnisdaten", "Strukturierte Messergebnisse aus Laborexperimenten.", "02", "TH_10", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
    ],
    "angewandte-forschung": [
        ("wsp-fi-auftragsforschung-volumen", "Auftragsforschungsvolumen", "Umfang und Auftraggeberstruktur der industriellen Auftragsforschung.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-fi-prototypen-entwicklung", "Prototypen- und Demonstratordaten", "Technische Kennzahlen aus Prototypen- und Demonstratorvorhaben.", "02", "TH_10", "OB_04", "GR_01", ["FT_01"], "LI_03", 3),
        ("wsp-fi-technologietransfer", "Technologietransfer-Lizenzen", "Erteilte Lizenzen und Verwertungserlöse aus der angewandten Forschung.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "wissenschaftsberatung": [
        ("wsp-fi-politikberatung-gutachten", "Politikberatungsgutachten", "Wissenschaftliche Gutachten und Stellungnahmen zur Politikberatung.", "01", "TH_05", "OB_02", "GR_02", ["FT_04"], "LI_02", 4),
        ("wsp-fi-szenarien-modelle", "Szenarien- und Modellrechnungen", "Modellbasierte Szenarien als Grundlage wissenschaftlicher Beratung.", "01", "TH_10", "OB_04", "GR_02", ["FT_03"], "LI_02", 3),
        ("wsp-fi-stakeholder-dialoge", "Stakeholder-Dialogformate", "Dokumentation wissenschaftlicher Dialog- und Beteiligungsformate.", "01", "TH_03", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    # ── forschungsdatenzentrum +9 ──
    "datenarchivierung": [
        ("wsp-fdz-langzeitarchiv-bestand", "Langzeitarchiv-Bestand", "Umfang und Disziplinverteilung langzeitarchivierter Forschungsdatensätze.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-fdz-persistente-identifikatoren", "Vergebene persistente Identifikatoren (DOI)", "Zahl der für Datensätze vergebenen DOIs und ihre Disziplinverteilung.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_01", 3),
        ("wsp-fdz-formatmigration", "Formatmigrationsprotokolle", "Protokolle der Erhaltungsmaßnahmen und Formatmigrationen im Archiv.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "datenzugang": [
        ("wsp-fdz-nutzungsantraege", "Datennutzungsanträge", "Zahl und Bewilligungsquote der Anträge auf Forschungsdatenzugang.", "02", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-fdz-gastwissenschaftler-zugriffe", "Gastaufenthalte und Remote-Zugriffe", "Nutzung gesicherter Zugangswege (Gastaufenthalt, Fernrechnen) zu sensiblen Daten.", "02", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-fdz-scientific-use-files", "Scientific-Use-Files-Abgaben", "Bereitgestellte anonymisierte Mikrodatensätze für die Wissenschaft.", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 4),
    ],
    "fair-datendienste": [
        ("wsp-fdz-metadatenqualitaet", "Metadatenqualität und -vollständigkeit", "Kennzahlen zur Vollständigkeit und Standardkonformität der Metadaten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-fdz-api-nutzung", "API-Nutzung der Datendienste", "Zugriffszahlen auf maschinelle Schnittstellen des Datenzentrums.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-fdz-zitationsverfolgung", "Datenzitationsverfolgung", "Erfassung der Nachnutzung und Zitation bereitgestellter Datensätze.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    # ── akademie-der-wissenschaften +9 (2 L3) ──
    "wissenschaftliche-stellungnahmen": [
        ("wsp-akad-stellungnahmen-themen", "Stellungnahmen nach Themenfeld", "Themenverteilung wissenschaftlicher Stellungnahmen und Empfehlungen der Akademien.", "01", "TH_05", "OB_02", "GR_02", ["FT_04"], "LI_02", 4),
        ("wsp-akad-langzeitvorhaben", "Akademienprogramm-Langzeitvorhaben", "Geförderte geisteswissenschaftliche Langzeitvorhaben im Akademienprogramm.", "01", "TH_10", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-wissenschaftspreise", "Vergebene Wissenschaftspreise", "Von den Akademien vergebene Preise und Auszeichnungen.", "01", "TH_10", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-edition-projekte", "Editions- und Wörterbuchprojekte", "Daten aus wissenschaftlichen Editions-, Wörterbuch- und Korpusvorhaben.", "01", "TH_10", "OB_02", "GR_02", ["FT_04"], "LI_02", 3),
    ],
    "akademiemitglieder-vernetzung": [
        ("wsp-akad-mitglieder-struktur", "Mitgliederstruktur der Akademien", "Disziplin-, Alters- und Geschlechterstruktur der Akademiemitglieder.", "01", "TH_10", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-junge-akademie", "Nachwuchsförderung (Junge Akademie)", "Mitglieder und Projekte der Nachwuchsakademien.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-internationale-kooperationen", "Internationale Akademiekooperationen", "Bilaterale und multilaterale Kooperationen der Wissenschaftsakademien.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-veranstaltungen-reichweite", "Veranstaltungen und Reichweite", "Zahl und Publikumsreichweite öffentlicher Akademieveranstaltungen.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-akad-publikationsreihen", "Publikationsreihen der Akademien", "Umfang und Themen der von Akademien herausgegebenen Schriftenreihen.", "01", "TH_10", "OB_02", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    # ── forschungsfoerderorganisation +9 (2 L3) ──
    "projektfoerderung-verwaltung": [
        ("wsp-foe-bewilligungsquoten", "Bewilligungsquoten nach Programm", "Antrags- und Bewilligungsquoten der Förderprogramme (z. B. DFG-Förderatlas).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-foe-foerdervolumen-fachgebiet", "Fördervolumen nach Fachgebiet", "Verteilung der Fördermittel auf Wissenschaftsdisziplinen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-foe-foerderdauer-projekte", "Förderdauer und Laufzeiten", "Laufzeiten und Verlängerungen geförderter Projekte.", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-foe-nachwuchsfoerderung", "Nachwuchs- und Personenförderung", "Geförderte Nachwuchsgruppen, Stipendien und Personenförderlinien.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "foerderevaluation": [
        ("wsp-foe-wirkungsanalyse", "Wirkungsanalysen der Förderung", "Evaluationsergebnisse zur Wirkung von Förderprogrammen.", "01", "TH_05", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-foe-gleichstellungsmonitoring", "Gleichstellungsmonitoring", "Geschlechterverteilung in Anträgen, Bewilligungen und Gremien.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-foe-internationale-mobilitaet", "Internationale Mobilitätsförderung", "Geförderte Auslandsaufenthalte und internationale Kooperationen.", "01", "TH_10", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-foe-open-science-auflagen", "Open-Science-Auflagen-Erfüllung", "Erfüllung von Open-Access- und Datenmanagement-Auflagen in Projekten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-foe-begutachtungsverfahren", "Begutachtungsverfahren-Kennzahlen", "Kennzahlen zu Dauer, Gutachterzahl und Qualität der Peer-Review-Verfahren.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── wirtschaftsforschungsinstitut +9 (2 L3) ──
    "konjunktur-wirtschaftsforschung": [
        ("wsp-wifo-konjunkturprognose", "Konjunkturprognosen", "Wachstums- und Konjunkturprognosen der Wirtschaftsforschungsinstitute (z. B. Gemeinschaftsdiagnose).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 4),
        ("wsp-wifo-geschaeftsklima-index", "Geschäftsklima- und Stimmungsindizes", "Auf Unternehmensbefragungen basierende Konjunkturindikatoren.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_02", 4),
        ("wsp-wifo-branchenanalysen", "Branchen- und Strukturanalysen", "Wirtschaftswissenschaftliche Analysen einzelner Branchen und Regionen.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-wifo-arbeitsmarktprognose", "Arbeitsmarktprognosen", "Prognosen zu Beschäftigung und Arbeitslosigkeit.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "sozialpolitik-evaluation": [
        ("wsp-wifo-verteilungsanalyse", "Einkommens- und Verteilungsanalysen", "Analysen zur Einkommens- und Vermögensverteilung auf Basis von Mikrodaten.", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 4),
        ("wsp-wifo-reformfolgenabschaetzung", "Reformfolgenabschätzungen", "Modellbasierte Abschätzungen der Wirkung sozial- und steuerpolitischer Reformen.", "01", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_02", 4),
        ("wsp-wifo-mindestlohn-evaluation", "Mindestlohn- und Arbeitsmarktevaluation", "Evaluationsstudien zu arbeitsmarktpolitischen Maßnahmen.", "01", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-wifo-rentenmodellrechnung", "Renten- und Demografiemodelle", "Langfristige Modellrechnungen zu Alterssicherung und Demografie.", "01", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-wifo-gesundheitsoekonomie", "Gesundheitsökonomische Evaluationen", "Kosten-Nutzen-Analysen gesundheitspolitischer Maßnahmen und Versorgung.", "01", "TH_01", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    # ── fachhochschule-haw +9 (2 L3) ──
    "praxisorientierte-forschung": [
        ("wsp-haw-drittmittel-mittelstand", "Drittmittel aus dem Mittelstand", "Kooperationsmittel von HAW mit kleinen und mittleren Unternehmen.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-haw-transferprojekte-region", "Regionale Transferprojekte", "Anwendungsprojekte der HAW mit regionalen Partnern.", "01", "TH_04", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("wsp-haw-anwendungspublikationen", "Anwendungsorientierte Publikationen", "Praxisnahe Publikationen und Fachbeiträge der HAW.", "01", "TH_10", "OB_02", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-haw-promotionsrecht-kooperativ", "Kooperative Promotionen", "Zahl kooperativer Promotionen von HAW mit Universitäten.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "duales-studium": [
        ("wsp-haw-dual-studierende", "Dual Studierende nach Fach", "Zahl dual Studierender nach Fachrichtung und Bundesland.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-haw-partnerunternehmen", "Partnerunternehmen im dualen Studium", "Zahl und Branche der Praxispartner dualer Studiengänge.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-haw-uebernahmequote-dual", "Übernahmequote nach dualem Studium", "Anteil dual Studierender mit Übernahme durch den Praxispartner.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-haw-studienformate-berufsbegleitend", "Berufsbegleitende Studienformate", "Angebot und Nachfrage berufsbegleitender und Teilzeitstudiengänge.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-haw-absolventen-verbleib", "Absolventenverbleib (dual)", "Verbleib und Berufseinstieg dual Studierender nach dem Abschluss.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── wissenschaftliche-bibliothek +9 (2 L3) ──
    "bibliotheksbestand-nutzung": [
        ("wsp-bib-bestandsgroesse", "Bestandsgröße und Erwerbung", "Medienbestand und Erwerbungsausgaben wissenschaftlicher Bibliotheken (DBS).", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-bib-ausleihen-nutzung", "Ausleihen und aktive Nutzer", "Ausleihzahlen und aktive Nutzerschaft laut Deutscher Bibliotheksstatistik.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-bib-zeitschriften-lizenzkosten", "Zeitschriften-Lizenzkosten", "Ausgaben für elektronische Zeitschriften und Konsortiallizenzen.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-bib-fernleihe-aufkommen", "Fernleihe-Aufkommen", "Volumen der überregionalen Literatur- und Dokumentlieferung.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "digitale-bibliotheksinfrastruktur": [
        ("wsp-bib-repositorium-dokumente", "Institutionelle Repositorien", "Zahl der Open-Access-Dokumente in institutionellen Repositorien.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-bib-digitalisierte-werke", "Digitalisierte Werke", "Umfang retrodigitalisierter Bestände und ihre Online-Nutzung.", "01", "TH_10", "OB_06", "GR_02", ["FT_02"], "LI_01", 3),
        ("wsp-bib-publikationsfonds", "Open-Access-Publikationsfonds", "Über Publikationsfonds finanzierte Open-Access-Artikel und Kosten.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-bib-forschungsdaten-services", "Forschungsdaten-Services", "Beratungs- und Kurationsleistungen der Bibliotheken zu Forschungsdaten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-bib-discovery-nutzung", "Discovery- und Katalognutzung", "Nutzungszahlen der Rechercheportale und Discovery-Systeme.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── digitale-forschungsinfrastruktur +9 (2 L3) ──
    "nfdi-datendienste": [
        ("wsp-dfi-konsortien-uebersicht", "NFDI-Konsortien-Übersicht", "Übersicht der Fachkonsortien der Nationalen Forschungsdateninfrastruktur.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-dfi-dienste-katalog", "Katalog der Datendienste", "Verzeichnis bereitgestellter Werkzeuge und Datendienste.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-dfi-terminologiedienste", "Terminologie- und Ontologiedienste", "Bereitgestellte Vokabulare, Ontologien und Normdaten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-dfi-schulungen-trainings", "Schulungen und Trainingsangebote", "Zahl und Reichweite von Trainings zu Forschungsdatenmanagement.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "hpc-rechenzentrum": [
        ("wsp-dfi-rechenleistung-auslastung", "Rechenleistung und Auslastung", "Verfügbare Rechenkapazität und Auslastung der HPC-Cluster.", "01", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-dfi-rechenzeit-vergabe", "Rechenzeitvergabe nach Projekt", "Zugeteilte Rechenzeit und Projektzahl nach Wissenschaftsgebiet.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-dfi-energieverbrauch-rz", "Energieverbrauch der Rechenzentren", "Strom- und Kühlbedarf sowie PUE-Kennzahlen der HPC-Zentren.", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-dfi-speicherkapazitaet", "Speicherkapazität und Datenvolumen", "Vorgehaltene Speicherkapazität und verwaltetes Datenvolumen.", "01", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-dfi-nutzergemeinschaft", "Nutzergemeinschaft der HPC-Zentren", "Zahl und Disziplinverteilung der HPC-Nutzenden und Projekte.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    # ── umweltforschungsinstitut +9 (2 L3) ──
    "klimafolgenforschung": [
        ("wsp-umw-klimamodell-projektionen", "Klimamodell-Projektionen", "Regionale Klimaprojektionen aus Erdsystemmodellen.", "01", "TH_06", "OB_04", "GR_02", ["FT_03"], "LI_02", 5),
        ("wsp-umw-extremwetter-analysen", "Extremwetter-Attributionsanalysen", "Wissenschaftliche Analysen zur Häufigkeit und Zuordnung von Extremwetter.", "01", "TH_06", "OB_04", "GR_02", ["FT_03"], "LI_02", 4),
        ("wsp-umw-treibhausgas-monitoring", "Treibhausgas-Monitoring", "Messreihen atmosphärischer Treibhausgaskonzentrationen.", "01", "TH_06", "OB_04", "GR_01", ["FT_03"], "LI_02", 4),
        ("wsp-umw-vulnerabilitaetsanalyse", "Vulnerabilitäts- und Anpassungsanalysen", "Bewertung der Klimaverwundbarkeit von Regionen und Sektoren.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    "gewaesserforschung": [
        ("wsp-umw-gewaesserguete", "Gewässergütedaten", "Physikalisch-chemische und biologische Gewässergüteparameter.", "01", "TH_06", "OB_04", "GR_01", ["FT_01"], "LI_02", 4),
        ("wsp-umw-grundwasserstand", "Grundwasserstandsmessungen", "Messreihen zu Grundwasserständen und -neubildung.", "01", "TH_06", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
        ("wsp-umw-gewaesseroekologie", "Gewässerökologische Bestandsdaten", "Erhebungen zu aquatischer Biodiversität und Lebensräumen.", "01", "TH_09", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
        ("wsp-umw-meeresforschung-daten", "Meeres- und Küstenforschungsdaten", "Ozeanografische Messdaten aus Meeres- und Küstenforschung.", "01", "TH_06", "OB_04", "GR_01", ["FT_03"], "LI_02", 3),
        ("wsp-umw-stoffeintrag-gewaesser", "Stoffeinträge in Gewässer", "Messdaten zu Nähr- und Schadstoffeinträgen in Oberflächengewässer.", "01", "TH_06", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
    ],
    # ── sozialwiss-forschungsinstitut +9 (2 L3) ──
    "survey-panelstudie": [
        ("wsp-soz-panel-laengsschnitt", "Längsschnitt-Paneldaten", "Wiederholt befragte Haushalts- und Personenpaneldaten (z. B. SOEP-ähnlich).", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 5),
        ("wsp-soz-wahlforschung", "Wahl- und Einstellungsforschung", "Repräsentative Befragungsdaten zu politischen Einstellungen.", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 4),
        ("wsp-soz-methodenforschung", "Umfragemethodenforschung", "Daten aus Experimenten zur Verbesserung von Erhebungsmethoden.", "02", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-soz-zeitverwendung", "Zeitverwendungsdaten", "Erhebungen zur Zeitverwendung von Personen und Haushalten.", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 3),
    ],
    "soziooekon-ungleichheit": [
        ("wsp-soz-armutsforschung", "Armuts- und Lebenslagenforschung", "Indikatoren zu Armutsrisiko und materieller Deprivation.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("wsp-soz-bildungsungleichheit", "Bildungsungleichheitsforschung", "Analysen zum Zusammenhang von Herkunft und Bildungserfolg.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-soz-migration-integration", "Migrations- und Integrationsforschung", "Daten zu Integrationsverläufen und Teilhabe.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-soz-arbeitsbedingungen", "Arbeitsbedingungen und Erwerbsverläufe", "Erhebungen zu Arbeitsqualität und Erwerbsbiografien.", "02", "TH_03", "OB_01", "GR_04", ["FT_01"], "LI_03", 3),
        ("wsp-soz-gesundheitsungleichheit", "Gesundheitliche Ungleichheit", "Analysen zum sozialen Gradienten von Gesundheit und Lebenserwartung.", "01", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── rechtswiss-institut +9 (2 L3) ──
    "rechts-empirik": [
        ("wsp-recht-justizstatistik-analyse", "Justizstatistik-Analysen", "Empirische Auswertungen von Verfahrens- und Justizstatistiken.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-recht-rechtstatsachenforschung", "Rechtstatsachenforschung", "Empirische Erhebungen zur tatsächlichen Anwendung von Recht.", "02", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-recht-kriminologie-daten", "Kriminologische Forschungsdaten", "Daten zu Kriminalität, Sanktionen und Rückfall.", "02", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-recht-rechtsvergleich", "Rechtsvergleichende Datensätze", "Strukturierte Vergleichsdaten nationaler Rechtsordnungen.", "01", "TH_08", "OB_02", "GR_02", ["FT_04"], "LI_02", 3),
    ],
    "regulierungs-daten": [
        ("wsp-recht-gesetzesfolgenabschaetzung", "Gesetzesfolgenabschätzungen", "Wissenschaftliche Folgenabschätzungen von Regulierungsvorhaben.", "01", "TH_08", "OB_02", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-recht-normenscreening", "Normen- und Regelungsscreening", "Systematische Erfassung und Klassifikation von Rechtsnormen.", "01", "TH_08", "OB_02", "GR_02", ["FT_04"], "LI_02", 3),
        ("wsp-recht-compliance-studien", "Compliance- und Vollzugsstudien", "Studien zur Befolgung und zum Vollzug von Regulierung.", "02", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-recht-digitalrecht-forschung", "Digital- und Datenrechtsforschung", "Forschungsdaten zu Plattform-, Daten- und KI-Regulierung.", "01", "TH_08", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-recht-buerokratiekosten", "Bürokratiekosten-Messung", "Erhebungen zu Erfüllungsaufwand und Bürokratiekosten von Regulierung.", "01", "TH_05", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── messnetz-observatorium-astronomie +7 (3 L3) ──
    "erdsystem-beobachtung": [
        ("wsp-obs-seismik-netzwerk", "Seismische Messnetzdaten", "Kontinuierliche Erschütterungsdaten seismologischer Messnetze.", "01", "TH_06", "OB_04", "GR_01", ["FT_03"], "LI_02", 4),
        ("wsp-obs-magnetfeld-monitoring", "Erdmagnetfeld-Monitoring", "Messreihen geomagnetischer Observatorien.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 3),
    ],
    "observationsastronomie-geodaesie": [
        ("wsp-obs-teleskop-beobachtungsdaten", "Teleskop-Beobachtungsdaten", "Astronomische Rohdaten aus Teleskopbeobachtungen.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 4),
        ("wsp-obs-geodaetische-referenz", "Geodätische Referenzdaten", "Daten zu Erdrotation, Schwerefeld und Referenzrahmen.", "01", "TH_10", "OB_05", "GR_02", ["FT_03"], "LI_02", 3),
    ],
    "theoretische-kosmologie": [
        ("wsp-obs-simulationsdaten-kosmos", "Kosmologische Simulationsdaten", "Ergebnisdaten großskaliger Struktur- und N-Körper-Simulationen.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 3),
        ("wsp-obs-modellparameter-kataloge", "Kosmologische Parameterkataloge", "Abgeleitete Modellparameter und Objektkataloge.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-obs-gravitationswellen", "Gravitationswellen-Ereignisdaten", "Detektordaten und Ereigniskataloge der Gravitationswellenforschung.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 3),
    ],
    # ── medizinische-forschung-klinik +9 (4 L3) ──
    "klinische-studien-management": [
        ("wsp-med-studienprotokolle", "Studienprotokolle und Designdaten", "Protokoll- und Designmetadaten klinischer Studien.", "02", "TH_01", "OB_02", "GR_02", ["FT_04"], "LI_03", 3),
        ("wsp-med-rekrutierungszahlen", "Patientenrekrutierungszahlen", "Aggregierte Rekrutierungs- und Abbruchzahlen klinischer Studien.", "02", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "biobank-management": [
        ("wsp-med-biobank-proben", "Biobank-Probenbestand", "Umfang und Probentypen klinischer und populationsbasierter Biobanken.", "02", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-med-probenzugang-antraege", "Probenzugangsanträge", "Anträge auf Zugang zu Biobankproben und ihre Bewilligung.", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "klinische-studien-register": [
        ("wsp-med-studienregister-eintraege", "Studienregister-Einträge", "Registrierte klinische Studien mit Status und Endpunkten.", "01", "TH_01", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-med-ergebnisberichte", "Ergebnisberichte registrierter Studien", "Veröffentlichte Ergebnisberichte und Transparenzquoten.", "01", "TH_01", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "epidemiologie-public-health": [
        ("wsp-med-kohortenstudien", "Epidemiologische Kohortenstudien", "Langzeitdaten bevölkerungsbasierter Gesundheitskohorten.", "02", "TH_01", "OB_01", "GR_04", ["FT_01"], "LI_03", 4),
        ("wsp-med-surveillance-daten", "Public-Health-Surveillance", "Aggregierte Überwachungsdaten zu Erkrankungen und Risikofaktoren.", "01", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-med-versorgungsforschung", "Versorgungsforschungsdaten", "Daten zur Qualität und Inanspruchnahme der Gesundheitsversorgung.", "02", "TH_01", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── ki-forschungsinstitute +9 ──
    "ki-projekte-foerderung": [
        ("wsp-ki-foerderprojekte", "Geförderte KI-Forschungsprojekte", "Zahl und Volumen öffentlich geförderter KI-Projekte.", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-ki-kompetenzzentren", "KI-Kompetenzzentren", "Standorte und Schwerpunkte der nationalen KI-Kompetenzzentren.", "01", "TH_10", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("wsp-ki-rechenressourcen", "KI-Rechenressourcen", "Für KI-Training bereitgestellte GPU-/Rechenkapazitäten.", "01", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "ki-publikationen-patente": [
        ("wsp-ki-publikationsoutput", "KI-Publikationsoutput", "Zahl und Zitation deutscher KI-Publikationen im internationalen Vergleich.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 4),
        ("wsp-ki-patente", "KI-Patentanmeldungen", "Patentanmeldungen mit KI-Bezug nach Anmelder und Feld.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-ki-benchmark-datensaetze", "KI-Benchmark-Datensätze", "Bereitgestellte offene Benchmark- und Trainingsdatensätze.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_01", 3),
    ],
    "ki-anwendungsfelder-transfer": [
        ("wsp-ki-anwendungen-branchen", "KI-Anwendungen nach Branche", "Verbreitung und Reifegrad von KI-Anwendungen in Branchen.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-ki-ausgruendungen", "KI-Ausgründungen", "Aus KI-Forschung hervorgegangene Startups und ihre Felder.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-ki-modellregister", "Register offener KI-Modelle", "Verzeichnis veröffentlichter Forschungsmodelle und Modellkarten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    # ── berufsbildungsforschung +9 ──
    "berufsbildungsstatistik-forschung": [
        ("wsp-bbf-ausbildungsmarkt", "Ausbildungsmarktanalysen", "Angebots- und Nachfrageanalysen des Ausbildungsmarkts (BIBB).", "01", "TH_02", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wsp-bbf-berufsstrukturen", "Beruf- und Qualifikationsstrukturen", "Daten zur Entwicklung von Ausbildungsberufen und Qualifikationen.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-bbf-uebergangssystem", "Übergangssystem-Forschung", "Daten zu Übergängen zwischen Schule, Ausbildung und Beruf.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "arbeitsmarktforschung-iab": [
        ("wsp-bbf-betriebspanel", "Betriebspanel-Daten", "Repräsentative Betriebsbefragungsdaten zu Beschäftigung (IAB-Betriebspanel).", "02", "TH_04", "OB_07", "GR_04", ["FT_01"], "LI_03", 4),
        ("wsp-bbf-fachkraeftebedarf", "Fachkräftebedarfsanalysen", "Projektionen und Analysen zum Fachkräftebedarf nach Branche und Region.", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("wsp-bbf-erwerbsverlaeufe", "Erwerbsverlaufsdaten", "Administrative Längsschnittdaten zu Erwerbsbiografien.", "02", "TH_04", "OB_01", "GR_04", ["FT_01"], "LI_03", 3),
    ],
    "kompetenzforschung-qualifikation": [
        ("wsp-bbf-kompetenzmessung", "Kompetenzmessungen Erwachsener", "Daten zu Grund- und Fachkompetenzen Erwachsener (z. B. PIAAC).", "02", "TH_02", "OB_01", "GR_04", ["FT_01"], "LI_03", 4),
        ("wsp-bbf-weiterbildungsforschung", "Weiterbildungsforschung", "Daten zu Teilnahme und Wirkung beruflicher Weiterbildung.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wsp-bbf-digitalkompetenzen", "Digitalkompetenz-Forschung", "Erhebungen zu digitalen Kompetenzen in Ausbildung und Beruf.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── nfdi-konsortien +9 ──
    "nfdi-forschungsdaten-standards": [
        ("wsp-nfdi-metadatenstandards", "Fachspezifische Metadatenstandards", "Von den Konsortien entwickelte Metadaten- und Beschreibungsstandards.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("wsp-nfdi-datenmodelle", "Gemeinsame Datenmodelle", "Disziplinübergreifende Daten- und Informationsmodelle.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-nfdi-qualitaetskriterien", "Datenqualitätskriterien", "Vereinbarte Kriterien und Prüfregeln für Forschungsdatenqualität.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "nfdi-infrastruktur-services": [
        ("wsp-nfdi-repositorien-netz", "Repositorien-Netzwerk", "Verbundene Datenrepositorien und ihr Datenbestand.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-nfdi-werkzeuge-software", "Forschungssoftware und Werkzeuge", "Bereitgestellte Analyse- und Kurationswerkzeuge der Konsortien.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-nfdi-identitaetsdienste", "Authentifizierungs- und Identitätsdienste", "Föderierte Zugangs- und Identitätsdienste der Infrastruktur.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "nfdi-community-governance": [
        ("wsp-nfdi-beteiligte-einrichtungen", "Beteiligte Einrichtungen", "Mitwirkende Hochschulen und Forschungseinrichtungen je Konsortium.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-nfdi-arbeitsgruppen", "Arbeitsgruppen und Sektionen", "Themen und Beteiligung der übergreifenden Arbeitsgruppen.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-nfdi-community-feedback", "Community-Bedarfserhebungen", "Erhebungen zu Anforderungen und Zufriedenheit der Fachcommunities.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    # ── citizen-science-plattformen +9 ──
    "citizen-beobachtungsdaten": [
        ("wsp-cs-artbeobachtungen", "Artbeobachtungsdaten", "Von Freiwilligen gemeldete Tier- und Pflanzenbeobachtungen.", "01", "TH_09", "OB_05", "GR_01", ["FT_05"], "LI_02", 4),
        ("wsp-cs-umweltmessungen", "Bürger-Umweltmessungen", "Von Freiwilligen erhobene Umwelt- und Sensordaten (z. B. Feinstaub).", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_01", 3),
        ("wsp-cs-phaenologie", "Phänologische Beobachtungen", "Bürgerbeobachtungen zu jahreszeitlichen Naturphänomenen.", "01", "TH_09", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
    ],
    "citizen-projekte-communities": [
        ("wsp-cs-projektverzeichnis", "Citizen-Science-Projektverzeichnis", "Verzeichnis laufender Bürgerforschungsprojekte und Themen.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("wsp-cs-teilnehmerzahlen", "Teilnehmerzahlen und Aktivität", "Zahl und Aktivität freiwilliger Mitwirkender der Plattformen.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-cs-bildungswirkung", "Bildungs- und Beteiligungswirkung", "Daten zur Lern- und Beteiligungswirkung von Citizen Science.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "citizen-qualitaet-validierung": [
        ("wsp-cs-validierungsraten", "Datenvalidierungsraten", "Anteil expertenvalidierter Bürgermeldungen.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
        ("wsp-cs-datenfluss-gbif", "Datenweitergabe an Fachportale", "An Forschungsportale (z. B. GBIF) weitergegebene Beobachtungsdaten.", "01", "TH_09", "OB_05", "GR_01", ["FT_05"], "LI_01", 3),
        ("wsp-cs-protokoll-standards", "Erhebungsprotokoll-Standards", "Standardisierte Erfassungsprotokolle zur Qualitätssicherung.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    # ── geowissenschaftliche-institute +9 ──
    "geowiss-messnetze-beobachtungen": [
        ("wsp-geo-bohrkern-archive", "Bohrkern- und Probenarchive", "Geologische Bohrkern- und Gesteinsprobenbestände.", "01", "TH_10", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
        ("wsp-geo-geophysik-messungen", "Geophysikalische Messdaten", "Schwere-, Magnetik- und seismische Erkundungsdaten.", "01", "TH_10", "OB_04", "GR_01", ["FT_03"], "LI_02", 3),
        ("wsp-geo-bodenmonitoring", "Bodenmonitoring-Daten", "Langzeitdaten zu Bodenzustand und -veränderung.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 3),
    ],
    "geowiss-ressourcen-rohstoffe": [
        ("wsp-geo-rohstoffvorkommen", "Rohstoffvorkommen-Daten", "Kartierte mineralische und Energierohstoffvorkommen.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("wsp-geo-grundwasserressourcen", "Grundwasserressourcen", "Daten zu Grundwasserdargebot und -nutzung.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("wsp-geo-geothermie-potenzial", "Geothermie-Potenzialdaten", "Standortbezogene Potenzialdaten zur geothermischen Energie.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    "geowiss-risiken-gefahren": [
        ("wsp-geo-erdbebengefaehrdung", "Erdbebengefährdungsdaten", "Seismische Gefährdungskarten und Risikoabschätzungen.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 4),
        ("wsp-geo-hangrutschung-kataster", "Hangrutschungs- und Massenbewegungskataster", "Kataster zu Rutschungen und gravitativen Massenbewegungen.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("wsp-geo-georisiken-frühwarnung", "Georisiken-Frühwarndaten", "Monitoringdaten für die Frühwarnung vor geologischen Gefahren.", "01", "TH_06", "OB_04", "GR_01", ["FT_01"], "LI_02", 3),
    ],
}


def main():
    with open(PATH, encoding='utf-8') as f:
        data = json.load(f)

    added = 0
    for l2 in data['children']:
        for l3 in l2.get('children', []):
            spec = SPEC.get(l3['id'])
            if spec:
                l3['children'].extend(d4(*t) for t in spec)
                added += len(spec)
                print(f"  +{len(spec)} → {l3['id']}")

    print(f"\nGesamt hinzugefügt: {added}")
    for l2 in data['children']:
        total = sum(len(l3.get('children', [])) for l3 in l2.get('children', []))
        print(f"{'✓' if total >= 69 else '✗'} {l2['id']}: {total} L4")

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Geschrieben:", PATH)


main()
