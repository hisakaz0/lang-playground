import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import PlayGround from './PlayGround';



ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path="/sh" component={PlayGround} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
