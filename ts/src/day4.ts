import { join } from "node:path";

const input = await Bun.file(join(Bun.main, "../../../inputs/day4.txt")).text();
// const input = `
// MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX
// `;

const match = "XMAS";

const grid = input
  .trim()
  .split("\n")
  .map((row) => row.trim().split(""));

type Point = { x: number; y: number };
type Dir = "N" | "E" | "S" | "W" | "NE" | "SE" | "SW" | "NW";

const dirs: Dir[] = ["N", "E", "S", "W", "NE", "SE", "SW", "NW"];

const letterAt = (p: Point) => grid[p.y]?.[p.x] ?? null;

function move(p: Point, dir: Dir): Point {
  switch (dir) {
    case "N":
      return { x: p.x, y: p.y - 1 };
    case "E":
      return { x: p.x + 1, y: p.y };
    case "S":
      return { x: p.x, y: p.y + 1 };
    case "W":
      return { x: p.x - 1, y: p.y };
    case "NE":
      return { x: p.x + 1, y: p.y - 1 };
    case "SE":
      return { x: p.x + 1, y: p.y + 1 };
    case "SW":
      return { x: p.x - 1, y: p.y + 1 };
    case "NW":
      return { x: p.x - 1, y: p.y - 1 };
  }
}

function follow(p: Point, dir: Dir, text: string): boolean {
  if (text === match) return true;
  if (!match.startsWith(text)) return false;

  const next = move(p, dir);
  if (!letterAt(next)) return false;

  return follow(next, dir, text + letterAt(next));
}

function matchX(p: Point): boolean {
  const topL = letterAt(move(p, "NW"));
  const topR = letterAt(move(p, "NE"));
  const botL = letterAt(move(p, "SW"));
  const botR = letterAt(move(p, "SE"));

  if (!topL || !topR || !botL || !botR) return false;
  const sideOne = `${topL}A${botR}`;
  const sideTwo = `${topR}A${botL}`;

  return (
    (sideOne === "MAS" || sideOne === "SAM") &&
    (sideTwo === "MAS" || sideTwo === "SAM")
  );
}

let p1 = 0;
let p2 = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    const p = { x, y };
    if (letterAt(p) === "X") {
      for (const dir of dirs) {
        if (follow(p, dir, "X")) p1++;
      }

      continue;
    }

    if (letterAt(p) === "A") {
      if (matchX(p)) p2++;
    }
  }
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
