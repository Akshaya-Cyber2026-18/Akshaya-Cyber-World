
// AKSHAYA CYBER WORLD
// ROCK PAPER SCISSORS GAME

let gameMode = "";
let scoreOne = 0;
let scoreTwo = 0;
let firstChoice = "";
let currentRound = 1;
let playerTurn = "one";

const hands = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

// START GAME
function startGame(mode) {
    gameMode = mode;
    restartGame();

    document.getElementById("modeSection").classList.add("hidden");
    document.getElementById("gameSection").classList.remove("hidden");

    if (gameMode === "computer") {
        document.getElementById("modeName").textContent = "Single Player";
        document.getElementById("playerOneName").textContent = "YOU";
        document.getElementById("playerTwoName").textContent = "AKSHU 🤖";
        document.getElementById("message").textContent = "Challenge AKSHU!";
        document.getElementById("subMessage").textContent =
            "Choose Rock, Paper or Scissors!";
    } else {
        document.getElementById("modeName").textContent = "Two Players";
        document.getElementById("playerOneName").textContent = "PLAYER 1";
        document.getElementById("playerTwoName").textContent = "PLAYER 2";
        document.getElementById("message").textContent = "Player 1, your turn!";
        document.getElementById("subMessage").textContent =
            "Choose your hand!";
    }

    document.getElementById("choiceSection").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("gameOverSection").classList.add("hidden");
}

// PLAYER CHOICE
function makeChoice(choice) {

    if (gameMode === "computer") {

        let computerChoices = ["rock", "paper", "scissors"];

        let computerChoice =
            computerChoices[Math.floor(Math.random() * 3)];

        resolveRound(choice, computerChoice);

    } else {

        if (playerTurn === "one") {

            firstChoice = choice;
            playerTurn = "two";

            document.getElementById("message").textContent =
                "Player 1 selected!";

            document.getElementById("subMessage").textContent =
                "Pass the device to Player 2. Don't reveal Player 1's choice!";

            document.getElementById("choiceTitle").textContent =
                "Player 2 – Select Your Hand";

        } else {

            resolveRound(firstChoice, choice);

        }
    }
}

// CHECK WINNER
function getWinner(choiceOne, choiceTwo) {

    if (choiceOne === choiceTwo) {
        return "draw";
    }

    if (
        (choiceOne === "rock" && choiceTwo === "scissors") ||
        (choiceOne === "paper" && choiceTwo === "rock") ||
        (choiceOne === "scissors" && choiceTwo === "paper")
    ) {
        return "one";
    }

    return "two";
}

// ANIMATE HANDS
function animateHands() {

    const handOne = document.getElementById("handOne");
    const handTwo = document.getElementById("handTwo");

    handOne.classList.remove("animate");
    handTwo.classList.remove("animate");

    void handOne.offsetWidth;
    void handTwo.offsetWidth;

    handOne.classList.add("animate");
    handTwo.classList.add("animate");
}

// PLAY ROUND
function resolveRound(choiceOne, choiceTwo) {

    document.getElementById("handOne").textContent =
        hands[choiceOne];

    document.getElementById("handTwo").textContent =
        hands[choiceTwo];

    animateHands();

    let winner = getWinner(choiceOne, choiceTwo);

    let resultTitle = document.getElementById("resultTitle");
    let resultText = document.getElementById("resultText");

    if (winner === "draw") {

        resultTitle.textContent = "🤝 It's a Draw!";
        resultText.textContent = "Both players selected the same hand!";

    } else if (winner === "one") {

        scoreOne++;

        resultTitle.textContent = "🎉 " +
            (gameMode === "computer" ? "You Win!" : "Player 1 Wins!");

        resultText.textContent = "Great move!";

    } else {

        scoreTwo++;

        resultTitle.textContent = "🏆 " +
            (gameMode === "computer" ? "AKSHU Wins!" : "Player 2 Wins!");

        resultText.textContent = "Good game! Try again!";

    }

    // UPDATE SCORES
    document.getElementById("scoreOne").textContent = scoreOne;
    document.getElementById("scoreTwo").textContent = scoreTwo;

    document.getElementById("roundInfo").textContent =
        "Round " + currentRound + " | First to 2 wins";

    document.getElementById("choiceSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");

    // CHECK MATCH WINNER
    if (scoreOne === 2 || scoreTwo === 2) {

        document.getElementById("resultSection").classList.add("hidden");
        document.getElementById("gameOverSection").classList.remove("hidden");

        if (scoreOne === 2) {

            document.getElementById("winnerTitle").textContent =
                gameMode === "computer"
                    ? "🏆 YOU DEFEATED AKSHU!"
                    : "🏆 PLAYER 1 WINS!";

        } else {

            document.getElementById("winnerTitle").textContent =
                gameMode === "computer"
                    ? "🤖 AKSHU WINS THE MATCH!"
                    : "🏆 PLAYER 2 WINS!";

        }

        document.getElementById("winnerText").textContent =
            "Final Score: " + scoreOne + " - " + scoreTwo;

    }
}

// NEXT ROUND
function nextRound() {

    currentRound++;

    playerTurn = "one";
    firstChoice = "";

    document.getElementById("handOne").textContent = "✊";
    document.getElementById("handTwo").textContent = "✊";

    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("choiceSection").classList.remove("hidden");

    document.getElementById("choiceTitle").textContent =
        gameMode === "computer"
            ? "Select Your Hand"
            : "Player 1 – Select Your Hand";

    document.getElementById("message").textContent =
        gameMode === "computer"
            ? "Next Round! Challenge AKSHU!"
            : "Player 1, your turn!";

    document.getElementById("subMessage").textContent =
        "Make your move!";

    document.getElementById("roundInfo").textContent =
        "Round " + currentRound + " | First to 2 wins";
}

// RESTART MATCH
function restartGame() {

    scoreOne = 0;
    scoreTwo = 0;
    currentRound = 1;
    firstChoice = "";
    playerTurn = "one";

    document.getElementById("scoreOne").textContent = "0";
    document.getElementById("scoreTwo").textContent = "0";

    document.getElementById("handOne").textContent = "✊";
    document.getElementById("handTwo").textContent = "✊";

    document.getElementById("roundInfo").textContent =
        "Round 1 | First to 2 wins";

    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("gameOverSection").classList.add("hidden");
    document.getElementById("choiceSection").classList.remove("hidden");

    document.getElementById("choiceTitle").textContent =
        gameMode === "two"
            ? "Player 1 – Select Your Hand"
            : "Select Your Hand";

    document.getElementById("message").textContent =
        "Let's Play!";

    document.getElementById("subMessage").textContent =
        "Choose your hand!";
}

// CHANGE GAME MODE
function backToModes() {

    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("modeSection").classList.remove("hidden");

    gameMode = "";
}
