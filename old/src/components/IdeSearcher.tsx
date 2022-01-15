import { AppTheme, Ide, ProjectType } from 'src/types';
import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DirectionalHint,
    FontSizes,
    FontWeights,
    ITheme,
    Icon,
    IconButton,
    Image,
    PrimaryButton,
    Spinner,
    Stack,
    Text,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import React, { PureComponent } from 'react';

import { RootState } from 'src/redux/store/types';
import { Subscription } from 'rxjs';
import { appActions } from 'src/redux/features/app';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

interface IdeSearcherProps {
    visible: boolean;
    projectType: ProjectType;
    currentIde: Ide;
    submitted: (_: Ide) => void;
    canceled: () => void;
    theme: AppTheme;
    availableIdes: Ide[];
    clearAvailableIdes: typeof appActions.clearAvailableIdes;
}

interface State {
    selectedIde: Ide | null;
}

class IdeSearcher extends PureComponent<IdeSearcherProps, State> {
    scanSubscription: Subscription | undefined;

    state: State = {
        selectedIde: null,
    };

    render() {
        const { selectedIde } = this.state;
        const classes = buildClasses(this.props.theme);
        let bodyElement;
        if (this.props.availableIdes === null) {
            bodyElement = (
                <Spinner
                    label='Searching For IDEs...'
                    ariaLive='assertive'
                    labelPosition='right'
                    className={classes.spinner}
                />
            );
        } else {
            bodyElement = (
                <Stack
                    tokens={{
                        childrenGap: 10,
                    }}
                >
                    {this.props.availableIdes.map((ide) => {
                        let classNames = [classes.availableIdeCheckMark];
                        if (!!selectedIde && selectedIde.path === ide.path) {
                            classNames = [
                                ...classNames,
                                classes.availableIdeCheckMarkActive,
                            ];
                        }
                        return (
                            <button
                                className={classes.availableIde}
                                onClick={() => this._onIdeSelected(ide)}
                                key={ide.path}
                            >
                                <Icon
                                    iconName={'CheckMark'}
                                    className={classnames(classNames)}
                                />
                                <Image
                                    className={classes.availableIdeImage}
                                    src={`assets/${ide.type}.png`}
                                ></Image>
                                <Text>{ide.name}</Text>
                                <Text className={classes.pathText}>
                                    {ide.path}
                                </Text>
                            </button>
                        );
                    })}
                </Stack>
            );
        }
        return (
            <Dialog
                dialogContentProps={{
                    title: (
                        <Stack horizontal verticalAlign='center' gap={8}>
                            <Text className={classes.text}>
                                {this.props.projectType.commonName}
                            </Text>
                            <Icon
                                className={classes.chevron}
                                iconName='ChevronRight'
                            />
                            <Text className={classes.text}>Select an IDE</Text>
                            {this.props.availableIdes !== null && (
                                <TooltipHost
                                    content='Re-run search'
                                    directionalHint={
                                        DirectionalHint.rightCenter
                                    }
                                >
                                    <IconButton
                                        onClick={this._requestIdes}
                                        iconProps={{ iconName: 'Refresh' }}
                                    />
                                </TooltipHost>
                            )}
                        </Stack>
                    ),
                }}
                hidden={!this.props.visible}
                className={classes.dialog}
            >
                {bodyElement}
                <DialogFooter>
                    <PrimaryButton
                        disabled={!this.state.selectedIde}
                        iconProps={{ iconName: 'CheckMark' }}
                        onClick={() =>
                            this.props.submitted(this.state.selectedIde as Ide)
                        }
                    >
                        Set
                    </PrimaryButton>
                    <DefaultButton
                        iconProps={{ iconName: 'Cancel' }}
                        onClick={this.props.canceled}
                    >
                        Cancel
                    </DefaultButton>
                </DialogFooter>
            </Dialog>
        );
    }

    public componentDidMount() {
        this._setCurrentlySelectedIdeToAvailableIde();
    }

    public componentDidUpdate(oldProps: IdeSearcherProps) {
        const dialogOpened = this.props.visible && !oldProps.visible;
        if (dialogOpened) {
            if (this.props.availableIdes === null) {
                this._requestIdes();
            }
            this._setCurrentlySelectedIdeToAvailableIde();
        }
        if (!oldProps.availableIdes && !!this.props.availableIdes) {
            this._setCurrentlySelectedIdeToAvailableIde();
        }
    }

    private _setCurrentlySelectedIdeToAvailableIde = () => {
        if (!this.props.currentIde) {
            return;
        }
        const selectedIde = this.props.availableIdes?.find(
            (ide) => ide.path === this.props.currentIde.path
        );
        this.setState({ selectedIde });
    };

    private _requestIdes = () => {
        this.props.clearAvailableIdes();
        ipcRenderer.send('requestAvailableIdes');
    };

    private _onIdeSelected = (ide: Ide) => {
        this.setState({ selectedIde: ide });
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    availableIdes: state.app.availableIdes,
});
const mapDispatchToProps = {
    clearAvailableIdes: appActions.clearAvailableIdes,
};
export default connect(mapStateToProps, mapDispatchToProps)(IdeSearcher);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        chevron: {
            fontSize: FontSizes.medium,
            margin: '2px 0 0',
            color: theme.semanticColors.bodyText,
        },
        text: {
            fontSize: FontSizes.xLarge,
            color: theme.semanticColors.bodyText,
        },
        dialog: {
            selectors: {
                '.ms-Dialog-main': {
                    maxWidth: '70vw',
                },
            },
        },
        dialogFooter: {
            marginTop: 16,
        },
        spinner: {
            margin: '24px 0 36px',
        },
        availableIde: {
            color: theme.semanticColors.bodyText,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '8px',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            background: 'transparent',
            border: 'none',
            selectors: {
                ':hover': {
                    backgroundColor: theme.semanticColors.bodyBackgroundHovered,
                },
            },
        },
        availableIdeImage: {
            marginRight: 8,
            flexShrink: 0,
        },
        availableIdeCheckMark: {
            color: theme.semanticColors.bodyText,
            opacity: 0,
            fontWeight: FontWeights.bold,
            marginRight: 8,
        },
        availableIdeCheckMarkActive: {
            opacity: 1,
        },
        pathText: {
            marginLeft: 16,
            fontSize: FontSizes.smallPlus,
            color: theme.semanticColors.bodySubtext,
            fontFamily: 'Roboto Mono',
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
        },
    });
};
