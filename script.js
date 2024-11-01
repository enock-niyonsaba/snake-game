const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');
const toggleThemeBtn = document.getElementById('toggleTheme');
const themeIcon =document.getElementById('themeIcon');

const gridSize = 15;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let level = 1;
let speed = 200;

function drawGame() {
    if (!gameRunning) return;

    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
    setTimeout(drawGame, speed);
}

function clearCanvas() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        playEatSound();
        generateFood();
        score += 10;
        levelUp();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#45a049';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
    ctx.fill();
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    gameRunning = false;
    gameOverSound.play();
    startBtn.textContent = 'Restart';
    startBtn.style.display = 'inline-block';
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    speed = 200;
    updateScore();
}

function levelUp() {
    if (score % 30 === 0) {
        level++;
        speed = Math.max(50, speed - 20); // Speed up the game
    }
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && dx !== 1) {
        dx = -1;
        dy = 0;
    }

    if (keyPressed === UP_KEY && dy !== 1) {
        dx = 0;
        dy = -1;
    }

    if (keyPressed === RIGHT_KEY && dx !== -1) {
        dx = 1;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && dy !== -1) {
        dx = 0;
        dy = 1;
    }
}

function changeDirectionByButton(direction) {
    if (direction === 'left' && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (direction === 'up' && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (direction === 'down' && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (direction === 'right' && dx !== -1) {
        dx = 1;
        dy = 0;
    }
}

startBtn.addEventListener('click', () => {
    resetGame();
    gameRunning = true;
    startBtn.style.display = 'none';
    drawGame();
});

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (themeIcon.classList.contains('fa-moon')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.add('fa-moon');
        themeIcon.classList.remove('fa-sun');
    }
});

function playEatSound() {
    eatSound.currentTime = 0; // Reset sound to start
    eatSound.play();
}

clearCanvas();