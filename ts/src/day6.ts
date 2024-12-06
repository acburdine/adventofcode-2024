import { join } from "node:path";
import { uniqBy } from "es-toolkit";

const input = await Bun.file(join(Bun.main, "../../../inputs/day6.txt")).text();
// const input = `
// ....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...
// `;

const grid = input
  .trim()
  .split("\n")
  .map((l) => l.trim().split(""));

type Point = { x: number; y: number };
type Dir = "N" | "E" | "S" | "W";

const firstPoint = (): Point => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        return { x, y };
      }
    }
  }

  throw new Error("No starting point found");
};

const initialPoint = firstPoint();
grid[initialPoint.y][initialPoint.x] = ".";

const uniqPoints = (pts: Point[]) => uniqBy(pts, (p) => `${p.x},${p.y}`);

const hasLeft = (grd: string[][], p: Point) =>
  p.y < 0 || p.y >= grd.length || p.x < 0 || p.x >= grd[p.y].length;

const next = (p: Point, d: Dir) => {
  switch (d) {
    case "N":
      return { x: p.x, y: p.y - 1 };
    case "E":
      return { x: p.x + 1, y: p.y };
    case "S":
      return { x: p.x, y: p.y + 1 };
    case "W":
      return { x: p.x - 1, y: p.y };
  }
};

const nextDir = (d: Dir) => {
  switch (d) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
  }
};

const vector = (p: Point, d: Dir) => `${p.x},${p.y}|${d}`;

class Guard {
  #grid: string[][];
  #pt: Point;
  #dir: Dir;
  #path: Point[];
  #vectors: Set<string>;

  #exited = false;

  constructor(thisGrid: string[][], start: Point = initialPoint) {
    this.#grid = thisGrid;
    this.#pt = start;
    this.#dir = "N";
    this.#path = [this.#pt];
    this.#vectors = new Set();
  }

  uniqPath() {
    return uniqPoints(this.#path);
  }

  move() {
    if (this.#exited) return true;
    const vec = vector(this.#pt, this.#dir);
    if (this.#vectors.has(vec)) return null;
    this.#vectors.add(vec);

    let nextPt = next(this.#pt, this.#dir);
    while (this.#grid[nextPt.y]?.[nextPt.x] === "#") {
      this.#dir = nextDir(this.#dir);
      nextPt = next(this.#pt, this.#dir);
    }

    if (hasLeft(this.#grid, nextPt)) {
      this.#exited = true;
      return true;
    }

    this.#path.push(nextPt);
    this.#pt = nextPt;
    return false;
  }
}

const firstGuard = new Guard(grid);
while (!firstGuard.move()) {}

console.log("Part 1:", firstGuard.uniqPath().length);

const possibleBlocks = firstGuard.uniqPath();

const total = possibleBlocks.length;
const loopBlocks = possibleBlocks.filter((p, idx) => {
  process.stdout.write(`Checking ${idx + 1}/${total}\r`);

  const gridCopy = structuredClone(grid);
  gridCopy[p.y][p.x] = "#";

  const guardTest = new Guard(gridCopy, initialPoint);
  while (true) {
    const res = guardTest.move();
    if (res === null) {
      return true;
    }
    if (res === true) break;
  }

  return false;
});
process.stdout.write(`Checking ${total}/${total}\n`);

console.log("Part 2:", loopBlocks.length);
