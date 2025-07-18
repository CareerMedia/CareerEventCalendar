/* ==============================================
   js/events.js — Load & Parse events.csv data
   ============================================== */

const CSV_PATH = "data/events.csv";

/** Fetch & parse */
async function loadEventsFromCSV() {
  try {
    const res = await fetch(CSV_PATH);
    const text = await res.text();
    return cleanAndFilterEvents(parseCSV(text));
  } catch (err) {
    console.error("Could not load events.csv", err);
    return [];
  }
}

/** Basic CSV → objects in original row order */
function parseCSV(raw) {
  const [head, ...rows] = raw.trim().split("\n");
  const keys = head.split(",").map(h => h.trim());
  return rows.map(r => {
    const vals = r.split(",").map(c => c.trim());
    return keys.reduce((o, k, i) => (o[k] = vals[i] || "", o), {});
  });
}

/** Keep only days 1–31 and types event/holiday, preserve CSV order */
function cleanAndFilterEvents(arr) {
  return arr.filter(e => {
    const d = parseInt(e.Day, 10);
    return (
      !isNaN(d) &&
      d >= 1 &&
      d <= 31 &&
      (e.Type === "event" || e.Type === "holiday")
    );
  });
}
