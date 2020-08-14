import { FontSizes, ITheme, mergeStyleSets } from '@uifabric/styling';
import { Link, Text } from 'office-ui-fabric-react';
import {
    MotionAnimations,
    MotionDurations,
    MotionTimings,
} from '@uifabric/fluent-theme';
import React, { Component } from 'react';

import { AppTheme } from 'src/types';
import FilteredPatternPicker from 'src/components/FilteredPatternPicker';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';

const shell = window.require('electron').shell;

interface Props {
    className?: string;
    theme: AppTheme;
}

const LINK = 'https://en.wikipedia.org/wiki/Glob_(programming)';

class FilteredPatterns extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.filteredPatternSettingsPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        Choose the glob patterns to ignore when scanning for
                        projects.
                    </Text>
                    <Link
                        className={classes.globLink}
                        onClick={() => shell.openExternal(LINK)}
                    >
                        {LINK}
                    </Link>
                </div>
                <FilteredPatternPicker className={classes.settingsPicker} />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(FilteredPatterns);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        filteredPatternSettingsPage: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px 16px',
            animation: MotionAnimations.slideDownIn,
            animationDuration: MotionDurations.duration3,
            animationTimingFunction: MotionTimings.decelerate,
        },
        pageTitle: {
            fontSize: FontSizes.large,
            color: theme.semanticColors.bodyText,
        },
        globLink: {
            marginLeft: 16,
            fontSize: FontSizes.small,
        },
        settingsPicker: {
            flex: 1,
        },
    });
};
