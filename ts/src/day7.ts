import { join } from "node:path";

const input = await Bun.file(join(Bun.main, "../../../inputs/day7.txt")).text();
// const input = `
// 190: 10 19
// 3267: 81 40 27
// 83: 17 5
// 156: 15 6
// 7290: 6 8 6 15
// 161011: 16 10 13
// 192: 17 8 14
// 21037: 9 7 18 13
// 292: 11 6 16 20
// `;

const equations = input
  .trim()
  .split("\n")
  .map((line): [number, number[]] => {
    const [lhs, rhs] = line.trim().split(": ");
    return [parseInt(lhs), rhs.split(" ").map((n) => parseInt(n))];
  });

// 0 = +, 1 = *
const op2 = (a: number, b: number, op: number) => (op & 1 ? a + b : a * b);
const op3 = (a: number, b: number, op: number) => {
  switch (op % 3) {
    case 0:
      return a + b;
    case 1:
      return a * b;
    case 2:
      return parseInt(`${a}${b}`, 10);
    default:
      throw new Error("Invalid op");
  }
};

// get max binary number for n bits
const maxn = (nums: number[], pow = 2) => Math.pow(pow, nums.length - 1) - 1;

const compute2 = (ops: number, nums: number[], eq: number) => {
  let counter = ops;
  let sum = nums[0];

  for (const n of nums.slice(1)) {
    sum = op2(sum, n, counter);
    if (sum > eq) return false;
    counter >>>= 1;
  }

  return sum === eq;
};

const compute3 = (ops: number, nums: number[], eq: number) => {
  let counter = ops;
  let sum = nums[0];

  for (const n of nums.slice(1)) {
    sum = op3(sum, n, counter);
    if (sum > eq) return false;
    counter = Math.floor(counter / 3);
  }

  return sum === eq;
};

let p1 = 0;
let p2 = 0;

for (const [eq, nums] of equations) {
  const m2 = maxn(nums);
  const m3 = maxn(nums, 3);

  for (let i = 0; i <= m2; i++) {
    if (compute2(i, nums, eq)) {
      p1 += eq;
      break;
    }
  }

  for (let i = 0; i <= m3; i++) {
    if (compute3(i, nums, eq)) {
      p2 += eq;
      break;
    }
  }
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
