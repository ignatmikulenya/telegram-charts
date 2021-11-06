import { getOppositeSide } from "../../utilities/conversions";

import {
  IMiniMapOptions,
  IMiniMapState,
  isSide,
  Side,
} from "../../types/mini-map";

export default class MiniMap {
  protected width: number;
  protected miniMapState: IMiniMapState;
  private _component!: HTMLElement;

  constructor(options: IMiniMapOptions) {
    this.width = options.width;
    this.miniMapState = {
      left: {
        component: null,
        width: options.width - this.getInitialWindowWidth(),
      },
      center: {
        isDragging: false,
        isResizing: false,
        component: null,
        currentSide: null,
        left: options.width - this.getInitialWindowWidth(),
        right: 0,
        mouseX: 0,
      },
      right: {
        component: null,
        width: 0,
      },
    };

    this.resizerMouseDownHandler = this.resizerMouseDownHandler.bind(this);
    this.resizerMouseUpHandler = this.resizerMouseUpHandler.bind(this);
    this.resizerMouseMoveHandler = this.resizerMouseMoveHandler.bind(this);

    this.centerMouseDownHandler = this.centerMouseDownHandler.bind(this);
    this.centerMouseUpHandler = this.centerMouseUpHandler.bind(this);
    this.centerMouseMoveHandler = this.centerMouseMoveHandler.bind(this);

    this.initializeComponent();
  }

  get component() {
    return this._component;
  }

  set component(component: HTMLElement) {
    this._component = component;
  }

  getInitialWindowWidth() {
    return Math.round(this.width * 0.15);
  }

  getMinimalWindowWidth() {
    return Math.round(this.width * 0.1);
  }

  convertResizerPosition(side: Side, position: number) {
    if (side === "right") {
      return this.width - position;
    }

    return position;
  }

  getResizerNewPosition(side: Side, clientX: number) {
    const newPosition =
      this.miniMapState.center[side] + clientX - this.miniMapState.center[side];

    return this.convertResizerPosition(side, newPosition);
  }

  resizerMouseMoveHandler(mousemoveEvent: MouseEvent) {
    const { currentSide } = this.miniMapState.center;

    if (currentSide) {
      const newPosition = this.getResizerNewPosition(
        currentSide,
        mousemoveEvent.clientX
      );

      const oppositeSide = getOppositeSide(currentSide);

      if (oppositeSide) {
        const oppositePosition = this.miniMapState.center[oppositeSide];

        if (
          newPosition >= 0 &&
          newPosition <= this.width &&
          this.width - newPosition - oppositePosition >
            this.getMinimalWindowWidth()
        ) {
          this.miniMapState[currentSide].component?.style.setProperty(
            "width",
            `${newPosition}px`
          );
          this.miniMapState.center.component?.style.setProperty(
            currentSide,
            `${newPosition}px`
          );
        }
      }
    }
  }

  resizerMouseUpHandler() {
    const { currentSide, component } = this.miniMapState.center;

    if (currentSide && component) {
      this.miniMapState.center.isResizing = false;
      this.miniMapState.center[currentSide] = parseInt(
        component.style[currentSide],
        10
      );
      this.miniMapState[currentSide].width = parseInt(
        component.style[currentSide],
        10
      );
    }

    document.removeEventListener("mousemove", this.resizerMouseMoveHandler);
    document.removeEventListener("mouseup", this.resizerMouseUpHandler);
  }

  resizerMouseDownHandler(mousedownEvent: MouseEvent) {
    if (!this.miniMapState.center.isDragging) {
      const target = mousedownEvent.target as HTMLElement | null;

      if (target) {
        const { side } = target.dataset;

        if (side && isSide(side)) {
          this.miniMapState.center.isResizing = true;
          this.miniMapState.center.currentSide = side;
          this.miniMapState.center[side] = this.convertResizerPosition(
            side,
            mousedownEvent.clientX
          );
          this.miniMapState[side].width = this.convertResizerPosition(
            side,
            mousedownEvent.clientX
          );
        }
      }

      document.addEventListener("mousemove", this.resizerMouseMoveHandler);
      document.addEventListener("mouseup", this.resizerMouseUpHandler);
    }
  }

  centerMouseMoveHandler(mousemoveEvent: MouseEvent) {
    const { left, right, center } = this.miniMapState;
    const delta = mousemoveEvent.clientX - center.mouseX;

    const newLeft = center.left + delta;
    const newRight = center.right - delta;
    if (newLeft >= 0 && newRight >= 0) {
      left.component?.style.setProperty("width", `${newLeft}px`);
      center.component?.style.setProperty("left", `${newLeft}px`);

      right.component?.style.setProperty("width", `${newRight}px`);
      center.component?.style.setProperty("right", `${newRight}px`);
    }
  }

  centerMouseUpHandler() {
    const { component } = this.miniMapState.center;
    this.miniMapState.center.isDragging = false;
    if (component) {
      this.miniMapState.center.left = parseInt(component.style.left, 10);
      this.miniMapState.center.right = parseInt(component.style.right, 10);
      this.miniMapState.left.width = parseInt(component.style.left, 10);
      this.miniMapState.right.width = parseInt(component.style.right, 10);
    }

    document.removeEventListener("mousemove", this.centerMouseMoveHandler);
    document.removeEventListener("mouseup", this.centerMouseUpHandler);
  }

  centerMouseDownHandler(mousedownEvent: MouseEvent) {
    if (!this.miniMapState.center.isResizing) {
      this.miniMapState.center.isDragging = true;
      this.miniMapState.center.mouseX = mousedownEvent.clientX;
      document.addEventListener("mousemove", this.centerMouseMoveHandler);
      document.addEventListener("mouseup", this.centerMouseUpHandler);
    }
  }

  initializeComponent() {
    const miniMap = document.createElement("div");
    miniMap.classList.add("mini-map");

    const miniMapLeft = document.createElement("div");
    miniMapLeft.classList.add("mini-map__left");
    miniMapLeft.style.cssText = `width: ${this.miniMapState.left.width}px;`;
    this.miniMapState.left.component = miniMapLeft;
    miniMap.appendChild(miniMapLeft);

    const miniMapCenter = document.createElement("div");
    miniMapCenter.classList.add("mini-map__center");
    miniMapCenter.style.setProperty(
      "left",
      `${this.miniMapState.center.left}px`
    );
    miniMapCenter.style.setProperty(
      "right",
      `${this.miniMapState.center.right}px`
    );

    const leftResizer = document.createElement("div");
    leftResizer.classList.add("resizer", "resizer__left");
    leftResizer.dataset.side = "left";
    miniMapCenter.appendChild(leftResizer);

    const rightResizer = document.createElement("div");
    rightResizer.classList.add("resizer", "resizer__right");
    rightResizer.dataset.side = "right";
    miniMapCenter.appendChild(rightResizer);

    this.miniMapState.center.component = miniMapCenter;
    leftResizer.addEventListener("mousedown", this.resizerMouseDownHandler);
    rightResizer.addEventListener("mousedown", this.resizerMouseDownHandler);
    miniMap.appendChild(miniMapCenter);

    miniMapCenter.addEventListener("mousedown", this.centerMouseDownHandler);

    const miniMapRight = document.createElement("div");
    miniMapRight.classList.add("mini-map__right");
    miniMapRight.style.cssText = `width: ${this.miniMapState.right.width}%;`;
    this.miniMapState.right.component = miniMapRight;
    miniMap.appendChild(miniMapRight);

    this.component = miniMap;
  }
}
