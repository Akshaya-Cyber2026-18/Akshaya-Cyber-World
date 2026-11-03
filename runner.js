
const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameArea = document.getElementById("gameArea");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");

const gameMessage = document.getElementById("gameMessage");

const startButton = document.getElementById("startButton");
const jumpButton = document.getElementById("jumpButton");
const restartButton = document.getElementById("restartButton");

let score = 0;
let bestScore = Number(localStorage.getItem("acwRunnerBest")) || 0;

let gameRunning = false;
let isJumping = false;

let obstaclePosition = 0;
let obstacleSpeed = 5;

let animationFrame;
let lastTime = 0;
let scoreTimer = 0;

bestScoreElement.textContent = bestScore;

// START GAME

function startGame() {
    if (gameRunning) return;

    cancelAnimationFrame(animationFrame);

    score = 0;
    obstaclePosition = 0;
    obstacleSpeed = 5;
    scoreTimer = 0;

    scoreElement.textContent = score;

    obstacle.style.right = "-60px";
    obstacle.style.display = "block";

    player.classList.remove("jumping");

    isJumping = false;
    gameRunning = true;

    gameMessage.style.display = "none";

    lastTime = performance.now();

    animationFrame = requestAnimationFrame(gameLoop);
}

// JUMP

function jump() {
    if (!gameRunning || isJumping) return;

    isJumping = true;

    player.classList.remove("jumping");

    // Restart animation
    void player.offsetWidth;

    player.classList.add("jumping");

    setTimeout(() => {
        isJumping = false;
        player.classList.remove("jumping");
    }, 650);
}

// GAME LOOP

function gameLoop(currentTime) {
    if (!gameRunning) return;

    const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
    lastTime = currentTime;

    scoreTimer += deltaTime;

    if (scoreTimer >= 10) {
        score++;
        scoreElement.textContent = score;
        scoreTimer = 0;

        // Slowly increase difficulty
        obstacleSpeed = Math.min(10, 5 + score * 0.15);
    }

    // Move obstacle from right to left
    obstaclePosition += obstacleSpeed * deltaTime;

    const areaWidth = gameArea.clientWidth;

    obstacle.style.right =
        (obstaclePosition - 60) + "px";

    // Reset obstacle
    if (obstaclePosition > areaWidth + 60) {
        obstaclePosition = 0;
    }

    // COLLISION CHECK
    checkCollision();

    if (gameRunning) {
        animationFrame = requestAnimationFrame(gameLoop);
    }
}

// COLLISION

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    const collision =
        playerRect.left + 15 < obstacleRect.right - 8 &&
        playerRect.right - 15 > obstacleRect.left + 8 &&
        playerRect.bottom - 5 > obstacleRect.top + 8 &&
        playerRect.top + 10 < obstacleRect.bottom;

    if (collision) {
        endGame();
    }
}

// GAME OVER

function endGame() {
    gameRunning = false;

    cancelAnimationFrame(animationFrame);

    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem("acwRunnerBest", bestScore);

        bestScoreElement.textContent = bestScore;
    }

    gameMessage.style.display = "flex";

    gameMessage.innerHTML = `
        <h2>GAME OVER!</h2>
        <p>Your Score: ${score}</p>
        <p>Best Score: ${bestScore}</p>
        <button id="playAgainButton">PLAY AGAIN</button>
    `;

    document.getElementById("playAgainButton")
        .addEventListener("click", startGame);
}

// RESTART

function restartGame() {
    cancelAnimationFrame(animationFrame);

    gameRunning = false;
    isJumping = false;

    player.classList.remove("jumping");

    score = 0;
    obstaclePosition = 0;

    scoreElement.textContent = 0;

    obstacle.style.right = "-60px";

    gameMessage.style.display = "flex";

    gameMessage.innerHTML = `
        <h2>READY TO RUN?</h2>
        <p>Press START to begin your adventure!</p>
        <button id="newStartButton">START GAME</button>
    `;

    document.getElementById("newStartButton")
        .addEventListener("click", startGame);
}

// BUTTON EVENTS

startButton.addEventListener("click", startGame);

jumpButton.addEventListener("click", jump);

restartButton.addEventListener("click", restartGame);

// KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();

        jump();
    }

});

// MOBILE TOUCH CONTROL

gameArea.addEventListener("touchstart", function(event) {
    if (gameRunning) {
        event.preventDefault();
        jump();
    }
}, { passive: false });

// INITIAL DISPLAY

bestScoreElement.textContent = bestScore;
