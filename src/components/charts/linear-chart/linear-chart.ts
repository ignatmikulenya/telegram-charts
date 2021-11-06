import MiniMap from "../../mini-map/mini-map";

import {
  getChartsMin,
  getChartsMax,
  getXRatio,
  getYRatio,
  getBarDivision,
  getBarDivisionLabelValue,
} from "../../../utilities/conversions";

import { BaseChart, IChartOptions } from "../../../types/chart";

export default class LinearChart extends BaseChart {
  constructor(options: IChartOptions) {
    super(options);
  }

  initializeComponent() {
    const telegramChart = document.createElement("div");
    telegramChart.classList.add("telegram-chart");

    const chart = document.createElement("canvas");
    chart.classList.add("chart");
    chart.width = this.width;
    chart.height = this.height;
    telegramChart.appendChild(chart);

    const miniMap = new MiniMap({ width: this.width });
    telegramChart.appendChild(miniMap.component);

    this.component = telegramChart;
  }

  initializeContext() {
    const chart = this.component.querySelector(".chart");

    if (chart) {
      const context = (chart as HTMLCanvasElement).getContext("2d");

      if (context) {
        this.context = context;
      } else {
        super.initializeContext();
      }
    }
  }

  prepare() {
    const min = getChartsMin(this.data.axisOfOrdinates);
    const max = getChartsMax(this.data.axisOfOrdinates);

    this.context.font = "10px Arial";
    this.context.fillStyle = "#96A0AA";
    this.context.strokeStyle = "#F0F0F0";
    const barDivision = getBarDivision(
      this.height - this.marginTop,
      this.barsCount
    );
    const barDivisionLabelValue = getBarDivisionLabelValue(
      min,
      max,
      this.barsCount
    );
    for (let i = 0; i < this.barsCount; i += 1) {
      const y = i * barDivision;

      this.context.beginPath();
      this.context.moveTo(0, this.height - y - this.context.lineWidth);
      this.context.lineTo(this.width, this.height - y - this.context.lineWidth);
      this.context.stroke();

      const label = (i * barDivisionLabelValue).toString();
      this.context.fillText(label, 0, this.height - y - 8);
    }

    const xRatio = getXRatio(this.width, this.data.abscissa.values.length);
    const yRatio = getYRatio(this.height - this.marginTop, min, max);
    this.context.lineWidth = 2;
    this.data.axisOfOrdinates.forEach((axis) => {
      this.context.strokeStyle = axis.color;
      for (let i = 0; i < axis.values.length - 1; i += 1) {
        const axisValue = axis.values[i];
        const nextAxisValue = axis.values[i + 1];

        if (axisValue != null && nextAxisValue != null) {
          this.context.beginPath();
          this.context.moveTo(i * xRatio, this.height - axisValue * yRatio);
          this.context.lineTo(
            (i + 1) * xRatio,
            this.height - nextAxisValue * yRatio
          );
          this.context.stroke();
        }
      }
    });
  }
}
