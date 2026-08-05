// ── GoatCounter ─────────────────────────────────────────────────────────────
//
// Einzige Quelle für das Zähl-Snippet. Es muss an zwei sehr verschiedenen
// Stellen landen: in den handgeschriebenen Seiten (index.html, ueber.html, über
// das analytics()-Plugin in vite.config.js) und in den 155 zur Bauzeit
// erzeugten Seiten (scripts/build-static-pages.js). Ohne gemeinsame Konstante
// stünde die Zähl-URL dreimal im Repo — und beim nächsten Wechsel würde eine
// davon vergessen.
//
// Bewusst NICHT eingebunden: expand.html und begruendungen.html. Das sind
// interne Redaktionswerkzeuge auf noindex; ihre Nutzung ist keine
// Website-Reichweite, und die Arbeitsmuster der Redaktion gehören nicht an
// einen Dritten.
//
// https statt des protokollrelativen //gc.zgo.at aus der Vorlage: Die Seite
// wird ausschließlich über https ausgeliefert, das Weglassen des Protokolls
// stammt aus der Zeit gemischter http/https-Auslieferung und bringt hier
// nichts.

export const GOATCOUNTER_ENDPOINT = 'https://datenatlas.goatcounter.com/count';

export const ANALYTICS_TAG =
  `<script data-goatcounter="${GOATCOUNTER_ENDPOINT}"\n        async src="https://gc.zgo.at/count.js"></script>`;
