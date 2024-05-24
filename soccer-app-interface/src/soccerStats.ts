import { soccerConfig, soccerState } from '@bhoos/soccer-engine';
import { StatId } from '@bhoos/super-app-interface';

export function computesoccerStats(state: soccerState, config: soccerConfig, playerIdx: number) {
  const stats = new Map<StatId | number, number>();
  stats.set(StatId.GamesPlayed, 1);

  const playerWon = state.winnerIdx != -1 && playerIdx === state.winnerIdx;
  stats.set(StatId.Rank1, playerWon ? 1 : 0);
  return stats;
}
