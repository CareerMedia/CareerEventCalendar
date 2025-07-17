/* ======================================
   js/eventCard.js — Show & Teardown Card
   ====================================== */

const overlayContainer = document.getElementById("event-overlay");

/**
 * Display the event card for the full overlay.
 * @param {Object} evt — {Title, Date, Time, Location, Blurb, QR_Link}
 */
function showEventCard(evt) {
  // 1) Ensure overlay is visible & ready
  overlayContainer.style.display = "flex";
  overlayContainer.classList.remove("flip-out");
  overlayContainer.classList.add("flip-in");
  overlayContainer.innerHTML = "";  // clear old content

  // 2) Build card
  const card = document.createElement("div");
  card.classList.add("event-card");

  // Left (details)
  const content = document.createElement("div");
  content.classList.add("event-content");
  content.innerHTML = `
    <h2>${evt.Title}</h2>
    <div class="datetime">${evt.Date} | ${evt.Time}</div>
    <div class="location">${evt.Location}</div>
    <div class="blurb">${evt.Blurb}</div>
  `;

  // Right (QR)
  const qrSection = document.createElement("div");
  qrSection.classList.add("qr-section");
  const qrHolder = document.createElement("div");
  qrHolder.id = "qr-code";
  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";
  qrSection.append(qrHolder, qrLabel);
  generateQRCode(qrHolder, evt.QR_Link);  // from qr.js

  // Logo & accent bar
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  const accentBar = document.createElement("div");
  accentBar.classList.add("accent-bar");

  // Append everything
  card.append(content, qrSection, logo, accentBar);
  overlayContainer.append(card);
}

/**
 * Animate overlay out and then hide/clear it.
 */
function removeEventCard() {
  overlayContainer.classList.remove("flip-in");
  overlayContainer.classList.add("flip-out");

  overlayContainer.addEventListener("animationend", () => {
    overlayContainer.style.display = "none";
    overlayContainer.innerHTML = "";
    overlayContainer.classList.remove("flip-out");
  }, { once: true });
}
