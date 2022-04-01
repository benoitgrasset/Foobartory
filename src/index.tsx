import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
  }
})

const params = {
  foo: 0,
  bar: 0,
  foobar: 0
}

export const nbMaxRobots = 12;

export const robotInit = {
  time: 0,
  timeMax: 0,
  lastAction: undefined
};

export type FooBarToryParams = typeof params

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App params={params} nbRobots={2} />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
