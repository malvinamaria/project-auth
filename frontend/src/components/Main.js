import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// here wew ill fetch secrets

export const Main = () => {
  // establish conection to store and dispatch actions
  const secretsItems = useSelector((store) => store.secrets.items);
  const dispatch = useDispatch(); // dispatch actions to the store
  //useEffect to get secrets from backend
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch('API_URL("secrets")', options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <main>
      <h1>Home kkkk</h1>
    </main>
  );
};
