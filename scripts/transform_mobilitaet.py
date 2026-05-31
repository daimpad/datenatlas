#!/usr/bin/env python3
"""
Split the oepnv-kfz L3 node in mobilitaet-verkehr into 5 separate L3 nodes.
"""
import json
import copy

INPUT_FILE = "public/data/sector_staat.json"
OUTPUT_FILE = "public/data/sector_staat.json"

C_L3 = "#1abc9c"   # L3 node color (same as existing siblings)
C_L4 = "#27ae60"   # L4 node color (OP_01 indicator green, consistent with existing nodes)

def find_and_replace_l2(node, target_id, new_children_for_oepnv_kfz):
    """Find mobilitaet-verkehr L2, replace oepnv-kfz with 5 new L3 nodes."""
    if node.get('id') == target_id:
        new_children = []
        for child in node.get('children', []):
            if child.get('id') == 'oepnv-kfz':
                new_children.extend(new_children_for_oepnv_kfz)
            else:
                new_children.append(child)
        node['children'] = new_children
        return True
    for child in node.get('children', []):
        if find_and_replace_l2(child, target_id, new_children_for_oepnv_kfz):
            return True
    return False

def get_l4_by_id(oepnv_children, node_id):
    for n in oepnv_children:
        if n['id'] == node_id:
            return copy.deepcopy(n)
    raise KeyError(f"L4 node '{node_id}' not found in oepnv-kfz children")

def make_l3(id_, name, description, children):
    return {
        "id": id_,
        "level": 3,
        "name": name,
        "color": C_L3,
        "description": description,
        "children": children
    }

def new_l4(id_, name, description, op_cls, op_lbl, op_expl,
           th_code, th_label, ob_code, ob_label, gr_code, gr_label,
           formats, li_code, li_label, relevance, processes):
    return {
        "id": id_,
        "level": 4,
        "name": name,
        "color": C_L4,
        "details": {
            "description": description,
            "openness": {
                "class": op_cls,
                "label": op_lbl,
                "explanation": op_expl
            },
            "theme": {"code": th_code, "label": th_label},
            "object": {"code": ob_code, "label": ob_label},
            "granularity": {"code": gr_code, "label": gr_label},
            "format": [{"code": fc, "label": fl} for fc, fl in formats],
            "license": {"code": li_code, "label": li_label},
            "relevance": relevance,
            "processes": [{"method": pm, "description": pd} for pm, pd in processes]
        }
    }

def main():
    with open(INPUT_FILE, encoding="utf-8") as f:
        data = json.load(f)

    # Collect the existing oepnv-kfz children
    def find_node(node, nid):
        if node.get('id') == nid:
            return node
        for c in node.get('children', []):
            r = find_node(c, nid)
            if r:
                return r
        return None

    oepnv_kfz = find_node(data, 'oepnv-kfz')
    if not oepnv_kfz:
        raise RuntimeError("oepnv-kfz node not found!")

    old_children = oepnv_kfz['children']

    # ==================================================================
    # 1. Schienenpersonennahverkehr
    # ==================================================================
    spnv_netz = new_l4(
        id_="spnv-netz",
        name="Schienennetz & Streckeninfrastruktur",
        description=(
            "Topologie des regionalen Schienennetzes: Gleisverläufe, Streckenabschnitte, "
            "Betriebsbahnhöfe und technische Parameter (Elektrifizierung, Streckenklasse). "
            "Grundlage für Netzplanung, Kapazitätsanalysen und multimodale Routenplanung."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Schienennetz-Geodaten bilden öffentliche Infrastruktur ab und enthalten keinen "
            "Personenbezug. Die DB Netz AG veröffentlicht Teile der Netztopologie bereits "
            "als Open Data über die Mobilithek."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_05", ob_label="Geodaten",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_05", "GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=4,
        processes=[
            ("Planung & Steuerung",
             "Strecken- und Netztopologie ist Grundlage für Netzentwicklungspläne, "
             "Fahrplankonstruktion und Investitionsplanung im Schienenpersonennahverkehr."),
            ("Monitoring & Evaluation",
             "Streckendaten ermöglichen die Auswertung von Pünktlichkeit, Kapazitätsauslastung "
             "und Infrastrukturzustand auf Linien- und Streckenabschnittsebene.")
        ]
    )

    haltestellen_schiene = new_l4(
        id_="haltestellen-schiene",
        name="Bahnhofsdaten & Haltestellenkataster Schiene",
        description=(
            "Standortdaten aller Bahnhöfe und Haltepunkte im Schienennetz: Koordinaten, "
            "Bahnsteigdaten, Ausstattungsmerkmale (Aufzüge, Parkplätze, Fahrradabstellanlagen), "
            "Barrierefreiheitsstatus und Betriebsklassifizierung."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Haltestellendaten beschreiben öffentliche Infrastruktur ohne Personenbezug. "
            "Sie sind Pflichtbestandteil des Nationalen Zugangspunkts (NeTEx-Standard) "
            "und werden von DB Station&Service bereits teilweise als Open Data bereitgestellt."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_03", ob_label="Verzeichnis / Register",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_02", "JSON / GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=4,
        processes=[
            ("Beratung & Begleitung",
             "Haltestellendaten fließen in Fahrgastinformationssysteme, Routenplaner und "
             "Barrierefreiheits-Apps ein."),
            ("Planung & Steuerung",
             "Ausstattungskataster unterstützt die Priorisierung von Modernisierungs- "
             "und Barrierefreiheitsinvestitionen.")
        ]
    )

    schienen_oepnv = make_l3(
        id_="schienen-oepnv",
        name="Schienenpersonennahverkehr",
        description=(
            "Schienengebundener ÖPNV: Liniennetz, Fahrplandaten, Fahrgastzahlen und "
            "Barrierefreiheit von S-Bahn, U-Bahn, Straßenbahn und Regionalbahn."
        ),
        children=[
            get_l4_by_id(old_children, "oepnv-liniennetz"),
            get_l4_by_id(old_children, "oepnv-fahrgastzahl"),
            get_l4_by_id(old_children, "oepnv-barrierefreiheit"),
            spnv_netz,
            haltestellen_schiene,
        ]
    )

    # ==================================================================
    # 2. Straßengebundener ÖPNV
    # ==================================================================
    bus_liniennetz = new_l4(
        id_="bus-liniennetz",
        name="Busliniennetz & Fahrplandaten",
        description=(
            "GTFS-Fahrplandaten speziell für den straßengebundenen Busverkehr: Linienverläufe, "
            "Haltestellen, Abfahrtszeiten, Umlaufpläne und Betriebskalender für Stadt-, Regional- "
            "und Nachtbuslinien."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Bus-GTFS-Daten enthalten keinen Personenbezug und sind Grundlage für Routenplaner "
            "und Fahrgastinformationssysteme. Zahlreiche Verkehrsverbünde stellen GTFS-Feeds "
            "bereits als Open Data bereit."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_06", ob_label="Zeitreihen",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_02", "JSON / GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=4,
        processes=[
            ("Beratung & Begleitung",
             "Fahrplandaten sind Grundlage für Fahrgastinformationssysteme, Haltestellen-Displays "
             "und multimodale Mobilitäts-Apps."),
            ("Planung & Steuerung",
             "Linienverläufe und Taktfrequenzen werden von kommunalen Aufgabenträgern "
             "zur Angebotsoptimierung und Netzentwicklung genutzt.")
        ]
    )

    bushaltestellenkataster = new_l4(
        id_="bushaltestellenkataster",
        name="Bushaltestellen-Kataster",
        description=(
            "Standortdaten aller Bushaltestellen: geografische Koordinaten, Ausstattungsmerkmale "
            "(Wetterschutz, Sitzgelegenheiten, digitale Anzeigen), Barrierefreiheitsstatus "
            "(taktile Leitsysteme, Bordsteinhöhen) und Eigentumsverhältnisse."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Haltestellenkataster-Daten beschreiben öffentliche Infrastruktur ohne Personenbezug. "
            "Sie sind nach dem Nationalen Zugangspunkt (NeTEx) als Open Data bereitzustellen "
            "und werden von vielen Kommunen bereits veröffentlicht."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_05", ob_label="Geodaten",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_05", "GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=3,
        processes=[
            ("Planung & Steuerung",
             "Haltestellenkataster ermöglicht die systematische Priorisierung von "
             "Ausstattungs- und Barrierefreiheitsmaßnahmen."),
            ("Monitoring & Evaluation",
             "Zustandsdaten der Haltestellen unterstützen das kommunale "
             "Infrastrukturmanagement und die Qualitätskontrolle.")
        ]
    )

    bus_fahrgastzahlen = new_l4(
        id_="bus-fahrgastzahlen",
        name="Bus-Fahrgastzahlen (liniengenau)",
        description=(
            "Linienspezifische Fahrgastzählungen im Stadtbusverkehr: Einsteigermengen nach "
            "Haltestelle und Zeitperiode, Auslastungsgrade und saisonale Schwankungen. "
            "Grundlage für die Netzoptimierung und Betriebsplanung."
        ),
        op_cls="OP_02", op_lbl="Gelb — nach Aufbereitung publizierbar",
        op_expl=(
            "Linienspezifische Fahrgastzahlen können bei sehr geringem Fahrgastaufkommen "
            "Rückschlüsse auf Nutzungsmuster ermöglichen. Aggregierung auf Wochentags-/Stunden-Ebene "
            "und Mindestfallzahl-Prüfung empfohlen vor Veröffentlichung."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_06", ob_label="Zeitreihen",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_01", "CSV")],
        li_code="LI_02", li_label="CC BY 4.0",
        relevance=3,
        processes=[
            ("Monitoring & Evaluation",
             "Fahrgastzahlen dokumentieren die Nutzung des Busnetzes und sind Grundlage "
             "für Leistungsberichte gegenüber kommunalen Aufgabenträgern."),
            ("Planung & Steuerung",
             "Nachfragedaten leiten Entscheidungen über Taktanpassungen, Linienführungen "
             "und Fahrzeugeinsatzplanung.")
        ]
    )

    strassen_oepnv = make_l3(
        id_="strassen-oepnv",
        name="Straßengebundener ÖPNV",
        description=(
            "Busverkehr und straßengebundene ÖPNV-Formen: Liniennetz, Haltestellenkataster, "
            "Vertriebsstellen und Fahrgastzahlen."
        ),
        children=[
            get_l4_by_id(old_children, "oepnv-vertrieb"),
            bus_liniennetz,
            bushaltestellenkataster,
            bus_fahrgastzahlen,
        ]
    )

    # ==================================================================
    # 3. Motorisierter Individualverkehr (MIV)
    # ==================================================================
    miv = make_l3(
        id_="miv",
        name="Motorisierter Individualverkehr (MIV)",
        description=(
            "Kfz-Verkehr, Parkraum, Zulassungsstatistiken, Ladeinfrastruktur für E-Fahrzeuge "
            "sowie ergänzende Mobilitätsangebote wie Taxi und Carsharing."
        ),
        children=[
            get_l4_by_id(old_children, "kfz-parkplatz"),
            get_l4_by_id(old_children, "kfz-messung"),
            get_l4_by_id(old_children, "kfz-fahrzeugzulassung"),
            get_l4_by_id(old_children, "verkehrsmessung-bericht"),
            get_l4_by_id(old_children, "ev-ladestationen"),
            get_l4_by_id(old_children, "taxistandplaetze"),
            get_l4_by_id(old_children, "kfz-tankstelle"),
            get_l4_by_id(old_children, "kfz-carsharing"),
        ]
    )

    # ==================================================================
    # 4. Flugverkehr
    # ==================================================================
    fluglarm_kartierung = new_l4(
        id_="fluglarm-kartierung",
        name="Fluglärmkartierung",
        description=(
            "Lärmexpositionskarten rund um deutsche Flughäfen gemäß EU-Umgebungslärmrichtlinie "
            "(2002/49/EG): Lärmpegelbereiche (Lden, Lnight) als Flächenkartierung, "
            "betroffene Einwohnerzahlen und Aktionspläne zur Lärmminderung."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Lärmkarten sind nach der EU-Umgebungslärmrichtlinie als öffentlich zugängliche "
            "Daten bereitzustellen. Sie enthalten keine personenbezogenen Informationen "
            "und werden vom Umweltbundesamt und Ländern bereits veröffentlicht."
        ),
        th_code="TH_06", th_label="Umwelt",
        ob_code="OB_05", ob_label="Geodaten",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_05", "GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=3,
        processes=[
            ("Umwelt- & Klimaschutz",
             "Fluglärmkarten sind Grundlage für Lärmaktionspläne, Schallschutzprogramme "
             "und die Ausweisung von Lärmschutzzonen rund um Flughäfen."),
            ("Monitoring & Evaluation",
             "Periodische Neukartierung alle fünf Jahre ermöglicht die Bewertung der "
             "Lärmschutzmaßnahmen-Wirksamkeit.")
        ]
    )

    passagierstatistik_flug = new_l4(
        id_="passagierstatistik-flug",
        name="Passagierstatistik Luftfahrt",
        description=(
            "Passagier- und Frachtstatistiken der deutschen Flughäfen: Fluggastzahlen nach "
            "Flughafen, Strecke und Airline, Frachttonnagen, Flugbewegungen und Saisonalität. "
            "Erhoben vom Statistischen Bundesamt und Luftfahrt-Bundesamt."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Flughafenstatistiken sind aggregierte Betriebsdaten ohne Personenbezug. "
            "Das Statistische Bundesamt (Destatis) veröffentlicht Luftverkehrsstatistiken "
            "als Open Data."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_06", ob_label="Zeitreihen",
        gr_code="GR_02", gr_label="Lokal (Gemeinde/Kreis)",
        formats=[("FT_01", "CSV")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=3,
        processes=[
            ("Monitoring & Evaluation",
             "Passagierstatistiken belegen Verkehrsentwicklungen, Marktanteile und saisonale "
             "Schwankungen im Luftverkehr und dienen als Grundlage für Infrastrukturplanung."),
            ("Datenerhebung & Statistik",
             "Flughafen- und Streckenstatistiken fließen in regionale Wirtschaftsberichte "
             "und Klimaschutz-Monitoring (Emissionen des Luftverkehrs) ein.")
        ]
    )

    flugverkehr = make_l3(
        id_="flugverkehr",
        name="Flugverkehr",
        description=(
            "Flughafenstandorte, Flugbewegungsstatistiken, Passagierzahlen und "
            "Fluglärmkartierung."
        ),
        children=[
            get_l4_by_id(old_children, "flughafen-standorte"),
            get_l4_by_id(old_children, "flugbewegung-statistik"),
            fluglarm_kartierung,
            passagierstatistik_flug,
        ]
    )

    # ==================================================================
    # 5. Schiffs- und Fährverkehr
    # ==================================================================
    wasserstrassen_netz = new_l4(
        id_="wasserstrassen-netz",
        name="Wasserstraßennetz & Pegelstände",
        description=(
            "Topologie des Binnenwasserstraßennetzes: Streckenverläufe, Schleusenstandorte, "
            "Brücken mit lichten Höhen sowie Echtzeit- und historische Pegelstandsmessungen "
            "an Gewässern. Grundlage für Schifffahrtsplanung und Hochwassermanagement."
        ),
        op_cls="OP_01", op_lbl="Grün — sofort publizierbar",
        op_expl=(
            "Wasserstraßen-Geodaten und Pegelstandsdaten sind öffentliche Infrastruktur- "
            "und Umweltdaten ohne Personenbezug. Die Wasserstraßen- und Schifffahrtsverwaltung "
            "des Bundes (WSV) stellt Pegelstände und Netzdaten bereits als Open Data bereit."
        ),
        th_code="TH_07", th_label="Infrastruktur & Mobilität",
        ob_code="OB_04", ob_label="Messungen / Sensordaten",
        gr_code="GR_01", gr_label="Einzelereignis / Rohdaten",
        formats=[("FT_02", "JSON / GeoJSON")],
        li_code="LI_01", li_label="CC0 (Public Domain)",
        relevance=3,
        processes=[
            ("Planung & Steuerung",
             "Pegelstands- und Netzdaten steuern die Schleusenlogistik, Schiffsroutenplanung "
             "und Sperrungen bei Niedrig- oder Hochwasser."),
            ("Monitoring & Evaluation",
             "Langzeitreihen der Pegelstände dokumentieren hydrologische Veränderungen "
             "und die Auswirkungen des Klimawandels auf die Binnenschifffahrt.")
        ]
    )

    schiffsverkehr = make_l3(
        id_="schiffsverkehr",
        name="Schiffs- und Fährverkehr",
        description=(
            "Fähranlegestellen, Häfen, Passagierzahlen, Frachtstatistiken und "
            "Wasserstraßeninfrastruktur."
        ),
        children=[
            get_l4_by_id(old_children, "schiffsverkehr-anlegestelle"),
            get_l4_by_id(old_children, "schiffsverkehr-passagiere"),
            get_l4_by_id(old_children, "schiffsverkehr-fracht"),
            wasserstrassen_netz,
        ]
    )

    # ==================================================================
    # Replace oepnv-kfz with the 5 new L3 nodes
    # ==================================================================
    five_new_l3 = [
        schienen_oepnv,
        strassen_oepnv,
        miv,
        flugverkehr,
        schiffsverkehr,
    ]

    replaced = find_and_replace_l2(data, 'mobilitaet-verkehr', five_new_l3)
    if not replaced:
        raise RuntimeError("mobilitaet-verkehr L2 node not found!")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Done! File written to", OUTPUT_FILE)

    # Quick sanity check
    with open(OUTPUT_FILE, encoding="utf-8") as f:
        data2 = json.load(f)

    def find_node2(node, nid):
        if node.get('id') == nid:
            return node
        for c in node.get('children', []):
            r = find_node2(c, nid)
            if r:
                return r
        return None

    mob = find_node2(data2, 'mobilitaet-verkehr')
    print(f"\nmobilitaet-verkehr now has {len(mob['children'])} L3 children:")
    for l3 in mob['children']:
        print(f"  L3: {l3['id']} - {l3['name']} ({len(l3.get('children', []))} L4 nodes)")

if __name__ == "__main__":
    main()
