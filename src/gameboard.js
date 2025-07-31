import Ship from "./ship";

export default function Gameboard() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const ships = [];
  const missedAttacks = [];

  function placeShip(x, y, length, isHorizontal = true) {
    if (!canPlaceShipOnly(x, y, length, isHorizontal)) return false;

    const ship = Ship(length);
    ships.push({ ship, x, y, isHorizontal });

    for (let i = 0; i < length; i++) {
      const row = x + (isHorizontal ? 0 : i);
      const col = y + (isHorizontal ? i : 0);
      board[row][col] = ship;
    }

    return true;
  }

  function canPlaceShipOnly(x, y, length, isHorizontal) {
    for (let i = 0; i < length; i++) {
      const row = x + (isHorizontal ? 0 : i);
      const col = y + (isHorizontal ? i : 0);

      if (row > 9 || col > 9 || board[row][col] !== null) return false;
    }
    return true;
  }

  function receiveAttack(x, y) {
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      x < 0 ||
      x > 9 ||
      y < 0 ||
      y > 9 ||
      !Array.isArray(board[x])
    ) {
      console.warn(`Invalid attack coords : (${x}, ${y})`);
      return "invalid";
    }
    const cell = board[x][y];
    if (cell === null) {
      missedAttacks.push([x, y]);
      board[x][y] = "miss";
      return "miss";
    }
    if (cell === "hit" || cell === "miss") return "already tried";

    cell.hit();
    board[x][y] = "hit";
    return "hit";
  }

  function allShipsSunk() {
    return ships.every(({ ship }) => ship.isSunk());
  }

  return {
    board,
    placeShip,
    receiveAttack,
    allShipsSunk,
    missedAttacks,
    canPlaceShipOnly,
  };
}
