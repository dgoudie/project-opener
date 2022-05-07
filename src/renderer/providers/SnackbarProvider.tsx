import {
  AlertIcon,
  CheckIcon,
  Icon,
  InfoIcon,
  XIcon,
} from '@primer/octicons-react';
import { Box, Button, Flash, IconButton, Overlay, Portal } from '@primer/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import useQueue from 'react-use/lib/useQueue';

type NotificationType = 'success' | 'warning' | 'danger' | 'default';

type SnackbarContextType = {
  showPersistent: (content: JSX.Element | string) => void;
  dismissPersistent: () => void;
  showNotification: (
    type: NotificationType,
    content: JSX.Element | string,
    durationInMilliseconds?: number
  ) => void;
};

export const SnackbarContext = React.createContext<SnackbarContextType>({
  showPersistent: () => null,
  dismissPersistent: () => null,
  showNotification: () => null,
});

type NotificationQueueType = [
  type: NotificationType,
  content: JSX.Element | string,
  durationInMilliseconds: number
];

export default function SnackbarProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [persistentContent, setPersistentContent] = useState<
    JSX.Element | string | undefined
  >(undefined);

  const {
    first: newestNotification,
    add: addNotificationToQueue,
    remove,
  } = useQueue<NotificationQueueType | undefined>();

  const dismissPersistent = useCallback(
    () => setPersistentContent(undefined),
    []
  );

  const showNotification = useCallback(
    (
      type: NotificationType,
      content: JSX.Element | string,
      durationInMilliseconds = 3000
    ) => {
      addNotificationToQueue([type, content, durationInMilliseconds]);
    },
    []
  );

  const timeoutId = useRef<number | undefined>();

  useEffect(() => {
    if (!persistentContent && !!newestNotification) {
      timeoutId.current = setTimeout(
        () => remove(),
        newestNotification[2]
      ) as unknown as number;
    }
  }, [persistentContent, newestNotification]);

  const clearNotification = useCallback(() => {
    clearTimeout(timeoutId.current);
    remove();
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        showPersistent: setPersistentContent,
        dismissPersistent,
        showNotification,
      }}
    >
      {children}
      {!persistentContent && !!newestNotification && (
        <Notification
          notification={newestNotification}
          onClear={clearNotification}
        />
      )}
    </SnackbarContext.Provider>
  );
}

type NotificationProps = {
  notification: NotificationQueueType;
  onClear: () => void;
};

function Notification({ notification, onClear }: NotificationProps) {
  const Icon = useMemo<Icon>(() => {
    switch (notification[0]) {
      case 'default':
        return InfoIcon;
      case 'success':
        return CheckIcon;
      default:
        return AlertIcon;
    }
  }, [notification[0]]);
  return (
    <Portal>
      <Box
        position='fixed'
        bottom={'1rem'}
        left='50%'
        style={{ transform: 'translate(-50%, 0)' }}
        bg='canvas.subtle'
      >
        <Flash variant={notification[0]}>
          <Icon />
          {notification[1]}
        </Flash>
      </Box>
    </Portal>
  );
}
