const GameAI = (() => {
    let playerTurn = 1;
    let matchStatus = true; // true if match is in progress

    const getMatchStatus = () => {
        return matchStatus;
    }

    const getPlayerTurn = () => {
        return playerTurn;
    }

    const nextPlayerTurn = () => {
        playerTurn += 1;
        if (playerTurn > 2) {
            playerTurn = 1;
        }
    }

    const checkLineEqual = line => {
        if (line[0] === line[1] && line[0] === line[2]) {
            if (line[0] !== '') {
                return true;
            }
        }

        return false;
    }

    const declareWinner = winner => {
        console.log(winner);
        matchStatus = false;
    }
    

    const checkForWinner = gameboard => {
        let winner = null;

        while(!winner) {
            // for loop that loops through all the rows
            for (let row = 0; row < 3; row++) {
                let lineCells = [];

                for (let cell = 0; cell < 3; cell++) {
                    lineCells.push(gameboard[cell + (row * 3)]);
                }

                if (lineCells.length === 3 && checkLineEqual(lineCells)) {
                    winner = lineCells[0];
                    break;
                }
            }

            // for loop that loops through all the columns
            for (let col = 0; col < 3; col++) {
                let lineCells = [];

                for (let cell = 0; cell < 3; cell++) {
                    lineCells.push(gameboard[col + (cell * 3)]);
                }

                if (lineCells.length === 3 && checkLineEqual(lineCells)) {
                    winner = lineCells[0];
                    break;
                }
            }

            // checks diagnol lines
            if (checkLineEqual([gameboard[0], gameboard[4], gameboard[8]]) || checkLineEqual([gameboard[2], gameboard[4], gameboard[6]])) {
                winner = gameboard[4];
                break;
            }

            break;
        }
        
        if (winner) {
            declareWinner(winner);
        };

        nextPlayerTurn();
    }

    return { getPlayerTurn, checkForWinner, getMatchStatus }
})();

const Gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', ''];
    const cells = document.getElementsByClassName('board-cell');

    const getCells = () => {
        return cells;
    }

    const addPiece = (piece, index) => {
        if (GameAI.getMatchStatus()) {
            gameboard[index] = piece;

            refreshBoard();
        }
    }

    const refreshBoard = () => {
        removeAllPiecesOnBoard();

        gameboard.forEach((boardPiece, i) => {
            cells[i].textContent = boardPiece;
        });

        GameAI.checkForWinner(gameboard);
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