import { join } from "node:path";

const input = await Bun.file(join(Bun.main, "../../../inputs/day2.txt")).text();
// const input = `
// 7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9
// `;

const reports = input
  .trim()
  .split("\n")
  .map((l) => l.trim().split(" ").map(Number));

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

let p1 = 0;
let p2 = 0;

for (const r of reports) {
  const valid = isValid(r);
  if (valid) {
    p1++;
    p2++;
    continue;
  }

  for (let i = 0; i < r.length; i++) {
    const removed = r.toSpliced(i, 1);
    if (isValid(removed)) {
      p2++;
      break;
    }
  }
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
