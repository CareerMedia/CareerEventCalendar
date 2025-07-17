/* ============================
   js/app.js - Main Animation Engine
   ============================ */

// Configuration
const INITIAL_CALENDAR_DELAY = 20000;  // 20s pause before first event
const CYCLE_CALENDAR_DELAY   = 20000;  // 20s pause at end of full cycle
const EVENT_DISPLAY_DELAY    = 15000;  // 15s per event card
const BETWEEN_EVENTS_DELAY   = 1200;   // 1.2s between events

// State
let allEvents     = [];   // Array of event objects loaded from CSV
let eventIndex    = 0;    // Index of the current event in the loop
let calendarDays  = [];   // NodeList of .calendar-day elements

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Set the calendar header to the current month name.
 */
function setMonthTitle() {
  const now = new Date();
  const monthNames = [
    "January", "February", "March",     "April",
    "May",     "June",     "July",      "August",
    "September","October",  "November", "December"
  ];
  const titleEl = document.getElementById("month-title");
  titleEl.textContent = monthNames[now.getMonth()];
}

/**
 * Hide the loader screen and reveal the main app UI.
 */
function showApp() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/**
 * Initialize the app:
 * 1. Set month title
 * 2. Draw calendar grid
 * 3. Load and highlight events
 * 4. Pause on calendar
 * 5. Start the event loop
 */
async function initApp() {
  // 1. Month title
  setMonthTitle();

  // 2. Draw calendar grid
  drawCalendarGrid();               // from calendar.js

  // 3. Load events from CSV
  allEvents = await loadEventsFromCSV();  // from events.js

  // 4. Highlight days that have events/holidays
  highlightCalendarDays(allEvents); // from calendar.js

  // 5. Get references to all day tiles
  calendarDays = document.querySelectorAll(".calendar-day");

  // 6. Pause on month-view calendar
  await sleep(INITIAL_CALENDAR_DELAY);
  showApp();

  // 7. Start cycling through events
  runEventLoop();
}

/**
 * Main loop: cycles through allEvents indefinitely.
 * Applies flips, shows event cards, and pauses appropriately.
 */
async function runEventLoop() {
  if (!allEvents.length) {
    console.warn("No events to display.");
    return;
  }

  while (true) {
    // Get the next event
    const evt = allEvents[eventIndex];
    const dayNum = parseInt(evt.Day, 10);

    // Find the calendar tile for this event
    const tile = calendarDays[dayNum - 1];
    if (tile) {
      // Flip open animation
      animateDayOpen(tile);          // from calendar.js
      await sleep(1500);             // allow flip to complete

      // Show full-screen event card
      showEventCard(evt);            // from eventCard.js
      await sleep(EVENT_DISPLAY_DELAY);

      // Remove event overlay and flip back
      removeEventCard();             // from eventCard.js
      animateDayClose(tile);         // from calendar.js
    }

    // Advance index
    eventIndex++;
    const endOfCycle = eventIndex >= allEvents.length;

    if (endOfCycle) {
      // Reset and pause at end of full cycle
      eventIndex = 0;
      await sleep(CYCLE_CALENDAR_DELAY);
    } else {
      // Short pause before next event
      await sleep(BETWEEN_EVENTS_DELAY);
    }
  }
}

// Kick off initialization once the DOM is fully loaded
window.addEventListener("DOMContentLoaded", initApp);
