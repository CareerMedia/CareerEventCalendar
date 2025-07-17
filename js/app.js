/* ===================================
   js/app.js — Loader + Main Orchestrator
   =================================== */

const INITIAL_LOADER_DURATION = 2000;    // 2 s loader
const CALENDAR_DISPLAY_DURATION = 20000; // 20 s display on calendar between events
const EVENT_DURATION = 20000;            // 20 s display per event card

let eventList    = [];
let currentIndex = 0;
let dayTiles     = [];

/** Simple sleep utility */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Hide loader & reveal the main app */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/** Load and prepare calendar grid + data */
async function initializeData() {
  setMonthTitle();           // from calendar.js
  drawCalendarGrid();        // from calendar.js

  const allItems = await loadEventsFromCSV();  // from events.js
  highlightCalendarDays(allItems);             // from calendar.js

  // Only keep real events in the loop
  eventList = allItems.filter(item => item.Type === "event");
  dayTiles  = Array.from(document.querySelectorAll(".calendar-day"));
}

/** Main perpetual loop */
async function runLoop() {
  if (!eventList.length) {
    console.warn("No events to display.");
    return;
  }

  while (true) {
    const evt    = eventList[currentIndex];
    const dayNum = parseInt(evt.Day, 10);
    const tile   = dayTiles[dayNum - 1];

    if (tile) {
      // Flip open the calendar tile
      animateDayOpen(tile);  // from calendar.js
      await sleep(500);

      // Show the full-screen event card
      showEventCard(evt);    // from eventCard.js
      await sleep(EVENT_DURATION);

      // Remove the event card and flip the tile back
      removeEventCard();     // from eventCard.js
      animateDayClose(tile); // from calendar.js
    }

    // After closing, display the calendar for 20 s
    await sleep(CALENDAR_DISPLAY_DURATION);

    // Advance to next event, wrapping around
    currentIndex = (currentIndex + 1) % eventList.length;
  }
}

/** Entry point */
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Prepare everything
  await initializeData();

  // 2) Show loader then app and start loop
  setTimeout(() => {
    showApp();
    runLoop();
  }, INITIAL_LOADER_DURATION);
});
