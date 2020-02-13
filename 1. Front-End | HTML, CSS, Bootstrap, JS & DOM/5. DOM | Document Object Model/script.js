
var scoreHeader1 = document.querySelector("#p1Score");
var scoreHeader2 = document.querySelector("#p2Score");
var gamesCount = document.querySelector("p");
var gamesInput = document.querySelector("input");
var player1Btn = document.querySelector("#player1");
var player2Btn = document.querySelector("#player2");
var resetBtn = document.querySelector("#reset");

var p1Score = 0;
var p2Score = 0;
var maxGames = 5;

gamesInput.addEventListener("change", () => {
    gamesCount.textContent = "Playing to: " + gamesInput.value;
    maxGames = Number(gamesInput.value);
});

player1Btn.addEventListener("click", () => {
    if (p1Score < maxGames && p2Score < maxGames) {
        p1Score++;
        scoreHeader1.textContent = p1Score;
    }
    if (p1Score >= maxGames) {
        scoreHeader1.classList.add("green");
    }
});

player2Btn.addEventListener("click", () => {
    if (p2Score < maxGames && p1Score < maxGames) {
        p2Score++;
        scoreHeader2.textContent = p2Score;
    }
    if (p2Score >= maxGames) {
        scoreHeader2.classList.add("green");
    }
});

resetBtn.addEventListener("click", () => {
    p1Score = 0;
    p2Score = 0;
    scoreHeader1.textContent = 0;
    scoreHeader1.classList.remove("green");
    scoreHeader2.classList.remove("green");
    scoreHeader2.textContent = 0;
});


