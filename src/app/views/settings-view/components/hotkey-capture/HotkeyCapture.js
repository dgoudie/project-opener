import React, { Component } from 'react'
import { connect } from 'react-redux';
import hotkeys from 'hotkeys-js';

import './HotkeyCapture.css';
import Dialog from 'app/common/components/dialog/Dialog';

const globalShortcut = window.require('electron').remote.globalShortcut;

class HotkeyCapture extends Component {

    state = {
        hotkey: this.props.decodeHotKey(this.props.hotkey)
    }

    render() {
        return (
            <Dialog className="hotkey-capture-dialog">
                <h2>Set Hotkey</h2>
                <div className="hotkey">{this.state.hotkey.join(' + ')}</div>
                <div className="buttons">
                    <button autoFocus disabled={this.hotkeyInvalid()} className="standard primary" onClick={() => this.props.onSet(this.state.hotkey)}>Set</button>
                    <button className="standard" onClick={this.props.onCancel}>Cancel</button>
                </div>
            </Dialog>
        )
    }

    componentDidMount() {
        globalShortcut.unregisterAll();
        hotkeys('*', this.onHotkeyChange);
        hotkeys('enter', () => {
            if (!this.hotkeyInvalid()) {
                this.props.onSet(this.state.hotkey);
            }
        });
    }

    componentWillUnmount() {
        hotkeys.unbind('*');
        hotkeys.unbind('enter');
    }

    hotkeyInvalid = () => {
        const { hotkey } = this.state;
        return !!['ctrl', 'alt', 'shift'].find(invalid => hotkey[hotkey.length - 1] === invalid);
    }

    onHotkeyChange = (e) => {
        if (e.key === 'Enter') {
            return;
        }
        const keys = [];
        if (e.ctrlKey) {
            keys.push('ctrl');
        }
        if (e.altKey) {
            keys.push('alt');
        }
        if (e.shiftKey) {
            keys.push('shift');
        }
        if (!!e.key && e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
            keys.push(e.key.toLowerCase());
        }
        this.setState({
            hotkey: keys
        });
    }
}

const mapStateToProps = state => ({
    hotkey: state.settingsReducer.hotkey
})

export default connect(mapStateToProps, {})(HotkeyCapture);
