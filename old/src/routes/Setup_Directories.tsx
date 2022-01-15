import {
    DefaultButton,
    FontWeights,
    Icon,
    PrimaryButton,
    Stack,
} from '@fluentui/react';
import { FontSizes, ITheme, mergeStyleSets } from '@uifabric/styling';
import React, { Component } from 'react';

import { AppTheme } from 'src/types';
import DirectoryPicker from 'src/components/DirectoryPicker';
import { RootState } from 'src/redux/store/types';
import { Text } from 'office-ui-fabric-react';
import { connect } from 'react-redux';

interface Props {
    className?: string;
    theme: AppTheme;
    paths: string[];
}

class Setup_Directories extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.directoriesSetupPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        <Icon
                            className={classes.pageTitleIcon}
                            iconName='Folder'
                        />
                        Directories
                    </Text>
                    <Text className={classes.pageDescription}>
                        Choose directories to scan for projects
                    </Text>
                </div>
                <DirectoryPicker className={classes.setupPicker} />
                <Stack
                    className={classes.buttonBar}
                    horizontal
                    horizontalAlign='space-between'
                >
                    <DefaultButton href='#/setup/filtered-patterns'>
                        Back
                    </DefaultButton>
                    <PrimaryButton
                        href='#/setup/ides'
                        disabled={!this.props.paths.length}
                    >
                        Next
                    </PrimaryButton>
                </Stack>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    paths: state.settings.paths,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Setup_Directories);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        directoriesSetupPage: {
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
