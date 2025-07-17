/* ========================================
   js/calendar.js — Month View & Pulsing
   ======================================== */

const calendarGrid   = document.getElementById("calendar-grid");
const monthTitleEl   = document.getElementById("month-title");

/**
 * Sets header to “<Month> Events”
 */
function setMonthTitle() {
  const now = new Date();
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  monthTitleEl.textContent = `${names[now.getMonth()]} Events`;
}

/**
 * Draw a fixed 31-day grid
 */
function drawCalendarGrid() {
  calendarGrid.innerHTML = "";
  for (let i = 1; i <= 31; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.dataset.day = i;

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = i;

    const preview = document.createElement("div");
    preview.className = "event-title-preview";

    cell.append(num, preview);
    calendarGrid.append(cell);
  }
}

/**
 * Highlight days based on events/holidays
 * @param {Array} events
 */
function highlightCalendarDays(events) {
  const byDay = events.reduce((acc,e) => {
    const d = parseInt(e.Day,10);
    (acc[d] = acc[d]||[]).push(e);
    return acc;
  }, {});

  Object.keys(byDay).forEach(d => {
    const cell = calendarGrid.querySelector(`.calendar-day[data-day="${d}"]`);
    if (!cell) return;
    const arr = byDay[d];
    if (arr.some(e => e.Type==="event")) {
      cell.classList.add("event");
      cell.querySelector(".event-title-preview").textContent =
        arr.find(e=>e.Type==="event").Title;
    } else {
      cell.classList.add("holiday");
      const m = document.createElement("div");
      m.className = "holiday-marker";
      m.textContent = arr.find(e=>e.Type==="holiday").Title;
      cell.append(m);
    }
  });
}

/**
 * Pulse the tile before event card
 */
function animateDayOpen(tile) {
  tile.classList.add("pulse");
}

/**
 * Remove pulse class
 */
function animateDayClose(tile) {
  tile.classList.remove("pulse");
}
