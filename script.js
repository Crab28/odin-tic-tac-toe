const GameAI = (() => {
    let playerTurn = 1;
    let matchStatus = false; // true if match is in progress
    let players = [];

    const setPlayer = newPlayer => {
        players.push(newPlayer);
    }

    const getPlayer = playerNumber => {
        return players[playerNumber];
    }

    const startGame = () => {
        if (!matchStatus) {
            matchStatus = true;
            playerTurn = 1;
            Gameboard.restartGame();
            GameInterface.announcePlayer(players[playerTurn - 1].getPlayerName());
        }
    }

    const getMatchStatus = () => {
        return matchStatus;
    }

    const getPlayerTurn = () => {
        return playerTurn;
    }

    const nextPlayerTurn = () => {
        if (matchStatus) {
            playerTurn += 1;
            if (playerTurn > 2) {
                playerTurn = 1;
            }
    
            GameInterface.announcePlayer(players[playerTurn - 1].getPlayerName());
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
        matchStatus = false;
        winnerNumber = winner === 'O' ? 1 : 2;
        GameInterface.announceGame(getPlayer(winnerNumber - 1).getPlayerName());
    }

    const declareDraw = () => {
        matchStatus = false;
        GameInterface.announceGame("It's a Draw! Nobody ");
    }
    

    const checkForWinner = gameboard => {
        let winner = null;
        let draw = false;

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

            for (let cell = 0; cell < gameboard.length; cell++) {
                draw = true;

                if (gameboard[cell] === '') {
                    draw = false;
                    break;
                }
            }

            break;
        }

        if (winner) {
            declareWinner(winner);
        } else if (draw === true) {
            declareDraw();
        };

        nextPlayerTurn();
    }

    return { getPlayerTurn, checkForWinner, getMatchStatus, startGame, setPlayer, getPlayer }
})();

const Gameboard = (() => {
    let initialStart = true;
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

        if (initialStart) {
            initialStart = false;
        } else {
            GameAI.checkForWinner(gameboard);
        }
    }

    const removeAllPiecesOnBoard = () => {
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = '';
        }
    }

    const restartGame = () => {
        initialStart = true;
        gameboard = ['', '', '', '', '', '', '', '', ''];
        for (let i = 0; i < 9; i++) {
            cells[i].classList.remove('marked');
            cells[i].classList.remove('o-cell');
            cells[i].classList.remove('x-cell');
        }
        refreshBoard();
    }

    return { addPiece, getCells, restartGame }

})();

const GameInterface = (() => {
    const startBtn = document.getElementById('start-btn');
    const announcer = document.getElementById('announcer');

    const initializeInterface = () => {
        initializeNameButtons();
        initializeStartButton();
    }

    const initializeNameButtons = () => {
        const nameButtons = document.getElementsByClassName('name-btn');
        const confirmButtons = document.getElementsByClassName('confirm-btn');
        const playerNames = document.getElementsByClassName('player-name');
        const namePrompts = document.getElementsByClassName('name-prompt');
        const playerInputs = document.getElementsByClassName('player-input');

        for (let i = 0; i < nameButtons.length; i++) {
            nameButtons[i].addEventListener('click', () => {
                toggleHiddenNames(nameButtons[i], namePrompts[i], playerNames[i]);
            });
        }

        for (let i = 0; i < confirmButtons.length; i++) {
            confirmButtons[i].addEventListener('click', () => {
                toggleHiddenNames(nameButtons[i], namePrompts[i], playerNames[i]);
                if (playerInputs[i].value !== '') {
                    playerNames[i].textContent = playerInputs[i].value;
                    GameAI.getPlayer(i).setPlayerName(playerInputs[i].value);
                    playerInputs[i].value = '';
                }
            });
        }

        for (let i = 0; i < playerInputs.length; i++) {
            playerInputs[i].addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    toggleHiddenNames(nameButtons[i], namePrompts[i], playerNames[i]);
                    if (playerInputs[i].value !== '') {
                        playerNames[i].textContent = playerInputs[i].value;
                        GameAI.getPlayer(i).setPlayerName(playerInputs[i].value);
                        playerInputs[i].value = '';
                    }
                }
            });
        }
    }

    const toggleHiddenNames = (nameBtn, namePrompt, playerName) => {
        nameBtn.classList.toggle('hide-name');
        namePrompt.classList.toggle('hide-name');
        playerName.classList.toggle('hide-name');
    }

    const initializeStartButton = () => {
        startBtn.addEventListener('click', () => {
            GameAI.startGame();
            toggleStartButton();
        })
    }

    const toggleStartButton = () => {
        startBtn.disabled = !startBtn.disabled;
    }

    const announcePlayer = player => {
        displayMessage(player + "'s Turn!")
    }

    const announceGame = winner => {
        displayMessage(winner + ' Wins!')
        toggleStartButton();
    }

    const displayMessage = message => {
        announcer.textContent = message;
    }

    return { initializeInterface, toggleStartButton, announcePlayer, announceGame }
})();

const Player = name => {
    let playerName = name;

    const getPlayerName = () => {
        return playerName;
    }

    const setPlayerName = newName => {
        playerName = newName;
    }

    return { getPlayerName, setPlayerName }
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

function createPlayers() {
    GameAI.setPlayer(Player('Player One'));
    GameAI.setPlayer(Player('Player Two'));
}

function initializeGame() {
    addCellListeners(Gameboard.getCells());
    GameInterface.initializeInterface();
    createPlayers();
}

initializeGame();