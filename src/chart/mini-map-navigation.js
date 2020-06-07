import { getOppositeSide } from "./utilities";

export default class MiniMapNavigation {
  constructor(options) {
    this.width = options.width;
    this.miniMapState = {
      left: { width: options.width - this.getInitialWindowWidth() },
      center: {
        component: null,
        currentSide: null,
        left: options.width - this.getInitialWindowWidth(),
        right: 0,
      },
      right: { width: 0 },
    };

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

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

  getResizerPosition(side, position) {
    if (side === "right") {
      return this.width - position;
    }

    return position;
  }

  getResizerNewPosition(side, clientX) {
    let newPosition =
      this.miniMapState.center[side] + clientX - this.miniMapState.center[side];

    if (side === "right") {
      newPosition = this.getResizerPosition(side, newPosition);
    }

    return newPosition;
  }

  mouseMoveHandler(mousemoveEvent) {
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

  mouseUpHandler() {
    const { currentSide, component } = this.miniMapState.center;
    this.miniMapState.center[currentSide] = parseInt(
      component.style[currentSide],
      10
    );

    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
  }

  mouseDownHandler(mousedownEvent) {
    const { side } = mousedownEvent.target.dataset;
    this.miniMapState.center.currentSide = side;
    this.miniMapState.center[side] = this.getResizerPosition(
      side,
      mousedownEvent.clientX
    );

    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
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
    leftResizer.addEventListener("mousedown", this.mouseDownHandler);
    rightResizer.addEventListener("mousedown", this.mouseDownHandler);
    miniMap.appendChild(miniMapCenter);

    const miniMapRight = document.createElement("div");
    miniMapRight.classList.add("mini-map__right");
    miniMapRight.style.cssText = `width: ${this.miniMapState.right.width}%;`;
    miniMap.appendChild(miniMapRight);

    this.$component = miniMap;
  }
}
