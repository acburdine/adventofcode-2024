import run from "aocrunner";

import { p1, p2 } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(" ").map(Number));

const safeDiff = (a: number, b: number) => {
  const diff = Math.abs(a - b);
  return diff >= 1 && diff <= 3;
};

const isValid = (r: number[]) => {
  if (!safeDiff(r[0], r[1])) return false;

  const increasing = r[1] > r[0];
  for (let i = 1; i < r.length - 1; i++) {
    if (!safeDiff(r[i], r[i + 1])) return false;
    if (increasing && r[i] > r[i + 1]) return false;
    if (!increasing && r[i] < r[i + 1]) return false;
  }

  return true;
};

function solve(rawInput: string) {
  const input = parseInput(rawInput);

  let p1 = 0;
  let p2 = 0;

  for (const r of input) {
    const valid = isValid(r);
    if (valid) {
      p1++;
      p2++;
      continue;
    }
    for (let i = 0; i < r.length; i++) {
      const removed = r.slice();
      removed.splice(i, 1);
      if (isValid(removed)) {
        p2++;
        break;
      }
    }
  }

  return { p1, p2 };
}

const sample = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 2,
      },
    ],
    solution: p1(solve),
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 4,
      },
    ],
    solution: p2(solve),
  },
  trimTestInputs: true,
  onlyTests: false,
});
