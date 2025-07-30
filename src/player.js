import Gameboard from "./gameboard";

export default function Player(isComputer = false) {
  const board = Gameboard();
  const previousMoves = new Set();

  function attack(opponentBoard, x, y) {
    return opponentBoard.receiveAttack(x, y);
  }

  function randomAttack(opponentBoard) {
    let x, y, key;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      key = `${x},${y}`;
    } while (previousMoves.has(key));

    previousMoves.add(key);
    return attack(opponentBoard, x, y);
  }

  return { board, isComputer, attack, randomAttack, previousMoves };
}
