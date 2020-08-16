import { AppTheme, Project } from 'src/types';
import {
    Callout,
    Dialog,
    DialogType,
    DirectionalHint,
    FocusTrapCallout,
    IButton,
    IDialogContentProps,
    ITooltipHost,
    IconButton,
    Text,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import { IpcRendererEvent, ipcRenderer } from 'electron';
import React, { Component } from 'react';

import ProjectList from 'src/components/ProjectList';

interface Props {
    theme: AppTheme;
    selected: boolean;
    childrenIds: string[];
    onDialogClosed?: () => void;
}

interface State {
    dialogOpen: boolean;
    projects: Project[];
}

const dialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
};
export default class ListItemModules extends Component<Props, State> {
    state: State = {
        dialogOpen: false,
        projects: [],
    };
    rootRef = React.createRef<HTMLDivElement>();
    render() {
        const classes = buildClasses(
            this.props.theme,
            this.props.selected,
            this.state.dialogOpen
        );
        return (
            <div ref={this.rootRef} className={classes.root}>
                <TooltipHost
                    content='View Project Modules'
                    directionalHint={DirectionalHint.bottomRightEdge}
                    className={classes.tooltip}
                    styles={{
                        root: { display: 'inline-block', marginRight: 8 },
                    }}
                >
                    <IconButton
                        iconProps={{ iconName: 'OEM' }}
                        className={classes.iconButton}
                        onClick={this._onOpen}
                    ></IconButton>
                </TooltipHost>

                <Dialog
                    className={classes.dialog}
                    hidden={!this.state.dialogOpen}
                    onDismissed={this._onClose}
                    dialogContentProps={{
                        ...dialogContentProps,
                        title: (
                            <div className={classes.dialogHeader}>
                                <Text>Project Modules</Text>
                                <IconButton
                                    iconProps={{ iconName: 'Cancel' }}
                                    onClick={() =>
                                        this.setState({ dialogOpen: false })
                                    }
                                />
                            </div>
                        ),
                    }}
                >
                    <ProjectList
                        projects={this.state.projects}
                        cursor={0}
                        height={500}
                        width={1100}
                    />
                </Dialog>
            </div>
        );
    }
    private _onOpen = (event: React.MouseEvent<IconButton>) => {
        event.stopPropagation();
        this.setState({ dialogOpen: true });
    };

    private _onClose = () => {
        this.setState({ dialogOpen: false });
        this.props.onDialogClosed && this.props.onDialogClosed();
    };

    componentDidMount() {
        ipcRenderer.addListener(
            'getProjectsByIdsResult',
            this._getProjectsByIdsResult
        );
        ipcRenderer.send('getProjectsByIds', this.props.childrenIds);
    }

    componentWillUnmount() {
        ipcRenderer.removeListener(
            'getProjectsByIdsResult',
            this._getProjectsByIdsResult
        );
    }

    private _getProjectsByIdsResult = (
        _event: IpcRendererEvent,
        projects: Project[]
    ) => this.setState({ projects });
}

const buildClasses = (
    theme: AppTheme,
    selected: boolean,
    calloutExpanded: boolean
) => {
    return mergeStyleSets({
        root: {},
        tooltip: { display: calloutExpanded ? 'none' : 'initial' },
        iconButton: {
            background: 'transparent',
            color: !!selected
                ? theme.semanticColors.primaryButtonText
                : theme.semanticColors.bodyText,
            selectors: {
                '.ms-Image': {
                    margin: '0 12px',
                },
                ':hover, :active': {
                    background: '#bbbbbb22',
                    color: !!selected
                        ? theme.semanticColors.primaryButtonText
                        : theme.semanticColors.bodyText,
                },
            },
        },
        dialog: {
            selectors: {
                '.ms-Dialog-main': {
                    maxWidth: 'initial',
                },
                '.ms-Dialog-inner': {
                    padding: 0,
                },
                '.ms-Dialog-title': {
                    padding: '12px 16px',
                },
            },
        },
        dialogHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.semanticColors.bodyText,
        },
    });
};
