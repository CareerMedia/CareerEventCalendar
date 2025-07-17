/* ======================================
   js/eventCard.js — Slide/Fade Card
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Show the event card with slide/fade animation.
 * @param {Object} e — {Title, Date, Time, Location, Blurb, QR_Link}
 */
function showEventCard(e) {
  overlay.style.display = "flex";
  overlay.innerHTML = ""; // clear

  const card = document.createElement("div");
  card.className = "event-card";

  // Left details
  const details = document.createElement("div");
  details.className = "event-content";
  details.innerHTML = `
    <h2>${e.Title}</h2>
    <div class="datetime">${e.Date} | ${e.Time}</div>
    <div class="location">${e.Location}</div>
    <div class="blurb">${e.Blurb}</div>
  `;

  // QR side
  const qrSec = document.createElement("div");
  qrSec.className = "qr-section";
  const qrHolder = document.createElement("div");
  qrHolder.id = "qr-code";
  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";
  qrSec.append(qrHolder, qrLabel);
  generateQRCode(qrHolder, e.QR_Link);

  // Logo & bar
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  const bar = document.createElement("div");
  bar.className = "accent-bar";

  card.append(details, qrSec, logo, bar);
  overlay.append(card);

  // Slide/fade in the card
  card.style.animation = "fadeInSlide 0.8s ease-out forwards";
}

/**
 * Fade-out slide, then hide overlay.
 * @returns {Promise}
 */
function removeEventCardAsync() {
  return new Promise(resolve => {
    const card = overlay.querySelector(".event-card");
    if (!card) {
      overlay.style.display = "none";
      return resolve();
    }
    card.style.animation = "fadeOutSlide 0.6s ease-in forwards";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      resolve();
    }, 600);
  });
}
