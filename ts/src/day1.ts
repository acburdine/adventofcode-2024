import { join } from "node:path";
import { unzip } from "es-toolkit/array";

const input = await Bun.file(join(Bun.main, "../../../inputs/day1.txt")).text();
// const input = `
// 3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3
// `;
const groups = input
  .trim()
  .split("\n")
  .map((l) => l.trim().split("   ").map(Number));

const [l1, l2] = unzip(groups).map((g) => g.toSorted());
const count = new Map<number, number>();

let p1 = 0;
for (let i = 0; i < l1.length; i++) {
  p1 += Math.abs(l1[i] - l2[i]);
  count.set(l2[i], (count.get(l2[i]) || 0) + 1);
}

console.log("Part 1:", p1);

let p2 = 0;
for (const n of l1) {
  p2 += n * (count.get(n) || 0);
}

console.log("Part 2:", p2);
