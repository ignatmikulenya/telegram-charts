import { chartsResponseMock } from "./mock/charts";
import { parseChartsResponse } from "./utils";

export const linearCharts = chartsResponseMock.map(parseChartsResponse);
