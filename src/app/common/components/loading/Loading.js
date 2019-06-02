import React, { Component } from 'react';
import './Loading.css';
const electron = window.require('electron');

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div className="body">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className="base">
            <span></span>
            <div className="face"></div>
          </div>
        </div>
        <div className="longfazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1>Scanning...</h1>
      </div>
    );
  }

  closeApp() {
    electron.remote.getCurrentWindow().close();
  }
}

export default Loading;
