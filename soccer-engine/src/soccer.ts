import { EventConsumer, Game, Timer } from '@bhoos/game-kit-engine';
import { soccerState } from './soccerState.js';
import { FinishGameAction, StartGameAction, PlayAction } from './actions';
import { Oracle } from '@bhoos/serialization';
import { PlayApi } from './apis';
import { soccerConfig } from './soccerConfig.js';
import { StateEvent } from './actions/StateEvent.js';
import { warn } from 'console';

export const GAME_SIZE_Y = 400;
export const GAME_SIZE_X = 800;
export const GAME_CENTER_X = GAME_SIZE_X/2;
export const GAME_CENTER_Y = GAME_SIZE_Y/2;
export const PLAYER_MOVEMENT_SPEED_DEFAULT = 7;
export const PLAYER_MOVEMENT_SPEED_BOOSTED = 10;
export const PLAYER_MOVEMENT_SPEED_SLOWED = 3;
export const PLAYER_RADIUS = 40;
export const GOAL_POST_WIDTH = GAME_SIZE_X/2;
export const goalPosts = [{y: GAME_SIZE_Y/2 - GOAL_POST_WIDTH, x: GAME_SIZE_X},{y: GAME_SIZE_Y/2, x: 0}]

export interface soccerActionConsumer<Return> {
  onStartGame(action: StartGameAction): Return;
  onPlay(action: PlayAction): Return;
  onFinishGame(action: FinishGameAction): Return;
}

export interface soccerEventConsumer extends EventConsumer {
  onStateEvent(event: StateEvent): void;
}

export type soccerPlayer = {
  id: string;
  name: string;
  picture: string;
};

export type soccer = Game<soccerActionConsumer<never>, soccerState, soccerEventConsumer, soccerPlayer, soccerConfig>;

export function registerToOracle(oracle: Oracle): Oracle {
  const actions = [StartGameAction, PlayAction, FinishGameAction];
  const apis = [PlayApi];
  const timers = [Timer, StateEvent];
  timers.forEach((timer, idx) => oracle.register(0x1000 + idx, timer, () => new timer()));
  apis.forEach((api, idx) => oracle.register(0x2000 + idx, api, () => new api()));
  actions.forEach((action, idx) => oracle.register(0x4000 + idx, action, () => new action()));

  return oracle;
}

export type Position = {
  x: number;
  y: number;
}

export abstract class GameObject {
  position: Position;
  radius: number;
  abstract update(tick: number): void;

  constructor(position: Position, radius: number) {
    this.position = position;
    this.radius = radius;
  }
}

// movement speed is the direction that the player is moving?
export class Player extends GameObject{
  id = 0;
  movementSpeed: Position = {x: 0, y: 0}
  direction: Position = {x: 1, y: 0};
  boosted = false;
  boostedTick = 0;
  boostCd = 0;
  team: number;
  initialPosition: Position;
  constructor(position: Position, radius: number, team: number) {
    super(position, radius);
    this.team = team;
    this.initialPosition = {...position}
  }

  update(tick: number){
    if(this.boosted) {
      this.movementSpeed.x = PLAYER_MOVEMENT_SPEED_BOOSTED;
      this.movementSpeed.y = PLAYER_MOVEMENT_SPEED_BOOSTED;
    }
    const newposx = this.position.x + this.movementSpeed.x * this.direction.x;
    const newposy = this.position.y + this.movementSpeed.y * this.direction.y;
    this.position.x = newposx;
    this.position.y = newposy;
    const wallTouch = wallCollision(this.position, this.radius);

    if(wallTouch.x) {
      this.position.x -= wallTouch.x;
    }

    if(wallTouch.y) {
      this.position.y -= wallTouch.y
    }
  }

  onInput(api: PlayApi) {
    if(api.flick && this.boostCd == 0) {
      this.boosted = true;
      this.boostCd = 100;
      return;
    }
    if(api.position.x == 0 && api.position.y == 0) {
      this.movementSpeed.x = 0;
      this.movementSpeed.y = 0;
      return;
    }
    this.direction = {...api.position}
    this.movementSpeed.x = PLAYER_MOVEMENT_SPEED_DEFAULT;
    this.movementSpeed.y = PLAYER_MOVEMENT_SPEED_DEFAULT;
  }
}

export function wallCollision(position: Position, radius: number) {
  const collisionPos = {x: 0, y: 0};
  collisionPos.x = Math.min(position.x - radius - 0, 0)
  collisionPos.x += Math.max((position.x + radius) - GAME_SIZE_X, 0);
  collisionPos.y = Math.min(position.y - radius - 0, 0)
  collisionPos.y += Math.max((position.y + radius) - GAME_SIZE_Y, 0);
  return collisionPos;
}


// this function returns the amount of correction needed for perfect touch
export function circleCollision(obj1: GameObject, obj2: GameObject) {
  
  const collisionPos = {x: 0, y: 0};

  const dx = obj1.position.x - obj2.position.x;
  const dy = obj1.position.y - obj2.position.y;
  const direction = {x: dx/Math.abs(dx), y: dx/Math.abs(dy)};

  if(Math.abs(dx) + Math.abs(dy) - (obj1.radius + obj2.radius) < 0) {
    console.log("collision", dx, dy);
    collisionPos.x = dx;
    collisionPos.y = dy;
    if(dx == 0 && dy == 0) {
      collisionPos.x = obj1.radius + obj2.radius;
      collisionPos.y = obj1.radius + obj2.radius;
    }
  }
  return collisionPos;
}


// ball is basically the main state of the game
// because this game is all about where the ball is 

export class Ball extends GameObject {
  attachedId: number = -1;
  attached = false;
  attachedPlayer: Player | undefined = undefined;
  scores = [0,0];
  players: Player[] = [];
  base_speed = 0;
  friction_rate = 1;
  max_speed = 10;
  direction: Position = {x: 0, y: 0};
  movement_speed = {x: 0, y: 0}
  onGoal: ()=>void;

  constructor(position: Position, radius: number, onGoal: ()=>void) {
    super(position, radius);
    this.onGoal = onGoal;
  }

  update(tick: number){
    if(this.attachedPlayer) {
      this.position.x = this.attachedPlayer.position.x + this.attachedPlayer.direction.x * (this.attachedPlayer.radius + this.radius);
      this.position.y = this.attachedPlayer.position.y +  this.attachedPlayer.direction.y * (this.attachedPlayer.radius + this.radius);
    } else {
      this.position.x += this.direction.x * this.movement_speed.x;
      this.position.y += this.direction.y * this.movement_speed.y;
      this.movement_speed.x -= this.friction_rate;
      this.movement_speed.y -= this.friction_rate;
    }

    this.players.forEach((p,idx)=> {
      const cl = circleCollision(this, p);
      if(cl.x != 0 || cl.y != 0) {
        console.log("attaching to ", idx, p);
        this.attachedPlayer = p;
        this.position.x = this.attachedPlayer.position.x +  this.attachedPlayer.direction.x * (this.attachedPlayer.radius + this.radius);
        this.position.y = this.attachedPlayer.position.y +  this.attachedPlayer.direction.y * (this.attachedPlayer.radius + this.radius);
      }
    })

    if(this.position.x + this.radius > goalPosts[0].x && this.position.x - this.radius <= goalPosts[0].x + GOAL_POST_WIDTH){
      // someone may have scored gaol
      if(this.position.y + this.radius > goalPosts[0].y) {
        // team one scored
        this.scores[0] += 1
        this.onGoal();
        return;
      }
      if(this.position.y - this.radius < goalPosts[1].y) {
        // team two scored
        this.scores[0] += 1
        this.onGoal();
        return;
      }
    }

    const wallTouch = wallCollision(this.position, this.radius);
    console.log("walltouch",wallTouch);

    if(wallTouch.x) {
      this.direction.x *=-1;
      this.position.x -= wallTouch.x;
    }

    if(wallTouch.y) {
      this.direction.x *=-1;
      this.position.y -= wallTouch.y;
    }

    if(this.attachedPlayer) {
      this.attachedPlayer.position.x -= wallTouch.x
      this.attachedPlayer.position.y -= wallTouch.y
    }


  }
}

