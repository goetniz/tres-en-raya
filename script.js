const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const difficultyEl = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

const human = "X";
const cpu = "O";

// Probabilidades (modo trampa)
const difficultyMap = {
    easy: 0.40,     // 40% falla
    normal: 0.10,   // 10% falla
    hard: 0.01      // 1% falla
};

// Construir tablero
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    boardEl.appendChild(cell);

    cell.addEventListener("click", () => {
        if (gameOver || board[i] !== "") return;
        move(i, human);
        if (!gameOver) cpuMove();
    });
}

function move(index, player) {
    if (board[index] !== "") return;
    board[index] = player;
    render();
    checkWinner();
}

function render() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.textContent = board[i];
        c.classList.remove("filled");
        if (board[i] !== "") c.classList.add("filled");
    });
}

function checkWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8], // filas
        [0,3,6],[1,4,7],[2,5,8], // columnas
        [0,4,8],[2,4,6]          // diagonales
    ];

    for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            gameOver = true;
            statusEl.textContent = board[a] + " gana!";
            return;
        }
    }

    if (!board.includes("")) {
        gameOver = true;
        statusEl.textContent = "Empate!";
    }
}

// CPU inteligente pero con trampa
function cpuMove() {
    let diffValue = difficultyMap[difficultyEl.value]; // porcentaje de fallo

    // ¿CPU SE EQUIVOCA?
    let random = Math.random();

    let index;

    if (random < diffValue) {
        // FALLA ADREDE — elige al azar
        let available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        index = available[Math.floor(Math.random() * available.length)];
    } else {
        // MOVE PERFECTO (MINIMAX)
        index = bestMove();
    }

    move(index, cpu);
}

function bestMove() {
    let bestScore = -Infinity;
    let moveIndex;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = cpu;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                moveIndex = i;
            }
        }
    }

    return moveIndex;
}

function minimax(newBoard, depth, isMaximizing) {
    let result = checkMinimaxWinner(newBoard);
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = cpu;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = human;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkMinimaxWinner(b) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (const [a,b,c] of wins) {
        if (b[a] && b[a] === b[b] && b[b] === b[c]) {
            return b[a] === cpu ? 10 : -10;
        }
    }

    if (!b.includes("")) return 0;
    return null;
}

// Reiniciar
resetBtn.addEventListener("click", reset);

function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    statusEl.textContent = "";
    render();
}

render();
