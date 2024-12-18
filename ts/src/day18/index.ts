import run from "aocrunner";
import { isEqual, isNotNil } from "es-toolkit";

import { pts, nextPoint, type Point } from "../utils/index.js";

type Dir = "N" | "E" | "S" | "W";

function manhattan(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

type StoredPoint = {
  f: number;
  g: number;
  h: number;
  pt: Point;
  path: Point[];
};

class AStar {
  #grid: string[][];
  #start: Point;
  #end: Point;

  #open: Map<string, StoredPoint>;
  #closed = new Set<string>();

  constructor(grid: string[][], max: number) {
    this.#grid = grid;
    this.#start = { x: 0, y: 0 };
    this.#end = { x: max, y: max };
    this.#open = new Map();

    const oh = manhattan(this.#start, this.#end);
    this.#open.set(pts(this.#start), {
      pt: this.#start,
      g: 0,
      h: oh,
      f: oh,
      path: [],
    });
  }

  #getc(pt: Point) {
    return this.#grid[pt.y]?.[pt.x] ?? null;
  }

  #neighbor(pt: StoredPoint, dir: Dir): StoredPoint | null {
    const npt = nextPoint(pt.pt, dir);
    const c = this.#getc(npt);
    if (!c || c === "#") return null;

    const g = pt.g + 1;
    const h = manhattan(npt, this.#end);

    return {
      pt: npt,
      g,
      h,
      f: g + h,
      path: [...pt.path, pt.pt],
    };
  }

  #lowestF() {
    let lowest: StoredPoint | null = null;
    for (const sp of this.#open.values()) {
      if (!lowest || sp.f < lowest.f) {
        lowest = sp;
      }
    }
    return lowest!;
  }

  solve() {
    while (this.#open.size > 0) {
      const lowest = this.#lowestF();
      if (isEqual(lowest.pt, this.#end)) {
        return lowest.g;
      }

      this.#open.delete(pts(lowest.pt));
      this.#closed.add(pts(lowest.pt));

      const neighbors = (["N", "E", "S", "W"] as const)
        .map((d) => this.#neighbor(lowest, d))
        .filter(isNotNil);

      for (const n of neighbors) {
        const ps = pts(n.pt);

        if (this.#closed.has(ps)) continue;

        if (!this.#open.has(ps)) {
          this.#open.set(ps, n);
        } else {
          const existing = this.#open.get(ps)!;
          if (n.g < existing.g) {
            this.#open.set(ps, n);
          }
        }
      }
    }

    return null;
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l): Point => {
    const [x, y] = l.split(",").map(Number);
    return { x, y };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pm = Math.max(...input.map((p) => p.x));
  const max = pm === 6 ? 6 : 70;
  const slicem = pm === 6 ? 12 : 1024;

  const grid = Array.from({ length: max + 1 }, () => Array(max + 1).fill("."));
  for (const p of input.slice(0, slicem)) {
    grid[p.y][p.x] = "#";
  }

  const as = new AStar(grid, max);
  return as.solve() ?? "";
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pm = Math.max(...input.map((p) => p.x));
  const max = pm === 6 ? 6 : 70;
  const slicem = pm === 6 ? 12 : 1024;

  const grid = Array.from({ length: max + 1 }, () => Array(max + 1).fill("."));
  for (const p of input.slice(0, slicem)) {
    grid[p.y][p.x] = "#";
  }

  let steps = null;
  for (let i = slicem; i < input.length; i += 1) {
    const p = input[i];
    grid[p.y][p.x] = "#";
    const as = new AStar(grid, max);
    const s = as.solve();

    if (s !== null) {
      steps = s;
      continue;
    }

    return `${p.x},${p.y}`;
  }

  throw new Error("No solution found");
};

const sample = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 22,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: "6,1",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
