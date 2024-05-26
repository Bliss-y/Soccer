import { Attribute, Image, ImageBackground, Reference, Sprite, timingAnim } from "@bhoos/game-kit-ui";
import { Canvas, Circle, Color, Group, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { Animated} from 'react-native';
import { Position } from "@bhoos/soccer-engine";


export class EricSprite implements Sprite {
  position: {
    x: Attribute,
    y: Attribute
  };
  scale = new Attribute(1);
  opacity = new Attribute(0);
  animated = new Attribute(0);
  picture = new Reference("erichappy");
  constructor(position: Position) {
    this.position = {
      x: new Attribute(position.x),
      y: new Attribute(position.y)
    };
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    const picture = Reference.use(this.picture);
    return (
    <Animated.View {...props} style= {[StyleSheet.absoluteFill, { transform: [{translateX: this.position.x.animated}, {translateY: this.position.y.animated }, {scale: this.scale.animated}],
        opacity: this.opacity.animated,
        backgroundColor:"white",
        height: 100,
        width: 100
      }]} >
      {picture == 'erichappy' ? <Image path={'/soccer/erichappy'} resizeMode="cover" style={{
          height: 100,
          width: 100
        }} /> : <Image path={'/soccer/' + 'sadEric'} resizeMode="cover" style={{
          height: 100,
          width: 100
        }} /> }
      </Animated.View>
    )
  }
}

