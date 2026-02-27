// =========================
// VARIABLES PRINCIPALES
// =========================
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const diffSelect = document.getElementById("difficulty");
const resetBtn = document.getElementById("reset");

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

// Probabilidades de fallo por dificultad
const failRates = {
    easy: 0.40,   // 40%
    normal: 0.10, // 10%
    hard: 0.01    // 1%
};

// =========================
// CREAR TABLERO
// =========================
function createBoard() {
    boardEl.innerHTML = ""; // limpiar antes

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.onclick = () => playerMove(i);
        boardEl.appendChild(cell);
    }
}

// =========================
// RENDERIZADO
// =========================
function render() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.textContent = board[i];
        c.classList.toggle("filled", board[i] !== "");
    });
}

// =========================
// MOVIMIENTO DEL JUGADOR
// =========================
function playerMove(i) {
    if (gameOver || board[i] !== "") return;

    board[i] = "X";
    render();

    if (checkWin("X")) {
        statusEl.textContent = "Ganaste 😎";
        gameOver = true;
        return;
    }

    if (isFull()) {
        statusEl.textContent = "Empate";
        gameOver = true;
        return;
    }

    statusEl.textContent = "IA pensando...";
    setTimeout(aiMove, 300);
}

// =========================
// MOVIMIENTO IA
// =========================
function aiMove() {
    const difficulty = diffSelect.value;
    const failChance = failRates[difficulty];

    let move;

    // Decidir si falla o no
    if (Math.random() < failChance) {
        // fallo → movimiento aleatorio
        let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = empty[Math.floor(Math.random() * empty.length)];
    } else {
        // IA perfecta usando Minimax
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    }

    board[move] = "O";
    render();

    if (checkWin("O")) {
        statusEl.textContent = "La IA te ganó 😈";
        gameOver = true;
        return;
    }

    if (isFull()) {
        statusEl.textContent = "Empate";
        gameOver = true;
        return;
    }

    statusEl.textContent = "Tu turno";
}

// =========================
// MINIMAX
// =========================
function minimax(state, depth, isMax) {
    if (checkWin("O")) return 10 - depth;
    if (checkWin("X")) return depth - 10;
    if (isFull()) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = "O";
                best = Math.max(best, minimax(state, depth + 1, false));
                state[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (state[i] === "") {
                state[i] = "X";
                best = Math.min(best, minimax(state, depth + 1, true));
                state[i] = "";
            }
        }
        return best;
    }
}

// =========================
// CHECKS
// =========================
function checkWin(p) {
    const w = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return w.some(c => c.every(i => board[i] === p));
}

function isFull() {
    return board.every(c => c !== "");
}

// =========================
// RESET
// =========================
resetBtn.onclick = () => {
    board = ["","","","","","","","",""];
    gameOver = false;
    statusEl.textContent = "Tu turno";
    render();
};

// Crear tablero al iniciar
createBoard();
render();
