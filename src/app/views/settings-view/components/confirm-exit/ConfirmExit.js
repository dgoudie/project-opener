import React, { Component } from 'react'
import Dialog from 'app/common/components/dialog/Dialog';
import { exitApplication } from 'app/common/reducers/app-reducer/actions';
import { connect } from 'react-redux';

import './ConfirmExit.css';

class ConfirmExit extends Component {
  render() {
    return (
      <Dialog className="confirm-exit">
          <h4>Are you sure you&apos;d like to exit?</h4>
          <form className="buttons" onSubmit={this.props.exitApplication}>
            <button autoFocus className="standard danger" type="submit">Exit</button>
            <button className="standard" onClick={this.props.onCancel}>Cancel</button>
          </form>
      </Dialog>
    )
  }
}

export default connect(
  null,
  {
    exitApplication
  }
)(ConfirmExit);
