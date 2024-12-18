import run from "aocrunner";
import { isEqual } from "es-toolkit";

class Program {
  instructions: bigint[];
  #a: bigint;
  #b: bigint;
  #c: bigint;

  #ip = 0;
  #output: bigint[] = [];

  constructor(instructions: bigint[], a: bigint, b: bigint, c: bigint) {
    this.instructions = instructions;
    this.#a = a;
    this.#b = b;
    this.#c = c;
  }

  #combo(ip: number) {
    const n = this.instructions[ip];

    switch (n) {
      case 0n:
      case 1n:
      case 2n:
      case 3n:
        return n;
      case 4n:
        return this.#a;
      case 5n:
        return this.#b;
      case 6n:
        return this.#c;
      case 7n:
      default:
        throw new Error(`invalid operand: ${n}`);
    }
  }

  #process() {
    const opcode = this.instructions[this.#ip];
    switch (opcode) {
      case 0n:
        this.#a >>= this.#combo(this.#ip + 1);
        this.#ip += 2;
        return;
      case 1n:
        this.#b = this.#b ^ this.instructions[this.#ip + 1];
        this.#ip += 2;
        return;
      case 2n:
        this.#b = this.#combo(this.#ip + 1) % 8n;
        this.#ip += 2;
        return;
      case 3n:
        this.#ip =
          this.#a === 0n
            ? this.#ip + 2
            : Number(this.instructions[this.#ip + 1]);
        return;
      case 4n:
        this.#b = this.#b ^ this.#c;
        this.#ip += 2;
        return;
      case 5n:
        this.#output.push(this.#combo(this.#ip + 1) % 8n);
        this.#ip += 2;
        return;
      case 6n:
        this.#b = this.#a >> this.#combo(this.#ip + 1);
        this.#ip += 2;
        return;
      case 7n:
        this.#c = this.#a >> this.#combo(this.#ip + 1);
        this.#ip += 2;
        return;
      default:
        throw new Error(`invalid opcode: ${opcode}`);
    }
  }

  run() {
    while (this.#ip < this.instructions.length) {
      this.#process();
    }

    return this.#output.join(",");
  }
}

const parseInput = (rawInput: string) => {
  const [registers, program] = rawInput.split("\n\n");
  const [a, b, c] = registers.split("\n").map((l) => BigInt(l.split(": ")[1]));

  const instructions = program.split(": ")[1].split(",").map(BigInt);
  return new Program(instructions, a, b, c);
};

const program = (aVal: bigint) => {
  let a = aVal;
  let b = 0n;
  let c = 0n;

  const result: bigint[] = [];
  while (a !== 0n) {
    b = a % 8n ^ 1n;
    c = a >> b;
    b = b ^ c ^ 4n;
    a >>= 3n;
    result.push(b % 8n);
  }
  return result;
};

const sample2fn = (a: bigint) => {
  const result: bigint[] = [];
  while (a !== 0n) {
    a = a >> 3n;
    result.push(a % 8n);
  }
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.run();
};

function solve(
  fn: (a: bigint) => bigint[],
  digits: number[],
  expected: bigint[],
): bigint | null {
  const partialExpect = expected.slice(-1 * (digits.length + 1));

  for (let i = 0; i < 8; i++) {
    const astr = `${digits.join("")}${i}`.padEnd(expected.length, "0");
    const a = BigInt(`0o${astr}`);

    const result = fn(a);
    if (isEqual(result, expected)) return a;

    const partialMatch = result.slice(-1 * (digits.length + 1));
    if (!isEqual(partialMatch, partialExpect)) continue;

    const nextResult = solve(fn, [...digits, i], expected);
    if (nextResult !== null) return nextResult;
  }

  return null;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // input.reset(a);
  // let output = input.run();
  const result = solve(program, [], input.instructions);
  return Number(result);
};

const sample = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

const sample2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`;

run({
  part1: {
    tests: [
      {
        input: sample,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: sample2,
      //   expected: 117440,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
