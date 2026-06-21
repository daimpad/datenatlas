#!/usr/bin/env python3
"""Sprint S-P (Teil 3): sector_medien.json — alle 17 L2 auf 69 L4 bringen (+151)."""
import json

PATH = '/home/user/datenatlas/public/data/sector_medien.json'
C = "#9d174d"  # medien L4 color

FT = {"FT_01": "CSV", "FT_02": "JSON", "FT_03": "NetCDF / HDF5",
      "FT_04": "XML", "FT_05": "GeoJSON", "FT_06": "Shapefile"}
OP = {
    "01": ("OP_01", "Sofort publizierbar",
           "Aggregierte Branchenstatistik ohne Personenbezug; regulär veröffentlicht."),
    "02": ("OP_02", "Nach Aufbereitung publizierbar",
           "Erst nach Aggregation/Anonymisierung publizierbar; Detail- bzw. Lizenzdaten zugangsbeschränkt."),
    "03": ("OP_03", "Nur Metadaten publizierbar",
           "Enthält personenbezogene oder vertrauliche Geschäftsdaten; nur Metadaten publizierbar."),
}


def procs(name):
    return [
        {"method": "Datenerhebung",
         "description": f"Erhebung der Rohdaten zu {name} aus den Quellsystemen der zuständigen Stelle."},
        {"method": "Aufbereitung",
         "description": f"Bereinigung, Klassifikation und Aggregation der Daten zu {name}."},
        {"method": "Qualitätssicherung",
         "description": f"Plausibilitäts- und Konsistenzprüfung der {name} vor der Freigabe."},
        {"method": "Veröffentlichung und Berichterstattung",
         "description": f"Aufbereitung der {name} für periodische Berichte und offene Datenkataloge."},
        {"method": "Analyse und Auswertung",
         "description": f"Markt-, Struktur- und Trendanalysen auf Basis der {name}."},
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


# (id, name, desc, op, th, ob, gr, [formats], li, rel)
SPEC = {
    # ── oer (ARD/ZDF öffentlich-rechtlich) +7 ──
    "rundfunk-finanzen": [
        ("med-oer-beitragsaufkommen-laender", "Rundfunkbeitragsaufkommen nach Bundesländern", "Aufkommen des Rundfunkbeitrags je Bundesland aus dem Jahresbericht des Beitragsservice von ARD, ZDF und Deutschlandradio.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
        ("med-oer-personalkostenquote-sender", "Personalkostenquote der öffentlich-rechtlichen Sender", "Anteil der Personalkosten am Gesamtaufwand der Landesrundfunkanstalten laut KEF-Bericht.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-oer-sportrechte-ausgaben", "Ausgaben für Sportübertragungsrechte", "Aufwendungen der öffentlich-rechtlichen Sender für Sportlizenzen, ausgewiesen in KEF-Berichten und Geschäftsberichten.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
    ],
    "programm-statistik": [
        ("med-oer-sendeminuten-genre", "Sendeminuten nach Genre", "Verteilung der Sendezeit auf Programmgenres in der ARD/ZDF-Programmstatistik.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-oer-eigenproduktionsquote", "Eigenproduktionsquote", "Anteil eigen- und auftragsproduzierter Inhalte am Gesamtprogramm laut Programmbericht.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-oer-barrierefreie-angebote", "Barrierefreie Angebote (Untertitel/Audiodeskription)", "Anteil untertitelter und mit Audiodeskription versehener Sendungen, dokumentiert von ARD/ZDF und Medienanstalten.", "01", "TH_03", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-oer-regionalfenster-anteile", "Sendeanteile der Regionalfenster", "Programmanteile der Regional- und Landesprogramme innerhalb der ARD-Anstalten.", "02", "TH_05", "OB_06", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── printmedien +9 ──
    "auflagenstatistik": [
        ("med-print-ivw-auflage-titel", "IVW-Auflagenzahlen nach Titel", "Geprüfte verkaufte Auflage von Zeitungen und Zeitschriften je Titel laut IVW.", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-print-abo-einzelverkauf-anteil", "Abo- und Einzelverkaufsanteil", "Aufteilung der verkauften Auflage in Abonnement und Einzelverkauf je Titel (IVW).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-print-epaper-auflage", "E-Paper-Auflagenentwicklung", "Entwicklung der digitalen E-Paper-Auflage von Tageszeitungen laut IVW.", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_04", 4),
    ],
    "pressewirtschaft": [
        ("med-print-anzeigenerloese-zeitungen", "Anzeigenerlöse der Tageszeitungen", "Werbeerlöse der Tagespresse nach Anzeigenart aus der Wirtschaftsstatistik des BDZV.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-print-vertriebserloese-presse", "Vertriebserlöse der Presse", "Umsätze aus Vertrieb und Verkauf von Presseerzeugnissen laut BDZV/VDZ.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-print-beschaeftigte-redaktionen", "Beschäftigte in Zeitungsredaktionen", "Zahl der redaktionellen Beschäftigten in der Tagespresse laut BDZV-Erhebung.", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "pressekonzentration": [
        ("med-print-verlagsgruppen-marktanteile", "Marktanteile der Pressekonzerne", "Konzentrationskennziffern der größten Zeitungsverlagsgruppen (Formatt-Institut).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-print-ein-zeitungs-kreise", "Ein-Zeitungs-Kreise (Monopolregionen)", "Landkreise mit nur einer lokalen Abonnementzeitung als Maß publizistischer Vielfalt.", "01", "TH_05", "OB_05", "GR_03", ["FT_05"], "LI_03", 4),
        ("med-print-eingestellte-titel", "Eingestellte Zeitungstitel", "Chronik eingestellter oder fusionierter Zeitungstitel im Branchenmonitoring.", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── kulturbetriebe +9 (4 L3) ──
    "museen": [
        ("med-kult-museumsbesuche-sparte", "Museumsbesuche nach Sparte", "Besuchszahlen nach Museumsart aus der Erhebung des Instituts für Museumsforschung.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-kult-sammlungsdigitalisierung", "Digitalisierungsgrad von Sammlungen", "Anteil digitalisierter Sammlungsobjekte, gemeldet an die Deutsche Digitale Bibliothek.", "01", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
    ],
    "darstellende-kuenste": [
        ("med-kult-theaterbesuche-sparten", "Theaterbesuche nach Sparte", "Besuchszahlen von Schauspiel, Oper und Tanz laut Theaterstatistik des Deutschen Bühnenvereins.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-kult-auffuehrungen-anzahl", "Anzahl der Aufführungen", "Zahl der Vorstellungen und Veranstaltungen öffentlicher Theater (Bühnenverein).", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "kulturfoerderung-bundes": [
        ("med-kult-bkm-foerdermittel", "BKM-Fördermittel nach Programm", "Verteilung der Mittel der Beauftragten der Bundesregierung für Kultur und Medien.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-kult-oeffentliche-kulturausgaben", "Öffentliche Kulturausgaben nach Ebene", "Kulturausgaben von Bund, Ländern und Gemeinden aus dem Kulturfinanzbericht (Destatis).", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 4),
    ],
    "kulturelles-erbe": [
        ("med-kult-denkmalliste-bestand", "Denkmallisten-Bestand nach Land", "Zahl eingetragener Bau- und Bodendenkmäler je Bundesland laut Landesdenkmalämtern.", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("med-kult-unesco-welterbe", "UNESCO-Welterbestätten in Deutschland", "Verzeichnis und Lage der deutschen UNESCO-Welterbestätten (UNESCO/KMK).", "01", "TH_06", "OB_05", "GR_03", ["FT_05"], "LI_02", 4),
        ("med-kult-restaurierungsprojekte", "Geförderte Restaurierungsprojekte", "Im Denkmalschutz-Sonderprogramm geförderte Sanierungs- und Restaurierungsvorhaben.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── digitalmedien +9 ──
    "online-nutzung": [
        ("med-dig-internetnutzungsdauer", "Tägliche Internetnutzungsdauer", "Durchschnittliche Verweildauer im Internet laut ARD/ZDF-Onlinestudie.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-dig-social-media-reichweite", "Reichweite sozialer Netzwerke", "Nutzungsreichweite einzelner Social-Media-Plattformen in Deutschland.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-dig-online-nachrichtennutzung", "Online-Nachrichtennutzung", "Quellen und Geräte der digitalen Nachrichtennutzung laut Reuters Digital News Report.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_02", 4),
    ],
    "kreativwirtschaft": [
        ("med-dig-kkw-bruttowertschoepfung", "Bruttowertschöpfung der Kultur- und Kreativwirtschaft", "Wertschöpfungsbeitrag der Teilmärkte aus dem KKW-Monitoringbericht des BMWK.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-dig-kkw-erwerbstaetige", "Erwerbstätige in der Kreativwirtschaft", "Zahl der Erwerbstätigen und Selbstständigen je Teilmarkt (KKW-Monitoring).", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dig-medien-startup-gruendungen", "Medien- und Tech-Startup-Gründungen", "Gründungsgeschehen in Medien- und Technologiebranchen laut Deutschem Startup-Monitor.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_02", 3),
    ],
    "plattformregulierung": [
        ("med-dig-netzdg-loeschstatistik", "NetzDG-Transparenzberichte", "Beschwerde- und Löschzahlen großer Plattformen aus den Berichten beim Bundesamt für Justiz.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-dig-dsa-moderationsentscheide", "DSA-Meldungen und Moderationsentscheide", "Inhaltemoderationsdaten aus der DSA-Transparenzdatenbank der EU-Kommission.", "01", "TH_08", "OB_08", "GR_02", ["FT_02"], "LI_02", 4),
        ("med-dig-intermediaere-aufsicht", "Aufsicht über Medienintermediäre", "Aufsichtsfälle und Auflagen der Medienanstalten nach dem Medienstaatsvertrag.", "02", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── privatrundfunk +9 ──
    "privates-fernsehen": [
        ("med-priv-tv-werbeumsatz", "Werbeumsatz im privaten Fernsehen", "Werbeeinnahmen privater TV-Sender aus dem Jahrbuch der Medienanstalten.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-priv-tv-zulassungen", "Zugelassene private TV-Programme", "Bestand der von den Landesmedienanstalten zugelassenen privaten Fernsehprogramme.", "01", "TH_05", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-priv-tv-marktanteile", "Marktanteile privater TV-Sendergruppen", "Zuschauermarktanteile der privaten Sendergruppen laut AGF und Medienanstalten.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
    ],
    "privater-hoerfunk": [
        ("med-priv-radio-reichweite-ma", "Radioreichweiten (Media-Analyse)", "Hörerreichweiten privater Radiosender aus der ma Audio der agma.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-priv-radio-werbeumsatz", "Werbeumsatz im privaten Hörfunk", "Werbeeinnahmen privater Radioanbieter laut Medienanstalten.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-priv-lokalradio-bestand", "Bestand lokaler und regionaler Radiosender", "Zahl und Standorte privater Lokal- und Regionalsender laut Landesmedienanstalten.", "01", "TH_05", "OB_08", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    "digitaler-werbemarkt": [
        ("med-priv-programmatic-anteil", "Anteil programmatischer Werbung", "Marktanteil automatisiert gehandelter Werbung laut OVK/BVDW.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-priv-instream-videowerbung", "In-Stream-Videowerbeumsätze", "Umsätze mit In-Stream-Videowerbung aus dem OVK-Report.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-priv-addressable-tv", "Addressable-TV-Buchungen", "Buchungsvolumen adressierbarer TV-Werbung laut Screenforce und Anbietern.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
    ],
    # ── sportmedien +9 (2 L3) ──
    "sportmedienrechte": [
        ("med-sport-bundesliga-medienerloese", "Bundesliga-Medienerlöse", "Nationale und internationale Medienerlöse der Fußball-Bundesliga aus dem DFL-Wirtschaftsreport.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 5),
        ("med-sport-rechtepakete-vergabe", "Vergabe von Live-Rechtepaketen", "Struktur und Zuschlag der ausgeschriebenen Medienrechtepakete (DFL/Bundeskartellamt).", "02", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-sport-olympia-rechte", "Olympia-Übertragungsrechte", "Kosten und Verteilung der Olympia-Medienrechte zwischen IOC und Sendern.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-sport-internationale-ligen-rechte", "Rechtekosten internationaler Ligen", "Aufwendungen deutscher Sender für ausländische Liga- und Wettbewerbsrechte.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "unterhaltungsformate": [
        ("med-sport-berichterstattung-quoten", "Reichweiten der Sportberichterstattung", "Einschaltquoten von Sportsendungen und Live-Übertragungen laut AGF.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-sport-livestream-nutzung", "Sport-Livestream-Nutzung", "Nutzungszahlen von Sport-Livestreams der Sender und Plattformen.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-sport-esport-uebertragung-reichweite", "Reichweite von E-Sport-Übertragungen", "Zuschauerreichweiten von E-Sport-Streams laut game-Verband und Plattformen.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-sport-pay-tv-sportabos", "Sport-Pay-TV-Abonnements", "Abonnentenzahlen sportbezogener Pay-TV- und Streamingangebote.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-sport-frauensport-sendezeit", "Sendezeitanteil des Frauensports", "Anteil der Frauensport-Berichterstattung an der gesamten Sportsendezeit (Medienforschung).", "01", "TH_03", "OB_06", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    # ── bildende_kuenste_galerien +9 (2 L3) ──
    "kunstausstellungen_vermarktung": [
        ("med-kunst-galeriehandel-umsatz", "Umsatz des Galerie- und Kunsthandels", "Umsatzschätzungen des Kunsthandels aus dem Kunstmarktbericht (BVDG).", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-kunst-auktionsergebnisse", "Auktionsergebnisse am Kunstmarkt", "Zuschlagswerte und Umsätze deutscher Kunstauktionen (Auktionshäuser/artprice).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-kunst-messebesuche", "Besucher und Aussteller von Kunstmessen", "Besucher- und Ausstellerzahlen der Kunstmessen laut Veranstalterangaben.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-kunst-export-import-werke", "Ein- und Ausfuhr von Kunstwerken", "Außenhandel mit Kunstgegenständen aus der Außenhandelsstatistik (Destatis).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-kunst-folgerecht-ausschuettung", "Folgerechtsausschüttungen", "Ausschüttungen des Folgerechts für bildende Künstler durch die VG Bild-Kunst.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
    ],
    "kuenstler_ateliers": [
        ("med-kunst-ksk-versicherte", "KSK-versicherte bildende Künstler", "Zahl der bei der Künstlersozialkasse versicherten bildenden Künstler.", "01", "TH_03", "OB_01", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-kunst-durchschnittseinkommen", "Durchschnittseinkommen bildender Künstler", "Einkommensverteilung bildender Künstler laut KSK- und Verbandsstudien.", "02", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-kunst-atelierfoerderung", "Kommunale Atelierförderprogramme", "Geförderte Atelier- und Arbeitsräume in kommunalen Programmen der Kulturämter.", "01", "TH_07", "OB_03", "GR_03", ["FT_01"], "LI_03", 3),
        ("med-kunst-stipendien-vergabe", "Vergebene Kunststipendien", "Übersicht vergebener Arbeits- und Aufenthaltsstipendien von Stiftungen und Ländern.", "01", "TH_07", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── deutschlandradio +9 ──
    "dlf-programme-statistik": [
        ("med-dlr-wortanteil-programm", "Wortanteil im Programm", "Anteil von Wortbeiträgen am Gesamtprogramm in der Deutschlandradio-Programmstatistik.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dlr-sendeformate-verteilung", "Verteilung der Sendeformate", "Anteile von Nachrichten-, Feature- und Diskussionsformaten am Programm.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dlr-musikrepertoire-statistik", "Musikrepertoire-Statistik", "Zusammensetzung des gesendeten Musikrepertoires (DLR-Meldungen an Verwertungsgesellschaften).", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "dlf-reichweite-finanzen": [
        ("med-dlr-hoererzahlen-ma", "Hörerzahlen (ma Audio)", "Reichweiten der Deutschlandradio-Programme aus der ma Audio der agma.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-dlr-beitragsanteil-haushalt", "Beitragsanteil und Haushalt", "Anteil am Rundfunkbeitrag und Gesamthaushalt von Deutschlandradio laut KEF-Bericht.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dlr-verbreitungskosten-dab", "Verbreitungskosten (DAB+/UKW)", "Aufwendungen für die terrestrische Verbreitung aus dem Geschäftsbericht.", "02", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "dlf-digitale-angebote": [
        ("med-dlr-audiothek-abrufe", "Abrufe der Dlf Audiothek", "Nutzungszahlen der Audiothek-App von Deutschlandradio.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dlr-podcast-downloads", "Podcast-Downloads", "Download- und Abrufzahlen der Deutschlandradio-Podcasts.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-dlr-nachrichten-digital", "Nutzung digitaler Nachrichtenangebote", "Zugriffe auf digitale Nachrichten- und Schnittstellenangebote des Senders.", "02", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_03", 3),
    ],
    # ── zdf-digital +9 ──
    "zdf-mediathek-daten": [
        ("med-zdf-mediathek-sehdauer", "Sehdauer in der ZDF-Mediathek", "Durchschnittliche Nutzungsdauer und Abrufe in der ZDF-Mediathek.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-zdf-mediathek-altersstruktur", "Altersstruktur der Mediatheksnutzer", "Demografische Verteilung der Nutzer der ZDF-Mediathek.", "02", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-zdf-streaming-spitzenlast", "Streaming-Spitzenlasten bei Großereignissen", "Maximale gleichzeitige Streams bei Sport- und Live-Events (ZDF-Technik).", "02", "TH_10", "OB_04", "GR_01", ["FT_01"], "LI_03", 3),
    ],
    "zdf-toechter-unternehmen": [
        ("med-zdf-studios-umsatz", "Umsatz ZDF Studios (Programmvertrieb)", "Erlöse aus Programmvertrieb und Lizenzhandel der ZDF-Tochter laut Geschäftsbericht.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-zdf-beteiligungen-uebersicht", "Beteiligungen und Tochtergesellschaften", "Übersicht der ZDF-Beteiligungen aus dem Transparenzbericht.", "01", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-zdf-koproduktionen-anteil", "Koproduktionsanteil", "Anteil von Koproduktionen am fiktionalen Programm laut Programmbericht.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "zdf-programmstatistik": [
        ("med-zdf-sendeanteile-genre", "Sendeanteile nach Genre (ZDF)", "Verteilung der Sendezeit auf Programmgenres im ZDF.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-zdf-nachrichten-sendevolumen", "Nachrichten-Sendevolumen", "Umfang der Nachrichten- und Informationssendungen im ZDF.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-zdf-barrierefreiheit-quote", "Barrierefreiheitsquote (ZDF)", "Anteil barrierefreier Sendungen im ZDF laut Selbstauskunft und Medienanstalten.", "01", "TH_03", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    # ── ard-online +9 ──
    "ard-mediathek-statistik": [
        ("med-ard-mediathek-visits", "Visits der ARD-Mediathek", "Besuchs- und Abrufzahlen der ARD-Mediathek aus der Digitalstatistik.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-ard-mediathek-top-inhalte", "Meistgenutzte Mediathek-Inhalte", "Ranking der reichweitenstärksten Inhalte der ARD-Mediathek.", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-ard-streamingnetzwerk", "Gemeinsames Streamingnetzwerk ARD/ZDF", "Technische und Nutzungskennzahlen des gemeinsamen Streamingverbunds.", "02", "TH_10", "OB_08", "GR_02", ["FT_02"], "LI_03", 3),
    ],
    "tagesschau-digital": [
        ("med-ard-tagesschau-app-nutzung", "Nutzung der tagesschau-App", "Zugriffe und Nutzerzahlen der tagesschau-App (ARD-aktuell).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-ard-tagesschau-social", "Social-Media-Reichweite der tagesschau", "Reichweiten der tagesschau-Kanäle in sozialen Netzwerken.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-ard-faktenfinder-beitraege", "Faktencheck- und Verifikationsbeiträge", "Umfang der Faktencheck-Beiträge des ARD-faktenfinder.", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "ard-audio-podcast": [
        ("med-ard-audiothek-abrufe", "Abrufe der ARD-Audiothek", "Nutzungszahlen der gemeinsamen ARD-Audiothek.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-ard-podcast-reichweiten", "ARD-Podcast-Reichweiten", "Download- und Abrufzahlen der reichweitenstärksten ARD-Podcasts.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-ard-dab-verbreitung", "DAB+-Radioverbreitung der ARD", "Versorgungsgrad und Sendernetz der ARD im Digitalradio DAB+.", "01", "TH_10", "OB_04", "GR_03", ["FT_01"], "LI_03", 3),
    ],
    # ── nachrichtenagenturen +9 ──
    "dpa-meldungsstatistik": [
        ("med-na-dpa-meldungsvolumen", "Tägliches dpa-Meldungsvolumen", "Zahl der täglich verbreiteten Meldungen der Deutschen Presse-Agentur.", "02", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-na-dpa-ressortverteilung", "Ressortverteilung der Meldungen", "Aufteilung des Meldungsaufkommens auf Themenressorts.", "02", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-na-dpa-bildangebot", "Umfang des Bild- und Videoangebots", "Volumen des Bild- und Bewegtbildangebots (dpa/picture alliance).", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "nachrichtenverteilung-medien": [
        ("med-na-kundenstruktur", "Kundenstruktur der Agenturen", "Verteilung der Agenturkunden auf Mediengattungen und Branchen.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-na-eilmeldungen-aufkommen", "Eilmeldungsaufkommen", "Häufigkeit und Themen von Eil- und Blitzmeldungen.", "02", "TH_04", "OB_02", "GR_01", ["FT_01"], "LI_04", 3),
        ("med-na-mehrsprachige-dienste", "Mehrsprachige Dienste", "Umfang fremdsprachiger Nachrichtendienste der Agenturen.", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "agenturjournalismus-qualitaet": [
        ("med-na-korrekturquote", "Korrektur- und Berichtigungsquote", "Anteil korrigierter Meldungen im Qualitätsmanagement der Agenturen.", "02", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-na-faktencheck-dienst", "Faktencheck-Dienste", "Umfang und Themen der Faktencheck-Angebote (z. B. dpa-Faktencheck).", "01", "TH_04", "OB_02", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-na-quellentransparenz", "Quellentransparenz-Kennzeichnung", "Standards und Quote der Quellenkennzeichnung in Agenturmeldungen.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── filmwirtschaft-kino +9 ──
    "filmproduktion-foerderung": [
        ("med-film-ffa-foerdermittel", "FFA-Fördermittel nach Projekt", "Vergebene Fördermittel der Filmförderungsanstalt je Projekt und Sparte.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-film-dfff-zuschuesse", "DFFF-Zuschüsse", "Zuschüsse des Deutschen Filmförderfonds an Produktionen (BKM/FFA).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-film-produktionsvolumen", "Deutsches Produktionsvolumen", "Zahl und Budget deutscher Kinoproduktionen laut SPIO/FFA.", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "kinobesuch-marktdaten": [
        ("med-film-kinobesuche-einspiel", "Kinobesuche und Einspielergebnis", "Jährliche Besuchszahlen und Bruttoeinspielergebnis laut FFA.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-film-leinwaende-bestand", "Bestand an Kinoleinwänden", "Zahl und Standorte der Kinos und Leinwände (FFA).", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("med-film-eintrittspreise", "Entwicklung der Kino-Eintrittspreise", "Durchschnittliche Kartenpreise im Zeitverlauf laut FFA.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "filmverleih-distribution": [
        ("med-film-verleiher-marktanteile", "Marktanteile der Filmverleiher", "Marktanteile der Verleihunternehmen nach Besuchern (FFA).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-film-startkopien-fenster", "Startkopien und Auswertungsfenster", "Zahl der Startkopien und Länge der Auswertungsfenster.", "02", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-film-deutsche-filme-marktanteil", "Marktanteil deutscher Filme", "Besucheranteil deutscher Produktionen am Gesamtmarkt (FFA).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    # ── musikwirtschaft +9 ──
    "tontraegermarkt-streaming": [
        ("med-musik-umsatz-segmente", "Musikmarktumsatz nach Segment", "Umsatzaufteilung in Streaming, Download und physische Tonträger laut BVMI.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-musik-streaming-abozahlen", "Audio-Streaming-Abonnentenzahlen", "Zahl der zahlenden Musik-Streaming-Abonnenten in Deutschland (BVMI).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-musik-vinyl-physisch", "Vinyl- und physische Verkäufe", "Absatz physischer Tonträger inklusive Vinyl laut BVMI/GfK Entertainment.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "gema-lizenzierung-ausschuettung": [
        ("med-musik-gema-erloese", "GEMA-Erlöse nach Sparte", "Erträge der GEMA nach Verwertungssparte aus dem Geschäftsbericht.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-musik-gvl-ausschuettung", "GVL-Ausschüttungen an Interpreten", "Leistungsschutz-Ausschüttungen der GVL an ausübende Künstler.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-musik-online-lizenzierung", "Online- und Streaming-Lizenzierung", "Volumen und Tarife der Online-Musiklizenzierung durch die GEMA.", "02", "TH_08", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "musikveranstaltungen-konzerte": [
        ("med-musik-konzertbesuche-umsatz", "Konzert- und Festivalbesuche", "Besuchszahlen und Umsätze von Live-Musikveranstaltungen laut BDKV.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-musik-livebranche-beschaeftigte", "Beschäftigte der Live-Musikbranche", "Zahl der Beschäftigten und Selbstständigen in der Live-Branche (BDKV/Studien).", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-musik-spielstaetten-bestand", "Bestand an Musikspielstätten", "Zahl und Lage von Clubs und Livemusik-Spielstätten (LiveKomm/Clubstudie).", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
    ],
    # ── buchverlage +9 ──
    "buchmarkt-umsatz": [
        ("med-buch-umsatz-warengruppen", "Buchmarktumsatz nach Warengruppe", "Umsatzaufteilung des Buchmarkts nach Warengruppen laut Börsenverein.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-buch-ebook-anteil", "E-Book-Umsatzanteil", "Anteil digitaler Bücher am Publikumsmarkt (Börsenverein).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-buch-hoerbuch-markt", "Hörbuch- und Audio-Markt", "Umsätze mit Hörbüchern und Audio-Downloads laut Börsenverein.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "buchhandel-distribution": [
        ("med-buch-vertriebswege", "Absatz nach Vertriebsweg", "Umsatzanteile von Sortiment, Online und sonstigen Vertriebswegen (Börsenverein).", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-buch-buchhandlungen-bestand", "Bestand stationärer Buchhandlungen", "Zahl und Lage stationärer Buchhandlungen laut Börsenverein.", "01", "TH_04", "OB_05", "GR_03", ["FT_05"], "LI_03", 3),
        ("med-buch-preisbindung-titel", "Preisbindung und Titelpreise", "Durchschnittliche gebundene Ladenpreise im Rahmen der Buchpreisbindung.", "01", "TH_08", "OB_02", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "urheberrecht-autorenverguetung": [
        ("med-buch-vg-wort-ausschuettung", "VG-Wort-Ausschüttungen", "Ausschüttungen der VG Wort an Autoren und Verlage aus dem Geschäftsbericht.", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-buch-autoreneinkommen", "Autoreneinkommen", "Einkommensverteilung literarischer Autoren laut Studien und Künstlersozialkasse.", "02", "TH_03", "OB_03", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-buch-uebersetzungslizenzen", "Übersetzungslizenzen (Im-/Export)", "Zahl ein- und ausgehender Übersetzungslizenzen laut Börsenverein.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── streaming-podcast +9 ──
    "streaming-nutzungsdaten": [
        ("med-str-svod-abozahlen", "SVoD-Abonnentenzahlen", "Abonnentenzahlen abobasierter Video-Streamingdienste in Deutschland.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-str-haushaltsdurchdringung", "Haushaltsdurchdringung der Streamingdienste", "Anteil der Haushalte mit Streamingabo laut ARD/ZDF-Onlinestudie.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-str-bewegtbild-nutzungszeit", "Tägliche Bewegtbild-Nutzungszeit", "Nutzungsdauer von Streaming und linearem Bewegtbild laut AGF/Onlinestudie.", "01", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    "streaming-content-kataloge": [
        ("med-str-katalogumfang", "Katalogumfang der Anbieter", "Zahl der verfügbaren Titel je Streamingdienst aus dem Branchenmonitoring.", "02", "TH_04", "OB_08", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-str-originals-investitionen", "Investitionen in Originals", "Aufwendungen der Plattformen für Eigenproduktionen laut Geschäftsberichten.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-str-europaeische-inhalte-quote", "Anteil europäischer Inhalte", "Erfüllung der AVMD-Quote für europäische Werke laut Medienanstalten.", "01", "TH_05", "OB_06", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    "streaming-markt-plattformen": [
        ("med-str-marktanteile-dienste", "Marktanteile der Streamingdienste", "Marktanteile der Video-Streaminganbieter nach Nutzung und Umsatz.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-str-churn-raten", "Churn-Raten (Abowechsel)", "Kündigungs- und Wechselraten der Streamingabonnenten laut Marktforschung.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-str-fast-kanaele", "FAST-Kanäle (werbefinanziert)", "Angebot und Reichweite werbefinanzierter Streaming-Kanäle (FAST).", "01", "TH_04", "OB_06", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── gaming-esports +9 ──
    "gaming-markt-umsatz": [
        ("med-game-marktumsatz-segmente", "Games-Marktumsatz nach Segment", "Umsatz des deutschen Games-Markts nach Segment laut game-Verband/GfK.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-game-spielerzahlen-demografie", "Spielerzahlen und Demografie", "Zahl und demografische Struktur der Computerspielenden (game-Verband).", "01", "TH_04", "OB_01", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-game-ingame-umsaetze", "In-Game- und Mikrotransaktionsumsätze", "Umsätze mit virtuellen Gütern und Zusatzinhalten laut game-Verband.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "gaming-jugendschutz-regulation": [
        ("med-game-usk-alterskennzeichen", "USK-Alterskennzeichnungen", "Vergebene Alterskennzeichen für Computerspiele durch die USK.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-game-lootbox-pruefung", "Prüfung von Lootbox-Mechaniken", "Bewertung glücksspielnaher Spielmechaniken durch USK und KJM.", "01", "TH_08", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
        ("med-game-bundesfoerderung", "Games-Förderung des Bundes", "Geförderte Spieleprojekte aus der Games-Förderung des Bundes (BMWK).", "01", "TH_07", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
    ],
    "gaming-esports-wettkampf": [
        ("med-game-esport-zuschauerzahlen", "E-Sport-Zuschauerzahlen", "Reichweiten von E-Sport-Wettbewerben laut game-Verband und Plattformen.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-game-esport-preisgelder", "E-Sport-Preisgelder und Turniere", "Preisgelder und Zahl der Turniere im deutschen E-Sport.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-game-esport-vereine", "E-Sport-Vereine und -Strukturen", "Zahl und Organisation der E-Sport-Vereine laut ESBD.", "01", "TH_03", "OB_08", "GR_02", ["FT_01"], "LI_03", 3),
    ],
    # ── werbewirtschaft +9 ──
    "werbung-ausgaben-investitionen": [
        ("med-werb-bruttowerbeinvestitionen", "Brutto-Werbeinvestitionen nach Medium", "Brutto-Werbeausgaben nach Mediengattung laut Nielsen und ZAW.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 4),
        ("med-werb-netto-werbeeinnahmen", "Netto-Werbeeinnahmen der Medien", "Netto-Werbeeinnahmen der erfassenden Medien aus dem ZAW-Jahrbuch.", "01", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_03", 4),
        ("med-werb-digitalanteil", "Digitalanteil am Werbemarkt", "Anteil digitaler Werbung am Gesamtwerbemarkt laut OVK/ZAW.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "werbung-formate-kanaele": [
        ("med-werb-mediasplit", "Mediasplit nach Werbegattung", "Verteilung der Werbespendings auf Werbeträgergattungen (ZAW/Nielsen).", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-werb-influencer-marketing", "Influencer-Marketing-Volumen", "Marktvolumen des Influencer-Marketings laut BVDW.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-werb-dooh-umsaetze", "Digital-Out-of-Home-Umsätze", "Umsätze digitaler Außenwerbung laut FAW/OVK.", "02", "TH_04", "OB_03", "GR_02", ["FT_01"], "LI_04", 3),
    ],
    "werbung-wirkung-messung": [
        ("med-werb-bewegtbild-waehrung", "Konvergente Bewegtbild-Reichweitenwährung", "Plattformübergreifende Reichweitenmessung für Bewegtbild durch die AGF.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-werb-brand-tracking", "Werbeerinnerung und Brand-Tracking", "Messung von Werbeerinnerung und Markenwahrnehmung in der Marktforschung.", "02", "TH_04", "OB_07", "GR_02", ["FT_01"], "LI_04", 3),
        ("med-werb-attribution-conversion", "Attribution und Conversion-Messung", "Zuordnung von Werbekontakten zu Conversions im digitalen Marketing.", "03", "TH_04", "OB_01", "GR_04", ["FT_02"], "LI_04", 3),
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
