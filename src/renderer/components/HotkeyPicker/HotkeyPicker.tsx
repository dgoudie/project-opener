import { Box, Button, ConfirmationDialog, Text } from '@primer/react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { decodeHotKey, encodeHotKey } from '../../../utils/hotkey-tools';

import { PencilIcon } from '@primer/octicons-react';
import { SettingsContext } from '../../providers/SettingsProvider';
import { SnackbarContext } from '../../providers/SnackbarProvider';
import hotkeys from 'hotkeys-js';

export default function HotkeyPicker() {
  const { HOTKEY, setHotkey } = useContext(SettingsContext);
  const [isOpen, setIsOpen] = useState(false);

  const decodedHotkey = useMemo(() => decodeHotKey(HOTKEY), [HOTKEY]);

  const [hotkeyCaptured, setHotkeyCaptured] = useState(decodedHotkey);
  const [hotkeyCapturedIsValid, setHotkeyCapturedIsValid] = useState(false);

  const isHotkeyValid = useCallback((decodedHotKey: string[]) => {
    return !['ctrl', 'alt', 'shift'].find(
      (invalid) => decodedHotKey[decodedHotKey.length - 1] === invalid
    );
  }, []);

  const onHotkeyJsCapture = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        return;
      }
      const keys: string[] = [];
      if (e.ctrlKey) {
        keys.push('ctrl');
      }
      if (e.altKey) {
        keys.push('alt');
      }
      if (e.shiftKey) {
        keys.push('shift');
      }
      if (
        !!e.key &&
        e.key !== 'Control' &&
        e.key !== 'Shift' &&
        e.key !== 'Alt'
      ) {
        keys.push(e.key.toLowerCase());
      }
      setHotkeyCaptured(keys);
      setHotkeyCapturedIsValid(isHotkeyValid(keys));
    },
    [isHotkeyValid]
  );

  const { showNotification } = useContext(SnackbarContext);

  const onClose = useCallback(
    (gesture: 'confirm' | 'cancel' | 'close-button' | 'escape') => {
      if (gesture === 'confirm') {
        if (hotkeyCapturedIsValid) {
          setHotkey(encodeHotKey(hotkeyCaptured));
          setIsOpen(false);
        } else {
          showNotification('warning', 'Provided hotkey is not valid');
        }
      } else {
        window.BRIDGE.registerShowApplicationHotkey(HOTKEY);
        setIsOpen(false);
      }
    },
    [hotkeyCaptured, hotkeyCapturedIsValid]
  );

  useEffect(() => {
    if (isOpen) {
      hotkeys('*', onHotkeyJsCapture);
      window.BRIDGE.registerShowApplicationHotkey();
    } else {
      hotkeys.unbind('*');
      window.BRIDGE.registerShowApplicationHotkey(HOTKEY);
    }
    return () => {
      hotkeys.unbind('*');
      window.BRIDGE.registerShowApplicationHotkey(HOTKEY);
    };
  }, [isOpen, onHotkeyJsCapture]);

  return (
    <>
      <Button
        variant='invisible'
        onClick={() => setIsOpen(true)}
        leadingIcon={PencilIcon}
      >
        {decodedHotkey.join(' + ')}
      </Button>
      {isOpen && (
        <ConfirmationDialog
          confirmButtonType='primary'
          title='Edit Hotkey'
          onClose={onClose}
        >
          <Box textAlign={'center'} bg='canvas.inset' borderRadius={6} py={2}>
            <Text
              textAlign={'center'}
              color='fg.default'
              fontSize={3}
              fontWeight={500}
            >
              {hotkeyCaptured.join(' + ')}
            </Text>
          </Box>
        </ConfirmationDialog>
      )}
    </>
  );
}
