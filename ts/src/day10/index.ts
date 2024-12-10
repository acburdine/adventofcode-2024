import run from "aocrunner";
import { uniqBy } from "es-toolkit";

import type { Point } from "~/utils";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split("").map(Number));

const getStartPoints = (input: number[][]) => {
  const starts: Point[] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === 0) starts.push({ x, y });
    }
  }

  return starts;
};

const getPoint = (input: number[][], pt: Point) => input[pt.y]?.[pt.x] ?? -1;

const traverse = (input: number[][], pt: Point, n: number): Point[] => {
  if (n === 9) return [pt];

  const next: Point[] = [
    { x: pt.x - 1, y: pt.y },
    { x: pt.x, y: pt.y - 1 },
    { x: pt.x + 1, y: pt.y },
    { x: pt.x, y: pt.y + 1 },
  ];

  const points: Point[] = [];
  for (const npt of next) {
    if (getPoint(input, npt) === n + 1) {
      points.push(...traverse(input, npt, n + 1));
    }
  }

  return points;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const starts = getStartPoints(input);

  return starts.reduce((acc, start) => {
    const ends = uniqBy(traverse(input, start, 0), (pt) => `${pt.x},${pt.y}`);
    return acc + ends.length;
  }, 0);
};

const paths = (
  input: number[][],
  pt: Point,
  n: number,
  seen: Map<string, Point[][]>,
): Point[][] => {
  const key = `${pt.x},${pt.y}`;
  if (seen.has(key)) return seen.get(key) as Point[][];

  if (n === 9) return [[pt]];

  const next: Point[] = [
    { x: pt.x - 1, y: pt.y },
    { x: pt.x, y: pt.y - 1 },
    { x: pt.x + 1, y: pt.y },
    { x: pt.x, y: pt.y + 1 },
  ];

  const points: Point[][] = [];
  for (const npt of next) {
    if (getPoint(input, npt) === n + 1) {
      const nPaths = paths(input, npt, n + 1, seen);
      points.push(...nPaths.map((p) => [pt, ...p]));
    }
  }

  const uniqPoints = uniqBy(points, (pts) =>
    pts.map((p) => `${p.x},${p.y}`).join("|"),
  );

  seen.set(key, uniqPoints);
  return uniqPoints;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const starts = getStartPoints(input);

  const seen = new Map<string, Point[][]>();

  return starts.reduce((acc, start) => {
    const sPaths = paths(input, start, 0, seen);
    return acc + sPaths.length;
  }, 0);
};

const sample = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
