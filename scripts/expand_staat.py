#!/usr/bin/env python3
"""Sprint S-P (Teil 7, final): sector_staat.json — alle 46 L2 auf ≥69 L4 (+408)."""
import json

PATH = '/home/user/datenatlas/public/data/sector_staat.json'
C = "#2471a3"  # staat L4 color

FT = {"FT_01": "CSV", "FT_02": "JSON", "FT_03": "NetCDF / HDF5",
      "FT_04": "XML", "FT_05": "GeoJSON", "FT_06": "Shapefile"}
OP = {
    "01": ("OP_01", "Sofort publizierbar",
           "Aggregierte amtliche Statistik ohne Personenbezug; regulär als Open Data publizierbar."),
    "02": ("OP_02", "Nach Aufbereitung publizierbar",
           "Erst nach Aggregation/Anonymisierung publizierbar; Einzelfall- oder Mikrodaten zugangsbeschränkt."),
    "03": ("OP_03", "Nur Metadaten publizierbar",
           "Enthält personenbezogene, sicherheitsrelevante oder vertrauliche Daten; nur Metadaten publizierbar."),
}


def procs(name):
    return [
        {"method": "Datenerhebung",
         "description": f"Erhebung der Daten zu {name} im behördlichen Vollzug bzw. amtlichen Meldewesen."},
        {"method": "Aufbereitung",
         "description": f"Bereinigung, Klassifikation und Aggregation der Daten zu {name}."},
        {"method": "Qualitätssicherung",
         "description": f"Plausibilitäts- und Konsistenzprüfung der {name} nach amtlichen Standards."},
        {"method": "Veröffentlichung und Berichterstattung",
         "description": f"Aufbereitung der {name} für amtliche Berichte und offene Datenkataloge (z. B. GovData)."},
        {"method": "Analyse und Auswertung",
         "description": f"Auswertung der {name} für Planung, Steuerung und Politikberatung."},
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
    # 1. ordnungsamt +9 (2 L3)
    "verkehrsueberwachung": [
        ("stp-ord-bussgeldbescheide", "Bußgeldbescheide nach Tatbestand", "Erlassene Bußgeldbescheide der kommunalen Verkehrsüberwachung nach Verstoßart.", "01", "TH_05", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ord-blitzer-standorte", "Standorte der Geschwindigkeitsüberwachung", "Lage stationärer und mobiler Messstellen der Verkehrsüberwachung.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-ord-parkraumbewirtschaftung", "Parkraumbewirtschaftung", "Bewirtschaftete Parkzonen, Gebühren und Einnahmen.", "01", "TH_05", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ord-verkehrsverstoesse-statistik", "Verkehrsverstöße-Statistik", "Aggregierte Zahl festgestellter Ordnungswidrigkeiten im Verkehr.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "gewerbezulassung": [
        ("stp-ord-gewerbeanmeldungen", "Gewerbean- und -abmeldungen", "Zahl der Gewerbean-, -um- und -abmeldungen nach Branche (Gewerbeanzeigenstatistik).", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ord-gaststaettenerlaubnis", "Gaststättenerlaubnisse", "Erteilte Gaststätten- und Schankerlaubnisse.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ord-marktwesen", "Märkte und Sondernutzungen", "Genehmigte Wochenmärkte, Volksfeste und Sondernutzungen öffentlicher Flächen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ord-gewerbeuntersagungen", "Gewerbeuntersagungen", "Zahl der Gewerbeuntersagungen wegen Unzuverlässigkeit.", "02", "TH_08", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ord-waffenrecht", "Waffenrechtliche Erlaubnisse", "Erteilte waffenrechtliche Erlaubnisse und Einträge im Waffenregister.", "03", "TH_08", "OB_01", "GR_03", ["FT_01"], "LI_04", 3),
    ],
    # 2. einwohnermeldeamt +9 (2 L3)
    "einwohner_reg": [
        ("stp-emw-anmeldungen", "Wohnsitzan- und -abmeldungen", "Zahl der An-, Ab- und Ummeldungen im Melderegister.", "02", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-emw-wanderungssalden", "Wanderungssalden", "Zu- und Fortzüge sowie Wanderungssaldo der Gemeinde.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-emw-altersstruktur", "Altersstruktur der Einwohner", "Bevölkerung nach Altersgruppen und Geschlecht auf Gemeindeebene.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-emw-staatsangehoerigkeiten", "Staatsangehörigkeiten", "Bevölkerung nach Staatsangehörigkeit und Migrationsstatus.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "standesamt": [
        ("stp-emw-geburten", "Geburtenregister-Statistik", "Beurkundete Geburten nach Merkmalen.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-emw-eheschliessungen", "Eheschließungen und Lebenspartnerschaften", "Beurkundete Ehen und Lebenspartnerschaften.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-emw-sterbefaelle", "Sterbefälle", "Beurkundete Sterbefälle nach Alter und Geschlecht.", "01", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-emw-namensaenderungen", "Namensänderungen", "Zahl behördlicher und standesamtlicher Namensänderungen.", "02", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-emw-urkundenanforderungen", "Urkundenanforderungen", "Ausgestellte Personenstandsurkunden nach Art.", "02", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 3. bauordnungsamt +9 (2 L3)
    "baugenehmigungen": [
        ("stp-bau-genehmigungsdauer", "Bearbeitungsdauer von Bauanträgen", "Durchschnittliche Dauer von Baugenehmigungsverfahren.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bau-genehmigte-wohnungen", "Genehmigte Wohnungen", "Zahl genehmigter Wohnungen und Nutzflächen nach Gebäudeart.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-bau-bauueberwachung", "Bauüberwachung und Abnahmen", "Durchgeführte Bauzustandsbesichtigungen und Abnahmen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bau-schwarzbauten", "Schwarzbauten und Verstöße", "Festgestellte ungenehmigte Bauvorhaben und Verfügungen.", "02", "TH_08", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "stadtplanung_gis": [
        ("stp-bau-flaechennutzungsplan", "Flächennutzungsplan-Daten", "Darstellungen des Flächennutzungsplans als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-bau-bebauungsplaene", "Bebauungspläne", "Rechtskräftige Bebauungspläne mit Festsetzungen als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-bau-baulandkataster", "Baulandkataster", "Verfügbare Bauflächen und Baulücken im Kataster.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-bau-3d-stadtmodell", "3D-Stadtmodell", "Digitales 3D-Gebäudemodell der Kommune (LoD2).", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("stp-bau-denkmalkataster", "Denkmalkataster", "Verzeichnis der Bau- und Bodendenkmäler als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 4. gesundheitsamt +9 (2 L3)
    "infektionsschutz": [
        ("stp-gea-meldepflichtige-erkrankungen", "Meldepflichtige Erkrankungen", "Gemeldete Fälle meldepflichtiger Infektionskrankheiten (IfSG/RKI).", "01", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 5),
        ("stp-gea-impfquoten-kommunal", "Impfquoten (kommunal)", "Impfquoten bei Schuleingangsuntersuchungen und Reihenimpfungen.", "01", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gea-hygieneueberwachung", "Hygieneüberwachung", "Begehungen und Beanstandungen der infektionshygienischen Überwachung.", "02", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-gea-ausbruchsgeschehen", "Ausbruchsgeschehen", "Erfasste Ausbrüche in Gemeinschaftseinrichtungen.", "02", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "umwelthygiene": [
        ("stp-gea-trinkwasserueberwachung", "Trinkwasserüberwachung", "Untersuchungsergebnisse der amtlichen Trinkwasserüberwachung.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gea-badegewaesser", "Badegewässerqualität", "Hygienische Bewertung der Badegewässer.", "01", "TH_06", "OB_04", "GR_03", ["FT_05"], "LI_02", 3),
        ("stp-gea-schuleingangsuntersuchung", "Schuleingangsuntersuchungen", "Ergebnisse der Schuleingangsuntersuchungen (Entwicklung, Gesundheit).", "02", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gea-umweltbezogene-beschwerden", "Umweltbezogene Gesundheitsbeschwerden", "Eingegangene Beschwerden zu Lärm, Schadstoffen und Umweltbelastungen.", "02", "TH_06", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-gea-amtsaerztliche-gutachten", "Amtsärztliche Gutachten", "Zahl erstellter amtsärztlicher Gutachten und Bescheinigungen.", "03", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_04", 3),
    ],
    # 5. stadtplanung-bauen +9 (3 L3)
    "bauleitplanung": [
        ("stp-spl-planverfahren-laufend", "Laufende Planverfahren", "Stand laufender Bauleitplanverfahren und Beteiligungen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-spl-innenentwicklung", "Innenentwicklungspotenziale", "Erfasste Nachverdichtungs- und Innenentwicklungsflächen.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-spl-buergerbeteiligung-planung", "Bürgerbeteiligung in der Planung", "Beteiligungsverfahren und Eingaben in der Stadtplanung.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "liegenschaft-geodaten": [
        ("stp-spl-liegenschaftskataster", "Liegenschaftskataster", "Flurstücke und Gebäude des amtlichen Liegenschaftskatasters (ALKIS).", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-spl-bodenrichtwerte", "Bodenrichtwerte", "Bodenrichtwerte der Gutachterausschüsse als Geodaten.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-spl-luftbilder-orthofotos", "Luftbilder und Orthofotos", "Digitale Orthofotos des Stadtgebiets.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    "bautaetigkeit": [
        ("stp-spl-wohnungsbestand", "Wohnungsbestand", "Bestand an Wohnungen und Wohngebäuden nach Baualter.", "01", "TH_05", "OB_05", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-spl-leerstandskataster", "Leerstandskataster", "Erfasste Wohn- und Gewerbeleerstände im Stadtgebiet.", "02", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-spl-sanierungsgebiete", "Sanierungs- und Fördergebiete", "Festgelegte Sanierungs- und Städtebaufördergebiete.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 6. mobilitaet-verkehr +3 (8 L3)
    "miv": [
        ("stp-mob-kfz-dichte", "Kfz-Dichte", "Motorisierungsgrad (Pkw je 1.000 Einwohner) auf Gemeindeebene.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "radverkehr": [
        ("stp-mob-radverkehrsnetz", "Radverkehrsnetz", "Radwege und Radverkehrsinfrastruktur als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "strasseninfrastruktur": [
        ("stp-mob-strassenzustand", "Straßenzustandserfassung", "Zustandsbewertung des kommunalen Straßennetzes.", "01", "TH_05", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 7. gesellschaft-demografie +9 (3 L3)
    "bevoelkerungsstruktur": [
        ("stp-ges-haushaltsstruktur", "Haushaltsstrukturen", "Zahl und Größe der Privathaushalte auf kleinräumiger Ebene.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ges-bevoelkerungsprognose", "Bevölkerungsprognose", "Kleinräumige Vorausberechnung der Einwohnerentwicklung.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ges-geburten-sterbe-saldo", "Natürliche Bevölkerungsbilanz", "Geburten- und Sterbefälle sowie natürlicher Saldo.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "soziale-einrichtungen": [
        ("stp-ges-kita-platzangebot", "Kita-Platzangebot", "Plätze und Versorgungsquote in der Kindertagesbetreuung.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ges-pflegeeinrichtungen", "Pflegeeinrichtungen", "Zahl und Kapazität ambulanter und stationärer Pflegeangebote.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ges-treffpunkte-beratung", "Beratungs- und Begegnungsstellen", "Lage sozialer Beratungs- und Begegnungseinrichtungen.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "migration-fluechtlinge": [
        ("stp-ges-unterbringung-gefluechtete", "Unterbringung Geflüchteter", "Kapazität und Belegung kommunaler Unterbringung.", "02", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ges-integrationskurse-kommunal", "Integrationsangebote (kommunal)", "Kommunale Integrations- und Sprachfördermaßnahmen.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ges-einbuergerungen", "Einbürgerungen", "Zahl der Einbürgerungen nach Herkunft.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 8. umwelt-klima +9 (2 L3)
    "naturschutz-freiraum": [
        ("stp-umw-schutzgebiete", "Schutzgebiete", "Naturschutz-, Landschaftsschutz- und FFH-Gebiete als Geodaten.", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_02", 4),
        ("stp-umw-baumkataster", "Baumkataster", "Erfasster Baumbestand im öffentlichen Raum.", "01", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-umw-gruenflaechen", "Grünflächen und Parks", "Öffentliche Grün- und Erholungsflächen als Geodaten.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-umw-artenschutz-kartierung", "Artenschutz-Kartierung", "Kartierte Vorkommen geschützter Arten.", "02", "TH_09", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "energie-ressourcen": [
        ("stp-umw-energieverbrauch-kommunal", "Kommunaler Energieverbrauch", "Energieverbrauch kommunaler Liegenschaften.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-umw-co2-bilanz", "Kommunale CO2-Bilanz", "Treibhausgasbilanz der Kommune nach Sektor.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-umw-solarpotenzial", "Solarpotenzialkataster", "Dachflächen-Solarpotenziale als Geodaten.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("stp-umw-luftqualitaet", "Luftqualitätsmessungen", "Messwerte kommunaler und landesweiter Luftmessstationen.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-umw-laermkartierung", "Lärmkartierung", "Strategische Lärmkarten nach EU-Umgebungslärmrichtlinie.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    # 9. demokratie-verwaltung +9 (2 L3)
    "politische-vertretung": [
        ("stp-dem-ratsinformationen", "Ratsinformationssystem-Daten", "Sitzungen, Vorlagen und Beschlüsse des Gemeinderats.", "01", "TH_05", "OB_02", "GR_03", ["FT_02"], "LI_02", 3),
        ("stp-dem-wahlergebnisse-kommunal", "Kommunalwahlergebnisse", "Ergebnisse der Kommunalwahlen auf Stimmbezirksebene.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-dem-buergerbegehren", "Bürgerbegehren und -entscheide", "Zahl und Ergebnisse direktdemokratischer Verfahren.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-dem-gremienbesetzung", "Gremien- und Ausschussbesetzung", "Zusammensetzung von Rat und Ausschüssen nach Fraktion.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "haushalt-finanzen": [
        ("stp-dem-haushaltsplan", "Kommunaler Haushaltsplan", "Erträge und Aufwendungen des Haushalts nach Produktbereich.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-dem-schuldenstand-kommunal", "Kommunaler Schuldenstand", "Verschuldung der Kommune nach Schuldenart.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-dem-investitionen-kommunal", "Kommunale Investitionen", "Investitionsausgaben nach Aufgabenbereich.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-dem-realsteuerhebesaetze", "Realsteuerhebesätze", "Hebesätze für Grund- und Gewerbesteuer.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-dem-foerdermittelabruf", "Fördermittelabruf", "Abgerufene Landes-, Bundes- und EU-Fördermittel.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 10. sicherheit-ordnung +9 (3 L3)
    "feuerwehr-rettung": [
        ("stp-sic-feuerwehreinsaetze", "Feuerwehreinsätze", "Einsatzstatistik der Berufs- und Freiwilligen Feuerwehr nach Art.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-sic-hilfsfristen", "Hilfsfristen", "Erreichungsgrade der Hilfsfristen im Brandschutz.", "01", "TH_05", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sic-brandschauen", "Brandverhütungsschauen", "Durchgeführte Brandschauen und Mängelfeststellungen.", "02", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "oeffentliche-ordnung": [
        ("stp-sic-ordnungswidrigkeiten", "Ordnungswidrigkeiten", "Erfasste Ordnungswidrigkeiten des kommunalen Ordnungsdienstes.", "01", "TH_08", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sic-fundbuero", "Fundbüro-Statistik", "Abgegebene und abgeholte Fundsachen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sic-videoueberwachung", "Kommunale Videoüberwachung", "Standorte und Rechtsgrundlagen kommunaler Videoüberwachung.", "02", "TH_08", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "rettungsdienste": [
        ("stp-sic-rettungswachen", "Rettungswachen-Standorte", "Lage und Versorgungsbereiche der Rettungswachen.", "01", "TH_01", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-sic-einsatzaufkommen-rd", "Einsatzaufkommen Rettungsdienst", "Zahl der Rettungs- und Krankentransporteinsätze.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sic-leitstellen-daten", "Leitstellen-Daten", "Notruf- und Disponierungskennzahlen der integrierten Leitstelle.", "02", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 11. freizeit-kultur +9 (3 L3)
    "freizeitangebote": [
        ("stp-frk-sportstaetten", "Sportstätten", "Kommunale Sportanlagen und ihre Auslastung als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-frk-spielplaetze", "Spielplätze", "Lage und Ausstattung öffentlicher Spielplätze.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-frk-baeder", "Bäder und Schwimmstätten", "Frei- und Hallenbäder mit Besuchszahlen.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "kultur-tourismus": [
        ("stp-frk-tourismus-uebernachtungen", "Touristische Übernachtungen (kommunal)", "Gästeankünfte und Übernachtungen der Kommune.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-frk-veranstaltungskalender", "Städtischer Veranstaltungskalender", "Öffentliche Veranstaltungen als offene Daten.", "01", "TH_05", "OB_08", "GR_03", ["FT_02"], "LI_02", 3),
        ("stp-frk-sehenswuerdigkeiten", "Sehenswürdigkeiten und POI", "Touristische Points of Interest als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
    ],
    "kulturelle-einrichtungen": [
        ("stp-frk-museen-kommunal", "Kommunale Museen", "Städtische Museen mit Besuchszahlen.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-frk-theater-kommunal", "Kommunale Theater und Bühnen", "Städtische Bühnen mit Vorstellungen und Besuchern.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-frk-musikschulen", "Musik- und Kunstschulen", "Kommunale Musikschulen mit Schülerzahlen.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 12. wirtschaft-digital +9 (2 L3)
    "wirtschaftsstandort": [
        ("stp-wid-gewerbeflaechen", "Gewerbeflächen", "Verfügbare Gewerbe- und Industrieflächen als Geodaten.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-wid-beschaeftigte-branchen", "Beschäftigte nach Branche", "Sozialversicherungspflichtig Beschäftigte nach Wirtschaftszweig.", "01", "TH_04", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-wid-arbeitslosenquote-kommunal", "Arbeitslosenquote (kommunal)", "Arbeitslosenquote und -struktur auf Kreisebene.", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-wid-pendlerverflechtungen", "Pendlerverflechtungen", "Ein- und Auspendler nach Gemeinde.", "01", "TH_04", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "digitale-infrastruktur": [
        ("stp-wid-onlinedienste-nutzung", "Nutzung kommunaler Onlinedienste", "Nutzungszahlen digitaler Verwaltungsleistungen (OZG).", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-wid-breitband-kommunal", "Breitbandverfügbarkeit (kommunal)", "Verfügbare Bandbreiten im Gemeindegebiet.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-wid-wlan-hotspots", "Öffentliche WLAN-Hotspots", "Standorte kommunaler freier WLAN-Zugänge.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_02", 3),
        ("stp-wid-smart-city-projekte", "Smart-City-Projekte", "Laufende Digitalisierungs- und Smart-City-Vorhaben.", "01", "TH_10", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-wid-sensordaten-iot", "Kommunale Sensordaten (IoT)", "Offene Sensordaten aus dem urbanen Datenraum.", "01", "TH_10", "OB_04", "GR_03", ["FT_02"], "LI_02", 3),
    ],
    # 13. gesundheit-soziales +9 (2 L3)
    "gesundheitsversorgung": [
        ("stp-gso-arztdichte", "Ärztliche Versorgungsdichte", "Niedergelassene Ärzte je Einwohner nach Fachrichtung.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gso-apotheken", "Apothekendichte", "Zahl und Lage der Apotheken im Versorgungsgebiet.", "01", "TH_01", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-gso-krankenhausbetten", "Krankenhausbetten", "Bettenkapazität und -auslastung im Kreisgebiet.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gso-gesundheitsberufe", "Gesundheitsberufe", "Beschäftigte in Gesundheits- und Pflegeberufen.", "01", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "soziale-lage": [
        ("stp-gso-sgb2-quote", "SGB-II-Quote", "Anteil der Leistungsberechtigten nach SGB II (Bürgergeld).", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gso-grundsicherung-alter", "Grundsicherung im Alter", "Empfänger von Grundsicherung im Alter und bei Erwerbsminderung.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-gso-wohngeld", "Wohngeld-Empfänger", "Zahl der Wohngeldhaushalte und Leistungshöhe.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-gso-kinderarmut", "Kinderarmut", "Anteil der Kinder in Bedarfsgemeinschaften.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-gso-schuldnerquote", "Schuldnerquote", "Anteil überschuldeter Personen (SchuldnerAtlas).", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 14. allgemeinbildende-schule +9 (3 L3)
    "unterricht-verwaltung": [
        ("stp-abs-schuelerzahlen-kommunal", "Schülerzahlen (kommunal)", "Schülerzahlen öffentlicher Schulen nach Schulart.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-abs-klassengroessen", "Klassengrößen", "Durchschnittliche Klassenfrequenzen nach Schulart.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-abs-unterrichtsausfall", "Unterrichtsausfall", "Quote des ausgefallenen und vertretenen Unterrichts.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "schulberichterstattung": [
        ("stp-abs-uebergangsquoten", "Übergangsquoten weiterführende Schulen", "Übergänge von der Grundschule auf weiterführende Schulen.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-abs-schulabschluesse", "Schulabschlüsse", "Erreichte Abschlüsse der Absolventen nach Art.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-abs-ganztagsquote", "Ganztagsquote", "Anteil der Schüler in Ganztagsangeboten.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "schulinfrastruktur": [
        ("stp-abs-schulgebaeude-zustand", "Schulgebäude-Zustand", "Sanierungsbedarf und Investitionsstau der Schulgebäude.", "02", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-abs-digitalausstattung", "Digitale Ausstattung der Schulen", "Ausstattungsgrad mit Endgeräten und WLAN (DigitalPakt).", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-abs-schulwege", "Schulwege und Einzugsbereiche", "Schuleinzugsbereiche und Schülerbeförderung.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 15. berufsschule +9 (3 L3)
    "ausbildungsverhaeltnisse": [
        ("stp-bsc-azubi-zahlen", "Auszubildendenzahlen", "Zahl der Berufsschüler nach Berufsfeld.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-ausbildungsberufe", "Ausbildungsberufe-Verteilung", "Verteilung der Ausbildungsverhältnisse auf Berufe.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-vertragsloesungen", "Vertragslösungsquote", "Anteil vorzeitig gelöster Ausbildungsverträge.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "pruefungswesen_bbs": [
        ("stp-bsc-pruefungserfolg", "Prüfungserfolgsquoten", "Bestehensquoten der Abschlussprüfungen.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-zusatzqualifikationen", "Zusatzqualifikationen", "Erworbene Zusatz- und Doppelqualifikationen.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-pruefungsteilnahme", "Prüfungsteilnahme", "Zahl der Prüfungsteilnehmer nach Beruf.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "berufsorientierung": [
        ("stp-bsc-uebergang-ausbildung", "Übergang Schule–Ausbildung", "Verbleib der Schulabgänger im Übergangssystem.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-praktika", "Praktikumsplätze", "Vermittelte Schüler- und Berufsorientierungspraktika.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bsc-berufsberatung", "Berufsberatungskontakte", "Beratungskontakte der schulischen Berufsorientierung.", "01", "TH_02", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 16. volkshochschule +9 (2 L3)
    "kursangebot": [
        ("stp-vhs-kursbelegungen", "Kursbelegungen", "Belegungen der VHS-Kurse nach Programmbereich.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-unterrichtsstunden", "Unterrichtsstunden", "Geleistete Unterrichtsstunden nach Fachbereich.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-teilnehmerstruktur", "Teilnehmerstruktur", "Struktur der Teilnehmenden nach Alter und Geschlecht.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-integrationskurse-vhs", "Integrationskurse (VHS)", "Durchgeführte Integrations- und Deutschkurse.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "weiterbildungsberichterstattung": [
        ("stp-vhs-finanzierung", "VHS-Finanzierung", "Einnahmen- und Ausgabenstruktur der Volkshochschulen.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-weiterbildungsbeteiligung-kommunal", "Weiterbildungsbeteiligung", "Beteiligungsquote an Weiterbildung im Kreis.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-online-angebote", "Digitale Weiterbildungsangebote", "Zahl und Nutzung digitaler VHS-Angebote.", "01", "TH_02", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-abschluesse-vhs", "VHS-Abschlüsse und Zertifikate", "Erworbene Schulabschlüsse und Zertifikate an der VHS.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vhs-standorte", "VHS-Standorte", "Lage der VHS-Geschäftsstellen und Außenstellen.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 17. kita-fruehbildung +9 (2 L3)
    "betreuungsplaetze": [
        ("stp-kita-versorgungsquote-u3", "Betreuungsquote U3", "Versorgungsquote der unter Dreijährigen.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-kita-versorgungsquote-ue3", "Betreuungsquote Ü3", "Versorgungsquote der drei- bis sechsjährigen Kinder.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kita-wartelisten-bedarf", "Betreuungsbedarf und Wartelisten", "Gemeldeter Bedarf und unversorgte Plätze.", "02", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kita-traegerstruktur", "Trägerstruktur der Kitas", "Verteilung der Kitas auf kommunale und freie Träger.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "kitaqualitaet": [
        ("stp-kita-fachkraft-schluessel", "Fachkraft-Kind-Schlüssel", "Personalschlüssel und Gruppengrößen in Kitas.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-kita-oeffnungszeiten", "Öffnungszeiten und Betreuungsumfang", "Verteilung der vereinbarten Betreuungszeiten.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kita-sprachfoerderung", "Sprachförderung in Kitas", "Umfang alltagsintegrierter Sprachförderung.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kita-gebuehren", "Kita-Gebühren", "Elternbeiträge und Gebührenstaffelung.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kita-personalentwicklung", "Kita-Personalentwicklung", "Beschäftigte und Fachkräftebedarf in Kitas.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 18. krankenhaus +9 (2 L3)
    "patientenverwaltung": [
        ("stp-kra-fallzahlen", "Fallzahlen", "Stationäre Behandlungsfälle nach Hauptdiagnosegruppe.", "02", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-kra-verweildauer", "Verweildauer", "Durchschnittliche Verweildauer nach Fachabteilung.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kra-bettenauslastung", "Bettenauslastung", "Auslastung der Krankenhausbetten nach Abteilung.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kra-notaufnahme-aufkommen", "Notaufnahme-Aufkommen", "Patientenaufkommen der Notaufnahmen.", "02", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "diagnostik": [
        ("stp-kra-op-zahlen", "Operationszahlen", "Durchgeführte Operationen nach OPS-Schlüssel.", "02", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kra-qualitaetsindikatoren", "Qualitätsindikatoren", "Berichtete Qualitätsindikatoren nach Leistungsbereich (QS-Verfahren).", "01", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-kra-hygienekennzahlen", "Hygiene-Kennzahlen", "Nosokomiale Infektionsraten und Hygienekennzahlen.", "02", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kra-medizintechnik-bestand", "Medizintechnik-Bestand", "Vorgehaltene Großgeräte und ihre Auslastung.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kra-personal-pflege", "Pflegepersonal-Quote", "Pflegepersonalschlüssel nach Pflegepersonaluntergrenzen.", "01", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 19. oeffentlicher_gesundheitsdienst +9 (3 L3)
    "infektionsueberwachung": [
        ("stp-ogd-surveillance", "Infektions-Surveillance", "Laufende Überwachung meldepflichtiger Erreger im Kreis.", "01", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ogd-abwassermonitoring", "Abwasser-Monitoring", "Pathogen-Monitoring im kommunalen Abwasser.", "01", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_02", 3),
        ("stp-ogd-impfstellen", "Impfstellen und -aktionen", "Kommunale Impfangebote und durchgeführte Impfungen.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "gesundheitsberichterstattung": [
        ("stp-ogd-gesundheitsbericht", "Kommunaler Gesundheitsbericht", "Indikatoren der kommunalen Gesundheitsberichterstattung.", "01", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ogd-lebenserwartung", "Lebenserwartung (kleinräumig)", "Kleinräumige Unterschiede der Lebenserwartung.", "01", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ogd-praeventionsmonitoring", "Präventionsmonitoring", "Indikatoren zu Gesundheitsverhalten und Prävention.", "01", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "praevention-frueherkennnung": [
        ("stp-ogd-frueherkennung-teilnahme", "Früherkennungs-Teilnahme", "Teilnahmequoten an Früherkennungsuntersuchungen für Kinder.", "01", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ogd-zahngesundheit", "Zahngesundheit (Schulen)", "Befunde der zahnärztlichen Gruppenprophylaxe.", "02", "TH_01", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ogd-suchtpraevention", "Suchtprävention", "Maßnahmen und Reichweite kommunaler Suchtprävention.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 20. rettungsdienst +9 (2 L3)
    "notfalleinsaetze": [
        ("stp-ret-einsatzarten", "Einsatzarten", "Verteilung der Einsätze auf Notfall- und Krankentransport.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ret-eintreffzeiten", "Eintreffzeiten", "Verteilung der Eintreffzeiten am Einsatzort.", "01", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-ret-notarzt-einsaetze", "Notarzteinsätze", "Zahl der Notarzt- und Rettungswageneinsätze.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ret-transportziele", "Transportziele", "Verteilung der Transporte auf Zielkliniken.", "02", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "notfallversorgungsforschung": [
        ("stp-ret-reanimationsquote", "Reanimationsquote", "Outcome- und Reanimationskennzahlen (Reanimationsregister).", "01", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-ret-einsatzprotokolle", "Einsatzprotokoll-Auswertung", "Auswertung anonymisierter Rettungsdienstprotokolle.", "02", "TH_01", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ret-leitstellen-disposition", "Dispositionsqualität", "Kennzahlen zur Notrufabfrage und Disposition.", "01", "TH_01", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-ret-versorgungsforschung-praeklinik", "Präklinische Versorgungsforschung", "Daten zur präklinischen Versorgung ausgewählter Krankheitsbilder.", "02", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-ret-telenotarzt", "Telenotarzt-Nutzung", "Einsätze und Nutzung telemedizinischer Notfallversorgung.", "01", "TH_10", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 21. stadtwerke +9 (3 L3)
    "energieversorgung": [
        ("stp-stw-stromabsatz", "Stromabsatz", "Abgesetzte Strommengen nach Kundengruppe.", "01", "TH_06", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-stw-netzausbau", "Verteilnetz und -ausbau", "Netzlänge und Investitionen ins Strom-/Gasverteilnetz.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-stw-fernwaerme", "Fernwärmeversorgung", "Fernwärmenetz, Anschlüsse und abgesetzte Wärme.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "wasserversorgung-sw": [
        ("stp-stw-wasserabgabe", "Trinkwasserabgabe", "Abgegebene Trinkwassermengen und Pro-Kopf-Verbrauch.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-stw-wasserqualitaet-sw", "Wasserqualität (Versorger)", "Qualitätsparameter des abgegebenen Trinkwassers.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-stw-wasserverluste", "Wasserverluste im Netz", "Reale Wasserverluste im Verteilnetz.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "abfallentsorgung": [
        ("stp-stw-abfallmengen", "Abfallmengen", "Aufkommen an Haus- und Wertstoffmüll je Einwohner.", "01", "TH_06", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-stw-recyclingquote", "Recyclingquote", "Verwertungs- und Recyclingquoten der Abfälle.", "01", "TH_06", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-stw-gebuehren-abfall", "Abfallgebühren", "Gebührenstruktur der kommunalen Abfallentsorgung.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 22. verkehrsbetriebe +9 (2 L3)
    "oepnv_betrieb": [
        ("stp-vkb-fahrgastzahlen", "Fahrgastzahlen", "Beförderte Personen im ÖPNV nach Linie und Verkehrsmittel.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-vkb-puenktlichkeit", "Pünktlichkeit", "Pünktlichkeits- und Zuverlässigkeitskennzahlen des ÖPNV.", "01", "TH_05", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vkb-liniennetz-gtfs", "Liniennetz und Fahrplan (GTFS)", "Fahrplan- und Liniennetzdaten im offenen GTFS-Format.", "01", "TH_05", "OB_05", "GR_03", ["FT_02"], "LI_02", 4),
        ("stp-vkb-tarif-einnahmen", "Tarifeinnahmen", "Fahrgeldeinnahmen nach Ticketart.", "02", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "ladeinfrastruktur": [
        ("stp-vkb-ladepunkte", "Öffentliche Ladepunkte", "Standorte und Leistung öffentlicher Ladesäulen (Ladesäulenregister).", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 4),
        ("stp-vkb-ladevorgaenge", "Ladevorgänge", "Zahl und Energiemenge der Ladevorgänge.", "02", "TH_06", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vkb-busflotte-antrieb", "Busflotte nach Antrieb", "Zusammensetzung der ÖPNV-Flotte nach Antriebsart.", "01", "TH_06", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-vkb-depot-betriebshof", "Betriebshöfe und Depots", "Lage und Kapazität der Betriebshöfe.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-vkb-barrierefreiheit-haltestellen", "Barrierefreie Haltestellen", "Anteil barrierefrei ausgebauter Haltestellen.", "01", "TH_03", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 23. tiefbauamt +9 (2 L3)
    "strassennetz": [
        ("stp-tba-strassenkataster", "Straßenkataster", "Kommunales Straßen- und Wegenetz als Geodaten.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-tba-strassenschaeden", "Straßenschäden", "Erfasste Schäden und Sanierungsbedarf des Straßennetzes.", "01", "TH_05", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-tba-baustellen", "Baustellen und Sperrungen", "Aktuelle Straßenbaustellen und Verkehrseinschränkungen.", "01", "TH_05", "OB_05", "GR_03", ["FT_02"], "LI_02", 3),
        ("stp-tba-strassenbeleuchtung", "Straßenbeleuchtung", "Bestand und Energieverbrauch der Straßenbeleuchtung.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "bruecken_bauwerke": [
        ("stp-tba-brueckenzustand", "Brückenzustand", "Zustandsnoten der Ingenieurbauwerke (Bauwerksprüfung).", "01", "TH_05", "OB_04", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-tba-bauwerkspruefungen", "Bauwerksprüfungen", "Durchgeführte Brücken- und Bauwerksprüfungen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-tba-tunnel-anlagen", "Tunnel und Sonderbauwerke", "Bestand und Zustand von Tunneln und Sonderbauwerken.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-tba-kanalnetz", "Kanal- und Entwässerungsnetz", "Zustand und Länge des kommunalen Kanalnetzes.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-tba-laermschutz-bauwerke", "Lärmschutzbauwerke", "Bestand an Lärmschutzwänden und -wällen.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 24. digitalinfrastruktur +9 (2 L3)
    "breitbandversorgung-di": [
        ("stp-din-glasfaser-ausbau", "Glasfaserausbau", "Glasfaserverfügbarkeit (FTTB/FTTH) nach Gebiet.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("stp-din-foerdergebiete-breitband", "Breitband-Fördergebiete", "Geförderte Ausbaugebiete und Mittel.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-din-versorgungsluecken", "Versorgungslücken (weiße Flecken)", "Unterversorgte Gebiete im Breitbandatlas.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-din-mobilfunk-5g", "5G-/Mobilfunkversorgung", "5G- und LTE-Abdeckung im Gebiet.", "01", "TH_10", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    "digitale_dienste": [
        ("stp-din-ozg-leistungen", "OZG-Onlineleistungen", "Verfügbare digitale Verwaltungsleistungen nach OZG.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-din-buergerkonto-nutzung", "Servicekonto-Nutzung", "Registrierungen und Nutzung des Bürgerservicekontos.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-din-open-data-portal", "Open-Data-Portal-Datensätze", "Zahl und Abrufe veröffentlichter offener Datensätze.", "01", "TH_05", "OB_08", "GR_03", ["FT_02"], "LI_02", 4),
        ("stp-din-egovernment-reifegrad", "E-Government-Reifegrad", "Indikatoren zum Digitalisierungsstand der Verwaltung.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-din-it-sicherheit-vorfaelle", "IT-Sicherheitsvorfälle", "Gemeldete IT-Sicherheitsvorfälle der Kommunalverwaltung.", "03", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_04", 3),
    ],
    # 25. sonderpaedagogik-inklusion +9 (2 L3)
    "foerderschulen-bedarf": [
        ("stp-sop-foerderschwerpunkte", "Förderschwerpunkte", "Schüler nach sonderpädagogischem Förderschwerpunkt.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sop-foerderquote", "Förderquote", "Anteil der Schüler mit Förderbedarf.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sop-foerderschulen-bestand", "Förderschulen-Bestand", "Zahl und Standorte der Förderschulen.", "01", "TH_02", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-sop-diagnostikverfahren", "Diagnostikverfahren", "Durchgeführte sonderpädagogische Feststellungsverfahren.", "02", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "inklusion-massnahmen": [
        ("stp-sop-inklusionsquote", "Inklusionsquote", "Anteil inklusiv an Regelschulen unterrichteter Schüler.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-sop-schulbegleitung", "Schulbegleitung", "Bewilligte Schulbegleitungen (Eingliederungshilfe).", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sop-barrierefreiheit-schulen", "Barrierefreiheit der Schulen", "Anteil barrierefrei ausgebauter Schulgebäude.", "01", "TH_03", "OB_05", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sop-fortbildung-inklusion", "Lehrkräftefortbildung Inklusion", "Teilnahme an Fortbildungen zur inklusiven Bildung.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sop-uebergang-beruf-inklusion", "Übergang Beruf (inklusiv)", "Übergänge von Förderschülern in Ausbildung und Beruf.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 26. bildungsverwaltung-politik +9 (2 L3)
    "schulaufsicht-planung": [
        ("stp-bvp-schulentwicklungsplan", "Schulentwicklungsplanung", "Bedarfs- und Standortplanung der Schulträger.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bvp-lehrerbedarf", "Lehrkräftebedarf", "Prognostizierter und gedeckter Lehrkräftebedarf.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-bvp-schulstandorte", "Schulstandorte", "Standorte öffentlicher Schulen als Geodaten.", "01", "TH_02", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-bvp-schulaufsicht-verfahren", "Schulaufsichtsverfahren", "Aufsichts- und Genehmigungsverfahren der Schulaufsicht.", "02", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "bildungsberichterstattung": [
        ("stp-bvp-bildungsbericht-kommunal", "Kommunaler Bildungsbericht", "Indikatoren des kommunalen Bildungsmonitorings.", "01", "TH_02", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-bvp-bildungsausgaben", "Kommunale Bildungsausgaben", "Ausgaben des Schulträgers nach Schulart.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bvp-uebergangsmanagement", "Kommunales Übergangsmanagement", "Daten zu Bildungsübergängen im Lebensverlauf.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bvp-bildungsmonitoring-soziallagen", "Bildung nach Soziallage", "Bildungsindikatoren nach sozialräumlicher Gliederung.", "01", "TH_02", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bvp-schulsozialarbeit", "Schulsozialarbeit", "Umfang und Verteilung der Schulsozialarbeit.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 27. bibliotheken-medienzentren +9 (2 L3)
    "bibliotheksbestand-ausleihe": [
        ("stp-bib-medienbestand-kommunal", "Medienbestand (kommunal)", "Bestand der öffentlichen Bibliotheken nach Medienart (DBS).", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-ausleihzahlen-kommunal", "Ausleihzahlen", "Entleihungen der öffentlichen Bibliotheken.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-besuche", "Bibliotheksbesuche", "Besuchszahlen und aktive Nutzer.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-veranstaltungen", "Bibliotheksveranstaltungen", "Veranstaltungen der Leseförderung und Vermittlung.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "digitale-bibliotheksdienste": [
        ("stp-bib-onleihe", "Onleihe-Nutzung", "Ausleihen digitaler Medien (E-Books, E-Audios).", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-internetarbeitsplaetze", "Internetarbeitsplätze", "Verfügbare Internet- und PC-Arbeitsplätze.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-makerspaces", "Makerspaces und Lernlabore", "Angebote digitaler Lern- und Kreativräume.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-digitale-angebote-nutzung", "Nutzung digitaler Angebote", "Zugriffe auf digitale Bibliotheksdienste.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bib-medienzentren-verleih", "Medienzentren-Verleih", "Verleih von Bildungsmedien und Technik an Schulen.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 28. berufl-weiterbildung-kammern +9 (2 L3)
    "meister-aufstiegsfortbildung": [
        ("stp-kam-meisterpruefungen-kammer", "Meisterprüfungen (Kammer)", "Zahl bestandener Meisterprüfungen je Kammer.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-fortbildungsabschluesse", "Fortbildungsabschlüsse", "Erworbene Aufstiegsfortbildungsabschlüsse (Fach-/Betriebswirt).", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-aufstiegsbafoeg", "Aufstiegs-BAföG", "Geförderte Teilnehmende der Aufstiegsfortbildung.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-weiterbildungsangebote-kammer", "Weiterbildungsangebote der Kammern", "Angebot und Belegung der Kammer-Weiterbildung.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "kammerpruefungen-zertifikate": [
        ("stp-kam-ausbildungspruefungen", "Ausbildungsprüfungen (Kammer)", "Durchgeführte Zwischen- und Abschlussprüfungen.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-sachkundepruefungen", "Sachkunde- und Befähigungsprüfungen", "Abgenommene Sachkunde- und Befähigungsnachweise.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-pruefer-ehrenamt", "Ehrenamtliche Prüfer", "Zahl der im Prüfungswesen tätigen Ehrenamtlichen.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-zertifikate-ausgestellt", "Ausgestellte Zertifikate", "Zahl ausgestellter Zeugnisse und Zertifikate.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kam-pruefungsausschuesse", "Prüfungsausschüsse", "Zahl und Besetzung der Prüfungsausschüsse.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 29. bundeswehr +9 (4 L3)
    "aGeoBw-geoinformation": [
        ("stp-bw-gelaendemodelle", "Militärische Geländemodelle", "Digitale Gelände- und Höhenmodelle des Geoinformationsdienstes.", "03", "TH_05", "OB_05", "GR_03", ["FT_03"], "LI_04", 3),
        ("stp-bw-geodaten-metadaten", "Geodaten-Metadaten", "Metadaten zu militärischen Geoinformationsprodukten.", "02", "TH_05", "OB_08", "GR_02", ["FT_04"], "LI_04", 3),
    ],
    "bundeswehr-haushalt-ruestung": [
        ("stp-bw-verteidigungshaushalt", "Verteidigungshaushalt", "Ausgaben des Verteidigungshaushalts nach Titel.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-bw-beschaffungsprojekte", "Beschaffungsprojekte", "Status großer Rüstungsbeschaffungsprojekte (Rüstungsbericht).", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "bundeswehr-personal": [
        ("stp-bw-personalstaerke", "Personalstärke", "Zahl der Soldaten und zivilen Beschäftigten nach Status.", "01", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-bw-nachwuchsgewinnung", "Nachwuchsgewinnung", "Bewerbungen und Einstellungen der Personalwerbung.", "02", "TH_05", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "bundeswehr-sanitaet": [
        ("stp-bw-sanitaetsversorgung", "Sanitätsversorgung", "Leistungen des Sanitätsdienstes in Bundeswehrkrankenhäusern.", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-bw-einsatzmedizin", "Einsatzmedizin", "Daten zur medizinischen Versorgung in Einsätzen.", "03", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_04", 3),
        ("stp-bw-wehrmedizin-forschung", "Wehrmedizinische Forschung", "Forschungsthemen und Publikationen der Wehrmedizin.", "01", "TH_10", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 30. justizbehörden +9 (3 L3)
    "gerichte-statistik": [
        ("stp-jus-verfahrenseingaenge", "Verfahrenseingänge", "Eingegangene Verfahren nach Gerichtsbarkeit (Justizstatistik).", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-jus-verfahrensdauer", "Verfahrensdauer", "Durchschnittliche Dauer von Gerichtsverfahren.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-jus-erledigungen", "Erledigungen", "Erledigte Verfahren nach Art der Erledigung.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "staatsanwaltschaften": [
        ("stp-jus-ermittlungsverfahren", "Ermittlungsverfahren", "Eingeleitete und abgeschlossene Ermittlungsverfahren.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-jus-anklagequote", "Anklage- und Einstellungsquote", "Verteilung der Verfahrensausgänge.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-jus-wirtschaftskriminalitaet", "Wirtschaftskriminalität", "Verfahren wegen Wirtschafts- und Korruptionsdelikten.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "strafvollzug-bewaehrung": [
        ("stp-jus-bewaehrungshilfe", "Bewährungshilfe", "Betreute Probanden der Bewährungshilfe.", "02", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-jus-rueckfallstatistik", "Rückfallstatistik", "Legalbewährung nach strafrechtlicher Sanktion.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-jus-haftvermeidung", "Haftvermeidung", "Maßnahmen und Fälle ambulanter Sanktionen.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 31. finanzbehörden +9 (3 L3)
    "steuerstatistik": [
        ("stp-fin-steueraufkommen", "Steueraufkommen nach Steuerart", "Kassenmäßiges Steueraufkommen nach Art (Steuerstatistik).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-fin-lohn-einkommensteuer", "Lohn- und Einkommensteuer", "Veranlagungsdaten zur Einkommensbesteuerung (aggregiert).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-fin-umsatzsteuer", "Umsatzsteuerstatistik", "Steuerpflichtige und Umsätze nach Wirtschaftszweig.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "bundesrechnungshof-berichte": [
        ("stp-fin-steuerpruefung", "Betriebsprüfungsstatistik", "Ergebnisse der steuerlichen Betriebsprüfung.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-fin-steuerfahndung", "Steuerfahndung", "Fälle und Mehrergebnisse der Steuerfahndung.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-fin-steuerschaetzung", "Steuerschätzung", "Ergebnisse des Arbeitskreises Steuerschätzungen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    "haushalt-schulden": [
        ("stp-fin-bundeshaushalt", "Bundeshaushalt", "Einnahmen und Ausgaben des Bundeshaushalts nach Einzelplan.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-fin-staatsverschuldung", "Staatsverschuldung", "Schuldenstand des Gesamtstaates (Maastricht).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-fin-laenderfinanzausgleich", "Länderfinanzausgleich", "Zahlungen im bundesstaatlichen Finanzausgleich.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 32. zollverwaltung +9 (3 L3)
    "zoll-aussenhandel": [
        ("stp-zol-einfuhrabgaben", "Einfuhrabgaben", "Erhobene Zölle und Einfuhrumsatzsteuer.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-zol-warenstroeme", "Warenströme", "Zollrechtlich erfasste Im- und Exporte nach Warengruppe.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-zol-verbrauchsteuern", "Verbrauchsteuern", "Aufkommen von Energie-, Tabak- und Alkoholsteuer.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "zoll-verbote-beschlagnahmen": [
        ("stp-zol-produktpiraterie", "Produktpiraterie-Aufgriffe", "Beschlagnahmte Waren wegen Schutzrechtsverletzung.", "01", "TH_08", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-zol-rauschgift-aufgriffe", "Rauschgift-Aufgriffe", "Sichergestellte Betäubungsmittel im Zoll.", "02", "TH_08", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-zol-artenschutz", "Artenschutz-Kontrollen", "Aufgriffe nach Washingtoner Artenschutzübereinkommen.", "01", "TH_09", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "zoll-personal-infrastruktur": [
        ("stp-zol-schwarzarbeit", "Bekämpfung Schwarzarbeit (FKS)", "Prüfungen und Ergebnisse der Finanzkontrolle Schwarzarbeit.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-zol-mindestlohn-kontrollen", "Mindestlohn-Kontrollen", "Kontrollen zur Einhaltung des Mindestlohns.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-zol-dienststellen", "Zoll-Dienststellen", "Standorte und Zuständigkeiten der Zolldienststellen.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # 33. nachrichtendienste +9 (3 L3)
    "verfassungsschutzbericht": [
        ("stp-nd-extremismus-personenpotenzial", "Extremismus-Personenpotenzial", "Geschätztes Personenpotenzial extremistischer Bestrebungen (Verfassungsschutzbericht).", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-nd-beobachtungsobjekte", "Beobachtungsobjekte", "Zahl der beobachteten Organisationen nach Phänomenbereich.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-nd-verbote-organisationen", "Vereins- und Organisationsverbote", "Ausgesprochene Verbote extremistischer Vereinigungen.", "01", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "spionageabwehr-statistik": [
        ("stp-nd-cyberangriffe-staatlich", "Staatliche Cyberangriffe", "Erfasste staatlich gesteuerte Cyberspionage-Aktivitäten.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-nd-wirtschaftsspionage", "Wirtschaftsspionage", "Lagebild zu Wirtschafts- und Wissenschaftsspionage.", "02", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-nd-proliferation", "Proliferationsabwehr", "Erkenntnisse zur Verbreitung von Rüstungsgütern.", "03", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "extremismus-statistik": [
        ("stp-nd-politisch-motivierte-kriminalitaet", "Politisch motivierte Kriminalität", "Fallzahlen politisch motivierter Straftaten nach Phänomenbereich.", "01", "TH_08", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-nd-gefaehrder", "Gefährder-Einstufungen", "Zahl der als Gefährder eingestuften Personen.", "03", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_04", 3),
        ("stp-nd-aussteigerprogramme", "Aussteigerprogramme", "Teilnahme an Deradikalisierungs- und Aussteigerprogrammen.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 34. statistisches_amt +9 (3 L3)
    "amtliche_statistiken": [
        ("stp-sta-vgr", "Volkswirtschaftliche Gesamtrechnungen", "Daten der VGR (BIP, Wertschöpfung) nach Region.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 5),
        ("stp-sta-verbraucherpreisindex", "Verbraucherpreisindex", "Preisindizes und Inflationsraten.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 4),
        ("stp-sta-mikrozensus", "Mikrozensus", "Ergebnisse der größten Haushaltsbefragung (aggregiert).", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_02", 4),
    ],
    "zensus_daten": [
        ("stp-sta-zensus-bevoelkerung", "Zensus Bevölkerung", "Amtliche Einwohnerzahlen aus dem Zensus.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-sta-zensus-gebaeude-wohnungen", "Zensus Gebäude und Wohnungen", "Gebäude- und Wohnungsdaten aus dem Zensus.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_02", 4),
        ("stp-sta-zensus-erwerbstaetigkeit", "Zensus Erwerbstätigkeit", "Erwerbs- und Bildungsmerkmale aus dem Zensus.", "01", "TH_04", "OB_01", "GR_03", ["FT_01"], "LI_02", 3),
    ],
    "arbeitsmarkt-sozialstatistik": [
        ("stp-sta-erwerbstaetigenrechnung", "Erwerbstätigenrechnung", "Erwerbstätige nach Wirtschaftsbereich und Region.", "01", "TH_04", "OB_03", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-sta-verdienststatistik", "Verdienststatistik", "Bruttoverdienste und Arbeitskosten nach Branche.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("stp-sta-armutsgefaehrdung", "Armutsgefährdungsquote", "Armutsgefährdung und Einkommensverteilung nach Region.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_02", 4),
    ],
    # 35. bundesforschungsanstalten +9 (3 L3)
    "lebensmittelsicherheit-risikobewertung": [
        ("stp-bfa-lebensmittel-rueckstaende", "Lebensmittel-Rückstände", "Untersuchungsergebnisse zu Rückständen und Kontaminanten.", "01", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-bfa-zoonosen-monitoring", "Zoonosen-Monitoring", "Daten zur Überwachung von Zoonoseerregern.", "01", "TH_01", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-bfa-risikobewertungen", "Wissenschaftliche Risikobewertungen", "Veröffentlichte Risikobewertungen und Stellungnahmen.", "01", "TH_10", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
    ],
    "agrar-forstforschung": [
        ("stp-bfa-bodenzustand", "Bodenzustandserhebung", "Ergebnisse der Boden- und Waldbodenzustandserhebung.", "01", "TH_09", "OB_04", "GR_03", ["FT_01"], "LI_02", 3),
        ("stp-bfa-waldzustand", "Waldzustandserhebung", "Kronenzustand und Vitalität der Wälder.", "01", "TH_09", "OB_04", "GR_03", ["FT_01"], "LI_02", 4),
        ("stp-bfa-pflanzengesundheit", "Pflanzengesundheit", "Monitoring von Pflanzenkrankheiten und Schadorganismen.", "01", "TH_09", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "metrologie-materialforschung": [
        ("stp-bfa-normale-kalibrierung", "Normale und Kalibrierung", "Bereitgestellte Maßnormale und Kalibrierdienste (PTB).", "01", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_02", 3),
        ("stp-bfa-materialpruefung", "Materialprüfung", "Prüf- und Zertifizierungsdaten zu Werkstoffen (BAM).", "02", "TH_10", "OB_04", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-bfa-referenzmaterialien", "Referenzmaterialien", "Bereitgestellte zertifizierte Referenzmaterialien.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 36. landesmedienanstalten +9 (3 L3)
    "rundfunklizenzierung": [
        ("stp-lma-zulassungen-private", "Zulassungen privater Anbieter", "Erteilte Zulassungen für privaten Rundfunk.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-frequenzzuweisungen", "Frequenz- und Kapazitätszuweisungen", "Zugewiesene Übertragungskapazitäten (UKW, DAB+).", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-buergermedien-foerderung", "Förderung von Bürgermedien", "Geförderte Bürger- und nichtkommerzielle Sender.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "medienkonzentration-kontrolle": [
        ("stp-lma-beteiligungskontrolle", "Beteiligungskontrolle", "Geprüfte Beteiligungsveränderungen im Rundfunk.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-zuschaueranteile", "Zuschaueranteile (Medienkonzentration)", "Erhobene Zuschaueranteile zur Konzentrationskontrolle.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-plattformregulierung-lma", "Plattform- und Intermediärsaufsicht", "Aufsichtsfälle zu Medienplattformen und Intermediären.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "jugendmedienschutz": [
        ("stp-lma-jugendschutz-verfahren", "Jugendschutzverfahren", "Eingeleitete Verfahren wegen Jugendschutzverstößen.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-medienkompetenz-projekte", "Medienkompetenz-Projekte", "Geförderte Projekte zur Medienkompetenzförderung.", "01", "TH_02", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-lma-werbeaufsicht", "Werbeaufsicht", "Beanstandungen und Verfahren der Werberegulierung.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 37. stadtverwaltung +9 (3 L3)
    "stadtverwaltung-allgemein": [
        ("stp-svw-organigramm-stellen", "Organisation und Stellenplan", "Aufbauorganisation und Stellenplan der Verwaltung.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-svw-personalbestand", "Personalbestand", "Beschäftigte der Kommunalverwaltung nach Bereich.", "01", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-svw-ratsbeschluesse", "Verwaltungsentscheidungen", "Umgesetzte Beschlüsse und Verwaltungsvorlagen.", "01", "TH_05", "OB_02", "GR_03", ["FT_02"], "LI_02", 3),
    ],
    "stadtverwaltung-buerger": [
        ("stp-svw-buergeranfragen", "Bürgeranfragen und -anliegen", "Eingegangene Anliegen über Mängelmelder und Servicekanäle.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-svw-bearbeitungszeiten", "Bearbeitungszeiten", "Durchschnittliche Bearbeitungsdauer von Anträgen.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-svw-buergerbefragung", "Bürgerbefragungen", "Ergebnisse kommunaler Zufriedenheitsbefragungen.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "stadtverwaltung-immobilien": [
        ("stp-svw-liegenschaften-kommunal", "Kommunale Liegenschaften", "Bestand kommunaler Grundstücke und Gebäude.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("stp-svw-gebaeudemanagement", "Gebäudemanagement", "Bewirtschaftungs- und Energiekennzahlen kommunaler Gebäude.", "01", "TH_06", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-svw-immobilienverkaeufe", "Grundstücksgeschäfte", "Erworbene und veräußerte kommunale Grundstücke.", "02", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 38. buergeramt +9 (3 L3)
    "buergeramt-meldewesen": [
        ("stp-bua-ausweisdokumente", "Ausweisdokumente", "Ausgestellte Personalausweise und Reisepässe.", "02", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-meldebescheinigungen", "Meldebescheinigungen", "Ausgestellte Melde- und Aufenthaltsbescheinigungen.", "02", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-fuehrungszeugnisse", "Führungszeugnisse", "Beantragte polizeiliche Führungszeugnisse.", "02", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "buergeramt-onlinedienste": [
        ("stp-bua-termin-buchungen", "Online-Terminbuchungen", "Über das Terminsystem gebuchte Vorsprachen.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-digitale-antraege", "Digitale Anträge", "Online eingereichte Anträge nach Leistungsart.", "01", "TH_05", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-wartezeiten", "Wartezeiten im Bürgeramt", "Durchschnittliche Warte- und Vorlaufzeiten.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "buergeramt-sozialleistungen": [
        ("stp-bua-wohngeldantraege", "Wohngeldanträge", "Bearbeitete Wohngeldanträge und Bewilligungen.", "02", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-elterngeld", "Eltern- und Erziehungsgeld", "Bearbeitete Elterngeldanträge.", "02", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-bua-leistungsbescheide", "Leistungsbescheide", "Ausgestellte Bescheide kommunaler Sozialleistungen.", "02", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 39. schulamt +9 (3 L3)
    "schulamt-schulentwicklung": [
        ("stp-sch-schulnetzplanung", "Schulnetzplanung", "Planungsdaten zu Schulstandorten und Kapazitäten.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sch-schuelerprognose", "Schülerzahlprognose", "Vorausberechnung der Schülerzahlen.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-sch-ganztagsausbau", "Ganztagsausbau", "Stand des Ausbaus ganztägiger Bildungsangebote.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "schulamt-ausstattung": [
        ("stp-sch-lernmittel", "Lernmittelausstattung", "Bereitgestellte Lernmittel und Budgets.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sch-schulbau-investitionen", "Schulbauinvestitionen", "Investitionen in Neubau und Sanierung von Schulen.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sch-it-ausstattung-schulen", "IT-Ausstattung der Schulen", "Ausstattungsgrad mit digitaler Infrastruktur.", "01", "TH_02", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "schulamt-personal": [
        ("stp-sch-verwaltungspersonal", "Schulverwaltungspersonal", "Nicht-lehrendes Personal an Schulen (Sekretariat, Hausmeister).", "01", "TH_05", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sch-schulbegleiter-einsatz", "Schulbegleiter-Einsatz", "Eingesetzte Schulbegleitungen und Integrationshelfer.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-sch-vertretungsreserve", "Vertretungsreserve", "Verfügbare Vertretungskräfte und Einsatztage.", "01", "TH_02", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 40. kaemmerei +9 (3 L3)
    "kaemmerei-haushalt": [
        ("stp-kae-ergebnishaushalt", "Ergebnishaushalt", "Erträge und Aufwendungen im doppischen Ergebnishaushalt.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-kae-finanzhaushalt", "Finanzhaushalt", "Ein- und Auszahlungen im Finanzhaushalt.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kae-jahresabschluss", "Jahresabschluss", "Bilanz und Ergebnisrechnung des kommunalen Jahresabschlusses.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "kaemmerei-schulden": [
        ("stp-kae-kreditmarktschulden", "Kreditmarktschulden", "Bestand und Konditionen der Kreditmarktschulden.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kae-kassenkredite", "Kassenkredite", "Stand der Liquiditäts-/Kassenkredite.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kae-buergschaften", "Bürgschaften und Gewährleistungen", "Übernommene kommunale Bürgschaften.", "02", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "kaemmerei-steuern": [
        ("stp-kae-gewerbesteuer-aufkommen", "Gewerbesteueraufkommen", "Aufkommen und Hebesatz der Gewerbesteuer.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-kae-grundsteuer", "Grundsteuer", "Aufkommen der Grundsteuer A und B.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-kae-gemeindeanteile", "Gemeindeanteile an Bundessteuern", "Anteile an Einkommen- und Umsatzsteuer.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 41. jugendamt +9 (3 L3)
    "jugendamt-kita": [
        ("stp-jug-kita-bedarfsplanung", "Kita-Bedarfsplanung", "Bedarfsplanung der Kindertagesbetreuung.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-jug-tagespflege", "Kindertagespflege", "Plätze und Tagespflegepersonen in der Tagespflege.", "01", "TH_03", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-jug-kita-zuschuesse", "Kita-Zuschüsse", "Zuschüsse an Kita-Träger und Finanzierungsdaten.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "jugendamt-hilfen": [
        ("stp-jug-hilfen-erziehung", "Hilfen zur Erziehung", "Gewährte Hilfen zur Erziehung nach Hilfeart.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-jug-inobhutnahmen", "Inobhutnahmen", "Zahl der vorläufigen Schutzmaßnahmen für Kinder.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-jug-pflegekinder", "Pflege- und Heimkinder", "Kinder in Vollzeitpflege und Heimerziehung.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "jugendamt-praevention": [
        ("stp-jug-fruehe-hilfen", "Frühe Hilfen", "Angebote und Reichweite der Frühen Hilfen für Familien.", "01", "TH_03", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-jug-kinderschutz-meldungen", "Kinderschutzmeldungen", "Gemeldete Gefährdungseinschätzungen nach § 8a.", "02", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-jug-jugendarbeit-foerderung", "Förderung der Jugendarbeit", "Geförderte Angebote der offenen Jugendarbeit.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 42. sozialamt +9 (3 L3)
    "sozialamt-grundsicherung": [
        ("stp-soz-grundsicherung-empfaenger", "Grundsicherungsempfänger", "Empfänger von Hilfe zum Lebensunterhalt und Grundsicherung.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-soz-leistungsausgaben", "Sozialleistungsausgaben", "Ausgaben für Sozialhilfeleistungen nach Art.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-soz-bildung-teilhabe", "Bildung und Teilhabe", "In Anspruch genommene Leistungen des Bildungspakets.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "sozialamt-pflege": [
        ("stp-soz-hilfe-zur-pflege", "Hilfe zur Pflege", "Empfänger und Ausgaben der Hilfe zur Pflege.", "02", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-soz-pflegebeduerftige", "Pflegebedürftige", "Zahl der Pflegebedürftigen nach Pflegegrad.", "01", "TH_01", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-soz-pflegestuetzpunkte", "Pflegestützpunkte", "Beratungskontakte der kommunalen Pflegeberatung.", "01", "TH_01", "OB_07", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "sozialamt-integration": [
        ("stp-soz-eingliederungshilfe", "Eingliederungshilfe", "Leistungen der Eingliederungshilfe für Menschen mit Behinderung.", "02", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("stp-soz-schwerbehinderte", "Schwerbehinderte Menschen", "Zahl anerkannter schwerbehinderter Menschen.", "01", "TH_03", "OB_01", "GR_03", ["FT_01"], "LI_03", 3),
        ("stp-soz-teilhabe-arbeit", "Teilhabe am Arbeitsleben", "Maßnahmen zur Teilhabe am Arbeitsleben.", "01", "TH_03", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # 43. datenschutzbehoerden +9 (3 L3)
    "datenschutz-aufsicht-kontrolle": [
        ("stp-dsb-beschwerden", "Datenschutzbeschwerden", "Eingegangene Beschwerden Betroffener nach Bereich.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-dsb-datenpannen", "Gemeldete Datenpannen", "Meldungen von Datenschutzverletzungen nach Art. 33 DSGVO.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-dsb-bussgelder", "Datenschutz-Bußgelder", "Verhängte Bußgelder nach DSGVO.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "datenschutz-beratung-information": [
        ("stp-dsb-beratungsanfragen", "Beratungsanfragen", "Beratungsanfragen von Verantwortlichen und Bürgern.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-dsb-taetigkeitsbericht", "Tätigkeitsbericht", "Kennzahlen aus dem jährlichen Tätigkeitsbericht.", "01", "TH_08", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
        ("stp-dsb-schulungen-dsb", "Schulungen und Aufklärung", "Durchgeführte Sensibilisierungs- und Schulungsangebote.", "01", "TH_08", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "datenschutz-technisch-organisatorisch": [
        ("stp-dsb-pruefungen-vorort", "Vor-Ort-Prüfungen", "Durchgeführte anlassbezogene und anlasslose Kontrollen.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-dsb-folgenabschaetzungen", "Datenschutz-Folgenabschätzungen", "Begleitete und geprüfte DSFA-Verfahren.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-dsb-zertifizierungen", "Zertifizierungen und Verhaltensregeln", "Genehmigte Verhaltensregeln und Zertifizierungen.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 44. regulierungsbehoerden +9 (3 L3)
    "regulierung-marktaufsicht": [
        ("stp-reg-marktmissbrauch", "Marktmissbrauchsverfahren", "Verfahren wegen Markt- und Wettbewerbsverstößen.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-reg-fusionskontrolle", "Fusionskontrolle", "Angemeldete und geprüfte Zusammenschlüsse.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-reg-kartellverfahren", "Kartellverfahren", "Eingeleitete Kartell- und Bußgeldverfahren.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "regulierung-verbraucherschutz": [
        ("stp-reg-verbraucherbeschwerden-behoerde", "Verbraucherbeschwerden", "Eingegangene Beschwerden zu regulierten Märkten.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-reg-produktrueckrufe", "Produktrückrufe", "Veröffentlichte Produktwarnungen und -rückrufe.", "01", "TH_08", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("stp-reg-marktueberwachung", "Marktüberwachung", "Geprüfte Produkte und festgestellte Mängel.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "regulierung-netzinfrastruktur": [
        ("stp-reg-netzentgelte", "Netzentgelte", "Genehmigte Entgelte für Energie- und Telekommunikationsnetze.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-reg-versorgungsqualitaet", "Versorgungsqualität", "Kennzahlen zur Versorgungssicherheit (z. B. SAIDI).", "01", "TH_06", "OB_04", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-reg-frequenzvergabe", "Frequenzvergabe", "Vergebene Funkfrequenzen und Auktionsergebnisse.", "01", "TH_10", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # 45. bundesrechnungshof +9 (3 L3)
    "rechnungshof-pruefberichte": [
        ("stp-brh-pruefungsfeststellungen", "Prüfungsfeststellungen", "Veröffentlichte Feststellungen und Bemerkungen.", "01", "TH_07", "OB_02", "GR_02", ["FT_02"], "LI_02", 4),
        ("stp-brh-einsparpotenziale", "Einsparpotenziale", "Identifizierte Einspar- und Effizienzpotenziale.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
        ("stp-brh-pruefungsthemen", "Prüfungsthemen", "Schwerpunkte und Zahl der Prüfungen je Bereich.", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "rechnungshof-haushaltskontrolle": [
        ("stp-brh-haushaltsrechnung", "Haushaltsrechnung", "Prüfung der Haushalts- und Vermögensrechnung des Bundes.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_02", 4),
        ("stp-brh-entlastungsverfahren", "Entlastungsverfahren", "Daten zum parlamentarischen Entlastungsverfahren.", "01", "TH_07", "OB_02", "GR_02", ["FT_01"], "LI_02", 3),
        ("stp-brh-foerdercontrolling", "Förder-Controlling", "Prüfungen der Wirtschaftlichkeit von Förderprogrammen.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "rechnungshof-beratung-empfehlungen": [
        ("stp-brh-beratungsberichte", "Beratungsberichte", "Veröffentlichte Beratungsberichte an Parlament und Regierung.", "01", "TH_07", "OB_02", "GR_02", ["FT_02"], "LI_02", 3),
        ("stp-brh-umsetzungskontrolle", "Umsetzungskontrolle", "Nachverfolgung der Umsetzung von Empfehlungen.", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
        ("stp-brh-pruefungsamt-vorpruefung", "Vorprüfungsstellen", "Ergebnisse der Vorprüfung durch Prüfungsämter.", "01", "TH_07", "OB_08", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    # 46. strafvollzug +9 (3 L3)
    "strafvollzug-belegung-statistik": [
        ("stp-stv-belegungszahlen", "Belegungszahlen", "Gefangene und Verwahrte nach Vollzugsart (Strafvollzugsstatistik).", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("stp-stv-haftplaetze", "Haftplatzkapazität", "Verfügbare Haftplätze und Auslastung der Anstalten.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-stv-gefangenenstruktur", "Gefangenenstruktur", "Struktur der Inhaftierten nach Delikt und Strafdauer.", "02", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "strafvollzug-massnahmen-resozialisierung": [
        ("stp-stv-vollzugslockerungen", "Vollzugslockerungen", "Gewährte Lockerungen und Ausgänge.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-stv-arbeit-ausbildung", "Arbeit und Ausbildung im Vollzug", "Beschäftigung und Qualifizierung von Gefangenen.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-stv-uebergangsmanagement", "Übergangsmanagement", "Maßnahmen zur Wiedereingliederung nach Haftentlassung.", "01", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "strafvollzug-sicherheit-personal": [
        ("stp-stv-besondere-vorkommnisse", "Besondere Vorkommnisse", "Erfasste Suizide, Entweichungen und Gewaltvorfälle.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-stv-personalausstattung", "Personalausstattung", "Personalbestand und -schlüssel im Justizvollzug.", "01", "TH_08", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("stp-stv-gesundheitsversorgung-haft", "Gesundheitsversorgung im Vollzug", "Medizinische und psychiatrische Versorgung der Gefangenen.", "02", "TH_01", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
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

    print(f"Gesamt hinzugefügt: {added}")
    bad = 0
    for l2 in data['children']:
        total = sum(len(l3.get('children', [])) for l3 in l2.get('children', []))
        if total < 69:
            bad += 1
            print(f"✗ {l2['id']}: {total} L4")
    print("alle L2 ≥69" if bad == 0 else f"{bad} L2 unter Ziel")

    with open(PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Geschrieben:", PATH)


main()
