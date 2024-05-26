import { Client, Event, Match } from "@bhoos/game-kit-engine";
import { Ball, Player, Position, soccer, soccerEventConsumer } from "../soccer";
import { Serializer, Oracle } from "@bhoos/serialization";


type BallT = {
  attachedId: number;
  position: Position;
  attached: boolean;
  scores: number[];
  players: ({position: Position; boosted: boolean})[];
}

export class StateEvent extends Event<soccer>{
  ball!: BallT;

  serialize(serializer: Serializer, oracle: Oracle): void {
    this.ball = serializer.obj(this.ball, (o, sr)=> {
      o.attachedId = sr.uint8(o.attachedId);
      o.position = serializePosition(sr,o.position);
      o.attached = sr.bool(o.attached);
      o.scores = [sr.uint8(o.scores[0]), sr.uint8(o.scores[1])];
      o.players = sr.array(o.players,(p, sr)=> {
        return sr.obj(p, (p, sr)=> {
          p.boosted = sr.bool(p.boosted);
          p.position = serializePosition(sr,p.position);
        })
      })
    })
  }

  forwardTo(consumer: soccerEventConsumer): void {
    consumer.onStateEvent(this);
  }

  static create(ball: Ball) {
    const ins = new StateEvent();
    ins.ball = {...ball};
    return ins;
  }
}


export function serializePosition(serializer: Serializer, position: Position) {
  return serializer.obj(position, (p, sr)=> {
    p.x = sr.int32(p.x);
    p.y = sr.int32(p.y);
  })
}
