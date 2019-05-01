import React, { Component } from 'react'

import icon from 'app/assets/icon.png';

import './About.css';

const { shell } = window.require('electron').remote;

export default class About extends Component {

    render() {
        return (
            <div className="about">
                <div className="header">
                    <img alt="Application Icon" src={icon} />
                    <h1>pom-opener</h1>
                    <span>Version 2019.1.5</span></div>
                <div className="footer">
                    <span>&copy; dgoudie 2019</span>
                    <div className="fab fa-github" onClick={() => shell.openExternal('https://github.com/dgoudie/pom-opener')} title="https://github.com/dgoudie/pom-opener"/>
                </div>
            </div>
        )
    }
}
