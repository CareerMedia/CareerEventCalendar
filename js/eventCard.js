/* ======================================
   js/eventCard.js — Show & Teardown Card
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Show a full-screen event card.
 * @param {Object} e — {Title, Date, Time, Location, Blurb, QR_Link}
 */
function showEventCard(e) {
  overlay.style.display = "flex";
  overlay.innerHTML = ""; 

  const card = document.createElement("div");
  card.className = "event-card";

  // Left: details
  const details = document.createElement("div");
  details.className = "event-content";
  details.innerHTML = `
    <h2>${e.Title}</h2>
    <div class="datetime">${e.Date} | ${e.Time}</div>
    <div class="location">${e.Location}</div>
    <div class="blurb">${e.Blurb}</div>
  `;

  // Right: QR
  const qrSec = document.createElement("div");
  qrSec.className = "qr-section";
  const qrHolder = document.createElement("div");
  qrHolder.id = "qr-code";
  qrSec.append(qrHolder, Object.assign(document.createElement("span"), {textContent:"Scan to RSVP"}));
  generateQRCode(qrHolder, e.QR_Link);

  // Logo
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  card.append(details, qrSec, logo);
  overlay.append(card);

  // Animate in
  card.style.animation = "fadeInSlide 0.6s forwards";
}

/**
 * Animate out and then hide overlay.
 * Returns a Promise that resolves once hidden.
 */
function removeEventCardAsync() {
  return new Promise(res => {
    const card = overlay.querySelector(".event-card");
    if (!card) { overlay.style.display="none"; return res(); }

    card.style.animation = "fadeOutSlide 0.6s forwards";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      res();
    }, 600);
  });
}
