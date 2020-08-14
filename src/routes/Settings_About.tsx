import {
    Depths,
    MotionAnimations,
    MotionDurations,
    MotionTimings,
} from '@uifabric/fluent-theme';
import { FontSizes, Link, Text, mergeStyleSets } from '@fluentui/react';
import React, { PureComponent } from 'react';

import AboutBackground from 'src/components/AboutBackground';
import AppIconSvg from 'src/components/AppIconSvg';
import { AppTheme } from 'src/types';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';
import packageJson from 'src/../package.json';
import { shell } from 'electron';

interface Props {
    theme: AppTheme;
}

class About extends PureComponent<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.root}>
                <div className={classes.main}>
                    <AppIconSvg
                        theme={this.props.theme}
                        style={{ width: 300, borderRadius: 30 }}
                    />
                    <Text className={classes.title}>{packageJson.name}</Text>
                    <Text className={classes.version}>
                        Version {packageJson.version}
                    </Text>
                </div>
                <div className={classes.meta}>
                    <Text className={classes.metaText}>
                        &copy; {packageJson.author.name}{' '}
                        {new Date().getFullYear()}
                    </Text>
                    <Link
                        onClick={() =>
                            shell.openExternal(packageJson.repository.url)
                        }
                    >
                        {packageJson.repository.url}
                    </Link>
                </div>
                <AboutBackground theme={this.props.theme} />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(About);

const buildClasses = (theme: AppTheme) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
        main: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingBottom: 64,
        },
        icon: {
            height: 200,
            boxShadow: Depths.depth64,
        },
        title: {
            marginTop: 16,
            fontFamily: 'Roboto Slab',
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.xxLarge,
        },
        version: {
            marginTop: 12,
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.mediumPlus,
        },
        meta: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: 24,
        },
        metaText: {
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.mediumPlus,
        },
    });
};
