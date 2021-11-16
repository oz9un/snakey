// Get game-screens:
const halfGameScreen = document.getElementById('game-screen-half');
const fullGameScreen = document.getElementById('game-screen');

// Choose which game-screen is currently used:
var gameScreen = fullGameScreen.getBoundingClientRect().width == 0 ? halfGameScreen : fullGameScreen;

// Get game-screen's info:
const info_gameScreen = gameScreen.getBoundingClientRect();

// Get score:
const scoreTable = document.getElementById('score');

// Get start button:
const startButton = document.getElementById('startButton');


// Global variables:
var squaresArray = [];
const gameSpeedInitial = 100;
var gameSpeed = gameSpeedInitial;
var snakeArray = [2,1,0];
const pixelSize = 25;
var horizontalSquareCount;
var verticalSquareCount;
const RIGHT = 1;
const LEFT = -1;
var UP;
var DOWN;
var direction = RIGHT;
var timer;
var appleCount = 0;
var score = 0;
var apples = [];

// Why did I need moveList array?
// Sometimes users can move faster than setted timer interval.
// For example: Current direction => Right. User wanted to go one line down and left.
// If user is fast enough, can quickly type down arrow + left arrow.
// In this type of situation, interval only detects last one. Thus, program thinks snake hit itself and ends game.
// Therefore, I create moveList and make every key down to fill this array with next direction.
// move() firstly checks if there are any elements in moveList:
// if there are, then shift and set shifted value as direction. (shift => first comes first served)
// if there aren't go on with same direction.
var moveList = [];

const adjustGameScreen = () => {
    pixelw = gameScreen.getBoundingClientRect().width - ( gameScreen.getBoundingClientRect().width % pixelSize)
    pixelh = gameScreen.getBoundingClientRect().height - ( gameScreen.getBoundingClientRect().height % pixelSize)

    horizontalSquareCount = pixelw / pixelSize;
    verticalSquareCount = pixelh / pixelSize;

    UP = -horizontalSquareCount;
    DOWN = +horizontalSquareCount;
    
    gameScreen.style.width = pixelw + 'px';
    gameScreen.style.height = `${pixelh}px`;
}


// Fill the game-screen with squares, aka: pixels.
const createSquares = () => {
    while(gameScreen.firstChild) {
        gameScreen.removeChild(gameScreen.lastChild)
    }
    squaresArray = [];
    appleCount = 0;
    let pixelCount = horizontalSquareCount * verticalSquareCount;
    for(let x=0; x<pixelCount; x++){
        let square = document.createElement('div');
        square.classList.add('square');
        square.style.height = `${pixelSize}px`;
        square.style.width = `${pixelSize}px`;
        gameScreen.appendChild(square);
        squaresArray.push(square);
    }

    snakeArray.forEach(square => squaresArray[square].classList.add('snake'));
    createApple();
}

// Move snake:
const move = () => {
    if (moveList.length > 0) {
        direction = moveList.shift();
    }
    const snakeHead = snakeArray[0];
    const snakeTail = snakeArray[snakeArray.length - 1];
    
    // Wall hit control:
    if(
        snakeHead % horizontalSquareCount == horizontalSquareCount - 1 && direction == RIGHT ||
        snakeHead % horizontalSquareCount == 0 && direction == LEFT ||
        snakeHead - horizontalSquareCount < 0 && direction == UP ||
        snakeHead + horizontalSquareCount >= horizontalSquareCount * verticalSquareCount && direction == DOWN
    ) {
        console.log('wall hit dead');
        gameOver();
    }

    // Snake hit control:
    if(squaresArray[snakeHead + direction].classList.contains('snake')) {
        console.log('snake hit dead');
        gameOver();
    }

    // If there is apple:
    if (squaresArray[snakeHead + direction].classList.contains('apple')) {
        squaresArray[snakeHead + direction].classList.remove('apple');
        squaresArray[snakeHead + direction].classList.add('snake')
        snakeArray.unshift(snakeHead + direction);
        appleCount --;
        createApple();
        if (gameSpeed > 50){
            gameSpeed -= 2;
        } else if (gameSpeed > 40) {
            gameSpeed -= 1;
        } else if (gameSpeed > 30) {
            gameSpeed -= 1;
        }
        clearInterval(timer);
        timer = setInterval(move, gameSpeed);
        score ++;
        scoreTable.textContent = score;
    }
    
    
    // Remove tail:
    squaresArray[snakeTail].classList.remove('snake');
    snakeArray.pop();
    
    // Add new head:
    squaresArray[snakeHead + direction].classList.add('snake');
    snakeArray.unshift(snakeHead + direction);
    
}

// Change direction of snake:
const directionChange = e => {
    // Handle right direction:
    if (e.key == "ArrowRight" && direction != LEFT && direction != RIGHT) {
        direction = RIGHT;
        moveList.push(direction);
    } else if (e.key == "ArrowLeft" && direction != RIGHT && direction != LEFT) {
        direction = LEFT;
        moveList.push(direction);
    } else if (e.key == "ArrowUp" && direction != DOWN && direction != UP) {
        direction = UP;
        moveList.push(direction);
    } else if (e.key == "ArrowDown" && direction != UP && direction != DOWN) {
        direction = DOWN;
        moveList.push(direction);
    } else if (e.key == " ") {
        startGame();
    }
}

// Create apple to random place:
const createApple = () => {
    for(let x=appleCount; x<2; x++){
        let randomPlace;
        do {
            randomPlace = Math.floor(Math.random() * squaresArray.length);
        } while(snakeArray.includes(randomPlace) || squaresArray[randomPlace].classList.contains('apple'))

        squaresArray[randomPlace].classList.add('apple');
        apples.push(randomPlace);
        appleCount ++;
    }
}

var blackout = 0;
var gameoverInterval;
const blackoutSquare = () => {
    squaresArray[blackout].classList.add('game-over')
    blackout ++;
    if (blackout == squaresArray.length) {
        blackout = 0;
        clearInterval(gameoverInterval);
    }
}
// Finish game:
const gameOver = () => {
    gameoverInterval = setInterval(blackoutSquare, 4)
    clearInterval(timer); 
}

// Start / Restart the game with spacebar.
const startGameShortcut = e => {
    if (e.key == " ") {
        startGame();
    }
}

// Start game:
const startGame = () => {
    // To avoid two eventlisteners for spacebar.
    document.removeEventListener('keydown', startGameShortcut)
    // Cancel game over animation:
    clearInterval(gameoverInterval);
    clearInterval(timer);
    blackout = 0;
    squaresArray.forEach((square) => {
        square.classList.remove('apple');
        square.classList.remove('snake');
        square.classList.remove('game-over');

    })
    snakeArray = [2,1,0];
    moveList = [];
    score = 0;
    direction = 1;
    gameSpeed = gameSpeedInitial;
    appleCount = 0;
    snakeArray.forEach((index) => squaresArray[index].classList.add('snake')); // Create snake's initial position.
    scoreTable.textContent = score;
    createApple(); // Create first apple.
    timer = setInterval(move, gameSpeed);
    document.addEventListener('keydown', directionChange);
}

// Initial game screen:
const initGame = () => {
    adjustGameScreen();
    createSquares();
    snakeArray.forEach((index) => squaresArray[index].classList.add('snake')); // Create snake's initial position.
}
initGame();
document.addEventListener('keydown', startGameShortcut);
startButton.addEventListener('click', startGame);
window.addEventListener('resize', () => {
    gameScreen = fullGameScreen.getBoundingClientRect().width == 0 ? halfGameScreen : fullGameScreen;
    adjustGameScreen();
    createSquares();
})
