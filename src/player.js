import Gameboard from "./gameboard";

export default function Player(isComputer = false) {
  const board = Gameboard();
  const previousMoves = new Set();

  // AI state
  let huntMode = true;
  let hitStack = [];

  function attack(opponentBoard, x, y) {
    return opponentBoard.receiveAttack(x, y);
  }

  function randomCoords() {
    let x, y, key;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      key = `${x},${y}`;
    } while (previousMoves.has(key));

    previousMoves.add(key);
    return [x, y];
  }

  function getAdjacentCoords(x, y) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([a, b]) => a >= 0 && a <= 9 && b >= 0 && b <= 9);
  }

  function smartAttack(opponentBoard) {
    let x, y;

    if (huntMode || hitStack.length === 0) {
      [x, y] = randomCoords();
    } else {
      do {
        [x, y] = hitStack.pop() || randomCoords();
      } while (previousMoves.has(`${x},${y}`) && hitStack.length > 0);
    }

    const key = `${x},${y}`;
    if (previousMoves.has(key)) {
      [x, y] = randomCoords();
    }

    previousMoves.add(`${x},${y}`);
    const result = attack(opponentBoard, x, y);

    if (result === "hit") {
      huntMode = false;
      const nextTargets = getAdjacentCoords(x, y).filter(
        ([a, b]) => !previousMoves.has(`${a},${b}`)
      );
      hitStack.push(...nextTargets);
    } else if (result === "miss" && hitStack.length === 0) {
      huntMode = true;
    }
    return result;
  }

  return { board, isComputer, attack, smartAttack, previousMoves };
}
