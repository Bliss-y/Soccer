import { Client, Event, Match } from "@bhoos/game-kit-engine";
import { Ball, Player, Position, soccer, soccerEventConsumer } from "../soccer";
import { Serializer, Oracle } from "@bhoos/serialization";


type BallT = {
  attachedId: number;
  position: Position;
  attached: boolean;
  attachedPlayer: Player | undefined;
  scores: number[];
  players: Player[];
  base_speed: number;
  friction_rate: number;
  max_speed: number;
  direction: Position;
  movement_speed: Position;
}

export class StateEvent extends Event<soccer>{
  ball!: BallT;

  serialize(serializer: Serializer, oracle: Oracle): void {
    
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
