"use strict";

let board = ['', '', '', '', '', '', '', '', '',];
let gameIsPaused = true;
const playerOne = Player('Player One','', true);
const playerTwo = Player('Player Two','', true); 
const cpu = Player('CPU','', false); 
let currentPlayer = null;
let opponent;

// Function to set currentPlayer to selection (either player One (if X is selected) or player Two/ bot if O is selected))
function chooseFirstPlayer() {
    if (playerOne.marker === 'X') {
        currentPlayer = playerOne;
    } else if (playerOne.marker === 'O') {
        currentPlayer = opponent; 
    }
    return currentPlayer;
}; 

const gameBoard = (function () {
    // function to reset the board 
    const reset = () => { 
        for (let i=0; i<board.length; i++) { 
            board[i] = ''
            document.querySelectorAll('.gamepiece-square').forEach(square => square.textContent = '');
        };

        document.querySelector("#buttons > div.player-one-btns").style.display = "flex"; 
        document.querySelector("#buttons > div.choose-opponent").style.display = "flex";
        document.querySelector("#player-two-wrapper > div").style.display = "none";
        document.querySelector("#player-one-marker").style.display = "none"; 
        document.querySelector("#winner-wrapper").remove();


        currentPlayer = null;
        opponent = null;
        playerOne.marker = '';
        playerTwo.marker = '';
        cpu.marker = ''; 
        gameIsPaused = false;

        if (!currentPlayer) currentPlayer = chooseFirstPlayer(); 
        document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick));

     };
   
    document.getElementById('clear').addEventListener('click', reset);
})();

// Create player objects and populate their properties (marker and isHuman) using DOM buttons; 
function Player(name, marker, isHuman) {
    const validate = (player) => (player.marker !== '' && player.isHuman !=='')
    return {name, marker, isHuman, validate,}
}

// SELECT WHICH MARKER PLAYERS WILL USE 
const selectMarkers = (event) => {
    document.querySelector("#player-two-wrapper > div").style.display = "flex";
    document.querySelector("#player-one-marker").style.display = "flex"; 
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

    if (!currentPlayer) currentPlayer = chooseFirstPlayer(); 
};

const xo = document.querySelectorAll('.xo'); 
xo.forEach(button => button.addEventListener('click', selectMarkers)); 

// SELECT OPPONENT (BOT OR HUMAN)
function chooseOpponent(event) {
    document.querySelector("#buttons > div.choose-opponent").style.display = "none";
    document.querySelector("#player-two-wrapper > div").style.display = "flex";
    const {target} = event; 
    const opponentType = document.querySelector("#opponent-type"); 

    if (target === document.getElementById('bot')) {
        opponent = cpu; 
        opponentType.textContent = "Opponent = Bot"
    } else if (target === document.getElementById('human')) {
        opponent = playerTwo; 
        opponentType.textContent = "Opponent = Human"; 
    }; 

    currentPlayer = chooseFirstPlayer(); 
}
const humanOrBot = document.querySelectorAll('.human-bot') 
humanOrBot.forEach( button => button.addEventListener('click', chooseOpponent)); 


// REGISTER CLICK ON GAME BOARD, AND CHECK FOR WIN OR TIE:  
function handleSquareClick(event) { 
    const {target} = event
    const targetIndex = parseInt(target.id, 10); 
    if (playerOne.validate(playerOne) && playerTwo.validate(playerTwo)) gameIsPaused = false; 


    function playRound(target,targetIndex,currentPlayer) {
     
        const tar = target; 
        board[targetIndex] = currentPlayer.marker; 
        tar.textContent = currentPlayer.marker;
    }

    // Check if current player has 3 in a row of any of the winning combinations: 
    function checkSquaresForWinner(currentPlayer) {
        let isValid = false;
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
            if (board[winningCombinations[i][0]] === currentPlayer.marker && 
                board[winningCombinations[i][1]] === currentPlayer.marker && 
                board[winningCombinations[i][2]] === currentPlayer.marker) {
                isValid = true; 
                break; 
            } 
        }; 

        if (isValid) gameIsPaused = true;
        return(isValid); 
    }; 

    function checkSquaresForTie() {
       let fullSquares = board.filter((element)=> {
            if(element !=='') return element; 
       })
       console.log(fullSquares);

       if(fullSquares.length === 9) {
            gameIsPaused = true;
            displayWinner(); 
        }; 

        function displayWinner() {
            const winnerWrapper = document.createElement('div'); 
            winnerWrapper.setAttribute('id','winner-wrapper'); 
            document.querySelector("#players").insertBefore(winnerWrapper,document.querySelector("#player-two-wrapper")); 
            winnerWrapper.textContent = `Tie!`
       }
    }

    function handleTurnChange() {
        if (currentPlayer === playerOne) {
            currentPlayer = opponent; 
        } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
            currentPlayer = playerOne; 
        }
    }; 

    const handleWinnerValidation = () => {
        let winner = currentPlayer;
        displayWinner(); 

        function displayWinner() {
            const winnerWrapper = document.createElement('div'); 
            winnerWrapper.setAttribute('id','winner-wrapper'); 
            document.querySelector("#players").insertBefore(winnerWrapper,document.querySelector("#player-two-wrapper")); 
            winnerWrapper.textContent = `Winner is ${winner.name}`
        }; 
    };

    function stopListening() { 
        document.querySelectorAll('.gamepiece-square').forEach(square => square.removeEventListener('click', handleSquareClick))

    }
   
    if (board[targetIndex] === '' && !gameIsPaused) {
        playRound(target,targetIndex,currentPlayer,event); 
        if (!checkSquaresForWinner(currentPlayer) && !checkSquaresForTie()) { 
                handleTurnChange(currentPlayer);
        } else { 
                if (gameIsPaused === true) stopListening(); 
                handleWinnerValidation(); 
        }
    };
};

document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick));
    



