#!/usr/bin/env python3
"""Sprint S-P (Teil 5): sector_zivilgesellschaft.json — alle L2 auf ≥69 L4 (+156)."""
import json

PATH = '/home/user/datenatlas/public/data/sector_zivilgesellschaft.json'
C = "#6d28d9"  # zivilgesellschaft L4 color

FT = {"FT_01": "CSV", "FT_02": "JSON", "FT_03": "NetCDF / HDF5",
      "FT_04": "XML", "FT_05": "GeoJSON", "FT_06": "Shapefile"}
OP = {
    "01": ("OP_01", "Sofort publizierbar",
           "Aggregierte Verbands-/Engagementdaten ohne Personenbezug; regulär publizierbar."),
    "02": ("OP_02", "Nach Aufbereitung publizierbar",
           "Erst nach Anonymisierung/Aggregation publizierbar; Einzelfall- oder Mitgliederdaten zugangsbeschränkt."),
    "03": ("OP_03", "Nur Metadaten publizierbar",
           "Enthält personenbezogene oder schutzbedürftige Daten; nur Metadaten publizierbar."),
}


def procs(name):
    return [
        {"method": "Datenerhebung",
         "description": f"Erfassung der Daten zu {name} durch die zivilgesellschaftliche Organisation."},
        {"method": "Aufbereitung",
         "description": f"Bereinigung, Kategorisierung und Aggregation der Daten zu {name}."},
        {"method": "Qualitätssicherung",
         "description": f"Plausibilitäts- und Konsistenzprüfung der {name} vor der Weitergabe."},
        {"method": "Veröffentlichung und Berichterstattung",
         "description": f"Aufbereitung der {name} für Jahres-, Wirkungs- und Transparenzberichte."},
        {"method": "Analyse und Auswertung",
         "description": f"Auswertung der {name} für Engagement-, Bedarfs- und Wirkungsanalysen."},
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
    # ── bildung-erziehung +9 ──
    "bildungsangebote": [
        ("zsp-bil-kursteilnahmen", "Kursteilnahmen freier Bildungsträger", "Teilnehmerzahlen non-formaler Bildungsangebote freier und gemeinnütziger Träger.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bil-foerdermittel-bildung", "Fördermittel für Bildungsprojekte", "Eingeworbene öffentliche und private Mittel für zivilgesellschaftliche Bildungsprojekte.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bil-ehrenamtliche-bildung", "Ehrenamtliche in der Bildungsarbeit", "Zahl und Einsatzfelder Ehrenamtlicher in non-formalen Bildungsangeboten.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "kinder-jugendhilfe": [
        ("zsp-bil-betreute-jugendliche", "Betreute Kinder und Jugendliche", "Zahl der in freien Trägern der Jugendhilfe betreuten Kinder und Jugendlichen.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-bil-jugendverbandsarbeit", "Jugendverbandsarbeit-Aktivitäten", "Maßnahmen und Reichweite der verbandlichen Jugendarbeit.", "01", "TH_03", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bil-praeventionsprojekte", "Präventionsprojekte für Jugendliche", "Zahl und Themen von Präventions- und Förderprojekten der Jugendhilfe.", "01", "TH_03", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "erwachsenenbildung": [
        ("zsp-bil-politische-bildung", "Angebote politischer Bildung", "Veranstaltungen und Reichweite zivilgesellschaftlicher politischer Bildung.", "01", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bil-alphabetisierung", "Alphabetisierung und Grundbildung", "Teilnahmezahlen an Grundbildungs- und Alphabetisierungskursen freier Träger.", "02", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bil-digitale-teilhabe", "Digitale Teilhabe-Angebote", "Angebote zur Förderung digitaler Kompetenzen benachteiligter Gruppen.", "01", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── freizeit-geselligkeit +3 (2 L3) ──
    "freizeiteinrichtungen": [
        ("zsp-frei-treffpunkt-nutzung", "Nutzung offener Treffpunkte", "Besuchszahlen offener Begegnungs- und Freizeiteinrichtungen.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "ehrenamt-freiwilligenarbeit": [
        ("zsp-frei-freiwilligenstunden", "Geleistete Freiwilligenstunden", "Erfasstes Stundenvolumen ehrenamtlichen Engagements in Freizeitvereinen.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-frei-engagement-motive", "Engagementmotive und -barrieren", "Befragungsdaten zu Motiven und Hürden freiwilligen Engagements.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── soziale-dienste +9 ──
    "beratung-hilfeplanung": [
        ("zsp-soz-beratungsfaelle", "Beratungsfälle nach Anliegen", "Aggregierte Zahl der Beratungskontakte sozialer Dienste nach Themenfeld.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-soz-schuldnerberatung", "Schuldnerberatung-Statistik", "Fallzahlen und Verschuldungsgründe der Schuldner- und Insolvenzberatung.", "02", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-soz-migrationsberatung-faelle", "Migrationsberatung-Fälle", "Beratungskontakte der Migrations- und Flüchtlingssozialarbeit.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "foerderung-finanzierung": [
        ("zsp-soz-zuwendungen-traeger", "Zuwendungen an soziale Träger", "Öffentliche Zuwendungen und Leistungsentgelte an freie Wohlfahrtsträger.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-soz-spendenaufkommen-sozial", "Spendenaufkommen sozialer Dienste", "Spendeneinnahmen und Mittelherkunft sozialer Organisationen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-soz-personalstruktur-sozial", "Personalstruktur sozialer Dienste", "Haupt- und ehrenamtliche Personalstruktur sozialer Einrichtungen.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "monitoring-wirkung": [
        ("zsp-soz-wirkungsindikatoren", "Wirkungsindikatoren sozialer Projekte", "Standardisierte Wirkungskennzahlen geförderter Sozialprojekte.", "01", "TH_03", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-soz-zielgruppenerreichung", "Zielgruppenerreichung", "Daten zur Erreichung definierter Zielgruppen sozialer Angebote.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-soz-bedarfsanalysen", "Soziale Bedarfsanalysen", "Erhebungen zu unversorgten sozialen Bedarfslagen in Regionen.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── umwelt-naturschutz +9 ──
    "umweltmonitoring": [
        ("zsp-umw-artenkartierung", "Ehrenamtliche Artenkartierung", "Von Naturschutzverbänden erhobene Verbreitungsdaten von Arten.", "01", "TH_09", "OB_05", "GR_01", ["FT_05"], "LI_02", 4),
        ("zsp-umw-gewaesserguete-buerger", "Bürger-Gewässergütemessungen", "Von Freiwilligen erhobene Gewässergüte- und Umweltparameter.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 3),
        ("zsp-umw-luftqualitaet-messnetz", "Zivilgesellschaftliches Luftmessnetz", "Von Initiativen betriebene Feinstaub- und Luftqualitätssensoren.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_01", 3),
    ],
    "geodaten-flaechen": [
        ("zsp-umw-schutzgebiete-betreuung", "Betreute Schutzgebiete", "Von Verbänden betreute Naturschutzflächen und Pflegemaßnahmen.", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("zsp-umw-flaechenankauf-naturschutz", "Naturschutz-Flächenankauf", "Durch Stiftungen und Verbände gesicherte Naturschutzflächen.", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("zsp-umw-renaturierungsprojekte", "Renaturierungsprojekte", "Umfang und Lage zivilgesellschaftlicher Renaturierungsvorhaben.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    "kampagnen-mobilisierung": [
        ("zsp-umw-petitionen-umwelt", "Umweltpetitionen und Unterschriften", "Reichweite und Themen zivilgesellschaftlicher Umweltpetitionen.", "01", "TH_06", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-umw-klimademonstrationen", "Klima- und Umweltdemonstrationen", "Teilnehmerzahlen und Orte von Umwelt- und Klimaprotesten.", "01", "TH_06", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-umw-verbandsklagen", "Umweltverbandsklagen", "Eingereichte Verbandsklagen und ihre Verfahrensergebnisse.", "01", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── bevoelkerungs-katastrophenschutz +9 ──
    "katastrophenschutz-notfallhilfe": [
        ("zsp-kat-einsatzzahlen", "Einsatzzahlen der Hilfsorganisationen", "Zahl und Art der Einsätze ehrenamtlicher Katastrophenschutzorganisationen.", "01", "TH_05", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-kat-helferkapazitaeten", "Helfer- und Materialkapazitäten", "Vorgehaltene Einsatzkräfte und Ausstattung im Bevölkerungsschutz.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-kat-uebungen-szenarien", "Übungen und Einsatzszenarien", "Durchgeführte Großübungen und ihre Auswertung.", "01", "TH_05", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "freiwillige-feuerwehr": [
        ("zsp-kat-ff-mitglieder", "Mitglieder der Freiwilligen Feuerwehren", "Zahl aktiver Mitglieder, Jugend- und Altersabteilungen.", "01", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-kat-ff-einsaetze", "Feuerwehreinsätze nach Art", "Einsatzstatistik nach Brand-, Hilfeleistungs- und sonstigen Einsätzen.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-kat-ff-nachwuchs", "Nachwuchsgewinnung Feuerwehr", "Daten zu Jugendfeuerwehr und Mitgliederentwicklung.", "01", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "erste-hilfe-ausbildung": [
        ("zsp-kat-eh-teilnehmer", "Erste-Hilfe-Ausbildungsteilnahmen", "Zahl der in Erste-Hilfe-Kursen ausgebildeten Personen.", "01", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-kat-sanitaetsdienste", "Sanitätsdienste bei Veranstaltungen", "Geleistete Sanitäts- und Betreuungsdienste der Hilfsorganisationen.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-kat-blutspende-aktionen", "Blutspendeaktionen", "Zahl der Spendetermine und Spenden ehrenamtlich organisierter Aktionen.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── gesundheitswesen-zivil +9 ──
    "ambulante-pflege-hospiz": [
        ("zsp-ges-hospizbegleitungen", "Hospiz- und Palliativbegleitungen", "Zahl der durch ehrenamtliche Hospizdienste begleiteten Menschen.", "02", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-ges-pflegeselbsthilfe", "Pflege-Selbsthilfegruppen", "Zahl und Themen pflegebezogener Selbsthilfegruppen.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-ges-ehrenamt-pflege", "Ehrenamt in der Pflege", "Einsatz und Stundenvolumen Ehrenamtlicher in Pflege und Betreuung.", "01", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "gesundheitsaufklaerung": [
        ("zsp-ges-praeventionskampagnen", "Gesundheits-Präventionskampagnen", "Reichweite zivilgesellschaftlicher Aufklärungs- und Präventionskampagnen.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-ges-patientenberatung", "Patientenberatung-Statistik", "Beratungskontakte unabhängiger Patienten- und Gesundheitsberatung.", "02", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-ges-impfaufklaerung", "Impf- und Gesundheitsaufklärung", "Maßnahmen und Reichweite zivilgesellschaftlicher Gesundheitsaufklärung.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "psychische-gesundheit": [
        ("zsp-ges-selbsthilfe-psych", "Selbsthilfegruppen psychische Gesundheit", "Zahl und Themen von Selbsthilfegruppen im Bereich psychische Gesundheit.", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-ges-krisentelefon", "Krisen- und Beratungstelefon-Kontakte", "Aggregierte Kontaktzahlen seelsorgerischer und psychosozialer Hotlines.", "02", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-ges-suchthilfe", "Suchthilfe und -prävention", "Beratungs- und Betreuungszahlen zivilgesellschaftlicher Suchthilfe.", "02", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── sonstiges-zivil +9 (2 L3) ──
    "vereinswesen-strukturen": [
        ("zsp-son-vereinsgruendungen", "Vereinsgründungen und -bestand", "Zahl der Neueintragungen und Bestand im Vereinsregister.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-son-vereinsfinanzen", "Vereinsfinanzen und Einnahmequellen", "Struktur der Einnahmen (Beiträge, Spenden, Zuschüsse) gemeinnütziger Vereine.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-son-gemeinnuetzigkeit", "Gemeinnützigkeitsstatus", "Zahl als gemeinnützig anerkannter Körperschaften nach Zweck.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-son-vorstandsstrukturen", "Vorstands- und Gremienstrukturen", "Daten zu Ehrenamtsstrukturen und Gremienbesetzung in Vereinen.", "01", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "buergerschaftliches-engagement": [
        ("zsp-son-engagementquote", "Engagementquote der Bevölkerung", "Anteil freiwillig engagierter Personen laut Engagementsurveys.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-son-engagement-felder", "Engagement nach Tätigkeitsfeld", "Verteilung des Engagements auf Bereiche wie Sport, Soziales, Kultur.", "01", "TH_03", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-son-engagement-demografie", "Engagement nach Bevölkerungsgruppe", "Engagementbeteiligung nach Alter, Geschlecht und Bildung.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-son-freiwilligendienste", "Freiwilligendienste-Teilnahme", "Zahl der Teilnehmenden an FSJ, FÖJ und Bundesfreiwilligendienst.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-son-zeitspenden-wert", "Monetärer Wert von Zeitspenden", "Geschätzter ökonomischer Wert geleisteter ehrenamtlicher Arbeit.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── wissenschaft-forschung-zivil +9 ──
    "forschungsfoerderung": [
        ("zsp-wis-stiftungsforschung", "Stiftungsfinanzierte Forschung", "Durch zivilgesellschaftliche Stiftungen geförderte Forschungsprojekte.", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wis-thinktank-publikationen", "Thinktank-Publikationen", "Studien und Politikpapiere zivilgesellschaftlicher Denkfabriken.", "01", "TH_05", "OB_02", "GR_02", ["FT_02"], "LI_02", 4),
        ("zsp-wis-buergerforschung-mittel", "Mittel für Bürgerforschung", "Fördervolumen partizipativer und gemeinwohlorientierter Forschung.", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "open-science": [
        ("zsp-wis-offene-daten-ngo", "Offene Daten zivilgesellschaftlicher Organisationen", "Von NGOs veröffentlichte offene Datensätze und ihre Themen.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_01", 4),
        ("zsp-wis-transparenzplattformen", "Transparenz- und Datenplattformen", "Reichweite zivilgesellschaftlicher Transparenz- und Datenportale.", "01", "TH_05", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("zsp-wis-wissensallmende", "Wissensallmende-Projekte", "Beiträge zu offenen Wissensbeständen (z. B. Wikis, offene Bildungsressourcen).", "01", "TH_10", "OB_02", "GR_02", ["FT_02"], "LI_01", 3),
    ],
    "citizen-science-zivil": [
        ("zsp-wis-cs-projekte-ngo", "Citizen-Science-Projekte von NGOs", "Zahl und Themen von NGO-getragenen Bürgerforschungsprojekten.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 3),
        ("zsp-wis-cs-beitragsdaten", "Beiträge freiwilliger Datensammler", "Volumen der von Freiwilligen beigetragenen Beobachtungsdaten.", "01", "TH_09", "OB_05", "GR_01", ["FT_05"], "LI_02", 3),
        ("zsp-wis-cs-bildungswirkung", "Lern- und Beteiligungswirkung", "Daten zur Bildungs- und Beteiligungswirkung von Citizen Science.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── internationale-solidaritaet +9 ──
    "migrationsberatung": [
        ("zsp-int-beratung-gefluechtete", "Beratung Geflüchteter", "Beratungskontakte zu Asyl-, Aufenthalts- und Sozialfragen.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-int-rueckkehrberatung", "Rückkehr- und Perspektivberatung", "Fallzahlen freiwilliger Rückkehr- und Perspektivberatung.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-int-antidiskriminierung", "Antidiskriminierungsberatung", "Gemeldete Diskriminierungsfälle und Beratungskontakte.", "02", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "sprachfoerderung-integration": [
        ("zsp-int-sprachkurse", "Sprachkurs-Teilnahmen", "Teilnahmezahlen ehrenamtlicher und gemeinnütziger Sprachangebote.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-int-integrationsprojekte", "Integrationsprojekte", "Zahl und Reichweite zivilgesellschaftlicher Integrationsprojekte.", "01", "TH_03", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-int-patenschaften", "Integrationspatenschaften", "Zahl ehrenamtlicher Patenschafts- und Mentoringbeziehungen.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "humanitaere-hilfe": [
        ("zsp-int-projektmittel-eza", "Projektmittel der Entwicklungszusammenarbeit", "Eingesetzte Mittel zivilgesellschaftlicher EZA- und Hilfsprojekte.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-int-katastrophenhilfe-ausland", "Internationale Katastrophenhilfe", "Einsätze und Hilfsgüter bei humanitären Auslandseinsätzen.", "01", "TH_05", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-int-spendenverwendung", "Verwendung internationaler Spenden", "Mittelverwendung und Programmkostenquote humanitärer Organisationen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── buerger-verbraucherinteressen +9 ──
    "policy-lobbying": [
        ("zsp-bv-lobbyregister-eintraege", "Lobbyregister-Einträge zivilgesellschaftlicher Akteure", "Im Lobbyregister erfasste Interessenvertretungen und Themen.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-bv-stellungnahmen-gesetze", "Stellungnahmen zu Gesetzgebung", "Eingereichte Stellungnahmen in Konsultations- und Anhörungsverfahren.", "01", "TH_08", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
        ("zsp-bv-kampagnenreichweite", "Kampagnenreichweite", "Reichweite und Mobilisierung politischer Bürgerkampagnen.", "01", "TH_05", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "vernetzung-kooperation": [
        ("zsp-bv-buendnisse-netzwerke", "Bündnisse und Netzwerke", "Zahl und Reichweite zivilgesellschaftlicher Dachverbände und Bündnisse.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bv-kooperationsprojekte", "Sektorübergreifende Kooperationsprojekte", "Gemeinschaftsprojekte mit Verwaltung, Wirtschaft oder Wissenschaft.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bv-beteiligungsverfahren", "Beteiligung an Bürgerverfahren", "Mitwirkung in Bürgerräten und formellen Beteiligungsverfahren.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "verbraucherrechte": [
        ("zsp-bv-verbraucherbeschwerden", "Verbraucherbeschwerden nach Branche", "Aggregierte Beschwerde- und Beratungsfälle der Verbraucherzentralen.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-bv-marktwaechter", "Marktbeobachtung (Marktwächter)", "Daten aus der zivilgesellschaftlichen Marktbeobachtung digitaler und Finanzmärkte.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-bv-musterklagen", "Muster- und Sammelklagen", "Eingereichte Musterfeststellungs- und Verbandsklagen und Betroffenenzahlen.", "01", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── wirtschafts-berufsverb +9 ──
    "berufsverb-standesorg": [
        ("zsp-wbv-kammermitglieder", "Kammer- und Verbandsmitglieder", "Mitgliederzahlen berufsständischer Kammern und Verbände.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wbv-fortbildungspflicht", "Fortbildungsnachweise", "Erfasste Pflichtfortbildungen der Kammermitglieder.", "02", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wbv-berufsordnung-verfahren", "Berufsordnungs- und Aufsichtsverfahren", "Zahl berufsrechtlicher Aufsichts- und Disziplinarverfahren.", "02", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "wirtschaftsverb-konjunktur": [
        ("zsp-wbv-branchenumfragen", "Branchen- und Konjunkturumfragen", "Verbandseigene Umfragedaten zur Geschäftslage der Mitglieder.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-wbv-positionspapiere", "Wirtschaftspolitische Positionspapiere", "Veröffentlichte Positionen und Forderungen der Wirtschaftsverbände.", "01", "TH_04", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
        ("zsp-wbv-aussenwirtschaft", "Außenwirtschaftsdaten der Verbände", "Verbandsdaten zu Export, Märkten und Auslandsgeschäft.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "tarifrunde-arbeitnehmer": [
        ("zsp-wbv-tarifabschluesse", "Tarifabschlüsse nach Branche", "Vereinbarte Entgelt- und Tarifabschlüsse je Branche.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wbv-tarifbindung", "Tarifbindungsquote", "Anteil tarifgebundener Betriebe und Beschäftigter.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wbv-arbeitskampf", "Arbeitskampfmaßnahmen", "Zahl und Ausfalltage von Streiks und Aussperrungen.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── gemeinschaftliche-versorgung +9 ──
    "energiegenossenschaften": [
        ("zsp-gem-eg-anlagen", "Anlagen der Energiegenossenschaften", "Installierte Erzeugungsleistung und Anlagenzahl von Bürgerenergie.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-gem-eg-mitglieder", "Mitglieder und Beteiligungen", "Mitgliederzahlen und Beteiligungssummen der Energiegenossenschaften.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-gem-eg-erzeugung", "Erzeugte Bürgerenergie", "Eingespeiste Strom- und Wärmemengen genossenschaftlicher Anlagen.", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "sozialer-wohnungsbau": [
        ("zsp-gem-wohnprojekte", "Gemeinschaftliche Wohnprojekte", "Zahl und Wohneinheiten genossenschaftlicher und gemeinwohlorientierter Wohnprojekte.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("zsp-gem-mieten-belegung", "Mieten und Belegungsbindung", "Mietniveau und Belegungsbindungen gemeinnütziger Wohnungsbestände.", "02", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-gem-wohnungsbestand-gemeinwohl", "Gemeinwohlorientierter Wohnungsbestand", "Bestand und Entwicklung gemeinwohlorientierter Wohnungen.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "lebensmittelhilfe-tafel": [
        ("zsp-gem-tafel-ausgabestellen", "Tafel-Ausgabestellen", "Zahl und Lage der Lebensmittelausgabestellen der Tafeln.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("zsp-gem-tafel-nutzer", "Nutzer der Lebensmittelhilfe", "Zahl der von Tafeln versorgten Personen nach Gruppen.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-gem-lebensmittelrettung", "Gerettete Lebensmittelmengen", "Über Tafeln und Foodsharing verteilte Lebensmittelmengen.", "01", "TH_06", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── medien-zivil +9 ──
    "buerger-lokalmedien": [
        ("zsp-med-buergermedien-sender", "Bürgermedien und offene Kanäle", "Zahl und Reichweite nichtkommerzieller Bürgerrundfunkangebote.", "01", "TH_04", "OB_06", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-med-lokaljournalismus-projekte", "Gemeinnützige Lokaljournalismus-Projekte", "Zahl und Förderung gemeinnütziger lokaler Medienangebote.", "01", "TH_04", "OB_02", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-med-ehrenamt-redaktionen", "Ehrenamtliche in Bürgermedien", "Zahl ehrenamtlich Mitwirkender in Bürger- und Lokalmedien.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "medienkompetenz": [
        ("zsp-med-medienbildung-projekte", "Medienbildungsprojekte", "Zahl und Reichweite zivilgesellschaftlicher Medienkompetenzprojekte.", "01", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-med-faktencheck-initiativen", "Faktencheck- und Verifikationsinitiativen", "Aktivitäten zivilgesellschaftlicher Faktencheck- und Anti-Desinformationsprojekte.", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-med-senioren-digital", "Digitalkompetenz für Ältere", "Angebote und Teilnahme zur Förderung digitaler Teilhabe Älterer.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "digitale-oeffentlichkeit": [
        ("zsp-med-open-source-projekte", "Zivilgesellschaftliche Open-Source-Projekte", "Zahl und Beteiligung gemeinwohlorientierter Software- und Tech-Projekte.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_01", 3),
        ("zsp-med-digitale-petitionen", "Digitale Petitionen und Beteiligung", "Reichweite digitaler Petitions- und Beteiligungsplattformen.", "01", "TH_05", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-med-plattform-monitoring", "Monitoring digitaler Öffentlichkeit", "Zivilgesellschaftliche Beobachtung von Desinformation und Plattformverhalten.", "02", "TH_04", "OB_08", "GR_02", ["FT_02"], "LI_03", 3),
    ],
    # ── wohlfahrtsverbaende +9 ──
    "sozialstatistik-wohlfahrt": [
        ("zsp-wohl-einrichtungen-dienste", "Einrichtungen und Dienste", "Zahl der Einrichtungen und Dienste der Freien Wohlfahrtspflege (Gesamtstatistik).", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-wohl-beschaeftigte", "Beschäftigte der Wohlfahrtspflege", "Haupt- und ehrenamtliche Beschäftigte der Spitzenverbände.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wohl-plaetze-kapazitaeten", "Plätze und Versorgungskapazitäten", "Vorgehaltene Betreuungs- und Versorgungsplätze nach Hilfeart.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "versorgungsleistungen-wohlfahrt": [
        ("zsp-wohl-leistungsfaelle", "Leistungsfälle nach Hilfeart", "Zahl der betreuten Fälle nach Bereich (Pflege, Behindertenhilfe, Jugendhilfe).", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-wohl-migrationsdienste", "Migrations- und Beratungsdienste", "Beratungs- und Betreuungszahlen der Migrations- und Sozialdienste.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wohl-quartiersarbeit", "Quartiers- und Gemeinwesenarbeit", "Projekte und Reichweite sozialraumorientierter Wohlfahrtsarbeit.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "fundraising-finanzen-wohlfahrt": [
        ("zsp-wohl-finanzierungsquellen", "Finanzierungsquellen der Wohlfahrt", "Struktur der Einnahmen (Leistungsentgelte, Zuwendungen, Spenden).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-wohl-spendeneinnahmen", "Spendeneinnahmen der Verbände", "Spendenaufkommen und Mittelherkunft der Wohlfahrtsverbände.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-wohl-mittelverwendung", "Mittelverwendung und Programmkosten", "Verwendung der Mittel und Verwaltungs-/Programmkostenquote.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── stiftungen +9 ──
    "foerderstatistik-stiftungen": [
        ("zsp-stif-foerdervolumen", "Stiftungs-Fördervolumen nach Zweck", "Ausgeschüttete Fördermittel nach Stiftungszweck.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-stif-foerderbereiche", "Förderbereiche und Schwerpunkte", "Verteilung der Förderung auf Themenfelder (Bildung, Soziales, Kultur).", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-stif-vergabeverfahren", "Vergabeverfahren und Antragszahlen", "Antrags- und Bewilligungszahlen der Stiftungsförderung.", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "wirkungsberichte-stiftungen": [
        ("zsp-stif-wirkungsindikatoren", "Wirkungsindikatoren der Stiftungsarbeit", "Berichtete Wirkungskennzahlen geförderter Projekte.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-stif-projektreichweite", "Projektreichweite und Begünstigte", "Zahl der erreichten Begünstigten von Stiftungsprojekten.", "02", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-stif-transparenzberichte", "Transparenz- und Rechenschaftsberichte", "Veröffentlichte Transparenzangaben nach gängigen Standards.", "01", "TH_05", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "stiftungsregister-struktur": [
        ("zsp-stif-bestand-rechtsform", "Stiftungsbestand nach Rechtsform", "Zahl rechtsfähiger und Treuhandstiftungen nach Bundesland.", "01", "TH_08", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-stif-neuerrichtungen", "Stiftungsneuerrichtungen", "Jährliche Zahl neu errichteter Stiftungen und Stiftungskapital.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-stif-vermoegen", "Stiftungsvermögen und -kapital", "Aggregiertes Stiftungsvermögen und Kapitalausstattung.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── gewerkschaften +9 ──
    "gewerkschaften-mitglieder-struktur": [
        ("zsp-gew-mitgliederentwicklung", "Mitgliederentwicklung der Gewerkschaften", "Mitgliederzahlen und -entwicklung der Einzelgewerkschaften (z. B. DGB).", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-gew-organisationsgrad", "Gewerkschaftlicher Organisationsgrad", "Anteil gewerkschaftlich organisierter Beschäftigter nach Branche.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-gew-mitglieder-demografie", "Mitgliederstruktur nach Gruppen", "Verteilung der Mitglieder nach Alter, Geschlecht und Branche.", "02", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "gewerkschaften-tarif-arbeitskampf": [
        ("zsp-gew-tarifvertraege", "Abgeschlossene Tarifverträge", "Zahl und Geltungsbereich abgeschlossener Tarifverträge.", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-gew-streiktage", "Streik- und Ausfalltage", "Zahl der Arbeitskämpfe und ausgefallenen Arbeitstage.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-gew-entgeltforderungen", "Entgeltforderungen und Abschlüsse", "Geforderte und erzielte Entgeltsteigerungen in Tarifrunden.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "gewerkschaften-beratung-soziales": [
        ("zsp-gew-rechtsberatung", "Gewerkschaftliche Rechtsberatung", "Fallzahlen arbeits- und sozialrechtlicher Beratung der Mitglieder.", "02", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-gew-bildungsangebote", "Gewerkschaftliche Bildungsarbeit", "Teilnahmezahlen gewerkschaftlicher Bildungs- und Seminarangebote.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-gew-mitbestimmung", "Betriebsrats- und Mitbestimmungsdaten", "Daten zu Betriebsratswahlen und Mitbestimmungsgremien.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── genossenschaften +9 ──
    "genossenschaften-register-struktur": [
        ("zsp-genos-bestand-sparten", "Genossenschaftsbestand nach Sparte", "Zahl der Genossenschaften nach Wirtschaftssparte.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-genos-neugruendungen", "Genossenschafts-Neugründungen", "Jährliche Zahl neu gegründeter Genossenschaften.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-genos-mitglieder", "Mitglieder der Genossenschaften", "Aggregierte Mitgliederzahlen nach Genossenschaftstyp.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "genossenschaften-wirtschaftsdaten": [
        ("zsp-genos-umsatz-bilanz", "Umsatz- und Bilanzdaten", "Aggregierte Wirtschaftskennzahlen genossenschaftlicher Unternehmen.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-genos-beschaeftigung", "Beschäftigung in Genossenschaften", "Zahl der Beschäftigten genossenschaftlicher Unternehmen.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-genos-foerderbilanz", "Mitgliederförderbilanz", "Daten zur satzungsgemäßen Förderung der Mitglieder.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "genossenschaften-sektoren-leistungen": [
        ("zsp-genos-wohnungsgenossenschaften", "Wohnungsgenossenschaften", "Wohnungsbestand und Mitglieder der Wohnungsgenossenschaften.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("zsp-genos-agrar-genossenschaften", "Agrar- und Ländliche Genossenschaften", "Wirtschaftsdaten landwirtschaftlicher und ländlicher Genossenschaften.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-genos-sozialgenossenschaften", "Sozial- und Pflegegenossenschaften", "Zahl und Leistungen sozial- und gesundheitswirtschaftlicher Genossenschaften.", "01", "TH_03", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── politische-parteien +9 ──
    "parteien-finanzen-rechenschaft": [
        ("zsp-par-rechenschaftsberichte", "Parteien-Rechenschaftsberichte", "Einnahmen und Ausgaben der Parteien aus den Rechenschaftsberichten.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("zsp-par-grossspenden", "Großspenden an Parteien", "Veröffentlichungspflichtige Großspenden nach Partei und Geber.", "01", "TH_07", "OB_03", "GR_01", ["FT_01"], "LI_03", 4),
        ("zsp-par-staatliche-mittel", "Staatliche Parteienfinanzierung", "Verteilung der staatlichen Teilfinanzierung auf die Parteien.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "parteien-mitglieder-organisation": [
        ("zsp-par-mitgliederzahlen", "Mitgliederzahlen der Parteien", "Mitgliederbestand und -entwicklung der Parteien.", "01", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-par-mitglieder-demografie", "Mitgliederstruktur nach Gruppen", "Alters- und Geschlechterstruktur der Parteimitglieder.", "02", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("zsp-par-gliederungen", "Parteigliederungen und Verbände", "Zahl der Orts-, Kreis- und Landesverbände.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "parteien-wahlen-mandate": [
        ("zsp-par-wahlergebnisse", "Wahlergebnisse der Parteien", "Stimmenanteile der Parteien bei Wahlen nach Ebene.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("zsp-par-mandatsverteilung", "Mandatsverteilung", "Verteilung der Mandate in Parlamenten und Vertretungen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("zsp-par-kandidaturen", "Kandidaturen und Aufstellungen", "Zahl und Struktur aufgestellter Wahlkandidatinnen und -kandidaten.", "01", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
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
