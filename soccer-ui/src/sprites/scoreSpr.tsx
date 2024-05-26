import { Attribute, Reference, Sprite, timingAnim } from "@bhoos/game-kit-ui";
import { GAME_SIZE_Y, Position } from "@bhoos/soccer-engine";
import { Canvas, Circle, Color, Group, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { Animated} from 'react-native';


export class ScoreSprite implements Sprite {
  position: {
    x: Attribute,
    y: Attribute
  };
  animated = new Attribute(0);
  ref = new Reference([0,0]);
  constructor(position: Position) {
    this.position = {
      x: new Attribute(position.x),
      y: new Attribute(position.y)
    };
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    const text = Reference.use(this.ref);
    return (
    <Animated.View {...props} style= {[StyleSheet.absoluteFill, { transform: [{translateX: this.position.x.value}, {translateY: this.position.y.value }],
        height: 64,
        width: 200
      }]} >
        <Text style={{color: "white", fontSize: 32}} >  {text[0] + " : " + text[1]}</Text>
      </Animated.View>
    )
  }
}

