
const intro = document.getElementById("intro");
const app = document.getElementById("app");
let introTimer;

function finishIntro() {
  clearTimeout(introTimer);
  intro.hidden = true;
  app.hidden = false;
}

introTimer = setTimeout(finishIntro, 4500);
document.getElementById("skip-intro")
  .addEventListener("click", finishIntro);

// SEARCH
const searchInput = document.getElementById("game-search");
const gameCards = [...document.querySelectorAll(".game-card")];

function filterGames() {
  const query = searchInput.value.trim().toLowerCase();
  let count = 0;

  gameCards.forEach(card => {
    const matches = card.dataset.name.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) count++;
  });

  document.getElementById("game-count").textContent =
    `${count} GAME${count === 1 ? "" : "S"}`;

  document.getElementById("no-results").hidden = count !== 0;
}

searchInput.addEventListener("input", filterGames);

document.getElementById("clear-search").addEventListener("click", () => {
  searchInput.value = "";
  filterGames();
  searchInput.focus();
});

// RECENTLY PLAYED
function loadRecent() {
  const list = document.getElementById("recent-list");
  let recent = [];

  try {
    recent = JSON.parse(localStorage.getItem("acwRecent") || "[]");
    if (!Array.isArray(recent)) recent = [];
  } catch {
    recent = [];
  }

  list.replaceChildren();

  if (recent.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Your played games will appear here.";
    list.appendChild(empty);
    return;
  }

  recent.forEach(game => {
    const button = document.createElement("button");
    button.className = "recent-item";
    button.textContent = `${game.name} ↗`;
    button.addEventListener("click", () => playGame(game.id));
    list.appendChild(button);
  });
}

function saveRecent(id, name) {
  try {
    let recent = JSON.parse(localStorage.getItem("acwRecent") || "[]");
    if (!Array.isArray(recent)) recent = [];

    recent = recent.filter(game => game.id !== id);
    recent.unshift({ id, name });
    localStorage.setItem("acwRecent", JSON.stringify(recent.slice(0, 5)));
  } catch {
    // The game can still run if browser storage is unavailable.
  }

  loadRecent();
}

// GAME WINDOW
function playGame(id) {
  if (id === "racer") {
    alert("Neon Racer is planned for a future update!");
    return;
  }

  const names = {
    brain: "Brain Blitz",
    reaction: "Reaction Rush"
  };

  saveRecent(id, names[id]);

  const content = document.getElementById("game-content");
  const modal = document.getElementById("game-modal");

  if (id === "brain") {
    content.innerHTML = `
      <p class="eyebrow">BRAIN BLITZ</p>
      <h2>QUICK MATH</h2>
      <p>What is 7 × 8?</p>
      <div class="answer-buttons">
        <button class="game-button" onclick="checkAnswer(54)">54</button>
        <button class="game-button" onclick="checkAnswer(56)">56</button>
        <button class="game-button" onclick="checkAnswer(64)">64</button>
      </div>
      <p id="answer-result" class="form-message" role="status"></p>
      <button class="primary-button" onclick="closeModal('game-modal')">
        CLOSE GAME
      </button>
    `;
  } else if (id === "reaction") {
    content.innerHTML = `
      <p class="eyebrow">REACTION RUSH</p>
      <h2>TEST YOUR REFLEXES</h2>
      <p>Press start. When the green button appears, tap it quickly!</p>
      <button id="reaction-start" class="primary-button"
        onclick="beginReaction()">START CHALLENGE</button>
      <p id="reaction-result" class="form-message" role="status"></p>
    `;
  }

  modal.hidden = false;
}

function checkAnswer(answer) {
  const result = document.getElementById("answer-result");
  result.textContent = answer === 56
    ? "Correct! Well done! 🎉"
    : "Not quite. Try again!";
}

let reactionTimeout;
let reactionStartedAt = 0;
let reactionState = "idle";

function beginReaction() {
  clearTimeout(reactionTimeout);

  const button = document.getElementById("reaction-start");
  const result = document.getElementById("reaction-result");

  if (!button || !result) return;

  reactionState = "waiting";
  button.disabled = true;
  button.textContent = "WAIT FOR GREEN...";
  result.textContent = "";

  const delay = 1500 + Math.random() * 2500;

  reactionTimeout = setTimeout(() => {
    if (!document.getElementById("reaction-start")) return;

    reactionState = "ready";
    reactionStartedAt = performance.now();
    button.disabled = false;
    button.textContent = "TAP NOW!";
    button.style.background = "#61ff45";
    button.onclick = recordReaction;
  }, delay);
}

function recordReaction() {
  if (reactionState !== "ready") return;

  const elapsed = Math.round(performance.now() - reactionStartedAt);
  const result = document.getElementById("reaction-result");
  const button = document.getElementById("reaction-start");

  if (result) result.textContent = `Your reaction time: ${elapsed} ms`;

  if (button) {
    button.textContent = "PLAY AGAIN";
    button.style.background = "";
    button.onclick = beginReaction;
  }

  reactionState = "finished";
}

function closeModal(id) {
  clearTimeout(reactionTimeout);
  reactionState = "idle";
  document.getElementById(id).hidden = true;
}

// ACCOUNT INTERFACE
function openAccount(mode) {
  closeModal("game-modal");

  document.getElementById("account-modal").hidden = false;

  const signup = mode === "signup";
  document.getElementById("account-title").textContent =
    signup ? "CREATE ACCOUNT" : "LOG IN";

  document.getElementById("username-field").hidden = !signup;
  document.getElementById("contact-field").hidden = !signup;
  document.getElementById("dob-field").hidden = !signup;
  document.getElementById("login-identity-field").hidden = signup;

  document.getElementById("username").required = signup;
  document.getElementById("contact").required = signup;
  document.getElementById("dob").required = signup;

  document.getElementById("password").value = "";
  document.getElementById("password").autocomplete =
    signup ? "new-password" : "current-password";

  document.getElementById("login-tab").classList.toggle("active", !signup);
  document.getElementById("signup-tab").classList.toggle("active", signup);

  document.getElementById("account-message").textContent = "";
}

function openProfile() {
  openAccount("login");
}

document.getElementById("account-form").addEventListener("submit", event => {
  event.preventDefault();

  const signup = !document.getElementById("dob-field").hidden;
  const message = document.getElementById("account-message");

  if (signup) {
    const dobValue = document.getElementById("dob").value;
    const birthDate = new Date(`${dobValue}T00:00:00`);
    const today = new Date();

    if (!dobValue || Number.isNaN(birthDate.getTime()) ||
        birthDate >= today) {
      message.textContent = "Please enter a valid date of birth.";
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayNotReached =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
       today.getDate() < birthDate.getDate());

    if (birthdayNotReached) age--;

    if (age < 13) {
      message.textContent =
        "You do not meet the minimum age for this prototype.";
      return;
    }
  }

  message.textContent =
    "This is a demo interface. Secure account authentication is not connected yet.";
});

loadRecent();
