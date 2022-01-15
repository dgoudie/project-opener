import {
    FontSizes,
    PrimaryButton,
    Stack,
    Text,
    mergeStyleSets,
} from '@fluentui/react';

import AppIconSvg from 'src/components/AppIconSvg';
import { AppTheme } from 'src/types';
import React from 'react';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';

type Props = {
    theme: AppTheme;
};
function Setup_Start({ theme }: Props) {
    const classes = buildClasses(theme);
    return (
        <div className={classes.root}>
            <AppIconSvg
                theme={theme}
                style={{ width: 200, borderRadius: 20 }}
            />
            <Text className={classes.welcome}>Welcome</Text>
            <Text className={classes.tip}>
                This tool will help you to launch your projects very quickly.
            </Text>
            <PrimaryButton
                className={classes.button}
                autoFocus
                href='#/setup/filtered-patterns'
            >
                Get Started
            </PrimaryButton>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Setup_Start);

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
        welcome: {
            marginTop: 12,
            fontSize: FontSizes.xxLargePlus,
        },
        tip: {
            marginTop: 12,
            fontSize: FontSizes.large,
        },
        button: {
            marginTop: 36,
        },
    });
};
