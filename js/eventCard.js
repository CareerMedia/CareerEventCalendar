// js/eventCard.js
/* ==================================
   Event Card Builder & Teardown
   ================================== */

const overlayContainer = document.getElementById("event-overlay");

/**
 * Render and animate in a full-screen event card.
 * @param {Object} eventData - { Title, Date, Time, Location, Blurb, QR_Link }
 */
function showEventCard(eventData) {
  // Clear previous content
  overlayContainer.innerHTML = "";

  // Ensure flipIn animation
  overlayContainer.style.animation = "flipIn 0.6s ease-out forwards";

  // Create card wrapper
  const card = document.createElement("div");
  card.classList.add("event-card");

  // === Left: Event Details ===
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

  content.append(title, dateTime, location, blurb);

  // === Right: QR Code ===
  const qrSection = document.createElement("div");
  qrSection.classList.add("qr-section");

  const qrContainer = document.createElement("div");
  qrContainer.id = "qr-code";

  const qrLabel = document.createElement("span");
  qrLabel.textContent = "Scan to RSVP";

  qrSection.append(qrContainer, qrLabel);

  // Generate QR code (qr.js)
  generateQRCode(qrContainer, eventData.QR_Link);

  // === Logo ===
  const logo = document.createElement("img");
  logo.id = "event-logo";
  logo.src = "assets/logo.png";
  logo.alt = "Career Center Logo";

  // === Accent Bar ===
  const accent = document.createElement("div");
  accent.classList.add("accent-bar");

  // Assemble card
  card.append(content, qrSection, logo, accent);
  overlayContainer.appendChild(card);
}

/**
 * Animate out and remove the event card.
 */
function removeEventCard() {
  // Trigger flipOut animation
  overlayContainer.style.animation = "flipOut 0.6s ease-in forwards";

  // Once complete, clear content
  overlayContainer.addEventListener("animationend", () => {
    overlayContainer.innerHTML = "";
  }, { once: true });
}
