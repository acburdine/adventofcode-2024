import { join } from "node:path";

const input = await Bun.file(join(Bun.main, "../../../inputs/day3.txt")).text();
// const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
// const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const instRegex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

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

console.log("Part 1:", p1);
console.log("Part 2:", p2);
