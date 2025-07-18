/* ========================================
   js/calendar.js — Month View & Multi-Event
   ======================================== */

const calendarGrid = document.getElementById("calendar-grid");
const monthTitleEl = document.getElementById("month-title");

/** 1. Set header to “<Month> Events” */
function setMonthTitle() {
  const now    = new Date();
  const names  = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  monthTitleEl.textContent = `${names[now.getMonth()]} Events`;
}

/** 2. Draw a fixed 31-day grid */
function drawCalendarGrid() {
  calendarGrid.innerHTML = "";
  for (let d = 1; d <= 31; d++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.dataset.day = d;

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = d;

    const preview = document.createElement("div");
    preview.className = "event-title-preview";

    cell.append(num, preview);
    calendarGrid.append(cell);
  }
}

/**
 * 3. Highlight days and stack ALL events per day
 * @param {Array<Object>} events — output from loadEventsFromCSV()
 */
function highlightCalendarDays(events) {
  const byDay = {};
  events.forEach(e => {
    const day = parseInt(e.Day, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(e);
  });

  Object.entries(byDay).forEach(([dayStr, arr]) => {
    const day = Number(dayStr);
    const cell = calendarGrid.querySelector(`.calendar-day[data-day='${day}']`);
    if (!cell) return;

    // ALL events that day, in sheet order
    const evs = arr.filter(e => e.Type.trim().toLowerCase() === "event");
    if (evs.length) {
      cell.classList.add("event");
      const previewEl = cell.querySelector(".event-title-preview");
      // inject one <div> per event
      previewEl.innerHTML = evs
        .map(item => `<div class="event-preview-item">${item.Title}</div>`)
        .join("");
    }

    // Holidays if no events
    if (!evs.length) {
      const hol = arr.find(e => e.Type.trim().toLowerCase() === "holiday");
      if (hol) {
        cell.classList.add("holiday");
        const marker = document.createElement("div");
        marker.className = "holiday-marker";
        marker.textContent = hol.Title;
        cell.append(marker);
      }
    }
  });
}

// Expose for app.js
// export { setMonthTitle, drawCalendarGrid, highlightCalendarDays };
