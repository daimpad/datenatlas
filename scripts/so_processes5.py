#!/usr/bin/env python3
"""Sprint S-O: Add 5th process entry to all L4 nodes."""
import json, re

FILES = [
    'public/data/sector_staat.json',
    'public/data/sector_wirtschaft.json',
    'public/data/sector_wissenschaft.json',
    'public/data/sector_zivilgesellschaft.json',
    'public/data/sector_medien.json',
    'public/data/sector_religion.json',
    'public/data/sector_bildung.json',
]

RULES = [
    (r'geodat|karte|raum|fl.che|topograph|koordinat|gis|geograph|standort',
     'Open-Data-Publikation auf GovData',
     'Bereitstellung der Geodaten zu {name} als offener Datensatz auf dem nationalen Datenportal GovData.de nach DCAT-AP.de-Standard.'),
    (r'klima|emission|luftquali|temperatur|nieder|wetter|umwelt|natur|biodiversit|gewässer|boden',
     'Umweltberichterstattung nach EU-Recht',
     'Regelmäßige Meldung der Umweltdaten aus {name} an zuständige EU-Behörden (EEA, ECHA) gemäß gesetzlicher Berichtspflichten.'),
    (r'personal|mitarbeiter|besch.ftig|lohn|gehalt|arbeitnehmer|hr\b|ausbildung|qualifikation',
     'Anonymisierte Mikrodata-Bereitstellung',
     'Bereitstellung anonymisierter Mikrodaten zu {name} für Forschungszwecke über Scientific-Use-Files an akkreditierte Einrichtungen.'),
    (r'finanz|haushalt|budget|ausgab|einnahm|steuer|schuld|bilanz|buchf|rechnungslegung',
     'Maschinelle Prüfroutinen',
     'Automatisierte Plausibilitäts- und Konsistenzprüfungen der Finanzdaten in {name} nach HGB/IPSAS-Konventionen.'),
    (r'gesundheit|patient|diagnos|krank|medizin|pflege|therapie|epidemio|klinik|pharmaz',
     'Sekundärnutzung im Forschungsdatenzentrum',
     'Pseudonymisierte Weitergabe der Daten aus {name} an das Forschungsdatenzentrum Gesundheit für bevölkerungsweite Analysen.'),
    (r'bildung|schule|unterricht|lehr|studium|kurs|kompetenz|abschluss|prüfung|hochschule',
     'Länderübergreifendes Bildungsmonitoring',
     'Integration der Daten aus {name} in das nationale Bildungsmonitoring der KMK für bundesweite Vergleichsberichte.'),
    (r'verkehr|transport|mobilit.t|fahrzeug|route|bahn|bus|flug|schiff|logistik|hafen',
     'Echtzeit-Schnittstelle GTFS/NeTEx',
     'Veröffentlichung der Mobilitätsdaten aus {name} als Echtzeit-Feed im GTFS- oder NeTEx-Format für Routenplaner-Apps.'),
    (r'sensor|mess|monitor|beobacht|signal|instrument|detektion|satelliten|fernerkundung',
     'Langzeitarchivierung nach OAIS',
     'Dauerhafter Erhalt der Messdaten aus {name} nach dem OAIS-Referenzmodell in einem zertifizierten digitalen Langzeitarchiv.'),
    (r'forschung|studie|publikation|wissenschaft|experiment|labor|peer.review|daten.zentrum',
     'FAIR-Daten-Zertifizierung',
     'Überprüfung und Zertifizierung der Findability, Accessibility, Interoperability und Reusability der Daten aus {name} nach FAIR-Prinzipien.'),
    (r'register|verzeichnis|kataster|liste|inventar|bestand|verzeichnis|datenbank',
     'API-first-Bereitstellung',
     'Maschinenlesbare REST-API mit OpenAPI-Spezifikation für den programmatischen Zugriff auf die Datensätze aus {name}.'),
    (r'medien|bild|film|ton|video|audio|musik|kunst|kultur|ausstellung|archiv',
     'Digitales Rechtemanagement',
     'Implementierung eines DRM-Systems zur Verwaltung von Urheberrechten, Nutzungslizenzen und Verwertungsansprüchen für {name}.'),
    (r'sozial|bev.lker|demograf|familie|kind|jugend|alter|migration|integration|bürger',
     'Wirkungsevaluation',
     'Standardisierte Wirkungsmessung der auf {name} basierenden Programme und Maßnahmen nach SROI-Methodik.'),
    (r'wirtschaft|umsatz|markt|preis|konjunktur|handel|unternehmen|branche|gewerbe|industrie',
     'Europäische Statistikharmonisierung',
     'Angleichung der Wirtschaftsdaten aus {name} an Eurostat-Definitionen für grenzüberschreitende Vergleichsanalysen.'),
    (r'sicherheit|kriminal|polizei|notfall|risiko|gefahr|unfall|schutz|ordnung|strafverfolgung',
     'Verwendungszweckbindung und Zugriffskontrolle',
     'Technisch-organisatorische Maßnahmen zur Sicherstellung der Zweckbindung bei der Nutzung sensibler Daten aus {name}.'),
    (r'digital|software|it\b|plattform|app\b|cloud|netz|internet|cyber|api|algorithmus',
     'Automatisierte Datenqualitätsprüfung',
     'Kontinuierliche Validierung der Datenqualität in {name} durch regelbasierte Prüfroutinen und Anomalieerkennung im CI/CD-Prozess.'),
    (r'statistik|erhebung|befragung|stichprobe|census|zensus|survey|panel|longitudinal',
     'Metadaten-Standardisierung DDI',
     'Dokumentation der Erhebungsmetadaten aus {name} im DDI-Codebook-Standard für Wiederverwendbarkeit in Forschungsinfrastrukturen.'),
    (r'recht|gesetz|verordnung|vertrag|lizenz|regelung|norm|standards|compliance',
     'Rechtkonformer Datentransfer',
     'Prüfung und Dokumentation der rechtlichen Grundlagen für Weitergabe und Nachnutzung der Daten aus {name} inkl. DSGVO-Folgenabschätzung.'),
    (r'energie|strom|gas|w.rme|wasser|abwasser|versorgung|infrastruktur|netz',
     'Regulatorische Berichterstattung',
     'Übermittlung der Versorgungsdaten aus {name} an die Bundesnetzagentur und zuständige Regulierungsbehörden gemäß EnWG/WRG.'),
    (r'kirche|religion|glaube|gemeinde|gottesdienst|konfession|seelsorge|diakonie|caritas',
     'Institutionelle Transparenzberichterstattung',
     'Veröffentlichung der Daten aus {name} im Rahmen der kirchlichen Transparenzoffensive auf den jeweiligen Verbandsportalen.'),
    (r'förder|subvention|zuschuss|grant|drittmittel|projektmittel|finanzhilfe',
     'Zuwendungsdatenbank-Eintrag',
     'Erfassung aller Fördermaßnahmen aus {name} in der Zuwendungsdatenbank des Bundes (subventionsbericht.de) nach Transparenzrichtlinien.'),
]

FALLBACK = (
    'Datenportfolio-Management',
    'Strukturierte Verwaltung und Versionierung der Datensätze aus {name} in einem zentralen Datenportfolio mit Lifecycle-Management.'
)

def pick_5th_process(name, desc):
    text = (name + ' ' + desc).lower()
    for pattern, method, desc_tmpl in RULES:
        if re.search(pattern, text):
            return method, desc_tmpl
    return FALLBACK

total_updated = 0

for filepath in FILES:
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
    updated = 0
    for l2 in data['children']:
        for l3 in l2.get('children', []):
            for l4 in l3.get('children', []):
                procs = l4.get('details', {}).get('processes', [])
                if len(procs) < 5:
                    name = l4.get('name', '')
                    desc = l4.get('details', {}).get('description', '')
                    method, desc_tmpl = pick_5th_process(name, desc)
                    existing_methods = {p['method'] for p in procs}
                    if method in existing_methods:
                        method, desc_tmpl = FALLBACK
                    if method in existing_methods:
                        updated -= 1
                        continue
                    l4['details']['processes'].append({
                        'method': method,
                        'description': desc_tmpl.format(name=name)
                    })
                    updated += 1
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{filepath}: {updated} nodes updated')
    total_updated += updated

print(f'\nTotal updated: {total_updated}')
