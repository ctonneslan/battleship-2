import Game from "./game";

export default function DOMController() {
  const game = Game();

  const playerBoardEl = document.getElementById("player-board");
  const computerBoardEl = document.getElementById("computer-board");
  const statusEl = document.getElementById("status");

  function renderBoards() {
    renderBoard(game.human.board.board, playerBoardEl, false);
    renderBoard(game.computer.board.board, computerBoardEl, true);
  }

  function renderBoard(board, container, isComputer) {
    container.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        const value = board[x][y];

        if (value === "miss") cell.classList.add("miss");
        else if (value === "hit") cell.classList.add("hit");
        else if (!isComputer && value !== null) cell.classList.add("ship");

        cell.dataset.x = x;
        cell.dataset.y = y;

        if (isComputer && value !== "hit" && value !== "miss") {
          cell.addEventListener("click", handlePlayerAttack);
        }

        container.appendChild(cell);
      }
    }
  }

  function handlePlayerAttack(e) {
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    const result = game.playRound(x, y);

    if (typeof result === "string") {
      statusEl.textContent = result;
      disableBoard();
    }

    renderBoards();

    if (!game.isGameOver() && game.computer.isComputer) {
      setTimeout(() => {
        game.playRound();
        renderBoards();

        if (game.isGameOver()) {
          statusEl.textContent = "Computer wins!";
        }
      }, 500);
    }
  }

  function disableBoard() {
    const cells = computerBoardEl.querySelectorAll(".cell");
    cells.forEach((cell) => {
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);
    });
  }

  function start() {
    game.human.board.placeShip(0, 0, 3);
    game.human.board.placeShip(2, 2, 2, false);
    game.computer.board.placeShip(0, 0, 3);
    game.computer.board.placeShip(2, 2, 2, false);

    renderBoards();
  }

  return { start };
}
