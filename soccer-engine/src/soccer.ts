import { EventConsumer, Game, Timer } from '@bhoos/game-kit-engine';
import { soccerState } from './soccerState.js';
import { FinishGameAction, StartGameAction, PlayAction } from './actions';
import { Oracle } from '@bhoos/serialization';
import { PlayApi } from './apis';
import { soccerConfig } from './soccerConfig.js';

export interface soccerActionConsumer<Return> {
  onStartGame(action: StartGameAction): Return;
  onPlay(action: PlayAction): Return;
  onFinishGame(action: FinishGameAction): Return;
}

export interface soccerEventConsumer extends EventConsumer {}

export type soccerPlayer = {
  id: string;
  name: string;
  picture: string;
};

export type soccer = Game<soccerActionConsumer<never>, soccerState, soccerEventConsumer, soccerPlayer, soccerConfig>;

export function registerToOracle(oracle: Oracle): Oracle {
  const actions = [StartGameAction, PlayAction, FinishGameAction];

  const apis = [PlayApi];
  const timers = [Timer];

  timers.forEach((timer, idx) => oracle.register(0x1000 + idx, timer, () => new timer()));
  apis.forEach((api, idx) => oracle.register(0x2000 + idx, api, () => new api()));
  actions.forEach((action, idx) => oracle.register(0x4000 + idx, action, () => new action()));

  return oracle;
}
