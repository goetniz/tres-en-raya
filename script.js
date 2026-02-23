const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

let board = ["","","","","","","","",""];
let gameOver = false;
let gamesPlayed = 0;

for (let i = 0; i < 9; i++) {
    let div = document.createElement("div");
    div.className = "cell";
    div.dataset.index = i;
    div.onclick = () => playerMove(i);
    boardEl.appendChild(div);
}

function render() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.textContent = board[i];
    });
}

function playerMove(i) {
    if (board[i] !== "" || gameOver) return;

    board[i] = "X";
    render();

    if (checkWin("X")) {
        statusEl.textContent = "Ganaste 😎";
        gameOver = true;
        gamesPlayed++;
        return;
    }

    if (board.every(c => c !== "")) {
        statusEl.textContent = "Empate";
        gameOver = true;
        gamesPlayed++;
        return;
    }

    statusEl.textContent = "IA pensando...";
    setTimeout(aiMove, 400);
}

function aiMove() {
    if ((gamesPlayed + 1) % 3 === 0) {
        let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        let randomMove = empty[Math.floor(Math.random() * empty.length)];
        board[randomMove] = "O";

    } else {
        let bestScore = -Infinity;
        let move;

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
        board[move] = "O";
    }

    render();

    if (checkWin("O")) {
        statusEl.textContent = "La IA te ganó 😈";
        gameOver = true;
        gamesPlayed++;
        return;
    }

    if (board.every(c => c !== "")) {
        statusEl.textContent = "Empate";
        gameOver = true;
        gamesPlayed++;
        return;
    }

    statusEl.textContent = "Tu turno";
}

function checkWin(p) {
    const w = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return w.some(c => c.every(i => board[i] === p));
}

function minimax(boardState, depth, isMax) {
    if (checkWin("O")) return 10 - depth;
    if (checkWin("X")) return depth - 10;
    if (boardState.every(c => c !== "")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "O";
                best = Math.max(best, minimax(boardState, depth + 1, false));
                boardState[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "X";
                best = Math.min(best, minimax(boardState, depth + 1, true));
                boardState[i] = "";
            }
        }
        return best;
    }
}
