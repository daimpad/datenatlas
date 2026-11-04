// Regeln für Links in den Sektordaten — für Validator und Linkprüfung.
//
// Zwei Felder tragen Links: `details.examples` (Beispieldatensätze, die es zu
// einem Datentyp tatsächlich gibt) und `details.sources` (Quellen, die die
// Beschreibung belegen). Beide müssen auf etwas zeigen, das es gibt.
//
// Eine Stichprobe von 40 der 937 Beispiel-Links ergab im November 2026: rund
// ein Viertel führte auf einen echten Datensatz. 86 Links zeigten auf mcloud.de,
// das abgeschaltet ist und jede Adresse auf seine Abschiedsmeldung umleitet —
// mit Status 200. Ein Statuscode allein beweist deshalb nichts; die
// Linkprüfung vergleicht auch, wo eine Weiterleitung endet.

/** Abgeschaltete Portale. Links dorthin lehnt der Validator ab. */
export const RETIRED_HOSTS = {
  'mcloud.de':     'mCLOUD ist abgeschaltet; jede Adresse leitet auf mobilithek.info/blog/auf-wiedersehen-mcloud um.',
  'www.mcloud.de': 'mCLOUD ist abgeschaltet; jede Adresse leitet auf mobilithek.info/blog/auf-wiedersehen-mcloud um.',
};

/** Einfache Formprüfung eines Link-Eintrags → Liste von Problemen. */
export function linkProblems(entry) {
  const out = [];
  if (!entry || typeof entry !== 'object') return ['kein Objekt'];
  if (!entry.title || typeof entry.title !== 'string') out.push('title fehlt');
  if (!entry.publisher || typeof entry.publisher !== 'string') out.push('publisher fehlt');
  let u;
  try { u = new URL(entry.url); } catch { out.push(`url ungültig: ${entry.url}`); return out; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') out.push(`url-Schema ${u.protocol}`);
  if (RETIRED_HOSTS[u.hostname]) out.push(`${u.hostname}: ${RETIRED_HOSTS[u.hostname]}`);
  return out;
}
