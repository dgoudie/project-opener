import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import './WelcomeView.css';
import PathPicker from 'app/common/components/path-picker/PathPicker';
import FilteredPatternPicker from 'app/common/components/filtered-pattern-picker/FilteredPatternPicker';
import IdePicker from 'app/common/components/ide-picker/IdePicker';

import { setActiveView, markSetupComplete } from 'app/common/reducers/app-reducer/actions';

class WelcomeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 0
    }
    this.handleIdePickerChange = this.handleIdePickerChange.bind(this);
  }

  render() {
    return (
      <div className="welcome-view" autoFocus>
        {this.state.page > 0 &&
          <button disabled={this.disableGoBackButton()} className="arrow-button" onClick={() => this.setState({ page: this.state.page - 1 })}>
            <span className="fas fa-angle-left"></span>
          </button>
        }
        {this.state.page === 0 &&
          <div className="page-0">
            <h1>Welcome</h1>
            <p className="tip">This tool will help you to open your Maven &amp; NPM projects very quickly.</p>
            <button autoFocus className="standard primary set-path" onClick={() => this.setState({ page: 1 })}>Get Started</button>
          </div>
        }
        {this.state.page === 1 &&
          <div className="page page-1">
            <h1><span className="fas fa-filter"></span>Excluded File Patterns</h1>
            <p>Before selecting the directories to scan, specify any files or folders you{`'`}d like to avoid scanning. A few have been
            added by default, but can be removed. More can be added, as well.</p>
            <FilteredPatternPicker />
          </div>
        }
        {this.state.page === 2 &&
          <div className="page page-2">
            <h1><span className="fas fa-folder-open"></span>Directories</h1>
            <p>Now, select the directories to scan for projects. You must select at least one before continuing.</p>
            <PathPicker />
          </div>
        }
        {this.state.page === 3 &&
          <div className="page page-3">
            <h1><span className="fas fa-code"></span>IDEs</h1>
            <p>Finally, select the IDEs that should be used to open each type of project. If no IDEs are found on your system automatically,
              you can add a path to an executable file manually.</p>
            <IdePicker onChange={this.handleIdePickerChange}/>
          </div>
        }
        {this.state.page === 4 &&
          <div className="page page-4">
            <span className="fas fa-check"></span>
            <h1>All done.</h1>
            <button className="standard primary" onClick={this.setupComplete}>Continue</button>
          </div>
        }
        {this.state.page > 0 &&
          <button disabled={this.disableMoveOnButton()} onClick={() => this.setState({ page: this.state.page + 1 })} className="arrow-button">
            <span className="fas fa-angle-right"></span>
          </button>
        }
      </div>
    );
  }

  setupComplete = () => {
    this.props.markSetupComplete();
    this.props.setActiveView('main-view');
  }

  disableMoveOnButton = () => {
    switch (this.state.page) {
      case 2: {
        return this.props.paths.length === 0
      }
      case 3: {
        return !this.props.mavenIde.path || !this.props.npmIde.path
      }
      case 4: {
        return true;
      }
      default: return false;
    }
  }

  disableGoBackButton = () => {
    return this.state.page <= 1;
  }

  handleIdePickerChange = () => {
    this.forceUpdate();
  }
}

const mapStateToProps = state => ({
  paths: state.pathReducer.paths,
  mavenIde: state.settingsReducer.mavenIde,
  npmIde: state.settingsReducer.npmIde
})

export default connect(mapStateToProps, { setActiveView, markSetupComplete })(WelcomeView);