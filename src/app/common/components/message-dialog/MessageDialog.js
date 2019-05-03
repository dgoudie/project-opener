
import React, { Component } from 'react'
import Dialog from 'app/common/components/dialog/Dialog';
import { connect } from 'react-redux';

import { shift } from 'app/common/reducers/dialog-reducer/actions';

import './MessageDialog.css';

class MessageDialog extends Component {
    render() {
        return (
            <Dialog className={`message-dialog${this.props.className ? ' ' + this.props.className : ''}`}>
                <div className="message-body">
                    <i className={this.determineIcon()}></i>
                    <pre>{this.props.dialog.text}</pre>
                </div>
                <div className="button-bar">
                    <button className="standard primary" onClick={this.props.shift}>Dismiss</button>
                </div>
            </Dialog>
        )
    }

    determineIcon = () => {
        switch(this.props.dialog.type) {
            case 'SUCCESS': return 'fas fa-check-circle';
            case 'ERROR': return 'fas fa-times-circle';
            case 'WARN': return 'fas fa-exclamation-circle';
            case 'INFO': return 'fas fa-info-circle';
            default: return '';
        }
    }
}

const mapStateToProps = state => ({
    activeView: state.appReducer.activeView,
    filterText: state.appReducer.filterText,
    viewSpecificKeyHandler: state.appReducer.viewSpecificKeyHandler,
    reScanDirectoriesOvernight: state.settingsReducer.reScanDirectoriesOvernight,
    theme: state.settingsReducer.theme,
    dialogQueue: state.dialogReducer.dialogQueue
});

const mapActionsToProps = {
    shift
}

export default connect(mapStateToProps, mapActionsToProps)(MessageDialog);