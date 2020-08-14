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
import { Redirect, Route, Switch, match, withRouter } from 'react-router';
import { SettingsRoute, settingsRoutes } from '../utils/settings-routes';
import { Subscription, fromEvent } from 'rxjs';

import About from './Settings_About';
import { AppTheme } from 'src/types';
import Directories from './Settings_Directories';
import FilteredPatterns from './Settings_FilteredPatterns';
import General from './Settings_General';
import IDEs from './Settings_IDEs';
import { Location } from 'history';
import { RootState } from 'src/redux/store/types';
import { RouteComponentProps } from 'react-router-dom';
import SettingsNav from 'src/components/SettingsNav';
import { connect } from 'react-redux';
import { exitApplication } from 'src/utils/show-hide';

interface State {
    confirmExitVisible: boolean;
    redirectToHome: boolean;
    activeRoute: SettingsRoute;
}

type Props = {
    theme: AppTheme;
} & RouteComponentProps<any>;

class Settings extends Component<Props, State> {
    public readonly state: State = {
        confirmExitVisible: false,
        redirectToHome: false,
        activeRoute: settingsRoutes[0],
    };
    private exitButtonWrapperRef = React.createRef<HTMLDivElement>();

    private keyHandlerSubscription: Subscription;

    public componentDidMount() {
        this._getActiveRouteFromLocation(this.props.location);
        this.keyHandlerSubscription = this.setupKeyHandler();
    }

    public componentWillUnmount() {
        this.keyHandlerSubscription.unsubscribe();
    }

    public render() {
        const { redirectToHome, activeRoute } = this.state;
        // if (!setupComplete) {
        //     return <Redirect to='/setup/start' />;
        // }
        if (!!redirectToHome) {
            return <Redirect to='/' />;
        }
        const classes = buildClasses(this.props.theme);
        const { url } = this.props.match;
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
                    <Switch>
                        <Route path={`${url}/general`} component={General} />
                        <Route
                            path={`${url}/directories`}
                            component={Directories}
                        />
                        <Route
                            path={`${url}/filtered-patterns`}
                            component={FilteredPatterns}
                        />
                        <Route path={`${url}/ides`} component={IDEs} />
                        <Route path={`${url}/about`} component={About} />
                    </Switch>
                </div>
            </div>
        );
    }

    private _onLinkClick = (
        _ev?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
        navLink?: INavLink
    ) => {
        if (!navLink) {
            return;
        }
        const activeRoute = settingsRoutes.find(
            (route) => route.key === navLink.key
        );
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
        !!activeRoute && this.setState({ activeRoute });
    };
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
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
            flexDirection: 'row',
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
    });
};
