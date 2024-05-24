import { SOCCER_STAGE_END, SOCCER_STAGE_PLAY, SOCCER_STAGE_START, soccer, soccerState } from '@bhoos/soccer-engine';
import { GameAppAnalyticsInterface, AnalyticsGameStageIdentifiers } from '@bhoos/super-app-interface';

export const soccerAnalytics: GameAppAnalyticsInterface<soccer> = {
  gameConfigId: room => `timer:${room.config.playTimer}`,
  gameExitStage: state => `st:${formatStage(state.stage)}`,
};

function formatStage(stage: soccerState['stage']) {
  if (stage === SOCCER_STAGE_END) return AnalyticsGameStageIdentifiers.matchEnd;
  if (stage === SOCCER_STAGE_START) return AnalyticsGameStageIdentifiers.matchStart;
  return AnalyticsGameStageIdentifiers.failSafe;
}
