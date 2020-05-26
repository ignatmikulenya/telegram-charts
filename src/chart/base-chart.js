import {
  getChartsMin,
  getChartsMax,
  getXRatio,
  getYRatio,
  getBarDivision,
  getBarDivisionLabel,
} from "./utilities";

export default class BaseChart {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.marginTop = options.marginTop;
    this.barsCount = options.barsCount;
    this.data = options.data;

    this.setComponent();
    this.setContext();
    this.prepare();
  }

  get component() {
    return this.$component;
  }

  setComponent() {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    this.$component = canvas;
  }

  setContext() {
    this.context = this.$component.getContext("2d");
  }

  prepare() {
    const min = getChartsMin(this.data.axisOfOrdinates);
    const max = getChartsMax(this.data.axisOfOrdinates);

    this.context.font = "10px Arial";
    this.context.fillStyle = "#96A2AA";
    this.context.strokeStyle = "#DEDEDE";
    const barDivision = getBarDivision(
      this.height - this.marginTop,
      this.barsCount
    );
    const barDivisionLabel = getBarDivisionLabel(min, max, this.barsCount);
    for (let i = 0; i < this.barsCount; i += 1) {
      const y = i * barDivision;

      this.context.beginPath();
      this.context.moveTo(0, this.height - y - this.context.lineWidth);
      this.context.lineTo(this.width, this.height - y - this.context.lineWidth);
      this.context.stroke();

      const label = (i * barDivisionLabel).toString();
      this.context.fillText(label, 0, this.height - y - 8);
    }

    const xRatio = getXRatio(this.width, this.data.abscissa.values.length);
    const yRatio = getYRatio(this.height - this.marginTop, min, max);
    this.context.lineWidth = 2;
    this.data.axisOfOrdinates.forEach((axis) => {
      this.context.strokeStyle = axis.color;
      for (let i = 0; i < axis.values.length - 1; i += 1) {
        this.context.beginPath();
        this.context.moveTo(i * xRatio, this.height - axis.values[i] * yRatio);
        this.context.lineTo(
          (i + 1) * xRatio,
          this.height - axis.values[i + 1] * yRatio
        );
        this.context.stroke();
      }
    });
  }
}
