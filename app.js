

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

function createBoard(){
    // for each item of the gameboard, let us create a div for it
    // let us give the div a class of 'square'
    // we want each sqaure to have an index so we can track movement of its item
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square'); 

        // we give each square a custom attribute square-id and value the index from startPieces
        // this way we will be able to track what is happening on each square
        square.setAttribute('square-id', i);

        // we want to track elements according to the row they are in.
        // so we divide the board into rows. because the board is a square,
        // we have 8 rows and 8 columns
        const row = Math.floor(63 - i / 8) + 1;

        // we want that each square has a background color of brown or beige as defined in the stylesheet
        // if the row number is an even number
        if(row % 2 === 0){
            // and the square index is an even number, 
            // get a color of beige, else a color of brown
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        }
        // the row number is an odd number
        else{
            // and the square index is an even number, 
            // get a color of brown, else a color of beige
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
            // square.classList.add(i % 2 !== 0 ? "beige" : "brown");
        }

        // the elements of the first two rows to be black
        // and the elements of the last two rows to be white
        // if(i <= 15){
        //     square.firstChild.
        // }
        
        square.innerHTML = startPiece; 

        // we inject each square to the gameboard
        gameBoard.append(square);                       
    });
}

createBoard();

