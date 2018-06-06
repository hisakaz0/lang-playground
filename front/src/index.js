import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import PlayGround from './PlayGround';
import langList from './lang';

const validLangRoute =
  "/lang/:lang" +
  "(" + langList.map((l) => { return l.name; }).join("|") + ")";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App} />
      <Route exact path={validLangRoute} component={PlayGround} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
