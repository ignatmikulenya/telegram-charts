import { getOppositeSide } from "./utilities";

export default class MiniMapNavigation {
  constructor(options) {
    this.width = options.width;
    this.miniMapState = {
      left: { width: options.width - this.getInitialWindowWidth() },
      center: {
        isDragging: false,
        isResizing: false,
        component: null,
        currentSide: null,
        left: options.width - this.getInitialWindowWidth(),
        right: 0,
        mouseX: null,
      },
      right: { width: 0 },
    };

    this.resizerMouseDownHandler = this.resizerMouseDownHandler.bind(this);
    this.resizerMouseUpHandler = this.resizerMouseUpHandler.bind(this);
    this.resizerMouseMoveHandler = this.resizerMouseMoveHandler.bind(this);

    this.centerMouseDownHandler = this.centerMouseDownHandler.bind(this);
    this.centerMouseUpHandler = this.centerMouseUpHandler.bind(this);
    this.centerMouseMoveHandler = this.centerMouseMoveHandler.bind(this);

    this.setComponent();
  }

  get component() {
    return this.$component;
  }

  getInitialWindowWidth() {
    return Math.round(this.width * 0.15);
  }

  getMinimalWindowWidth() {
    return Math.round(this.width * 0.1);
  }

  convertResizerPosition(side, position) {
    if (side === "right") {
      return this.width - position;
    }

    return position;
  }

  getResizerNewPosition(side, clientX) {
    const newPosition =
      this.miniMapState.center[side] + clientX - this.miniMapState.center[side];

    return this.convertResizerPosition(side, newPosition);
  }

  resizerMouseMoveHandler(mousemoveEvent) {
    const { currentSide } = this.miniMapState.center;
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
        this.miniMapState.center.component.style.setProperty(
          currentSide,
          `${newPosition}px`
        );
      }
    }
  }

  resizerMouseUpHandler() {
    const { currentSide, component } = this.miniMapState.center;
    this.miniMapState.center.isResizing = false;
    this.miniMapState.center[currentSide] = parseInt(
      component.style[currentSide],
      10
    );

    document.removeEventListener("mousemove", this.resizerMouseMoveHandler);
    document.removeEventListener("mouseup", this.resizerMouseUpHandler);
  }

  resizerMouseDownHandler(mousedownEvent) {
    if (!this.miniMapState.center.isDragging) {
      const { side } = mousedownEvent.target.dataset;
      this.miniMapState.center.isResizing = true;
      this.miniMapState.center.currentSide = side;
      this.miniMapState.center[side] = this.convertResizerPosition(
        side,
        mousedownEvent.clientX
      );

      document.addEventListener("mousemove", this.resizerMouseMoveHandler);
      document.addEventListener("mouseup", this.resizerMouseUpHandler);
    }
  }

  centerMouseMoveHandler(mousemoveEvent) {
    const { mouseX, left, right } = this.miniMapState.center;
    const delta = mousemoveEvent.clientX - mouseX;

    const newLeft = left + delta;
    const newRight = right - delta;
    if (newLeft >= 0 && newRight >= 0) {
      this.miniMapState.center.component.style.setProperty(
        "left",
        `${newLeft}px`
      );
      this.miniMapState.center.component.style.setProperty(
        "right",
        `${newRight}px`
      );
    }
  }

  centerMouseUpHandler() {
    const { component } = this.miniMapState.center;
    this.miniMapState.center.isDragging = false;
    this.miniMapState.center.left = parseInt(component.style.left, 10);
    this.miniMapState.center.right = parseInt(component.style.right, 10);

    document.removeEventListener("mousemove", this.centerMouseMoveHandler);
    document.removeEventListener("mouseup", this.centerMouseUpHandler);
  }

  centerMouseDownHandler(mousedownEvent) {
    if (!this.miniMapState.center.isResizing) {
      this.miniMapState.center.isDragging = true;
      this.miniMapState.center.mouseX = mousedownEvent.clientX;
      document.addEventListener("mousemove", this.centerMouseMoveHandler);
      document.addEventListener("mouseup", this.centerMouseUpHandler);
    }
  }

  setComponent() {
    const miniMap = document.createElement("div");
    miniMap.classList.add("mini-map");

    const miniMapLeft = document.createElement("div");
    miniMapLeft.classList.add("mini-map__left");
    miniMapLeft.style.cssText = `width: ${this.miniMapState.left.width}px;`;
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
    miniMap.appendChild(miniMapRight);

    this.$component = miniMap;
  }
}
