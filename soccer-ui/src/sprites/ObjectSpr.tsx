import { Attribute, Reference, Sprite, timingAnim } from "@bhoos/game-kit-ui";
import { Canvas, Circle, Color, Group, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { Animated} from 'react-native';
import { Position } from "@bhoos/soccer-engine/src/soccer"; 


export class CircleSprite implements Sprite {
  position: {
    x: Attribute,
    y: Attribute
  };
  color: string;
  animated = new Attribute(0);
  radius: number;
  constructor(radius: number,position: Position, color: string) {
    this.position = {
      x: new Attribute(position.x),
      y: new Attribute(position.y)
    };
    this.radius = radius;
    this.color = color;
  }
  onLayoutUpdate(position: Position, destroyed: boolean, radius: number) {
    this.position.x.animateTo(position.x - radius, timingAnim({duration: 35, useNativeDriver: true}))
    this.position.y.animateTo(position.y - radius, timingAnim({duration: 35, useNativeDriver: true}))
    this.radius = radius;
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    return (
    <Animated.View {...props} style= {[StyleSheet.absoluteFill, { transform: [{translateX: this.position.x.animated}, {translateY: this.position.y.animated }],
        opacity: 0.5,
        height: this.radius*2,
        width: this.radius*2,
        backgroundColor: this.color,
        borderRadius: this.radius
      }]} >
      </Animated.View>
    )
  }
}

