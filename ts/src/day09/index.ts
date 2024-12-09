import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("").map(Number);

const expandInput = (input: number[]): (number | null)[] => {
  let fileId = 0;
  let isFile = true;

  let result: (number | null)[] = [];

  for (const n of input) {
    for (let i = 0; i < n; i++) {
      if (isFile) result.push(fileId);
      else result.push(null);
    }

    if (isFile) fileId++;
    isFile = !isFile;
  }

  return result;
};

const sortExpanded = (expanded: (number | null)[]) => {
  let fi = expanded.findIndex((n) => n === null);
  let li = expanded.findLastIndex((n) => n !== null);
  while (fi < li) {
    expanded[fi] = expanded[li];
    expanded[li] = null;

    while (expanded[fi] !== null) fi++;
    while (expanded[li] === null) li--;
  }

  return expanded;
};

const checksum = (data: (number | null)[]) => {
  return data.reduce(
    (acc: number, n, i) => (n !== null ? acc + n * i : acc),
    0,
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const expanded = expandInput(input);
  sortExpanded(expanded);

  return checksum(expanded);
};

const tagInput = (input: number[]) => {
  let fileId = 0;
  let isFile = true;

  return input.map(() => {
    const r = isFile ? fileId : null;
    if (isFile) fileId++;
    isFile = !isFile;

    return r;
  });
};

const expandWithTagged = (input: number[], tagged: (number | null)[]) => {
  const result: (number | null)[] = [];

  for (const [idx, v] of input.entries()) {
    for (let i = 0; i < v; i++) {
      result.push(tagged[idx]);
    }
  }

  return result;
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  let tagged = tagInput(input);

  let li = input.length - 1;

  while (true) {
    while (tagged[li] === null) li--;
    if (li < 0) break;

    const lin = input[li];
    const fi = input.findIndex(
      (n, idx) => n >= lin && tagged[idx] === null && idx < li,
    );
    if (fi === -1) {
      li--;
      continue;
    }

    const fin = input[fi];
    input[fi] = lin;
    input[li] = lin;
    tagged[fi] = tagged[li];
    tagged[li] = null;

    if (fin > lin) {
      const d = fin - lin;
      input.splice(fi + 1, 0, d);
      tagged.splice(fi + 1, 0, null);
    }
  }

  return checksum(expandWithTagged(input, tagged));
};

const sample = "2333133121414131402";

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
