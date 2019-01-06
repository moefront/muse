export type ColorFunc = (bar: Bar, canvasDimensions: Dimensions) => string;

export type Color = string | ColorFunc;

export interface Bar {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
