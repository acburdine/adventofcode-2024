import run from "aocrunner";

import { pts, type Point } from "../utils/index.js";

type GridChar = "#" | "O" | "@" | "[" | "]";
type Move = "v" | "^" | "<" | ">";

type PointData = { pt: Point; char: GridChar };

const parseInput = (rawInput: string, double = false) => {
  const [gridRaw, movesRaw] = rawInput.split("\n\n");

  const grid = gridRaw.split("\n").map((row) => row.split(""));
  const moves = movesRaw
    .split("")
    .filter((m): m is Move => ["v", "^", "<", ">"].includes(m));

  const points = new Map<string, PointData>();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char === ".") continue;

      if (!double) {
        const pt: Point = { x, y };
        points.set(pts(pt), { pt, char: char as GridChar });
        continue;
      }

      const doubleX = x * 2;
      if (char === "#") {
        const pt1: Point = { x: doubleX, y };
        const pt2: Point = { x: doubleX + 1, y };
        points.set(pts(pt1), { pt: pt1, char: char as GridChar });
        points.set(pts(pt2), { pt: pt2, char: char as GridChar });
      } else if (char === "O") {
        const pt1: Point = { x: doubleX, y };
        const pt2: Point = { x: doubleX + 1, y };
        points.set(pts(pt1), { pt: pt1, char: "[" });
        points.set(pts(pt2), { pt: pt2, char: "]" });
      } else if (char === "@") {
        const pt1: Point = { x: doubleX, y };
        points.set(pts(pt1), { pt: pt1, char: "@" });
      }
    }
  }

  return { points, moves };
};

const getRobot = (points: Map<string, PointData>): PointData => {
  for (const data of points.values()) {
    if (data.char === "@") return data;
  }

  throw new Error("Robot not found");
};

const nextPoint = (pt: Point, move: Move): Point => {
  switch (move) {
    case "^":
      return { x: pt.x, y: pt.y - 1 };
    case "v":
      return { x: pt.x, y: pt.y + 1 };
    case "<":
      return { x: pt.x - 1, y: pt.y };
    case ">":
      return { x: pt.x + 1, y: pt.y };
    default:
      throw new Error(`Invalid move ${move}`);
  }
};

const canMove = (
  points: Map<string, PointData>,
  pt: PointData,
  move: Move,
): boolean => {
  const nextPt = nextPoint(pt.pt, move);
  const ptk = pts(nextPt);
  const nextPtData = points.get(ptk);

  if (!nextPtData) return true;
  if (nextPtData.char === "#") return false;
  if (["[", "]"].includes(nextPtData.char) && ["^", "v"].includes(move)) {
    const nextX = nextPtData.char === "[" ? nextPt.x + 1 : nextPt.x - 1;
    const otherHalf = { y: nextPt.y, x: nextX };
    const otherHalfData = points.get(pts(otherHalf));
    if (!otherHalfData) throw new Error("mismatched box");

    return (
      canMove(points, otherHalfData, move) && canMove(points, nextPtData, move)
    );
  }

  return true;
};

const executeMove = (
  points: Map<string, PointData>,
  pt: PointData,
  move: Move,
): PointData | null => {
  const nextPt = nextPoint(pt.pt, move);
  const ptk = pts(nextPt);
  const nextPtData = points.get(ptk);

  if (!nextPtData) {
    const nextData = { pt: nextPt, char: pt.char };
    points.set(ptk, nextData);
    points.delete(pts(pt.pt));
    return nextData;
  }

  // hit wall
  if (nextPtData.char === "#") return null;

  if (["[", "]"].includes(nextPtData.char) && ["^", "v"].includes(move)) {
    if (!canMove(points, pt, move)) return null;
    executeMove(points, nextPtData, move);

    // check other half of box
    const nextX = nextPtData.char === "[" ? nextPt.x + 1 : nextPt.x - 1;
    const otherHalf = { y: nextPt.y, x: nextX };
    const otherHalfData = points.get(pts(otherHalf));
    if (!otherHalfData) throw new Error("mismatched box");
    executeMove(points, otherHalfData, move);
  } else {
    // hit another box, check if can be moved first
    const checkNext = executeMove(points, nextPtData, move);
    if (!checkNext) return null;
  }

  const nextData = { pt: nextPt, char: pt.char };
  points.set(ptk, nextData);
  points.delete(pts(pt.pt));
  return nextData;
};

const sumGps = (points: Map<string, PointData>) => {
  let sum = 0;

  for (const { pt, char } of points.values()) {
    if (char === "O" || char === "[") {
      sum += 100 * pt.y + pt.x;
    }
  }

  return sum;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let robotPt = getRobot(input.points);

  for (const move of input.moves) {
    const nextRobotPt = executeMove(input.points, robotPt, move);
    if (nextRobotPt) robotPt = nextRobotPt;
  }

  return sumGps(input.points);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput, true);
  let robotPt = getRobot(input.points);

  for (const move of input.moves) {
    const nextRobotPt = executeMove(input.points, robotPt, move);
    if (nextRobotPt) robotPt = nextRobotPt;
  }

  return sumGps(input.points);
};

const sample1 = `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`;

const sample2 = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;

run({
  part1: {
    tests: [
      {
        input: sample1,
        expected: 2028,
      },
      {
        input: sample2,
        expected: 10092,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample2,
        expected: 9021,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
