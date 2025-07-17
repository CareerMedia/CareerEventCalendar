/* ========================================
   js/calendar.js — Month View + Tile Flips
   ======================================== */

const calendarGrid = document.getElementById("calendar-grid");
const monthTitleEl = document.getElementById("month-title");

/** Set header text */
function setMonthTitle() {
  const now = new Date();
  const months = [ "January","February","March","April","May","June",
                   "July","August","September","October","November","December" ];
  monthTitleEl.textContent = `${months[now.getMonth()]} Events`;
}

/** Draw a fixed 31-day grid */
function drawCalendarGrid() {
  calendarGrid.innerHTML = "";
  for (let i = 1; i <= 31; i++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-day");
    cell.dataset.day = i;

    const num = document.createElement("div");
    num.classList.add("day-number");
    num.textContent = i;

    const preview = document.createElement("div");
    preview.classList.add("event-title-preview");

    cell.append(num, preview);
    calendarGrid.append(cell);
  }
}

/**
 * Highlight days based on CSV data
 * @param {Array} events
 */
function highlightCalendarDays(events) {
  const byDay = events.reduce((acc, e) => {
    const d = parseInt(e.Day, 10);
    (acc[d] || (acc[d] = [])).push(e);
    return acc;
  }, {});

  Object.keys(byDay).forEach(d => {
    const cell = calendarGrid.querySelector(`.calendar-day[data-day='${d}']`);
    if (!cell) return;
    const arr = byDay[d];
    if (arr.some(e => e.Type === "event")) {
      cell.classList.add("event");
      cell.querySelector(".event-title-preview").textContent =
        arr.find(e => e.Type === "event").Title || "Event";
    } else {
      cell.classList.add("holiday");
      const m = document.createElement("div");
      m.classList.add("holiday-marker");
      m.textContent = arr.find(e => e.Type === "holiday").Title || "Holiday";
      cell.append(m);
    }
  });
}

/** Flip a tile open */
function animateDayOpen(tile) {
  tile.style.transform = "rotateY(180deg)";
}

/** Flip a tile closed */
function animateDayClose(tile) {
  tile.style.transform = "rotateY(0deg)";
}
