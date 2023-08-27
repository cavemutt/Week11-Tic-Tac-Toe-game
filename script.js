// prevent text/element highlighting, copying
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false)

// can't just call a bootstrap modal like this, needs syntax below
// const modal = document.querySelector('#winner-modal')
const modal = new bootstrap.Modal(document.getElementById('winner-modal'), {
    focus: true
  });
const modalH2 = document.querySelector('#modal-h2') 
const playAgainBtn = document.querySelector('#play-again-btn')

// Game global variables 
const cells = document.querySelectorAll('.cell')
const turnText = document.querySelector('#status-text')
const restartBtn = document.querySelector('#restart-btn')
// establish what a win is
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], 
    [0, 4, 8],
    [2, 4, 6]
]

const player1 = "X"
const player2 = "O"
// find all possible moves (empty cells)
let turnOptions = ["","","","","","","","",""]

// control who's turn it currently is
let currentPlayer;

// make variable to control when game play is allowed 
let isGameRunning = false
// console.log(turnOptions)

// start the game right away
startGame()

// set up what happens at beginning of game
function startGame() {
    currentPlayer = player1
    cells.forEach(cell => cell.addEventListener('click', cellClicked))
    restartBtn.addEventListener('click', resetGame)
    turnText.textContent = `${currentPlayer}'s turn`
    isGameRunning = true
}

// what happens whenever a cell is clicked
function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex")
    // console.log(cellIndex)
    // if cell already has something in it or if the game is not running
    if(turnOptions[cellIndex] != "" || !isGameRunning) {
        return
    }
    updateCell(this, cellIndex)
    checkWinner()
}

// what to put in the cell when it's clicked
function updateCell(cell, index) {
    turnOptions[index] = currentPlayer;
    cell.textContent = currentPlayer;
    // console.log('cell')
    // console.log(turnOptions)
}

// player will change after checking if there's a winner
function changePlayer() {
    currentPlayer = (currentPlayer == player1) ? player2 : player1
    turnText.textContent = `${currentPlayer}'s turn`;
    if(currentPlayer == player2) {
        // console.log("player2")
        setTimeout(() => {
            player2Move()
        }, 500)
    }
}

// make an AU for player 2 : "Artificial Unintelligence"
function player2Move () {
    let possibleMoves = []
    turnOptions.forEach((option, i) => {
        if(option == "") {
            possibleMoves.push(i)
        }
    })
    // console.log(possibleMoves)
    let random = Math.floor(Math.random() * possibleMoves.length)
    // console.log(possibleMoves[random])
    cells[possibleMoves[random]].click()
// I might continue trying to get the minimax algorithm to work
    // minimaxTurn(possibleMoves, currentPlayer)
}

// check for a winner or a tie, continue game if none
function checkWinner() {
    let roundWon = false
    for(let i = 0; i < winningCombos.length; i++) {
        const condition = winningCombos[i]
        const cell1 = turnOptions[condition[0]]
        const cell2 = turnOptions[condition[1]]
        const cell3 = turnOptions[condition[2]]

        if(cell1 == "" || cell2 == "" || cell3 == "") {
            continue;
        }
        if(cell1 == cell2 && cell2 == cell3) {
            roundWon = true;
            break;
        }

    }
    if(roundWon) {
        modalH2.textContent = `${currentPlayer} wins!`
        turnText.textContent = `${currentPlayer} wins!`
        isGameRunning = false;
        modal.show()
        // event listener for modal play again button
        playAgainBtn.addEventListener("click", resetGame)
    } else if(!turnOptions.includes("")) {
        modalH2.textContent = `It's a Draw!`
        turnText.textContent = `It's a Draw!`
        isGameRunning = false
        modal.show()
        // event listener for modal play again button
        playAgainBtn.addEventListener("click", resetGame)
    } else {
        changePlayer()
    }

}

// reset everything when appropriate button is pressed
function resetGame() {
    currentPlayer = player1
    turnOptions = ["","","","","","","","",""]
    turnText.textContent = `${currentPlayer}'s turn`
    cells.forEach(cell => cell.textContent = "")
    modal.hide()
    isGameRunning = true
}


