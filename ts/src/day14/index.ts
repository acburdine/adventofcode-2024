import run from "aocrunner";
import { groupBy } from "es-toolkit";

import { pts, type Point } from "../utils/index.js";

type Robot = {
  point: Point;
  velocity: Point;
};

type Grid = { xmx: number; ymx: number };

const sampleGrid: Grid = { xmx: 11, ymx: 7 };

const fullGrid: Grid = { xmx: 101, ymx: 103 };

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line): Robot => {
    const [position, velocity] = line.split(" ");
    const [px, py] = position.substring(2).split(",").map(Number);
    const [vx, vy] = velocity.substring(2).split(",").map(Number);

    return { point: { x: px, y: py }, velocity: { x: vx, y: vy } };
  });

const moveRobot = (grid: Grid, rb: Robot): Robot => {
  let newx = rb.point.x + rb.velocity.x;

  if (newx < 0) newx += grid.xmx;
  if (newx >= grid.xmx) newx -= grid.xmx;

  let newy = rb.point.y + rb.velocity.y;
  if (newy < 0) newy += grid.ymx;
  if (newy >= grid.ymx) newy -= grid.ymx;

  return { point: { x: newx, y: newy }, velocity: rb.velocity };
};

const getQuadrant = (grid: Grid, rb: Robot): number | null => {
  const midx = Math.floor(grid.xmx / 2);
  const midy = Math.floor(grid.ymx / 2);

  if (rb.point.x === midx || rb.point.y === midy) return null;

  if (rb.point.x < midx && rb.point.y < midy) {
    return 1;
  } else if (rb.point.x > midx && rb.point.y < midy) {
    return 2;
  } else if (rb.point.x > midx && rb.point.y > midy) {
    return 3;
  } else {
    return 4;
  }
};

const printGrid = (grid: Grid, rbs: Robot[]) => {
  const gridMap = new Map<string, number>();
  for (const rb of rbs) {
    const key = pts(rb.point);
    gridMap.set(key, (gridMap.get(key) || 0) + 1);
  }

  for (let y = 0; y < grid.ymx; y++) {
    let row = "";
    for (let x = 0; x < grid.xmx; x++) {
      const key = pts({ x, y });
      row += gridMap.has(key) ? gridMap.get(key)!.toString() : ".";
    }
    console.log(row);
  }
};

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  const grid = input.length < 50 ? sampleGrid : fullGrid;

  for (let i = 0; i < 100; i++) {
    input = input.map((rb) => moveRobot(grid, rb));
  }

  const quadrants = groupBy(input, (rb) => getQuadrant(grid, rb) || "middle");
  quadrants.middle = [];

  return Object.values(quadrants).reduce(
    (acc, rbs) => (rbs.length || 1) * acc,
    1,
  );
};

const part2 = (rawInput: string) => {
  // this was manually found by dumping the grids to a file
  // and then grepping for #############
  return 7383;
};

const sample = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;
run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 12,
      },
    ],
    solution: part1,
  },
  part2: {
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
