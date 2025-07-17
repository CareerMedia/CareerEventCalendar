/* ================================
   calendar.js - Month View Builder
   ================================ */

const calendarGrid = document.getElementById("calendar-grid");

/**
 * Generate the static 31-day grid layout
 */
function drawCalendarGrid() {
  // Clear any previous content
  calendarGrid.innerHTML = "";

  for (let i = 1; i <= 31; i++) {
    const day = document.createElement("div");
    day.classList.add("calendar-day");
    day.setAttribute("data-day", i);

    const dayNum = document.createElement("div");
    dayNum.classList.add("day-number");
    dayNum.textContent = i;

    const eventPreview = document.createElement("div");
    eventPreview.classList.add("event-title-preview");
    eventPreview.textContent = ""; // Will be updated later if needed

    day.appendChild(dayNum);
    day.appendChild(eventPreview);

    calendarGrid.appendChild(day);
  }
}

/**
 * Highlight event and holiday days on the calendar
 * @param {Array} events - Parsed event objects
 */
function highlightCalendarDays(events) {
  const grouped = {};

  // Group events by day
  events.forEach(evt => {
    const day = parseInt(evt.Day);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(evt);
  });

  // Loop through each day and update DOM
  Object.keys(grouped).forEach(dayKey => {
    const dayNum = parseInt(dayKey);
    const eventsForDay = grouped[dayNum];
    const cell = document.querySelector(`.calendar-day[data-day='${dayNum}']`);
    const preview = cell.querySelector(".event-title-preview");

    const hasEvents = eventsForDay.some(e => e.Type === "event");
    const hasHoliday = eventsForDay.some(e => e.Type === "holiday");

    if (hasEvents) {
      cell.classList.add("event");
      preview.textContent = eventsForDay[0].Title || "Event";
    } else if (hasHoliday) {
      const marker = document.createElement("div");
      marker.classList.add("holiday-marker");
      marker.textContent = eventsForDay[0].Title;
      cell.appendChild(marker);
    }
  });
}

/**
 * Add animation for flipping open a calendar tile
 * @param {HTMLElement} tile
 */
function animateDayOpen(tile) {
  if (!tile) return;
  tile.style.transition = "transform 0.6s ease";
  tile.style.transform = "rotateY(180deg)";
}

/**
 * Reset animation after viewing event
 * @param {HTMLElement} tile
 */
function animateDayClose(tile) {
  if (!tile) return;
  tile.style.transition = "transform 0.6s ease";
  tile.style.transform = "rotateY(0deg)";
}
