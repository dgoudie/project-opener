import {
    CommandBarButton,
    FontSizes,
    ITheme,
    Icon,
    Text,
    mergeStyleSets,
} from 'office-ui-fabric-react';

import { AppTheme } from 'src/types';
import React from 'react';
import { RootState } from 'src/redux/store/types';
import { SettingsRoute } from 'src/utils/settings-routes';
import { connect } from 'react-redux';

type Props = {
    activeRoute: SettingsRoute;
    theme: AppTheme;
};

function SettingsNav({ activeRoute, theme }: Props) {
    const classes = buildClasses(theme);
    return (
        <header className={classes.header}>
            <CommandBarButton
                className={classes.commandBarButton}
                href='#/'
                iconProps={{ iconName: 'Back' }}
            />
            <Text className={classes.text}>Settings</Text>
            <Icon className={classes.chevron} iconName='ChevronRight' />
            <Text className={classes.text}>{activeRoute.name}</Text>
        </header>
    );
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsNav);

// Styles

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    // @ts-ignore
    return mergeStyleSets({
        header: {
            display: 'flex',
            alignItems: 'center',
            WebkitAppRegion: 'drag',
        },
        commandBarButton: {
            height: 64,
            width: 48,
            marginRight: 6,
            background: theme.semanticColors.bodyBackground,
            WebkitAppRegion: 'no-drag',
        },
        chevron: {
            fontSize: FontSizes.medium,
            margin: '2px 8px 0',
            color: theme.semanticColors.bodyText,
        },
        text: {
            fontSize: FontSizes.xLarge,
            color: theme.semanticColors.bodyText,
        },
    });
};
