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

    // we have to know that square that already has a piece in it.
    const taken = e.target.classList.contains('piece');

    // our function to change player
    changePlayer();
}

function changePlayer() {
    
}