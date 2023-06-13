const Gameboard = (() => {
    let gameboard = ['O', '', 'O', 'X', 'X', '', 'O', 'X', 'O'];
    const cells = document.getElementsByClassName('board-cell');

    const addPiece = piece => {
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

    return { addPiece }

})();

const Player = name => {

}

Gameboard.addPiece('x');