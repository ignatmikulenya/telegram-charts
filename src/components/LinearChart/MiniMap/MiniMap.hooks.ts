import { useEffect } from "react";
import { Chart } from "api/types";

import { useChartCanvas } from "../LinearChart.hooks";
import { drawChart } from "../LinearChart.utils";

export const useMiniMap = (chart: Chart) => {
  const { canvasRef, canvasWidth, canvasHeight } = useChartCanvas();

  useEffect(() => {
    const canvasComponent = canvasRef.current;

    if (canvasComponent) {
      const canvasContext = canvasComponent.getContext("2d");

      if (canvasContext) {
        console.log("!!!REDRAW MINIMAP");

        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        drawChart(canvasComponent, chart);
      }
    }
  }, [canvasRef, canvasWidth, canvasHeight, chart]);

  return { canvasRef, canvasWidth, canvasHeight };
};
