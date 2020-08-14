import { AppTheme, Ide, ProjectType, projectTypes } from 'src/types';
import { ITheme, mergeStyleSets } from '@uifabric/styling';
import React, { PureComponent } from 'react';

import { RootState } from 'src/redux/store/types';
import SingleIdeManager from './SingleIdeManager';
import { Stack } from '@fluentui/react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { findIde } from 'src/redux/features/settings/selectors';
import { settingsActions } from 'src/redux/features/settings';

interface IdeManagerNoContextProps {
    className: string;
    theme: AppTheme;
    ides: Ide[];
    setIdes: (ides: Ide[]) => void;
    findIde: (projectType: ProjectType) => Ide;
}

class IdeManager extends PureComponent<IdeManagerNoContextProps, {}> {
    render() {
        const classes = buildClasses(this.props.theme);
        return (
            <Stack
                className={classnames(this.props.className, classes.ideManager)}
            >
                {projectTypes.map((projectType) => (
                    <SingleIdeManager
                        key={projectType.key}
                        projectType={projectType}
                        ide={this.props.findIde(projectType)}
                        onIdeSet={this._onIdeSet}
                    />
                ))}
            </Stack>
        );
    }

    private _onIdeSet = (ide: Ide) => {
        const allOtherIdes = this.props.ides.filter(
            (i) => i.projectType.key !== ide.projectType.key
        );
        this.props.setIdes([...allOtherIdes, ide]);
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    ides: state.settings.ides,
    findIde: findIde(state),
});
const mapDispatchToProps = {
    setIdes: settingsActions.setIdes,
};
export default connect(mapStateToProps, mapDispatchToProps)(IdeManager);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        ideManager: {
            display: 'flex',
            flexDirection: 'column',
        },
    });
};
