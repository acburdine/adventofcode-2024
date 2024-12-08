import run from "aocrunner";
import { unzip } from "es-toolkit/array";

import { p1, p2 } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split("   ").map(Number));

const solve = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [l1, l2] = unzip(input).map((g) => g.toSorted());
  const count = new Map<number, number>();

  let p1 = 0;
  for (let i = 0; i < l1.length; i++) {
    p1 += Math.abs(l1[i] - l2[i]);
    count.set(l2[i], (count.get(l2[i]) || 0) + 1);
  }

  let p2 = 0;
  for (const n of l1) {
    p2 += n * (count.get(n) || 0);
  }

  return { p1, p2 };
};

const sample = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 11,
      },
    ],
    solution: p1(solve),
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 31,
      },
    ],
    solution: p2(solve),
  },
  trimTestInputs: true,
  onlyTests: true,
});
