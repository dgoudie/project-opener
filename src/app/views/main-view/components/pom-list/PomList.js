import React, {
  Component
} from 'react';
import './PomList.css';


import { openPom, openDirectory } from 'app/common/reducers/pom-reducer/actions';

import { connect } from 'react-redux';
import ListItem from './components/list-item/ListItem';

class PomList extends Component {

  listRef = React.createRef();

  render() {
    let { poms, cursor, max } = this.props;
    let viewPoms = poms.slice(0, max);
    const showTwentyLimitWarning = viewPoms.length === max;
    this.scrollList(cursor, viewPoms, showTwentyLimitWarning);
    viewPoms = viewPoms
      .map((pom, i) => (
        <ListItem pom={pom} i={i} key={i} />
      ));
    return (
      <ul ref={this.listRef} className={`pom-list`}>
        {viewPoms}
        {showTwentyLimitWarning ? <li className="no-interaction">{`Only the first ${max} results are shown.`}</li> : null}
      </ul>
    );
  }

  scrollList(cursor, poms, showLimitWarning) {
    if (this.listRef.current) {
      const listHeight = this.listRef.current.scrollHeight - (showLimitWarning ? 42 : 0);
      const viewbleHeight = this.listRef.current.getBoundingClientRect().height;
      const averageItemHeight = (listHeight / poms.length);
      this.listRef.current.scrollTo(0, (averageItemHeight * cursor) - ((.5 * viewbleHeight) - (0.5 * averageItemHeight)))
    }
  }
}

const mapStateToProps = state => ({
  poms: state.pomReducer.filteredPoms,
  cursor: state.pomReducer.cursor
})

export default connect(mapStateToProps, { openPom, openDirectory })(PomList);