import { AppNotification, AppTheme } from 'src/types';
import { Depths, MotionTimings } from '@uifabric/fluent-theme';
import { FontSizes, ITheme, mergeStyleSets } from '@uifabric/styling';
import { Icon, Spinner, SpinnerSize, Text } from 'office-ui-fabric-react';
import React, { PureComponent } from 'react';

import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';

interface Props {
    theme: AppTheme;
    notifications: AppNotification[];
    dismissNotification: typeof appActions.dismissNotification;
}

interface State {
    activeNotification: AppNotification | null;
    cachedNotification: AppNotification | null;
}

class Snackbar extends PureComponent<Props, State> {
    state: State = {
        activeNotification: null,
        cachedNotification: null,
    };

    componentDidMount() {
        this._setActiveNotificationAndMarkDisplayed();
    }

    componentDidUpdate() {
        this._setActiveNotificationAndMarkDisplayed();
    }

    render() {
        let { activeNotification, cachedNotification } = this.state;
        const classes = buildClasses(this.props.theme);
        let rootClasses = [classes.root];
        if (!!activeNotification) {
            rootClasses = [...rootClasses, classes.rootVisible];
        } else {
            rootClasses = [...rootClasses, classes.rootNotVisible];
        }
        if (!cachedNotification) {
            return (
                <div
                    className={[classes.root, classes.rootNotVisible].join(' ')}
                ></div>
            );
        }
        const notification = !!activeNotification
            ? activeNotification
            : cachedNotification;
        return (
            <div className={rootClasses.join(' ')}>
                <Icon
                    iconName={notification.iconName}
                    className={classes.icon}
                />
                <Text className={classes.text}>
                    {this._transformNotificationText(
                        notification.text,
                        classes
                    )}
                </Text>
                {!!notification.dismissTimeMs ? (
                    <Icon
                        iconName='Cancel'
                        className={classes.dismiss}
                        onClick={() =>
                            this.props.dismissNotification(notification.id)
                        }
                        title='Dismiss'
                    />
                ) : (
                    <Spinner
                        className={classes.spinner}
                        size={SpinnerSize.small}
                    />
                )}
            </div>
        );
    }

    private _transformNotificationText = (
        text: string,
        classes: ReturnType<typeof buildClasses>
    ) => {
        const codeRegex = /\{\{highlight:(.+)\}\}/;
        let parts: any[] = text.split(codeRegex);
        let matches = text.match(codeRegex);
        if (!matches) {
            return parts;
        }
        parts = parts.reduce((arr, element, index) => {
            if (!element) return arr;

            if ((matches as RegExpMatchArray).includes(element)) {
                return [
                    ...arr,
                    <code className={classes.code} key={index}>
                        {element}
                    </code>,
                ];
            }

            return [...arr, element];
        }, []);

        return parts;
    };

    private _setActiveNotificationAndMarkDisplayed() {
        const newNotifications = this.props.notifications;
        if (!!newNotifications.length) {
            const notificationToDisplay = newNotifications[0];
            this.setState({
                activeNotification: notificationToDisplay,
                cachedNotification: notificationToDisplay,
            });
            this._markNotificationAsDisplayed(notificationToDisplay);
        } else {
            this.setState({
                activeNotification: null,
            });
        }
    }

    private _markNotificationAsDisplayed = (notification: AppNotification) => {
        if (!!notification.dismissTimeMs) {
            setTimeout(
                () => this.props.dismissNotification(notification.id),
                notification.dismissTimeMs
            );
        }
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    notifications: state.app.notifications,
});
const mapDispatchToProps = {
    dismissNotification: appActions.dismissNotification,
};
export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);

// Styles

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        root: {
            backgroundColor: theme.semanticColors.bodyStandoutBackground,
            color: theme.semanticColors.bodyText,
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 14px',
            borderRadius: '100px',
            transition: `bottom 150ms ${MotionTimings.linear}, opacity 150ms ${MotionTimings.linear}`,
            boxShadow: Depths.depth16,
        },
        rootNotVisible: {
            bottom: 6,
            opacity: 0,
        },
        rootVisible: {
            bottom: 12,
            opacity: 1,
        },
        icon: {
            fontSize: FontSizes.mediumPlus,
            marginRight: 12,
            color: theme.semanticColors.menuIcon,
        },
        text: {
            fontSize: FontSizes.mediumPlus,
        },
        code: {
            fontSize: FontSizes.medium,
            fontFamily: "'Roboto Mono', monospace",
            padding: '2px 6px',
            borderRadius: 4,
            background: theme.semanticColors.bodyFrameBackground,
        },
        dismiss: {
            cursor: 'pointer',
            fontSize: FontSizes.medium,
            padding: 3,
            marginLeft: 9,
            borderRadius: '100px',
            color: theme.palette.red,
            selectors: {
                ':hover': {
                    color: theme.palette.red,
                },
                ':active': {
                    color: theme.palette.red,
                },
            },
        },
        spinner: {
            marginLeft: 12,
        },
    });
};
