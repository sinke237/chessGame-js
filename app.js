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


