import styled from 'styled-components';
import { themeGet } from '@primer/react';

const ButtonLink = styled.button`
  color: ${themeGet('colors.accent.fg')};
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: ${themeGet('colors.accent.emphasis')};
  }
  &:active {
    color: ${themeGet('colors.accent.muted')};
  }
`;

export default ButtonLink;
