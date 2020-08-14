import { AppTheme, Ide, ProjectType } from 'src/types';
import {
    Button,
    Dialog,
    DialogFooter,
    FontSizes,
    ITheme,
    Icon,
    IconButton,
    PrimaryButton,
    Stack,
    Text,
    TextField,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import { IpcRendererEvent, ipcRenderer } from 'electron';
import React, { PureComponent } from 'react';

import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';

interface Props {
    visible: boolean;
    projectType: ProjectType;
    currentIde: Ide;
    submitted: (_: Ide) => void;
    canceled: () => void;
    theme: AppTheme;
}

interface State {
    executableInputText: string;
    argumentsInputText: string;
}

class IdeManualSpecifier extends PureComponent<Props, State> {
    state = {
        executableInputText: this.props.currentIde?.path,
        argumentsInputText: this.props.currentIde?.args.join(' '),
    };

    render() {
        const { executableInputText, argumentsInputText } = this.state;
        const classes = buildClasses(this.props.theme);
        return (
            <Dialog
                className={classes.dialog}
                hidden={!this.props.visible}
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
                            <Text className={classes.text}>Specify an IDE</Text>
                        </Stack>
                    ),
                }}
            >
                <Stack
                    tokens={{
                        childrenGap: 10,
                    }}
                >
                    <Stack
                        tokens={{
                            childrenGap: 10,
                        }}
                        horizontal
                        className={classes.executableInputElementStack}
                    >
                        <TextField
                            value={executableInputText}
                            label='Path to executable:'
                            placeholder='C:\Windows\explorer.exe'
                            autoFocus
                            onChange={(event) =>
                                this.setState({
                                    executableInputText: (event.target as any).value.replace(
                                        /"/g,
                                        ''
                                    ),
                                })
                            }
                            className={classes.executableInputElement}
                        />
                        <TooltipHost content='Select executable...'>
                            <IconButton
                                iconProps={{ iconName: 'Folder' }}
                                onClick={this._promptForExecutableSelect}
                            />
                        </TooltipHost>
                    </Stack>
                    <TextField
                        value={argumentsInputText}
                        onChange={(event) =>
                            this.setState({
                                argumentsInputText: (event.target as any).value,
                            })
                        }
                        label='Arguments:'
                        placeholder="ex. '-f {{file}}' or '-d {{directory}}'"
                    />
                </Stack>
                <DialogFooter>
                    <PrimaryButton
                        iconProps={{ iconName: 'CheckMark' }}
                        disabled={!executableInputText || !argumentsInputText}
                        onClick={() =>
                            this.props.submitted({
                                name: 'Custom IDE',
                                type: 'CUSTOM',
                                args: argumentsInputText.split(' '),
                                path: executableInputText,
                            })
                        }
                    >
                        Set
                    </PrimaryButton>
                    <Button
                        iconProps={{ iconName: 'Cancel' }}
                        onClick={this.props.canceled}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </Dialog>
        );
    }

    public componentDidMount() {
        ipcRenderer.on('selectedFile', this._selectedFile);
    }

    public componentDidUpdate(oldProps: Props) {
        if (
            oldProps.currentIde !== this.props.currentIde ||
            (!oldProps.visible && !!this.props.visible)
        ) {
            this.setState({
                executableInputText: this.props.currentIde?.path,
                argumentsInputText: this.props.currentIde?.args.join(' '),
            });
        }
    }

    private _selectedFile = (
        _event: IpcRendererEvent,
        executableInputText: string
    ) => this.setState({ executableInputText });

    public componentWillUnmount() {
        ipcRenderer.removeListener('selectedFile', this._selectedFile);
    }

    private _promptForExecutableSelect = () => {
        ipcRenderer.send('requestSelectedFile');
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(IdeManualSpecifier);

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
                    width: '70vw',
                    maxWidth: 'none',
                },
            },
        },
        executableInputElementStack: {
            alignItems: 'flex-end',
        },
        executableInputElement: {
            flex: 1,
        },
    });
};
