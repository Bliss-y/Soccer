import { Api } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Position, soccer } from '../soccer.js';
import { SOCCER_STAGE_PLAY, soccerState } from '../soccerState.js';
import { assert } from '../utils/utils.js';

export class PlayApi extends Api<soccer> {
  playerIdx!: number;
  position!: Position;
  click!: boolean;
  flick!: boolean;

  serialize(serializer: Serializer): void {
    this.playerIdx = serializer.uint8(this.playerIdx);
    const position  = {x: 0, y: 0};
    position.x = serializer.int8(this.position.x);
    position.y = serializer.int8(this.position.y);
    this.position = position;
  }

  static validate(api: PlayApi, state: soccerState, playerIdx: number) {
    assert(state.stage === SOCCER_STAGE_PLAY, "Current stage is not PLAY");
    assert(playerIdx === api.playerIdx, "playerIdx for Client and API payload don't match");
  }

  static create(playerIdx: number, position: Position, click: boolean = false,flick: boolean = false) {
    const instance = new PlayApi();
    instance.position = {...position};
    instance.playerIdx = playerIdx;
    instance.flick = flick;
    instance.click = click;
    return instance;
  }
}
