/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION  = 2000;  // loader
const CALENDAR_PAUSE_DURATION  = 20000; // calendar visible
const EVENT_CARD_DURATION      = 15000; // per event
const BETWEEN_EVENTS_DELAY     = 1200;  // gap

let allItems    = [];
let eventList   = [];
let currentIndex = 0;
let dayTiles     = [];

/** Sleep helper */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/** Hide loader & show app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** 1) Prepare calendar + data */
async function initializeData() {
  setMonthTitle();                   // calendar.js
  drawCalendarGrid();                // calendar.js

  allItems  = await loadEventsFromCSV();  // events.js
  highlightCalendarDays(allItems);        // calendar.js

  // Build pop-up list of exactly ALL events in CSV order
  eventList = allItems.filter(e => e.Type.trim().toLowerCase() === "event");
  console.log(`🔔 Will show ${eventList.length} pop-ups`);
  dayTiles = Array.from(document.querySelectorAll(".calendar-day"));
}

/** 2) Main loop */
async function runEventLoop() {
  if (!eventList.length) {
    console.warn("No events to display.");
    return;
  }

  // initial pause
  await sleep(CALENDAR_PAUSE_DURATION);

  while (true) {
    const evt    = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10) - 1;
    const tile   = dayTiles[dayNum];

    if (tile) {
      // pulse tile
      animateDayOpen(tile);   // calendar.js
      await sleep(500);

      // pop-up
      showEventCard(evt);     // eventCard.js
      await sleep(EVENT_CARD_DURATION);

      // teardown
      animateDayClose(tile);  // calendar.js
      await removeEventCardAsync(); // eventCard.js
    }

    // calendar pause
    await sleep(CALENDAR_PAUSE_DURATION);

    currentIndex = (currentIndex + 1) % eventList.length;
    await sleep(BETWEEN_EVENTS_DELAY);
  }
}

/** On DOM ready… */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();
  setTimeout(() => {
    showApp();
    runEventLoop();
  }, INITIAL_LOADER_DURATION);
});
