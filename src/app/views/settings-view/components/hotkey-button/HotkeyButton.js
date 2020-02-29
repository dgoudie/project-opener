import React, { Component } from 'react'
import { connect } from 'react-redux';

import './HotkeyButton.css';

class HotkeyButton extends Component {

    render() {
        return (
            <div className={`${this.props.className} hotkey-setting`}>
                <div>{this.props.decodeHotKey(this.props.hotkey).join(' + ')}</div>
                <button title="Edit Hotkey" className="fas fa-pen" onClick={this.props.onClick}></button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    hotkey: state.settingsReducer.hotkey
})

export default connect(mapStateToProps, {})(HotkeyButton);
