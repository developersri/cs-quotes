import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import Login from './containers/Login/Login';
import Vote from './containers/Vote/Vote';
import Message from './components/Message/Message';

function App() {
  return (
    <div className="App">
      <Switch>
        {/*<Route path="/auth" exact component={Login} />*/}
        <Route path="/vote" exact component={Vote} />
        <Redirect to="/vote" />
      </Switch>
      <Message />
    </div>
  );
}

export default App;
