import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import secrets from 'reducers/secrets';
import user from 'reducers/user';

// here wew ill fetch secrets

export const Main = () => {
  // establish conection to store and dispatch actions
  const secretsItems = useSelector((store) => store.secrets.items);
  const dispatch = useDispatch(); // dispatch actions to the store
  const accessToken = useSelector((store) => store.user.accessToken);
  const username = useSelector((store) => store.user.username);
  const navigate = useNavigate(); // we need to navigate to the next page
  //useEffect to get secrets from backend
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken]);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    };
    fetch('API_URL("secrets")', options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(secrets.actions.setError(null));
          dispatch(secrets.actions.setItems(data.response));
        } else {
          dispatch(secrets.actions.setError(response));
          dispatch(secrets.actions.setItems([]));
        }
      });
  }, []);

  const onLogoutButtonClick = () => {
    dispatch(user.actions.setAccessToken(null));
    dispatch(user.actions.setUsername(null));
    dispatch(user.actions.setUserId(null));
    dispatch(user.actions.setError(null));
    dispatch(thoughts.actions.setItems([]));
  };

  return (
    <main>
      <button type="button" onClick={onLogoutButtonClick}>
        LOGOUT
      </button>
      {username ? <h1>This are the secrets of {username} </h1> : ''}
      {secretsItems.map((item) => {
        return (
          <div key={item._id}>
            <h2>{item.message}</h2>
            <p>{item.createdAt}</p>
          </div>
        );
      })}
    </main>
  );
};
