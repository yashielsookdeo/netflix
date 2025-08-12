import React from 'react';
import { render } from 'react-dom';
import 'normalize.css';
import { GlobalStyles } from './global-styles';
import { App } from './app';
import { cognitoAuth } from './lib/cognito';
import { CognitoContext } from './context/cognito';

render(
  <React.StrictMode>
    <CognitoContext.Provider value={{ cognitoAuth }}>
      <GlobalStyles />
      <App />
    </CognitoContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
