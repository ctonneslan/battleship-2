export default function Ship(length) {
  let hits = 0;
  return {
    length,
    hit: () => hits++,
    isSunk: () => hits >= length,
  };
}
