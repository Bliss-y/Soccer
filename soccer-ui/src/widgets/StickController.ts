import { SpriteManager, ZIndex } from "@bhoos/game-kit-ui";
import { Position } from "@bhoos/soccer-engine/src/soccer";
import { GestureResponderEvent } from "react-native";
import { ControllerWidget } from "./Controller";

type State = {
  active: boolean
}

type Layout = {
  x: number,
  y: number,
  zIndex: number
}

export class StickController extends ControllerWidget {
  max_distance = 100;
  dt = 0;
  cb: (p: Position) => void;
  clickcb: () => void;
  currentDirectionOfClick: Position = {x: 0, y: 0}
  timer: NodeJS.Timer | undefined;
  flickcb: (p: Position) => void;
  touchMove(e: GestureResponderEvent): void {
    const start = this.initialTouchPosition!;
    const now = this.currentTouchPosition!;
    if (e.timeStamp - this.dt < 20) {
      return;
    }
    this.dt = e.timeStamp;
    const dx = now.x - start.x;
    const dy = now.y - start.y;
    const total = Math.abs(dx) + Math.abs(dy);
    if(total < 20) {
      this.cb({x: 0, y: 0})
      return;
    }
    console.log("moving", dx / total, dy / total);
    this.cb({ x: dx / total, y: dy / total });
  }

  touchEnd(e: GestureResponderEvent): void {
    this.cb({ x: 0, y: 0 });
  }

  flick(e: GestureResponderEvent): void {
    const start = this.initialTouchPosition!;
    const now = this.currentTouchPosition!;
    if (e.timeStamp - this.dt < 20) {
      return;
    }
    this.dt = e.timeStamp;
    const dx = now.x - start.x;
    const dy = now.y - start.y;
    const total = Math.abs(dx) + Math.abs(dy);
    console.log("moving", dx / total, dy / total);
    this.flickcb({ x: dx / total, y: dy / total });
  }

  touchStart(e: GestureResponderEvent): void {
  }

  onClick(e: GestureResponderEvent): void {
    this.clickcb();
  }

  constructor(
    sm: SpriteManager,
    computeLayout: () => void,
    computeState: () => void,
    cb: (p: Position) => void,
    onClick: ()=> void,
    onFlick: (p: Position)=> void,
  ) {
    super(sm, computeLayout, computeState);
    this.cb = cb;
    this.flickcb = onFlick;
    this.clickcb = onClick;
  }
}

