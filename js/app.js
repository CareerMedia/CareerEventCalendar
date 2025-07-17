/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION   = 3000;   // 3 s loader
const CALENDAR_PAUSE_DURATION   = 20000;  // 20 s on calendar between events
const EVENT_CARD_DURATION       = 10000;  // 10 s showing each event
const BETWEEN_EVENTS_DELAY      = 1200;   // 1.2 s between events

let eventList    = [];
let currentIndex = 0;
let dayTiles     = [];

/** Simple sleep utility */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/** Hide loader & reveal calendar/app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** Prepare calendar grid & load data */
async function initializeData() {
  setMonthTitle();           // from calendar.js
  drawCalendarGrid();        // from calendar.js

  const all = await loadEventsFromCSV();  // from events.js
  highlightCalendarDays(all);             // from calendar.js

  // Only “event” items go into the loop
  eventList = all.filter(item => item.Type === "event");
  dayTiles  = Array.from(document.querySelectorAll(".calendar-day"));
}

/** The perpetual loop */
async function runLoop() {
  if (!eventList.length) {
    console.warn("No events found.");
    return;
  }

  // Initial 20 s pause on the calendar before first event
  await sleep(CALENDAR_PAUSE_DURATION);

  while (true) {
    const evt    = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10) - 1;
    const tile   = dayTiles[dayNum];

    if (tile) {
      // 1) Pulse the date tile
      animateDayOpen(tile);  // calendar.js
      await sleep(500);

      // 2) Show the full-screen event card
      showEventCard(evt);    // eventCard.js
      await sleep(EVENT_CARD_DURATION);

      // 3) Animate tile back and remove the card, awaiting complete hide
      animateDayClose(tile);         // calendar.js
      await removeEventCardAsync();  // eventCard.js (async teardown)
    }

    // 4) 20 s pause on calendar before next event
    await sleep(CALENDAR_PAUSE_DURATION);

    // 5) Advance & wrap
    currentIndex = (currentIndex + 1) % eventList.length;

    // 6) Small gap before pulsing next tile
    await sleep(BETWEEN_EVENTS_DELAY);
  }
}

/** Entry point on DOM ready */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();

  // Show loader, then calendar & start loop
  setTimeout(() => {
    showApp();
    runLoop();
  }, INITIAL_LOADER_DURATION);
});
