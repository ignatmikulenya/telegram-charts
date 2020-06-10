import LinearChart from "./chart/linear-chart";
import config from "./chart/config";

import { getParsedInitialData } from "./chart/utilities";

import data from "../assets/chart_data";

import "./index.css";

const firstChart = data[0];
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
root.appendChild(chart.component);
