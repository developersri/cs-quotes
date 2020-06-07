import React, { Component } from 'react';
import { connect } from 'react-redux';

import './message.css';

class Message extends Component {
  render () {
    let classes = ['message', this.props.msgType].join(' ');

    const message = this.props.msg ? (
      <div className={classes}>
        {this.props.msg}
      </div>
    ) : null;

    return message;
  }
}

const mapStateToProps = state => {
  return {
    msg: state.msg.message,
    msgType: state.msg.messageType,
  }
}

export default connect(mapStateToProps)(Message);
