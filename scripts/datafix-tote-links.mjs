// Einmalige Bereinigung der Beispiel-Links (details.examples), November 2026.
//
// Die erste vollständige Linkprüfung (scripts/check-links.mjs) über alle 937
// Beispiel-Links ergab: 349 erreichbar, 231 tot, der Rest nicht prüfbar —
// gesperrt, Firewall, Zeitüberschreitung. Entfernt werden nur die eindeutig
// toten:
//
//   - alle Links auf mcloud.de (86): das Portal ist abgeschaltet und leitet
//     jede Adresse auf seine Abschiedsmeldung um, mit Status 200
//   - die 137 Adressen unten, die mit 404 oder 410 antworteten
//
// Einige davon hatten nie existiert: destatis.de und bundesnetzagentur.de
// kennen keine Pfade der Form /dataset/<name>. Die Links sind bei früheren
// Erweiterungen mitgeneriert worden, ohne dass jemand sie aufgerufen hat.
//
// Nicht entfernt: 400er der Geodateninfrastruktur (Firewall-Seite, kein
// Nachweis für einen fehlenden Datensatz) und alles, was nur gesperrt oder zu
// langsam war. Die wöchentliche Prüfung zeigt, was davon dauerhaft fehlt.
//
// Ein toter Link ist schlechter als keiner: Er sieht aus wie ein Beleg.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { RETIRED_HOSTS } from './link-regeln.mjs';

const DEAD = new Set([
  "https://data.wien.gv.at/dataset/schaedlingsbekaempfung",
  "https://daten.geoportal.ruhr/srv/api/records/472988fa-dfb7-4c23-8389-98d78cfe4e9",
  "https://daten.geoportal.ruhr/srv/api/records/pendler-ruhr",
  "https://de.dariah.eu/langzeitarchivierung",
  "https://fdz.iab.de/de/FDZ_Data_Access.aspx",
  "https://fdz.iab.de/de/FDZ_Individual_Data/LIAB.aspx",
  "https://fdz.iab.de/de/FDZ_Nutzungsstatistik.aspx",
  "https://numis.niedersachsen.de/csw?REQUEST=GetRecordById&SERVICE=CSW&VERSION=2.0.2&id=40F6A897-15FB-448F-80C2-4FCB01245254&elementSetName=full",
  "https://offenedaten-koeln.de/dataset/abfallmengen-koeln",
  "https://offenedaten-koeln.de/dataset/altkleider-container-k%C3%B6ln",
  "https://offenedaten-koeln.de/dataset/beteiligungsprojekt-ihre-einsch%C3%A4tzung-zum-radverkehr",
  "https://offenedaten-koeln.de/dataset/feuerwehr-ausstattung",
  "https://offenedaten-koeln.de/dataset/gehwegkataster",
  "https://offenedaten-koeln.de/dataset/haltverbote-koeln",
  "https://offenedaten-koeln.de/dataset/landwirtschaftliche-fl%C3%A4chen-st%C3%A4dtischem-eigentum",
  "https://offenedaten-koeln.de/dataset/lastenrad-koeln",
  "https://offenedaten-koeln.de/dataset/menschen-mit-behinderung-koeln",
  "https://offenedaten-koeln.de/dataset/standorte-eheschliessungen-koeln-2018-0",
  "https://offenedaten-koeln.de/dataset/starkregen-gefahrenkarte-koeln",
  "https://offenedaten-koeln.de/dataset/unfallatlas-k%C3%B6ln-f%C3%BCr-geoportale",
  "https://offenedaten-koeln.de/dataset/unfallstatistik-k%C3%B6ln",
  "https://offenedaten-koeln.de/dataset/wertstoff-center-k%C3%B6ln",
  "https://offenedaten-koeln.de/dataset/winterdienst-koeln",
  "https://offenedaten.frankfurt.de/dataset/baugenehmigungen-frankfurt",
  "https://offenedaten.frankfurt.de/dataset/bueromarkt-report",
  "https://offenedaten.frankfurt.de/dataset/smart-city-sensoren",
  "https://offenedaten.frankfurt.de/dataset/strassenbeleuchtung-frankfurt",
  "https://offenedaten.frankfurt.de/dataset/wohnungsmarktbericht",
  "https://open-data.dortmund.de/api/v2/catalog/datasets/ds-hauptwohnbevolkerung-nach-konfession-pro-stadtbezirk-2021",
  "https://open.bydata.de/api/hub/repo/datasets/de-fluesse-wasserstand-kelheim-manching-bahnbruecke-13208509",
  "https://open.bydata.de/api/hub/repo/datasets/de-grundwasser-chemie-kelheim-1132733500114-1132733500114",
  "https://open.bydata.de/api/hub/repo/datasets/de-grundwasser-oberesstockwerk-kelheim-karlskron-probf-132c-11134",
  "https://open.bydata.de/api/hub/repo/datasets/de-grundwasser-oberesstockwerk-kelheim-muenchsmuenster-141a-11110",
  "https://open.bydata.de/api/hub/repo/datasets/erwerbsfaehige_leistungsberechtigte_sgbii-_empfaengerinnen_unterbezirksebene_ingolstadt",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-buergerterminals-muenchen",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-bundestagswahlen-2013",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-daten-der-raddauerzaehlstellen-muenchen-august-2020",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-indikatorenatlas-baugenehmigungen",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-indikatorenatlas-bevoelkerung-aussenwanderungsvolumen-83r65mct",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-monatszahlen-bauen",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-monatszahlen-freizeit",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-monatszahlen-museen",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-oktoberfest",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-p-r-anlagen-belegungsprognosen",
  "https://open.bydata.de/api/hub/repo/datasets/https-opendata-muenchen-de-dataset-question-answering-datensatz-basierend-auf-den-dokumenten-des-muenchner-dienstleistungsfinders",
  "https://open.bydata.de/api/hub/repo/datasets/inklusion-schule-bayern",
  "https://open.bydata.de/api/hub/repo/datasets/krebsregister-bayern",
  "https://open.bydata.de/api/hub/repo/datasets/sls-klimabaeume-wuerzburg~~1",
  "https://open.rlp.de/dataset/53938c96-ee88-4808-a2b7-901c3120ebd9",
  "https://open.rlp.de/dataset/72739a31-6646-48ca-a39f-437fd5f493bf",
  "https://open.rlp.de/dataset/7d72e953-3811-40a7-bc63-e9fe97e93aa1",
  "https://open.rlp.de/dataset/9cbeac56-feee-436a-bcf7-cf8a0dc35643",
  "https://open.rlp.de/dataset/c417fd3b-bedb-43ca-9cca-0559a14d1556",
  "https://opendata.leipzig.de/dataset/5658497b-34de-45d1-b5f5-8533e4a86b71",
  "https://opendata.leipzig.de/dataset/8fb12deb-17d0-44ce-841a-2d0a9db035f2",
  "https://opendata.leipzig.de/dataset/bildungsbericht-leipzig",
  "https://opendata.leipzig.de/dataset/eheschliessungen-leipzig",
  "https://opendata.leipzig.de/dataset/geburten-sterbefaelle-leipzig",
  "https://opendata.leipzig.de/dataset/integrationskurse-vhs-leipzig",
  "https://opendata.leipzig.de/dataset/kita-altersstruktur-leipzig",
  "https://opendata.leipzig.de/dataset/schulbibliotheken-leipzig",
  "https://opendata.leipzig.de/dataset/wanderungsstatistik-leipzig",
  "https://opendata.muenchen.de/dataset/solarpotenzialkataster",
  "https://opendata.muenchen.de/dataset/unfallschwerpunkte-rad",
  "https://opendata.ruhr/dataset/2d803d07-2de3-4b3d-b8d3-aaf36c2c392b",
  "https://opendata.ruhr/dataset/53e8c3f3-e0f0-4adb-b3e3-74ac03b869c9",
  "https://opendata.ruhr/dataset/c8292bcb-bccb-4039-835e-556882bb886c",
  "https://opendata.ruhr/dataset/weiterbildungsatlas-ruhr",
  "https://opendata.schleswig-holstein.de/dataset/2658b8a7-5d2b-3c4a-91c1-9c405078c",
  "https://opendata.schleswig-holstein.de/dataset/5b0bedba-f10a-30f6-9cb1-6d9796f8e",
  "https://opendata.schleswig-holstein.de/dataset/9a7015e8-704f-3d06-a3ae-6b5c11a50",
  "https://portal-chemnitz.opendata.arcgis.com/datasets/chemnitz::jugendberufshilfen",
  "https://register.dpma.de/patente",
  "https://registry.gdi-de.org/id/de.bw/835b5e74-0c37-4e52-b11f-7df94522abb7",
  "https://registry.gdi-de.org/id/de.bw/Gml_69DA0FAF-298C-4E32-8D51-DB5CE723743D",
  "https://registry.gdi-de.org/id/de.bw/Gml_98A1D066-F0E3-4EE2-B5F2-1E29C1BB911A",
  "https://registry.gdi-de.org/id/de.bw/Gml_A03BD2C9-6EC0-4F9C-97A4-0BFC4DE9B79B",
  "https://registry.gdi-de.org/id/de.bw/dde1c368-658d-4858-8ddd-16da494a154e",
  "https://rp-bwc.egovernor.de/rest/d30cb787-ba45-4a14-98f4-1f7fa5959838/document/RLP:document:313",
  "https://statistik.arbeitsagentur.de/dataset/beschaeftigung",
  "https://uvp-verbund.de/dataset/uvp-verfahren",
  "https://www.bast.de/verkehrsdaten",
  "https://www.bdew.de/wasser",
  "https://www.bfdi.bund.de/dataset/dpia-leitfaden-forschung",
  "https://www.bmbf.de/forschung",
  "https://www.bmel.de/agrarmarktpreise",
  "https://www.bmwk.de/kreativwirtschaft",
  "https://www.booking.com/reviews",
  "https://www.buehnenverein.de/de/publikationen-und-statistiken",
  "https://www.bundesbank.de/dataset/mfi-kreditstatistik",
  "https://www.bundesbank.de/dataset/zahlungsstatistik",
  "https://www.bundesnetzagentur.de/dataset/breitbandatlas",
  "https://www.bundesnetzagentur.de/dataset/ladesaeulenregister",
  "https://www.bundesnetzagentur.de/dataset/saidi-bericht",
  "https://www.bundesnetzagentur.de/gasnetz",
  "https://www.destatis.de/DE/Methoden/RDSC",
  "https://www.destatis.de/dataset/aussenhandel",
  "https://www.destatis.de/dataset/baulandpreise",
  "https://www.destatis.de/dataset/drittmittel-hochschulen",
  "https://www.destatis.de/dataset/ecommerce-umsatz",
  "https://www.destatis.de/dataset/hochschulstatistik",
  "https://www.destatis.de/dataset/innovationen",
  "https://www.destatis.de/dataset/insolvenzen",
  "https://www.destatis.de/dataset/lohnstrukturerhebung",
  "https://www.destatis.de/dataset/produktion",
  "https://www.destatis.de/dataset/strassenstatistik",
  "https://www.destatis.de/dataset/umweltoekonomische-gesamtrechnung",
  "https://www.destatis.de/dataset/verbraucherpreisindex",
  "https://www.destatis.de/dataset/verdienststatistik",
  "https://www.destatis.de/landwirtschaft",
  "https://www.destatis.de/tierbestand",
  "https://www.destatis.de/transport",
  "https://www.deutschertourismusverband.de/marketing",
  "https://www.deutschertourismusverband.de/statistik",
  "https://www.dihk.de/meisterpruefung",
  "https://www.dslv.org/flottenmanagement",
  "https://www.dslv.org/routenplanung",
  "https://www.einzelhandel.de/filialsuche",
  "https://www.ffa.de/kinostatistik.html",
  "https://www.iqtig.org/dataset/notaufnahme-qualitaet",
  "https://www.kulturstiftung-des-bundes.de/foerderung",
  "https://www.lebensmittelwarnung.de/bvl-lmw-de/opensearch",
  "https://www.museumsverband.de/statistik",
  "https://www.netzentwicklungsplan.de/dataset/investitionen",
  "https://www.nrz-hygiene.de/dataset/nosokomial-statistik",
  "https://www.oekolandbau.de/markt",
  "https://www.opendata-hro.de/dataset/namensaenderungen-rostock",
  "https://www.opendata-hro.de/dataset/schadstoffmobil-rostock",
  "https://www.opendata-hro.de/dataset/schulverpflegung-rostock",
  "https://www.opendata-hro.de/dataset/vhs-digitalkurse",
  "https://www.rki.de/dataset/ausbruchsberichte",
  "https://www.rki.de/dataset/laborstatistik",
  "https://www.rki.de/dataset/sars-cov2-sequenzen",
  "https://www.smard.de/strompreise",
  "https://www.umweltbundesamt.de/daten/lieferketten",
  "https://www.versorgungsatlas.de/dataset/versorgungsdaten",
  "https://www.zdh.de/statistik"
]);

const DATA = 'public/data';
let removed = 0, emptied = 0;
for (const f of readdirSync(DATA).filter(f => /^sector_.+\.json$/.test(f))) {
  const p = `${DATA}/${f}`;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    if (n.level === 4 && Array.isArray(n.details?.examples)) {
      const before = n.details.examples.length;
      n.details.examples = n.details.examples.filter(e => {
        let host = '';
        try { host = new URL(e.url).hostname; } catch {}
        return !RETIRED_HOSTS[host] && !DEAD.has(e.url);
      });
      removed += before - n.details.examples.length;
      if (!n.details.examples.length) { delete n.details.examples; if (before) emptied++; }
    }
    Object.values(n).forEach(walk);
  };
  walk(d);
  writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}
console.log(`entfernt: ${removed} Links; ${emptied} Datentypen haben danach keine Beispiele mehr`);
