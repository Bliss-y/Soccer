import { Match } from '@bhoos/game-kit-engine';
import { testGameLoop } from '@bhoos/game-kit-tests';
import { soccerState } from '../soccerState';
import { soccer, soccerPlayer, soccerBot, soccerConfig, soccerLoop, registerToOracle } from '..';
import { describe, test, expect } from 'vitest';
import { Oracle } from '@bhoos/serialization';

const DEFAULT_CONFIG: soccerConfig = {
  playTimer: -1,
};

function createsoccerMatch(playersCount: number = 4) {
  const players: soccerPlayer[] = [];
  for (var idx = 0; idx < playersCount; idx++) {
    players.push({
      id: `${idx}`,
      name: `player${idx}`,
      picture: `${idx}`,
    });
  }

  const match = new Match<soccer>(players, soccerState);
  players.map(p => {
    const bot = new soccerBot(p.id, match);
    match.join(bot);
    return bot;
  });
  return match;
}

describe('Game Loop runs correctly', () => {
  test('game-kit-test succeeds', async () => {
    const oracle = new Oracle();
    registerToOracle(oracle);

    const out = await testGameLoop<soccer>(
      soccerState,
      () => createsoccerMatch(),
      match => soccerLoop(match, DEFAULT_CONFIG),
      oracle,
      10,
    );
    if (out != null) console.log(out);
    expect(out).toBeNull();
  });
});
