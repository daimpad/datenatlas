#!/usr/bin/env python3
"""Sprint S-M: Add 4th process entry to all L4 nodes."""
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
    (r'geodat|karte|raum|fl.che|topograph|koordinat|gis|geograph',
     'Georeferenzierung und Kartierung',
     'Räumliche Aufbereitung und GIS-gestützte Visualisierung der Daten zu {name} für kartografische Auswertungen und Standortanalysen.'),
    (r'klima|emission|luftquali|temperatur|nieder|wetter|umwelt|natur|biodiversit',
     'Klimafolgen- und Risikoabschätzung',
     'Systematische Modellierung von Klimaauswirkungen und Umweltrisiken auf Basis der Daten zu {name}.'),
    (r'personal|mitarbeiter|besch.ftig|lohn|gehalt|arbeitnehmer|hr\b',
     'Datenschutzkonformes HR-Reporting',
     'Anonymisiertes Berichtswesen zu Personaldaten aus {name} unter Einhaltung datenschutzrechtlicher Anforderungen.'),
    (r'finanz|haushalt|budget|ausgab|einnahm|steuer|schuld|bilanz|buchf',
     'Finanzkontrolle und Wirtschaftlichkeitsprüfung',
     'Revisionssichere Überprüfung der Finanzströme und Wirtschaftlichkeitsbewertung auf Basis der Daten zu {name}.'),
    (r'gesundheit|patient|diagnos|krank|medizin|pflege|therapie|epidemio|klinik',
     'Epidemiologische Netzwerkanalyse',
     'Untersuchung epidemiologischer Zusammenhänge und Ausbreitungsmuster auf Basis der Daten zu {name}.'),
    (r'bildung|schule|unterricht|ausbildung|lernen|studium|kurs|qualifikation|kompetenz',
     'Kompetenz- und Outcome-Messung',
     'Evaluierung von Bildungsergebnissen und Kompetenzzuwachs anhand der Daten zu {name}.'),
    (r'verkehr|transport|mobilit.t|fahrzeug|route|bahn|bus|flug|schiff|logistik',
     'Verkehrssimulation und Optimierungsmodellierung',
     'Simulation von Verkehrsszenarien und Ableitung von Optimierungspotenzialen aus den Daten zu {name}.'),
    (r'sensor|mess|monitor|beobacht|erheb|signal|instrument|detektion',
     'Anomalieerkennung und Qualitätskontrolle',
     'Automatisierte Erkennung von Ausreißern, Fehlmessungen und Datenanomalien in den Daten zu {name}.'),
    (r'forschung|studie|publikation|wissenschaft|experiment|labor|peer.review',
     'Open-Access-Dissemination',
     'Veröffentlichung der Ergebnisse aus {name} über Open-Access-Repositorien und wissenschaftliche Fachzeitschriften.'),
    (r'register|verzeichnis|kataster|liste|inventar|bestand|verzeichnis',
     'Maschinenlesbare API-Bereitstellung',
     'Bereitstellung der Daten aus {name} über strukturierte APIs für automatisierte Drittnutzung und Integration.'),
    (r'medien|bild|film|ton|video|audio|musik|kunst|kultur|ausstellung',
     'Rechteverwaltung und Lizenzprüfung',
     'Systematische Prüfung der Nutzungsrechte, Lizenzbedingungen und Verwertungsrechte für {name}.'),
    (r'sozial|bev.lker|demograf|familie|kind|jugend|alter|migration|integration',
     'Sozialraumanalyse und Bedarfsplanung',
     'Räumliche Analyse soziodemografischer Bedarfe und Versorgungslücken auf Basis der Daten zu {name}.'),
    (r'wirtschaft|umsatz|markt|preis|konjunktur|handel|unternehmen|branche|gewerbe',
     'Branchenvergleich und Benchmarking',
     'Sektorübergreifender Vergleich und Benchmarking von Wirtschaftsindikatoren aus {name}.'),
    (r'sicherheit|kriminal|polizei|notfall|risiko|gefahr|unfall|schutz|ordnung',
     'Risikobewertung und Präventionstransfer',
     'Evidenzbasierte Ableitung von Präventions- und Schutzmaßnahmen aus den Daten zu {name}.'),
    (r'digital|software|it\b|plattform|app\b|cloud|netz|internet|cyber|api',
     'Interoperabilitäts- und Schnittstellentesting',
     'Technische Überprüfung von Datenschnittstellen und Kompatibilität mit bestehenden IT-Systemen für {name}.'),
]

FALLBACK = (
    'Metadaten-Anreicherung und Katalogisierung',
    'Systematische Ergänzung beschreibender Metadaten zu {name} für verbesserte Auffindbarkeit und Nachnutzbarkeit in Datenportalen.'
)

def pick_4th_process(name, desc):
    text = (name + ' ' + desc).lower()
    for pattern, method, desc_tmpl in RULES:
        if re.search(pattern, text):
            return method, desc_tmpl
    return FALLBACK

total_updated = 0

for filepath in FILES:
    data = json.load(open(filepath, encoding='utf-8'))
    updated = 0
    for l2 in data['children']:
        for l3 in l2.get('children', []):
            for l4 in l3.get('children', []):
                procs = l4.get('details', {}).get('processes', [])
                if len(procs) < 4:
                    name = l4.get('name', '')
                    desc = l4.get('details', {}).get('description', '')
                    method, desc_tmpl = pick_4th_process(name, desc)
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
    json.dump(data, open(filepath, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{filepath}: {updated} nodes updated')
    total_updated += updated

print(f'\nTotal updated: {total_updated}')
