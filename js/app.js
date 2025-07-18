/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION  = 2000;   // loader time
const CALENDAR_PAUSE_DURATION  = 20000;  // calendar visible
const EVENT_CARD_DURATION      = 15000;  // per event
const BETWEEN_EVENTS_DELAY     = 1200;   // tiny gap

let allItems     = [];
let eventList    = [];
let currentIndex = 0;
let dayTiles     = [];

/** Sleep helper */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

/** Hide loader & show the calendar/app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** 1) Prepare calendar + data */
async function initializeData() {
  setMonthTitle();                  // calendar.js
  drawCalendarGrid();               // calendar.js

  allItems = await loadEventsFromCSV();             // events.js
  highlightCalendarDays(allItems);                  // calendar.js

  // Every non-holiday row becomes an event popup
  eventList = allItems.filter(e =>
    (e.Type || "").trim().toLowerCase() !== "holiday"
  );
  console.log(`🔔 Loaded ${allItems.length} rows, scheduling ${eventList.length} pop-ups`);
  dayTiles = Array.from(document.querySelectorAll(".calendar-day"));
}

/** 2) Main loop: show calendar, then each event */
async function runEventLoop() {
  if (!eventList.length) {
    console.warn("No events to display.");
    return;
  }

  // Initial pause on calendar
  await sleep(CALENDAR_PAUSE_DURATION);

  while (true) {
    const evt    = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10) - 1;
    const tile   = dayTiles[dayNum];

    if (tile) {
      animateDayOpen(tile);     // calendar.js
      await sleep(500);

      await showEventCard(evt); // eventCard.js now returns a Promise
      await sleep(EVENT_CARD_DURATION);

      animateDayClose(tile);    // calendar.js
      await hideEventCard();    // eventCard.js returns a Promise
    }

    // Back to calendar for a bit
    await sleep(CALENDAR_PAUSE_DURATION);

    // Advance & loop
    currentIndex = (currentIndex + 1) % eventList.length;
    await sleep(BETWEEN_EVENTS_DELAY);
  }
}

/** Kick off when DOM ready */
document.addEventListener("DOMContentLoaded", async () => {
  await initializeData();
  setTimeout(() => {
    showApp();
    runEventLoop();
  }, INITIAL_LOADER_DURATION);
});
