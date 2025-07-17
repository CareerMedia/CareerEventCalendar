/* ======================================
   js/eventCard.js — Build & Tear Down
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Show full-screen card with flip-in.
 * @param {Object} e — event data
 */
function showEventCard(e) {
  overlay.innerHTML = "";                     // clear old
  overlay.style.animation = "flipIn 0.6s ease";

  const card = document.createElement("div");
  card.className = "event-card";

  // Left side (details)
  const content = document.createElement("div");
  content.className = "event-content";
  content.innerHTML = `
    <h2>${e.Title}</h2>
    <div class="datetime">${e.Date} | ${e.Time}</div>
    <div class="location">${e.Location}</div>
    <div class="blurb">${e.Blurb}</div>
  `;

  // Right side (QR)
  const qrSec = document.createElement("div");
  qrSec.className = "qr-section";
  const qrHolder = document.createElement("div");
  qrHolder.id = "qr-code";
  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";
  qrSec.append(qrHolder, qrLabel);

  // Generate the QR
  generateQRCode(qrHolder, e.QR_Link);

  // Logo & accent bar
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  const bar = document.createElement("div");
  bar.className = "accent-bar";

  // Assemble
  card.append(content, qrSec, logo, bar);
  overlay.append(card);
}

/**
 * Flip-out animation then remove.
 */
function removeEventCard() {
  overlay.style.animation = "flipOut 0.6s ease";
  overlay.addEventListener("animationend", () => {
    overlay.innerHTML = "";
  }, { once: true });
}
