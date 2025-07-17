/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION = 2000;   // 2 s loader
const CYCLE_PAUSE = 20000;               // 20 s pause after cycle
const EVENT_DURATION = 15000;            // 15 s per event
const BETWEEN_EVENTS = 1200;             // 1.2 s between

let eventList = [];
let currentIndex = 0;
let dayTiles = [];

/** Simple sleep util */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/** Hide loader & show app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** Initialize calendar layout + data */
async function initializeData() {
  setMonthTitle();           // calendar.js
  drawCalendarGrid();        // calendar.js

  const all = await loadEventsFromCSV();       // events.js
  highlightCalendarDays(all);                  // calendar.js

  eventList = all.filter(e => e.Type === "event");
  dayTiles  = document.querySelectorAll(".calendar-day");
}

/** Run the infinite event loop */
async function runLoop() {
  if (!eventList.length) return;
  while (true) {
    const evt = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10);
    const tile = dayTiles[dayNum - 1];

    if (tile) {
      animateDayOpen(tile);    // calendar.js
      await sleep(500);
      showEventCard(evt);      // eventCard.js
      await sleep(EVENT_DURATION);
      removeEventCard();       // eventCard.js
      animateDayClose(tile);   // calendar.js
    }

    currentIndex++;
    if (currentIndex >= eventList.length) {
      currentIndex = 0;
      await sleep(CYCLE_PAUSE);
    } else {
      await sleep(BETWEEN_EVENTS);
    }
  }
}

/** Kick off everything */
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Prepare data/layout
  await initializeData();

  // 2) Always show loader for at least INITIAL_LOADER_DURATION
  setTimeout(() => {
    showApp();
    runLoop();
  }, INITIAL_LOADER_DURATION);
});
