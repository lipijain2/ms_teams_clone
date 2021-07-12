import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatApp from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChatApp />, document.getElementById('root'));

serviceWorker.unregister();
