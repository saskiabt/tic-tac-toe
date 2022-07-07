"use strict";

//  FUNCTIONS TO CONTROL THE GAME    //
const gamePlay = (function () {

    // GLOBAL VARIABLES // 
    let board = ['', '', '', '', '', '', '', '', '',];
    let gameIsPaused = true;
    const playerOne = Player('Player One','', true);
    const playerTwo = Player('Player Two','', true); 
    const cpu = Player('CPU','', false); 
    let currentPlayer = null;
    let opponent;

    // Select Current Player:
    function chooseFirstPlayer() {
        if (playerOne.marker === 'X') {
            currentPlayer = playerOne;
        } else if (playerOne.marker === 'O') {
            currentPlayer = opponent; 
        }
        return currentPlayer;
    }; 

    // Create player objects and populate their properties (marker and isHuman) using DOM buttons; 
    function Player(name, marker, isHuman) {
        const validate = (player) => (player.marker !== '' && player.isHuman !=='')
        return {name, marker, isHuman, validate,}
    }

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
        } else if (target === document.getElementById('human')) {
            opponent = playerTwo; 
            document.querySelector("#player-two-wrapper > h1").textContent = "Player Two's Move"
        }; 

        currentPlayer = chooseFirstPlayer(); 
    }
    const humanOrBot = document.querySelectorAll('.human-bot') 
    humanOrBot.forEach( button => button.addEventListener('click', chooseOpponent)); 


    // REGISTER CLICK ON GAME BOARD, AND CHECK FOR WIN OR TIE:    //  
    function handleSquareClick(event) { 
        const {target} = event
        const targetIndex = parseInt(target.id, 10); 
   
        if (currentPlayer === playerTwo || currentPlayer === cpu) {
            document.querySelector("#player-one-wrapper > h1").className = "active-player"; 
            document.querySelector("#player-two-wrapper > h1").classList.remove("active-player");

        } else if (currentPlayer === playerOne) { 
            document.querySelector("#player-one-wrapper > h1").classList.remove("active-player"); 
            document.querySelector("#player-two-wrapper > h1").className = "active-player";
        }
        // HELPER FUNCTIONS // 
            // PLAY ROUND BY WRITING IN BOX W MARKER 
            function playRound(target,targetIndex,currentPlayer) {
                const tar = target; 
                board[targetIndex] = currentPlayer.marker; 
                tar.textContent = currentPlayer.marker;
            }

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
                    } 
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
                    const winnerWrapper = document.createElement('div'); 
                    winnerWrapper.setAttribute('id','winner-wrapper'); 
                    document.querySelector("#game").insertBefore(winnerWrapper,document.querySelector("#players")); 
                    winnerWrapper.textContent = `Tie!`
                    hideElement(document.querySelector("#players")); 
                }
            }

            // SWITCH CURRENT PLAYER IF NO WINNER OR TIE
            function handleTurnChange() {
                if (currentPlayer === playerOne) {
                    currentPlayer = opponent; 
                } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
                    currentPlayer = playerOne; 
                }
            }; 

            // DISPLAY THE WINNER 
            const handleWinnerValidation = () => {
                let winner = currentPlayer;
                displayWinner(); 

                function displayWinner() {
                    const winnerWrapper = document.createElement('div'); 
                    winnerWrapper.setAttribute('id','winner-wrapper'); 
                    document.querySelector("#game").insertBefore(winnerWrapper,document.querySelector("#players")); 
                    winnerWrapper.textContent = `${winner.name} Wins!`;
                    document.querySelector("#player-one-wrapper > h1").classList.remove("active-player"); 
                    document.querySelector("#player-two-wrapper > h1").classList.remove("active-player");
                    hideElement(document.querySelector("#players")); 
                }; 
            };

            function stopListening() { 
                document.querySelectorAll('.gamepiece-square').forEach(square => square.removeEventListener('click', handleSquareClick))
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
    
    document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick));

    // RESET BUTTON
    const reset = () => { 
        gameIsPaused = false;

        for (let i=0; i<board.length; i++) { 
            board[i] = ''
            document.querySelectorAll('.gamepiece-square').forEach(square => square.textContent = '');
        };

        hideElement(document.getElementById('game'));
        showElement(document.querySelector("#choose-marker"));
        showElement(document.querySelector("#choose-opponent"));
        showElement(document.querySelector("#buttons > div:nth-child(3)"));
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
        document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick));
        document.querySelector("#winner-wrapper").remove();
    };
    document.getElementById('clear').addEventListener('click', reset);


    // Helper functions to hide and show DOM elements
    const showElement = (elem) => {
        elem.style.display = "flex"; 
    }

    const hideElement = (elem) => {
        elem.style.display = "none"
    }
    
    const removeFloat = function () {
        if (playerOne.validate(playerOne) && playerTwo.validate(playerTwo)) {
            gameIsPaused = false; 
            hideElement(document.querySelector("#float")); 
            hideElement(document.querySelector("#buttons > div:nth-child(3)")); 
            showElement(document.getElementById('game')); 
            showActivePlayer();
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
    
    };
    document.querySelector('#start').addEventListener('click', removeFloat); 

    

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
})();

