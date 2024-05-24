import { soccer } from '@bhoos/soccer-engine';
import { RoomViewerProps } from '@bhoos/super-app-interface';
import { DisplayConfigText, formatConfigTimer } from '@bhoos/super-components';
import { View } from 'react-native';

export function soccerRoomViewer({ room, prefs, updatePrefs }: RoomViewerProps<soccer>) {
  return (
    <View>
      <DisplayConfigText
        label="Play Interval"
        sublabel="Time allowed for throwing a card"
        value={formatConfigTimer(room.config.playTimer)}
      />
    </View>
  );
}
