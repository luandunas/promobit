import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './componentes/App';
import reportWebVitals from './reportWebVitals';
import { MovieDetails, Movies } from './componentes/Api';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="movie/:id" element={<MovieDetails />}>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
