import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('React version:', React.version);
console.log('Initializing application...');

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Application rendered successfully');
} else {
  console.error('Root element not found, creating one');
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  
  ReactDOM.createRoot(newRoot).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}