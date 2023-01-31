import { Box, Text } from '@primer/react';

import FileWatchingPicker from '../../components/FileWatchingPicker/FileWatchingPicker';
import HotkeyPicker from '../../components/HotkeyPicker/HotkeyPicker';
import React from 'react';
import RescanOnStartPicker from '../../components/RescanOnStartPicker/RescanOnStartPicker';
import SettingsHeader from '../../components/SettingsHeader/SettingsHeader';
import ThemePicker from '../../components/ThemePicker/ThemePicker';

export default function Settings_General() {
  return (
    <>
      <SettingsHeader>General</SettingsHeader>
      <Box paddingY='.5em'>
        <Box display={'grid'} justifyItems={'start'} gridGap='.5em'>
          <Settings_GeneralItem title='Theme'>
            <ThemePicker />
          </Settings_GeneralItem>
          <Settings_GeneralItem
            title='Hotkey'
            subtitle='Specify the key combination that will show and focus the window.'
          >
            <HotkeyPicker />
          </Settings_GeneralItem>
          <Settings_GeneralItem
            title='Enable Directory Watching'
            subtitle='Efficiently watches selected directories for changes, automatically updating projects.'
          >
            <FileWatchingPicker />
          </Settings_GeneralItem>
          <Settings_GeneralItem
            title='Rescan Directories On Start'
            subtitle='Rescans your directories when the application starts up in case any changes took place while the app was closed.'
          >
            <RescanOnStartPicker />
          </Settings_GeneralItem>
        </Box>
      </Box>
    </>
  );
}

type Settings_GeneralItemProps = {
  title: string;
  subtitle?: string;
};

function Settings_GeneralItem({
  title,
  subtitle,
  children,
}: React.PropsWithChildren<Settings_GeneralItemProps>) {
  return (
    <>
      <Box display={'flex'} flexDirection='column'>
        <Text fontSize={3}>{title}</Text>
        {!!subtitle && (
          <Text fontSize={1} color='fg.muted'>
            {subtitle}
          </Text>
        )}
      </Box>
      {children}
    </>
  );
}
