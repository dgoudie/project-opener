import React, { useCallback, useEffect } from 'react';

import { usePrevious } from '../../hooks/use-previous';

interface Props {
    onEscape?: () => void;
}

export default function KeyPressHandler({ onEscape }: Props): null {
    const keyDownHandler = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !!onEscape) {
                onEscape();
            }
        },
        [onEscape]
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
