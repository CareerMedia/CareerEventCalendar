/* ===================================
   js/app.js — Main Animation Orchestrator
   =================================== */

// Timing configuration
const INITIAL_CALENDAR_DELAY = 5000;   // 5s pause on initial calendar view
const CYCLE_CALENDAR_DELAY   = 20000;  // 20s pause at end of full cycle
const EVENT_DISPLAY_DELAY    = 15000;  // 15s display per event card
const BETWEEN_EVENTS_DELAY   = 1200;   // 1.2s between events

// State
let allRawEvents   = [];  // Loaded from CSV (includes holidays & events)
let eventLoopList  = [];  // Filtered list of only Type==="event"
let eventIndex     = 0;   // Current index in eventLoopList
let calendarDays   = [];  // NodeList of .calendar-day elements

/**
 * Sleep helper
 * @param {number} ms — milliseconds to wait
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Hide loader and reveal main app container
 */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/**
 * Initialize the application:
 * 1. Set dynamic month title
 * 2. Draw the 31-day calendar grid
 * 3. Load and highlight all events/holidays
 * 4. Build eventLoopList (only real events)
 * 5. Pause on calendar view, then start the loop
 */
async function initApp() {
  // 1. Header
  setMonthTitle();                   // calendar.js

  // 2. Calendar grid
  drawCalendarGrid();                // calendar.js

  // 3. Load CSV data
  allRawEvents = await loadEventsFromCSV();  // events.js

  // 4. Highlight days
  highlightCalendarDays(allRawEvents);       // calendar.js

  // 5. Prepare loop list & elements
  eventLoopList = allRawEvents.filter(e => e.Type === "event");
  calendarDays   = document.querySelectorAll(".calendar-day");

  // 6. Show calendar for initial delay
  await sleep(INITIAL_CALENDAR_DELAY);
  showApp();

  // 7. Start perpetual event cycle
  runEventLoop();
}

/**
 * Main perpetual loop:
 * - Flips open the tile for each event
 * - Shows its detail card
 * - Flips back, advances index
 * - Pauses appropriately at end of cycle or between events
 */
async function runEventLoop() {
  if (!eventLoopList.length) {
    console.warn("No events to display.");
    return;
  }

  while (true) {
    const evt    = eventLoopList[eventIndex];
    const dayNum = parseInt(evt.Day, 10);
    const tile   = calendarDays[dayNum - 1];

    if (tile) {
      // 1. Flip open calendar tile
      animateDayOpen(tile);        // calendar.js
      await sleep(1500);

      // 2. Show full-screen event card
      showEventCard(evt);          // eventCard.js
      await sleep(EVENT_DISPLAY_DELAY);

      // 3. Remove card & flip back
      removeEventCard();           // eventCard.js
      animateDayClose(tile);       // calendar.js
    }

    // 4. Advance index
    eventIndex++;
    const endOfCycle = eventIndex >= eventLoopList.length;

    if (endOfCycle) {
      eventIndex = 0;
      // Pause on calendar at cycle end
      await sleep(CYCLE_CALENDAR_DELAY);
    } else {
      // Short pause before next event
      await sleep(BETWEEN_EVENTS_DELAY);
    }
  }
}

// Kick off when DOM is ready ok
window.addEventListener("DOMContentLoaded", initApp);
