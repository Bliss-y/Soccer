import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { soccer, soccerActionConsumer } from '../soccer.js';

export class FinishGameAction extends Action<soccer> {
  winnerIdx!: number;

  forwardTo<R>(consumer: soccerActionConsumer<R>): R {
    return consumer.onFinishGame(this);
  }

  serialize(serializer: Serializer) {
    this.winnerIdx = serializer.uint8(this.winnerIdx);
  }

  personalize(_client: Client<soccer>, _match: Match<soccer>) {
    return this;
  }

  static create(winnerIdx: number) {
    const instance = new FinishGameAction();
    instance.winnerIdx = winnerIdx;

    return instance;
  }
}
