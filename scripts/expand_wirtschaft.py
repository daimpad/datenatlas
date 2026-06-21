#!/usr/bin/env python3
"""Sprint S-P (Teil 6): sector_wirtschaft.json — alle 23 L2 auf 69 L4 (+206)."""
import json

PATH = '/home/user/datenatlas/public/data/sector_wirtschaft.json'
C = "#ca6f1e"  # wirtschaft L4 color

FT = {"FT_01": "CSV", "FT_02": "JSON", "FT_03": "NetCDF / HDF5",
      "FT_04": "XML", "FT_05": "GeoJSON", "FT_06": "Shapefile"}
OP = {
    "01": ("OP_01", "Sofort publizierbar",
           "Aggregierte Wirtschafts-/Branchenstatistik ohne Personenbezug; regulär publizierbar."),
    "02": ("OP_02", "Nach Aufbereitung publizierbar",
           "Erst nach Aggregation/Anonymisierung publizierbar; Einzelunternehmens- oder Mikrodaten zugangsbeschränkt."),
    "03": ("OP_03", "Nur Metadaten publizierbar",
           "Enthält personenbezogene oder vertrauliche Geschäftsdaten; nur Metadaten publizierbar."),
}


def procs(name):
    return [
        {"method": "Datenerhebung",
         "description": f"Erhebung der Primärdaten zu {name} aus betrieblichen bzw. amtlichen Quellsystemen."},
        {"method": "Aufbereitung",
         "description": f"Bereinigung, Klassifikation und Aggregation der Daten zu {name}."},
        {"method": "Qualitätssicherung",
         "description": f"Plausibilitäts- und Konsistenzprüfung der {name} vor der Freigabe."},
        {"method": "Veröffentlichung und Berichterstattung",
         "description": f"Aufbereitung der {name} für Geschäfts-, Branchen- und amtliche Berichte."},
        {"method": "Analyse und Auswertung",
         "description": f"Markt-, Wettbewerbs- und Konjunkturanalysen auf Basis der {name}."},
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
    # ── einzelhandel +9 (4 L3) ──
    "kundenbeziehungen": [
        ("wip-eh-kundenbindung-programme", "Kundenbindungsprogramm-Daten", "Aggregierte Nutzungsdaten von Bonus- und Loyalitätsprogrammen im Handel.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-eh-kundenzufriedenheit", "Kundenzufriedenheitsmessungen", "Befragungsbasierte Zufriedenheits- und NPS-Werte im Einzelhandel.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "lager_logistik": [
        ("wip-eh-lagerbestand-umschlag", "Lagerbestand und Umschlagshäufigkeit", "Bestands- und Umschlagskennzahlen der Handelslogistik.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-eh-retourenquote", "Retourenquoten", "Rücksendequoten nach Warengruppe im (Online-)Handel.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "verkauf_marketing": [
        ("wip-eh-umsatz-warengruppen", "Einzelhandelsumsatz nach Warengruppe", "Umsatzentwicklung des Einzelhandels nach Sortiment (Destatis).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-eh-online-anteil", "Online-Umsatzanteil", "Anteil des E-Commerce am Einzelhandelsumsatz (HDE/bevh).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-eh-werbeaktionen-wirkung", "Werbeaktions-Wirkung", "Absatzeffekte von Promotions und Rabattaktionen.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "filialmanagement": [
        ("wip-eh-flaechenproduktivitaet", "Flächenproduktivität", "Umsatz je Quadratmeter Verkaufsfläche nach Betriebsform.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-eh-standortnetz", "Filial- und Standortnetz", "Zahl und Lage der Filialstandorte nach Region.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # ── finanzdienstleister +9 ──
    "konten_verwaltung": [
        ("wip-fin-kontostruktur", "Kontostruktur und -bestände", "Aggregierte Zahl und Art geführter Giro- und Sparkonten.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-fin-zahlungsverkehr-volumen", "Zahlungsverkehrsvolumen", "Volumen bargeldloser Transaktionen nach Zahlungsart (Bundesbank).", "01", "TH_07", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-fin-digital-banking-nutzung", "Digital-Banking-Nutzung", "Nutzungsgrad von Online- und Mobile-Banking.", "02", "TH_07", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "versicherungswirtschaft": [
        ("wip-fin-versicherungsbeitraege", "Versicherungsbeitragseinnahmen", "Gebuchte Bruttobeiträge nach Versicherungssparte (GDV).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-fin-schadenquote", "Schaden-Kosten-Quote", "Schaden- und Kostenquoten der Versicherer nach Sparte.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-fin-versicherungsdichte", "Versicherungsdichte und -durchdringung", "Beiträge je Einwohner und Beitragsanteil am BIP.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "kapitalmarkt-wertpapiere": [
        ("wip-fin-handelsvolumen-boersen", "Börsenhandelsvolumen", "Umsätze an deutschen Wertpapierbörsen nach Segment.", "01", "TH_07", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-fin-fondsvermoegen", "Verwaltetes Fondsvermögen", "Volumen verwalteter Investmentfonds nach Anlageklasse (BVI).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-fin-emissionen-anleihen", "Anleihe- und Aktienemissionen", "Emissionsvolumen am Primärmarkt nach Wertpapierart.", "01", "TH_07", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── personalwesen +9 ──
    "mitarbeiterdaten": [
        ("wip-pw-beschaeftigtenstruktur", "Beschäftigtenstruktur der Unternehmen", "Aggregierte Personalstruktur nach Qualifikation und Vertragsart.", "02", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pw-fluktuationsrate", "Fluktuations- und Verweildauer", "Personalfluktuation und Betriebszugehörigkeit nach Branche.", "02", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pw-weiterbildung-betrieb", "Betriebliche Weiterbildung", "Teilnahme und Investitionen in betriebliche Weiterbildung.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "arbeitsmarkt_reporting": [
        ("wip-pw-offene-stellen", "Offene Stellen und Vakanzen", "Gemeldete und ungemeldete offene Stellen nach Branche (IAB).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-pw-entgeltstatistik", "Entgelt- und Lohnstatistik", "Bruttoverdienste nach Branche, Qualifikation und Region.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pw-fachkraefteengpass", "Fachkräfteengpass-Indikatoren", "Engpassindikatoren nach Beruf und Region (BA-Engpassanalyse).", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "aussenhandel-export": [
        ("wip-pw-exportquote-branchen", "Exportquoten nach Branche", "Anteil des Auslandsumsatzes nach Wirtschaftszweig (Destatis).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-pw-handelspartner", "Wichtigste Handelspartner", "Aus- und Einfuhren nach Partnerländern.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pw-auslandsinvestitionen", "Ausländische Direktinvestitionen", "Bestand und Ströme deutscher Direktinvestitionen im Ausland (Bundesbank).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── immobilienwirtschaft +9 (2 L3) ──
    "objektverwaltung": [
        ("wip-immo-leerstandsquote", "Leerstandsquoten", "Leerstandsraten bei Wohn- und Gewerbeimmobilien nach Region.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("wip-immo-bewirtschaftungskosten", "Bewirtschaftungskosten", "Betriebs- und Instandhaltungskosten verwalteter Bestände.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-immo-energieausweise", "Energieausweis-Kennwerte", "Energetische Kennwerte des verwalteten Gebäudebestands.", "02", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-immo-bestandsstruktur", "Bestandsstruktur der Verwalter", "Größe und Zusammensetzung verwalteter Immobilienportfolios.", "02", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "marktdaten": [
        ("wip-immo-kaufpreise-wohnen", "Kaufpreise Wohnimmobilien", "Transaktionspreise für Wohnimmobilien nach Lage (Gutachterausschüsse).", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 5),
        ("wip-immo-mieten-spiegel", "Angebotsmieten und Mietspiegel", "Mietniveau und Mietentwicklung nach Region.", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-immo-gewerbe-renditen", "Gewerbeimmobilien-Renditen", "Spitzen- und Durchschnittsrenditen gewerblicher Objekte.", "02", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_04", 3),
        ("wip-immo-transaktionsvolumen", "Immobilien-Transaktionsvolumen", "Volumen der Immobilientransaktionen nach Assetklasse.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-immo-bautaetigkeit", "Bautätigkeit und Fertigstellungen", "Baugenehmigungen und fertiggestellte Wohnungen nach Region.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # ── private-bildungstraeger +9 (2 L3) ──
    "privatschulen": [
        ("wip-pbt-privatschulen-bestand", "Privatschulen-Bestand", "Zahl und Schülerzahl von Schulen in freier Trägerschaft (Destatis).", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-pbt-schulgeld", "Schulgeld und Finanzierung", "Schulgeldstrukturen und Finanzierungsmix privater Schulen.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pbt-abschlussquoten-privat", "Abschlussquoten Privatschulen", "Abschluss- und Übergangsquoten an Privatschulen.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pbt-paedagogische-konzepte", "Pädagogische Konzepte", "Verteilung reformpädagogischer und konfessioneller Konzepte.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pbt-internationale-schulen", "Internationale Schulen", "Zahl und Profile internationaler Schulen in Deutschland.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "nachhilfe-tutoring": [
        ("wip-pbt-nachhilfemarkt-umsatz", "Nachhilfemarkt-Umsatz", "Marktvolumen kommerzieller Nachhilfe in Deutschland.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pbt-online-tutoring", "Online-Tutoring-Nutzung", "Nutzungszahlen digitaler Lern- und Nachhilfeplattformen.", "02", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pbt-nachfrage-faecher", "Nachfrage nach Fächern", "Verteilung der Nachhilfenachfrage auf Fächer und Klassenstufen.", "02", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-pbt-anbieterstruktur", "Anbieterstruktur Nachhilfe", "Markt- und Anbieterstruktur (Ketten, Einzelanbieter, Plattformen).", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── industrie-verarbeitendes-gewerbe +9 ──
    "automobilindustrie": [
        ("wip-ind-fzg-produktion", "Fahrzeugproduktion (Industrie)", "Produktionszahlen der Automobilindustrie nach Segment (VDA).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-ind-elektromobilitaet-anteil", "Elektromobilitäts-Anteil", "Anteil elektrifizierter Antriebe an Produktion und Zulassung.", "01", "TH_06", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-ind-automotive-beschaeftigung", "Beschäftigung Automotive", "Beschäftigtenzahlen der Automobil- und Zulieferindustrie.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "maschinenbau-anlagen": [
        ("wip-ind-maschinenbau-auftraege", "Maschinenbau-Auftragseingang", "Auftragseingangsindex des Maschinen- und Anlagenbaus (VDMA).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-ind-maschinenbau-export", "Maschinenbau-Export", "Ausfuhren des Maschinenbaus nach Produktgruppe und Land.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-ind-kapazitaetsauslastung", "Kapazitätsauslastung", "Auslastung der Produktionskapazitäten im verarbeitenden Gewerbe.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "chemie-pharma-industrie": [
        ("wip-ind-chemie-produktionsindex", "Chemie-Produktionsindex", "Produktionsentwicklung der chemisch-pharmazeutischen Industrie.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-ind-chemie-energiekosten", "Energiekosten der Industrie", "Energiekostenanteil energieintensiver Industriezweige.", "02", "TH_06", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-ind-industrie-investitionen", "Industrie-Investitionen", "Investitionen des verarbeitenden Gewerbes nach Zweck.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── ikt-digitalwirtschaft +9 ──
    "it-software-unternehmen": [
        ("wip-ikt-software-umsatz", "Software- und IT-Service-Umsatz", "Umsatz der IT- und Softwarebranche nach Segment (Bitkom).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-ikt-it-beschaeftigung", "IT-Beschäftigung und offene Stellen", "Beschäftigte und Vakanzen im IT-Sektor.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-ikt-cloud-adoption", "Cloud-Adoption der Wirtschaft", "Nutzungsgrad von Cloud-Diensten in Unternehmen.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "telekommunikation": [
        ("wip-ikt-breitband-anschluesse", "Breitbandanschlüsse", "Zahl und Bandbreite der Festnetz-Breitbandanschlüsse (BNetzA).", "01", "TH_10", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-ikt-mobilfunk-versorgung", "Mobilfunkversorgung", "Netzabdeckung und Mobilfunkverträge nach Technologie.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("wip-ikt-datenvolumen", "Übertragenes Datenvolumen", "Entwicklung des Daten- und Sprachvolumens in den Netzen.", "01", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "ecommerce-plattformen": [
        ("wip-ikt-ecommerce-umsatz", "E-Commerce-Umsatz", "Umsatzentwicklung des Online-Handels nach Warengruppe (bevh).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-ikt-marktplatz-haendler", "Marktplatz-Händlerzahlen", "Zahl der über Plattformen verkaufenden Händler.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-ikt-zahlungsarten-online", "Online-Zahlungsarten", "Verteilung der genutzten Bezahlverfahren im E-Commerce.", "01", "TH_07", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── verkehr-logistik-privat +9 ──
    "gueterverkehr-speditionen": [
        ("wip-vl-gueterverkehrsleistung", "Güterverkehrsleistung", "Transportleistung nach Verkehrsträger (Destatis/BAG).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-vl-frachtraten", "Frachtraten und Transportpreise", "Preisindizes für Güterverkehr und Logistikdienstleistungen.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-vl-lkw-maut-fahrleistung", "Lkw-Maut-Fahrleistung", "Mautpflichtige Fahrleistung als Konjunkturindikator.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "luftfahrt-schifffahrt": [
        ("wip-vl-luftfracht-aufkommen", "Luftfrachtaufkommen", "Umgeschlagene Luftfracht an deutschen Flughäfen.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-vl-passagieraufkommen-luft", "Passagieraufkommen Luftverkehr", "Fluggastzahlen nach Flughafen und Verkehrsart (ADV).", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-vl-binnenschifffahrt", "Binnenschifffahrt-Gütermengen", "Beförderte Gütermengen der Binnenschifffahrt nach Wasserstraße.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "personenverkehr-privat": [
        ("wip-vl-fernbus-markt", "Fernbusmarkt-Daten", "Fahrgastzahlen und Liniennetz des Fernbusverkehrs.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-vl-carsharing-nutzung", "Carsharing-Nutzung", "Zahl der Fahrzeuge und Nutzer im Carsharing (BCS).", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-vl-mobilitaetsdienste-app", "App-basierte Mobilitätsdienste", "Nutzung von Ride-Hailing und Mikromobilitätsdiensten.", "02", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_04", 3),
    ],
    # ── baugewerbe +9 ──
    "hochbau-wohnungsbau": [
        ("wip-bau-baugenehmigungen-wohnen", "Baugenehmigungen Wohnungsbau", "Erteilte Baugenehmigungen für Wohngebäude (Destatis).", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("wip-bau-baufertigstellungen", "Baufertigstellungen", "Fertiggestellte Wohnungen und Nutzflächen nach Region.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-bau-baupreise-wohnen", "Baupreisindex Wohnungsbau", "Entwicklung der Baupreise im Wohnungsbau.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "tiefbau-infrastrukturbau": [
        ("wip-bau-tiefbau-auftraege", "Tiefbau-Auftragseingang", "Auftragseingang im Tief- und Infrastrukturbau.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bau-oeffentliche-bauinvest", "Öffentliche Bauinvestitionen", "Investitionen der öffentlichen Hand in Bauinfrastruktur.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-bau-strassenbau-volumen", "Straßen- und Verkehrswegebau", "Bauvolumen im Straßen- und Verkehrswegebau.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "bau-konjunktur": [
        ("wip-bau-auftragsbestand", "Auftragsbestand Bauhauptgewerbe", "Reichweite des Auftragsbestands im Bauhauptgewerbe.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bau-beschaeftigung", "Beschäftigung im Baugewerbe", "Beschäftigtenzahlen und Arbeitsstunden im Bau.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bau-materialpreise", "Baumaterialpreise", "Preisentwicklung wichtiger Baustoffe.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── landwirtschaft-ernaehrung +9 ──
    "landwirtschaftliche-betriebe": [
        ("wip-lw-betriebsstrukturen", "Landwirtschaftliche Betriebsstrukturen", "Zahl, Größe und Rechtsform landwirtschaftlicher Betriebe (Agrarstrukturerhebung).", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-lw-anbauflaechen", "Anbauflächen nach Kultur", "Flächennutzung nach Fruchtarten und Region.", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-lw-tierbestaende", "Tierbestände", "Bestände der Nutztierhaltung nach Art und Region.", "01", "TH_09", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "lebensmittelverarbeitung": [
        ("wip-lw-ernaehrungsindustrie-umsatz", "Ernährungsindustrie-Umsatz", "Umsatz und Produktion der Lebensmittelindustrie (BVE).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-lw-lebensmittelsicherheit", "Lebensmittelsicherheits-Kontrollen", "Ergebnisse amtlicher Lebensmittelüberwachung.", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-lw-bio-marktanteil", "Bio-Lebensmittel-Marktanteil", "Umsatz und Marktanteil ökologischer Lebensmittel.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "agrarmaerkte-preise": [
        ("wip-lw-erzeugerpreise", "Agrar-Erzeugerpreise", "Erzeugerpreise für pflanzliche und tierische Produkte.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-lw-agrarexport", "Agrar- und Lebensmittelexport", "Aus- und Einfuhren von Agrargütern nach Produkt und Land.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-lw-pachtpreise", "Pacht- und Bodenpreise", "Pachtentgelte und Kaufwerte landwirtschaftlicher Flächen.", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── gastgewerbe-tourismus +9 ──
    "beherbergungsgewerbe": [
        ("wip-gt-uebernachtungen", "Übernachtungen und Auslastung", "Gästeübernachtungen und Bettenauslastung nach Region (Destatis).", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-gt-betriebe-kapazitaet", "Beherbergungsbetriebe und Kapazität", "Zahl der Betriebe und angebotenen Schlafgelegenheiten.", "01", "TH_04", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-gt-zimmerpreise", "Zimmerpreise und RevPAR", "Durchschnittliche Zimmerpreise und Erlöskennzahlen der Hotellerie.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "gastronomie-markt": [
        ("wip-gt-gastronomie-umsatz", "Gastronomie-Umsatz", "Umsatzentwicklung der Gastronomie real und nominal (Dehoga).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-gt-betriebsformen", "Betriebsformen der Gastronomie", "Verteilung nach Restaurants, Cafés, Lieferdiensten.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-gt-lieferdienste-markt", "Lieferdienst- und Außer-Haus-Markt", "Marktvolumen von Liefer- und Außer-Haus-Verpflegung.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "tourismus-reisewirtschaft": [
        ("wip-gt-reiseintensitaet", "Reiseintensität und -ausgaben", "Reisehäufigkeit und Ausgaben der Bevölkerung (Reiseanalyse).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-gt-incoming-tourismus", "Incoming-Tourismus", "Ankünfte und Ausgaben ausländischer Gäste (GNTB).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-gt-reiseveranstalter-umsatz", "Reiseveranstalter- und Vermittlerumsatz", "Umsätze des Veranstalter- und Reisevermittlungsmarktes (DRV).", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    # ── energiewirtschaft-privat +9 ──
    "stromerzeugung-handel": [
        ("wip-en-stromerzeugung-traeger", "Stromerzeugung nach Energieträger", "Erzeugte Strommengen nach Energieträger (AGEB/SMARD).", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_02", 4),
        ("wip-en-grosshandelspreise-strom", "Strom-Großhandelspreise", "Börsenpreise für Strom am Spot- und Terminmarkt.", "01", "TH_07", "OB_07", "GR_01", ["FT_01"], "LI_02", 4),
        ("wip-en-kraftwerkspark", "Kraftwerkspark und Leistung", "Installierte Kraftwerksleistung nach Typ und Standort.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "erneuerbare-energien-markt": [
        ("wip-en-ee-zubau", "Zubau erneuerbarer Anlagen", "Jährlicher Zubau von PV-, Wind- und Bioenergieanlagen (Marktstammdatenregister).", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 4),
        ("wip-en-ee-anteil-strommix", "EE-Anteil am Strommix", "Anteil erneuerbarer Energien am Bruttostromverbrauch.", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_02", 4),
        ("wip-en-eeg-verguetung", "EEG-Vergütungen und Förderung", "Ausgezahlte Förderungen und Ausschreibungsergebnisse.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "gasversorgung-privat": [
        ("wip-en-gasverbrauch", "Gasverbrauch nach Sektor", "Erdgasverbrauch nach Verbrauchergruppe.", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-en-gasspeicher-fuellstand", "Gasspeicher-Füllstände", "Füllstände der Erdgasspeicher im Zeitverlauf.", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_02", 4),
        ("wip-en-gaspreise-endkunden", "Gaspreise für Endkunden", "Preisentwicklung für Haushalts- und Gewerbekunden.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── handwerk +9 (2 L3) ──
    "handwerk-struktur-betriebe": [
        ("wip-hw-betriebsbestand", "Handwerksbetriebs-Bestand", "Zahl der Handwerksbetriebe nach Gewerk und Region (ZDH).", "01", "TH_04", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-hw-beschaeftigte", "Beschäftigte im Handwerk", "Beschäftigtenzahlen des Handwerks nach Gewerksgruppe.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-hw-ausbildung", "Ausbildung im Handwerk", "Zahl der Auszubildenden und Ausbildungsbetriebe.", "01", "TH_02", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-hw-meisterpruefungen", "Meisterprüfungen", "Zahl bestandener Meisterprüfungen nach Gewerk.", "01", "TH_02", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "handwerk-konjunktur": [
        ("wip-hw-umsatz", "Handwerksumsatz", "Umsatzentwicklung des Handwerks nach Gewerksgruppe.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-hw-geschaeftsklima", "Handwerks-Geschäftsklima", "Konjunkturindikatoren aus Handwerksumfragen.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-hw-auftragsreichweite", "Auftragsreichweite", "Durchschnittliche Auftragsreichweite in Wochen.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-hw-preisentwicklung", "Preisentwicklung im Handwerk", "Entwicklung der Angebotspreise nach Gewerk.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-hw-nachfolge", "Betriebsnachfolge im Handwerk", "Daten zur Nachfolgesituation in Handwerksbetrieben.", "02", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── versicherungswirtschaft (L2) +9 ──
    "krankenversicherung": [
        ("wip-vers-pkv-versicherte", "PKV-Versichertenbestand", "Zahl der Voll- und Zusatzversicherten der privaten Krankenversicherung (PKV-Verband).", "01", "TH_01", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-vers-pkv-leistungen", "PKV-Leistungsausgaben", "Versicherungsleistungen der PKV nach Leistungsart.", "02", "TH_01", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-vers-zusatzversicherung", "Zusatzversicherungs-Markt", "Bestand und Beiträge privater Krankenzusatzversicherungen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "lebensversicherung": [
        ("wip-vers-lv-bestand", "Lebensversicherungs-Bestand", "Vertragsbestand und Versicherungssumme der Lebensversicherer.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-vers-lv-ueberschuss", "Überschussbeteiligung", "Laufende Verzinsung und Überschussbeteiligung der LV.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-vers-altersvorsorge-produkte", "Private Altersvorsorge-Produkte", "Bestand geförderter und ungeförderter Vorsorgeverträge.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "sachversicherung": [
        ("wip-vers-sach-beitraege", "Schaden-/Unfallversicherung Beiträge", "Beitragseinnahmen der Schaden- und Unfallversicherung nach Sparte.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-vers-elementarschaeden", "Elementarschaden-Statistik", "Versicherte Schäden durch Naturgefahren (GDV Naturgefahrenreport).", "01", "TH_06", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-vers-kfz-versicherung", "Kfz-Versicherungsmarkt", "Beiträge, Schäden und Vertragszahlen der Kfz-Versicherung.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── unternehmensdienstleistungen +9 ──
    "wirtschaftspruefung-beratung": [
        ("wip-uds-wp-markt", "Wirtschaftsprüfungs-Markt", "Umsatz und Mandatsstruktur der Wirtschaftsprüfung.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-uds-unternehmensberatung-umsatz", "Unternehmensberatungs-Umsatz", "Marktvolumen der Unternehmensberatung nach Beratungsfeld (BDU).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-uds-beratungsfelder", "Beratungsfelder und Nachfrage", "Nachfrageschwerpunkte (Strategie, IT, HR, Restrukturierung).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "marktforschung": [
        ("wip-uds-marktforschung-umsatz", "Marktforschungs-Umsatz", "Branchenumsatz der Markt- und Sozialforschung (ADM).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-uds-methoden-anteile", "Erhebungsmethoden-Anteile", "Verteilung auf Online-, Telefon- und persönliche Befragungen.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-uds-datenanalytik-services", "Datenanalytik- und Insights-Services", "Markt für datengetriebene Analyse- und Insights-Dienste.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "rechts-steuerberatung": [
        ("wip-uds-steuerberatung-markt", "Steuerberatungs-Markt", "Zahl der Praxen und Umsatz der Steuerberatung.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-uds-rechtsberatung-markt", "Rechtsberatungs-Markt", "Marktstruktur und Umsatz der anwaltlichen Rechtsberatung.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-uds-legaltech-nutzung", "Legal-Tech-Nutzung", "Verbreitung digitaler Rechts- und Steuerberatungslösungen.", "01", "TH_10", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── pharmaindustrie +8 ──
    "arzneimittelzulassung": [
        ("wip-pha-zulassungen", "Arzneimittelzulassungen", "Zahl neu zugelassener Arzneimittel nach Wirkstoffklasse (BfArM/EMA).", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-pha-orphan-drugs", "Orphan-Drug-Zulassungen", "Zulassungen für Arzneimittel gegen seltene Erkrankungen.", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pha-arzneimittelpreise", "Arzneimittelpreise und Erstattung", "Erstattungsbeträge und Preisentwicklung neuer Arzneimittel (AMNOG).", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "klinische-studien": [
        ("wip-pha-studienanzahl", "Klinische Studien (Industrie)", "Zahl industriegesponserter klinischer Studien nach Phase.", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-pha-studienstandorte", "Studienstandorte Deutschland", "Verteilung klinischer Prüfzentren nach Region.", "01", "TH_01", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-pha-fue-investitionen", "Pharma-F&E-Investitionen", "Forschungs- und Entwicklungsausgaben der Pharmaindustrie (vfa).", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "medizintechnik": [
        ("wip-pha-medtech-umsatz", "Medizintechnik-Umsatz", "Umsatz und Export der Medizintechnikbranche (BVMed).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-pha-medtech-zulassung", "Medizinprodukte-Zertifizierungen", "Zertifizierungen nach Medizinprodukteverordnung (MDR).", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── automobilindustrie (L2) +9 ──
    "fahrzeugproduktion-statistik": [
        ("wip-auto-pkw-produktion", "Pkw-Produktion", "Inländische Pkw-Produktion nach Hersteller und Segment (VDA/KBA).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-auto-nutzfahrzeug-produktion", "Nutzfahrzeug-Produktion", "Produktion von Lkw, Bussen und Transportern.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-auto-produktionsstandorte", "Produktionsstandorte", "Lage und Kapazität der Fahrzeugwerke in Deutschland.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "kfz-zulassungen-markt": [
        ("wip-auto-neuzulassungen", "Pkw-Neuzulassungen", "Neuzulassungen nach Antriebsart und Marke (KBA).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-auto-bestand-fahrzeuge", "Fahrzeugbestand", "Bestand zugelassener Kraftfahrzeuge nach Merkmalen.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-auto-gebrauchtwagenmarkt", "Gebrauchtwagenmarkt", "Besitzumschreibungen und Preise im Gebrauchtwagenmarkt.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "lieferketten-zulieferer": [
        ("wip-auto-zulieferer-umsatz", "Automobilzulieferer-Umsatz", "Umsatz und Wertschöpfungsanteil der Zulieferindustrie.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-auto-lieferkettenrisiken", "Lieferkettenrisiken", "Indikatoren zu Lieferengpässen und Materialverfügbarkeit.", "02", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-auto-batteriezellfertigung", "Batteriezellfertigung", "Kapazitäten und Investitionen in die Batteriezellproduktion.", "01", "TH_10", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
    ],
    # ── gesundheitswirtschaft-privat +9 ──
    "private-krankenhaeuser-kliniken": [
        ("wip-gw-klinik-bettenkapazitaet", "Bettenkapazität privater Kliniken", "Bettenzahl und Auslastung privater Krankenhausträger.", "02", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-gw-fallzahlen-privat", "Fallzahlen privater Kliniken", "Behandlungsfälle und Fallschwere privater Häuser (DRG).", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-gw-klinikkonzerne-markt", "Klinikkonzern-Markt", "Marktanteile und Trägerstruktur privater Klinikketten.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "pflegeeinrichtungen-privat": [
        ("wip-gw-pflegeplaetze", "Private Pflegeplätze", "Plätze und Auslastung privater Pflegeeinrichtungen.", "02", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-gw-pflegekosten", "Pflegekosten und Eigenanteile", "Entwicklung der Pflegekosten und Eigenanteile.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-gw-pflegepersonal", "Pflegepersonal-Situation", "Personalschlüssel und Fachkräftequote in der Pflege.", "01", "TH_01", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "medizintechnik-medtech": [
        ("wip-gw-medtech-startups", "MedTech-Startups", "Gründungen und Finanzierung im MedTech-Bereich.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-gw-digital-health-markt", "Digital-Health-Markt", "Markt für digitale Gesundheitsanwendungen (DiGA).", "01", "TH_01", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-gw-medtech-export", "MedTech-Export", "Aus- und Einfuhren von Medizintechnik.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── chemieindustrie +9 ──
    "chemieproduktion-umsatz": [
        ("wip-chem-produktionsindex", "Chemie-Produktionsindex", "Produktionsentwicklung der chemischen Industrie nach Sparte (VCI).", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-chem-umsatz-sparten", "Chemie-Umsatz nach Sparte", "Umsatz nach Basis-, Spezial- und Feinchemie.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-chem-kapazitaetsauslastung", "Kapazitätsauslastung Chemie", "Auslastung der Produktionsanlagen.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "forschung-innovation-chemie": [
        ("wip-chem-fue-ausgaben", "Chemie-F&E-Ausgaben", "Forschungs- und Entwicklungsaufwendungen der Branche.", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-chem-patente", "Chemie-Patentanmeldungen", "Patentanmeldungen der chemischen Industrie.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-chem-green-chemistry", "Nachhaltige Chemie / Transformation", "Investitionen in klimaneutrale Produktionsverfahren.", "01", "TH_06", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "chemikalien-sicherheit-umwelt": [
        ("wip-chem-reach-registrierungen", "REACH-Stoffregistrierungen", "Registrierte Stoffe nach der EU-Chemikalienverordnung REACH.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-chem-emissionen", "Industrieemissionen Chemie", "Luft- und Wasseremissionen der Chemieanlagen (PRTR).", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 4),
        ("wip-chem-stoerfaelle", "Anlagensicherheit und Störfälle", "Gemeldete Störfälle und Sicherheitskennzahlen.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── medienwirtschaft-verlage +9 ──
    "verlagsmarkt-buch-zeitschrift": [
        ("wip-mw-verlagsumsatz", "Verlagsumsatz", "Umsatz der Buch- und Zeitschriftenverlage nach Segment.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-mw-titelproduktion", "Titelproduktion", "Zahl der Neuerscheinungen nach Warengruppe.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mw-fachverlage-markt", "Fach- und Wissenschaftsverlage", "Markt und Umsatz wissenschaftlicher Fachverlage.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "digitale-mediennutzung": [
        ("wip-mw-paid-content", "Paid-Content-Erlöse", "Erlöse aus digitalen Bezahlinhalten der Verlage.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-mw-digitalabos", "Digitalabonnements", "Zahl digitaler Abonnements der Presseverlage.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-mw-werbeerloese-digital", "Digitale Werbeerlöse der Verlage", "Anteil und Entwicklung digitaler Werbeerlöse.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "medienkonzentration-regulierung": [
        ("wip-mw-konzentration", "Medienkonzentration", "Marktanteile und Konzentrationskennziffern der Medienkonzerne.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mw-beteiligungen", "Verlagsbeteiligungen", "Beteiligungsstrukturen und Verflechtungen der Medienhäuser.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mw-pressefoerderung", "Presse- und Medienförderung", "Öffentliche Förderprogramme für Medien und Journalismus.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── maritime-wirtschaft +9 ──
    "maritime-hafenlogistik": [
        ("wip-mar-hafenumschlag", "Seehafen-Güterumschlag", "Umgeschlagene Gütermengen der deutschen Seehäfen.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-mar-containerverkehr", "Containerverkehr", "Containerumschlag (TEU) der wichtigsten Häfen.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("wip-mar-hafeninfrastruktur", "Hafeninfrastruktur und -investitionen", "Investitionen und Kapazitäten der Hafeninfrastruktur.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "maritime-schifffahrt-register": [
        ("wip-mar-handelsflotte", "Deutsche Handelsflotte", "Zahl und Tonnage der unter deutscher Reederei betriebenen Schiffe.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mar-schiffstypen", "Schiffstypen und -bestand", "Zusammensetzung der Flotte nach Schiffstyp.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mar-seeleute-beschaeftigung", "Beschäftigung in der Seeschifffahrt", "Zahl der Seeleute und maritimen Beschäftigten.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "maritime-offshore-meeresressourcen": [
        ("wip-mar-offshore-wind", "Offshore-Windenergie", "Installierte Leistung und Erzeugung von Offshore-Windparks.", "01", "TH_06", "OB_04", "GR_03", ["FT_05"], "LI_02", 4),
        ("wip-mar-schiffbau-auftraege", "Schiffbau-Auftragslage", "Auftragsbestand und Produktion der Werften.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-mar-meeresressourcen", "Meeresressourcen-Nutzung", "Wirtschaftliche Nutzung mariner Ressourcen (Fischerei, Rohstoffe).", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # ── biotechnologie-lifesciences +9 ──
    "biotech-forschung-entwicklung": [
        ("wip-bio-unternehmen-bestand", "Biotech-Unternehmensbestand", "Zahl und Schwerpunkte der Biotechnologieunternehmen (biotechnologie.de).", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-bio-fue-ausgaben", "Biotech-F&E-Ausgaben", "Forschungs- und Entwicklungsaufwendungen der Branche.", "01", "TH_10", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bio-pipeline-projekte", "Entwicklungspipeline", "Zahl der Wirkstoff- und Produktkandidaten in Entwicklung.", "02", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "biotech-produkte-zulassung": [
        ("wip-bio-zulassungen", "Biotech-Produktzulassungen", "Zugelassene biotechnologische Arzneimittel und Diagnostika.", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("wip-bio-patente", "Biotech-Patente", "Patentanmeldungen im Bereich Biotechnologie/Life Sciences.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bio-zulassungsdauer", "Zulassungsdauer und -verfahren", "Dauer und Erfolgsquote biotechnologischer Zulassungsverfahren.", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "biotech-markt-industrie": [
        ("wip-bio-umsatz", "Biotech-Branchenumsatz", "Umsatz der Biotechnologiebranche nach Anwendungsfeld.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-bio-finanzierung-vc", "Biotech-Risikokapital", "Venture-Capital-Finanzierungen der Biotech-Branche.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("wip-bio-beschaeftigung", "Biotech-Beschäftigung", "Beschäftigtenzahlen der Biotechnologiebranche.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── bergbau-rohstoffe +9 ──
    "bergbau-foerderung-produktion": [
        ("wip-berg-rohstoffgewinnung", "Rohstoffgewinnung", "Geförderte Mengen mineralischer und Energierohstoffe (BGR/Destatis).", "01", "TH_06", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("wip-berg-steine-erden", "Steine-und-Erden-Förderung", "Gewinnung von Sand, Kies, Naturstein nach Region.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-berg-importabhaengigkeit", "Rohstoff-Importabhängigkeit", "Importanteile kritischer Rohstoffe (DERA).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    "bergbau-umwelt-sicherheit": [
        ("wip-berg-bergschaeden", "Bergschäden und Nachsorge", "Erfasste Bergschäden und Ewigkeitslasten des Altbergbaus.", "02", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-berg-renaturierung", "Renaturierung von Tagebauen", "Flächen und Fortschritt der Tagebau-Rekultivierung.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("wip-berg-grubensicherheit", "Gruben- und Anlagensicherheit", "Sicherheits- und Unfallkennzahlen im Bergbau.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "bergbau-beschaeftigung-wirtschaft": [
        ("wip-berg-beschaeftigte", "Bergbau-Beschäftigung", "Beschäftigtenzahlen des Bergbaus und der Rohstoffgewinnung.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-berg-umsatz", "Bergbau-Umsatz", "Umsatz der Rohstoffwirtschaft nach Sparte.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("wip-berg-recycling-sekundaerrohstoffe", "Sekundärrohstoffe und Recycling", "Aufkommen und Einsatz von Recyclingrohstoffen.", "01", "TH_06", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
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
                print(f"  +{len(spec)} → {l2['id']}/{l3['id']}")

    print(f"\nGesamt hinzugefügt: {added}")
    for l2 in data['children']:
        total = sum(len(l3.get('children', [])) for l3 in l2.get('children', []))
        print(f"{'✓' if total >= 69 else '✗'} {l2['id']}: {total} L4")

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Geschrieben:", PATH)


main()
