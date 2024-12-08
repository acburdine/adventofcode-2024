import run from "aocrunner";
import { uniqBy, isEqual } from "es-toolkit";

import type { Point } from "~/utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""));

const getAntennas = (grid: string[][]): Map<string, Point[]> => {
  const antennas = new Map<string, Point[]>();
  for (const [y, row] of grid.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === ".") continue;
      antennas.set(cell, [...(antennas.get(cell) ?? []), { x, y }]);
    }
  }

  return antennas;
};

const isOffGrid = (grid: string[][], point: Point) =>
  point.x < 0 ||
  point.x >= grid[0].length ||
  point.y < 0 ||
  point.y >= grid.length;

const countAntinodes = (input: string[][], harmonic = false): number => {
  const antennas = getAntennas(input);
  const antinodes: Point[] = [];

  for (const points of antennas.values()) {
    for (let i = 0; i < points.length; i++) {
      for (let j = 0; j < points.length; j++) {
        const one = points[i];
        const two = points[j];
        if (isEqual(one, two)) continue;

        const dx = two.x - one.x;
        const dy = two.y - one.y;

        if (!harmonic) {
          const nextPt = { x: two.x + dx, y: two.y + dy };
          if (!isOffGrid(input, nextPt)) antinodes.push(nextPt);
          continue;
        }

        let nextPt = { x: one.x + dx, y: one.y + dy };
        while (!isOffGrid(input, nextPt)) {
          antinodes.push(nextPt);
          nextPt = { x: nextPt.x + dx, y: nextPt.y + dy };
        }
      }
    }
  }

  return uniqBy(antinodes, (n) => `${n.x},${n.y}`).length;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return countAntinodes(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return countAntinodes(input, true);
};

const sample = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 34,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
