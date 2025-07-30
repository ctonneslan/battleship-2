import Game from "../src/game";

test("player wins after sinking all computer ships", () => {
  const game = Game();

  game.computer.board.placeShip(0, 0, 1);

  const result = game.playRound(0, 0);
  expect(result).toBe("Player wins!");
  expect(game.isGameOver()).toBe(true);
});
