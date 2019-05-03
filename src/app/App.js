import React, {
  Component
} from 'react';
import './App.css';

import MainView from './views/main-view/MainView';
import WelcomeView from './views/welcome-view/WelcomeView';
import SettingsView from './views/settings-view/SettingsView';

import { connect } from 'react-redux';

import { initializeApp, setWindowVisible, setActiveView, hideWindow, isSetupComplete } from './common/reducers/app-reducer/actions';
import MessageDialog from 'app/common/components/message-dialog/MessageDialog';

const electron = window.require('electron');

class App extends Component {

  render() {
    return (
      <div className={`app ${this.props.theme ? this.props.theme : 'edge'}`} tabIndex="0" onKeyDown={this.props.viewSpecificKeyHandler}>
        {this.props.activeView === 'settings-view' && <SettingsView />}
        {this.props.activeView === 'main-view' && <MainView />}
        {this.props.activeView === 'welcome-view' && <WelcomeView />}
        {this.props.dialogQueue.length && <MessageDialog dialog={this.props.dialogQueue[0]}/>}
      </div>
    );
  }

  async componentDidMount() {
    console.log(process.env.NODE_ENV);
    electron.remote.getCurrentWindow().on('show', () => this.props.setWindowVisible(true));
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
      electron.remote.getCurrentWindow().on('blur', () => {
        if (this.props.activeView === 'main-view') {
          this.props.hideWindow()
        }
      });
    }
    this.props.setActiveView(await this.props.isSetupComplete() ? 'main-view' : 'welcome-view');
    this.props.initializeApp();
  }

  componentWillUnmount() {
    electron.remote.getCurrentWindow().removeAllListeners('show');
    electron.remote.getCurrentWindow().removeAllListeners('blur');
  }
}

const mapStateToProps = state => ({
  activeView: state.appReducer.activeView,
  filterText: state.appReducer.filterText,
  viewSpecificKeyHandler: state.appReducer.viewSpecificKeyHandler,
  reScanDirectoriesOvernight: state.settingsReducer.reScanDirectoriesOvernight,
  theme: state.settingsReducer.theme,
  dialogQueue: state.dialogReducer.dialogQueue
})

export default connect(mapStateToProps, { setWindowVisible, setActiveView, initializeApp, hideWindow, isSetupComplete })(App);