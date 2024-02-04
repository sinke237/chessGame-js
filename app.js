const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');

// we define the initial state of our board.
// who should play first
// how should the board be indexed
// where is each piece located. this is what we try to define now

const width = 8;

// We need to track who is playing, is it the white or black player?
let playerGo = 'black'; // we set it to black by default.

// we let the users know whose turn to player
playerDisplay.textContent = 'black';

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

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', i);

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

        if(i <= 15){
            square.firstChild.firstChild.classList.add('black');
        }
        if(i >= 48){
            square.firstChild.firstChild.classList.add('white');
        }
        
        gameBoard.append(square);
    });
}
createBoard();

const allSquares = document.querySelectorAll('.square');
// we add events listeners to the square
// we drag from a starter index and drop on another index
// we need to track all of that.
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    
    // When we to track the behaviour of elements that the dragged div 
    // passes over 
    square.addEventListener('dragover', dragOver);

    // we also track where the square element is dropped
    square.addEventListener('drop', dragDrop);
});

// elements to help us track drag and drop functionality

let startPositionID;
let draggedElement;

function dragStart(e) {
    // sets the startPositionID = square-id of the square we drag
    startPositionID = e.target.parentNode.getAttribute('square-id');
    
    // this tracks the div that is being dragged
    draggedElement = e.target;    
}

// prevent misbehaviour during dragover event
function dragOver(e) {
    e.preventDefault();
}

// we will be dropping into squares that have something or are empty
// we want to make sure we drop into the square not the svg
function dragDrop(e) {
    e.stopPropagation(); // to prevet misbehaviour

    // we need to make sure that when e.g it is the player to player
    // the black player should only drag an svg with a black class.
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);

    // we have to know that square that already has a piece in it.
    const taken = e.target.classList.contains('piece');

    const valid = checkIfValid(e.target);

    // we define the opponentGo by changing the previous value of playerGo
    const opponentGo = playerGo === 'white' ? 'black' : 'white';

    // we define what has been taken by the opponent by tracking
    // what the opponent owns.
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    if (correctGo) {
        // allow you place piece on already occupied squares
        if (takenByOpponent && valid) {
            // drops dragged element to drop point
            e.target.parentNode.append(draggedElement);
            // removes the dragged element from the drag start position
            e.target.remove();
            // our function to change player
            changePlayer();
            return 
        }
        // where you can not place a piece
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "You cannot go here!";
            setTimeout(() => infoDisplay.textContent = '', 2000);
            return 
        }
        // place piece on empty squares
        if (valid) {
            e.target.append(draggedElement);
            changePlayer();
            return 
        }
    }

}

function checkIfValid(target) {
    // get the square-id when you drop a piece
    const targetID = Number(target.getAttribute('square-id')) 
                        || Number(target.parentNode.getAttribute('square-id'));
    const startID = Number(startPositionID);
    const piece = draggedElement.id;

    switch (piece) {
        case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15];
            if (
                starterRow.includes(startID) && startID + width * 2 === targetID ||
                startID + width === targetID ||
                startID + width - 1 === targetID && document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||
                startID + width + 1 === targetID && document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild
            ) {
                return true 
            }
            break;
        case 'knight':
            if (
                startID + width * 2 + 1 === targetID ||
                startID + width * 2 - 1 === targetID ||
                startID + width - 2 === targetID ||
                startID + width + 2 === targetID ||
                startID - width * 2 + 1 === targetID ||
                startID - width * 2 - 1 === targetID ||
                startID - width - 2 === targetID ||
                startID - width + 2 === targetID 
            ) {
                return true
            }
            break;
        case 'bishop':
            if (
                startID + width + 1 === targetID ||
                startID + width * 2 + 2 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild ||
                startID + width * 3 + 3 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild ||
                startID + width * 4 + 4 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild ||
                startID + width * 5 + 5 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild ||
                startID + width * 6 + 6 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||
                startID + width * 7 + 7 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID + width * 6 + 6}"]`).firstChild ||
                startID - width - 1 === targetID ||
                startID - width * 2 - 2 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild ||
                startID - width * 3 - 3 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild ||
                startID - width * 4 - 4 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild ||
                startID - width * 5 - 5 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild ||
                startID - width * 6 - 6 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||
                startID - width * 7 - 7 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID - width * 6 - 6}"]`).firstChild ||
                startID - width + 1 === targetID ||
                startID - width * 2 + 2 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild ||
                startID - width * 3 + 3 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild ||
                startID - width * 4 + 4 === targetID && 
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild ||
                startID - width * 5 + 5 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild ||
                startID - width * 6 + 6 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||
                startID - width * 7 + 7 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID - width * 6 + 6}"]`).firstChild ||    
                startID + width - 1 === targetID ||
                startID + width * 2 - 2 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||
                startID + width * 3 - 3 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild ||
                startID + width * 4 - 4 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild ||
                startID + width * 5 - 5 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild ||
                startID + width * 6 - 6 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||
                startID + width * 7 - 7 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID + width * 6 - 6}"]`).firstChild
            ) {
                return true;
            }  
            break;
        case 'rook':
            if (
                startID + width === targetID ||
                startID + width * 2 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild ||
                startID + width * 3 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild ||
                startID + width * 4 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild ||
                startID + width * 5 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild ||
                startID + width * 6 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 5}"`).firstChild ||
                startID + width * 7 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 6}"`).firstChild ||
                // --
                startID - width === targetID ||
                startID - width * 2 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild ||
                startID - width * 3 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild ||
                startID - width * 4 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild ||
                startID - width * 5 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild ||
                startID - width * 6 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 5}"`).firstChild ||
                startID - width * 7 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 6}"`).firstChild ||
                // --
                startID + 1 === targetID ||
                startID + 2 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild ||
                startID + 3 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild ||
                startID + 4 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild ||
                startID + 5 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild ||
                startID + 6 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 5}"`).firstChild ||
                startID + 7 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 6}"`).firstChild ||
                // --
                startID - 1 === targetID ||
                startID - 2 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild ||
                startID - 3 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild ||
                startID - 4 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild ||
                startID - 5 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild ||
                startID - 6 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 5}"`).firstChild ||
                startID - 7 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 6}"`).firstChild
            ) {
                return true;
            }
            break; 
        case 'queen':
            if (
                startID + width + 1 === targetID ||
                startID + width * 2 + 2 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild ||
                startID + width * 3 + 3 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild ||
                startID + width * 4 + 4 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild ||
                startID + width * 5 + 5 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild ||
                startID + width * 6 + 6 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||
                startID + width * 7 + 7 === targetID && 
                            !document.querySelector(`[square-id="${startID + width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 + 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID + width * 6 + 6}"]`).firstChild ||
                startID - width - 1 === targetID ||
                startID - width * 2 - 2 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild ||
                startID - width * 3 - 3 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild ||
                startID - width * 4 - 4 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild ||
                startID - width * 5 - 5 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild ||
                startID - width * 6 - 6 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||
                startID - width * 7 - 7 === targetID && 
                            !document.querySelector(`[square-id="${startID - width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 - 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID - width * 6 - 6}"]`).firstChild ||
                startID - width + 1 === targetID ||
                startID - width * 2 + 2 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild ||
                startID - width * 3 + 3 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild ||
                startID - width * 4 + 4 === targetID && 
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild ||
                startID - width * 5 + 5 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild ||
                startID - width * 6 + 6 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||
                startID - width * 7 + 7 === targetID && 
                            !document.querySelector(`[square-id="${startID - width + 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 2 + 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 3 + 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 4 + 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID - width * 5 + 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID - width * 6 + 6}"]`).firstChild ||    
                startID + width - 1 === targetID ||
                startID + width * 2 - 2 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild ||
                startID + width * 3 - 3 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild ||
                startID + width * 4 - 4 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild ||
                startID + width * 5 - 5 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild ||
                startID + width * 6 - 6 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||
                startID + width * 7 - 7 === targetID && 
                            !document.querySelector(`[square-id="${startID + width - 1}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 2 - 2}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 3 - 3}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 4 - 4}"]`).firstChild &&
                            !document.querySelector(`[square-id="${startID + width * 5 - 5}"]`).firstChild ||
                            !document.querySelector(`[square-id="${startID + width * 6 - 6}"]`).firstChild ||
                // --
                startID + width === targetID ||
                startID + width * 2 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild ||
                startID + width * 3 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild ||
                startID + width * 4 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild ||
                startID + width * 5 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild ||
                startID + width * 6 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 5}"`).firstChild ||
                startID + width * 7 === targetID && 
                            !document.querySelector(`square-id="${startID + width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + width * 6}"`).firstChild ||
                // --
                startID - width === targetID ||
                startID - width * 2 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild ||
                startID - width * 3 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild ||
                startID - width * 4 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild ||
                startID - width * 5 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild ||
                startID - width * 6 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 5}"`).firstChild ||
                startID - width * 7 === targetID && 
                            !document.querySelector(`square-id="${startID - width}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - width * 6}"`).firstChild ||
                // --
                startID + 1 === targetID ||
                startID + 2 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild ||
                startID + 3 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild ||
                startID + 4 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild ||
                startID + 5 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild ||
                startID + 6 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 5}"`).firstChild ||
                startID + 7 === targetID && 
                            !document.querySelector(`square-id="${startID + 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID + 6}"`).firstChild ||
                // --
                startID - 1 === targetID ||
                startID - 2 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild ||
                startID - 3 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild ||
                startID - 4 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild ||
                startID - 5 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild ||
                startID - 6 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 5}"`).firstChild ||
                startID - 7 === targetID && 
                            !document.querySelector(`square-id="${startID - 1}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 2}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 3}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 4}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 5}"`).firstChild &&
                            !document.querySelector(`square-id="${startID - 6}"`).firstChild
            ) {
                return true;
            }
            break;     
        case 'king':
            if (
                startID + 1 === targetID ||
                startID - 1 === targetID ||
                startID + width === targetID ||
                startID - width === targetID ||
                startID + width - 1 === targetID ||
                startID + width + 1 === targetID ||
                startID - width - 1 === targetID ||
                startID - width + 1 === targetID
            ) {
                return true;
            }
            break;
    }
}

function changePlayer() {
    if (playerGo === 'black') {
        playerGo = 'white';
        playerDisplay.textContent = 'white';

        // after the first player(black) drops, the indices have to change
        // such that the index zero will be on the last king of the white player
        // and when it is black player's turn to play
        // the index has to change so its first king has index 0.

        reverseIDs();
    }
    else {
        playerGo = 'black';
        playerDisplay.textContent = 'black';

        revertIDs();
    }
}

// after the first player(black) drops, the indices have to change
// such that the index zero will be on the last king of the white player
// and when it is black player's turn to play
// the index has to change so its first king has index 0.

// this will reverse the indices after the black(default) player plays
function reverseIDs() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => {
        square.setAttribute('square-id', (width*width - 1) - i);
    });
}

// this will revert the indices to the default.
function revertIDs() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}