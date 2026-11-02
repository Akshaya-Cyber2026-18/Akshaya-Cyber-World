
/* =====================================
   ACW - CYBER RUNNER GAME
   SIDE SCROLLING VERSION
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
let jumpFrame;
let scoreTimer;
let lastTime = 0;
let obstacleGap = 0;

bestScoreText.textContent = bestScore;

// START GAME
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
  player.classList.add("running");
  player.classList.remove("jumping");

  obstacleX = gameArea.clientWidth + 80;
  obstacle.style.left = obstacleX + "px";
  obstacle.style.right = "auto";

  lastTime = 0;
  obstacleGap = 0;

  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(jumpFrame);
  clearInterval(scoreTimer);

  // SCORE TIMER
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

// JUMP FUNCTION
function jump() {

  if (!gameRunning || isJumping) return;

  isJumping = true;

  player.classList.remove("running");
  player.classList.add("jumping");

  const jumpHeight = 125;
  const jumpDuration = 650;
  const start = performance.now();

  function animateJump(now) {

    if (!gameRunning) return;

    const progress = Math.min(
      (now - start) / jumpDuration,
      1
    );

    // Smooth jump movement
    playerBottom =
      12 + jumpHeight * 4 * progress * (1 - progress);

    player.style.bottom = playerBottom + "px";

    if (progress < 1) {

      jumpFrame = requestAnimationFrame(animateJump);

    } else {

      playerBottom = 12;
      player.style.bottom = "12px";

      isJumping = false;

      player.classList.remove("jumping");
      player.classList.add("running");
    }
  }

  jumpFrame = requestAnimationFrame(animateJump);
}

// MAIN GAME LOOP
function gameLoop(timestamp) {

  if (!gameRunning) return;

  if (!lastTime) lastTime = timestamp;

  const delta = Math.min(
    (timestamp - lastTime) / 16.67,
    2
  );

  lastTime = timestamp;

  // Obstacle moves from RIGHT to LEFT
  obstacleX -= gameSpeed * delta;

  // Create next obstacle
  if (obstacleX < -60) {

    obstacleGap++;

    obstacleX =
      gameArea.clientWidth + 100 + Math.random() * 180;

    if (obstacleGap % 4 === 0) {
      gameSpeed += 0.2;
    }
  }

  obstacle.style.left = obstacleX + "px";

  // COLLISION DETECTION
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

// GAME OVER
function endGame() {

  gameRunning = false;
  isGameOver = true;

  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(jumpFrame);
  clearInterval(scoreTimer);

  if (score > bestScore) {

    bestScore = score;

    localStorage.setItem(
      "acwRunnerBest",
      bestScore
    );

    bestScoreText.textContent = bestScore;
  }

  player.classList.remove("running");
  player.classList.remove("jumping");

  player.style.display = "none";
  obstacle.style.display = "none";

  messageBox.innerHTML = `
    <h2>GAME OVER!</h2>
    <p>Your Score: ${score}</p>
    <p>Best Score: ${bestScore}</p>
    <button id="playAgainButton">PLAY AGAIN</button>
  `;

  messageBox.style.display = "flex";

  document
    .getElementById("playAgainButton")
    .addEventListener("click", startGame);
}

// RESTART GAME
function restartGame() {

  gameRunning = false;

  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(jumpFrame);
  clearInterval(scoreTimer);

  startGame();
}

// BUTTON EVENTS
startButton.addEventListener("click", startGame);

jumpButton.addEventListener("click", jump);

restartButton.addEventListener("click", restartGame);

// KEYBOARD CONTROLS
document.addEventListener("keydown", function (event) {

  if (
    event.code === "Space" ||
    event.code === "ArrowUp"
  ) {

    event.preventDefault();

    if (!gameRunning && !isGameOver) {
      startGame();
    } else {
      jump();
    }
  }
});

// INITIAL SCREEN
player.style.display = "none";
obstacle.style.display = "none";

console.log("ACW Cyber Runner is ready!");
