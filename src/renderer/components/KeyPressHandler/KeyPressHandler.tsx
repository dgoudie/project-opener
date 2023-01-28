import React, { useCallback, useEffect } from 'react';

import { usePrevious } from '../../hooks/use-previous';

interface Props {
  onEscape?: () => void;
  onUpArrow?: () => void;
  onDownArrow?: () => void;
}

export default function KeyPressHandler({
  onEscape,
  onUpArrow,
  onDownArrow,
}: Props): null {
  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !!onEscape) {
        onEscape();
      }
      if (event.key === 'ArrowUp' && !!onUpArrow) {
        onUpArrow();
      }
      if (event.key === 'ArrowDown' && !!onDownArrow) {
        onDownArrow();
      }
    },
    [onEscape, onUpArrow, onDownArrow]
  );

  const previousKeyDownHandler = usePrevious(keyDownHandler);

  useEffect(() => {
    !!previousKeyDownHandler &&
      document.removeEventListener('keydown', previousKeyDownHandler);
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler]);

  return null;
}
