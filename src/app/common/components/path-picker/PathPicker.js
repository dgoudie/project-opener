import React, { Component } from 'react'
import { connect } from 'react-redux';
import './PathPicker.css';
import copy from 'copy-to-clipboard';

import { addPath, deletePath, scanPath } from 'app/common/reducers/path-reducer/actions';

class PathPicker extends Component {
    render() {
        return (
            <div className="path-picker">
                <ul>
                    {this.props.paths.map(path => (
                        <li key={path.path}>
                            <span>{path.path}</span>
                            <div className="buttons">
                                <button title="Copy path to clipboard" className="blue" onClick={() => copy(path.path)}>
                                    <i className="fas fa-copy"></i>
                                </button>
                                <button title="Re-scan directory" disabled={path.currentlyScanning} className={`blue ${path.currentlyScanning ? 'scanning' : ''}`} onClick={() => this.props.scanPath(path)}>
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                                <button title="Delete directory" className="red" onClick={() => this.props.deletePath(path)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                    {this.props.paths.length === 0 && <div style={{ textAlign: 'center' }}>No directories have been specified. Use the <i>Add Directory</i> button to add one.</div>}
                </ul>
                <button className="standard primary" onClick={this.props.addPath}>
                    <i className="fas fa-plus"></i>
                    Add Directory
                </button>
            </div>
        )
    }
}



const mapStateToProps = state => ({
    paths: state.pathReducer.paths
})

export default connect(mapStateToProps, { addPath, deletePath, scanPath })(PathPicker);