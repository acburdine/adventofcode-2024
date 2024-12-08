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
