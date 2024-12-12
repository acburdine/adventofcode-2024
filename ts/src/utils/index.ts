export type Point = { x: number; y: number };

type Solution = (input: string) => any;

export const p1 =
  (fn: (input: string) => { p1: number; p2: any }): Solution =>
  (input: string) =>
    fn(input).p1;

export const p2 =
  (fn: (input: string) => { p1: number; p2: any }): Solution =>
  (input: string) =>
    fn(input).p2;

export const nextPoint = (
  pt: Point,
  dir: "N" | "E" | "S" | "W" | "NE" | "NW" | "SE" | "SW",
): Point => {
  switch (dir) {
    case "N":
      return { x: pt.x, y: pt.y - 1 };
    case "E":
      return { x: pt.x + 1, y: pt.y };
    case "S":
      return { x: pt.x, y: pt.y + 1 };
    case "W":
      return { x: pt.x - 1, y: pt.y };
    case "NE":
      return { x: pt.x + 1, y: pt.y - 1 };
    case "NW":
      return { x: pt.x - 1, y: pt.y - 1 };
    case "SE":
      return { x: pt.x + 1, y: pt.y + 1 };
    case "SW":
      return { x: pt.x - 1, y: pt.y + 1 };
  }
};

export const pts = (pt: Point) => `${pt.x},${pt.y}`;
