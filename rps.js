
const $ = (id) => document.getElementById(id);

let yourScore = 0;
let opponentScore = 0;
let roundNumber = 1;
let selected = false;
let countdownInterval;
let selectionInterval;
let timeLeft = 8;
let gameFinished = false;

const gestures = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

// Prepare the opponent automatically
window.addEventListener("load", () => {
    $("status").textContent = "Preparing your opponent...";

    setTimeout(() => {
        $("opponentName").textContent = "AKSHU 🤖";
        $("status").textContent =
            "No live matchmaking connected. AKSHU is ready!";

        startRound();
    }, 1800);
});

// Start a round
function startRound() {
    if (gameFinished) return;

    selected = false;
    timeLeft = 8;

    $("yourGesture").textContent = "❔";
    $("opponentGesture").textContent = "❔";

    $("shakeSection").hidden = false;
    $("selectionSection").hidden = true;
    $("resultSection").hidden = true;
    $("finalSection").hidden = true;

    $("shakeHands").style.animationPlayState = "running";
    $("countdown").textContent = "GET READY!";
    $("shakeMessage").textContent =
        "Pink hands are shaking...";

    let count = 3;

    clearInterval(countdownInterval);
    clearInterval(selectionInterval);

    countdownInterval = setInterval(() => {
        $("countdown").textContent = count;

        count--;

        if (count < 0) {
            clearInterval(countdownInterval);

            $("countdown").textContent = "SHOOT!";
            $("shakeMessage").textContent =
                "Choose your move now!";

            $("shakeHands").style.animationPlayState = "paused";

            setTimeout(() => {
                $("shakeSection").hidden = true;
                showChoices();
            }, 450);
        }
    }, 1000);
}

// Show the three choices
function showChoices() {
    $("selectionSection").hidden = false;
    $("timer").textContent = timeLeft;

    document.querySelectorAll(".choice").forEach(button => {
        button.disabled = false;
    });

    selectionInterval = setInterval(() => {
        timeLeft--;

        $("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(selectionInterval);

            if (!selected) {
                selected = true;
                document.querySelectorAll(".choice").forEach(button => {
                    button.disabled = true;
                });

                $("selectionSection").hidden = true;
                $("yourGesture").textContent = "⏰";
                $("opponentGesture").textContent = "✊";

                opponentScore++;
                updateScores();

                showResult(
                    "TIME UP!",
                    "You did not choose in time. AKSHU gets this round."
                );
            }
        }
    }, 1000);
}

// Listen to the player's choice
document.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
        if (selected || gameFinished) return;

        selected = true;
        clearInterval(selectionInterval);

        document.querySelectorAll(".choice").forEach(btn => {
            btn.disabled = true;
        });

        const yourChoice = button.dataset.choice;

        // AKSHU makes an automatic choice
        const options = ["rock", "paper", "scissors"];
        const computerChoice =
            options[Math.floor(Math.random() * options.length)];

        $("selectionSection").hidden = true;

        setTimeout(() => {
            $("yourGesture").textContent = gestures[yourChoice];
            $("opponentGesture").textContent =
                gestures[computerChoice];

            calculateWinner(yourChoice, computerChoice);
        }, 500);
    });
});

// Decide the round winner
function calculateWinner(player, computer) {
    if (player === computer) {
        showResult(
            "🤝 DRAW!",
            "Both selected " + player.toUpperCase() + ". Try again!"
        );
        return;
    }

    const playerWins =
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper");

    if (playerWins) {
        yourScore++;

        showResult(
            "🎉 YOU WIN!",
            player.toUpperCase() + " beats " +
            computer.toUpperCase() + "!"
        );
    } else {
        opponentScore++;

        showResult(
            "🤖 AKSHU WINS!",
            computer.toUpperCase() + " beats " +
            player.toUpperCase() + "!"
        );
    }

    updateScores();
}

// Update scoreboard
function updateScores() {
    $("yourScore").textContent = yourScore;
    $("opponentScore").textContent = opponentScore;
}

// Display round result
function showResult(title, message) {
    $("resultSection").hidden = false;
    $("resultTitle").textContent = title;
    $("resultMessage").textContent = message;

    if (yourScore >= 2 || opponentScore >= 2) {
        setTimeout(finishGame, 900);
    }
}

// Next round
$("nextButton").addEventListener("click", () => {
    if (gameFinished) return;

    roundNumber++;
    startRound();
});

// Finish the match
function finishGame() {
    gameFinished = true;

    $("resultSection").hidden = true;
    $("shakeSection").hidden = true;
    $("selectionSection").hidden = true;
    $("finalSection").hidden = false;

    if (yourScore >= 2) {
        $("finalTitle").textContent = "🏆 YOU DEFEATED AKSHU!";
    } else {
        $("finalTitle").textContent = "🤖 AKSHU WINS!";
    }

    $("finalScore").textContent =
        "Final Score: " + yourScore + " - " + opponentScore;
}

// Play again
$("restartButton").addEventListener("click", () => {
    clearInterval(countdownInterval);
    clearInterval(selectionInterval);

    yourScore = 0;
    opponentScore = 0;
    roundNumber = 1;
    selected = false;
    gameFinished = false;

    updateScores();
    startRound();
});
