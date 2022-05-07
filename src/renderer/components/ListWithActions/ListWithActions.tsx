import { Box, Button, Text, Tooltip, useTheme } from '@primer/react';

import { Icon } from '@primer/octicons-react';
import React from 'react';

interface Item {
  text: string;
  actions: {
    icon: Icon;
    hint: string;
    onClick: () => void;
    isDanger: boolean;
    disabled?: boolean;
  }[];
}

interface Props {
  items: Item[];
}

export default function ListWithActions({ items }: Props) {
  const { theme } = useTheme();
  return (
    <Box sx={{ bg: 'canvas.overlay' }} padding='0 1rem .5rem' overflowY='auto'>
      {items?.map(({ text, actions }) => (
        <Box
          key={text}
          borderBottom='1px solid'
          borderBottomColor={theme.colors.border.default}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          paddingY='.75rem'
        >
          <Text>{text}</Text>
          <Box display={'flex'} gridGap='0.5rem'>
            {actions.map(
              ({ icon, hint, isDanger, onClick, disabled = false }, index) => (
                <Button
                  key={index}
                  leadingIcon={icon}
                  variant={isDanger ? 'danger' : 'default'}
                  onClick={onClick}
                  aria-label={hint}
                  disabled={disabled}
                ></Button>
              )
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
