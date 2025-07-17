/* ======================================
   js/eventCard.js — Show & Teardown Card
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Show a full-screen event card and keep it up.
 * @param {Object} e — {Title, Date, Time, Location, Blurb, QR_Link}
 */
function showEventCard(e) {
  // 1. Make overlay visible
  overlay.style.display = "flex";

  // 2. Clear any previous content
  overlay.innerHTML = "";

  // 3. Build the card container
  const card = document.createElement("div");
  card.classList.add("event-card");

  // 4. Populate left side (details)
  const details = document.createElement("div");
  details.classList.add("event-content");
  details.innerHTML = `
    <h2>${e.Title}</h2>
    <div class="datetime">${e.Date} | ${e.Time}</div>
    <div class="location">${e.Location}</div>
    <div class="blurb">${e.Blurb}</div>
  `;

  // 5. Populate right side (QR)
  const qrSection = document.createElement("div");
  qrSection.classList.add("qr-section");
  const qrContainer = document.createElement("div");
  qrContainer.id = "qr-code";
  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";
  qrSection.append(qrContainer, qrLabel);
  generateQRCode(qrContainer, e.QR_Link);  // qr.js

  // 6. Logo & accent bar
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  const accent = document.createElement("div");
  accent.classList.add("accent-bar");

  // 7. Assemble & display
  card.append(details, qrSection, logo, accent);
  overlay.append(card);

  // 8. Trigger flip-in animation on the card
  card.style.animation = "flipIn 0.6s ease-out forwards";
}

/**
 * Animate flip-out, then hide the overlay.
 */
function removeEventCard() {
  const card = overlay.querySelector(".event-card");
  if (!card) return;

  // 1. Play flip-out
  card.style.animation = "flipOut 0.6s ease-in forwards";

  // 2. After animation, hide overlay
  setTimeout(() => {
    overlay.style.display = "none";
    overlay.innerHTML = "";
  }, 600); // must match flipOut duration
}
