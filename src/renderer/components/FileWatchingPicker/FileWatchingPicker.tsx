import React, { useContext } from 'react';

import { SegmentedControl } from '@primer/react';
import { SettingsContext } from '../../providers/SettingsProvider';

export default function FileWatchingPicker() {
  const { ENABLE_FILE_WATCHING, setFileWatchingEnabled } =
    useContext(SettingsContext);

  return (
    <SegmentedControl
      aria-label='Enable File Watching'
      onChange={(index) => setFileWatchingEnabled(index === 0)}
    >
      <SegmentedControl.Button selected={ENABLE_FILE_WATCHING}>
        On
      </SegmentedControl.Button>
      <SegmentedControl.Button selected={!ENABLE_FILE_WATCHING}>
        Off
      </SegmentedControl.Button>
    </SegmentedControl>
  );
}
