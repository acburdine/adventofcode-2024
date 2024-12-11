import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(" ").map(Number);

const memoMap = new Map<string, number>();
const memo = (n: number, times: number) => {
  const key = `${n}-${times}`;
  if (memoMap.has(key)) return memoMap.get(key)!;

  const result = blink(n, times);
  memoMap.set(key, result);
  return result;
};

const blink = (n: number, times: number): number => {
  if (times <= 0) return 1;

  if (n === 0) {
    return memo(1, times - 1);
  }

  const ns = n.toString();
  if (ns.length % 2 === 0) {
    const first = Number(ns.slice(0, ns.length / 2));
    const second = Number(ns.slice(ns.length / 2));

    return memo(first, times - 1) + memo(second, times - 1);
  }

  return memo(Math.floor(n * 2024), times - 1);
};

const sum = (input: number[], times: number) => {
  let sum = 0;
  for (const n of input) {
    sum += blink(n, times);
  }
  return sum;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(input, 25);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(input, 75);
};

const sample = `125 17`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 55312,
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
