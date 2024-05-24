import { soccerActionConsumer } from './soccer.js';
import { StartGameAction } from './actions/StartGameAction.js';
import { PlayAction } from './actions/PlayAction.js';
import { FinishGameAction } from './actions/FinishGameAction.js';

export interface soccerStatePlayer {
  id: string;
  name: string;
  picture: string;

  clickCount: number;
}

export const SOCCER_STAGE_START = 1;
export const SOCCER_STAGE_PLAY = 2;
export const SOCCER_STAGE_END = 3;


export type SOCCER_STAGE = typeof SOCCER_STAGE_START | typeof SOCCER_STAGE_PLAY | typeof SOCCER_STAGE_END;

export class soccerState implements soccerActionConsumer<void> {
  stage: SOCCER_STAGE = SOCCER_STAGE_START;
  players: soccerStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;
  winnerIdx: number = -1;

  onStartGame(action: StartGameAction): void {
    this.stage = SOCCER_STAGE_PLAY;
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,

      clickCount: 0,
    }));

    this.userIdx = action.userIdx;
    this.turn = 0;
  }

  onPlay(action: PlayAction): void {
    this.players[action.playerIdx].clickCount++;
  }

  onFinishGame(action: FinishGameAction): void {
    this.stage = SOCCER_STAGE_END;
    this.winnerIdx = action.winnerIdx;
  }
}
