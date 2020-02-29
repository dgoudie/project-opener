import React, {
  Component
} from 'react';

import PathPicker from 'app/common/components/path-picker/PathPicker';
import FilteredPatternPicker from 'app/common/components/filtered-pattern-picker/FilteredPatternPicker';
import IdePicker from 'app/common/components/ide-picker/IdePicker';
import Toggle from 'app/common/components/toggle/Toggle';

import './SettingsView.css';

import { setActiveView, setViewSpecificKeyHandler, exitApplication } from 'app/common/reducers/app-reducer/actions';
import { setReScanDirectoriesOvernight, setTheme, setHotkey } from 'app/common/reducers/settings-reducer/actions';

import { connect } from 'react-redux';
import ReactDropdown from 'react-dropdown';
import HotkeyButton from './components/hotkey-button/HotkeyButton';
import About from './components/about/About';
import HotkeyCapture from './components/hotkey-capture/HotkeyCapture';
import ConfirmExit from './components/confirm-exit/ConfirmExit';

class SettingsView extends Component {

  state = {
    page: 0,
    hotkeyCaptureVisible: false,
    confirmExitVisible: false,
  }

  render() {
    const { page, hotkeyCaptureVisible, confirmExitVisible } = this.state;
    return (
      <div className="settings-view">
        <nav>
          <button autoFocus title="Back" className="corner-button" onClick={() => this.props.setActiveView('main-view')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
          </div>
        </nav>
        <h1>Settings</h1>
        <div className="tab-bar">
          <button className={`${page === 0 ? 'selected' : ''}`} onClick={() => this.setState({ page: 0 })}>General</button>
          <button className={`${page === 1 ? 'selected' : ''}`} onClick={() => this.setState({ page: 1 })}>Filtered Patterns</button>
          <button className={`${page === 2 ? 'selected' : ''}`} onClick={() => this.setState({ page: 2 })}>Directories</button>
          <button className={`${page === 3 ? 'selected' : ''}`} onClick={() => this.setState({ page: 3 })}>IDEs</button>
          <button className={`${page === 4 ? 'selected' : ''}`} onClick={() => this.setState({ page: 4 })}>About</button>
        </div>
        {page === 0 &&
          <div className="page page-0">
            <section>
              <p>
                <span className="title">Theme</span>
                <span className="desc">Choose a color scheme for the application</span>
              </p>
              <ReactDropdown className="theme value" options={themeOptions} value={this.props.theme} onChange={(selectedTheme) => this.props.setTheme(selectedTheme.value)} />
            </section>
            <section>
              <p>
                <span className="title">Re-scan Overnight</span>
                <span className="desc">Automatically re-scan directories overnight</span>
              </p>
              <Toggle className="value" value={this.props.reScanDirectoriesOvernight} onChange={(newVal) => this.props.setReScanDirectoriesOvernight(newVal)} />
            </section>
            <section>
              <p>
                <span className="title">Hotkey</span>
                <span className="desc">Specify the key combination that will activate the application when hidden</span>
              </p>
              {hotkeyCaptureVisible && <HotkeyCapture decodeHotKey={decodeHotKey} onSet={this._onHotkeyDialogSet} onCancel={this._onHotkeyDialogCancel} />}
              <HotkeyButton decodeHotKey={decodeHotKey} className="value" onClick={() => this.setState({ hotkeyCaptureVisible: true })} />
            </section>
            <section>
              <p>
                <span className="title">Exit</span>
                <span className="desc">Fully exit the application</span>
              </p>
              {confirmExitVisible && <ConfirmExit onCancel={() => this.setState({confirmExitVisible: false})}/> }
              <button className="standard danger value" onClick={() => this.setState({confirmExitVisible: true})}>Exit</button>
            </section>
          </div>
        }
        {page === 1 &&
          <div className="page page-1">
            <div className="description">
              <p>Specify file patterns to ignore when scanning the directories above.</p>
            </div>
            <FilteredPatternPicker />
          </div>
        }
        {page === 2 &&
          <div className="page page-2">
            <div className="description">
              <p>Choose directories to search for projects. This search is recursive, so all child directories will be searched as well.</p>
            </div>
            <PathPicker />
          </div>
        }
        {page === 3 &&
          <div className="page page-3">
            <div className="description">
              <p>Select the IDEs to open different types of project with.</p>
            </div>
            <IdePicker />
          </div>
        }
        {page === 4 &&
          <About />
        }
      </div>
    );
  }

  componentDidUpdate() {
    if (this.state.aboutVisible) {
      this.props.setViewSpecificKeyHandler(
        (event) => {
          if (event.key === 'Escape') {
            this.setState({ aboutVisible: false });
          }
        }
      );
    } else if (this.state.hotkeyCaptureVisible) {
      this.props.setViewSpecificKeyHandler(
        (event) => {
          if (event.key === 'Escape') {
            this.setState({ hotkeyCaptureVisible: false });
          }
        }
      );
    } else {
      this.props.setViewSpecificKeyHandler(
        (event) => {
          if (event.key === 'Escape') {
            this.props.setActiveView('main-view');
          }
        }
      );
    }
  }

  _onHotkeyDialogCancel = () => {
    this.props.setHotkey(this.props.hotkey);
    this.setState({ hotkeyCaptureVisible: false });
  }

  _onHotkeyDialogSet = (hotkey) => {
    this.props.setHotkey(encodeHotKey(hotkey));
    this.setState({ hotkeyCaptureVisible: false });
  }
}

const decodeHotKey = (encodedHotKey) => {
  const keys = [];
  const encodedKeys = encodedHotKey.split('+');
  if (encodedKeys.indexOf('CommandOrControl') >= 0) {
    keys.push('ctrl');
  }
  if (encodedKeys.indexOf('Alt') >= 0) {
    keys.push('alt');
  }
  if (encodedKeys.indexOf('Shift') >= 0) {
    keys.push('shift');
  }
  keys.push(encodedKeys[encodedKeys.length - 1].toLowerCase());
  return keys;
}

const encodeHotKey = (decodedHotKey) => {
  let encodedHotKey = [];
  if (decodedHotKey.indexOf('ctrl') >= 0) {
    encodedHotKey.push('CommandOrControl');
  }
  if (decodedHotKey.indexOf('alt') >= 0) {
    encodedHotKey.push('Alt');
  }
  if (decodedHotKey.indexOf('shift') >= 0) {
    encodedHotKey.push('Shift');
  }
  encodedHotKey.push(decodedHotKey[decodedHotKey.length - 1].toUpperCase());
  return encodedHotKey.join('+');
}

const themeOptions = [
  {
    value: 'edge',
    label: 'Edge'
  },
  {
    value: 'meadow',
    label: 'Meadow'
  },
  {
    value: 'dawn',
    label: 'Dawn'
  },
  {
    value: 'robot',
    label: 'Robot'
  },
  {
    value: 'swamp',
    label: 'Swamp'
  },
  {
    value: 'crane',
    label: 'Crane'
  },
  {
    value: 'race',
    label: 'Race'
  },
  {
    value: 'crowd',
    label: 'Crowd'
  },
  {
    value: 'hive',
    label: 'Hive'
  },
  {
    value: 'sun',
    label: 'Sun'
  }
]

const mapStateToProps = state => ({
  poms: state.pomReducer.poms,
  reScanDirectoriesOvernight: state.settingsReducer.reScanDirectoriesOvernight,
  theme: state.settingsReducer.theme,
  hotkey: state.settingsReducer.hotkey
})

export default connect(
  mapStateToProps,
  {
    setReScanDirectoriesOvernight,
    setTheme,
    setActiveView,
    setViewSpecificKeyHandler,
    exitApplication,
    setHotkey
  }
)(SettingsView);