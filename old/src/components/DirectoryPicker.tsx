import {
    DirectionalHint,
    FontSizes,
    ITextField,
    ITheme,
    IconButton,
    List,
    PrimaryButton,
    Separator,
    Text,
    TextField,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import { IpcRenderer, IpcRendererEvent, ipcRenderer } from 'electron';
import React, { Component, Fragment } from 'react';

import { AppTheme } from 'src/types';
import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';
import { settingsActions } from 'src/redux/features/settings';

interface Props {
    className?: string;
    paths: string[];
    theme: AppTheme;
    currentlyScanningPaths: Set<string>;
    addPath: typeof settingsActions.addPath;
    deletePath: typeof settingsActions.deletePath;
    scanPath: typeof appActions.scanPath;
}

interface State {
    addPathInputValue: string;
    formValid: boolean;
    existingPaths: string[];
}

class DirectoryPicker extends Component<Props, State> {
    private addPathInputRef = React.createRef<ITextField>();
    private listRef = React.createRef<List>();

    state: State = {
        addPathInputValue: '',
        formValid: false,
        existingPaths: [],
    };

    render() {
        const { className, paths } = this.props;
        const classes = buildClasses(this.props.theme);
        return (
            <div
                className={`${!!className ? className : ''} ${
                    classes.DirectoryPicker
                }`}
            >
                <List
                    data-is-scrollable={true}
                    className={classes.list}
                    items={paths}
                    onRenderCell={(item) => this._onRenderCell(classes, item)}
                    onShouldVirtualize={() => false}
                    ref={this.listRef}
                />
                <form
                    className={classes.addNewPathControls}
                    onSubmit={this._onSubmit}
                >
                    <TextField
                        value={this.state.addPathInputValue}
                        className={classes.textField}
                        componentRef={this.addPathInputRef}
                        prefix='Add Directory:'
                        onChange={(_, addPathInputValue) =>
                            this.setState({ addPathInputValue })
                        }
                    />
                    <TooltipHost
                        directionalHint={DirectionalHint.topAutoEdge}
                        content='Select Directory...'
                    >
                        <IconButton
                            className={classes.selectFolderIconButton}
                            iconProps={{ iconName: 'Folder' }}
                            onClick={this._promptForDirectorySelect}
                        />
                    </TooltipHost>
                    <PrimaryButton
                        type='submit'
                        disabled={!this.state.formValid}
                        iconProps={{ iconName: 'CheckMark' }}
                    ></PrimaryButton>
                </form>
            </div>
        );
    }

    private _onRenderCell = (
        classes: ReturnType<typeof buildClasses>,
        path?: string
    ): JSX.Element | null => {
        if (!classes || !path) {
            return null;
        }
        return (
            <Fragment>
                <div className={classes.listItemBody} data-is-focusable={true}>
                    <div className={classes.listItemText}>
                        <Text className={classes.listItemTextPath}>{path}</Text>
                        {this.props.currentlyScanningPaths.has(path) && (
                            <Text className={classes.listItemScanningText}>
                                Scanning...
                            </Text>
                        )}
                    </div>
                    <div className={classes.listItemIconButtons}>
                        <TooltipHost
                            content='Rescan'
                            directionalHint={DirectionalHint.topAutoEdge}
                        >
                            <IconButton
                                disabled={this.props.currentlyScanningPaths.has(
                                    path
                                )}
                                className={classes.listItemIconButton}
                                iconProps={{ iconName: 'SyncFolder' }}
                                onClick={() => this.props.scanPath(path)}
                            />
                        </TooltipHost>
                        <TooltipHost
                            content='Delete Path'
                            directionalHint={DirectionalHint.topAutoEdge}
                        >
                            <IconButton
                                className={classes.listItemIconButton}
                                iconProps={{ iconName: 'Delete' }}
                                onClick={() => this.props.deletePath(path)}
                            />
                        </TooltipHost>
                    </div>
                </div>
                <Separator />
            </Fragment>
        );
    };

    public componentDidMount() {
        this.focusInput();
        ipcRenderer.on('selectedDirectory', this._selectedDirectory);
    }

    public componentDidUpdate(_oldProps: Props, oldState: State) {
        if (oldState.addPathInputValue !== this.state.addPathInputValue) {
            const formValid =
                !!this.state.addPathInputValue &&
                !this.state.existingPaths.includes(
                    this.state.addPathInputValue.trim()
                );
            this.setState({
                formValid,
            });
        }
        this.listRef.current.forceUpdate();
    }

    private _selectedDirectory = (
        _event: IpcRendererEvent,
        addPathInputValue: string
    ) => this.setState({ addPathInputValue });

    public componentWillUnmount() {
        ipcRenderer.removeListener(
            'selectedDirectory',
            this._selectedDirectory
        );
    }

    private _promptForDirectorySelect = () => {
        ipcRenderer.send('requestSelectedDirectory');
    };

    public focusInput = () => {
        if (!!this.addPathInputRef.current) {
            this.addPathInputRef.current.focus();
        }
    };

    private _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.addPath(this.state.addPathInputValue);
        this.setState({
            addPathInputValue: '',
        });
        this.focusInput();
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    paths: state.settings.paths,
    currentlyScanningPaths: state.app.currentlyScanningPaths,
});
const mapDispatchToProps = {
    addPath: settingsActions.addPath,
    deletePath: settingsActions.deletePath,
    scanPath: appActions.scanPath,
};
export default connect(mapStateToProps, mapDispatchToProps)(DirectoryPicker);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        DirectoryPicker: {
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden',
        },
        list: {
            width: '-webkit-fill-available',
            flex: 1,
            backgroundColor: theme.semanticColors.bodyStandoutBackground,
            padding: 16,
            marginTop: 16,
            overflowY: 'auto',
        },
        listItemBody: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        listItemText: {
            display: 'flex',
            alignItems: 'center',
        },
        listItemTextPath: {
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.mediumPlus,
        },
        listItemScanningText: {
            color: theme.semanticColors.bodyText,
            fontStyle: 'italic',
            opacity: 0.5,
            marginLeft: 8,
        },
        listItemIconButtons: {
            flexShrink: 0,
        },
        listItemIconButton: {
            marginLeft: 8,
        },
        addNewPathControls: {
            marginTop: 12,
            display: 'flex',
        },
        textField: {
            marginRight: 12,
            flex: 1,
        },
        selectFolderIconButton: {
            marginRight: 12,
        },
    });
};
