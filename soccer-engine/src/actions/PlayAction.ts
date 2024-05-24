import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { soccer, soccerActionConsumer } from '../soccer.js';

export class PlayAction extends Action<soccer> {
  playerIdx!: number;

  forwardTo<R>(consumer: soccerActionConsumer<R>): R {
    return consumer.onPlay(this);
  }

  serialize(serializer: Serializer) {
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  personalize(_client: Client<soccer>, _match: Match<soccer>) {
    return this;
  }

  static create(playerIdx: number) {
    const instance = new PlayAction();
    instance.playerIdx = playerIdx;

    return instance;
  }
}
