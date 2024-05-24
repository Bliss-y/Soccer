import { soccer } from '@bhoos/soccer-engine';
import { RoomConfig } from '@bhoos/super-app-interface';
import { StateOf } from '@bhoos/game-kit-engine';

export function computesoccerWinnings(state: StateOf<soccer>, roomConfig: RoomConfig<soccer>, playerIdx: number) {
  if (state.winnerIdx === -1) return -roomConfig.boot;
  if (state.winnerIdx === playerIdx) return roomConfig.boot * (state.players.length - 1);
  return -roomConfig.boot;
}
