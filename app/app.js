import 'babel-polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Main from './components/main';

import './styles/main.scss';

render(<Main />, document.getElementById('app'));
