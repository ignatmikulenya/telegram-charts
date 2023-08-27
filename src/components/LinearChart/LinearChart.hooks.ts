import { useEffect, useRef, useState } from "react";
import { Chart } from "api/types";
import { drawBars, drawChart } from "./LinearChart.utils";

export const useChartCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | null>();
  const [canvasHeight, setCanvasHeight] = useState<number | null>();

  useEffect(() => {
    const canvasComponent = canvasRef.current;

    if (canvasComponent) {
      setCanvasWidth(canvasComponent.offsetWidth);
      setCanvasHeight(canvasComponent.offsetHeight);
    }
  }, []);

  return { canvasRef, canvasWidth, canvasHeight };
};

export const useLinearChart = (chart: Chart) => {
  const { canvasRef, canvasWidth, canvasHeight } = useChartCanvas();

  useEffect(() => {
    const canvasComponent = canvasRef.current;

    if (canvasComponent) {
      const canvasContext = canvasComponent.getContext("2d");

      if (canvasContext && canvasWidth != null && canvasHeight != null) {
        console.log("!!!REDRAW CHARTS");

        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        canvasContext.font = "300 10px Roboto";
        canvasContext.fillStyle = "#96A2AA";
        canvasContext.strokeStyle = "#F2F4F5";

        drawBars(canvasComponent, chart);
        drawChart(canvasComponent, chart);
      }
    }
  }, [canvasRef, canvasWidth, canvasHeight, chart]);

  return { canvasRef, canvasWidth, canvasHeight };
};
