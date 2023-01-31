import React, { useContext } from 'react';

import { SegmentedControl } from '@primer/react';
import { SettingsContext } from '../../providers/SettingsProvider';

export default function RescanOnStartPicker() {
  const { RESCAN_ON_START, setRescanOnStart } = useContext(SettingsContext);

  return (
    <SegmentedControl
      aria-label='Enable File Watching'
      onChange={(index) => setRescanOnStart(index === 0)}
    >
      <SegmentedControl.Button selected={RESCAN_ON_START}>
        On
      </SegmentedControl.Button>
      <SegmentedControl.Button selected={!RESCAN_ON_START}>
        Off
      </SegmentedControl.Button>
    </SegmentedControl>
  );
}
