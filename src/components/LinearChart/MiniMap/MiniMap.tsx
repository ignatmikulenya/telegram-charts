import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { UI_ID_MAP } from "constants/uiId";
import { Chart } from "api/types";

import { useMiniMap } from "./MiniMap.hooks";

const StyledMiniMap = styled.div`
  position: relative;

  flex-shrink: 0;

  width: 100%;
  height: 40px;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const StyledHover = styled.div`
  position: absolute;
  top: 0;

  display: flex;
  flex-direction: row;

  width: 100%;
  height: 100%;
`;

type StyledBlurProps = {
  width: number;
};

const StyledBlur = styled.div.attrs<StyledBlurProps>((props) => ({
  style: {
    flexBasis: `${props.width}px`,
  },
}))`
  height: 100%;

  background-color: rgba(245, 249, 251, 0.6);
`;

type StyledResizerWindowProps = {
  width: number;
};

const StyledWindow = styled.div.attrs<StyledResizerWindowProps>((props) => ({
  style: {
    flexBasis: `${props.width}px`,
  },
}))`
  display: flex;
  flex-direction: row;

  height: 100%;
`;

const StyledResizer = styled.div`
  width: 4px;
  height: 100%;

  background-color: rgba(221, 234, 243, 0.6);

  cursor: ew-resize;
`;

const StyledCenterSection = styled.div`
  flex-grow: 1;

  border-style: solid;
  border-color: rgba(221, 234, 243, 0.6);
  border-top-width: 2px;
  border-right-width: 0;
  border-bottom-width: 2px;
  border-left-width: 0;

  cursor: grab;
`;

type MiniMapProps = {
  chart: Chart;
  className?: string;
};

export const MiniMap: FC<MiniMapProps> = ({ chart, className }) => {
  const [hoverSizes, setHoverSizes] = useState<[number, number, number] | null>(
    null
  );
  const centerSectionPosRef = useRef<number>(0);
  const leftResizerInitPosRef = useRef<number>(0);
  const rightResizerInitPosRef = useRef<number>(0);
  const currentResizerRef = useRef<null | "left" | "right">(null);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const windowInitWidthRef = useRef<number>(0);
  const canWindowSlideRef = useRef(false);

  const { canvasRef, canvasWidth, canvasHeight } = useMiniMap(chart);

  useEffect(() => {
    const newCenterSectionWidth = Math.round(canvasWidth * 0.15);
    const newLeftBlurWidth = canvasWidth - newCenterSectionWidth;

    setHoverSizes([newLeftBlurWidth, newCenterSectionWidth, 0]);
  }, [canvasWidth]);

  const handleLeftResizerMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const currentResizer = currentResizerRef.current;
      const leftResizerInitPos = leftResizerInitPosRef.current;
      const windowInitWidth = windowInitWidthRef.current;

      if (currentResizer === "left") {
        const minWindowWidth = Math.round(canvasWidth * 0.1);
        const clientX = event.clientX;
        const toLeft = clientX < leftResizerInitPos;

        const widthDelta = toLeft
          ? leftResizerInitPos - clientX
          : clientX - leftResizerInitPos;

        const newWindowWidth = toLeft
          ? windowInitWidth + widthDelta
          : windowInitWidth - widthDelta;

        setHoverSizes((prevSizes) => {
          if (prevSizes == null) {
            return prevSizes;
          }

          const [, , prevRightBlurWidth] = prevSizes;
          const newLeftBlurWidth =
            canvasWidth - prevRightBlurWidth - newWindowWidth;

          return newLeftBlurWidth >= 0 && newWindowWidth > minWindowWidth
            ? [newLeftBlurWidth, newWindowWidth, prevRightBlurWidth]
            : prevSizes;
        });
      }
    },
    [canvasWidth]
  );

  const handleRightResizerMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const currentResizer = currentResizerRef.current;
      const rightResizerInitPos = rightResizerInitPosRef.current;
      const windowInitWidth = windowInitWidthRef.current;

      if (currentResizer === "right") {
        const minWindowWidth = Math.round(canvasWidth * 0.1);
        const clientX = event.clientX;
        const toRight = clientX > rightResizerInitPos;

        const widthDelta = toRight
          ? clientX - rightResizerInitPos
          : rightResizerInitPos - clientX;

        const newWindowWidth = toRight
          ? windowInitWidth + widthDelta
          : windowInitWidth - widthDelta;

        setHoverSizes((prevSizes) => {
          if (prevSizes == null) {
            return prevSizes;
          }

          const [prevLeftBlurWidth] = prevSizes;
          const newRightBlurWidth =
            canvasWidth - prevLeftBlurWidth - newWindowWidth;

          return newRightBlurWidth >= 0 && newWindowWidth > minWindowWidth
            ? [prevLeftBlurWidth, newWindowWidth, newRightBlurWidth]
            : prevSizes;
        });
      }
    },
    [canvasWidth]
  );

  const handleMiniMapMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const uiId = (event.target as HTMLElement).dataset.uiId;
      const windowComponent = windowRef.current;

      switch (uiId) {
        case UI_ID_MAP.miniMap.leftResizer: {
          leftResizerInitPosRef.current = event.clientX;

          if (windowComponent) {
            windowInitWidthRef.current = windowComponent.offsetWidth;
          }

          currentResizerRef.current = "left";
          break;
        }
        case UI_ID_MAP.miniMap.centerSection: {
          centerSectionPosRef.current = event.clientX;

          if (windowComponent) {
            windowInitWidthRef.current = windowComponent.offsetWidth;
          }

          canWindowSlideRef.current = true;
          break;
        }
        case UI_ID_MAP.miniMap.rightResizer: {
          rightResizerInitPosRef.current = event.clientX;

          if (windowComponent) {
            windowInitWidthRef.current = windowComponent.offsetWidth;
          }

          currentResizerRef.current = "right";
          break;
        }
        default:
          break;
      }
    },
    []
  );

  const handleCenterSectionMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const centerSectionPos = centerSectionPosRef.current;
      const windowComponent = windowRef.current;

      if (windowComponent) {
        const clientX = event.clientX;
        const toRight = clientX > centerSectionPos;

        const positionDelta = toRight
          ? clientX - centerSectionPos
          : centerSectionPos - clientX;

        centerSectionPosRef.current = clientX;

        setHoverSizes((prevSizes) => {
          if (prevSizes == null) {
            return prevSizes;
          }

          const [prevLeftBlurWidth, prevWindowWidth, prevRightBlurWidth] =
            prevSizes;

          const newRightBlurWidth = toRight
            ? prevRightBlurWidth - positionDelta
            : prevRightBlurWidth + positionDelta;

          const newLeftBlurWidth = toRight
            ? prevLeftBlurWidth + positionDelta
            : prevLeftBlurWidth - positionDelta;

          return newRightBlurWidth >= 0 && newLeftBlurWidth >= 0
            ? [newLeftBlurWidth, prevWindowWidth, newRightBlurWidth]
            : prevSizes;
        });
      }
    },
    []
  );

  const handleMiniMapMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (currentResizerRef.current === "left") {
        handleLeftResizerMove(event);
      } else if (currentResizerRef.current === "right") {
        handleRightResizerMove(event);
      } else if (canWindowSlideRef.current) {
        handleCenterSectionMove(event);
      }
    },
    [handleCenterSectionMove, handleLeftResizerMove, handleRightResizerMove]
  );

  const handleMiniMapClearState = useCallback(() => {
    currentResizerRef.current = null;
    canWindowSlideRef.current = false;
  }, []);

  console.log("!!!RE-RENDER MINI_MAP");

  return (
    <StyledMiniMap
      onMouseDown={handleMiniMapMouseDown}
      onMouseUp={handleMiniMapClearState}
      onMouseMove={handleMiniMapMouseMove}
      onMouseLeave={handleMiniMapClearState}
      className={className}
    >
      <StyledCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      {hoverSizes != null ? (
        <StyledHover>
          <StyledBlur width={hoverSizes[0]} />
          <StyledWindow ref={windowRef} width={hoverSizes[1]}>
            <StyledResizer data-ui-id={UI_ID_MAP.miniMap.leftResizer} />
            <StyledCenterSection data-ui-id={UI_ID_MAP.miniMap.centerSection} />
            <StyledResizer data-ui-id={UI_ID_MAP.miniMap.rightResizer} />
          </StyledWindow>
          <StyledBlur width={hoverSizes[2]} />
        </StyledHover>
      ) : null}
    </StyledMiniMap>
  );
};
