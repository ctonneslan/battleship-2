import Player from "./player";

export default function Game() {
  const human = Player(false);
  const computer = Player(true);

  let currentPlayer = human;
  let opponent = computer;
  let isGameOver = false;

  function switchTurns() {
    [currentPlayer, opponent] = [opponent, currentPlayer];
  }

  function playRound(x, y) {
    if (isGameOver) return;

    const result = currentPlayer.isComputer
      ? currentPlayer.smartAttack(opponent.board)
      : currentPlayer.attack(opponent.board, x, y);

    if (opponent.board.allShipsSunk()) {
      isGameOver = true;
      return `${currentPlayer.isComputer ? "Computer" : "Player"} wins!`;
    }

    switchTurns();
    return result;
  }

  function getBoards() {
    return {
      playerBoard: human.board,
      computerBoard: computer.board,
    };
  }

  return {
    human,
    computer,
    playRound,
    getBoards,
    isGameOver: () => isGameOver,
  };
}
