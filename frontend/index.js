// src/index.js

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';   // глобальные стили
import './i18n';        // инициализация i18next
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations…</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);