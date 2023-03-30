document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid');
let width = 10;
let bombAmount = 20;
let flags = 0;
let squares = [];
let isGameOver = false;
let BOMB_AMOUNT_INTERVAL = 8;
let hints = bombAmount - flags;
// difficulty level
function setDifficultyLevel(difficultyLevel) {
    bombAmount = difficultyLevel.target.value*BOMB_AMOUNT_INTERVAL;
    hints = bombAmount - flags; 
}

// game btn 'change'
const gameDifficulty = document.querySelector('#game-difficulty');
gameDifficulty.addEventListener('change', setDifficultyLevel, false);

// game btn 'start'
function beginGame() {
    displayFlagsLeft();
    createBoard();
}
 console.log();
// reset btn

function newGame(reset) {
    flags = 0;
    hints = bombAmount - flags
    isGameOver = document.querySelector('.game-results');
    isGameOver.innerHTML = '';
    isGameOver = false;
    beginGame();
}  
const startGame = document.getElementById('start-game-btn');
startGame.addEventListener('click', beginGame, false);
const reset = document.querySelector('.restartGameBtn');
reset.addEventListener('click', newGame, false);

console.log(reset);


// create the function flags-left

function displayFlagsLeft() {
    const flagsLeft = document.querySelector('.flags-left');
    let flagCount = `<p class="flags-left">Flags Remaining:${hints}</p>`;
    flagsLeft.innerHTML = '';
    flagsLeft.insertAdjacentHTML("afterbegin", flagCount);

}   



// create Board
 function createBoard() {
    squares = [];
    // clear board
     grid.innerHTML = '';

//get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width*width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() -0.5);
    

    for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        // normal click
        square.addEventListener('click', function(e){
            click(square);
        })
        
        // cntrl and left click
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        }
    }
//add numbers
for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = (i % width === 0);
    const isRightEdge = (i % width === -1);


    if (squares[i].classList.contains('valid')) {
        if(i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total++;
        if(i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++;
        if(i > 10 && squares[i -width].classList.contains('bomb')) total++;
        if(i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total++;
        if(i < 99 && !isRightEdge && squares[i  +1].classList.contains('bomb')) total++;
        if(i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++;
        if(i < 89 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++;
        if(i < 89 && squares[i +width].classList.contains('bomb')) total++;
        squares[i].setAttribute('data', total);
    }
}
console.log(squares);
}

// createBoard();

// add Flag with right click
function addFlag(square) {
    if(isGameOver) return;
    if(!square.classList.contains('checked') && (flags < bombAmount)) {
        if(!square.classList.contains('flag')){
            square.classList.add('flag');
            square.innerHTML = '🏴‍☠️';
            flags++;
            checkForWin();
            hints--;
            displayFlagsLeft();
        }else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
        }
    }
}

// click on square actions

function click(square) {
    let currentId = square.id;
    if(isGameOver) return;
    if(square.classList.contains('checked') || square.classList.contains('flag')) return;
    if (square.classList.contains('bomb')) {
        gameOver(square);
    } else {
        let total = square.getAttribute('data');
        if(total != 0){
            square.classList.add('checked');
            square.innerHTML = total;
            return;
        }
        checkSquare(square, currentId);
    }
    square.classList.add('checked');
}


// check neighboring squares once square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === -1);
console.log(square);
    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1 -width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId > 10) {
            const newId = squares[parseInt(currentId) -width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1 -width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId < 99 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1 +width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId < 89 && !isRightEdge) {
            const newId = squares[parseInt(currentId) +1 +width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }
        if (currentId < 89 && squares) {
            const newId = squares[parseInt(currentId) +width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);   
        }

    }, 10);
}

// game over
function gameOver(square) {
         isGameOver = document.querySelector('.game-results');
         isGameOver.innerHTML = 'BOOM! Game Over!';
         isGameOver = true;

         console.log(isGameOver);
         // show All the bombs
         squares.forEach(square => {
             if(square.classList.contains('bomb')) {
                 square.innerHTML = '💣';
                }
            })
}

// check for win
function checkForWin() {
 let matches = 0;

    for (let i = 0; i < squares.length; i++) {
         if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
         }
         if(matches === bombAmount) {
            isGameOver = document.querySelector('.game-results');
            isGameOver.innerHTML = 'You Won!';
            isGameOver = true;

         }
        
    }
}

});
