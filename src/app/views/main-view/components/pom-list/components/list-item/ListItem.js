import React, { Component } from 'react'

import { connect } from 'react-redux';

import npmIcon from 'app/assets/npm.png';
import mvnIcon from 'app/assets/mvn.png';

import { openPom, openDirectory } from 'app/common/reducers/pom-reducer/actions';

import './ListItem.css';

class ListItem extends Component {
  render() {
    let { pom, cursor, i } = this.props;
    return (
        <li id={pom.artifactId} onClick={() => this.props.openPom(pom)} className={`${cursor === i ? 'selected' : ''}`}>
        <div className="primary-info">
          <div className="artifact-id">
            {pom.path.indexOf('pom.xml') >= 0 && <img title="Maven project" alt="Maven" src={mvnIcon}></img>}
            {pom.path.indexOf('package.json') >= 0 && <img alt="NPM" title="NPM project"  src={npmIcon}></img>}
            <span>{pom.artifactId}</span>
          </div>
          <div className="path">
            <span>{this.removeFileName(pom.path)}</span>
            <button title="Open in Explorer" onClick={(event) => this.openDirectory(event, pom)} className="fas fa-folder-open"></button>
          </div>
        </div>
        <div className="end">
          <div className="click-count">{pom.clickCount}</div>
        </div>
      </li>
    )
  }

  shouldComponentUpdate(nextProps) {
    let { cursor, i, pom } = this.props;
    const wasHighlighted = cursor === i;
    const isHighlighted = nextProps.cursor === nextProps.i;
    return (wasHighlighted !== isHighlighted) || pom !== nextProps.pom;
  }

  openDirectory(event, pom) {
    event.stopPropagation();
    this.props.openDirectory(pom);
  }

  removeFileName(path) {
    return path
      .replace('/pom.xml', '')
      .replace('/package.json', '')
  }
}

const mapStateToProps = state => ({
  cursor: state.pomReducer.cursor
})

export default connect(mapStateToProps, { openPom, openDirectory })(ListItem);
