import { getChartParameters } from "utils/charts";
import { Chart } from "api/types";

import { BARS_COUNT, BAR_LABEL_BOTTOM_MARGIN } from "./LinearChart.const";

export const drawBars = (
  canvasComponent: HTMLCanvasElement | null,
  chart: Chart
) => {
  if (canvasComponent) {
    const canvasWidth = canvasComponent.offsetWidth;
    const canvasHeight = canvasComponent.offsetHeight;
    const canvasContext = canvasComponent.getContext("2d");

    if (canvasContext) {
      const { min, max } = getChartParameters(chart);
      const delta = Math.abs(max) + Math.abs(min);

      const barDivision = canvasHeight / BARS_COUNT;
      const barLabelValue = Math.round(delta / BARS_COUNT);

      for (let i = 0; i < BARS_COUNT; i++) {
        const y = i * barDivision;
        const barY = canvasHeight - y - canvasContext.lineWidth;

        canvasContext.beginPath();
        canvasContext.moveTo(0, barY);
        canvasContext.lineTo(canvasWidth, barY);
        canvasContext.stroke();

        const barLabel = (i * barLabelValue).toString();
        canvasContext.fillText(
          barLabel,
          0,
          canvasHeight - y - BAR_LABEL_BOTTOM_MARGIN
        );
      }
    }
  }
};

export const drawChart = (
  canvasComponent: HTMLCanvasElement | null,
  chart: Chart
) => {
  if (canvasComponent) {
    const canvasWidth = canvasComponent.offsetWidth;
    const canvasHeight = canvasComponent.offsetHeight;
    const canvasContext = canvasComponent.getContext("2d");

    if (canvasContext) {
      const { min, max } = getChartParameters(chart);
      const delta = Math.abs(max) + Math.abs(min);

      const xRatio = canvasWidth / chart.abscissa.values.length;
      const yRatio = canvasHeight / delta;

      canvasContext.lineWidth = 2;
      chart.axisOfOrdinates.forEach((axis) => {
        canvasContext.strokeStyle = axis.color;
        const axisValuesCount = axis.values.length;

        for (let i = 0; i < axisValuesCount - 1; i++) {
          const axisValue = axis.values[i];
          const nextAxisValue = axis.values[i + 1];

          if (axisValue != null && nextAxisValue != null) {
            canvasContext.beginPath();

            const xStartValue = i * xRatio;
            const xStart = Math.max(Math.min(xStartValue, canvasWidth), 0);
            const yStartValue = canvasHeight - axisValue * yRatio;
            const yStart = Math.max(Math.min(yStartValue, canvasHeight), 0);
            canvasContext.moveTo(xStart, yStart);

            const xEndValue = (i + 1) * xRatio;
            const xEnd = Math.max(Math.min(xEndValue, canvasWidth), 0);
            const yEndValue = canvasHeight - nextAxisValue * yRatio;
            const yEnd = Math.max(Math.min(yEndValue, canvasHeight), 0);
            canvasContext.lineTo(xEnd, yEnd);

            canvasContext.stroke();
          }
        }
      });
    }
  }
};
