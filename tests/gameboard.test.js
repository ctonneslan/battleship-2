import Gameboard from "../src/gameboard";

test("place and attack ship", () => {
  const board = Gameboard();
  expect(board.placeShip(0, 0, 3, true)).toBe(true);
  expect(board.receiveAttack(0, 0)).toBe("hit");
  expect(board.receiveAttack(0, 1)).toBe("hit");
  expect(board.receiveAttack(0, 2)).toBe("hit");
  expect(board.allShipsSunk()).toBe(true);
});

test("missed attacks and duplicate hit check", () => {
  const board = Gameboard();
  board.placeShip(0, 0, 2);
  expect(board.receiveAttack(5, 5)).toBe("miss");
  expect(board.receiveAttack(5, 5)).toBe("already tried");
});
