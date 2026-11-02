
/* =====================================
   ACW - CYBER RUNNER GAME
===================================== */

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameArea = document.getElementById("gameArea");

const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("bestScore");

const messageBox = document.getElementById("gameMessage");
const startButton = document.getElementById("startButton");
const jumpButton = document.getElementById("jumpButton");
const restartButton = document.getElementById("restartButton");

let score = 0;
let bestScore = Number(localStorage.getItem("acwRunnerBest")) || 0;

let gameRunning = false;
let isJumping = false;
let isGameOver = false;

let playerBottom = 12;
let obstacleX = 0;
let gameSpeed = 5;

let animationFrame;
let scoreTimer;
let lastTime = 0;
let obstacleGap = 0;

bestScoreText.textContent = bestScore;

// Start game
function startGame() {

  if (gameRunning) return;

  score = 0;
  gameSpeed = 5;
  playerBottom = 12;
  isJumping = false;
  isGameOver = false;
  gameRunning = true;

  scoreText.textContent = "0";

  messageBox.style.display = "none";
  player.style.display = "block";
  obstacle.style.display = "block";

  player.style.bottom = "12px";
  obstacleX = gameArea.clientWidth + 30;
  obstacle.style.left = obstacleX + "px";
  obstacle.style.right = "auto";

  lastTime = 0;
  obstacleGap = 0;

  cancelAnimationFrame(animationFrame);
  clearInterval(scoreTimer);

  scoreTimer = setInterval(function () {
    if (gameRunning) {
      score++;
      scoreText.textContent = score;

      if (score % 100 === 0) {
        gameSpeed += 0.5;
      }
    }
  }, 100);

  animationFrame = requestAnimationFrame(gameLoop);
}

// Jump
function jump() {

  if (!gameRunning || isJumping) return;

  isJumping = true;

  const jumpHeight = 125;
  const jumpDuration = 650;
  const start = performance.now();

  function animateJump(now) {

    if (!gameRunning) return;

    const progress = Math.min((now - start) / jumpDuration, 1);

    // Smooth up and down movement
    playerBottom = 12 + jumpHeight * 4 * progress * (1 - progress);

    player.style.bottom = playerBottom + "px";

    if (progress < 1) {
      requestAnimationFrame(animateJump);
    } else {
      playerBottom = 12;
      player.style.bottom = "12px";
      isJumping = false;
    }
  }

  requestAnimationFrame(animateJump);
}

// Main game loop
function gameLoop(timestamp) {

  if (!gameRunning) return;

  if (!lastTime) lastTime = timestamp;

  const delta = Math.min((timestamp - lastTime) / 16.67, 2);
  lastTime = timestamp;

  obstacleX -= gameSpeed * delta;

  if (obstacleX < -50) {
    obstacleGap += 1;
    obstacleX = gameArea.clientWidth + 80 +
      Math.random() * 150;

    // Small speed variation
    if (obstacleGap % 4 === 0) {
      gameSpeed += 0.2;
    }
  }

  obstacle.style.left = obstacleX + "px";

  // Collision detection
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  const collision =
    playerRect.right - 12 > obstacleRect.left + 8 &&
    playerRect.left + 12 < obstacleRect.right - 8 &&
    playerRect.bottom > obstacleRect.top + 10 &&
    playerRect.top < obstacleRect.bottom - 5;

  if (collision) {
    endGame();
    return;
  }

  animationFrame = requestAnimationFrame(gameLoop);
}

// Game over
function endGame() {

  gameRunning = false;
  isGameOver = true;

  cancelAnimationFrame(animationFrame);
  clearInterval(scoreTimer);

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("acwRunnerBest", bestScore);
    bestScoreText.textContent = bestScore;
  }

  player.style.display = "none";
  obstacle.style.display = "none";

  messageBox.innerHTML = `
    <h2>GAME OVER!</h2>
    <p>Your Score: ${score}</p>
    <p>Best Score: ${bestScore}</p>
    <button id="playAgainButton">PLAY AGAIN</button>
  `;

  messageBox.style.display = "flex";

  document.getElementById("playAgainButton")
    .addEventListener("click", startGame);
}

// Restart game
function restartGame() {
  gameRunning = false;
  cancelAnimationFrame(animationFrame);
  clearInterval(scoreTimer);

  startGame();
}

// Button events
startButton.addEventListener("click", startGame);
jumpButton.addEventListener("click", jump);
restartButton.addEventListener("click", restartGame);

// Keyboard controls
document.addEventListener("keydown", function (event) {

  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();

    if (!gameRunning && !isGameOver) {
      startGame();
    } else {
      jump();
    }
  }
});

// Initial screen
player.style.display = "none";
obstacle.style.display = "none";

console.log("Cyber Runner is ready!");
