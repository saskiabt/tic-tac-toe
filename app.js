"use strict";

let board = ['', '', '', '', '', '', '', '', '',];
let gameIsPaused = true;
const playerOne = Player('Player One','', true);
const playerTwo = Player('Player Two','', true); 
const cpu = Player('CPU','', false); 
let currentPlayer; 
let opponent;

const gameBoard = (function () {
    // function to reset the board 
    const reset = () => { 
        for (let i=0; i<board.length; i++) { 
            board[i] = ''
        };
     };
    // reset board on reset button click; 
    const resetButton = document.getElementById('clear'); 
    resetButton.addEventListener('click', reset);
})();

// Create player objects and populate their properties (marker and isHuman) using DOM buttons; 
function Player(name, marker, isHuman) {
    // Function to check if player has selected a marker and an opponent type: 
    const validate = (player) => (player.marker !== '' && player.isHuman !=='')

    return {name, marker, isHuman, validate,}
}

Player.prototype.Write = function(elem) {
    elem.textContent = this.marker
}

// Select which marker player one will use 
const selectMarkers = (event) => {
    const {target} = event; 

    if (target.id === 'x') {
        playerOne.marker = 'X';
        playerTwo.marker = 'O';
        cpu.marker = 'O';
        displayMarkers();
    } else if (target.id === 'o') {
        playerOne.marker = 'O';
        playerTwo.marker = 'X';
        cpu.marker = 'X';
        displayMarkers();
    }

    currentPlayer = chooseFirstPlayer(); 

    function displayMarkers() {      
        document.querySelector("#buttons > div.player-one-btns").style.display = "none";

        const markerDisplayOne = document.querySelector("#player-one-marker");
        markerDisplayOne.textContent = `Marker = ${playerOne.marker}`; 

        const markerDisplayTwo = document.querySelector("#player-two-marker");
        markerDisplayTwo.textContent = `Marker = ${playerTwo.marker}`
    };

    function chooseFirstPlayer() {
        if (playerOne.marker === 'X') {
            currentPlayer = playerOne;
        } else if (playerOne.marker === 'O') {
            currentPlayer = opponent; 
        }
        return currentPlayer;
    }
};

const xo = document.querySelectorAll('.xo'); 
xo.forEach(button => button.addEventListener('click', selectMarkers)); 

// select whether player two is a bot or human
function chooseOpponent(event) {
    const {target} = event; 
    const opponentType = document.querySelector("#opponent-type"); 

    if (target === document.getElementById('bot')) {
        opponent = cpu; 
        opponentType.textContent = "Opponent = Bot"
    } else if (target === document.getElementById('human')) {
        opponent = playerTwo; 
        opponentType.textContent = "Opponent = Human"; 
    }; 

    return opponent; 
}
const humanOrBot = document.querySelectorAll('.human-bot') 
humanOrBot.forEach( button => button.addEventListener('click', chooseOpponent)); 


// Register click of game cell and if cell is empty and game is not paused, proceed: 
function handleSquareClick(event) { 
    const {target} = event
    const targetIndex = parseInt(target.id, 10); 

   if (playerOne.validate(playerOne) && playerTwo.validate(playerTwo)) gameIsPaused = false; 
   
    if (board[targetIndex] === '' && !gameIsPaused) {
        console.log({currentPlayer})
        playRound(target,targetIndex,currentPlayer); 
        if (!checkSquaresForWinner(currentPlayer)) { 
             handleTurnChange(currentPlayer);
        } else { 
              // handleWinnerValidation(); 
        }
    }
}

function playRound(target,targetIndex,currentPlayer) {
    const tar = target; 
    board[targetIndex] = currentPlayer.marker; 
    tar.textContent = currentPlayer.marker;
}

function checkSquaresForWinner(currentPlayer) {
    // check if board has 3 in a row in any of the winning combinations:
    let isValid = false;
    console.log(board)
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8], 
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]; 

    for (let i=0; i<winningCombinations.length; i++) {
        if (board[winningCombinations[i][0]] === currentPlayer.marker && board[winningCombinations[i][1]] === currentPlayer.marker && board[winningCombinations[i][2]] === currentPlayer.marker) {
            isValid = true; 
            break; 
        } 
    }; 
    console.log(isValid) 
    return(isValid); 
}

function handleTurnChange() {
   if (currentPlayer === playerOne) {
       currentPlayer = opponent; 
   } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
       currentPlayer = playerOne; 
   }
}; 

// handleWinnerValidation(); 



document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click',handleSquareClick));


