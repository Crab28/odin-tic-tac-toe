const Gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];
    const cells = document.getElementsByClassName('board-cell');

    const getCells = () => {
        return cells;
    }

    const addPiece = (piece, index) => {
        gameboard[index] = piece;

        refreshBoardPieces();
    }

    const refreshBoardPieces = () => {
        removeAllPiecesOnBoard();

        gameboard.forEach((boardPiece, i) => {
            cells[i].textContent = boardPiece;
        });
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
                console.log('works');
                Gameboard.addPiece('O', i);
                cells[i].classList.add('marked');
            }
        });
    }
}

function initializeGame() {
    addCellListeners(Gameboard.getCells());
}

initializeGame();