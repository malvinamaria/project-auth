import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import user from 'reducers/user';
import { API_URL } from 'utils/urls';

// send creadentials to the backend, we need to register a user

export const Login = () => {
  // we need username and password
  const [username, setUsername] = useState(''); // we need to store the username in the state
  const [password, setPassword] = useState(''); // we need to store the password in the state
  const [mode, setMode] = useState('login'); // we need to store the mode in the state
  const dispatch = useDispatch(); // dispatch actions to the store
  const accessToken = useSelector((store) => store.user.accessToken); // we need to store the accessToken in the state
  const navigate = useNavigate(); // we need to navigate to the next page
  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken]);

  const onFormSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }), // we need to send the username and password to the backend
    };
    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        // look in the Postman, do POST request with http://localhost:8000/login and send username and password that is existing in the database
        if (data.success) {
          console.log(data);
          dispatch(user.actions.setAccessToken(data.response.accessToken));
          dispatch(user.actions.setUsername(data.response.username));
          dispatch(user.actions.setUserId(data.response.id));
          dispatch(user.actions.setError(null)); //http://localhost:8080/login check the postman when we send the incorrect password, you will see where is the message
        } else {
          dispatch(user.actions.setAccessToken(null));
          dispatch(user.actions.setUsername(null));
          dispatch(user.actions.setUserId(null));
          dispatch(user.actions.setError(data.response));
        }
      });
  };
  return (
    <>
      <label htmlFor="register">Register</label>
      <input
        type="radio"
        id="register"
        checked={mode === 'register'}
        onChange={() => setMode('register')}
      />
      <label htmlFor="login">Login</label>
      <input
        type="radio"
        id="login"
        checked={mode === 'login'}
        onChange={() => setMode('login')}
      />
      <form onSubmit={onFormSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
