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

    // const titleBlue = style.color('#004dff');

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
        document.querySelector("#player-two-wrapper > div").style.display = "flex";
        document.querySelector("#player-one-marker").style.display = "flex"; 
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
        document.querySelector("#player-two-wrapper > div").style.display = "flex";
        const {target} = event; 
        const opponentType = document.querySelector("#opponent-type"); 

        if (target === document.getElementById('bot')) {
            opponent = cpu; 
            opponentType.textContent = "Opponent = Bot"
            document.querySelector("#player-two-wrapper > h1").textContent = "CPU"
        } else if (target === document.getElementById('human')) {
            opponent = playerTwo; 
            opponentType.textContent = "Opponent = Human"; 
            document.querySelector("#player-two-wrapper > h1").textContent = "Player Two"
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
                    document.querySelector("#players").insertBefore(winnerWrapper,document.querySelector("#player-two-wrapper")); 
                    winnerWrapper.textContent = `Tie!`
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
                    document.querySelector("#players").insertBefore(winnerWrapper,document.querySelector("#player-two-wrapper")); 
                    winnerWrapper.textContent = `Winner is ${winner.name}`;
                    document.querySelector("#player-one-wrapper > h1").classList.remove("active-player"); 
                    document.querySelector("#player-two-wrapper > h1").classList.remove("active-player");
                    document.querySelector("#player-one-wrapper").style.display = "none";
                    document.querySelector("#player-two-wrapper").style.display = "none";
                }; 
            };

            // REMOVE EVENT LISTENER FROM GAMEBOARD IF GAME IS PAUSED
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
        for (let i=0; i<board.length; i++) { 
            board[i] = ''
            document.querySelectorAll('.gamepiece-square').forEach(square => square.textContent = '');
        };

        document.querySelector("#choose-marker").style.display = "flex"; 
        document.querySelector("#choose-opponent").style.display = "flex";
        document.querySelector("#player-two-wrapper > div").style.display = "none";
        document.querySelector("#player-one-marker").style.display = "none"; 
        document.querySelector("#buttons > div:nth-child(3)").style.display = 'flex';
        document.getElementById('game').style.display = 'none';
        document.querySelector("#content > div.float").style.display = 'flex';
        document.querySelector("#player-one-wrapper").style.display = "flex";
        document.querySelector("#player-two-wrapper").style.display = "flex";
        currentPlayer = null;
        opponent = null;
        playerOne.marker = '';
        playerTwo.marker = '';
        cpu.marker = ''; 
        gameIsPaused = false;

        if (!currentPlayer) currentPlayer = chooseFirstPlayer(); 
        document.querySelectorAll('.gamepiece-square').forEach(square => square.addEventListener('click', handleSquareClick));
        document.querySelector("#winner-wrapper").remove();
    };
    
    document.getElementById('clear').addEventListener('click', reset);

    const removeFloat = (function () {
        document.querySelector("#start").addEventListener('click', (event) => {
            if (playerOne.validate(playerOne) && playerTwo.validate(playerTwo)) {
                document.querySelector("#content > div.float").style.display = 'none'
                gameIsPaused = false; 
                document.querySelector("#buttons > div:nth-child(3)").style.display = 'none';
                // console.log({currentPlayer}); 

                document.getElementById('game').style.display = 'flex'; 
                highlightActivePlayer();
            }
        }); 
    })();

    function highlightActivePlayer() {
        if (currentPlayer === playerOne) {
            document.querySelector("#player-one-wrapper > h1").className = "active-player"; 
            document.querySelector("#player-two-wrapper > h1").classList.remove("active-player");


        } else if (currentPlayer === playerTwo || currentPlayer === cpu) { 
            document.querySelector("#player-one-wrapper > h1").classList.remove("active-player"); 
            document.querySelector("#player-two-wrapper > h1").className = "active-player";
        }
    }

    
})();



