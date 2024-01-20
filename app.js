//Variables
const board = document.getElementById("board")
const playBtn = document.getElementById("play")
const resetBtn = document.getElementById("reset")
const modal = document.getElementById("modal"); 

let rows = 9
let columns = 9
let minesNumber = 10
let gameArray = []
let minesPositions = []
let firstClick = true


//Lógica juego 

function createGameArray(rows, columns, minesNumber) {

    for (let i = 0; i < rows; i++) {
        let fila = []
        for (let j = 0; j < columns; j++) {
            fila.push(0)
        }

        gameArray.push(fila)
    }


    let mines = 0

    while (mines < minesNumber) {
        let x = Math.floor(Math.random() * rows)
        let y = Math.floor(Math.random() * columns)

        if (gameArray[x][y] == 0) {
            gameArray[x][y] = "💣"
            minesPositions.push([x, y])
            mines++
        }
    }

    addNumbers()

}

function addNumbers() {
    minesPositions.forEach((mine) => {
        let mineX = mine[0]
        let mineY = mine[1]

        for (let i = Math.max(0, mineX - 1); i <= Math.min(rows - 1, mineX + 1); i++) {
            for (let j = Math.max(0, mineY - 1); j <= Math.min(columns - 1, mineY + 1); j++) {
                if (i !== mineX || j !== mineY) {
                    if (gameArray[i][j] !== "💣") {
                        gameArray[i][j] = Number(gameArray[i][j]) + 1;
                    }
                }
            }
        }

    })
}

function createBoard(rows, columns) {

    board.style.display = "grid";
    board.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement("div")
            const cover = document.createElement("div")
            const span = document.createElement("span")

            cell.id = `${i},${j}`
            cell.className = "cell"
            cover.className = "cover"
            cover.id = `${i}-${j}`;

            cell.appendChild(span)
            cell.appendChild(cover)
            board.appendChild(cell)
        }
    }

    [...document.querySelectorAll(".cover")].forEach((cover) => {
        cover.addEventListener("click", (e) => {
            let [x, y] = e.target.id.split("-")

            revealEmptyCells(parseInt(x), parseInt(y))

            if(checkWin()) {
                console.log("jkljkljkjkjkl")
                document.querySelector("#winText").style.display = "block"
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
                //Terminar partida mostrando las bombas y no dejando pulsar 

            }

        })
    });


    [...document.querySelectorAll(".cover")].forEach((cover) => {
        cover.addEventListener("contextmenu", (e) => {
            e.preventDefault()

            if (e.target.innerHTML == "🚩") {
                e.target.innerHTML = ""
            } else {
                e.target.innerHTML = "🚩"
            }


        })
    });

}



function revealEmptyCells(x, y) {

    // Verificar límites del tablero
    if (x < 0 || x >= rows || y < 0 || y >= columns) {
        return;
    }

    // Si la casilla ya fue revelada, no hacer nada
    const cell = document.getElementById(`${x},${y}`);
    const span = cell.querySelector("span");

    if (cell.classList.contains("revealed")) {
        return;
    }

    // Revelar la casilla actual
    cell.classList.add("revealed");

    // Si es una casilla vacía, continuar revelando en las direcciones adyacentes
    if (gameArray[x][y] === 0) {
        for (let i = Math.max(0, x - 1); i <= Math.min(rows - 1, x + 1); i++) {
            for (let j = Math.max(0, y - 1); j <= Math.min(columns - 1, y + 1); j++) {
                revealEmptyCells(i, j);
            }
        }
    }

    // Si es un número mayor a cero, mostrar el número
    if (gameArray[x][y] == 0) {
        span.innerText = " ";
    }

    if (gameArray[x][y] == 1) {
        span.innerText = 1;
        span.style.color = "blue"
    }

    if (gameArray[x][y] == 2) {
        span.innerText = 2;
        span.style.color = "green"
    }

    if (gameArray[x][y] == 3) {
        span.innerText = 3;
        span.style.color = "red"
    }

    if (gameArray[x][y] >= 4) {
        span.innerText = gameArray[x][y];
        span.style.color = "purple"
    }

    if (gameArray[x][y] == "💣") {
        span.innerText = gameArray[x][y] = "💥"
        gameOver()
    }

}


function gameOver() {
    let h3 = document.querySelector("#looseText");
    h3.style.display = "block";
}


function checkWin() {

    let revealedCells = [...document.querySelectorAll(".cell.revealed")].length
    
    if((revealedCells + minesNumber) === rows*columns) {
        return true; 
    }

    return false
}


playBtn.addEventListener("click", () => {
    const input = document.querySelector("input:checked");
    playBtn.style.display = "none";
    resetBtn.style.display = "block"
    modal.style.display = "none"; 

    if(Number(input.value) == 9) {
        board.classList.add("nine");
        rows = 9;
        columns = 9; 
        minesNumber = 10; 
    }

    if(Number(input.value) == 16) {
        board.classList.add("sixteen");
        rows = 16; 
        columns = 16;
        minesNumber = 40; 
    }

    createGameArray(rows, columns, minesNumber)
    createBoard(rows, columns)  
})

resetBtn.addEventListener("click", () => {
    gameArray = []
    board.innerHTML = ""
    minesPositions = []
    document.querySelector("#looseText").style.display = "none"
    document.querySelector("#winText").style.display = "none"
    createGameArray(rows, columns, minesNumber)
    createBoard(rows, columns)
})


