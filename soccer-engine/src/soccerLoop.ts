import { Timer, Match } from '@bhoos/game-kit-engine';
import { StartGameAction } from './actions/index.js';
import { StateEvent } from './actions/StateEvent.js';
import { PlayApi } from './apis/index.js';
import { Ball, GAME_SIZE_X, GAME_SIZE_Y, Player, PLAYER_RADIUS, Position, soccer } from './soccer.js';
import { soccerConfig } from './soccerConfig.js';
import { validateConfig } from './utils/validateConfig.js';

export const PLAY_TIMER = 3000;

export async function soccerLoop(match: Match<soccer>, config: soccerConfig) {
  // Initialization
  if (match.getEndingCode() !== null) return match;
  if (!validateConfig(match.getPlayers().length, config)) {
    console.error(`Invalid config`);
    return match.end(1);
 }

  let controls: (PlayApi | undefined)[] = [undefined, undefined, undefined, undefined];

  const playTimer = match.createPersistentEvent(() => {
    return Timer.create(1, PLAY_TIMER, 1, -1);
  });

  const state = match.getState();

  const players = match.getPlayers().map((e, idx)=> {
    return new Player({y: GAME_SIZE_Y/2, x: GAME_SIZE_X - 200 * (3 - idx) - 100}, PLAYER_RADIUS, Math.floor(idx / 2));
  })
  console.log(players.map(p=>p.position));

  console.log("players length",players.length);

  const ball = new Ball({x: GAME_SIZE_X/2, y: GAME_SIZE_Y/2}, PLAYER_RADIUS/2, ()=> {
    players.forEach((p,i)=> {
      p.movementSpeed = {x:0, y:0}
      p.direction = {x:0, y:1}
      p.position = {...p.initialPosition}
    })
    ball.position.y = GAME_SIZE_Y/2
    ball.position.x = GAME_SIZE_X/2
    ball.movement_speed.x = 0
    ball.movement_speed.y = 0
    haltTick = 40;
  });
  ball.players = players;

  ball.position = {x: GAME_SIZE_X/2, y: GAME_SIZE_Y/2};
  let haltTick = 50;
  // Stage 1: GAME START
  match.dispatch(StartGameAction.create(match.getPlayers()));

  match.wait(playTimer, (ctx) => {
    ctx.on(PlayApi, (api) => {
      return true;
    }, (api, t) => {
      console.log("got api?", api.position);
      if(api.position.x === null || api.position.y === null){
        return;
      }
      controls[api.playerIdx] = api;
    });
  });


  while(match.getEndingCode() == null ) {
    await sleep(50);
    if(haltTick > 0) {
      haltTick--;
      continue;
    }

    controls.forEach((c,idx)=> {
      if(!c) {
        return;
      }
      players[idx].onInput(c, ball);
    })

    players.forEach(p=> {
      p.update(0);
    })

    ball.update(0);
    
    controls = [undefined, undefined, undefined, undefined];
    match.emit(StateEvent.create(ball), true);
  }


  match.end(0);
}

async function sleep(n: number) {
  return new Promise(r=>setTimeout(r,n));
}

