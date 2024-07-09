//board

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird

let birdWidth = 34;
let birdHeight = 24;

let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

// bird object
let bird = {
    x : birdX,
    y : birdY, 
    width : birdWidth,
    height : birdHeight
}

//pipes 

let pipeArray = [];
let pipeWidth = 64; // actual imge w: 384 h: 3072 ratio : 1/8
let pipeHeight = 512;

let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//moving the pipes

let velocityX = -2; // pipes moving to left
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;

let score = 0;

window.onload = function()
{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d") // to draw on board

    // draw flappy bird
    /*context.fillStyle = "black";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);*/

    //load bird img
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(update);

    //every 1500 sec call placepipes function
    setInterval(placePipes, 1500);

    document.addEventListener("keydown", moveBird);

}

function update() {
    requestAnimationFrame(update);

    if(gameOver) return;


    //clear previous frames
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;

    /* apply gravity to current bird.y, and limit the  bird.y to top of canvas */ 
    bird.y = Math.max(bird.y + velocityY, 0);


    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);


    //if you touched the top of canvas game is over
    if(bird.y > board.height) gameOver = true;

    // show pipes on updated canvas

    for(let i =0; i<pipeArray.length; i++)
        {
            let pipe = pipeArray[i];
            pipe.x += velocityX;

            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if(!pipe.passed && bird.x > pipe.x + pipe.width)
            {
                score += 0.5; // 0.5 because there are two pipes
                pipe.passed = true;
            }

            if(detectCollisions(bird, pipe)) gameOver = true;
        }

        //clear pipes that has gone beyond left canvas has to be deleted to reduce memory issues
        while(pipeArray.length && pipeArray[0].x < 0 - pipeWidth)
            {
                pipeArray.shift(); // removes first element from array

            } 

        //score
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);

        if(gameOver)
        {
            context.fillText("Game Over !!", 10, 80);
        }

}


function placePipes() {

    if(gameOver) return;

    //Math.random() return value between 0 - 1 and we multiply it with pipeHeight/2

    /*  if returns 0 then ->  randomPipeY = pipeY -128 - 0 
        if returns 1  then randomPipey = pipeY - 128 - (1 * 256)  */  
        
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);

    let openingSpace = board.height/4;

    // top pipe
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        //passed will make sure that new pipe loads once bird passes it
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe);

}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX")
        {
            //jump
            velocityY = -6;
        }

        // reset game
        if(gameOver)
        {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
}


function detectCollisions(a, b)
{
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}