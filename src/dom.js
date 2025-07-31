import Game from "./game";

let game = Game();

export default function DOMController() {
  const playerBoardEl = document.getElementById("player-board");
  const computerBoardEl = document.getElementById("computer-board");
  const statusEl = document.getElementById("status");

  statusEl.addEventListener("animationend", () => {
    statusEl.classList.remove("status-valid", "status-invalid");
  });

  const modalOverlay = document.getElementById("modal-overlay");
  const modalMessage = document.getElementById("modal-message");
  const modalRestartBtn = document.getElementById("modal-restart");

  function restartGame() {
    game = Game();
    shipsToPlace = [5, 4, 3, 3, 2];
    isPlacing = true;
    isHorizontal = true;
    statusEl.textContent = "Place your ships!";
    statusEl.className = "";

    playerBoardEl.innerHTML = "";
    computerBoardEl.innerHTML = "";

    renderBoards();
  }

  modalRestartBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
    restartGame();
  });

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

  const restartBtn = document.getElementById("restart");
  restartBtn.addEventListener("click", restartGame);

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
          cell.addEventListener("mouseenter", () => showPreview(x, y));
          cell.addEventListener("mouseleave", clearPreview);
        }

        container.appendChild(cell);
      }
    }
  }

  function handlePlayerAttack(e) {
    if (!isPlacing && !game.isGameOver()) {
      const x = parseInt(e.target.dataset.x);
      const y = parseInt(e.target.dataset.y);
      const result = game.playRound(x, y);
      renderBoards();

      if (game.isGameOver()) {
        const message = game.computer.board.allShipsSunk()
          ? "🎉 You Win!"
          : "💀 You Lose";
        showModal(message);
        return;
      }

      if (!game.isGameOver() && game.computer.isComputer) {
        setTimeout(() => {
          game.playRound();
          renderBoards();

          if (game.isGameOver()) {
            const message = game.human.board.allShipsSunk()
              ? "💀 You Lose"
              : "🎉 You Win!";
            showModal(message);
          }
        }, 500);
      }
    }
  }

  function handleShipPlacement(x, y) {
    const length = shipsToPlace[0];
    const placed = game.human.board.placeShip(x, y, length, isHorizontal);

    if (placed) {
      shipsToPlace.shift();
      updateStatus("Ship placed!", "status-valid");
      renderBoards();

      if (shipsToPlace.length === 0) {
        isPlacing = false;
        updateStatus("Start attacking the enemy!", "status-valid");
        setupComputerBoard();
      }
    } else {
      updateStatus("Invalid placement. Try again.", "status-invalid");
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

  function showPreview(x, y) {
    const length = shipsToPlace[0];
    const cells = [];

    for (let i = 0; i < length; i++) {
      const row = x + (isHorizontal ? 0 : i);
      const col = y + (isHorizontal ? i : 0);

      const cell = document.querySelector(
        `#player-board .cell[data-x="${row}"][data-y="${col}"]`
      );

      if (cell) cells.push(cell);
    }

    const valid = game.human.board.canPlaceShipOnly(x, y, length, isHorizontal);

    if (valid) statusEl.textContent = "";

    cells.forEach((cell) => {
      cell.classList.add("preview");
      if (!valid) cell.classList.add("invalid");
    });
  }

  function clearPreview() {
    document.querySelectorAll(".cell.preview").forEach((cell) => {
      cell.classList.remove("preview", "invalid");
    });
  }

  function updateStatus(message, type) {
    statusEl.classList.add("status-hidden");

    setTimeout(() => {
      statusEl.textContent = message;
      statusEl.className = "";
      statusEl.classList.add(type);
      statusEl.classList.remove("status-hidden");
    }, 150);
  }

  function showModal(message) {
    modalMessage.textContent = message;
    modalOverlay.classList.remove("hidden");
  }

  function start() {
    statusEl.textContent = "Place your ships!";
    renderBoards();
  }

  return { start };
}
