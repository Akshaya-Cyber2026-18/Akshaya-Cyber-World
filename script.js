
// ======================================
// ACW - AKSHAYA CYBER WORLD
// MAIN WEBSITE JAVASCRIPT
// ======================================

// Game names
const gameNames = {
  runner: "Cyber Runner",
  rps: "Rock Paper Scissors",
  racing: "Neon Car Racing",
  bubble: "Bubble Shooter",
  space: "Space Defender"
};

// Open selected game
function openGame(gameId) {

  // Check whether game ID is valid
  if (!gameNames[gameId]) {
    showMessage("Game not found!");
    return;
  }

  // Rock Paper Scissors page
  if (gameId === "rps") {
    window.location.href = "rps.html";
    return;
  }
if (gameId === "runner") {
  window.location.href = "runner.html";
  return;
}
  // Other games will be added step by step
  showMessage(
    gameNames[gameId] + " is coming soon! Stay tuned. 💙"
  );
}

// Display message popup
function showMessage(message) {

  // Remove previous popup
  const oldPopup = document.querySelector(".acw-popup");

  if (oldPopup) {
    oldPopup.remove();
  }

  // Create popup
  const popup = document.createElement("div");
  popup.className = "acw-popup";

  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-icon">🎮</div>
      <h2>ACW GAME ZONE</h2>
      <p>${message}</p>
      <button id="popupClose">OK</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Close popup
  document.getElementById("popupClose").addEventListener(
    "click",
    function () {
      popup.remove();
    }
  );

  // Close when clicking outside
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.remove();
    }
  });
}

// Welcome message in browser console
console.log("ACW - Akshaya Cyber World loaded successfully!");
