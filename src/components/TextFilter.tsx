import {
    ContextualMenuItemType,
    IContextualMenuProps,
    ITextField,
    IconButton,
    Separator,
    Text,
    TextField,
    TooltipHost,
    mergeStyleSets,
} from 'office-ui-fabric-react';
import React, { PureComponent } from 'react';
import { Subject, Subscription } from 'rxjs';

import AppIconSvg from 'src/components/AppIconSvg';
import { AppTheme } from 'src/types';
import { Link } from 'react-router-dom';
import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';

interface Props {
    theme: AppTheme;
    windowVisible: boolean;
    paths: string[];
    filterText: string;
    projectCount: number;
    filterTextChange: (text: string) => void;
    setWindowVisible: typeof appActions.setWindowVisible;
    scanPath: typeof appActions.scanPath;
    ref: any;
}

class TextFilter extends PureComponent<Props, {}> {
    private inputRef = React.createRef<ITextField>();

    public componentDidUpdate(oldProps: Props) {
        if (!!this.props.windowVisible && !oldProps.windowVisible) {
            this.focus();
        }
    }

    public render() {
        const classes = buildClasses();
        const separator = (
            <Separator vertical styles={{ root: { margin: '0 16px;' } }} />
        );
        const { projectCount } = this.props;
        return (
            <div
                className={classes.textFilter}
                // @ts-ignore
                style={{ WebkitAppRegion: 'drag' }}
            >
                <TextField
                    componentRef={this.inputRef}
                    className={classes.searchBox}
                    value={this.props.filterText}
                    onChange={this._onInputChange}
                    underlined
                    type='search'
                    label={`Search ${projectCount} projects for:`}
                    // @ts-ignore
                    styles={{
                        // @ts-ignore
                        field: { WebkitAppRegion: 'no-drag' },
                    }}
                />
                {separator}
                <AppIconSvg
                    theme={this.props.theme}
                    style={{
                        height: 20,
                        margin: '0 8px 0 0',
                        borderRadius: 2,
                    }}
                />
                <Text
                    style={{
                        color: this.props.theme.semanticColors.bodyText,
                        lineHeight: 1,
                    }}
                    className={classes.appTitle}
                >
                    project-opener
                </Text>
                {separator}
                <div
                    className='icons'
                    // @ts-ignore
                    style={{ WebkitAppRegion: 'no-drag' }}
                >
                    <TooltipHost
                        content='Scan Directories...'
                        styles={{ root: { display: 'inline-block' } }}
                    >
                        <IconButton
                            iconProps={{ iconName: 'SyncFolder' }}
                            tabIndex={-1}
                            menuProps={this._buildMenuProps()}
                        />
                    </TooltipHost>
                    <TooltipHost
                        content='Settings'
                        styles={{ root: { display: 'inline-block' } }}
                    >
                        <Link to='/settings/general'>
                            <IconButton
                                iconProps={{ iconName: 'Settings' }}
                                tabIndex={-1}
                            />
                        </Link>
                    </TooltipHost>
                    <TooltipHost
                        content='Minimize'
                        styles={{ root: { display: 'inline-block' } }}
                    >
                        <IconButton
                            iconProps={{ iconName: 'ChromeMinimize' }}
                            onClick={() => this.props.setWindowVisible(false)}
                        />
                    </TooltipHost>
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.props.filterTextChange('');
        this.focus();
    }

    public focus() {
        setTimeout(() => this.inputRef?.current?.focus());
    }

    private _onInputChange = (event: any) => {
        if (!!event) {
            const text = event.target.value;
            if (text !== this.props.filterText) {
                this.props.filterTextChange(event.target.value);
            }
        }
    };

    private _buildMenuProps = (): IContextualMenuProps => ({
        items: [
            {
                key: 'scan',
                itemType: ContextualMenuItemType.Section,
                sectionProps: {
                    title: 'Scan Directories',
                    items: [
                        ...this.props.paths.map((path: string) => ({
                            key: path,
                            text: path,
                            iconProps: {
                                iconName: 'Folder',
                            },
                            onClick: () => this.props.scanPath(path),
                        })),
                        {
                            key: 'div1',
                            itemType: ContextualMenuItemType.Divider,
                        },
                        {
                            key: 'scan_all',
                            text: 'Scan All Directories',
                            iconProps: {
                                iconName: 'FolderList',
                            },
                            onClick: this._onScanAll,
                        },
                    ],
                },
            },
        ],
    });

    private _onScanAll = () => {
        this.props.paths.forEach((path) => this.props.scanPath(path));
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    windowVisible: state.app.windowVisible,
    paths: state.settings.paths,
});
const mapDispatchToProps = {
    setWindowVisible: appActions.setWindowVisible,
    scanPath: appActions.scanPath,
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
})(TextFilter);

const buildClasses = () => {
    return mergeStyleSets({
        textFilter: {
            padding: 8,
            display: 'flex',
            alignItems: 'center',
        },
        searchBox: {
            flex: 1,
        },
        appTitle: {
            fontFamily: "'Roboto Slab'",
        },
    });
};
