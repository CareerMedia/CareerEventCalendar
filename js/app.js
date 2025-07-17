/* ============================
   app.js - Main Animation Engine
   ============================ */

// Global Variables
let allEvents = [];            // Stores parsed event objects
let eventIndex = 0;            // Keeps track of which event is currently showing
let calendarDays = [];         // DOM references to calendar day elements
const animationDelay = 6000;   // Time in ms to show each event card before next

/**
 * Utility: Wait for X milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Set the current month name based on real date
 */
function setMonthTitle() {
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  document.getElementById("month-title").textContent = monthNames[now.getMonth()];
}

/**
 * Hide loader and reveal app once everything is ready
 */
function showApp() {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");

  loader.style.display = "none";
  app.classList.remove("hidden");
}

/**
 * Prepare the calendar and load event data
 */
async function initApp() {
  try {
    // Set month label
    setMonthTitle();

    // Step 1: Draw the base calendar grid
    drawCalendarGrid(); // <- calendar.js

    // Step 2: Load events from CSV
    allEvents = await loadEventsFromCSV(); // <- events.js

    // Step 3: Mark event days in the calendar
    highlightCalendarDays(allEvents); // <- calendar.js

    // Step 4: Reference all calendar day elements
    calendarDays = document.querySelectorAll(".calendar-day");

    // Step 5: Show the app
    await sleep(1500); // Let loader breathe for a sec
    showApp();

    // Step 6: Begin cycling through events
    runEventLoop();

  } catch (err) {
    console.error("App failed to initialize:", err);
  }
}

/**
 * Main animation loop: shows one event at a time
 */
async function runEventLoop() {
  while (true) {
    // Safety check
    if (!allEvents.length) {
      console.warn("No events loaded to cycle.");
      return;
    }

    // Get current event
    const currentEvent = allEvents[eventIndex];

    // Reference day block on calendar and animate it
    const dayNum = parseInt(currentEvent.Day);
    const dayElement = calendarDays[dayNum - 1]; // 0-indexed
    animateDayOpen(dayElement); // <- calendar.js

    // Wait a moment to allow tile animation
    await sleep(1000);

    // Render full-screen event card
    showEventCard(currentEvent); // <- eventCard.js

    // Show for duration
    await sleep(animationDelay);

    // Remove event overlay
    removeEventCard(); // <- eventCard.js

    // Reset tile (optional)
    animateDayClose(dayElement); // <- calendar.js

    // Step to next event, wrap around if needed
    eventIndex = (eventIndex + 1) % allEvents.length;

    // Short delay before next flip
    await sleep(1200);
  }
}

// Start the app after page load
window.addEventListener("DOMContentLoaded", initApp);
