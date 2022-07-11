"use strict";

//  FUNCTIONS TO CONTROL THE GAME    //
const gamePlay = (function () {

    // GLOBAL VARIABLES
    let currentPlayer = null;
    let opponent;
    let board = ['', '', '', '', '', '', '', '', '',];
    let gameIsPaused = true;
    const playerOne = Player('Player One','', true);
    const playerTwo = Player('Player Two','', true); 
    const cpu = Player('CPU','', false); 
    let isListening; 

    // Create player objects 
    function Player(name, marker, isHuman) {
        const validate = (player) => (player.marker !== '' && player.isHuman !=='')
        return {name, marker, isHuman, validate,}
    }

    // Select Current Player:
    function chooseFirstPlayer() {
        if (playerOne.marker === 'X') {
            currentPlayer = playerOne;
        } else if (playerOne.marker === 'O') {
            currentPlayer = opponent; 
        }
        return currentPlayer;
    }; 

    function showActivePlayer() {
        if (currentPlayer === playerOne) {
            document.querySelector("#player-one-wrapper > h1").className = "active-player"; 
            document.querySelector("#player-two-wrapper > h1").classList.remove("active-player");

        } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
            document.querySelector("#player-one-wrapper > h1").classList.remove("active-player"); 
            document.querySelector("#player-two-wrapper > h1").className = "active-player";
        };
    };

   
    // SELECT WHICH MARKER PLAYERS WILL USE 
    const selectMarkers = (event) => {
        const {target} = event; 

        if (target.id === 'x') {
            playerOne.marker = 'X';
            playerTwo.marker = 'O';
            cpu.marker = 'O';
        } else if (target.id === 'o') {
            playerOne.marker = 'O';
            playerTwo.marker = 'X';
            cpu.marker = 'X';
        }
        if (!currentPlayer) currentPlayer = chooseFirstPlayer(); 
    };

    const xo = document.querySelectorAll('.xo'); 
    xo.forEach(button => button.addEventListener('click', selectMarkers)); 

    // SELECT OPPONENT (BOT OR HUMAN)
    function chooseOpponent(event) {
        const {target} = event; 
        if (target === document.getElementById('bot')) {
            opponent = cpu; 
            document.querySelector("#player-two-wrapper > h1").textContent = "CPU's Move"
            stopListening(); 
        } else if (target === document.getElementById('human')) {
            opponent = playerTwo; 
            document.querySelector("#player-two-wrapper > h1").textContent = "Player Two's Move"
            startListening(); 
        }; 

        currentPlayer = chooseFirstPlayer(); 
    }
    const humanOrBot = document.querySelectorAll('.human-bot') 
    humanOrBot.forEach( button => button.addEventListener('click', chooseOpponent)); 


    const startGame = function () {
        if (!playerOne.validate(playerOne) && !playerTwo.validate(playerTwo)) {
            document.querySelector('#start').disabled = true; 
        } else {
            document.querySelector('#start').disabled = false; 
            gameIsPaused = false; 
            hideElement(document.querySelector("#float")); 
            hideElement(document.querySelector("#buttons > div:nth-child(3)")); 
            showElement(document.getElementById('game')); 
            showActivePlayer();
            if (currentPlayer === cpu) {
                setTimeout(computerPlay,500); 
            }
            if (currentPlayer === playerOne || currentPlayer === playerTwo) startListening(); 
        }
    };
    document.querySelector('#start').addEventListener('click', startGame); 

    // CHECK IF EITHER PLAYER HAS WON
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
            }; 
        }; 

        if (isValid) gameIsPaused = true;
    
        return(isValid); 
    }; 

    // CHECK IF GAME IS A TIE
    function checkSquaresForTie() {
        let fullSquares = board.filter((element)=> {
                if(element !=='') return element; 
        })

        if(fullSquares.length === 9) {
            gameIsPaused = true;
            displayTie(); 
        }; 

        function displayTie() {
            hideElement(document.querySelector("#players")); 
            const winnerWrapper = document.getElementById('winner-wrapper'); 
            showElement(winnerWrapper);
            winnerWrapper.className = "winner-wrapper-showing";
            winnerWrapper.textContent = `Tie!`
        }
    }

    // SWITCH CURRENT PLAYER IF NO WINNER OR TIE
    function handleTurnChange() {
        if (currentPlayer === playerOne) {
            currentPlayer = opponent; 
            if (opponent === cpu) {
                stopListening(); 
                setTimeout(computerPlay,500); 

            }
        } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
            currentPlayer = playerOne; 
            if (opponent === cpu) startListening(); 
        }
        showActivePlayer();
    }; 

    // DISPLAY THE WINNER 
    const handleWinnerValidation = () => {
        let winner = currentPlayer;
        displayWinner(); 

        function displayWinner() {
            hideElement(document.querySelector("#players")); 
            const winnerWrapper = document.getElementById('winner-wrapper'); 
            showElement(winnerWrapper);
            winnerWrapper.className = "winner-wrapper-showing";
            winnerWrapper.textContent = `${winner.name} Wins!`;

        }; 
    };

    // START AND STOP LISTENING TO GAMEBOARD EVENT CLICKS 
    function stopListening() { 
        isListening = false;
        document.querySelectorAll('.gamepiece-square').forEach(square => square.removeEventListener('click', handleSquareClick))
    }

    function startListening() {
        isListening = true; 
        document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick))
    }


    // REGISTER CLICK ON GAME BOARD, AND CHECK FOR WIN OR TIE:    //  
    function handleSquareClick(event) { 
        const {target} = event
        const targetIndex = parseInt(target.id, 10); 
   
        // HELPER FUNCTIONS // 
            // PLAY ROUND BY WRITING IN BOX W MARKER 
            function playRound(target,targetIndex,currentPlayer) {
                const tar = target; 
                board[targetIndex] = currentPlayer.marker; 
                tar.textContent = currentPlayer.marker;
            }


        // GAMEPLAY: 
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
  
    // FUNCTIONS FOR WHEN COMPUTER IS THE OPPONENT: 
    const cpuTakeTurn = () => {
        const emptySquares = []
        for (let i=0; i<board.length; i++) {
            if (board[i] === '') emptySquares.push(i); 
        }
        // const emptySquares = board.filter(element => element === ''); 
        console.log(emptySquares);
        const index = emptySquares[Math.floor(Math.random()*emptySquares.length)]; 
        console.log(index)

        board[index] = currentPlayer.marker; 
        document.getElementById(index).textContent = currentPlayer.marker;
        console.log(emptySquares);

    }
  
    // CPU TAKE TURN, CHECK FOR TIE, AND CHECK FOR WINNER, IF NOT CHANGE CURRENT PLAYER 
    const computerPlay = () => {
        stopListening(); 
        cpuTakeTurn(); 

        if (!checkSquaresForWinner(currentPlayer) && !checkSquaresForTie()) { 
            handleTurnChange(currentPlayer);
            startListening(); 
        } else { 
                if (gameIsPaused === true) stopListening(); 
                handleWinnerValidation(); 
        }
    };

    // RESET BUTTON to restart game, reset markers and opponents: 
    const reset = () => { 
        gameIsPaused = false;

        for (let i=0; i<board.length; i++) { 
            board[i] = ''
            document.querySelectorAll('.gamepiece-square').forEach(square => square.textContent = '');
        };

        hideElement(document.getElementById('game'));
        showElement(document.querySelector("#choose-marker"));
        showElement(document.querySelector("#choose-opponent"));
        showElement(document.querySelector("#start-wrapper"));
        showElement(document.querySelector("#float")); 
        showElement(document.querySelector("#players")); 
        
        currentPlayer = null;
        opponent = null;
        playerOne.marker = '';
        playerTwo.marker = '';
        cpu.marker = ''; 

        document.querySelector('body').style.backgroundColor = "white"
        document.querySelectorAll('.cb').forEach((button) => {
            button.style.backgroundColor = 'white';
            button.style.color = "rgb(31, 56, 119)"
        });

        if (!currentPlayer) currentPlayer = chooseFirstPlayer(); 
        startListening();       
        const winnerWrapper = document.getElementById('winner-wrapper')
        winnerWrapper.classList.remove('winner-wrapper-showing'); 
        hideElement(winnerWrapper);
    };
    document.getElementById('clear').addEventListener('click', reset);
    
    // Clear board button to restart game without resetting markers or opponent: 
    const clearBoard = () => {
        const winnerWrapper = document.getElementById('winner-wrapper')
        winnerWrapper.classList.remove('winner-wrapper-showing'); 
        hideElement(winnerWrapper)
        currentPlayer = chooseFirstPlayer(); 
        showActivePlayer();
        showElement(document.querySelector("#players")); 
        gameIsPaused = false;
        for (let i=0; i<board.length; i++) { 
            board[i] = ''
            document.querySelectorAll('.gamepiece-square').forEach(square => square.textContent = '');
        };

        if (currentPlayer === cpu) {
            setTimeout(computerPlay,500); 
        }
        if (currentPlayer === playerOne || currentPlayer === playerTwo) startListening(); ;
    }
    document.querySelector("#restart").addEventListener('click', clearBoard); 

    // Helper functions to hide and show DOM elements
    const showElement = (elem) => {
        elem.style.display = "flex"; 
    }

    const hideElement = (elem) => {
        elem.style.display = "none"
    }
})();

const controlDisplay = (function () {
    document.querySelectorAll('.cb').forEach((button) => {
        button.addEventListener('click', (event) => {
            const tar = event.target
            const tarID = event.target.id; 
            switch(tarID) {
                case 'x':
                    tar.style.backgroundColor = 'rgb(31 56 119)'; 
                    tar.style.color = 'white'
                    document.querySelector("#o").style.backgroundColor = 'white'; 
                    document.querySelector("#o").style.color = 'rgb(31 56 119)'; 

                    break;
                case 'o':
                    tar.style.backgroundColor = 'rgb(31 56 119)'
                    tar.style.color = 'white'
                    document.querySelector("#x").style.backgroundColor = 'white';
                    document.querySelector("#x").style.color = 'rgb(31 56 119)'; 

                    break;
                case 'human': 
                    tar.style.backgroundColor = 'rgb(31 56 119)'; 
                    tar.style.color = 'white'
                    document.querySelector("#bot").style.backgroundColor = 'white'; 
                    document.querySelector("#bot").style.color = 'rgb(31 56 119)'; 

                    break;
                case 'bot':
                    tar.style.backgroundColor = 'rgb(31 56 119)'; 
                    tar.style.color = 'white'
                    document.querySelector("#human").style.backgroundColor = 'white'; 
                    document.querySelector("#human").style.color = 'rgb(31 56 119)'; 
                    break;
                default:
                    break; 
            } return false;
        })
    })

    document.querySelector("#sig > span").addEventListener('click', () => {
        window.open('https://github.com/saskiabt/tic-tac-toe','_blank')
    })
})();
