import { FC } from "react";
import { css, styled } from "styled-components";
import { Chart } from "api/types";

import { useLinearChart } from "./LinearChart.hooks";
import { MiniMap } from "./MiniMap/MiniMap";

type StyledLinearChartProps = {
  width: string;
  height: string;
};

const StyledLinearChart = styled.div<StyledLinearChartProps>`
  display: flex;
  flex-direction: column;

  ${({ width, height }) => css`
    width: ${width};
    height: ${height};
  `}
`;

const StyledTitle = styled.p`
  margin-bottom: 10px;

  font-size: 18px;
  font-weight: 500;
  color: #222222;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const StyledMiniMap = styled(MiniMap)`
  margin-top: 14px;
`;

type LinearChartProps = {
  title: string;
  chart: Chart;
  width?: string | number;
  height?: string | number;
  barsCount?: number;
};

export const LinearChart: FC<LinearChartProps> = ({
  title,
  chart,
  width = "100%",
  height = 390,
}) => {
  const chartWidth = typeof width === "number" ? `${width}px` : width;
  const chartHeight = typeof height === "number" ? `${height}px` : height;

  const { canvasRef, canvasWidth, canvasHeight } = useLinearChart(chart);

  return (
    <StyledLinearChart width={chartWidth} height={chartHeight}>
      <StyledTitle>{title}</StyledTitle>
      <StyledCanvas
        ref={canvasRef}
        width={canvasWidth ?? 0}
        height={canvasHeight ?? 0}
      />
      <StyledMiniMap chart={chart} />
    </StyledLinearChart>
  );
};
