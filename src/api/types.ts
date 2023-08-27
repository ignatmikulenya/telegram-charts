export type ChartValues = Array<number>;

export type Column = [string, ...ChartValues];

export type ChartType = "line" | "x";

export interface ChartResponse {
  columns: Column[];
  types: Record<string, ChartType>;
  names: Record<string, string>;
  colors: Record<string, string>;
}

export type ChartsResponse = ChartResponse[];

interface Abscissa {
  functionName: string;
  values: string[];
}

interface AxisOfOrdinates {
  functionName: string;
  values: ChartValues;
  type: string;
  label: string;
  color: string;
}

export interface Chart {
  abscissa: Abscissa;
  axisOfOrdinates: AxisOfOrdinates[];
}
