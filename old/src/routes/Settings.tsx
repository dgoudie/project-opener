import {
    CommandButton,
    DefaultButton,
    FocusTrapCallout,
    FocusZone,
    FontWeights,
    INavLink,
    ITheme,
    Nav,
    PrimaryButton,
    Stack,
    mergeStyleSets,
} from '@fluentui/react';
import React, { Component } from 'react';
import { Redirect, Route, withRouter } from 'react-router';
import { SettingsRoute, settingsRoutes } from '../utils/settings-routes';
import { Subscription, fromEvent } from 'rxjs';

import { AppTheme } from 'src/types';
import { CSSTransition } from 'react-transition-group';
import { Location } from 'history';
import { RootState } from 'src/redux/store/types';
import { RouteComponentProps } from 'react-router-dom';
import SettingsNav from 'src/components/SettingsNav';
import { ValueOf } from 'src/utils/value-of';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { exitApplication } from 'src/utils/show-hide';
import { isDefined } from 'src/utils/defined';

interface State {
    confirmExitVisible: boolean;
    redirectToHome: boolean;
    activeRoute: SettingsRoute;
    classes: ReturnType<typeof buildClasses>;
    routes: SettingsRoute[];
    enterClass: string;
    enterActiveClass: string;
    exitClass: string;
    exitActiveClass: string;
}

type Props = {
    theme: AppTheme;
    setupComplete: boolean;
} & RouteComponentProps<any>;

class Settings extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.keyHandlerSubscription = this.setupKeyHandler();
        const activeRoute = this._getActiveRouteFromLocation(
            this.props.location
        );
        const classes = buildClasses(this.props.theme);
        const routes = settingsRoutes;
        this.state = {
            confirmExitVisible: false,
            redirectToHome: false,
            activeRoute,
            classes,
            routes,
            enterClass: null,
            enterActiveClass: null,
            exitClass: null,
            exitActiveClass: null,
        };
    }
    private exitButtonWrapperRef = React.createRef<HTMLDivElement>();

    private keyHandlerSubscription: Subscription;

    public render() {
        const { redirectToHome, activeRoute, classes, routes } = this.state;
        const { setupComplete } = this.props;
        if (!setupComplete) {
            return <Redirect to='/setup/start' />;
        }
        if (!!redirectToHome) {
            return <Redirect to='/' />;
        }
        return (
            <div className={classes.root}>
                <SettingsNav activeRoute={activeRoute} />
                <div className={classes.body}>
                    <div className={classes.navWrapper}>
                        <Nav
                            selectedKey={activeRoute.key}
                            styles={{ root: { width: 200 } }}
                            groups={[{ links: settingsRoutes }]}
                            onLinkClick={this._onLinkClick}
                        />
                        <div
                            className={classes.exitButtonWrapper}
                            ref={this.exitButtonWrapperRef}
                        >
                            <CommandButton
                                iconProps={{
                                    iconName: 'ChromeClose',
                                    styles: {
                                        root: {
                                            color: this.props.theme.palette
                                                .redDark,
                                        },
                                    },
                                }}
                                text='Exit Application'
                                styles={{ root: { height: 44, width: '100%' } }}
                                onClick={() =>
                                    this.setState({ confirmExitVisible: true })
                                }
                            />
                        </div>
                        {this.state.confirmExitVisible && (
                            <FocusTrapCallout
                                target={this.exitButtonWrapperRef}
                                onDismiss={() =>
                                    this.setState({ confirmExitVisible: false })
                                }
                                setInitialFocus={true}
                            >
                                <div className={classes.calloutHeader}>
                                    <p className={classes.calloutTitle}>
                                        Are you sure you'd like to exit?
                                    </p>
                                </div>
                                <FocusZone>
                                    <Stack
                                        className={classes.calloutButtons}
                                        gap={8}
                                        horizontal
                                        horizontalAlign='end'
                                    >
                                        <PrimaryButton
                                            className={
                                                classes.calloutExitButton
                                            }
                                            onClick={() => exitApplication()}
                                        >
                                            Exit
                                        </PrimaryButton>
                                        <DefaultButton
                                            onClick={() =>
                                                this.setState({
                                                    confirmExitVisible: false,
                                                })
                                            }
                                        >
                                            Cancel
                                        </DefaultButton>
                                    </Stack>
                                </FocusZone>
                            </FocusTrapCallout>
                        )}
                    </div>
                    <div className={classes.routeWrapper}>
                        {routes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.url.replace('#', '')}
                            >
                                {({ match }: { match: any }) => (
                                    <CSSTransition
                                        in={match != null}
                                        timeout={250}
                                        classNames={{
                                            enter: this.state.enterClass,
                                            enterActive: classnames(
                                                this.state.enterActiveClass
                                            ),
                                            exit: this.state.exitClass,
                                            exitActive: classnames(
                                                this.state.exitActiveClass
                                            ),
                                        }}
                                        unmountOnExit
                                    >
                                        <div className={classes.rootRoute}>
                                            <route.Component />
                                        </div>
                                    </CSSTransition>
                                )}
                            </Route>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    public componentDidUpdate(oldProps: Props) {
        if (oldProps.theme !== this.props.theme) {
            this.setState({ classes: buildClasses(this.props.theme) });
        }
    }

    public componentWillUnmount() {
        this.keyHandlerSubscription.unsubscribe();
    }

    private _getRouteIndex(route: SettingsRoute, routes: SettingsRoute[]) {
        return routes.findIndex((r) => r.key === route.key);
    }

    private _setRouteClasses = (
        classes: ReturnType<typeof buildClasses>,
        prevRouteIndex: number,
        nextRouteIndex: number
    ) => {
        if (isDefined(prevRouteIndex)) {
            if (nextRouteIndex > prevRouteIndex) {
                this.setState({
                    enterClass: classes.greaterRouteEnter,
                    enterActiveClass: classes.greaterRouteEnterActive,
                    exitClass: classes.greaterRouteExit,
                    exitActiveClass: classes.greaterRouteExitActive,
                });
            } else if (nextRouteIndex < prevRouteIndex) {
                this.setState({
                    enterClass: classes.lesserRouteEnter,
                    enterActiveClass: classes.lesserRouteEnterActive,
                    exitClass: classes.lesserRouteExit,
                    exitActiveClass: classes.lesserRouteExitActive,
                });
            }
        }
    };

    private _onLinkClick = (
        _ev?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
        navLink?: INavLink
    ) => {
        if (!navLink || navLink.key === this.state.activeRoute.key) {
            return;
        }
        const oldRouteIndex = this._getRouteIndex(
            this.state.activeRoute,
            settingsRoutes
        );
        const activeRoute = settingsRoutes.find(
            (route) => route.key === navLink.key
        );
        const newRouteIndex = this._getRouteIndex(activeRoute, settingsRoutes);
        this._setRouteClasses(this.state.classes, oldRouteIndex, newRouteIndex);
        !!activeRoute && this.setState({ activeRoute });
    };

    private setupKeyHandler = () => {
        return fromEvent<KeyboardEvent>(document, 'keydown').subscribe(
            this.handleKeyEvent
        );
    };

    private handleKeyEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.setState({ redirectToHome: true });
        }
    };

    private _getActiveRouteFromLocation = (location: Location) => {
        const selectedKey = location.pathname.replace(/\/settings\//, '');
        const activeRoute = settingsRoutes.find(
            (route) => route.key === selectedKey
        );
        return activeRoute;
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    setupComplete: state.settings.setupComplete,
});
const mapDispatchToProps = {};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Settings)
);

// Styles

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
        },
        body: {
            display: 'flex',
            height: '100%',
            flex: 1,
            overflow: 'hidden',
        },
        navWrapper: {
            display: 'flex',
            flexDirection: 'column',
            selectors: {
                '.ms-FocusZone': {
                    flex: 1,
                },
            },
        },
        exitButtonWrapper: {
            height: '44px',
            flexShrink: 1,
            flex: 0,
        },
        calloutHeader: {
            padding: '18px 24px 12px',
        },
        calloutTitle: [
            theme.fonts.xLarge,
            {
                margin: 0,
                color: theme.palette.neutralPrimary,
                fontWeight: FontWeights.semilight,
            },
        ],
        calloutActions: {
            position: 'relative',
            marginTop: 20,
            width: '100%',
            whiteSpace: 'nowrap',
        },
        calloutButtons: {
            padding: '0 24px 24px',
        },
        calloutExitButton: {
            background: theme.palette.redDark,
            color: 'white',
            selectors: {
                ':hover': {
                    background: theme.palette.red,
                    color: 'white',
                },
                ':active': {
                    background: theme.palette.redDark,
                    color: 'white',
                },
            },
        },
        calloutSubtext: [
            theme.fonts.small,
            {
                margin: 0,
                color: theme.palette.neutralPrimary,
                fontWeight: FontWeights.semilight,
            },
        ],
        routeWrapper: {
            position: 'relative',
            display: 'flex',
            alignSelf: 'stretch',
            flexDirection: 'row',
            flex: 1,
        },
        rootRoute: {
            position: 'absolute',
            display: 'flex',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: theme.semanticColors.bodyBackground,
        },
        greaterRouteEnter: { opacity: 0, transform: 'translateY(7%)' },
        greaterRouteEnterActive: {
            opacity: 1,
            transform: 'translateY(0)',
            transition:
                'opacity 200ms cubic-bezier(0.0, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        },
        greaterRouteExit: { opacity: 1, transform: 'translateY(0)' },
        greaterRouteExitActive: {
            opacity: 0,
            transform: 'translateY(-7%)',
            transition:
                'opacity 200ms cubic-bezier(0.0, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        },
        lesserRouteEnter: { opacity: 0, transform: 'translateY(-7%)' },
        lesserRouteEnterActive: {
            opacity: 1,
            transform: 'translateY(0)',
            transition:
                'opacity 200ms cubic-bezier(0.0, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        },
        lesserRouteExit: { opacity: 1, transform: 'translateY(0)' },
        lesserRouteExitActive: {
            opacity: 0,
            transform: 'translateY(7%)',
            transition:
                'opacity 200ms cubic-bezier(0.0, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        },
    });
};
