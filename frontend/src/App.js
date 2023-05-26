import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Login } from './components/Login';
import { Main } from './components/Main';
import { NotFound } from './components/NotFound';
import user from 'reducers/user';
import secrets from 'reducers/secrets';
import { Provider } from 'react-redux';

export const App = () => {
  const reducer = combineReducers({
    user: user.reducer,
    secrets: secrets.reducer,
  });
  const store = configureStore({ reducer });
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route path="/" element={<Main />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
};
