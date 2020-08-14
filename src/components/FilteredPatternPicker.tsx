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
import React, { Component, Fragment } from 'react';

import { AppTheme } from 'src/types';
import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';
import { settingsActions } from 'src/redux/features/settings';

interface Props {
    className?: string;
    filteredPatterns: string[];
    theme: AppTheme;
    addFilteredPattern: typeof settingsActions.addFilteredPattern;
    deleteFilteredPattern: typeof settingsActions.deleteFilteredPattern;
}

interface State {
    inputValue: string;
    formValid: boolean;
}

class FilteredPatternPicker extends Component<Props, State> {
    private inputRef = React.createRef<ITextField>();
    private listRef = React.createRef<List>();

    state: State = {
        inputValue: '',
        formValid: false,
    };

    render() {
        const { className, filteredPatterns } = this.props;
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
                    items={filteredPatterns}
                    onRenderCell={(item) => this._onRenderCell(classes, item)}
                    onShouldVirtualize={() => false}
                    ref={this.listRef}
                />
                <form
                    className={classes.addNewPatternControls}
                    onSubmit={this._onSubmit}
                >
                    <TextField
                        value={this.state.inputValue}
                        className={classes.textField}
                        componentRef={this.inputRef}
                        prefix='Add Pattern:'
                        onChange={(_, inputValue) =>
                            this.setState({ inputValue })
                        }
                    />
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
        pattern?: string
    ): JSX.Element | null => {
        if (!classes || !pattern) {
            return null;
        }
        return (
            <Fragment>
                <div className={classes.listItemBody} data-is-focusable={true}>
                    <div className={classes.listItemText}>
                        <Text className={classes.listItemTextPath}>
                            {pattern}
                        </Text>
                    </div>
                    <div className={classes.listItemIconButtons}>
                        <TooltipHost
                            content='Delete Pattern'
                            directionalHint={DirectionalHint.topAutoEdge}
                        >
                            <IconButton
                                className={classes.listItemIconButton}
                                iconProps={{ iconName: 'Delete' }}
                                onClick={() =>
                                    this.props.deleteFilteredPattern(pattern)
                                }
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
    }

    public componentDidUpdate(oldProps: Props, oldState: State) {
        if (
            oldState.inputValue !== this.state.inputValue ||
            oldProps.filteredPatterns !== this.props.filteredPatterns
        ) {
            const formValid =
                !!this.state.inputValue &&
                !this.props.filteredPatterns.includes(
                    this.state.inputValue.trim()
                );
            this.setState({
                formValid,
            });
        }
        this.listRef.current.forceUpdate();
    }

    public focusInput = () => {
        if (!!this.inputRef.current) {
            this.inputRef.current.focus();
        }
    };

    private _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.addFilteredPattern(this.state.inputValue);
        this.setState({
            inputValue: '',
        });
        this.focusInput();
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    filteredPatterns: state.settings.filteredPatterns,
});
const mapDispatchToProps = {
    addFilteredPattern: settingsActions.addFilteredPattern,
    deleteFilteredPattern: settingsActions.deleteFilteredPattern,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilteredPatternPicker);

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
        addNewPatternControls: {
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
