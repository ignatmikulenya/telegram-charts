import {
  IAxisOfOrdinates,
  IChartData,
  IParsedChartsData,
} from "../types/chart";
import { Side } from "../types/mini-map";

const getXRatio = (width: number, count: number) => {
  return parseFloat((width / count).toFixed(1));
};

const getYRatio = (height: number, min: number, max: number) => {
  return parseFloat((height / (max - min)).toFixed(1));
};

const getChartMin = (values: number[]) => {
  return Math.min(...values);
};

const getChartMax = (values: number[]) => {
  return Math.max(...values);
};

const getChartsMin = (charts: IAxisOfOrdinates[]) => {
  return Math.min(...charts.map((chart) => getChartMin(chart.values)));
};

const getChartsMax = (charts: IAxisOfOrdinates[]) => {
  return Math.max(...charts.map((chart) => getChartMax(chart.values)));
};

const getBarDivision = (height: number, barsCount: number) => {
  return parseFloat((height / barsCount).toFixed(1));
};

const getBarDivisionLabelValue = (
  min: number,
  max: number,
  barsCount: number
) => {
  return parseInt(((max - min) / barsCount).toFixed(), 10);
};

const getOppositeSide = (currentSide: Side) => {
  if (currentSide === "left") return "right";
  if (currentSide === "right") return "left";

  return null;
};

const getParsedInitialData = (initialData: IChartData) => {
  const parsedData: IParsedChartsData = {
    abscissa: {
      functionName: "",
      values: [],
    },
    axisOfOrdinates: [],
  };

  const { columns, types, names, colors } = initialData;
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];

    if (column) {
      const [functionName, ...values] = column;
      if (functionName === "x") {
        const mappedValues = values.map((date) =>
          new Date(date).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
          })
        );

        parsedData.abscissa = {
          functionName,
          values: mappedValues,
        };
      } else {
        const type = types[functionName];
        const label = names[functionName];
        const color = colors[functionName];

        if (type && label && color) {
          parsedData.axisOfOrdinates.push({
            functionName,
            values,
            type,
            label,
            color,
          });
        }
      }
    }
  }

  return parsedData;
};

export {
  getXRatio,
  getYRatio,
  getChartMin,
  getChartMax,
  getChartsMin,
  getChartsMax,
  getBarDivision,
  getBarDivisionLabelValue,
  getOppositeSide,
  getParsedInitialData,
};
