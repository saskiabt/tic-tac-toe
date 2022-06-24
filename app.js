"use strict";

let board = ['', '', '', '', '', '', '', '', '',];
let gameIsPaused = true;
const playerOne = Player('Player One','', true);
const playerTwo = Player('Player Two','', true); 
const cpu = Player('CPU','', false); 
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
    resetButton.addEventListener('click', reset)

    const winningCombinations = [
        [1,2,3],
        [4,5,6],
        [7,8,9], 
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [3,5,7]
    ]


})();

// Create player objects and populate their properties (marker and isHuman) using DOM buttons; 
function Player(name, marker, isHuman) {
    // Function to check if player has selected a marker and an opponent type: 
    const validate = (player) => (player.marker !== '' && player.isHuman !=='')

    return { name, marker, isHuman, validate,}
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

    function displayMarkers() {      
        document.querySelector("#buttons > div.player-one-btns").style.display = "none";

        const markerDisplayOne = document.querySelector("#player-one-marker");
        markerDisplayOne.textContent = `Marker = ${playerOne.marker}`; 

        const markerDisplayTwo = document.querySelector("#player-two-marker");
        markerDisplayTwo.textContent = `Marker = ${playerTwo.marker}`
    };
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

   if (playerOne.validate(playerOne) && playerTwo.validate(playerTwo)) {
       gameIsPaused = false; 
   }; 

   function chooseFirstPlayer() { 
    let currentPlayer; 
    if (playerOne.marker === 'X') {
        currentPlayer = playerOne;
    } else if (playerOne.marker === 'O') {
        currentPlayer = opponent; 
    }
    return currentPlayer; 
    };  

    if (board[targetIndex] === '' && !gameIsPaused) {
        let currentPlayer = chooseFirstPlayer(); 
        console.log({currentPlayer})
        playRound(target,targetIndex,currentPlayer); 
        // handleTurnChange();
        // handleWinnerValidation(); 
    }

     
}

function playRound(target,targetIndex,currentPlayer) {
    board[targetIndex] = currentPlayer.marker; 
    target.textContent = currentPlayer.marker;
}


// function handleTurnChange() 

// handleWinnerValidation(); 



document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click',handleSquareClick));


