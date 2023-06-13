const GameAI = (() => {
    let playerTurn = 1;

    const getPlayerTurn = () => {
        return playerTurn;
    }

    const nextPlayerTurn = () => {
        playerTurn += 1;
        if (playerTurn > 2) {
            playerTurn = 1;
        }
    }

    const checkForWinner = () => {
        // If not true, next player turn
        nextPlayerTurn();
    }

    return { getPlayerTurn, checkForWinner }
})();

const Gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];
    const cells = document.getElementsByClassName('board-cell');

    const getCells = () => {
        return cells;
    }

    const addPiece = (piece, index) => {
        gameboard[index] = piece;

        refreshBoard();
    }

    const refreshBoard = () => {
        removeAllPiecesOnBoard();

        gameboard.forEach((boardPiece, i) => {
            cells[i].textContent = boardPiece;
        });

        GameAI.checkForWinner();
    }

    const removeAllPiecesOnBoard = () => {
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = '';
        }
    }

    return { addPiece, getCells }

})();

const Player = name => {

}

function addCellListeners(cells) {
    for (let i = 0; i < 9; i++) {
        cells[i].addEventListener('click', () => {
            if (!cells[i].classList.contains('marked')) {
                let playerMarker = GameAI.getPlayerTurn() === 1 ? 'O' : 'X';
                Gameboard.addPiece(playerMarker, i);
                cells[i].classList.add('marked');
                cells[i].classList.add(playerMarker.toLocaleLowerCase() + '-cell')
            }
        });
    }
}

function initializeGame() {
    addCellListeners(Gameboard.getCells());
}

initializeGame();