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
import IdeManager from 'src/components/IdeManager';
import { RootState } from 'src/redux/store/types';
import { Text } from 'office-ui-fabric-react';
import { connect } from 'react-redux';

interface Props {
    className?: string;
    theme: AppTheme;
}

class Setup_IDEs extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.idesSetupPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        <Icon
                            className={classes.pageTitleIcon}
                            iconName='CodeEdit'
                        />
                        IDEs
                    </Text>
                    <Text className={classes.pageDescription}>
                        Choose editors that should be used for each type of
                        project
                    </Text>
                </div>
                <IdeManager className={classes.setupPicker} />
                <Stack
                    className={classes.buttonBar}
                    horizontal
                    horizontalAlign='space-between'
                >
                    <DefaultButton href='#/setup/directories'>
                        Back
                    </DefaultButton>
                    <PrimaryButton href='#/setup/done'>Next</PrimaryButton>
                </Stack>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Setup_IDEs);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        idesSetupPage: {
            height: 'calc(100% - 32px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            overflowX: 'hidden',
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
            overflowY: 'auto',
        },
        buttonBar: {
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid',
            borderTopColor: theme.semanticColors.bodyBackgroundChecked,
        },
    });
};
