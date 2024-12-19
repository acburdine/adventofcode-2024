import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [towelList, patterns] = rawInput.split("\n\n");

  return {
    towels: towelList.split(", "),
    patterns: patterns.split("\n"),
  };
};

const possible = (towels: string[], pattern: string): boolean => {
  if (!pattern) return true;

  const startm = towels.filter((t) => pattern.startsWith(t));
  const endm = towels.filter((t) => pattern.endsWith(t));

  if (!startm.length || !endm.length) return false;
  for (const st of startm) {
    for (const en of endm) {
      if (st.length + en.length > pattern.length) continue;

      if (possible(towels, pattern.slice(st.length, -en.length))) {
        return true;
      }
    }
  }

  return false;
};

const allPossible = (
  towels: string[],
  pattern: string,
  cache: Map<string, number>,
): number => {
  if (cache.has(pattern)) return cache.get(pattern)!;
  if (!pattern) return 1;

  const matching = towels.filter((towel) => pattern.startsWith(towel));
  const result = matching.reduce(
    (acc, towel) =>
      acc + allPossible(towels, pattern.slice(towel.length), cache),
    0,
  );
  cache.set(pattern, result);
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.patterns.filter((pattern) => {
    return possible(input.towels, pattern);
  }).length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.patterns.reduce(
    (acc, pattern) =>
      acc + allPossible(input.towels, pattern, new Map<string, number>()),
    0,
  );
};

const sample = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
