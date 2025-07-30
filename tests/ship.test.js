import Ship from "../src/ship";

test("ship gets hit and sinks", () => {
  const ship = Ship(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
