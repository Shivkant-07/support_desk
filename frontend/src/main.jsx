import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Clear any old permanent localStorage logins so each session starts fresh from Login
try {
  localStorage.removeItem('supportdesk_token');
  localStorage.removeItem('supportdesk_user');
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
