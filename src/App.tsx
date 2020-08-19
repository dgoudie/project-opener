import './App.module.scss';

import * as React from 'react';

import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    withRouter,
} from 'react-router-dom';
import { initializeIcons, mergeStyleSets } from '@fluentui/react';

import { AppTheme } from 'src/types';
import ExceptionViewer from 'src/components/ExceptionViewer';
import Home from './routes/Home';
import { RootState } from 'src/redux/store/types';
import Settings from 'src/routes/Settings';
import { appActions } from 'src/redux/features/app';
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
        return (
            <div className={classes.app} tabIndex={0}>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/settings' component={Settings} />
                    {/* <Route path='/setup' component={Setup} /> */}
                </Switch>
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
    });
};
