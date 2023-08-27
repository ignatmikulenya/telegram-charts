import { Chart } from "api/types";

export const getChartParameters = (chart: Chart) => {
  let min = chart.axisOfOrdinates[0].values[0];
  let max = chart.axisOfOrdinates[0].values[0];
  const axisCount = chart.axisOfOrdinates.length;

  for (let i = 0; i < axisCount; i++) {
    const ordinate = chart.axisOfOrdinates[i];
    min = Math.min(...ordinate.values, min);
    max = Math.max(...ordinate.values, max);
  }

  return { min, max };
};
