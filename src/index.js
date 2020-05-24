import { getParsedInitialData } from "./chart/utilities";
import data from "../assets/chart_data";
import "./index.css";

const firstChart = data[0];
const parsedData = getParsedInitialData(firstChart);

console.log(parsedData);
