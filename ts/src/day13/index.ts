import run from "aocrunner";

import type { Point } from "../utils/index.js";

const bm = /^Button (?:A|B): X\+(\d+), Y\+(\d+)$/;
const pm = /^Prize: X=(\d+), Y=(\d+)$/;

type InputData = {
  a: Point;
  b: Point;
  p: Point;
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((group): InputData => {
    const [ar, br, pr] = group.split("\n");

    const [, axr, ayr] = ar.match(bm)!;
    const [, bxr, byr] = br.match(bm)!;
    const [, pxr, pyr] = pr.match(pm)!;

    const [ax, ay, bx, by, px, py] = [axr, ayr, bxr, byr, pxr, pyr].map(Number);
    return {
      a: { x: ax, y: ay },
      b: { x: bx, y: by },
      p: { x: px, y: py },
    };
  });

const addition = 10000000000000;

function cramer(input: InputData, p2 = false): number {
  const px = input.p.x + (p2 ? addition : 0);
  const py = input.p.y + (p2 ? addition : 0);

  const d = input.a.x * input.b.y - input.b.x * input.a.y;
  if (!d) return 0;

  const dx = px * input.b.y - input.b.x * py;
  if (!dx || dx % d !== 0) return 0;

  const dy = input.a.x * py - px * input.a.y;
  if (!dy || dy % d !== 0) return 0;

  return (dx / d) * 3 + dy / d;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, i) => {
    return acc + cramer(i);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, i) => {
    return acc + cramer(i, true);
  }, 0);
};

const sample = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 480,
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
