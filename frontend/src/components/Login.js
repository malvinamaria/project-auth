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
      <div className="bg-yellow-300 min-h-screen flex flex-col items-center justify-center">
        <h1 className="py-10 text-3xl text-center font-medium mb-8">
          Login or Register for secrets! 🤫
        </h1>

        <div className="flex mb-10">
          <label
            htmlFor="register"
            className="ml-2 text-sm font-large text-gray-900 dark:text-grey-900"
          >
            Register
          </label>
          <div className="flex items-center mr-4">
            <input
              className="w-7 h-4"
              type="radio"
              id="register"
              checked={mode === 'register'}
              onChange={() => setMode('register')}
            />
          </div>

          <label
            htmlFor="login"
            className="ml-2 text-sm font-large text-gray-900 dark:text-gray-900"
          >
            Login
          </label>
          <div className="flex items-center">
            <input
              className="w-7 h-4"
              type="radio"
              id="login"
              checked={mode === 'login'}
              onChange={() => setMode('login')}
            />
          </div>
        </div>

        <form
          className=" px-4 mb-0 max-w-3xl mx-auto space-y-4"
          onSubmit={onFormSubmit}
        >
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="text"
            required
            className="w-full border rounded border-gray-200 mb-2 px-3 py-3 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password" className="mt-20">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded border-gray-200 mb-2 px-3 py-3 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded-full bg-pink-300 hover:bg-green-200 py-2 px-4 font-bold text-black w-full"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
