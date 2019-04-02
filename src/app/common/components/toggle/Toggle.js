import React, { Component } from 'react'
import './Toggle.css';

export default class Toggle extends Component {
    render() {
        return (
            <div className={`toggle ${this.props.value ? 'on': 'off'} ${this.props.className}`}>
                <button className={`off ${!this.props.value ? 'selected': ''}`} onClick={() => this.props.onChange(false)}>Off</button>
                <button className={`on ${this.props.value ? 'selected': ''}`} onClick={() => this.props.onChange(true)}>On</button>
            </div>
        )
    }
}
