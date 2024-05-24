import { CoordinateSystem, ReferenceMultiple, UI, UIActionReturn } from '@bhoos/game-kit-ui';
import { SOCCER_STAGE_END, soccer, FinishGameAction } from '@bhoos/soccer-engine';
import { soccerUI } from '@bhoos/soccer-ui';
import { Prefs, RoomConfig, SuperUIEnv, UIPlugin, UIPlugins, pluginToUI } from '@bhoos/super-app-interface';
import { UITestPlugin } from '@bhoos/super-components';
import { computesoccerWinnings } from './soccerWinnings';

export class SupersoccerUI extends soccerUI implements UI<soccer, SuperUIEnv<soccer>> {
  constructor(
    layout: CoordinateSystem,
    roomConfig: RoomConfig<soccer>,
    plugins: UIPlugins<soccer>,
  ) {
    super(layout, roomConfig.config);
    const ui = this;
    function plug(plugin: UIPlugin<soccer, SuperUIEnv<soccer>>) {
      pluginToUI<soccer, SuperUIEnv<soccer>>(ui, plugin, 'onStartGame', 'onFinishGame');
    }

    const sm = this.getSpriteManager();
    if (plugins.coins) {
      plug(plugins.coins(sm, () => computesoccerWinnings(this.state, roomConfig, this.state.userIdx)));
    }

    if (plugins.hotspotPin) {
      plug(plugins.hotspotPin(sm));
    }

    if (plugins.menu) {
      plug(plugins.menu(sm, () => this.state && this.state.stage === SOCCER_STAGE_END));
    }

    if (plugins.leaderboard) {
      plug(plugins.leaderboard(sm));
    }

    plug(new UITestPlugin());
  }
}
