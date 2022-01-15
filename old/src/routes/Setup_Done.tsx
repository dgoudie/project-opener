import {
    FontSizes,
    Icon,
    PrimaryButton,
    Text,
    mergeStyleSets,
} from '@fluentui/react';

import AppIconSvg from 'src/components/AppIconSvg';
import { AppTheme } from 'src/types';
import React from 'react';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';
import { settingsActions } from 'src/redux/features/settings';

type Props = {
    theme: AppTheme;
    setSetupComplete: typeof settingsActions.setSetupComplete;
};
function Setup_Done({ theme, setSetupComplete }: Props) {
    const classes = buildClasses(theme);
    return (
        <div className={classes.root}>
            <Icon iconName='CheckMark' className={classes.check} />
            <Text className={classes.text}>Setup Complete.</Text>
            <PrimaryButton
                className={classes.button}
                autoFocus
                href='#/'
                onClick={() => setSetupComplete(true)}
            >
                Go Home
            </PrimaryButton>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {
    setSetupComplete: settingsActions.setSetupComplete,
};
export default connect(mapStateToProps, mapDispatchToProps)(Setup_Done);

const buildClasses = (theme: AppTheme) => {
    return mergeStyleSets({
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            color: theme.semanticColors.bodyText,
        },
        check: {
            fontSize: FontSizes.mega,
            color: theme.palette.green,
        },
        text: {
            marginTop: 12,
            fontSize: FontSizes.large,
        },
        button: {
            marginTop: 24,
        },
    });
};
