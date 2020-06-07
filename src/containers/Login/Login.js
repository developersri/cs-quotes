import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './login.css';
import provider1Logo from '../../assets/images/github-logo.png';
import provider2Logo from '../../assets/images/google-logo.png';
import axios from '../../services/axios/quotes';
import * as actions from '../../store/actions/index';

class Login extends Component {
  messageTimeout = null;

  clearMessageTimeout = () => {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  setMessageTimeout = (ms) => {
    this.messageTimeout = setTimeout(() => {
      this.props.unsetGlobalMessage();
    }, ms || 5000);
  }

  providerLogin (provider) {
    this.clearMessageTimeout();
    // axios.get('https://github.com/login/oauth/authorize?response_type=code&scope=user%3Aemail&client_id=fc2b7ae5b863a67c01d4', {
    //   header: {
    //     'Access-Control-Allow-Origin': true,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    if (provider === 'proxy') {
      this.props.history.push('/auth/local');
    }
    else {
      this.props.setGlobalMessage('Authenticating', 'warning');
      axios.get(`/auth/${provider}`, {
        header: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': '*'
        }
      })
      .then(res => {
        this.props.setGlobalMessage('Authentication Successful');
        this.setMessageTimeout(2000);
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      });
    }
  }

  render () {
    return (
      <div className="card w-75 mx-auto my-5">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <p className="card-text">
            <img src={provider1Logo} className="providerLogo" onClick={() => this.providerLogin('github')} alt='Github Login' />
            <img src={provider2Logo} className="providerLogo" onClick={() => this.providerLogin('google')} alt='Google Login' />
            <span className="providerSpan" title='Simulate Login'>
              <FontAwesomeIcon icon={faUserSecret} onClick={() => this.providerLogin('proxy')} />
            </span>
          </p>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGlobalMessage: (msg, type) => dispatch(actions.setGlobalMessage(msg, type)),
    unsetGlobalMessage: () => dispatch(actions.unsetGlobalMessage()),
  };
}

export default connect(null, mapDispatchToProps)(Login);
