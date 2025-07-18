/* ==============================================
   js/events.js — Load & Parse events.csv data
   ============================================== */

const CSV_PATH = "data/events.csv";

/** Fetch & parse the CSV, preserving row order */
async function loadEventsFromCSV() {
  try {
    const res  = await fetch(CSV_PATH);
    const text = await res.text();
    const rows = parseCSV(text);
    const cleaned = cleanAndFilterEvents(rows);
    console.log(`📥 Loaded ${rows.length} rows, ${cleaned.length} valid events/holidays`);
    return cleaned;
  } catch (err) {
    console.error("❌ Could not load events.csv:", err);
    return [];
  }
}

/** Convert CSV text to array of objects (no sorting) */
function parseCSV(raw) {
  const [header, ...lines] = raw.trim().split("\n");
  const keys = header.split(",").map(h => h.trim());
  return lines.map(line => {
    const vals = line.split(",").map(cell => cell.trim());
    const obj  = {};
    keys.forEach((k, i) => (obj[k] = vals[i] || ""));
    return obj;
  });
}

/** Keep only days 1–31, types “event” or “holiday”, case-insensitive */
function cleanAndFilterEvents(arr) {
  return arr.filter(e => {
    const day  = parseInt(e.Day, 10);
    const type = (e.Type || "").trim().toLowerCase();
    return !isNaN(day)
        && day >= 1
        && day <= 31
        && (type === "event" || type === "holiday");
  });
}
