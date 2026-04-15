import React from 'react';
import ReactDOM from 'react-dom/client';

import '@weave/wv/css/wv.css';
import '@weave/wv/css/common.css';
import './index.css';
import './styles/site.css';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);