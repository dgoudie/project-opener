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

class IDEs extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.idesSettingsPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        Choose editors that should be used for each type of
                        project
                    </Text>
                </div>
                <IdeManager className={classes.settingsPicker} />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(IDEs);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        idesSettingsPage: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px 16px',
            overflowX: 'hidden',
        },
        pageTitle: {
            fontSize: FontSizes.large,
            color: theme.semanticColors.bodyText,
        },
        settingsPicker: {
            flex: 1,
        },
    });
};
