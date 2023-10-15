let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
// variables for touch input
let startX = 0;
let startY = 0;

function setGame(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for (let r = 0; r < rows ; r++){
        for(let c = 0; c < columns; c++ ){
            let tile = document.createElement('div');

            tile.id = r.toString() + "-" + c.toString();


            let num = board[r][c];
            updateTile(tile, num);

            document.getElementById('board').append(tile);

            
        }
    }

    //random tile
    setTwo();
    setTwo();
}

function updateTile(tile,num){
    tile.innerText = "";

    tile.classList.value = "";
    tile.classList.add("tile"); 

    if(num > 0) {
        // Set the tile's text to the number based on the num value.
        tile.innerText = num.toString();
        // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // if num is greater than 4096, a special  class "x8192" is added.
            tile.classList.add("x8192");
        }
    }  
}

window.onload = function(){
    setGame();
}

function handleSlide(param){
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(param.code)){
        param.preventDefault(); //prevent default behavior

        if(param.code === 'ArrowLeft'){
            slideLeft();
            setTwo();
        }else if(param.code === 'ArrowRight'){
            slideRight();
            setTwo();
        }else if(param.code === 'ArrowUp'){
            slideUp();
            setTwo();
        }else if (param.code === 'ArrowDown'){
            slideDown();
            setTwo();
        }
    }

    document.querySelector('.score').innerHTML = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}


document.addEventListener('keydown',handleSlide )

function filterZero(row){
    return row.filter(num => num != 0);

}


function slide(row){
    row = filterZero(row);  //get rid of zero tiles

    for(let i = 0; i < row.length - 1; i++){
        if(row[i] === row[i+1]){
            //double the first element
            row[i] *= 2;
            // and setting the second one to zero
            row[i+1] = 0;

            //logic for scoring
            score += row[i];
        } // [2,2,2] -> [4,2]
    }
    row = filterZero(row);

    while(row.length < columns){
        row.push(0);
    }
    return row;
}

function slideLeft(){
    for(let r = 0; r < rows; r++){
        let row = board[r];


        //store of the original row.
        let originalRow = row.slice(); 

        row = slide(row);

        //updating the value in the board
        board[r] = row;

        //update id of tile and the appearance
        for(let c = 0; c<columns; c++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());

            let num = board[r][c];

            // line for the animation
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = 'slide-from-right 0.3s';
                
                setTimeout(() => {
                    tile.style.animation = "";
                },300)
            }

            updateTile(tile,num);
        }
    }
}

function slideRight(){
    for(let r = 0; r < rows; r++){
        let row = board[r];

        let originalRow = row.slice();
        //reverse the order of the row, mirrored version of slide left.
        row.reverse();

        //call the slide function to merge similar tiles.
        row = slide(row);

        row.reverse();

        //updating the value in the board
        board[r] = row;

        //update id of tile and the appearance
        for(let c = 0; c<columns; c++){
            let tile = document.getElementById(r.toString() + '-' + c.toString());

            let num = board[r][c];

            // line for the animation
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = 'slide-from-left 0.3s';
                
                setTimeout(() => {
                    tile.style.animation = "";
                },300)
            }

            updateTile(tile,num);
        }
    }
}

function slideUp(){
    for(let c = 0; c < columns; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        // for the animation
        let originalRow = row.slice();
        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        // check which tile have changed in column
        let changedIndices = [];

        for(let r = 0; r < rows; r++){

            //this will record the current position of tiles that have changed.
            if(originalRow[r] !== row[r]){
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = 'slide-from-bottom 0.3s'

                setTimeout(()=>{
                    tile.style.animation = '';
                }, 300)
            }
            updateTile(tile, num)
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] 

        //for animation
        let originalRow = row.slice();
        row.reverse();      
        row = slide(row);  
        row.reverse();      
        

        // check which tile have changed in column
        let changedIndices = [];

        for(let r = 0; r < rows; r++){

            //this will record the current position of tiles that have changed.
            if(originalRow[r] !== row[r]){
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if(changedIndices.includes(r) && num !== 0){
                tile.style.animation = 'slide-from-top 0.3s'

                setTimeout(()=>{
                    tile.style.animation = '';
                }, 300)
            }
            updateTile(tile, num)
        }
    }
}


function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c< columns; c++){
            //check if current tile is zero

            if(board[r][c] === 0){
                return true;
            }
        }
    }
    //there is no tile with 0 value
    return false;
}


// create a function that will add new random 'r' tile in the game board

function setTwo(){
    if(!hasEmptyTile()){
        return;
    }

    //declare a value if zero tile is found
    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        //check if the position (r,c) in the gameboard is empty
        if (board[r][c] === 0){
            board[r][c] = 2;

            let tile = document.getElementById(r.toString() + '-' + c.toString());

            tile.innerText = '2';
            tile.classList.add('x2');

            // empty tile found and skip the loop
            found = true;
        }
    }
}

function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;  // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }

    score = 0; //reset score to 0
    setTwo() ;   // new tile   
}


//mobile compatibility

//capture the coordinates of the touch input
document.addEventListener('touchstart', (param) => {
    startX = param.touches[0].clientX;
    startY = param.touches[0].clientY;
});

//prevent scrolling
document.addEventListener('touchmove', (param) =>{
    if (!param.target.className.includes('tile')){
        return
    }

    param.preventDefault();

}, {passive: false});


document.addEventListener('touchend', (param) => {
    // check if the element triggered the event 

    if(!param.target.className.includes('tile')){
        return // exit the function
    }

    //calculate the horizontal and vertical difference

    let diffX = startX - param.changedTouches[0].clientX;
    let diffY = startY - param.changedTouches[0].clientY;

    //check if the horizontal swipe is greater magnitude that the veritical swipe

    if(Math.abs(diffX) > Math.abs(diffY)){
        //horizontal swipe
        if(diffX > 0){
            slideLeft();
            setTwo();
        }else{
            slideRight();
            setTwo();
        }
    }else{
        //vertical swipe
        if(diffY > 0){
            slideUp();
            setTwo();
        }else{
            slideDown();
            setTwo();
        }
    }

    document.querySelector('.score').innerHTML = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }

});




