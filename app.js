const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');

// we define the initial state of our board.
// who should play first
// how should the board be indexed
// where is each piece located. this is what we try to define now

const width = 8;
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',  
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
];

// this is how the items should align in our gameboard
// this exit only in memory but not visible on the browser
// to make it visible on the browser, we have to inject it in the #gameboard div
// we have a total of 64 items from the array to be on the gameboard
// the index will start from 0 - 63.
// we place each piece inside a square div then inject
// all the square divs inside the #gameboard div

// creating gameboard
for (let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('square-id', i);
  
    // Set background color based on row and column indexes

    // Dividing i by num of cols to get the row
    const row = Math.floor(i / 8);
    // calculates the index of the square.
    const col = i % 8;
    if ((row + col) % 2 === 0) {
        // color the square beige if the sum of the row and column is even
        square.classList.add('beige');
    } else {
        // color the square brown if the sum of the row and col is odd
        square.classList.add('brown');
    }
  
    // Append the square to the game board
    gameBoard.appendChild(square);
  
    // Add piece to the square if available
    if (startPieces[i]) {
        square.innerHTML = startPieces[i];

        // We add the drag and drop functionality
        // All the squares that should be draggable at this point should 
        // have a first child to indicate it has an svg that we want to drag.
        // we add a draggable attribute to it and set it to be true.

        square.firstChild.setAttribute('draggable', true);
    }
    // Now we color the svgs to make a distinction between the players
    // We define the color styles in the stylesheet and append the classes to the svgs

    if(i <= 15){
        square.firstChild.firstChild.classList.add('black');
    }
    if(i >= 48){
        square.firstChild.firstChild.classList.add('white');
    }
}

// But we want to drag every square because we playing, we should
// be able to move the svgs from one place to another.

const allSquares = document.querySelectorAll('.square');

// we add a dragstart event listener to all the squares
allSquares.forEach(square => {
    // this event listener calls a function dragStart
    square.addEventListener('dragstart', dragStart);
    // dragover functionality
    square.addEventListener('dragover', dragOver);
    // eventlister for the drop function
    square.addEventListener('drop', dragDrop);
});

// when we drag, we drag from one index and drop on another index
// we have to track these indices and the element we drag.

let startPositionID;
let draggedElement;

// Function to track where we start dragging from
function dragStart(e){
    startPositionID = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

// Funtion to prevent things from going wrong when dragging over
function dragOver(e){
    e.preventDefault();
}

// we need to track which player's turn is it to player
// we set it to black so the player to player first is black
let playerGo = 'black';
playerDisplay.textContent = 'black';

// Function to track where we drop.
// with the styles in the stylessheet, we will be
// dragging the piece and dropping into the squares
function dragDrop(e){
    e.stopPropagation(); // prevent misbehaviours

    // We need to make sure the correct player is dragging the correct piece.
    // so a black player should drag but a piece with black class
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);

    // we want to know it a square already contains a piece
    const taken = e.target.classList.contains('piece');

    const valid = checkIfValid(e.target);

    // we define the oppponent turn to player by changing the previour value of playerGo
    const oppponentGo = playerGo === 'white'?'black':'white';

    // We define what is taken by the opponent to keep what on what each player owns
    const takenByOpponent = e.target.firstChild?.classList.contains(oppponentGo);
    
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.appendChild(draggedElement);
            e.target.remove();

            // after black has played we need to change player.
            changePlayer()
            return 
        }
        if(taken && !takenByOpponent){
            infoDisplay.textContent = "You cannot go there!";
            setTimeout(() => {
                infoDisplay.textContent = '';
            }, 2000);
        }
        if(valid){
            e.target.appendChild(draggedElement);
            changePlayer();
            return
        }
    }

}



// Function to change player
function changePlayer(){
    if(playerGo === "black"){
        playerGo = "white";
        playerDisplay.textContent = 'white';
        reverseIDs();
    }
    else{
        playerGo = "black";
        playerDisplay.textContent = 'black';
        reverseIDs();
    }
}

// Now we revert the indices. When black player is player,
// index starts from 0, from the first king of black player.
// when white player is playing the index should change and start
// from 0 of first king of white player.

function reverseIDs(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', (width*width - 1) - i);
    });
}

// After reversing to the white player, we need to revert back for the black player
function revertIDs(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', i);
    });
}