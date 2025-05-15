"use strict";
let playerNames = { X: "Player X", O: "Player O" };
let playerScores = { X: 0, O: 0 };
let gameStarted = false;
let moveMade = false;
class VanishingTicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.moveHistory = { X: [], O: [] };
    }
    makeMove(index) {
        if (this.board[index] || this.winner)
            return false;
        if (this.moveHistory[this.currentPlayer].length === 3) {
            const oldIndex = this.moveHistory[this.currentPlayer].shift();
            this.board[oldIndex] = null;
        }
        this.board[index] = this.currentPlayer;
        this.moveHistory[this.currentPlayer].push(index);
        moveMade = true;
        this.checkWinner();
        if (!this.winner) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
        return true;
    }
    checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[b] === this.board[c]) {
                this.winner = this.board[a];
                break;
            }
        }
    }
    reset() {
        this.board = Array(9).fill(null);
        this.winner = null;
        this.moveHistory = { X: [], O: [] };
        moveMade = false;
    }
}
const game = new VanishingTicTacToe();
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
function render() {
    boardElement.innerHTML = '';
    const showOldest = document.getElementById('toggle-oldest').checked;
    game.board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = cell || '';
        if (showOldest && cell) {
            const moveList = game.moveHistory[cell];
            if (moveList.length > 0 && moveList[0] === index) {
                cellDiv.classList.add('oldest');
            }
        }
        cellDiv.onclick = () => {
            if (!gameStarted || game.winner)
                return;
            if (game.makeMove(index)) {
                render();
            }
        };
        boardElement.appendChild(cellDiv);
    });
    if (gameStarted && moveMade && game.winner) {
        const modal = document.getElementById('modal');
        const message = document.getElementById('modal-message');
        modal.classList.remove('hidden');
        message.textContent = `🎉 ${playerNames[game.winner]} (${game.winner}) wins!`;
        playerScores[game.winner]++;
        document.getElementById(`score${game.winner}`).textContent = playerScores[game.winner].toString();
    }
    else if (gameStarted) {
        statusElement.textContent = `Current Player: ${playerNames[game.currentPlayer]} (${game.currentPlayer})`;
    }
}
document.getElementById('start-game').addEventListener('click', () => {
    const inputX = document.getElementById('playerX').value.trim();
    const inputO = document.getElementById('playerO').value.trim();
    playerNames.X = inputX || "Player X";
    playerNames.O = inputO || "Player O";
    document.getElementById('nameX').textContent = playerNames.X;
    document.getElementById('nameO').textContent = playerNames.O;
    game.reset();
    gameStarted = true;
    game.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('scoreboard').classList.remove('hidden');
    document.getElementById('modal').classList.add('hidden');
    render();
});
document.getElementById('toggle-oldest').addEventListener('change', () => {
    if (game.winner) {
        game.reset();
    }
    render();
});
document.getElementById('modal-reset').addEventListener('click', () => {
    game.reset();
    game.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    document.getElementById('modal').classList.add('hidden');
    render();
});
document.getElementById('reset-button').addEventListener('click', () => {
    game.reset();
    game.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    document.getElementById('modal').classList.add('hidden');
    render();
});
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
});
