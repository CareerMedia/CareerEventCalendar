/* ======================================
   js/eventCard.js — Show & Teardown Card
   ====================================== */

const overlay = document.getElementById("event-overlay");

/**
 * Show a full-screen event card.
 * Returns a Promise that resolves immediately after the fade-in start.
 */
function showEventCard(evt) {
  return new Promise((resolve) => {
    // 1. Make overlay visible
    overlay.style.display = "flex";
    overlay.innerHTML     = ""; // clear old content

    // 2. Build the card
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-content">
        <h2>${evt.Title}</h2>
        <div class="datetime">${evt.Date} | ${evt.Time}</div>
        <div class="location">${evt.Location}</div>
        <div class="blurb">${evt.Blurb}</div>
      </div>
      <div class="qr-section">
        <div id="qr-code"></div>
        <span>Scan to RSVP</span>
      </div>
      <img id="event-logo" src="assets/logo.png" alt="Logo"/>
    `;
    overlay.append(card);

    // 3. Generate the QR code
    generateQRCode(document.getElementById("qr-code"), evt.QR_Link);

    // 4. Kick off fadeInSlide animation
    card.style.animation = "fadeInSlide 0.8s ease-out forwards";

    // Resolve so app.js can wait EVENT_CARD_DURATION
    resolve();
  });
}

/**
 * Hide the event card with fade-out, then clear overlay.
 * Returns a Promise that resolves after the fade-out completes.
 */
function hideEventCard() {
  return new Promise((resolve) => {
    const card = overlay.querySelector(".event-card");
    if (!card) {
      overlay.style.display = "none";
      return resolve();
    }

    // 1. Start fade-out
    card.style.animation = "fadeOutSlide 0.6s ease-in forwards";

    // 2. After that animation, hide & clear
    card.addEventListener("animationend", () => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
      resolve();
    }, { once: true });
  });
}
