/* ===============================
   events.js - Event CSV Loader
   =============================== */

const CSV_PATH = "data/events.csv";

/**
 * Load and parse the events CSV into JS objects
 * @returns {Promise<Array<Object>>}
 */
async function loadEventsFromCSV() {
  try {
    const response = await fetch(CSV_PATH);
    const csvText = await response.text();
    const parsedEvents = parseCSV(csvText);
    const cleanedEvents = cleanAndSortEvents(parsedEvents);
    return cleanedEvents;
  } catch (error) {
    console.error("Failed to load events.csv:", error);
    return [];
  }
}

/**
 * Parse raw CSV text into object array
 * @param {string} csv
 * @returns {Array<Object>}
 */
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const entries = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] || "";
    });
    return obj;
  });

  return entries;
}

/**
 * Filter and sort event objects by day (1–31)
 * @param {Array<Object>} events
 * @returns {Array<Object>}
 */
function cleanAndSortEvents(events) {
  return events
    .filter(event => {
      const day = parseInt(event.Day);
      const validType = event.Type === "event" || event.Type === "holiday";
      return !isNaN(day) && day >= 1 && day <= 31 && validType;
    })
    .sort((a, b) => {
      const dayA = parseInt(a.Day);
      const dayB = parseInt(b.Day);
      return dayA - dayB;
    });
}
