import Player from "../src/player";

test("player can attack and sink ships", () => {
  const player1 = Player();
  const player2 = Player();

  player2.board.placeShip(0, 0, 2);

  expect(player1.attack(player2.board, 0, 0)).toBe("hit");
  expect(player1.attack(player2.board, 0, 1)).toBe("hit");
  expect(player2.board.allShipsSunk()).toBe(true);
});

test("computer makes only unique random attacks", () => {
  const human = Player();
  const computer = Player(true);

  for (let i = 0; i < 100; i++) {
    computer.randomAttack(human.board);
  }

  expect(computer.previousMoves.size).toBe(100);
});
