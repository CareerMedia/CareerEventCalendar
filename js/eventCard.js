/* ======================================
   js/eventCard.js — Show & Teardown Card
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Display the event card for the full overlay.
 * @param {Object} evt — {Title, Date, Time, Location, Blurb, QR_Link}
 */
function showEventCard(evt) {
  // Ensure previous state cleared
  overlay.classList.remove("hide");
  overlay.innerHTML = "";           // clear old
  overlay.classList.add("show");    // makes display:flex

  // Build card
  const card = document.createElement("div");
  card.className = "event-card";

  // Left (details)
  const content = document.createElement("div");
  content.className = "event-content";
  content.innerHTML = `
    <h2>${evt.Title}</h2>
    <div class="datetime">${evt.Date} | ${evt.Time}</div>
    <div class="location">${evt.Location}</div>
    <div class="blurb">${evt.Blurb}</div>
  `;

  // Right (QR)
  const qrSection = document.createElement("div");
  qrSection.className = "qr-section";
  const qrHolder = document.createElement("div");
  qrHolder.id = "qr-code";
  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";
  qrSection.append(qrHolder, qrLabel);
  generateQRCode(qrHolder, evt.QR_Link);

  // Logo & accent bar
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  const accentBar = document.createElement("div");
  accentBar.className = "accent-bar";

  // Assemble & append
  card.append(content, qrSection, logo, accentBar);
  overlay.append(card);
}

/**
 * Animate overlay out and then hide/clear it.
 */
function removeEventCard() {
  // Start flipOut on card
  const card = overlay.querySelector(".event-card");
  if (card) {
    card.style.animation = "flipOut 0.6s ease-in forwards";
  }
  // After flipOut duration, hide overlay
  setTimeout(() => {
    overlay.classList.remove("show");
    overlay.innerHTML = "";
    overlay.classList.add("hide");
  }, 600);
}
