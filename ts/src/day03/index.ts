import run from "aocrunner";

import { p1, p2 } from "../utils/index.js";

const instRegex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

const solve = (input: string) => {
  let p1 = 0;
  let p2 = 0;
  let enabled = true;

  for (const [match, a, b] of input.matchAll(instRegex)) {
    if (match === "do()") {
      enabled = true;
      continue;
    }
    if (match === "don't()") {
      enabled = false;
      continue;
    }

    const mult = Number(a) * Number(b);
    p1 += mult;
    if (enabled) p2 += mult;
  }

  return { p1, p2 };
};

run({
  part1: {
    tests: [
      {
        input:
          "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))",
        expected: 161,
      },
    ],
    solution: p1(solve),
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: p2(solve),
  },
  trimTestInputs: true,
  onlyTests: false,
});
