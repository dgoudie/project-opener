import { AppTheme, Project } from 'src/types';
import {
    ContextualMenuItemType,
    DirectionalHint,
    FontSizes,
    FontWeights,
    IContextualMenuProps,
    ITheme,
    IconButton,
    Image,
    ImageFit,
    Text,
    TooltipHost,
    mergeStyleSets,
} from '@fluentui/react';
import React, { Component } from 'react';
import { openDirectory, openProject } from 'src/utils/open';

import ListItemModules from 'src/components/ListItemModules';
import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';

interface State {
    expandedToShowChildren: boolean;
}

interface Props {
    style: any;
    cursor: number;
    project: Project;
    index: number;
    onContextMenuClosed: () => void;
    theme: AppTheme;
    setWindowVisible: typeof appActions.setWindowVisible;
}

class ListItem extends Component<Props, State> {
    public state = {
        expandedToShowChildren: false,
    };
    public render() {
        const { project, cursor, index, theme } = this.props;
        const classNames = buildClasses(theme, cursor === index);
        if (project === undefined || index === undefined) {
            return null;
        }
        const menuProps = this.buildMenuProps(project);
        return (
            <div
                id={project.name}
                onClick={() => openProject(project)}
                className={classNames.listItem}
                data-is-focusable={true}
                style={{ styles: classNames.listItem, ...this.props.style }}
            >
                <Image
                    shouldFadeIn={false}
                    height={24}
                    width={24}
                    imageFit={ImageFit.contain}
                    title={`${project.type.commonName} Project`}
                    alt={project.type.commonName}
                    src={`assets/${project.type.key}.png`}
                ></Image>
                <div className={classNames.listItemMeta}>
                    <Text
                        className={classNames.listItemMetaName}
                        title={project.name}
                    >
                        {project.name}
                    </Text>
                    <Text
                        className={classNames.listItemMetaPath}
                        title={project.path}
                    >
                        {project.path}
                    </Text>
                </div>
                {!!project.children.length && (
                    <ListItemModules
                        theme={theme}
                        selected={cursor === index}
                        childrenIds={project.children}
                        onDialogClosed={this.props.onContextMenuClosed}
                    />
                )}
                <TooltipHost
                    content='Project Options'
                    directionalHint={DirectionalHint.bottomRightEdge}
                    styles={{
                        root: { display: 'inline-block', marginRight: 8 },
                    }}
                >
                    <IconButton
                        menuProps={menuProps}
                        className={classNames.listItemMenuIcon}
                        iconProps={{ iconName: 'GlobalNavButton' }}
                        onClick={(event) => event.stopPropagation()}
                    />
                </TooltipHost>
            </div>
        );
    }

    public shouldComponentUpdate(nextProps: Props) {
        const { cursor, index, project } = this.props;
        const wasHighlighted = cursor === index;
        const isHighlighted = nextProps.cursor === nextProps.index;
        return (
            project.clickCount !== nextProps.project.clickCount ||
            wasHighlighted !== isHighlighted ||
            project !== nextProps.project
        );
    }

    private _openDirectory(
        event:
            | React.MouseEvent<HTMLElement, MouseEvent>
            | React.KeyboardEvent<HTMLElement>,
        project: Project
    ) {
        event.stopPropagation();
        openDirectory(project);
    }

    public removeFileName(path: string) {
        return path.replace('/pom.xml', '').replace('/package.json', '');
    }

    private buildMenuProps = (project: Project): IContextualMenuProps => {
        return {
            onMenuDismissed: this.props.onContextMenuClosed,
            items: [
                {
                    key: 'tools',
                    itemType: ContextualMenuItemType.Section,
                    sectionProps: {
                        title: 'Tools',
                        items: [
                            {
                                key: 'openFolder',
                                text: 'Open Directory in Explorer',
                                iconProps: {
                                    iconName: 'FolderOpen',
                                },
                                onClick: (event) =>
                                    this._openDirectory(event, project),
                            },
                        ],
                    },
                },
                {
                    key: 'info',
                    itemType: ContextualMenuItemType.Section,
                    sectionProps: {
                        title: 'Info',
                        items: [
                            {
                                key: 'clickCount',
                                text: `Opened: ${project.clickCount} time${
                                    project.clickCount !== 1 ? 's' : ''
                                }`,
                                disabled: true,
                                iconProps: {
                                    iconName: 'NumberSymbol',
                                },
                            },
                        ],
                    },
                },
            ],
        };
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {
    setWindowVisible: appActions.setWindowVisible,
};
export default connect(mapStateToProps, mapDispatchToProps)(ListItem);

const buildClasses = (theme: ITheme, selected: boolean) => {
    return mergeStyleSets({
        listItem: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            background: !!selected
                ? theme.semanticColors.primaryButtonBackground
                : theme.semanticColors.bodyBackground,
            selectors: {
                '.ms-Image': {
                    margin: '0 12px',
                },
                ':hover': {
                    background: !!selected
                        ? theme.semanticColors.primaryButtonBackgroundHovered
                        : theme.semanticColors.bodyBackgroundHovered,
                },
                ':active': {
                    background: !!selected
                        ? theme.semanticColors.primaryButtonBackgroundPressed
                        : theme.semanticColors.bodyBackgroundChecked,
                },
            },
        },
        listItemMeta: {
            overflowX: 'hidden',
            flexDirection: 'column',
            flex: 1,
            margin: '12px 0',
            selectors: {
                '>span': {
                    display: 'block',
                },
            },
        },
        listItemMetaName: {
            fontWeight: FontWeights.bold,
            fontSize: FontSizes.large,
            color: !!selected
                ? theme.semanticColors.primaryButtonText
                : theme.semanticColors.bodyText,
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
        },
        listItemMetaPath: {
            fontWeight: FontWeights.semibold,
            fontSize: FontSizes.medium,
            color: !!selected
                ? theme.semanticColors.primaryButtonTextDisabled
                : theme.semanticColors.bodySubtext,
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
        },
        listItemMenuIcon: {
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
    });
};
