import {
    DefaultButton,
    Icon,
    Link,
    PrimaryButton,
    Stack,
    Text,
} from 'office-ui-fabric-react';
import {
    FontSizes,
    FontWeights,
    ITheme,
    mergeStyleSets,
} from '@uifabric/styling';
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

class Setup_FilteredPatterns extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.filteredPatternSetupPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        <Icon
                            className={classes.pageTitleIcon}
                            iconName='PageListFilter'
                        />
                        Filtered Patterns
                    </Text>
                    <Text className={classes.pageDescription}>
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
                <FilteredPatternPicker className={classes.setupPicker} />
                <Stack
                    className={classes.buttonBar}
                    horizontal
                    horizontalAlign='space-between'
                >
                    <DefaultButton href='#/setup/start'>Back</DefaultButton>
                    <PrimaryButton href='#/setup/directories'>
                        Next
                    </PrimaryButton>
                </Stack>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup_FilteredPatterns);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        filteredPatternSetupPage: {
            height: 'calc(100% - 32px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
        },
        pageTitle: {
            fontSize: FontSizes.xxLargePlus,
            color: theme.semanticColors.bodyText,
            fontWeight: FontWeights.regular,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 16,
        },
        pageTitleIcon: {
            marginRight: 8,
        },
        pageDescription: {
            fontSize: FontSizes.large,
            color: theme.semanticColors.bodyText,
        },
        globLink: {
            marginLeft: 16,
            fontSize: FontSizes.small,
        },
        setupPicker: {
            flex: 1,
        },
        buttonBar: {
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid',
            borderTopColor: theme.semanticColors.bodyBackgroundChecked,
        },
    });
};
