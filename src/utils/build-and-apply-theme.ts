import { loadTheme } from '@fluentui/react';
import themes from 'src/themes';

export const buildAndApplyTheme = (themeName: string) => {
    const partialTheme = themes.find((t) => t.name === themeName);
    return {
        name: partialTheme.name,
        ...loadTheme(partialTheme),
    };
};
