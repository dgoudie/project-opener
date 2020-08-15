import {
    DirectionalHint,
    IconButton,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import React, { Component } from 'react';

import { AppTheme } from 'src/types';

interface Props {
    theme: AppTheme;
    selected: boolean;
    childrenIds: string[];
}

export default class ListItemModules extends Component<Props, {}> {
    render() {
        const classes = buildClasses(this.props.theme, this.props.selected);
        return (
            <TooltipHost
                content='View Project Modules'
                directionalHint={DirectionalHint.bottomRightEdge}
                styles={{
                    root: { display: 'inline-block', marginRight: 8 },
                }}
            >
                <IconButton
                    iconProps={{ iconName: 'OEM' }}
                    className={classes.iconButton}
                    onClick={(event) => event.stopPropagation()}
                />
            </TooltipHost>
        );
    }
}

const buildClasses = (theme: AppTheme, selected: boolean) => {
    return mergeStyleSets({
        iconButton: {
            background: 'transparent',
            color: !!selected
                ? theme.semanticColors.primaryButtonText
                : theme.semanticColors.bodyText,
            selectors: {
                '.ms-Image': {
                    margin: '0 12px',
                },
                ':hover, :active': {
                    background: '#bbbbbb22',
                    color: !!selected
                        ? theme.semanticColors.primaryButtonText
                        : theme.semanticColors.bodyText,
                },
            },
        },
    });
};
