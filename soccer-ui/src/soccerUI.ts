import { CoordinateSystem, Environment, SpriteManager, UI, UIActionReturn, timingAnim } from '@bhoos/game-kit-ui';
import {
  FinishGameAction,
  soccer,
  soccerState,
  PlayAction,
  PlayApi,
  StartGameAction,
  StateEvent,
  PLAYER_RADIUS,
} from '@bhoos/soccer-engine';
import { soccerLayouts, computeLayouts, createWidgets } from './soccerWidgets';
import { ConfigOf } from '@bhoos/game-kit-engine';
import { StickController } from './widgets/StickController';
import { GAME_SIZE_X, GAME_SIZE_Y, Position } from '@bhoos/soccer-engine';
import { CircleSprite } from './sprites/ObjectSpr';

const ANIMATION_SPEED = 1;
const FLIP_SPEED_300 = ANIMATION_SPEED * 300;
const timing500 = timingAnim({ duration: ANIMATION_SPEED * 500, useNativeDriver: true });
const timing300 = timingAnim({ duration: ANIMATION_SPEED * 300, useNativeDriver: true });
const timing200 = timingAnim({ duration: ANIMATION_SPEED * 200, useNativeDriver: true });
const animFrame = timingAnim({ duration: 50, useNativeDriver: true });

export type soccerUIEnv = Environment<soccer>;
export function toMinusPos(p: Position) {
  return {x: p.x - GAME_SIZE_X/2, y: p.y - GAME_SIZE_Y/2}
}

const emptyfunction = ()=>{};

export class soccerUI implements UI<soccer, soccerUIEnv> {
  protected sm: SpriteManager;
  public state!: soccerState;
  protected env!: soccerUIEnv;

  ball: CircleSprite;
  
  controller: StickController;
  public layouts: soccerLayouts;
  private _layout: CoordinateSystem;
  private widgets;

  constructor(layout: CoordinateSystem, config: ConfigOf<soccer>) {
    console.log('Creating UI');
    this._layout = layout;
    this.sm = new SpriteManager(layout);
    this.layouts = computeLayouts(layout);
    this.widgets = createWidgets(this, this.sm, config);
    this.controller = new StickController(this.sm,emptyfunction, emptyfunction,
      (p: Position)=>{
        console.log("sending api", p);
        this.env.client.execute(PlayApi.create(this.state.userIdx, p),true);
      }, // move 
      ()=>{
        console.log("sending api");
        console.log("click");
        this.env.client.execute(PlayApi.create(this.state.userIdx, {x:0,y:0}, true, false),false);
      }, // click
      (p: Position)=>{
        console.log("sending api");
        this.env.client.execute(PlayApi.create(this.state.userIdx, p, false, true),false);
      }  // flick
    );
    this.ball = this.sm.registerSprite(new CircleSprite(
      PLAYER_RADIUS/2, {x: GAME_SIZE_X/2, y: GAME_SIZE_Y/2}, "blue"
    ))
    return this;
  }

  onStateEvent(event: StateEvent): void {
    this.ball.position.x.animateTo(event.ball.position.x - PLAYER_RADIUS/2, animFrame);
    this.ball.position.y.animateTo(event.ball.position.y - PLAYER_RADIUS/2, animFrame);
    event.ball.players.forEach((p, idx)=> {
      const newpos = toMinusPos(p.position);
      this.widgets.profiles[idx].profileSprite.x.animateTo(newpos.x, animFrame);
      this.widgets.profiles[idx].profileSprite.y.animateTo(newpos.y, animFrame);
      
      //if(idx == this.state.userIdx)console.log("moving to",p.position, newpos);
    })
  }

  /// INTERACTION WITH GAME CLIENT
  onMatchEnd(): void {}

  onBackLog(backLog: number, catchup: () => Promise<void>): void {}

  async onStateUpdate() {
  }

  getSpriteManager(): SpriteManager {
    return this.sm;
  }

  onLayoutUpdate(layout: CoordinateSystem) {

  }

  onAttach(env: soccerUIEnv) {
    console.log('Attaching UI');
    this.state = env.client.getState();
    this.env = env;
    return true;
  }

  onDetach(): void {}

  /// EVENT CONSUMER
  onTimer(): void {}

  onConnectionStatus(): void {}

  // USER INTERACTION
  async onUserPlay() {
  }

  // ACTION HANDLERS
  async onStartGame(action: StartGameAction) {
    return async () => {
      this.widgets.profiles.forEach(p=>p.draw());
    };
  }

  onPlay(action: PlayAction): UIActionReturn {
  }

  onFinishGame(action: FinishGameAction): UIActionReturn {
    () => {
    }
  }

}
