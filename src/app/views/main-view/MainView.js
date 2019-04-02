import React, {
  Component
} from 'react';
import './MainView.css';

import PomList from './components/pom-list/PomList'
import TextFilter from './components/text-filter/TextFilter';

import { setCursor, openPom, clearFilteredPoms } from 'app/common/reducers/pom-reducer/actions';

import { setActiveView, setFilterText, hideWindow, setViewSpecificKeyHandler } from 'app/common/reducers/app-reducer/actions';

import { connect } from 'react-redux';

const MAX_POMS_SHOWN = 100;

class MainView extends Component {

  render() {
    return (
      <div className="main-view">
        <nav>
          <span className="title">pom-opener</span>
          <div>
            <button title="Settings" className="corner-button" onClick={() => this.props.setActiveView('settings-view')}>
              <i className="fas fa-cog"></i>
            </button>
            <button title="Hide" className="corner-button" onClick={this.props.hideWindow}>
              <i className="fas fa-window-minimize"></i>
            </button>
          </div>
        </nav>
        <TextFilter />
        <PomList max={MAX_POMS_SHOWN} />
      </div>
    );
  }

  componentDidMount() {
    this.props.setViewSpecificKeyHandler(
      (event) => {
        const { cursor, filteredPoms } = this.props;
        if (event.key === 'ArrowUp' && cursor > 0) {
          event.preventDefault();
          this.props.setCursor(this.props.cursor - 1);
        } else if (event.key === 'ArrowDown' && cursor < (filteredPoms.length - 1) && cursor < (MAX_POMS_SHOWN - 1)) {
          event.preventDefault();
          this.props.setCursor(this.props.cursor + 1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          this.props.setCursor(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          this.props.setCursor(filteredPoms.length > (MAX_POMS_SHOWN - 1) ? (MAX_POMS_SHOWN - 1) : filteredPoms.length - 1);
        } else if (event.key === 'Enter') {
          this.props.openPom(this.props.filteredPoms[this.props.cursor]);
        } else if (event.key === 'Escape') {
          if (this.props.filterText) {
            this.props.setFilterText('');
            this.props.clearFilteredPoms();
          }
          else {
            this.props.hideWindow();
          }
        }
      }
    )
  }
}

const mapStateToProps = state => ({
  poms: state.pomReducer.poms,
  filteredPoms: state.pomReducer.filteredPoms,
  cursor: state.pomReducer.cursor,
  filterText: state.appReducer.filterText
})

export default connect(mapStateToProps, { setCursor, openPom, setFilterText, clearFilteredPoms, hideWindow, setActiveView, setViewSpecificKeyHandler })(MainView);
