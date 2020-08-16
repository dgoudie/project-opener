import { AppTheme, Ide, ProjectType } from 'src/types';
import {
    Button,
    Image,
    ImageFit,
    PrimaryButton,
    Separator,
    Stack,
    Text,
} from 'office-ui-fabric-react';
import { FontSizes, ITheme, mergeStyleSets } from '@uifabric/styling';
import React, { Fragment, PureComponent } from 'react';

import IdeManualSpecifier from './IdeManualSpecifier';
import IdeSearcher from './IdeSearcher';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';

interface Props {
    projectType: ProjectType;
    ide: Ide | undefined;
    onIdeSet: (ide: Ide) => void;
    theme: AppTheme;
}

interface State {
    searcherAvailable: boolean;
    manualSpecifierAvailable: boolean;
}

class SingleIdeManager extends PureComponent<Props, State> {
    state = {
        searcherAvailable: false,
        manualSpecifierAvailable: false,
    };
    render() {
        const { projectType, ide } = this.props;
        const classes = buildClasses(this.props.theme);
        let element = (
            <Fragment>
                {!!ide ? (
                    <Stack
                        tokens={{ childrenGap: 8 }}
                        horizontal
                        className={classes.ideMain}
                    >
                        <Image src={`assets/${ide.type}.png`}></Image>
                        <Separator vertical />
                        <Stack tokens={{ childrenGap: 2 }}>
                            <Text>{ide.name}</Text>
                            <Text className={classes.idePath}>
                                <code>{ide.path}</code>
                            </Text>
                        </Stack>
                    </Stack>
                ) : (
                    <Text className={classes.ideNone}>
                        No IDE selected for {projectType.commonName} projects...
                    </Text>
                )}
                <Stack
                    horizontal
                    tokens={{
                        childrenGap: 10,
                    }}
                >
                    <PrimaryButton
                        iconProps={{ iconName: 'FolderSearch' }}
                        className={classes.selectIdeButton}
                        onClick={() =>
                            this.setState({ searcherAvailable: true })
                        }
                    >
                        Search for IDE
                    </PrimaryButton>
                    <Button
                        iconProps={{ iconName: 'CodeEdit' }}
                        className={classes.selectIdeButton}
                        onClick={() =>
                            this.setState({ manualSpecifierAvailable: true })
                        }
                    >
                        Manually Specify IDE
                    </Button>
                </Stack>
            </Fragment>
        );
        return (
            <div className={classes.sim}>
                <div className={classes.simTypeHeader}>
                    <Image
                        src={`assets/${projectType.key}.png`}
                        className={classes.simTypeImage}
                        imageFit={ImageFit.contain}
                    />
                    <Text className={classes.simTypeName}>
                        {projectType.commonName}
                    </Text>
                </div>
                {element}
                <IdeSearcher
                    visible={this.state.searcherAvailable}
                    submitted={(ide) => this._onIdeChange(ide, projectType)}
                    canceled={() => this.setState({ searcherAvailable: false })}
                    currentIde={ide}
                    projectType={projectType}
                />
                <IdeManualSpecifier
                    visible={this.state.manualSpecifierAvailable}
                    projectType={projectType}
                    submitted={(ide) => this._onIdeChange(ide, projectType)}
                    currentIde={ide}
                    canceled={() =>
                        this.setState({ manualSpecifierAvailable: false })
                    }
                />
            </div>
        );
    }

    private _onIdeChange = (ide: Ide, projectType: ProjectType) => {
        this.props.onIdeSet({ ...ide, projectType });
        this.setState({
            manualSpecifierAvailable: false,
            searcherAvailable: false,
        });
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(SingleIdeManager);
const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        ideManager: {
            display: 'flex',
            flexDirection: 'column',
        },
        sim: {
            margin: '8px 0',
            padding: 8,
            boxSizing: 'border-box',
            border: '3px solid',
            borderColor: theme.semanticColors.bodyStandoutBackground,
        },
        simTypeHeader: {
            display: 'flex',
            alignItems: 'center',
        },
        simTypeImage: {
            width: 24,
            maxHeight: 24,
            height: 24,
            marginRight: 8,
        },
        simTypeName: {
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.large,
        },
        ideNone: {
            marginTop: 6,
            display: 'block',
            color: theme.semanticColors.bodySubtext,
            fontStyle: 'italic',
        },
        ideMain: {
            backgroundColor: theme.semanticColors.bodyStandoutBackground,
            color: theme.semanticColors.bodyText,
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: 2,
            marginTop: 8,
        },
        idePath: {
            fontSize: FontSizes.medium,
            fontFamily: "'Roboto Mono', monospace",
            padding: '2px 6px',
            borderRadius: 4,
            background: theme.semanticColors.bodyFrameBackground,
        },
        selectIdeButton: {
            marginTop: 10,
        },
    });
};
