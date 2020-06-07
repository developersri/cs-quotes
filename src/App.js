import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import Header from './components/Header/Header';
import LoginAuth from './containers/LoginAuth/LoginAuth';
import Login from './containers/Login/Login';
import Vote from './containers/Vote/Vote';
import Message from './components/Message/Message';
import * as actions from './store/actions/index';

class App extends Component {
  componentWillMount () {
    let token = localStorage.getItem('token');
    let email = localStorage.getItem('email');
    if (token != null) {
      this.props.authSuccess(token, email);
    }
  }

  render () {
    return (
      <div className="App">
        <Header />
        <Switch>
          {this.props.authToken != null ? null : <Route path="/auth/:provider" component={LoginAuth} />}
          {this.props.authToken != null ? null : <Route path="/auth" exact component={Login} />}
          <Route path="/vote" exact component={Vote} />
          <Redirect to="/vote" />
        </Switch>
        <Message />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.token,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authSuccess: (token, email) => dispatch(actions.authSuccess(token, email)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
