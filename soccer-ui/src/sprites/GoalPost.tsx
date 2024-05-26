import { Attribute, Reference, Sprite, timingAnim } from "@bhoos/game-kit-ui";
import { GAME_SIZE_Y, Position } from "@bhoos/soccer-engine";
import { Canvas, Circle, Color, Group, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { Animated} from 'react-native';


export class PostSprite implements Sprite {
  position: {
    x: Attribute,
    y: Attribute
  };
  animated = new Attribute(0);
  constructor(position: Position) {
    this.position = {
      x: new Attribute(position.x),
      y: new Attribute(position.y)
    };
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    return (
    <Animated.View {...props} style= {[StyleSheet.absoluteFill, { transform: [{translateX: this.position.x.value}, {translateY: this.position.y.value }],
        opacity: 0.5,
        height: GAME_SIZE_Y/2,
        width: 4,
        backgroundColor: "white"
      }]} >
      </Animated.View>
    )
  }
}

