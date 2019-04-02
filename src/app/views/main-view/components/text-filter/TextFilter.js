import React, {
  Component
} from 'react';
import './TextFilter.css';
import { connect } from 'react-redux';

import { filterPoms, clearFilteredPoms } from 'app/common/reducers/pom-reducer/actions';
import { setFilterText } from 'app/common/reducers/app-reducer/actions';

const WAIT_INTERVAL = 150;

class TextFilter extends Component {

  constructor(props) {
    super(props);
    // this.prepareToFilter = this.prepareToFilter.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
  }

  render() {
    if (this.props.windowVisible) {
      this.focus();
    }
    return (
      <div className="text-filter input-wrapper">
        <input ref={(input) => this.primaryInputRef = input} value={this.props.filterText} onChange={this.prepareToFilter} placeholder={`Search ${this.props.totalPomCount} projects for...`} />
        {this.props.filterText ? <i className="close-button fas fa-times" onClick={this.clearInput} /> : null}
      </div>
    );
  }

  componentDidMount() {
    this.timer = null;
    this.focus();
  }

  prepareToFilter = (event) => {
    clearTimeout(this.timer);
    this.props.setFilterText(event.target.value);
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  triggerChange() {
    this.props.filterPoms(this.props.filterText);
  }

  focus() {
    if (this.primaryInputRef) {
      this.primaryInputRef.focus();
    }
  }

  clearInput = () => {
    this.props.clearFilteredPoms();
    this.props.setFilterText('');
    this.focus();
  }
}

const mapStateToProps = state => ({
  totalPomCount: state.pomReducer.poms.length,
  windowVisible: state.appReducer.visible,
  filterText: state.appReducer.filterText
})

export default connect(mapStateToProps, { filterPoms, clearFilteredPoms, setFilterText })(TextFilter);