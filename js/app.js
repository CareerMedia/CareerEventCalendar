/* ===================================
   js/app.js — Main Animation Orchestrator
   =================================== */

// Timing configuration
const INITIAL_CALENDAR_DELAY = 2000;   // ~2s pause on initial calendar view
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
    try {
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

        // 6. Show the main application regardless of what happens
        showApp();
        await sleep(INITIAL_CALENDAR_DELAY);

        // 7. Start perpetual event cycle ONLY if there are events
        if (eventLoopList.length > 0) {
            runEventLoop();
        } else {
            console.warn("No events to display in the loop. The calendar will remain static.");
        }
    } catch (error) {
        console.error("A critical error occurred during app initialization:", error);
        // You might want to show an error message to the user here instead of just the loader
        // For now, we'll still hide the loader to not get stuck.
        showApp();
        document.getElementById('calendar-grid').innerHTML = `<p style="color: red; text-align: center; font-size: 1.5rem;">Error loading application. Please check the console.</p>`;
    }
}

/**
 * Main perpetual loop:
 * - Flips open the tile for each event
 * - Shows its detail card
 * - Flips back, advances index
 * - Pauses appropriately at end of cycle or between events
 */
async function runEventLoop() {
  // This check is now done in initApp, but we'll keep it as a safeguard.
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
      await sleep(600); // Wait for flip-out animation
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

// Kick off when DOM is ready
window.addEventListener("DOMContentLoaded", initApp);
