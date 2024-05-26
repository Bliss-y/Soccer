import { Action, Client, Event, Match, Timer } from '@bhoos/game-kit-engine';
import { soccer } from './soccer.js';
import { soccerState } from './soccerState.js';
import { PLAY_TIMER } from './soccerLoop.js';
import { PlayApi } from './apis/PlayApi.js';

export class soccerBot implements Client<soccer> {
  playerId: string;
  playerIdx: number;
  state: soccerState;
  match: Match<soccer>;

  constructor(playerId: string, match: Match<soccer>) {
    this.playerId = playerId;
    this.state = match.getState();
    this.playerIdx = match.getPlayers().findIndex(p => p.id === playerId);
    this.match = match;
  }

  end(_code: number): void {}

  dispatch(_action: Action<soccer>): void {}

  emit(event: Event<soccer>): void {
    if (event instanceof Timer) {
      if (event.target != this.playerIdx) return;
      if (event.type === PLAY_TIMER) {
      }
    }
  }
}
