import React, { Component } from 'react'

import './Dialog.css'

export default class Dialog extends Component {
    render() {
        return (
            <div className={`${this.props.className} dialog`}>
                <div className="background"></div>
                <div className="window">{this.props.children}</div>
            </div>
        )
    }
}