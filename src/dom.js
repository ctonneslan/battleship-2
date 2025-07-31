import Game from "./game";

export default function DOMController() {
  const game = Game();

  const playerBoardEl = document.getElementById("player-board");
  const computerBoardEl = document.getElementById("computer-board");
  const statusEl = document.getElementById("status");

  let isPlacing = true;
  let shipsToPlace = [5, 4, 3, 3, 2];
  let isHorizontal = true;

  const rotateBtn = document.getElementById("rotate");
  rotateBtn.addEventListener("click", () => {
    isHorizontal = !isHorizontal;
    rotateBtn.textContent = `Rotate (Current: ${
      isHorizontal ? "Horizontal" : "Vertical"
    })`;
  });

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

        if (!isComputer && isPlacing) {
          cell.addEventListener("click", () => handleShipPlacement(x, y));
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

  function handleShipPlacement(x, y) {
    const length = shipsToPlace[0];
    const placed = game.human.board.placeShip(x, y, length, isHorizontal);

    if (placed) {
      shipsToPlace.shift();
      renderBoards();

      if (shipsToPlace.length === 0) {
        isPlacing = false;
        statusEl.textContent = "Start attacking the enemy!";
        setupComputerBoard();
      }
    } else {
      statusEl.textContent = "Invalid placement. Try again.";
    }
  }

  function setupComputerBoard() {
    const lengths = [5, 4, 3, 3, 2];

    lengths.forEach((len) => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const dir = Math.random() > 0.5;
        placed = game.computer.board.placeShip(x, y, len, dir);
      }
    });

    renderBoards();
  }

  function disableBoard() {
    const cells = computerBoardEl.querySelectorAll(".cell");
    cells.forEach((cell) => {
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);
    });
  }

  function start() {
    statusEl.textContent = "Place your ships!";
    renderBoards();
  }

  return { start };
}
