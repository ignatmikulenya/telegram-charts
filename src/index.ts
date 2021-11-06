import LinearChart from "./components/charts/linear-chart/linear-chart";
import config from "./constants/config";

import { getParsedInitialData } from "./utilities/conversions";

import data from "./mock/charts-data";

import "./index.css";

const firstChart = data[0];
if (firstChart) {
  const parsedData = getParsedInitialData(firstChart);
  console.log(parsedData);

  const { width, height, marginTop, barsCount } = config;
  const chart = new LinearChart({
    width,
    height,
    marginTop,
    barsCount,
    data: parsedData,
  });

  const root = document.getElementById("root");
  if (root) {
    root.appendChild(chart.component);
  }
}
