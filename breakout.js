//________game variables___________________________________

const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 780;
const boardHeight = 600;

const userStart = [340, 10];
let currentPosition = userStart;

const ballStart = [370, 380];
let ballCurrentPosition = ballStart;
let timeId;
const ballDiameter = 20;
let xDirection = 2;
let yDirection = -2;
let score = 0;

//_________create a new block instance______________________

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//__________all the blocks___________________________________

const blocks = [
  new Block(10, 570),
  new Block(120, 570),
  new Block(230, 570),
  new Block(340, 570),
  new Block(450, 570),
  new Block(560, 570),
  new Block(670, 570),
  new Block(10, 540),
  new Block(120, 540),
  new Block(230, 540),
  new Block(340, 540),
  new Block(450, 540),
  new Block(560, 540),
  new Block(670, 540),
  new Block(10, 510),
  new Block(120, 510),
  new Block(230, 510),
  new Block(340, 510),
  new Block(450, 510),
  new Block(560, 510),
  new Block(670, 510),
  new Block(10, 480),
  new Block(120, 480),
  new Block(230, 480),
  new Block(340, 480),
  new Block(450, 480),
  new Block(560, 480),
  new Block(670, 480),
  new Block(10, 450),
  new Block(120, 450),
  new Block(230, 450),
  new Block(340, 450),
  new Block(450, 450),
  new Block(560, 450),
  new Block(670, 450),
  new Block(10, 420),
  new Block(120, 420),
  new Block(230, 420),
  new Block(340, 420),
  new Block(450, 420),
  new Block(560, 420),
  new Block(670, 420),
];
console.log(blocks);
// ______________draw all blocks____________________________

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.backgroundColor = "white";
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
    if (i < 14) {
      block.style.backgroundColor = "coral";
    } else if ((i >= 14) & (i < 28)) {
      block.style.backgroundColor = "gold";
    } else {
      block.style.backgroundColor = "yellowgreen";
    }
  }
}

addBlocks();

//_______________add user__________________________________

const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

//_______________draw user________________________________

function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

//______________move user using keyboard____________________________________

function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        //prevent board from exiting the game
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        //our anchor point is bottom left
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);



//_______________draw ball__________________________________

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

//__________add ball_________________________________________

const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

//____________move the ball__________________________________

function moveBall() {
  //moving diagonally
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

//_______________start game: mouse move________________________________________

let startGameButton = document.getElementById('start-game')
startGameButton.addEventListener('click', startGame)

function startGame(){
   timeId = setInterval(moveBall, 5);
   document.addEventListener("mousemove", function moveUserMouse(e) {
     currentPosition[0] = e.x;
     drawUser();
   });
   startGameButton.style.display = 'none' 
}

//_____________check for wall collisions_______________________

function checkForCollisions() {
  //_____________check for block collisions_____________________

  for (let i = 0; i < blocks.length; i++) {
    //we gonna check if the ball's position is in between
    //block's width or height
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      //remove the block:
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      //takes all the blocks and puts them into an array
      allBlocks[i].classList.remove("block"); //visually removed
      blocks.splice(i, 1); //remove it from the array completely
      //splice(start, deleteCount)
      changeDirection();
      score++;
      scoreDisplay.innerHTML = `Your score: ${score}`;

      //check for a win
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "You win!!!";
        clearInterval(timeId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  //______________check for wall collisions_____________________________

  if (
    //if ball is inside the board basically
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }

  //_____________check for user collisions________________________________
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  //check for gameover

  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timeId);
    scoreDisplay.innerHTML = `Game Over! Your score: ${score}`;
    document.removeEventListener("keydown", moveUser);
    document.querySelector(".ball").style.backgroundColor = "red";
    //after game over you can't move 
  }
}
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
