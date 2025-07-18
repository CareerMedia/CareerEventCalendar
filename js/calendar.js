/* ========================================
   js/calendar.js — Month View & Multi-Event
   ======================================== */

const calendarGrid   = document.getElementById("calendar-grid");
const monthTitleEl   = document.getElementById("month-title");

/** Sets header to “<Month> Events” */
function setMonthTitle() {
  const now = new Date();
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  monthTitleEl.textContent = `${names[now.getMonth()]} Events`;
}

/** Draw a fixed 31-day grid */
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
 * Highlight days based on events/holidays,
 * and list ALL event titles in spreadsheet order.
 */
function highlightCalendarDays(events) {
  // Group by day
  const byDay = events.reduce((acc, e) => {
    const d = parseInt(e.Day, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});

  Object.keys(byDay).forEach(d => {
    const cell = calendarGrid.querySelector(`.calendar-day[data-day='${d}']`);
    if (!cell) return;
    const arr = byDay[d];

    // Show all event titles, in order
    const previews = arr.filter(e => e.Type === "event");
    if (previews.length) {
      cell.classList.add("event");
      const previewEl = cell.querySelector(".event-title-preview");
      previewEl.innerHTML = previews
        .map(ev => `<div class="event-preview-item">${ev.Title}</div>`)
        .join("");
    }

    // Holiday-only case
    const holidays = arr.filter(e => e.Type === "holiday");
    if (!previews.length && holidays.length) {
      cell.classList.add("holiday");
      const marker = document.createElement("div");
      marker.className = "holiday-marker";
      marker.textContent = holidays[0].Title;
      cell.append(marker);
    }
  });
}
