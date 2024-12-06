import { join } from "node:path";

const input = await Bun.file(join(Bun.main, "../../../inputs/day5.txt")).text();
// const input = `
// 47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13
//
// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47
// `;

const [rulesRaw, updatesRaw] = input.trim().split("\n\n");
const rules = rulesRaw
  .trim()
  .split("\n")
  .map((line) => {
    const [left, right] = line.trim().split("|").map(Number);
    return [left, right] as [number, number];
  });

const updates = updatesRaw
  .trim()
  .split("\n")
  .map((line) => line.trim().split(",").map(Number));

type Rule = {
  before: Set<number>;
  after: Set<number>;
};

const ruleMap = new Map<number, Rule>();
for (const [left, right] of rules) {
  if (!ruleMap.has(left))
    ruleMap.set(left, { before: new Set(), after: new Set() });
  if (!ruleMap.has(right))
    ruleMap.set(right, { before: new Set(), after: new Set() });

  ruleMap.get(left)!.after.add(right);
  ruleMap.get(right)!.before.add(left);
}

function isValid(update: number[]) {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const left = update[i];
      const right = update[j];

      if (ruleMap.get(right)?.after.has(left)) return false;
    }
  }

  return true;
}

let p1 = 0;
let p2 = 0;

for (const update of updates) {
  if (isValid(update)) {
    p1 += update[Math.floor(update.length / 2)];
    continue;
  }

  update.sort((a, b) => {
    const ruleA = ruleMap.get(a);
    const ruleB = ruleMap.get(b);
    if (!ruleA && !ruleB) return 0;

    return ruleA?.after.has(b) ? -1 : 1;
  });
  p2 += update[Math.floor(update.length / 2)];
}

console.log("Part 1:", p1);
console.log("Part 2:", p2);
