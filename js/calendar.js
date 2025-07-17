/* ================================
   js/calendar.js — Month View Builder
   ================================ */

const calendarGrid = document.getElementById("calendar-grid");
const monthTitleEl = document.getElementById("month-title");

/**
 * Set the header to “<Month> Events” based on the current date.
 */
function setMonthTitle() {
  const now = new Date();
  const monthNames = [
    "January", "February", "March",     "April",
    "May",     "June",     "July",      "August",
    "September","October", "November", "December"
  ];
  monthTitleEl.textContent = `${monthNames[now.getMonth()]} Events`;
}

/**
 * Generate a static 31-day grid layout.
 * Each cell contains:
 *  - .day-number for the date
 *  - .event-title-preview for a preview title
 */
function drawCalendarGrid() {
  calendarGrid.innerHTML = ""; // clear previous grid
  for (let i = 1; i <= 31; i++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-day");
    cell.setAttribute("data-day", i);

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    dayNumber.textContent = i;

    const preview = document.createElement("div");
    preview.classList.add("event-title-preview");
    preview.textContent = "";

    cell.appendChild(dayNumber);
    cell.appendChild(preview);
    calendarGrid.appendChild(cell);
  }
}

/**
 * Highlight calendar cells based on events array.
 * @param {Array<Object>} events - each with { Day, Title, Type }
 */
function highlightCalendarDays(events) {
  // Group events by day
  const byDay = events.reduce((acc, evt) => {
    const day = parseInt(evt.Day, 10);
    if (!acc[day]) acc[day] = [];
    acc[day].push(evt);
    return acc;
  }, {});

  // Iterate each day group
  Object.keys(byDay).forEach(dayKey => {
    const dayNum = Number(dayKey);
    const cell = calendarGrid.querySelector(`.calendar-day[data-day='${dayNum}']`);
    if (!cell) return;

    const eventsForDay = byDay[dayNum];
    const hasEvent = eventsForDay.some(e => e.Type === "event");
    const hasHoliday = eventsForDay.some(e => e.Type === "holiday");

    if (hasEvent) {
      // Mark as event and show first title
      cell.classList.add("event");
      const preview = cell.querySelector(".event-title-preview");
      preview.textContent = eventsForDay.find(e => e.Type === "event").Title || "Event";
    } else if (hasHoliday) {
      // Mark as holiday and append a marker
      cell.classList.add("holiday");
      const marker = document.createElement("div");
      marker.classList.add("holiday-marker");
      marker.textContent = eventsForDay.find(e => e.Type === "holiday").Title || "Holiday";
      cell.appendChild(marker);
    }
}

/**
 * Animate a calendar tile opening (flip effect).
 * @param {HTMLElement} tile
 */
function animateDayOpen(tile) {
  if (!tile) return;
  tile.style.transition = "transform 0.6s ease";
  tile.style.transform = "rotateY(180deg)";
}

/**
 * Animate a calendar tile closing (flip back).
 * @param {HTMLElement} tile
 */
function animateDayClose(tile) {
  if (!tile) return;
  tile.style.transition = "transform 0.6s ease";
  tile.style.transform = "rotateY(0deg)";
}

// Export functions if using modules (optional)
// export { setMonthTitle, drawCalendarGrid, highlightCalendarDays, animateDayOpen, animateDayClose };
