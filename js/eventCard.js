/* ==================================
   eventCard.js - Event Card Builder
   ================================== */

const overlayContainer = document.getElementById("event-overlay");

/**
 * Renders a full event card overlay based on event object
 * @param {Object} eventData
 */
function showEventCard(eventData) {
  // Clear previous
  overlayContainer.innerHTML = "";

  // Create card wrapper
  const card = document.createElement("div");
  card.classList.add("event-card");

  // === Left Content ===
  const content = document.createElement("div");
  content.classList.add("event-content");

  const title = document.createElement("h2");
  title.textContent = eventData.Title;

  const dateTime = document.createElement("div");
  dateTime.classList.add("datetime");
  dateTime.textContent = `${eventData.Date} | ${eventData.Time}`;

  const location = document.createElement("div");
  location.classList.add("location");
  location.textContent = eventData.Location;

  const blurb = document.createElement("div");
  blurb.classList.add("blurb");
  blurb.textContent = eventData.Blurb;

  content.appendChild(title);
  content.appendChild(dateTime);
  content.appendChild(location);
  content.appendChild(blurb);

  // === Right Side: QR Code ===
  const qr = document.createElement("div");
  qr.classList.add("qr-section");

  const qrCanvas = document.createElement("div");
  qrCanvas.id = "qr-code";

  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";

  qr.appendChild(qrCanvas);
  qr.appendChild(qrLabel);

  // Generate QR Code (from qr.js)
  generateQRCode(qrCanvas, eventData.QR_Link);

  // === Logo ===
  const logo = document.createElement("img");
  logo.src = "assets/logo.png";
  logo.id = "event-logo";
  logo.alt = "Career Center Logo";

  // === Bottom Accent Bar ===
  const accent = document.createElement("div");
  accent.classList.add("accent-bar");

  // Append to card
  card.appendChild(content);
  card.appendChild(qr);
  card.appendChild(logo);
  card.appendChild(accent);

  // Add to overlay
  overlayContainer.appendChild(card);
}

/**
 * Removes event overlay from view
 */
function removeEventCard() {
  overlayContainer.innerHTML = "";
}
