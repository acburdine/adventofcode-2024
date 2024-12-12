import run from "aocrunner";

import { nextPoint, pts, type Point } from "../utils/index.js";

class Plot {
  #points: Point[] = [];
  #perimeter = 0;
  #letter: string;

  constructor(letter: string) {
    this.#letter = letter;
  }

  addPoint(pt: Point) {
    this.#points.push(pt);
  }

  addPerimeter(perimeter: number) {
    this.#perimeter += perimeter;
  }

  merge(other: Plot) {
    this.#points.push(...other.#points);
    this.#perimeter += other.#perimeter;
  }

  forEach(fn: (pt: Point) => void) {
    this.#points.forEach(fn);
  }

  get #sides() {
    if (this.#points.length <= 2) return 4;

    let sides = 0;

    const ptset = new Set(this.#points.map(pts));
    for (const pt of this.#points) {
      const npt = ptset.has(pts(nextPoint(pt, "N")));
      const nept = ptset.has(pts(nextPoint(pt, "NE")));
      const ept = ptset.has(pts(nextPoint(pt, "E")));
      const sept = ptset.has(pts(nextPoint(pt, "SE")));
      const spt = ptset.has(pts(nextPoint(pt, "S")));
      const swpt = ptset.has(pts(nextPoint(pt, "SW")));
      const wpt = ptset.has(pts(nextPoint(pt, "W")));
      const nwpt = ptset.has(pts(nextPoint(pt, "NW")));

      if ((!npt && !ept) || (npt && ept && !nept)) sides++;
      if ((!ept && !spt) || (ept && spt && !sept)) sides++;
      if ((!spt && !wpt) || (spt && wpt && !swpt)) sides++;
      if ((!wpt && !npt) || (wpt && npt && !nwpt)) sides++;
    }

    return sides;
  }

  get size() {
    return this.#points.length;
  }

  get priceArea() {
    return this.#points.length * this.#perimeter;
  }

  get priceSides() {
    return this.#points.length * this.#sides;
  }

  toString() {
    return `${this.#letter}: ${this.#points.map(pts).join(", ")} - ${
      this.priceArea
    }`;
  }
}

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

const getPoint = (input: string[][], pt: Point) => {
  return input[pt.y]?.[pt.x] ?? null;
};

const getPlots = (input: string[][]) => {
  const plotMap = new Map<string, Plot>();

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const pt: Point = { x, y };
      const letter = input[y][x];
      let perimeter = 0;
      let plot: Plot | null = null;

      for (const d of ["N", "E", "S", "W"] as const) {
        const nextPt = nextPoint(pt, d);
        const nextLetter = getPoint(input, nextPt);

        if (nextLetter !== letter) {
          perimeter++;
          continue;
        }

        const existingPlot = plotMap.get(pts(nextPt));
        if (!existingPlot || plot === existingPlot) continue;
        if (!plot) {
          plot = existingPlot;
          continue;
        }

        if (plot.size > existingPlot.size) {
          plot.merge(existingPlot);
          plot.forEach((pt) => plotMap.set(pts(pt), plot!));
        } else {
          existingPlot.merge(plot);
          existingPlot.forEach((pt) => plotMap.set(pts(pt), existingPlot));
          plot = existingPlot;
        }
      }

      plot ??= new Plot(letter);

      plot.addPoint(pt);
      plot.addPerimeter(perimeter);
      plotMap.set(pts(pt), plot);
    }
  }

  return Array.from(new Set(plotMap.values()));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getPlots(input).reduce((acc, plot) => acc + plot.priceArea, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getPlots(input).reduce((acc, plot) => acc + plot.priceSides, 0);
};

const sample1 = `
AAAA
BBCD
BBCC
EEEC
`;

const sample2 = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`;

const sample3 = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;

const sample4 = `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
`;

const sample5 = `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
`;

run({
  part1: {
    tests: [
      {
        input: sample1,
        expected: 140,
      },
      {
        input: sample2,
        expected: 772,
      },
      {
        input: sample3,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: sample1,
        expected: 80,
      },
      {
        input: sample2,
        expected: 436,
      },
      {
        input: sample3,
        expected: 1206,
      },
      {
        input: sample4,
        expected: 236,
      },
      {
        input: sample5,
        expected: 368,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
