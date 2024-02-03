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
    console.log(square);
});

