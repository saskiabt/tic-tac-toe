"use strict";

const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];

    // loop through gameboard squares and write value of each object in gameboard array
    const writeValues = function() {
        const gameboardSquares = document.querySelectorAll('.gamepiece-square')
            for (let i=0; i<gameboardSquares.length; i++) { 
                gameboardSquares[i].textContent = board[i]
            }
    }
    writeValues();

    // function to reset the board 
    const reset = () => { 
        for (let i=0; i<board.length; i++) { 
            board[i] = ''
        };
        writeValues(); 
    };
    
    // reset board on reset button click; 
    const resetButton = document.getElementById('clear'); 
    resetButton.addEventListener('click', () => {
        reset();
    });

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

function Player(marker, isHuman) {
    return { marker, isHuman,}
}

Player.prototype.Write = function(elem) {
    elem.textContent = this.marker
}

const playerOne = Player('', true);
const playerTwo = Player(); 

// Select which marker player one will use 
const xo = document.querySelectorAll('.xo'); 
    xo.forEach((button) => {
        button.addEventListener('click', (event) => {
            const {target} = event; 

            if (target === document.getElementById('x')) {
                playerOne.marker = 'X'
                playerTwo.marker = 'O'
                displayMarkers(); 

            } else if (target === document.getElementById('o')) {
                playerOne.marker = 'O'
                playerTwo.marker = 'X'
                displayMarkers(); 
            }

            document.querySelector('.marker-wrapper').style.display = 'none'; 

            function displayMarkers() {             
                const markerDisplayOne = document.createElement('div'); 
                document.querySelector("#player-one-wrapper").append(markerDisplayOne); 
                markerDisplayOne.textContent = `Marker = ${playerOne.marker}`; 
            
                const markerDisplayTwo = document.createElement('div'); 
                document.querySelector("#player-two-wrapper").insertBefore(markerDisplayTwo,document.querySelector("#player-two-wrapper > div.human-or-bot")); 
                markerDisplayTwo.textContent = `Marker = ${playerTwo.marker}`; 
            }
        });
    }); 

// select whether player two is a bot or human
const humanOrBot = document.querySelectorAll('.human-bot') 
humanOrBot.forEach((button) => {
    button.addEventListener('click', (event) => {
        const {target} = event; 
        if (target === document.getElementById('bot')) {
            playerTwo.isHuman = false;
            displayPlayer();
        } else if (target === document.getElementById('human')) { 
            playerTwo.isHuman = true
            displayPlayer();
        }

        function displayPlayer() { 
            const choice = document.querySelector("#player-two-wrapper > div > div"); 
            // eslint-disable-next-line no-unused-expressions
            playerTwo.isHuman ? choice.textContent = "Opponent = Human" : choice.textContent = "Opponent = Bot"; 
        }
    })
})

// function to play the game once players are defined
const game = (function () {
    let playerOneTurn = null;
    let playerTwoTurn = null;

    if (playerOne.marker === "X") {
        playerOneTurn = true;
        setTurns();
    } else if (playerOne.marker === "O") {
        playerOneTurn = false; 
        setTurns();
    }

    function setTurns() {
        if (playerOneTurn === true) {
            playerTwoTurn = false;
        } else if (playerTwoTurn === true) {
            playerOneTurn = false; 
        }
    }; 

    function switchTurns() {
        if (playerOneTurn === true) { 
            playerOneTurn = false;
            setTurns(); 
        } else if (playerOneTurn === false)
            playerOneTurn = true; 
            setTurns(); 
    }

    if (playerOneTurn === true) {
        const squares = document.querySelectorAll('.gamepiece-square');
        squares.forEach((square) => {
            square.addEventListener('click', () => {
                
            })
        })
    }
})();

