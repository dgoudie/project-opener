import { AppTheme, Project } from 'src/types';
import {
    Callout,
    Dialog,
    DialogType,
    DirectionalHint,
    FocusTrapCallout,
    FontSizes,
    FontWeights,
    IButton,
    IDialogContentProps,
    ITextField,
    ITooltipHost,
    IconButton,
    Text,
    TextField,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import { IpcRendererEvent, ipcRenderer } from 'electron';
import React, { Component } from 'react';
import {
    Subject,
    Subscription,
    fromEvent,
    merge,
    of,
    partition,
    timer,
} from 'rxjs';
import { debounce, map, tap, throttleTime } from 'rxjs/operators';

import ProjectList from 'src/components/ProjectList';
import { openProject } from 'src/utils/open';
import { uuidv4 } from 'src/utils/uuid';

const WAIT_INTERVAL = 150;
const PAGE_SIZE = 9;

interface Props {
    theme: AppTheme;
    selected: boolean;
    childrenIds: string[];
    onDialogClosed?: () => void;
}

interface State {
    dialogOpen: boolean;
    projects: Project[];
    filterText: string;
    cursor: number;
    uuid: string;
}

const dialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
};
export default class ListItemModules extends Component<Props, State> {
    private primaryInputSubject = new Subject<string>();
    private primaryInputSubscription: Subscription;
    state: State = {
        dialogOpen: false,
        projects: [],
        filterText: '',
        cursor: 0,
        uuid: uuidv4(),
    };
    rootRef = React.createRef<HTMLDivElement>();
    inputRef = React.createRef<ITextField>();
    dialogRef = React.createRef<HTMLDivElement>();

    private keyHandlerSubscription: Subscription = null;
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
                    onLayerDidMount={this._dialogDidMount}
                    //@ts-ignore
                    ref={this.dialogRef}
                    dialogContentProps={{
                        ...dialogContentProps,
                        title: (
                            <div
                                className={classes.dialogHeader}
                                ref={this.dialogRef}
                            >
                                <TextField
                                    componentRef={this.inputRef}
                                    className={classes.dialogHeaderInput}
                                    onChange={(event: any) =>
                                        this.primaryInputSubject.next(
                                            event.target.value
                                        )
                                    }
                                    underlined
                                    type='search'
                                    label={`Search ${
                                        this.props.childrenIds.length
                                    } ${
                                        this.props.childrenIds.length === 1
                                            ? `module`
                                            : `modules`
                                    } for:`}
                                />
                                <IconButton
                                    className={classes.dialogHeaderCloseButton}
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
                        cursor={this.state.cursor}
                        height={500}
                        width={1100}
                    />
                </Dialog>
            </div>
        );
    }

    componentDidMount() {
        ipcRenderer.addListener(this.state.uuid, this._getProjectsByIdsResult);
        this._requestProjects();
        this.primaryInputSubscription = this.primaryInputSubject
            .pipe(
                debounce((text) =>
                    !!text
                        ? timer(WAIT_INTERVAL).pipe(map(() => text))
                        : of(text)
                )
            )
            .subscribe((filterText) => this.setState({ filterText }));
    }

    componentDidUpdate(_oldProps: Props, oldState: State) {
        if (this.state.filterText !== oldState.filterText) {
            this._requestProjects();
        }
    }

    componentWillUnmount() {
        ipcRenderer.removeListener(
            this.state.uuid,
            this._getProjectsByIdsResult
        );
        this.primaryInputSubscription?.unsubscribe();
    }

    private _requestProjects() {
        ipcRenderer.send(
            'getProjectsByIds',
            this.props.childrenIds,
            this.state.filterText,
            this.state.uuid
        );
    }

    private _onOpen = (event: React.MouseEvent<IconButton>) => {
        event.stopPropagation();
        this.setState({ dialogOpen: true });
        this._focusInput();
    };

    private _dialogDidMount = () => {
        this.keyHandlerSubscription?.unsubscribe();
        const [arrow$, other$] = partition(
            fromEvent<KeyboardEvent>(this.dialogRef.current, 'keydown'),
            (event) =>
                event.key === 'ArrowUp' ||
                event.key === 'ArrowDown' ||
                event.key === 'PageUp' ||
                event.key === 'PageDown'
        );
        this.keyHandlerSubscription = merge(
            arrow$.pipe(throttleTime(50)),
            other$
        ).subscribe(this.handleKeyEvent);
    };

    private handleKeyEvent = (event: KeyboardEvent) => {
        const { projects, cursor } = this.state;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            let c = cursor - 1;
            this.setState({ cursor: c <= -1 ? projects.length - 1 : c });
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            let c = cursor + 1;
            this.setState({ cursor: c >= projects.length ? 0 : c });
        } else if (event.key === 'PageUp' && cursor > 0) {
            event.preventDefault();
            let newCursor = cursor - PAGE_SIZE;
            if (newCursor < 0) {
                newCursor = 0;
            }
            this.setState({ cursor: newCursor });
        } else if (event.key === 'PageDown' && cursor < projects.length - 1) {
            event.preventDefault();
            let newCursor = cursor + PAGE_SIZE;
            if (newCursor > projects.length - 1) {
                newCursor = projects.length - 1;
            }
            this.setState({ cursor: newCursor });
        } else if (event.key === 'Home') {
            event.preventDefault();
            this.setState({ cursor: 0 });
        } else if (event.key === 'End') {
            event.preventDefault();
            this.setState({ cursor: projects.length - 1 });
        } else if (event.key === 'Enter' && !!this.state.projects.length) {
            this.setState({ dialogOpen: false });
            openProject(this.state.projects[this.state.cursor]);
        } else if (event.key === 'Escape') {
            this.setState({ dialogOpen: false });
        }
    };

    private _onClose = () => {
        this.setState({ dialogOpen: false });
        this.props.onDialogClosed && this.props.onDialogClosed();
    };

    private _focusInput() {
        setTimeout(() => this.inputRef.current.focus());
    }

    private _getProjectsByIdsResult = (
        _event: IpcRendererEvent,
        projects: Project[]
    ) => {
        this.setState({ projects });
    };
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
                    padding: '8px 8px',
                },
            },
        },
        dialogHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.semanticColors.bodyText,
        },
        dialogHeaderInput: {
            flex: 1,
        },
        dialogHeaderCloseButton: {
            marginLeft: 16,
        },
    });
};
