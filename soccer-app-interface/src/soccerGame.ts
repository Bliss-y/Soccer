import { soccer, soccerBot, soccerConfig, soccerLoop, soccerPlayer, soccerState, registerToOracle, GAME_SIZE_Y, GAME_SIZE_X } from '@bhoos/soccer-engine';
import {
  GameAppInterface,
  Prefs,
  RoomConfig,
  RoomType,
  SuperAppInterfaceVersion,
  UIPlugins,
  UserProfile,
  versionLt,
} from '@bhoos/super-app-interface';
import { CoordinateSystem, ReferenceMultiple } from '@bhoos/game-kit-ui';
import { Match } from '@bhoos/game-kit-engine';
import { HotspotRoomConfig, SinglePlayerRoomConfig } from '@bhoos/super-app-interface';
import { soccerRoomEditor } from './soccerRoomEditor';
import { SupersoccerUI } from './SupersoccerUI';
import { BOTS } from './bots';
import { soccerRoomViewer } from './soccerRoomViewer.js';
import { soccerAnalytics } from './soccerAnalytics.js';
import { soccerHelp } from './soccerHelp';
import { computesoccerStats } from './soccerStats';
import { computesoccerWinnings } from './soccerWinnings';

const pkg = require('../package.json');

const DEFAULT_CONFIG: soccerConfig = {
  playTimer: -1,
};

const SINGLE_PLAYER_DEFAULT_ROOM: SinglePlayerRoomConfig<soccer> = {
  id: 'soccer-sp-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Single,
  minPlayers: 4,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

const HOTSPOT_DEFAULT_ROOM: HotspotRoomConfig<soccer> = {
  id: 'soccer-hot-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Hotspot,
  minPlayers: 4,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

export type soccerPrefs = {
  sound: boolean;
  vibration: boolean;
};

export function initializesoccerGame(): GameAppInterface<soccer> {
  return {
    gameId: pkg.bhoos.gameId,
    displayName: 'soccer',
    name: 'soccer',
    version: pkg.version,
    interfaceVersion: SuperAppInterfaceVersion,
    developer: 'Bibek Panthi',
    isHostSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    isClientSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    reloadStorage: (version: string) => {
      return true;
    },
    description: 'Click as fast as you can',
    supportedBots: Object.keys(BOTS),
    initialSPBots: ['babita', 'pramod', 'gabbar'],

    initializeStorage: () => {
      return {
        rooms: [SINGLE_PLAYER_DEFAULT_ROOM, HOTSPOT_DEFAULT_ROOM],
      };
    },

    isValidProfile: (_player: soccerPlayer, _room: RoomConfig<soccer>) => true,

    prefs: {
      sound: true,
      vibration: true,
    },

    getPlayer: (profile: UserProfile) => {
      return {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
      } as soccerPlayer;
    },

    getBotPlayer: (id: string) => {
      const player = BOTS[id];
      if (player) return player;

      return {
        id: id,
        name: `id`,
        picture: `${id}`,
      };
    },

    defaultRooms: {
      singleplayer: SINGLE_PLAYER_DEFAULT_ROOM,
      hotspot: HOTSPOT_DEFAULT_ROOM,
    },

    RoomEditorComponent: soccerRoomEditor,
    RoomViewerComponent: soccerRoomViewer,
    HelpComponent: soccerHelp,
    analytics: soccerAnalytics,

    getConfigSummary(room: RoomConfig<soccer>) {
      const config = room.config;
      if (room.roomType === RoomType.Multi) {
        return {
          short: '',
          details: [
            ['Stakes', `${room.boot}`, 'coins'],
          ],
        };
      }
      return {
        short: `${config.playTimer / 1000} secs`,
        details: [['Time', `${config.playTimer / 1000} secs`, 'time']],
      };
    },

    ui: {
      layoutProps: () => {
        return {
          bgImage: '/soccer/bg',
          minHeight: GAME_SIZE_Y,
          minWidth: GAME_SIZE_X
        };
      },

      createUI: (
        layout: CoordinateSystem,
        roomConfig: RoomConfig<soccer>,
        _prefs: ReferenceMultiple<Prefs>,
        plugins: UIPlugins<soccer>,
      ) => {
        return new SupersoccerUI(layout, roomConfig, plugins);
      },

      orientation: 'landscape',
      testEquality: (_u, _v) => true,
      startGameMethod: 'onStartGame',
      finishGameMethod: 'onFinishGame',
    },

    engine: {
      gameConfig: (room: RoomConfig<soccer>, players: soccerPlayer[], _prev?: { match: Match<soccer>; config: soccerConfig }) => {
        return {
          config: room.config,
          players: players,
        };
      },

      State: soccerState,
      gameLoop: soccerLoop,

      registerToOracle: registerToOracle,

      createBot: (match: Match<soccer>, player: soccerPlayer) => {
        return new soccerBot(player.id, match)
      },
    },

    stats: {
      matchWinnings: computesoccerWinnings,

      matchStats: computesoccerStats,

      engineModeId: (_room: RoomConfig<soccer>) => {
        return 1;
      },

      timezone: 'UTC',

      statFullId: [],
      descriptions: new Map(),

      formatters: new Map(),
    },

    achievements: [],

    assets: {
      pathTranslations: [],
      assets: require('./assetsManifest.json')
    }
  }
}
