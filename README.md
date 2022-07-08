# tic-tac-toe
Browser tic-tac-toe game in JS, written using modules and factory functions. 

Functionality and specs: 

- Player can choose their marker (X or O) on landing page.
- Landing page links to source code on Github if player clicks on signature. 
- Player selects their opponent (human or bot). 
- All players are saved in player objects, created using factory function. 
- Player makes move by clicking on gameboard square. When click registers on gameboard square, script checks for 3 in a row of any of the winning combinations on the board, and declares a winner if 3-in-a-row is found. If no winner is found, script checks for a tie (if all game board squares are full). If there is no winner, and game is not a tie, the current player's marker is placed on gameboard square where click is registered. 

- If one player reaches three in a row, winner is delcared in the display. 

- Restart button to navigate back to landing page. 

- Clear board to reset game board without clearing players or markers. 

- Original UI and design. 

- Media queries to resize game for mobile, tablet and laptop.
