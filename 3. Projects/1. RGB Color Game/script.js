var colorSquares = document.querySelectorAll(".square");
var rgbDisplay = document.querySelector("h1 span");
var messageDisplay = document.querySelector("#message");
var resetButton = document.querySelector("#reset");
var hardModeButton = document.querySelector("#hard");
var easyModeButton = document.querySelector("#easy");

var randomPicked;
var rgbPicked;

var gameMode = true;
//Hard - True
//Easy - False

resetButton.addEventListener("click", () => {
    newGame();
});

hardModeButton.addEventListener("click", () => {
    gameMode = true;
    newGame();
    hardModeButton.classList.add("selected");
    easyModeButton.classList.remove("selected");
    for (let i = 3; i < colorSquares.length; i++) {
        colorSquares[i].classList.remove("hide");
    }
});

easyModeButton.addEventListener("click", () => {
    gameMode = false;
    newGame();
    easyModeButton.classList.add("selected");
    hardModeButton.classList.remove("selected");
    for (let i = 3; i < colorSquares.length; i++) {
        colorSquares[i].classList.add("hide");
    }
});

function newGame() {
    resetButton.textContent = "New Colors";
    messageDisplay.textContent = "";
    document.querySelector("h1").style.backgroundColor = "steelblue";
    if (gameMode) {
        randomPicked = Math.floor(Math.random() * 6);
    } else {
        randomPicked = Math.floor(Math.random() * 3);
    }
    colorSquares.forEach((square, i) => {
        var assignedColor = generateRandomRGB()
        square.style.backgroundColor = assignedColor;

        if (i === randomPicked) {
            rgbPicked = assignedColor;
            rgbDisplay.textContent = rgbPicked;
        }
        square.addEventListener("click", () => {
            verifySquareColor(square);
        });
    });
}


function setPickedColor() {
    colorSquares.forEach(square => {
        square.style.backgroundColor = rgbPicked;
    });
    document.querySelector("h1").style.backgroundColor = rgbPicked;
}

function verifySquareColor(square) {
    var squareColor = square.style.backgroundColor;
    if (squareColor === rgbPicked) {
        messageDisplay.textContent = "CORRECT! :)";
        setPickedColor();
        resetButton.textContent = "Play Again?"
    } else {
        messageDisplay.textContent = "Try Again...";
        square.style.backgroundColor = "#232323";
    }
}

function generateRandomRGB() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return ("rgb(" + r + ", " + g + ", " + b + ")");
}

newGame();