/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION = 2000;   // 2 s loader
const CYCLE_PAUSE             = 20000;  // 20 s pause after a full cycle
const EVENT_DURATION          = 20000;  // 20 s display per event card
const BETWEEN_EVENTS          = 10000;   // 10 s between events

let eventList    = [];
let currentIndex = 0;
let dayTiles     = [];

/** Sleep helper */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/** Hide loader & reveal app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** Prepare calendar & data */
async function initializeData() {
  setMonthTitle();           // from calendar.js
  drawCalendarGrid();        // from calendar.js

  const all = await loadEventsFromCSV();  // from events.js
  highlightCalendarDays(all);             // from calendar.js

  // Only real events get cards
  eventList = all.filter(e => e.Type === "event");
  dayTiles  = document.querySelectorAll(".calendar-day");
}

/** Run the perpetual event loop */
async function runLoop() {
  if (!eventList.length) return console.warn("No events to display.");

  while (true) {
    const evt    = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10);
    const tile   = dayTiles[dayNum - 1];

    if (tile) {
      animateDayOpen(tile);  // from calendar.js
      await sleep(500);

      // SHOW overlay for the full EVENT_DURATION
      showEventCard(evt);    // from eventCard.js
      await sleep(EVENT_DURATION);

      // TEAR DOWN overlay and flip tile back
      removeEventCard();     // from eventCard.js
      animateDayClose(tile); // from calendar.js
    }

    // Advance index
    currentIndex++;
    if (currentIndex >= eventList.length) {
      currentIndex = 0;
      await sleep(CYCLE_PAUSE);
    } else {
      await sleep(BETWEEN_EVENTS);
    }
  }
}

/** Kick things off */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();

  // Always show loader for at least INITIAL_LOADER_DURATION
  setTimeout(() => {
    showApp();
    runLoop();
  }, INITIAL_LOADER_DURATION);
});
