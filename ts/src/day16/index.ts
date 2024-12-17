import run from "aocrunner";
import { isEqual, isNotNil } from "es-toolkit";

import { p1, p2, pts, nextPoint, type Point } from "../utils/index.js";

type Dir = "N" | "E" | "S" | "W";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

const findChar = (grid: string[][], char: string): Point => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === char) {
        return { x, y };
      }
    }
  }

  throw new Error(`No char ${char} found`);
};

type StoredPoint = {
  f: number;
  g: number;
  h: number;
  pt: Point;
  dir: Dir;
  path: Point[];
};

function manhattan(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const lDir = (dir: Dir): Dir => {
  switch (dir) {
    case "N":
      return "W";
    case "E":
      return "N";
    case "S":
      return "E";
    case "W":
      return "S";
  }
};

const rDir = (dir: Dir): Dir => {
  switch (dir) {
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

class AStar {
  #grid: string[][];
  #start: Point;
  #end: Point;

  #open: Map<string, StoredPoint>;
  #closed = new Set<string>();

  #score: number | null = null;

  constructor(grid: string[][]) {
    this.#grid = grid;
    this.#start = findChar(grid, "S");
    this.#end = findChar(grid, "E");
    this.#open = new Map();

    const oh = manhattan(this.#start, this.#end);
    this.#open.set(pts(this.#start), {
      pt: this.#start,
      g: 0,
      h: oh,
      f: oh,
      dir: "E",
      path: [],
    });
  }

  #getc(pt: Point) {
    return this.#grid[pt.y][pt.x];
  }

  #neighbor(pt: StoredPoint, dir: Dir): StoredPoint | null {
    const npt = nextPoint(pt.pt, dir);
    if (this.#getc(npt) === "#") return null;

    const g = dir === pt.dir ? pt.g + 1 : pt.g + 1001;
    const h = manhattan(npt, this.#end);

    return {
      pt: npt,
      g,
      h,
      f: g + h,
      dir,
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
        this.#score = lowest.g;
        return lowest.g;
      }

      this.#open.delete(pts(lowest.pt));
      this.#closed.add(pts(lowest.pt));

      const neighbors = [
        this.#neighbor(lowest, lowest.dir),
        this.#neighbor(lowest, lDir(lowest.dir)),
        this.#neighbor(lowest, rDir(lowest.dir)),
      ].filter(isNotNil);

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

    throw new Error("No solution found");
  }

  seats(): number {
    const queue: StoredPoint[] = [
      { pt: this.#start, f: 0, g: 0, h: 0, dir: "E", path: [] },
    ];
    const visited = new Map<string, number>();
    const result: Point[][] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = `${pts(current.pt)}-${current.dir}`;

      if (current.g > this.#score!) continue;
      if (visited.has(key) && visited.get(key)! < current.g) continue;
      visited.set(key, current.g);

      if (isEqual(current.pt, this.#end) && current.g === this.#score!) {
        result.push(current.path);
        continue;
      }

      const neighbors = [
        this.#neighbor(current, current.dir),
        this.#neighbor(current, lDir(current.dir)),
        this.#neighbor(current, rDir(current.dir)),
      ].filter(isNotNil);
      queue.push(...neighbors);
    }

    const unique = new Set<string>([pts(this.#start), pts(this.#end)]);
    for (const path of result) {
      for (const pt of path) unique.add(pts(pt));
    }

    return unique.size;
  }
}

const solve = (rawInput: string) => {
  const input = parseInput(rawInput);
  const as = new AStar(input);

  const part1 = as.solve();
  const part2 = as.seats();

  return { p1: part1, p2: part2 };
};

const sample1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`;

const sample2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`;

run({
  part1: {
    tests: [
      {
        input: sample1,
        expected: 7036,
      },
      {
        input: sample2,
        expected: 11048,
      },
    ],
    solution: p1(solve),
  },
  part2: {
    tests: [
      {
        input: sample1,
        expected: 45,
      },
      {
        input: sample2,
        expected: 64,
      },
    ],
    solution: p2(solve),
  },
  trimTestInputs: true,
  onlyTests: false,
});
