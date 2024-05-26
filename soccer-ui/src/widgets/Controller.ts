import { SpriteManager, Widget, setLayout } from "@bhoos/game-kit-ui";
import { GestureResponderEvent, NativeTouchEvent } from "react-native";
import { ControllerSprite } from "../sprites";

type Layout = {
  x: number,
  y: number,
  zIndex: number
};

type State = {
  active: boolean
}

type Position = {
  x: number,
  y: number
}

function square(x: number) {
  return x * x;
}
export abstract class ControllerWidget extends Widget<unknown,unknown,SpriteManager> {
  spr: ControllerSprite;
  initialTouchPosition?: Position;
  currentTouchPosition?: Position;
  touch?: NativeTouchEvent;
  initialTouchTimestamp?: number;
  isTouching = false;
  touch2: {id: string, timestamp: number}| undefined =  undefined;
  abstract onClick(e: GestureResponderEvent): void;
  abstract touchEnd(e: GestureResponderEvent): void;
  abstract touchStart(e: GestureResponderEvent): void;
  abstract touchMove(e: GestureResponderEvent): void;
  abstract flick(e: GestureResponderEvent): void;

  constructor(
    sm: SpriteManager,
    computeLayout: () => void,
    computeState: () => void,
  ) {
    super(sm, computeLayout, computeState);
    this.spr = sm.registerSprite(new ControllerSprite({
      onClick: (e: GestureResponderEvent) => {
        if(this.isTouching) {
          return;
        }
        console.log("controller clicked!!!!!", e.nativeEvent.locationX, e.nativeEvent.locationY);
        this.onClick(e);
      },
      //@ts-ignore
      touchEnd: (e) => {
        if (e.nativeEvent.identifier != this.touch?.identifier) {
          if(e.nativeEvent.identifier == this.touch2?.id) {
            if(Date.now() - this.touch2.timestamp < 200) {
              this.onClick(e);
            }
            this.touch2 = undefined;
          }
          return;
        }
        console.log("touch end", e.nativeEvent.timestamp, this.initialTouchTimestamp);
        if (e.nativeEvent.timestamp - this.initialTouchTimestamp! < 100 &&
          square(square(e.nativeEvent.locationX - this.initialTouchPosition!.x) + square(e.nativeEvent.locationY - this.initialTouchPosition!.y)) > 30 * 30) {
          this.flick(e);
          console.log("flicked!!");
        }
        this.touchEnd(e);
        this.initialTouchPosition = undefined;
        this.initialTouchTimestamp = undefined;
        this.isTouching = false;
      },
      touchStart: (e) => {
        if (this.isTouching) {
          this.touch2 = {id: '', timestamp: 0};
          this.touch2!.id = e.nativeEvent.identifier;
          this.touch2!.timestamp = e.nativeEvent.timestamp;
          return;
        }
        console.log("touch start", e.nativeEvent.identifier, e.nativeEvent.timestamp);
        this.isTouching = true;
        this.touch = e.nativeEvent;
        this.initialTouchTimestamp = e.nativeEvent.timestamp;
        this.initialTouchPosition = {
          x: e.nativeEvent.locationX, y: e.nativeEvent.locationY
        }
        this.touchStart(e);
      },
      touchMove: (e) => {
        if (e.nativeEvent.identifier != this.touch?.identifier) {
          return;
        }
        if (e.nativeEvent.timestamp - this.initialTouchTimestamp! < 100 &&
          square(square(e.nativeEvent.locationX - this.initialTouchPosition!.x) + square(e.nativeEvent.locationY - this.initialTouchPosition!.y)) > 30 * 30) {
          return;
        }
        console.log("moving");
        this.currentTouchPosition = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }
        this.touchMove(e);
      }
    }));
  }

  protected onDraw(): void {
  }

  protected onLayoutUpdate(): void {
  }
}

