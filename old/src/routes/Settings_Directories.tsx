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
}

class Directories extends Component<Props, {}> {
    public render() {
        const classes = buildClasses(this.props.theme);
        return (
            <div className={classes.directoriesSettingsPage}>
                <div>
                    <Text className={classes.pageTitle}>
                        Choose directories to scan for projects
                    </Text>
                </div>
                <DirectoryPicker className={classes.settingsPicker} />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Directories);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        directoriesSettingsPage: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px 16px',
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
