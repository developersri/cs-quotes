import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import Header from './components/Header/Header';
import Login from './containers/Login/Login';
import Vote from './containers/Vote/Vote';
import Message from './components/Message/Message';

function App(props) {
  return (
    <div className="App">
      <Header />
      <Switch>
        {props.authToken != null ? null : <Route path="/auth" exact component={Login} />}
        <Route path="/vote" exact component={Vote} />
        <Redirect to="/vote" />
      </Switch>
      <Message />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.token,
  }
}

export default connect(mapStateToProps)(App);
