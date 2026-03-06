// =========================
// VARIABLES PRINCIPALES
// =========================
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const diffSelect = document.getElementById("difficulty");
const resetBtn = document.getElementById("reset");

// SONIDOS
const winSound = new Audio("sound/Win.mp4");
const loseSound = new Audio("sound/Lose.mp4");

let board = ["","","","","","","","",""];
let gameOver = false;

// Probabilidades de fallo por dificultad
const failRates = {
    easy: 0.40,
    normal: 0.10,
    hard: 0.01
};

// =========================
// CONTADORES INTERNOS
// =========================
let playerWins = 0;
let aiWins = 0;

// Sistema de ayuda en difícil
let lossesSinceHelp = 0;
let helpStage = 0;
let nextHelpThreshold = 10;

// =========================
// CALCULAR NUEVO INTERVALO
// =========================
function updateHelpThreshold(){
    if(helpStage === 0){
        nextHelpThreshold = 10;
    } else if(helpStage === 1){
        nextHelpThreshold = 7;
    } else {
        nextHelpThreshold = Math.floor(Math.random() * 7) + 9;
    }
}

// =========================
// CREAR TABLERO
// =========================
function createBoard(){
    boardEl.innerHTML = "";

    for(let i=0;i<9;i++){
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;

        // CLICK PC
        cell.onclick = () => playerMove(i);

        // TOUCH TELEFONO
        cell.addEventListener("touchstart", () => playerMove(i));

        boardEl.appendChild(cell);
    }
}

// =========================
// RENDER (IMÁGENES)
// =========================
function render(){

    document.querySelectorAll(".cell").forEach((c,i)=>{

        if(board[i] === "X"){
            c.innerHTML = '<img src="img/x.png" class="pieza">';
        }
        else if(board[i] === "O"){
            c.innerHTML = '<img src="img/o.png" class="pieza">';
        }
        else{
            c.innerHTML = "";
        }

        c.classList.toggle("filled", board[i] !== "");

    });

}

// =========================
// MOVIMIENTO DEL JUGADOR
// =========================
function playerMove(i){

    if(gameOver || board[i] !== "") return;

    board[i] = "X";
    render();

    if(checkWin("X")){

        playerWins++;

        statusEl.textContent = "Ganaste 😎";
        gameOver = true;

        winSound.currentTime = 0;
        winSound.play();

        setTimeout(resetGame,1200);
        return;
    }

    if(isFull()){
        statusEl.textContent = "Empate";
        gameOver = true;

        setTimeout(resetGame,2000);
        return;
    }

    statusEl.textContent = "IA pensando...";
    setTimeout(aiMove,300);
}

// =========================
// MOVIMIENTO IA
// =========================
function aiMove(){

    let allowPlayerWin = false;

    if(diffSelect.value === "hard"){

        if(lossesSinceHelp >= nextHelpThreshold){

            allowPlayerWin = true;

            lossesSinceHelp = 0;
            helpStage++;

            updateHelpThreshold();
        }
    }

    if(allowPlayerWin){

        let empty = board
        .map((v,i)=> v === "" ? i : null)
        .filter(v => v !== null);

        let move = empty[Math.floor(Math.random() * empty.length)];

        board[move] = "O";
        render();

        statusEl.textContent = "Tu turno";
        return;
    }

    const difficulty = diffSelect.value;
    const failChance = failRates[difficulty];

    let move;

    if(Math.random() < failChance){

        let empty = board
        .map((v,i)=> v === "" ? i : null)
        .filter(v => v !== null);

        move = empty[Math.floor(Math.random() * empty.length)];

    }
    else{

        let bestScore = -Infinity;

        for(let i=0;i<9;i++){

            if(board[i] === ""){

                board[i] = "O";
                let score = minimax(board,0,false);
                board[i] = "";

                if(score > bestScore){
                    bestScore = score;
                    move = i;
                }
            }
        }
    }

    board[move] = "O";
    render();

    if(checkWin("O")){

        aiWins++;
        lossesSinceHelp++;

        statusEl.textContent = "La IA te ganó 😈";
        gameOver = true;

        loseSound.currentTime = 0;
        loseSound.play();

        setTimeout(resetGame,1200);
        return;
    }

    if(isFull()){
        statusEl.textContent = "Empate";
        gameOver = true;

        setTimeout(resetGame,1200);
        return;
    }

    statusEl.textContent = "Tu turno";
}

// =========================
// MINIMAX
// =========================
function minimax(state, depth, isMax){

    if(checkWin("O")) return 10 - depth;
    if(checkWin("X")) return depth - 10;
    if(isFull()) return 0;

    if(isMax){

        let best = -Infinity;

        for(let i=0;i<9;i++){
            if(state[i] === ""){

                state[i] = "O";
                best = Math.max(best, minimax(state, depth + 1, false));
                state[i] = "";
            }
        }

        return best;
    }
    else{

        let best = Infinity;

        for(let i=0;i<9;i++){
            if(state[i] === ""){

                state[i] = "X";
                best = Math.min(best, minimax(state, depth + 1, true));
                state[i] = "";
            }
        }

        return best;
    }
}

// =========================
// CHECK WIN
// =========================
function checkWin(p){

    const w = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return w.some(c => c.every(i => board[i] === p));
}

// =========================
// TABLERO LLENO
// =========================
function isFull(){
    return board.every(c => c !== "");
}

// =========================
// RESET AUTOMÁTICO
// =========================
function resetGame(){

    board = ["","","","","","","","",""];
    gameOver = false;

    statusEl.textContent = "Tu turno";
    render();
}

// =========================
// BOTÓN RESET
// =========================
resetBtn.onclick = () => {

    board = ["","","","","","","","",""];
    gameOver = false;

    statusEl.textContent = "Tu turno";
    render();
};

// =========================
// INICIO
// =========================
createBoard();
render();
