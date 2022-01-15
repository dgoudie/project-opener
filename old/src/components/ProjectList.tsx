import { List } from 'react-virtualized';
import ListItem from './ListItem';
import { Project } from 'src/types';
import React from 'react';
import { mergeStyleSets } from '@fluentui/react';

interface Props {
    projects: Project[];
    cursor: number;
    height: number;
    width: number;
    onAnyContextMenuClosed?: () => void;
}

interface State {
    classes: ReturnType<typeof buildClasses>;
}

export default class ProjectList extends React.PureComponent<Props, State> {
    state = {
        classes: buildClasses(),
    };

    public listRef = React.createRef<List>();

    public render() {
        const { projects } = this.props;
        const { classes } = this.state;
        return (
            <List
                ref={this.listRef}
                className={classes.pomList}
                width={this.props.width}
                height={this.props.height}
                rowHeight={62}
                rowRenderer={this.renderRow}
                rowCount={projects.length}
                overscanRowCount={2}
            />
        );
    }

    public componentDidUpdate() {
        if (!!this.listRef.current) {
            this.listRef.current.scrollToRow(this.props.cursor);
            this.listRef.current.forceUpdate();
            this.listRef.current.forceUpdateGrid();
        }
    }

    private renderRow = ({
        index,
        style,
        key,
    }: {
        index: number;
        style: any;
        key: string;
    }) => (
        <ListItem
            key={key}
            project={this.props.projects[index]}
            style={style}
            index={index}
            onContextMenuClosed={this.props.onAnyContextMenuClosed}
            cursor={this.props.cursor}
        />
    );
}

// Styles

const buildClasses = () => {
    return mergeStyleSets({
        pomList: {
            margin: 0,
            padding: 0,
            overflowY: 'auto',
        },
    });
};
