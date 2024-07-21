const cells = document.querySelectorAll('[data-cell]');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const doublePlayerBtn = document.getElementById('doublePlayerBtn');
const resetBtn = document.getElementById('resetBtn');
const humanFirstBtn = document.getElementById('humanFirstBtn');
const computerFirstBtn = document.getElementById('computerFirstBtn');
const singlePlayerOptions = document.getElementById('singlePlayerOptions');
const resultMessage = document.getElementById('resultMessage');
const themeToggleBtn = document.getElementById('themeToggleBtn');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isSinglePlayer = false;
let isGameOver = false;
let computerStarts = false;




// Theme toggle button event listener
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});


const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

highlightOption(doublePlayerBtn);

singlePlayerBtn.addEventListener('click', () => {
    if (isSinglePlayer) return;
    isSinglePlayer = true;
    singlePlayerOptions.style.display = 'flex';
    resetHighlights();
    highlightOption(humanFirstBtn);
    currentPlayer = 'X';
    computerStarts = false;
    resetGame();
});

doublePlayerBtn.addEventListener('click', () => {
    if (!isSinglePlayer) return;
    isSinglePlayer = false;
    singlePlayerOptions.style.display = 'none';
    resetHighlights();
    highlightOption(doublePlayerBtn);
    resetGame();
});

resetBtn.addEventListener('click', resetGame);

humanFirstBtn.addEventListener('click', () => {
    if (!isSinglePlayer || !computerStarts) return;
    currentPlayer = 'X';
    computerStarts = false;
    highlightOption(humanFirstBtn);
    resetGame();
});

computerFirstBtn.addEventListener('click', () => {
    if (!isSinglePlayer || computerStarts) return;
    currentPlayer = 'O';
    computerStarts = true;
    highlightOption(computerFirstBtn);
    resetGame();
});

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
    if (isGameOver) return;
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);
    if (board[cellIndex] !== '') return;

    placeMark(cell, currentPlayer);
    board[cellIndex] = currentPlayer;
    const winningCombo = checkWin(currentPlayer);
    if (winningCombo) {
        highlightWinningCells(winningCombo);
        isGameOver = true;
        setTimeout(() => {
            resultMessage.textContent = `${currentPlayer} wins!`;
            waitThenReset();
        }, 100);
    } else if (board.every(cell => cell !== '')) {
        isGameOver = true;
        setTimeout(() => {
            resultMessage.textContent = 'Draw!';
            waitThenReset();
        }, 100);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isSinglePlayer && currentPlayer === 'O') {
            makeBestMove();
        }
    }
}

function placeMark(cell, currentPlayer) {
    cell.textContent = currentPlayer;
}

function checkWin(currentPlayer) {
    return winningCombinations.find(combination => {
        if (combination.every(index => board[index] === currentPlayer)) {
            return combination;
        }
    });
}

function highlightWinningCells(winningCombo) {
    winningCombo.forEach(index => cells[index].classList.add('highlight'));
}

function makeBestMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].removeEventListener('click', handleClick);
    const winningCombo = checkWin('O');
    if (winningCombo) {
        highlightWinningCells(winningCombo);
        isGameOver = true;
        setTimeout(() => {
            resultMessage.textContent = 'O wins!';
            waitThenReset();
        }, 100);
    } else if (board.every(cell => cell !== '')) {
        isGameOver = true;
        setTimeout(() => {
            resultMessage.textContent = 'Draw!';
            waitThenReset();
        }, 100);
    } else {
        currentPlayer = 'X';
    }
}

function waitThenReset() {
    setTimeout(() => {
        resetGame();
    }, 2000); // Wait for 2 seconds before resetting
}

function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}

function resetGame() {
    if (isSinglePlayer) {
        currentPlayer = computerStarts ? 'O' : 'X';
    } else {
        currentPlayer = 'X';
    }
    isGameOver = false;
    board.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        cell.classList.remove('highlight');
    });
    resultMessage.textContent = '';
    if (isSinglePlayer && computerStarts) {
        makeBestMove();
    }
}

function highlightOption(button) {
    resetHighlights();
    button.classList.add('selected');
}

function resetHighlights() {
    singlePlayerBtn.classList.remove('selected');
    doublePlayerBtn.classList.remove('selected');
    humanFirstBtn.classList.remove('selected');
    computerFirstBtn.classList.remove('selected');
}


