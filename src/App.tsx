import './App.module.scss';

import * as React from 'react';

import {
    MotionAnimations,
    MotionDurations,
    MotionTimings,
} from '@uifabric/fluent-theme';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { initializeIcons, mergeStyleSets } from '@fluentui/react';

import { AppTheme } from 'src/types';
import { CSSTransition } from 'react-transition-group'; // ES6
import ExceptionViewer from 'src/components/ExceptionViewer';
import Home from './routes/Home';
import { RootState } from 'src/redux/store/types';
import Settings from 'src/routes/Settings';
import Setup from 'src/routes/Setup';
import { appActions } from 'src/redux/features/app';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { initListeners } from 'src/ipc-handler';
import { requestSettingsFromMainProcess } from 'src/utils/load-settings';
import store from 'src/redux/store';

initializeIcons();

const electron: Electron.Remote = require('electron').remote;

//@ts-ignore
window.electron = electron;

type Props = {
    theme: AppTheme;
    setWindowVisible: typeof appActions.setWindowVisible;
} & RouteComponentProps<any>;

class App extends React.Component<Props, {}> {
    render() {
        const { theme } = this.props;
        if (!theme) {
            return null;
        }
        const classes = buildClasses(theme);
        const routes = [
            {
                baseClass: classes.home,
                enterClass: classes.homeEnter,
                enterActiveClass: classes.homeEnterActive,
                exitClass: classes.homeExit,
                exitActiveClass: classes.homeExitActive,
                path: '/',
                Component: Home,
                exact: true,
            },
            {
                baseClass: classes.settingsSetup,
                enterClass: classes.settingsSetupEnter,
                enterActiveClass: classes.settingsSetupEnterActive,
                exitClass: classes.settingsSetupExit,
                exitActiveClass: classes.settingsSetupExitActive,
                path: '/settings',
                Component: Settings,
                exact: false,
            },
            {
                baseClass: classes.settingsSetup,
                enterClass: classes.settingsSetupEnter,
                enterActiveClass: classes.settingsSetupEnterActive,
                exitClass: classes.settingsSetupExit,
                exitActiveClass: classes.settingsSetupExitActive,
                path: '/setup',
                Component: Setup,
                exact: false,
            },
        ];
        return (
            <div className={classes.app} tabIndex={0}>
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        exact={route.exact}
                        path={route.path}
                    >
                        {({ match }: { match: any }) => (
                            <CSSTransition
                                in={match != null}
                                timeout={350}
                                classNames={{
                                    enter: route.enterClass,
                                    enterActive: classnames(
                                        route.enterActiveClass,
                                        classes.commonActive
                                    ),
                                    enterDone: classes.commonDone,
                                    exit: route.exitClass,
                                    exitActive: classnames(
                                        route.exitActiveClass,
                                        classes.commonActive
                                    ),
                                    exitDone: classes.commonDone,
                                }}
                                unmountOnExit
                            >
                                <div
                                    className={classnames(
                                        route.baseClass,
                                        classes.route
                                    )}
                                >
                                    <route.Component />
                                </div>
                            </CSSTransition>
                        )}
                    </Route>
                ))}
                <ExceptionViewer />
            </div>
        );
    }

    public componentWillMount = () => {
        initListeners(store);
        requestSettingsFromMainProcess();
        console.log(process.env.NODE_ENV);
        if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
            electron
                .getCurrentWindow()
                .on(
                    'blur',
                    () =>
                        this.props.location.pathname === '/' &&
                        this.props.setWindowVisible(false)
                );
        }
    };
}
const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
});
const mapDispatchToProps = {
    setWindowVisible: appActions.setWindowVisible,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

const buildClasses = (theme: AppTheme) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        app: {
            height: '100%',
            backgroundColor: theme.semanticColors.bodyBackground,
        },
        route: {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: theme.semanticColors.bodyBackground,
        },
        commonActive: {
            pointerEvents: 'none',
        },
        commonDone: {
            pointerEvents: 'initial',
        },
        home: { transition: 'opacity 250ms, transform 250ms' },
        homeEnter: { opacity: 0, transform: 'scale(0.93)' },
        homeEnterActive: { opacity: 1, transform: 'scale(1)' },
        homeExit: { opacity: 1, transform: 'scale(1)' },
        homeExitActive: { opacity: 0, transform: 'scale(0.93)' },
        settingsSetup: { transition: 'opacity 250ms, transform 250ms' },
        settingsSetupEnter: { opacity: 0, transform: 'scale(1.07)' },
        settingsSetupEnterActive: { opacity: 1, transform: 'scale(1)' },
        settingsSetupExit: { opacity: 1, transform: 'scale(1)' },
        settingsSetupExitActive: { opacity: 0, transform: 'scale(1.07)' },
    });
};
