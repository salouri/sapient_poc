import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './components/navBar';
import Create from './contents/create';
import List from './contents/list';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <div className='App'>
          <header className='App-header'>
            Sapient SPA Client...
          </header>
          <Navigation />

          <Switch>
            <Route exact path='/' component={Create} />
            <Route path='/list' component={List} />
          </Switch>
        </div>
      </Router>
    </React.StrictMode>
  );
}

export default App;
