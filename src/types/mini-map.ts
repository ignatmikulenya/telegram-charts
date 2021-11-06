export type Side = "left" | "right";

export function isSide(side: string): side is Side {
  const sides: Side[] = ["left", "right"];
  return sides.includes(side as Side);
}

export interface IMiniMapOptions {
  width: number;
}

export interface IMiniMapState {
  left: {
    component: HTMLElement | null;
    width: number;
  };
  center: {
    isDragging: boolean;
    isResizing: boolean;
    component: HTMLElement | null;
    currentSide: Side | null;
    left: number;
    right: number;
    mouseX: number;
  };
  right: {
    component: HTMLElement | null;
    width: number;
  };
}
