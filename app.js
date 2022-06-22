"use strict";

const gameBoard = (function () {
    let board = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];

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



}());

// create new player object 
function createPlayer() {
    const Player = (name,isHuman,marker) => ({ name, isHuman, marker })

    const playerOne = Player('',true,'')

    const playerOneWrapper = document.querySelector("#player-one-wrapper"); 
    const playerTwoWrapper = document.querySelector("#player-two-wrapper"); 


    // Add player one name when enter button is pressed on name field
    let playerOneName = ''; 
    document.querySelector("#player-one-name-btn").addEventListener('click', () => { 
        playerOneName = document.querySelector("#player-one-name-input").value; 

        document.querySelector("#player-one-wrapper > label").style.display = 'none';

        const playerOneNameDisplay = document.createElement('div'); 
        playerOneWrapper.append(playerOneNameDisplay); 
        playerOneNameDisplay.textContent = playerOneName; 
        playerOne.name = playerOneName; 
    })

    // Pick player markers when player one selects either X or O button 
    let playerOneMarker = ''
    let playerTwoMarker = ''
    const xo = document.querySelectorAll('.xo'); 
    xo.forEach((button) => {
        button.addEventListener('click', (event) => {
            const {target} = event; 
            if (target === document.querySelector("#x")) {
                playerOneMarker = event.target.textContent;
                playerTwoMarker = 'O';
                displayMarkers(); 

            } else if (target === document.querySelector("#o")) { 
                playerOneMarker = event.target.textContent;
                playerTwoMarker = 'X'
                displayMarkers(); 
            }

            function displayMarkers() {
                document.querySelector("#player-one-wrapper > label:nth-child(3)").style.display = 'none'; 
                const choicesWrapperOne = document.createElement('div'); 
                playerOneWrapper.appendChild(choicesWrapperOne); 

                const choicesWrapperTwo = document.createElement('div'); 
                playerTwoWrapper.appendChild(choicesWrapperTwo); 

                const playerOneMarkerChoice = document.createElement('div'); 
                choicesWrapperOne.appendChild(playerOneMarkerChoice); 
                playerOneMarkerChoice.textContent = playerOneMarker; 
                playerOne.marker = playerOneMarker;

                const playerTwoMarkerChoice = document.createElement('div'); 
                choicesWrapperTwo.appendChild(playerTwoMarkerChoice); 
                playerTwoMarkerChoice.textContent = playerTwoMarker; 
            }
        })
    }); 
    return {playerOne}; 
}

const players = createPlayer();
